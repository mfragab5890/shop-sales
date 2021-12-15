import os
from flask_cors import CORS
import random
import json
import dateutil.parser
import babel
from flask import Flask, render_template, request, Response, flash, redirect, url_for, jsonify, abort
from models import setup_db, database_name, Products
from operator import attrgetter


# ----------------------------------------------------------------------------#
# App Config.
# ----------------------------------------------------------------------------#
def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    setup_db(app, database_name)
    CORS(app)

    # CORS Headers
    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,true')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response

    # connection in configuration file added

    # ----------------------------------------------------------------------------#
    # Filters.
    # ----------------------------------------------------------------------------#

    def format_datetime(value, format='medium'):
        if isinstance(value, str):
            date = dateutil.parser.parse(value)
        else:
            date = value

        if format == 'full':
            format = "EEEE MMMM, d, y 'at' h:mma"
        elif format == 'medium':
            format = "EE MM, dd, y h:mma"
        return babel.dates.format_datetime(date, format, locale='en')

    app.jinja_env.filters[ 'datetime' ] = format_datetime

    # ----------------------------------------------------------------------------#
    # Controllers.
    # ----------------------------------------------------------------------------#

    # Get all questions with/without categories and paginated
    @app.route('/', methods=[ 'GET' ])
    def get_home_data():
        return jsonify({
            'success': True,
            'message': 'welcome to Fiori'
        })

    # create new product endpoint. this end point should take:
    # name, code, sell_price, buy_price, qty, created_by, mini, maxi, sold, image, description
    # permission: create_product
    @app.route('/product/new', methods=[ 'POST' ])
    def create_list():
        body = request.get_json()
        name, code, sell_price, buy_price, qty, created_by, mini, maxi, sold, image, description \
            = attrgetter('name', 'code', 'sell_price', 'buy_price', 'qty', 'created_by', 'mini', 'maxi', 'sold', 'image'
                         , 'description')(body)
        new_product = Products(name = name, code, code,
                            sell_price = sell_price,
                            buy_price = buy_price,
                            qty = qty,
                            created_by = created_by,
                            mini = mini,
                            maxi = maxi,
                            sold = sold,
                            image = image,
                            description = description
                            )

        try:
            new_product.insert()
            # get new list id
            user_product = Products.query \
                .filter(List.code == code) \
                .order_by(db.desc(List.id)).first()
            return jsonify({
                'success': True,
                'message': 'product created successfully',
                'newProduct': user_product,
            })
        except Exception as e:
            abort(422)

    # ----------------------------------------------------------------------------#
    # Error Handlers.
    # ----------------------------------------------------------------------------#
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            "success": False,
            "error": 404,
            "message": 'Not found!!! : please check your Data or maybe your request is currently not available.'
        }), 404

    @app.errorhandler(422)
    def not_processable(error):
        return jsonify({
            "success": False,
            "error": 422,
            "message": 'Unprocessable!!! : The request was well-formed but was unable to be followed'
        }), 422

    @app.errorhandler(405)
    def not_allowed_method(error):
        return jsonify({
            "success": False,
            "error": 405,
            "message": 'Method Not Allowed!!!: Your request method not supported by that API '
        }), 405

    @app.errorhandler(400)
    def not_good_request(error):
        return jsonify({
            "success": False,
            "error": 400,
            "message": 'Bad Request!!!! Please make sure the data you entered is correct'
        }), 400

    @app.errorhandler(500)
    def not_found(error):
        return jsonify({
            "success": False,
            "error": 500,
            "message": 'Internal Server Error!!!: Please try again later or reload request. '
        }), 500

    return app
