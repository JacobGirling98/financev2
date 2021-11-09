import json

import numpy as np
import pandas as pd


class DataUtils:

    def __init__(self, data_path):
        self.data_path = data_path
        self.data = pd.read_csv(f"{data_path}/data.csv", parse_dates=["date"])

    def get_data_as_list(self, data_type: str) -> list:
        """
        Reads file and extracts data in name column as a list
        """
        data = pd.read_csv(f"{self.data_path}/{data_type}.csv")["name"].to_list()
        data.sort()
        return data

    def get_description_mappings(self) -> list:
        """
        Reads description mappings from text file and returns as dict
        :return: dict
        """
        with open(f"{self.data_path}/description_mappings.json", "r") as file:
            data: list = json.loads(file.read())
        return data

    def save_description_mappings(self, new_mappings: list) -> None:
        """
        Takes new mappings and adds to existing mappings file
        """
        existing = self.get_description_mappings()
        combined = existing + new_mappings
        with open(f"{self.data_path}/description_mappings.json", "w") as file:
            file.write(json.dumps(combined))

# utils = Utils("data/prod")
# cats = utils.get_data_as_list("categories")
# print(cats)
