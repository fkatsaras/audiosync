from flask import Blueprint, send_from_directory, current_app
import os

static_bp = Blueprint('static', __name__)

@static_bp.route('/', defaults={'path': ''})
@static_bp.route('/<path:path>')
def serve_react(path):
    # Determine the path to the React build directory
    react_build_path = os.path.join(current_app.root_path, '../frontend/build')

    # Serve rstatic files or fallback to (!!) index.html (!!)
    if path != "" and os.path.exists(os.path.join(react_build_path, path)):
        return send_from_directory(react_build_path, path)
    else:
        return send_from_directory(react_build_path, 'static/index.html')