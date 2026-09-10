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
