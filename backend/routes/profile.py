from fastapi import APIRouter, Header
from typing import Annotated
from fastapi.security import OAuth2PasswordBearer

profile_router = APIRouter(
    prefix="/profile",
    tags=['profile']
)

@profile_router.get("/",status_code=200)
async def get_profile_data():
    ## TEST RESPONSE
    profile_data = {
        "username": "test",
        "email": "exampleemail@test.com",
        "programs": None,
        "active_program": {
            "name": "5-Day Push/Pull/Legs",
            "is_active_program": True,
            "program_structure": [
                {
                    "day": "Monday",
                    "focus": "Push Day",
                    "exercises": [
                        {
                            "name": "Barbell Bench Press",
                            "sets": 4,
                            "reps": 8,
                            "exercise_tip": "Keep your shoulder blades retracted and squeeze your glutes throughout the set"
                        },
                        {
                            "name": "Overhead Press",
                            "sets": 3,
                            "reps": 10,
                            "exercise_tip": "Brace your core and avoid arching your lower back under heavy loads"
                        },
                        {
                            "name": "Cable Fly",
                            "sets": 3,
                            "reps": 12,
                            "exercise_tip": "Focus on a full contraction at peak chest tension"
                        }
                    ]
                },
                {
                    "day": "Tuesday",
                    "focus": "Pull Day",
                    "exercises": [
                        {
                            "name": "Deadlift",
                            "sets": 4,
                            "reps": 6,
                            "exercise_tip": "Keep a neutral spine and pull yourself up through the bar"
                        },
                        {
                            "name": "Bent-Over Row",
                            "sets": 3,
                            "reps": 10,
                            "exercise_tip": "Lead with your elbows and avoid swinging the bar"
                        }
                    ]
                },
                {
                    "day": "Thursday",
                    "focus": "Leg Day",
                    "exercises": [
                        {
                            "name": "Back Squat",
                            "sets": 4,
                            "reps": 8,
                            "exercise_tip": "Drive through your mid-foot and keep your chest tall"
                        },
                        {
                            "name": "Romanian Deadlift",
                            "sets": 3,
                            "reps": 10,
                            "exercise_tip": "Hinge at the hips and feel a deep stretch in the hamstrings"
                        }
                    ]
                }
            ],
            "last_updated": "2026-08-20T10:30:00Z"
        },
        "workout_streak_tracker": None
    }
    return profile_data