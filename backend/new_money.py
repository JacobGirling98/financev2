from datetime import datetime, date

import pandas as pd


class NewMoney:

    def __init__(self, data_path):
        self.csv_path = f"{data_path}/data.csv"
        self.standing_orders_path = f"{data_path}/standing_orders.csv"

    def convert_to_dict(self, transactions: list) -> dict:
        """
        Converts json structured transactions to single dict of transactions, ready to be appended to dataframe
        :param transactions: list of transactions
        :return: dict of transactions
        """
        new_transactions = {
            "date": [],
            "outgoing": [],
            "value": [],
            "transactionType": [],
            "outboundAccount": [],
            "inboundAccount": [],
            "destination": [],
            "source": [],
            "description": [],
            "category": [],
            "quantity": [],
        }
        for transaction in transactions:
            for k in new_transactions:
                new_transactions[k].append(transaction[k] if transaction[k] != "" else None)
        return new_transactions

    def convert_data_types(self, transactions: dict) -> dict:
        """
        Takes dict of transactions and converts data types, e.g. date string to date
        :param transactions: dict of transactions
        :return: converted dict
        """
        transactions["date"] = [datetime.strptime(x, "%Y-%m-%d") for x in transactions["date"]]
        transactions["value"] = [int(float(x) * 100) for x in transactions["value"]]
        transactions["quantity"] = [int(x) for x in transactions["quantity"]]
        return transactions

    def save_transactions(self, transactions: dict) -> None:
        """
        Takes dict of transactions and appends to csv file of transactions
        :param transactions: dict of transactions
        """
        try:
            print(transactions)
            df = pd.DataFrame(transactions)
            print(df)
            df.to_csv(self.csv_path, mode="a", index=False, header=False)
            res = "Items successfully added"
        except Exception as e:
            res = str(e)
        return res

    def complete_standing_orders(self):
        """
        Goes through standing orders, completes any that need doing, and calculates when next to do them
        """
        today = pd.to_datetime(date.today())
        standing_orders_completed = []

        df = pd.read_csv(self.standing_orders_path, parse_dates=["next_date"])
        df_filtered = df[(df["next_date"] <= today)].copy()

        for i, row in df_filtered.iterrows():
            stay_on_row = True
            while stay_on_row:
                if row["next_date"] <= today:
                    row_copy = row.copy()
                    row_copy["date"] = row_copy["next_date"].date()
                    row_copy = row_copy.drop(['next_date', 'frequency'])
                    data = row_copy.to_dict()
                    data = {x: [data[x]] for x in data}
                    self.save_transactions(data)

                    standing_orders_completed.append(row_copy['description'] + ' ' + str(row_copy['date']))

                    if row['frequency'] == 'monthly':
                        row['next_date'] = (row['next_date'] + pd.DateOffset(months=1))
                    else:
                        row['next_date'] = (row['next_date'] + pd.DateOffset(weeks=1))
                else:
                    stay_on_row = False
            df.loc[i, ['next_date']] = [row['next_date']]

        df.to_csv(self.standing_orders_path, index=False)

        if len(standing_orders_completed) > 0:
            print('Standing orders completed:')
            for entry in standing_orders_completed:
                print(f'- {entry}')
            print("-" * 15)


