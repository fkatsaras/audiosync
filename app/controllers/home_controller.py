from flask import request, jsonify, session, redirect, url_for, flash, render_template

def home_get():  # noqa: E501
    """Get Home Page GUI

    Retrieve the home page GUI data # noqa: E501


    :rtype: HomePageResponse
    """

    if 'user.id' not in session:
        return redirect(url_for('landing.landing'))
    return render_template('home.html')
