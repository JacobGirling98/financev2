import os

from flask import Flask, json, jsonify, request
from flask_cors import CORS

from backend.src.data_utils import DataUtils
from backend.src.new_money import NewMoney
from backend.src.view_money import ViewMoney

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
view_money_helper = ViewMoney(data_path)

if os.getenv("SYSTEM") != "MAC":
    new_money_helper.complete_standing_orders()


@app.route("/form_options/", methods=['GET'])
def get_form_options() -> json:
    """
  Takes request parameter for name of file to read and returns list of form constants, e.g. categories
  """
    data_type: str = request.args.get('dataType')
    response = {
        "data": view_money_helper.get_unique_descriptions() if data_type == "descriptions" else
        data_utils.get_data_as_list(data_type)
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


@app.route("/description_mappings", methods=['POST'])
def new_description_mappings():
    """
    Adds new description mappings to description mappings file
    """
    new: dict = json.loads(request.data)["unknownMappings"]
    data_utils.save_description_mappings(new)
    return "Description mappings successfully added"


@app.route("/new_money", methods=['POST'])
def new_transaction():
    """
    Adds transactions to data csv
    """
    data: dict = json.loads(request.data)
    transactions: dict = new_money_helper.convert_to_dict(data["transactions"])
    typed_transactions: dict = new_money_helper.convert_data_types(transactions)
    return new_money_helper.save_transactions(typed_transactions)


@app.route("/view_money/date_ranges", methods=["GET"])
def date_ranges() -> json:
    """
    Returns list of months, financial months, years and financial years dynamically from data
    """
    response = {
        "months": view_money_helper.get_months(),
        "financial_months": view_money_helper.get_financial_months(),
        "years": view_money_helper.get_years(),
        "financial_years": view_money_helper.get_financial_years()
    }
    return jsonify(response)


if __name__ == "__main__":
    app.run()
