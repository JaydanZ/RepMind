ALTER TABLE "public"."completed_workouts"
  ADD COLUMN "day" text,
  ADD COLUMN "focus" text;

ALTER TABLE "public"."exercise_set_logs"
  ADD COLUMN "exercise_order" integer,
  ADD COLUMN "notes" text,
  ADD COLUMN "weight_unit" text NOT NULL DEFAULT 'lb'::text,
  ADD CONSTRAINT "exercise_set_logs_weight_unit_check" CHECK (("weight_unit" = ANY (ARRAY['lb'::text, 'kg'::text])));

CREATE INDEX "idx_exercise_set_logs_name" ON "public"."exercise_set_logs" USING btree ("name");

CREATE OR REPLACE FUNCTION "public"."log_workout"(
    "p_user_id" uuid,
    "p_program_id" uuid,
    "p_date" date,
    "p_day" text,
    "p_focus" text,
    "p_is_completed" boolean,
    "p_sets" jsonb
) RETURNS uuid
    LANGUAGE plpgsql
    SET search_path TO ''
    AS $$
DECLARE
    v_workout_id uuid;
BEGIN
    INSERT INTO public.completed_workouts (user_id, program_id, completed_at, day, focus, is_completed)
    VALUES (p_user_id, p_program_id, p_date, p_day, p_focus, p_is_completed)
    ON CONFLICT (user_id, completed_at) DO UPDATE
        SET program_id = EXCLUDED.program_id,
            day = EXCLUDED.day,
            focus = EXCLUDED.focus,
            is_completed = EXCLUDED.is_completed
    RETURNING id INTO v_workout_id;

    DELETE FROM public.exercise_set_logs WHERE completed_workout_id = v_workout_id;

    INSERT INTO public.exercise_set_logs
        (completed_workout_id, name, exercise_order, set_number, reps, weight, weight_unit, notes)
    SELECT v_workout_id, s.name, s.exercise_order, s.set_number, s.reps, s.weight, s.weight_unit, s.notes
    FROM jsonb_to_recordset(p_sets) AS s(
        name text,
        exercise_order integer,
        set_number integer,
        reps integer,
        weight numeric,
        weight_unit text,
        notes text
    );

    RETURN v_workout_id;
END;
$$;

ALTER FUNCTION "public"."log_workout"(uuid, uuid, date, text, text, boolean, jsonb) OWNER TO "postgres";

REVOKE ALL ON FUNCTION "public"."log_workout"(uuid, uuid, date, text, text, boolean, jsonb) FROM PUBLIC, "anon", "authenticated";
GRANT EXECUTE ON FUNCTION "public"."log_workout"(uuid, uuid, date, text, text, boolean, jsonb) TO "service_role";
