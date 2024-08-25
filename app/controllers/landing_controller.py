from flask import request, jsonify, session, redirect, url_for, flash, render_template

def landing():
    if 'user.id' in session:
        return redirect(url_for('home.home_get'))
    return render_template('landing.html')

