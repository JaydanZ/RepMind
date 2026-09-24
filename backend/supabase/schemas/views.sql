CREATE VIEW active_workout_programs with (security_invoker = on) as
    select *
    from workout_programs
    where deleted_at is NULL;