from datetime import datetime
from distutils.util import strtobool

class NewMoney:

    def __init__(self, data_path):
        self.data_path = data_path

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
        return transactions

