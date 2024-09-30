from flask import Blueprint, render_template
from app.models.home_page_response import HomePageResponse
from app.models.home_page_response_links import HomePageResponseLinks
from app.controllers.home_controller import home
from app.controllers.authorization_controller import token_required

home_bp = Blueprint('home', __name__)

@home_bp.route('/api/v1/home', methods=['GET'])
@token_required
def home_route(current_user):
    return home(current_user)