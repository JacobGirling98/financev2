from datetime import date

import pandas as pd
from dateutil.relativedelta import relativedelta
from pandas import Timestamp

from backend.src.date_range import DateRange


class ViewMoney:

    def __init__(self, data_path: str):
        self.csv_path: str = f"{data_path}/data.csv"
        self.df: pd.DataFrame = pd.read_csv(self.csv_path, parse_dates=["date"])

    @staticmethod
    def timestamp_to_date(timestamp: Timestamp) -> date:
        return timestamp.to_pydatetime().date()

    @staticmethod
    def last_day_of_month(dt: date) -> date:
        next_month: date = dt + relativedelta(months=1)
        first_of_month: date = date(next_month.year, next_month.month, 1)
        return first_of_month - relativedelta(days=1)

    @staticmethod
    def centre_previous_month(dt: date) -> date:
        prev_date = dt - relativedelta(months=1)
        return date(prev_date.year, prev_date.month, 15)

    @staticmethod
    def centre_next_month(dt: date) -> date:
        next_date = dt + relativedelta(months=1)
        return date(next_date.year, next_date.month, 15)

    def months(self) -> list[DateRange]:
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

        return dates

    def financial_months(self) -> list[DateRange]:
        incomes: list[date] = [ViewMoney.timestamp_to_date(x) for x in
                               self.df[(self.df["category"] == "Wages")]["date"].to_list()]
        indexes: list[int] = self.df.index[(self.df["category"] == "Wages")].to_list()
        if indexes[0] > 0:
            incomes.insert(0, ViewMoney.centre_previous_month(incomes[0]))
        if indexes[-1] < len(self.df) - 1:
            incomes.append(ViewMoney.centre_next_month(incomes[-1]))

        dates: list[DateRange] = []

        for i in range(len(incomes) - 1):
            dates.append(DateRange(incomes[i], incomes[i+1], i))

        return dates

    # def spending(self, start_date: date, end_date: date) -> pd.DataFrame:
    #     return self.df[(self.df[])]


if __name__ == "__main__":
    view = ViewMoney("../../data/prod")
    print(view.financial_months())
