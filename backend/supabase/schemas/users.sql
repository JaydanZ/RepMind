CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "username" "text" NOT NULL,
    "email" "text" NOT NULL,
    "password" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."users" OWNER TO "postgres";
ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");
ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_username_key" UNIQUE ("username");


CREATE POLICY "Enable delete for service role" ON "public"."users" FOR DELETE TO "service_role" USING (true);
CREATE POLICY "Enable insert for service role" ON "public"."users" FOR INSERT TO "service_role" WITH CHECK (true);
CREATE POLICY "Enable read for service role" ON "public"."users" FOR SELECT TO "service_role" USING (true);
CREATE POLICY "Enable update for service role" ON "public"."users" FOR UPDATE TO "service_role" USING (true) WITH CHECK (true);


GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";