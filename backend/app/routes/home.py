from flask import Blueprint
from app.controllers.home_controller import home
from app.controllers.authorization_controller import token_required

home_bp = Blueprint('home', __name__)

@home_bp.route('/api/v1/home', methods=['GET'])
@token_required
def home_route(current_user):
    return home(current_user)