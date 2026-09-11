CREATE TABLE IF NOT EXISTS "public"."completed_workouts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "program_id" "uuid",
    "program_day_id" "uuid",
    "completed_at" "date" DEFAULT CURRENT_DATE NOT NULL,
    "is_completed" boolean DEFAULT false,
    "notes" "text"
);

CREATE TABLE IF NOT EXISTS "public"."exercise_set_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "completed_workout_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "set_number" integer NOT NULL,
    "weight" numeric(10,2),
    "reps" integer
);

CREATE TABLE IF NOT EXISTS "public"."personal_records" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "weight" numeric(10,2),
    "reps" integer,
    "achieved_at" "date" DEFAULT CURRENT_DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS "public"."program_days" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "program_id" "uuid" NOT NULL,
    "day" "text" NOT NULL,
    "focus" "text" NOT NULL
);

CREATE TABLE IF NOT EXISTS "public"."program_exercises" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "program_day_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "exercise_tip" "text",
    "sets" integer NOT NULL,
    "order_index" integer NOT NULL
);

CREATE TABLE IF NOT EXISTS "public"."workout_programs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "program_name" "text" NOT NULL,
    "description" "text",
    "program_structure" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

CREATE TABLE IF NOT EXISTS "public"."workout_streaks" (
    "user_id" "uuid" NOT NULL,
    "current_streak" integer DEFAULT 0 NOT NULL,
    "longest_streak" integer DEFAULT 0 NOT NULL,
    "last_workout_date" "date",
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE ONLY "public"."completed_workouts"
    ADD CONSTRAINT "completed_workouts_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."completed_workouts"
    ADD CONSTRAINT "completed_workouts_user_id_completed_at_key" UNIQUE ("user_id", "completed_at");
ALTER TABLE ONLY "public"."exercise_set_logs"
    ADD CONSTRAINT "exercise_set_logs_completed_workout_id_name_set_number_key" UNIQUE ("completed_workout_id", "name", "set_number");
ALTER TABLE ONLY "public"."exercise_set_logs"
    ADD CONSTRAINT "exercise_set_logs_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."personal_records"
    ADD CONSTRAINT "personal_records_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."personal_records"
    ADD CONSTRAINT "personal_records_user_id_name_key" UNIQUE ("user_id", "name");
ALTER TABLE ONLY "public"."program_days"
    ADD CONSTRAINT "program_days_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."program_days"
    ADD CONSTRAINT "program_days_program_id_day_key" UNIQUE ("program_id", "day");
ALTER TABLE ONLY "public"."program_exercises"
    ADD CONSTRAINT "program_exercises_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."program_exercises"
    ADD CONSTRAINT "program_exercises_program_day_id_order_index_key" UNIQUE ("program_day_id", "order_index");
ALTER TABLE ONLY "public"."workout_programs"
    ADD CONSTRAINT "workout_programs_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."workout_streaks"
    ADD CONSTRAINT "workout_streaks_pkey" PRIMARY KEY ("user_id");


ALTER TABLE "public"."completed_workouts" OWNER TO "postgres";
ALTER TABLE "public"."exercise_set_logs" OWNER TO "postgres";
ALTER TABLE "public"."personal_records" OWNER TO "postgres";
ALTER TABLE "public"."program_days" OWNER TO "postgres";
ALTER TABLE "public"."program_exercises" OWNER TO "postgres";
ALTER TABLE "public"."workout_programs" OWNER TO "postgres";
ALTER TABLE "public"."workout_streaks" OWNER TO "postgres";


CREATE INDEX "idx_completed_workouts_user_date" ON "public"."completed_workouts" USING "btree" ("user_id", "completed_at");
CREATE INDEX "idx_exercise_set_logs_workout" ON "public"."exercise_set_logs" USING "btree" ("completed_workout_id");
CREATE INDEX "idx_personal_records_user" ON "public"."personal_records" USING "btree" ("user_id");
CREATE INDEX "idx_program_days_program" ON "public"."program_days" USING "btree" ("program_id");
CREATE INDEX "idx_program_exercises_day" ON "public"."program_exercises" USING "btree" ("program_day_id");
CREATE INDEX "idx_users_active_program" ON "public"."users" USING "btree" ("active_program");
CREATE INDEX "idx_workout_programs_name" ON "public"."workout_programs" USING "btree" ("program_name");
CREATE INDEX "idx_workout_programs_user" ON "public"."workout_programs" USING "btree" ("user_id");


ALTER TABLE ONLY "public"."completed_workouts"
    ADD CONSTRAINT "completed_workouts_program_day_id_fkey" FOREIGN KEY ("program_day_id") REFERENCES "public"."program_days"("id") ON DELETE SET NULL;
ALTER TABLE ONLY "public"."completed_workouts"
    ADD CONSTRAINT "completed_workouts_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "public"."workout_programs"("id") ON DELETE SET NULL;
ALTER TABLE ONLY "public"."completed_workouts"
    ADD CONSTRAINT "completed_workouts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;
ALTER TABLE ONLY "public"."exercise_set_logs"
    ADD CONSTRAINT "exercise_set_logs_completed_workout_id_fkey" FOREIGN KEY ("completed_workout_id") REFERENCES "public"."completed_workouts"("id") ON DELETE CASCADE;
ALTER TABLE ONLY "public"."personal_records"
    ADD CONSTRAINT "personal_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;
ALTER TABLE ONLY "public"."program_days"
    ADD CONSTRAINT "program_days_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "public"."workout_programs"("id") ON DELETE CASCADE;
ALTER TABLE ONLY "public"."program_exercises"
    ADD CONSTRAINT "program_exercises_program_day_id_fkey" FOREIGN KEY ("program_day_id") REFERENCES "public"."program_days"("id") ON DELETE CASCADE;
ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_active_program_fkey" FOREIGN KEY ("active_program") REFERENCES "public"."workout_programs"("id") ON DELETE SET NULL;
ALTER TABLE ONLY "public"."workout_programs"
    ADD CONSTRAINT "workout_programs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;
ALTER TABLE ONLY "public"."workout_streaks"
    ADD CONSTRAINT "workout_streaks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;


CREATE POLICY "Users can manage their own completed workouts" ON "public"."completed_workouts" USING (("auth"."uid"() = "user_id"));
CREATE POLICY "Users can manage their own exercise set logs" ON "public"."exercise_set_logs" USING ((EXISTS ( SELECT 1
   FROM "public"."completed_workouts"
  WHERE (("completed_workouts"."id" = "exercise_set_logs"."completed_workout_id") AND ("completed_workouts"."user_id" = "auth"."uid"())))));
CREATE POLICY "Users can manage their own personal records" ON "public"."personal_records" USING (("auth"."uid"() = "user_id"));
CREATE POLICY "Users can manage their own program days" ON "public"."program_days" USING ((EXISTS ( SELECT 1
   FROM "public"."workout_programs"
  WHERE (("workout_programs"."id" = "program_days"."program_id") AND ("workout_programs"."user_id" = "auth"."uid"())))));
CREATE POLICY "Users can manage their own program exercises" ON "public"."program_exercises" USING ((EXISTS ( SELECT 1
   FROM ("public"."program_days"
     JOIN "public"."workout_programs" ON (("workout_programs"."id" = "program_days"."program_id")))
  WHERE (("program_days"."id" = "program_exercises"."program_day_id") AND ("workout_programs"."user_id" = "auth"."uid"())))));
CREATE POLICY "Users can manage their own workout programs" ON "public"."workout_programs" USING (("auth"."uid"() = "user_id"));
CREATE POLICY "Users can manage their own workout streaks" ON "public"."workout_streaks" USING (("auth"."uid"() = "user_id"));


ALTER TABLE "public"."completed_workouts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."exercise_set_logs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."personal_records" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."program_days" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."program_exercises" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."workout_programs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."workout_streaks" ENABLE ROW LEVEL SECURITY;


GRANT ALL ON TABLE "public"."completed_workouts" TO "anon";
GRANT ALL ON TABLE "public"."completed_workouts" TO "authenticated";
GRANT ALL ON TABLE "public"."completed_workouts" TO "service_role";

GRANT ALL ON TABLE "public"."exercise_set_logs" TO "anon";
GRANT ALL ON TABLE "public"."exercise_set_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."exercise_set_logs" TO "service_role";

GRANT ALL ON TABLE "public"."personal_records" TO "anon";
GRANT ALL ON TABLE "public"."personal_records" TO "authenticated";
GRANT ALL ON TABLE "public"."personal_records" TO "service_role";

GRANT ALL ON TABLE "public"."program_days" TO "anon";
GRANT ALL ON TABLE "public"."program_days" TO "authenticated";
GRANT ALL ON TABLE "public"."program_days" TO "service_role";

GRANT ALL ON TABLE "public"."program_exercises" TO "anon";
GRANT ALL ON TABLE "public"."program_exercises" TO "authenticated";
GRANT ALL ON TABLE "public"."program_exercises" TO "service_role";

GRANT ALL ON TABLE "public"."workout_programs" TO "anon";
GRANT ALL ON TABLE "public"."workout_programs" TO "authenticated";
GRANT ALL ON TABLE "public"."workout_programs" TO "service_role";

GRANT ALL ON TABLE "public"."workout_streaks" TO "anon";
GRANT ALL ON TABLE "public"."workout_streaks" TO "authenticated";
GRANT ALL ON TABLE "public"."workout_streaks" TO "service_role";