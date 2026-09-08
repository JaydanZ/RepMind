from typing import List, Dict, Any
from ..Database.supabase import supabase
from ..models.programs import Workout, Exercise

def _convert_workouts_to_json(workouts: List[Workout]) -> List[Dict[str, Any]]:
    result = []
    for workout in workouts:
        workout_dict = {
            "day": workout.day,
            "focus": workout.focus,
            "exercises": _convert_exercises_to_json(workout.exercises)
        }
        result.append(workout_dict)
    return result


def _convert_exercises_to_json(exercises: List[Exercise]) -> List[Dict[str, Any]]:
    result = []
    for exercise in exercises:
        exercise_dict = {
            "exercise_tip": exercise.exercise_tip,
            "name": exercise.name,
            "sets": exercise.sets,
            "reps": exercise.reps
        }
        result.append(exercise_dict)
    return result


def get_program_by_id(program_id: str) -> Dict[str, Any]:
    try:
        response = supabase.table("workout_programs").select("*").eq("id", program_id).execute()
        if response.data and len(response.data) > 0:
            return {
                "success": True,
                "data": response.data[0]
            }
        return {"success": False, "error": "Program not found"}
    except Exception as e:
        return {"success": False, "error": str(e)}


# def get_user_programs(user_id: str) -> List[Dict[str, Any]]:
#     """Retrieve all programs for a specific user."""
#     try:
#         response = supabase.table("workout_programs").select("*").eq("user_id", user_id).execute()
#         return {
#             "success": True,
#             "data": response.data if response.data else []
#         }
#     except Exception as e:
#         return {"success": False, "error": str(e)}


def update_program(program_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
    """Update a program with the provided fields."""
    try:
        response = supabase.table("workout_programs").update(updates).eq("id", program_id).execute()
        return {
            "success": True,
            "message": "Program updated successfully"
        }
    except Exception as e:
        return {"success": False, "error": str(e)}


def delete_program(program_id: str) -> Dict[str, Any]:
    """Delete a program and all its associated data."""
    try:
        # Delete related records first (cascading deletes will handle this)
        supabase.table("program_exercises").delete().eq("program_day_id", program_id).execute()
        supabase.table("program_days").delete().eq("program_id", program_id).execute()
        
        response = supabase.table("workout_programs").delete().eq("id", program_id).execute()
        return {
            "success": True,
            "message": "Program deleted successfully"
        }
    except Exception as e:
        return {"success": False, "error": str(e)}
