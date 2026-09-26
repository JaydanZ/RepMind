from datetime import date
from typing import Dict, Any
from ..models.workouts import WorkoutSubmission
from .supabase import supabase
import ast

def log_workout(user_id: str, submission: WorkoutSubmission) -> Dict[str, Any]:
    try:
        sets = [
            {
                "name": s.exercise_name,
                "exercise_order": s.exercise_order,
                "set_number": s.set_number,
                "reps": s.reps,
                "weight": str(s.weight) if s.weight is not None else None,
                "weight_unit": s.weight_unit,
                "notes": s.notes.strip() if s.notes and s.notes.strip() else None
            }
            for s in submission.sets
        ]
        response = supabase.rpc("log_workout", {
            "p_user_id": user_id,
            "p_program_id": submission.program_id,
            "p_date": submission.performed_on.isoformat(),
            "p_day": submission.day,
            "p_focus": submission.focus,
            "p_is_completed": submission.is_completed,
            "p_sets": sets
        }).execute()
        return {"success": True, "data": response.data}
    except Exception as e:
        return {"success": False, "error": str(e)}

def has_workout_on(user_id: str, on: date) -> bool:
    response = (
        supabase.table("completed_workouts")
        .select("id")
        .eq("user_id", user_id)
        .eq("completed_at", on.isoformat())
        .execute()
    )
    return bool(response.data)

def get_last_workout_date(user_id: str, before: date) -> date | None:
    response = (
        supabase.table("completed_workouts")
        .select("completed_at")
        .eq("user_id", user_id)
        .lt("completed_at", before.isoformat())
        .order("completed_at", desc=True)
        .limit(1)
        .execute()
    )
    if not response.data:
        return None
    data = ast.literal_eval(str(response.data))
    return date.fromisoformat(data[0]["completed_at"])

def get_previous_performance(user_id: str, names: list[str], before: date) -> Dict[str, Any]:
    try:
        response = (
            supabase.table("exercise_set_logs")
            .select("name, set_number, reps, weight, weight_unit, completed_workouts!inner(user_id, completed_at)")
            .in_("name", names)
            .eq("completed_workouts.user_id", user_id)
            .lt("completed_workouts.completed_at", before.isoformat())
            .execute()
        )
        data = ast.literal_eval(str(response.data))

        latest: Dict[str, Dict[str, Any]] = {}
        for row in data or []:
            performed_on = row["completed_workouts"]["completed_at"]
            entry = latest.get(row["name"])
            if entry is None or performed_on > entry["date"]:
                entry = {"date": performed_on, "sets": []}
                latest[row["name"]] = entry
            elif performed_on < entry["date"]:
                continue
            entry["sets"].append({
                "set_number": row["set_number"],
                "reps": row["reps"],
                "weight": float(row["weight"]) if row["weight"] is not None else None,
                "weight_unit": row["weight_unit"]
            })

        for entry in latest.values():
            entry["sets"].sort(key=lambda s: s["set_number"])

        return {"success": True, "data": latest}
    except Exception as e:
        return {"success": False, "error": str(e)}
