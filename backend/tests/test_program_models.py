import pytest
from pydantic import ValidationError

from backend.models.programs import ProgramImport
from backend.models.programGeneration import ProgramResult
from backend.models.programRules import (
    MAX_EXERCISES_PER_DAY,
    MAX_PROGRAM_NAME_LENGTH,
    MAX_FOCUS_LENGTH,
    MAX_EXERCISE_NAME_LENGTH,
    MAX_SETS_OR_REPS,
    WEEKDAYS,
)


def exercise(**overrides):
    return {"name": "Squat", "sets": 5, "reps": 5, "exercise_tip": "", **overrides}


def workout(day="Monday", **overrides):
    return {"day": day, "focus": "Lower", "exercises": [exercise()], **overrides}


def program(**overrides):
    return {"program_name": "Upper / Lower", "program_structure": [workout()], **overrides}


def test_accepts_a_valid_program_and_trims_text():
    saved = ProgramImport(**program(
        program_name="  Upper / Lower  ",
        program_structure=[workout(focus=" Lower ", exercises=[exercise(name=" Squat ")])],
    ))

    assert saved.program_name == "Upper / Lower"
    assert saved.program_structure[0].focus == "Lower"
    assert saved.program_structure[0].exercises[0].name == "Squat"


def test_accepts_every_weekday_once():
    ProgramImport(**program(program_structure=[workout(day) for day in WEEKDAYS]))


@pytest.mark.parametrize("invalid", [
    {"program_name": "   "},
    {"program_name": "x" * (MAX_PROGRAM_NAME_LENGTH + 1)},
    {"program_structure": []},
    {"program_structure": [workout(focus="")]},
    {"program_structure": [workout(focus="x" * (MAX_FOCUS_LENGTH + 1))]},
    {"program_structure": [workout(day="Funday")]},
    {"program_structure": [workout(day="monday")]},
    {"program_structure": [workout(exercises=[])]},
    {"program_structure": [workout(exercises=[exercise()] * (MAX_EXERCISES_PER_DAY + 1))]},
    {"program_structure": [workout(exercises=[exercise(name=" ")])]},
    {"program_structure": [workout(exercises=[exercise(name="x" * (MAX_EXERCISE_NAME_LENGTH + 1))])]},
    {"program_structure": [workout(exercises=[exercise(sets=0)])]},
    {"program_structure": [workout(exercises=[exercise(reps=MAX_SETS_OR_REPS + 1)])]},
    {"program_structure": [workout(exercises=[exercise(exercise_tip="x" * 501)])]},
], ids=[
    "blank name", "long name", "no days", "blank focus", "long focus", "unknown day",
    "lowercase day", "no exercises", "too many exercises", "blank exercise", "long exercise name",
    "zero sets", "too many reps", "long tip",
])
def test_rejects_invalid_programs(invalid):
    with pytest.raises(ValidationError):
        ProgramImport(**program(**invalid))


def test_rejects_the_same_weekday_twice():
    with pytest.raises(ValidationError, match="Each weekday can only be scheduled once"):
        ProgramImport(**program(program_structure=[workout("Monday"), workout("Monday")]))


def test_generated_programs_follow_the_same_rules():
    valid = {"name": "Upper / Lower", "program_structure": [workout()], "program_tips_and_goals": []}
    ProgramResult(**valid)

    with pytest.raises(ValidationError):
        ProgramResult(**{**valid, "program_structure": [workout("Monday"), workout("Monday")]})
    with pytest.raises(ValidationError):
        ProgramResult(**{**valid, "program_structure": [
            workout(exercises=[exercise(name="Barbell Romanian Deadlift with Pause")])
        ]})
