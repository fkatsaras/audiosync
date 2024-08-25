from flask import Blueprint, jsonify
from app.controllers.api_controller import get_api_data

api = Blueprint('api', __name__)

@api.route('/api/data')
def get_api_data_route():
    return get_api_data()