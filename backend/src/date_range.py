from dataclasses import dataclass
from datetime import date


@dataclass
class DateRange:
    start: date
    end: date
    id: int


def date_to_string(date_range: DateRange):
    return {
        "start": date_range.start.__str__(),
        "end": date_range.end.__str__(),
        "id": date_range.id
    }
