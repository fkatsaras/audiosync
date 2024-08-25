from flask import Blueprint
from app.controllers.landing_controller import landing

landing_bp = Blueprint('landing', __name__)

@landing_bp.route('/')
def landing_route():
    return landing()