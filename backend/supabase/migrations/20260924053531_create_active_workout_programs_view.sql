SET local check_function_bodies = off;

DROP FUNCTION "public"."insert_program_from_json"(uuid, text, text, jsonb);

ALTER TABLE "public"."users"
  DROP COLUMN "current_streak";

ALTER TABLE "public"."workout_programs"
  ADD COLUMN "deleted_at" timestamp WITH time zone;

CREATE VIEW "public"."active_workout_programs" WITH (security_invoker=on) AS  SELECT id,
    user_id,
    program_name,
    description,
    program_structure,
    created_at,
    updated_at,
    deleted_at
   FROM public.workout_programs
  WHERE (deleted_at IS NULL);

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."active_workout_programs" TO "anon", "authenticated", "postgres", "service_role";
