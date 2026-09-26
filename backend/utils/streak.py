from datetime import date, timedelta

DAY_NAMES = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

def get_weekday(day: str) -> int | None:
    normalized = day.strip().lower()
    if not normalized:
        return None
    for index, name in enumerate(DAY_NAMES):
        if normalized.startswith(name) or name.startswith(normalized):
            return index
    return None

def scheduled_weekdays(program_structure: list[dict]) -> set[int]:
    weekdays = set()
    for workout in program_structure or []:
        weekday = get_weekday(str(workout.get("day", "")))
        if weekday is not None:
            weekdays.add(weekday)
    return weekdays

def compute_streak(current: int, last_date: date | None, today: date, weekdays: set[int]) -> int:
    if last_date is None:
        return 1
    if last_date >= today:
        return max(current, 1)

    day = last_date + timedelta(days=1)
    while day < today:
        if not weekdays or day.weekday() in weekdays:
            return 1
        day += timedelta(days=1)

    return current + 1
