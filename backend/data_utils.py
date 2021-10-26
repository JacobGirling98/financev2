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

    def get_unique_descriptions(self) -> list:
        """
        Reads data file and extracts unique descriptions to list
        """
        data = ["" if isinstance(x, float) and np.isnan(x) else x for x in self.data["description"].unique().tolist()]
        data = [x for x in data if x]
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

# utils = Utils("data/prod")
# cats = utils.get_data_as_list("categories")
# print(cats)
