import datetime
import os

from dateutil.parser import parse
from flask import Flask, json, jsonify, request
from flask_cors import CORS
from git import Repo

from src.data_utils import DataUtils
from src.new_money import NewMoney
from src.view_money import ViewMoney

app = Flask(__name__)
CORS(app)

data_repo = os.getenv("DATA_PATH")
if os.getenv('API_ENV') == 'prod':
    data_path = f"{data_repo}/prod"
else:
    data_path = f"{data_repo}/dev"

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
        "descriptions": view_money_helper.get_unique_descriptions(),
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


@app.route("/sync_data", methods=['GET'])
def sync_data() -> json:
    """
    Pushes transaction data to repository
    """
    repo = Repo(data_repo)
    repo.git.add(".")
    if repo.index.diff("HEAD"):
        repo.git.commit(f"-m {str(datetime.datetime.now())}")
        repo.git.pull()
        repo.git.push()
    else:
        repo.git.pull()
    return jsonify({'data': 'synced'})


@app.route("/view_money/summary", methods=["GET"])
def summary() -> json:
    """
    Generates summary statistics (e.g. total income, savings, etc) for given timeframe
    """
    data: dict = request.args
    print(data["start"])
    start, end = parse(data["start"]), parse(data["end"])
    response = {
        "income": ViewMoney.to_sterling(view_money_helper.total_income(start, end)),
        "spending": ViewMoney.to_sterling(view_money_helper.total_spending(start, end)),
        "savings": ViewMoney.to_sterling(view_money_helper.total_savings(start, end)),
        "net": ViewMoney.to_sterling(view_money_helper.net_income(start, end))
    }
    return jsonify(response)


if __name__ == "__main__":
    app.run()
