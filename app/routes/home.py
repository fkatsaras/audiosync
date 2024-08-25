from flask import Blueprint, render_template
from app.models.home_page_response import HomePageResponse
from app.models.home_page_response_links import HomePageResponseLinks
from app.controllers.home_controller import home

home_bp = Blueprint('home', __name__)

@home_bp.route('/home', methods=['GET'])
def home_route():
    return home()