from typing import *
from flask import Flask, json, jsonify, request
from flask.wrappers import Response
from flask_cors import CORS

from utils import Utils

app = Flask(__name__)
CORS(app)


@app.route("/formoptions/", methods=['GET'])
def get_form_options() -> json:
  """
  Takes request parameter for name of file to read and returns list of form constants, e.g. categories
  """
  data_type: str = request.args.get('dataType')
  response = {
      "data": utils.get_unique_descriptions() if data_type == "descriptions" else utils.get_data_as_list(data_type)
  }
  return jsonify(response)

@app.route("/formoptions/all", methods=['GET'])
def get_all_form_options() -> json:
  """
  Gets all form constants
  """
  response = {
    "accounts": utils.get_data_as_list("accounts"),
    "categories": utils.get_data_as_list("categories"),
    "descriptions": utils.get_unique_descriptions(),
    "incomeSource": utils.get_data_as_list("income_source"),
    "payees": utils.get_data_as_list("payees")
  }
  return jsonify(response)


if __name__ == "__main__":
  utils = Utils("data/prod")

  app.run()
