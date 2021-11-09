from datetime import date

import pytest
import pandas as pd
from pandas import Timestamp

from backend.src.view_money import ViewMoney


def test_timestamp_to_date():
    timestamp: Timestamp = Timestamp(year=2020, month=1, day=1)
    expected: date = date(2020, 1, 1)

    actual: date = ViewMoney.timestamp_to_date(timestamp)

    assert actual == expected


def test_last_day_of_month():
    assert ViewMoney.last_day_of_month(date(2020, 1, 5)) == date(2020, 1, 31)
    assert ViewMoney.last_day_of_month(date(2020, 2, 5)) == date(2020, 2, 29)
    assert ViewMoney.last_day_of_month(date(2021, 2, 5)) == date(2021, 2, 28)
    assert ViewMoney.last_day_of_month(date(2020, 3, 5)) == date(2020, 3, 31)
    assert ViewMoney.last_day_of_month(date(2020, 4, 5)) == date(2020, 4, 30)
    assert ViewMoney.last_day_of_month(date(2020, 5, 5)) == date(2020, 5, 31)
    assert ViewMoney.last_day_of_month(date(2020, 6, 5)) == date(2020, 6, 30)
    assert ViewMoney.last_day_of_month(date(2020, 7, 5)) == date(2020, 7, 31)
    assert ViewMoney.last_day_of_month(date(2020, 8, 5)) == date(2020, 8, 31)
    assert ViewMoney.last_day_of_month(date(2020, 9, 5)) == date(2020, 9, 30)
    assert ViewMoney.last_day_of_month(date(2020, 10, 5)) == date(2020, 10, 31)
    assert ViewMoney.last_day_of_month(date(2020, 11, 5)) == date(2020, 11, 30)
    assert ViewMoney.last_day_of_month(date(2020, 12, 5)) == date(2020, 12, 31)


def test_prev_financial_year():
    assert ViewMoney.prev_financial_year(date(2020, 5, 1)) == date(2020, 4, 15)
    assert ViewMoney.prev_financial_year(date(2020, 12, 1)) == date(2020, 4, 15)
    assert ViewMoney.prev_financial_year(date(2020, 2, 1)) == date(2019, 4, 15)


def test_next_financial_year():
    assert ViewMoney.next_financial_year(date(2020, 5, 1)) == date(2021, 4, 15)
    assert ViewMoney.next_financial_year(date(2020, 12, 1)) == date(2021, 4, 15)
    assert ViewMoney.next_financial_year(date(2020, 2, 1)) == date(2020, 4, 15)
    assert ViewMoney.next_financial_year(date(2020, 4, 13)) == date(2021, 4, 15)
