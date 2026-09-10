from typing import List, Dict, Any
from supabase import Client
from ..models.programs import ProgramImport, Exercise, Workout
from .supabase import supabase
from .users import find_user_by_email
from ..utils.programs import _convert_workouts_to_json
import ast


def insert_program_from_import(program_import: ProgramImport, current_user_id) -> Dict[str, Any]:
    try:
        # Convert Pydantic models to dictionaries for JSON serialization
        response = find_user_by_email(current_user_id)
        convertedResponse = ast.literal_eval(str(response))
        
        id_key, id_value = next(iter(convertedResponse.items()))

        program_data = {
            "program_name": program_import.program_name,
            "description": None,  # Could be added later if needed
            "program_structure": _convert_workouts_to_json(program_import.program_structure),
            "user_id": id_value
        }

        # Insert the program using Supabase
        insertResponse = supabase.table("workout_programs").insert(program_data).execute()
        convertedInsertResponse = ast.literal_eval(str(insertResponse.data[0]))

        program_id_key, program_id_value = next(iter(convertedInsertResponse.items()))
        
        program_id = program_id_value
        
        return {
            "success": True,
            "program_id": program_id,
            "message": f"Program '{program_import.program_name}' imported successfully"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": f"Failed to import program: {str(e)}"
        }
    
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


def get_user_programs(user_id: str):
    try:
        response = supabase.table("workout_programs").select("*").eq("user_id", user_id).execute()
        return {
            "success": True,
            "data": response.data if response.data else []
        }
    except Exception as e:
        return {"success": False, "error": str(e)}


def update_program(program_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
    try:
        response = supabase.table("workout_programs").update(updates).eq("id", program_id).execute()
        return {
            "success": True,
            "message": "Program updated successfully"
        }
    except Exception as e:
        return {"success": False, "error": str(e)}


def delete_program(program_id: str) -> Dict[str, Any]:
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
