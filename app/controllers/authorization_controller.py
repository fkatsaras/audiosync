from typing import List

from flask import request, jsonify, session, redirect, url_for, render_template
from werkzeug.security import check_password_hash
from app.models.user_entity import UserEntity
import jwt
import datetime

"""
controller generated to handled auth operation described at:
https://connexion.readthedocs.io/en/latest/security.html
"""
def check_AudioSync_auth(token):
    return {'scopes': ['read:pets', 'write:pets'], 'uid': 'test_value'}

def validate_scope_AudioSync_auth(required_scopes, token_scopes):
    return set(required_scopes).issubset(set(token_scopes))

def check_api_key(api_key, required_scopes):
    return {'test_key': 'test_value'}


#-------------------------------------------------------------------------------------

# Secret key for JWT (use an environment variable in production)
SECRET_KEY = "fotis"

def login():
    if request.method == 'POST':
        if request.is_json:
            # Handle JSON data
            data = request.get_json()
            username = data.get("username")
            password = data.get("password")
        else:
            # Handle form data
            username = request.form.get("username")
            password = request.form.get("password")

        try:
            # Query the user from the database
            user = UserEntity.query.filter_by(username=username).first()

            if not user or not check_password_hash(user.password, password):
                return jsonify({'message': 'Invalid credentials'}), 401

            # Generate a JWT token
            token = jwt.encode({
                'user.id': user.id,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
            }, SECRET_KEY, algorithm="HS256")

            return jsonify({'token': token}), 200

        except Exception as e:
            return jsonify({'error': str(e)}), 500

    # For GET requests or other methods
    return render_template('login.html')

def logout():
    session.pop('username', None)
    return jsonify({'message': "Logged out successfully!"}), 200

def current_user():
    username = session.get('username')
    if username:
        return jsonify({"username": username}), 200
    return jsonify({"message": "No user logged in"}), 401