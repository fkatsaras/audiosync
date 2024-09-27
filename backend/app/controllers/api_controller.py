from flask import request, jsonify, session, redirect, url_for, render_template
from app.models.api_response import ApiResponse

def get_api_data():
    response = ApiResponse(
        code=200, 
        type='success', 
        message='Welcome to AudioSync, API is working!'
    )
    return jsonify(response.to_dict()), 200

def handle_error():
    error_response = ApiResponse(
        code=400, 
        type='error', 
        message='Invalid request data'
    )
    return jsonify(error_response.to_dict()), 400