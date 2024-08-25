from flask import request, jsonify, session, redirect, url_for, render_template

def get_api_data():
    return jsonify({'message': 'Hello, from Flask!'})