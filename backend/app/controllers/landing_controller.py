from flask import request, jsonify, session, redirect, url_for, flash, render_template

def landing():
    # Checks if a user is logged in the current session
    if 'user.id' in session:
        return redirect(url_for('home.home_route'))
    # If not prompts to login
    return render_template('landing.html')

