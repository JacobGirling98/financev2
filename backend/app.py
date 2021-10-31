import os

from flask import Flask, json, jsonify, request
from flask_cors import CORS

from new_money import NewMoney
from data_utils import DataUtils

app = Flask(__name__)
CORS(app)

if os.getcwd()[-7:] == "backend":
    root = os.getcwd()[:-7]
else:
    root = os.getcwd()
if os.getenv('API_ENV') == 'prod':
    data_path = f"{root}/data/prod"
else:
    data_path = f"{root}/data/dev"

data_utils = DataUtils(data_path)
new_money_helper = NewMoney(data_path)

if os.getenv("SYSTEM") != "MAC":
    new_money_helper.complete_standing_orders()


@app.route("/form_options/", methods=['GET'])
def get_form_options() -> json:
    """
  Takes request parameter for name of file to read and returns list of form constants, e.g. categories
  """
    data_type: str = request.args.get('dataType')
    response = {
        "data": data_utils.get_unique_descriptions() if data_type == "descriptions" else data_utils.get_data_as_list(
            data_type)
    }
    return jsonify(response)


@app.route("/form_options/all", methods=['GET'])
def get_all_form_options() -> json:
    """
  Gets all form constants
  """
    response = {
        "accounts": data_utils.get_data_as_list("accounts"),
        "categories": data_utils.get_data_as_list("categories"),
        "descriptions": data_utils.get_unique_descriptions(),
        "incomeSource": data_utils.get_data_as_list("income_source"),
        "payees": data_utils.get_data_as_list("payees"),
        "descriptionMappings": data_utils.get_description_mappings()
    }
    return jsonify(response)


@app.route("/new_money", methods=['POST'])
def new_transaction():
    """
    Adds transactions to data csv
    """
    data: dict = json.loads(request.data)
    transactions: dict = new_money_helper.convert_to_dict(data["transactions"])
    typed_transactions: dict = new_money_helper.convert_data_types(transactions)
    return new_money_helper.save_transactions(typed_transactions)


if __name__ == "__main__":
    app.run()
