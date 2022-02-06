from datetime import date

import numpy as np
import pandas as pd
from dateutil.relativedelta import relativedelta
from pandas import Timestamp

from src.date_range import DateRange


class ViewMoney:

    def __init__(self, data_path: str):
        self.csv_path: str = f"{data_path}/data.csv"
        self.df: pd.DataFrame = pd.read_csv(self.csv_path, parse_dates=["date"])

    def get_unique_descriptions(self) -> list:
        """
        Reads data file and extracts unique descriptions to list
        """
        data = ["" if isinstance(x, float) and np.isnan(x) else x for x in self.df["description"].unique().tolist()]
        data = [x for x in data if x]
        data.sort()
        return data

    @staticmethod
    def timestamp_to_date(timestamp: Timestamp) -> date:
        return timestamp.to_pydatetime().date()

    @staticmethod
    def last_day_of_month(dt: date) -> date:
        next_month: date = dt + relativedelta(months=1)
        first_of_month: date = date(next_month.year, next_month.month, 1)
        return first_of_month - relativedelta(days=1)

    @staticmethod
    def centre_new_month(dt: date, months: int) -> date:
        new_date = dt + relativedelta(months=months)
        return date(new_date.year, new_date.month, 15)

    @staticmethod
    def prev_financial_year(dt: date) -> date:
        if 4 < dt.month <= 12:
            return date(dt.year, 4, 15)
        else:
            return date(dt.year - 1, 4, 15)

    @staticmethod
    def next_financial_year(dt: date) -> date:
        if 5 < dt.month <= 12:
            return date(dt.year + 1, 4, 15)
        elif 1 <= dt.month <= 3:
            return date(dt.year, 4, 15)
        else:
            return date(dt.year + 1, 4, 15)

    def get_months(self) -> list[DateRange]:
        first_transaction: date = ViewMoney.timestamp_to_date(self.df.iloc[0]["date"])
        last_transaction: date = ViewMoney.timestamp_to_date(self.df.iloc[-1]["date"])

        first_date: date = date(first_transaction.year, first_transaction.month, 1)
        end_date: date = ViewMoney.last_day_of_month(last_transaction)

        dates: list[DateRange] = [DateRange(first_date, ViewMoney.last_day_of_month(first_date), 0)]

        current_date: date = first_date + relativedelta(months=1)
        _id: int = 1

        while current_date < end_date:
            dates.append(DateRange(current_date, ViewMoney.last_day_of_month(current_date), _id))
            current_date += relativedelta(months=1)
            _id += 1

        return self.sort_dates(dates)

    def get_financial_months(self) -> list[DateRange]:
        incomes: list[date] = [ViewMoney.timestamp_to_date(x) for x in
                               self.df[(self.df["category"] == "Wages")]["date"].to_list()]
        incomes.sort()
        indexes: list[int] = self.df.index[(self.df["category"] == "Wages")].to_list()
        if indexes[0] > 0:
            incomes.insert(0, ViewMoney.centre_new_month(incomes[0], -1))
        if indexes[-1] < len(self.df) - 1:
            incomes.append(ViewMoney.centre_new_month(incomes[-1], 1))

        dates: list[DateRange] = []

        for i in range(len(incomes) - 1):
            dates.append(DateRange(incomes[i], incomes[i + 1] + relativedelta(days=-1), i))

        return self.sort_dates(dates)

    def get_years(self) -> list[DateRange]:
        first_transaction: date = ViewMoney.timestamp_to_date(self.df.iloc[0]["date"])
        last_transaction: date = ViewMoney.timestamp_to_date(self.df.iloc[-1]["date"])

        first_date: date = date(first_transaction.year, 1, 1)
        end_date: date = date(last_transaction.year, 12, 31)

        dates: list[DateRange] = [DateRange(first_date, date(first_date.year, 12, 31), 0)]

        current_date: date = first_date + relativedelta(years=1)
        _id: int = 1

        while current_date < end_date:
            dates.append(DateRange(current_date, date(current_date.year, 12, 31), _id))
            current_date += relativedelta(years=1)
            _id += 1

        return self.sort_dates(dates)

    def get_financial_years(self) -> list[DateRange]:
        first_date: date = ViewMoney.timestamp_to_date(self.df[(self.df["category"] == "Wages")].iloc[0]["date"])
        last_date: date = ViewMoney.timestamp_to_date(self.df[(self.df["category"] == "Wages")].iloc[-1]["date"])

        if first_date.month != 4:
            first_date = ViewMoney.prev_financial_year(first_date)
        if last_date.month != 4:
            last_date = ViewMoney.next_financial_year(last_date)

        current_date: date = ViewMoney.next_financial_year(first_date)
        dates: list[DateRange] = [DateRange(first_date, current_date, 0)]
        _id: int = 1

        while current_date.year < last_date.year:
            dates.append(DateRange(current_date, ViewMoney.next_financial_year(current_date), _id))
            current_date = ViewMoney.next_financial_year(current_date)
            _id += 1

        return self.sort_dates(dates)

    @staticmethod
    def sort_dates(dates: list[DateRange]) -> list[DateRange]:
        return sorted(dates, reverse=True, key=lambda d: d.start)

    def total_spending(self, start: date, end: date) -> int:
        df = self._data_in_date_range(start, end)
        return df[(df["outgoing"])]["value"].sum()

    def total_income(self, start: date, end: date) -> int:
        df = self._data_in_date_range(start, end)
        transfer_ = df[(df["outgoing"] != True) & (df["transaction_type"] != "Personal Transfer")]
        print(transfer_)
        return transfer_["value"].sum()

    def total_savings(self, start: date, end: date) -> int:
        df = self._data_in_date_range(start, end)
        return df[(df["outgoing"] != True) & (df["transaction_type"] == "Personal Transfer")]["value"].sum()

    def net_income(self, start: date, end: date) -> int:
        return self.total_income(start, end) - self.total_spending(start, end)

    @staticmethod
    def to_sterling(value: int) -> str:
        return f"£{value / 100:.2f}"

    def _data_in_date_range(self, start: date, end: date) -> pd.DataFrame:
        return self.df[(self.df["date"] >= np.datetime64(start)) & (self.df["date"] <= np.datetime64(end))]


if __name__ == "__main__":
    view = ViewMoney("C:/Users/jakeg/Documents/FinanceV2/finance_data/prod")
    print(view.net_income(date(2021, 11, 1), date(2021, 11, 30)) / 100)
