import os
from flask_cors import CORS
import random
import json
import dateutil.parser
import babel
from flask import Flask, render_template, request, Response, flash, redirect, url_for, jsonify, abort
from sqlalchemy import func, extract

from models import setup_db, database_name, Products, db, Orders, OrderItems
from datetime import datetime, date
import base64


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

    @app.route('/', methods=[ 'GET' ])
    def get_home_data():
        return jsonify({
            'success': True,
            'message': 'welcome to Fiori'
        })

    # create new product endpoint. this end point should take:
    # name, code, sell_price, buy_price, qty, created_by, mini, maxi, sold, image, description
    # permission: create_product
    @app.route('/products/new', methods=[ 'POST' ])
    def create_product():
        body = request.get_json()
        name = body.get('name', None)
        code = body.get('barcode', None)
        sell_price = int(body.get('sellingPrice', None))
        buy_price = int(body.get('buyingPrice', None))
        qty = int(body.get('quantity', 0))
        created_by = int(body.get('created_by', None))
        mini = int(body.get('minimum', 0))
        maxi = int(body.get('maximum', (qty + 1)))
        sold = int(body.get('sold', 0))
        image = body.get('image', '')
        description = body.get('description', None)

        new_product = Products(name=name,
                               code=code,
                               sell_price=sell_price,
                               buy_price=buy_price,
                               qty=qty,
                               created_by=created_by,
                               mini=mini,
                               maxi=maxi,
                               sold=sold,
                               image=image,
                               description=description
                               )

        try:
            new_product.insert()
            # get new list id
            user_product = Products.query \
                .filter(Products.code == code) \
                .order_by(db.desc(Products.id)).first().format()
            return jsonify({
                'success': True,
                'message': 'product created successfully',
                'newProduct': user_product,
            })
        except Exception as e:
            print(e)
            abort(400)

    @app.route('/products/all/<int:page>', methods=[ 'GET' ])
    def get_all_products(page):
        results_per_page = 60
        if not page:
            page = 1
        try:
            products_query = Products.query.order_by(db.desc(Products.id)).paginate(page, results_per_page,
                                                                                    False).items
            products = [ product.format() for product in products_query ]
            return jsonify({'products': products})
        except Exception as e:
            print(e)
            abort(400)

    @app.route('/products/search/<int:product_id>', methods=[ 'GET' ])
    def search_products(product_id):
        try:
            data = Products.query.filter(Products.id == product_id).first()
            if data is not None:
                product = data.format()
                return jsonify(product)
            else:
                return jsonify({
                    "success": False,
                    "error": 400,
                    "message": "This Product Doesn't Exist In Your DataBase"
                })
        except Exception as e:
            print(e)
            abort(400)

    # create new order endpoint. this end point should take:
    # order items, user, total
    # permission: create_order
    @app.route('/orders/new', methods=[ 'POST' ])
    def create_order():
        body = request.get_json()
        cart_items = body.get('cartItems', [ ])
        total_price = int(body.get('total', None))
        total_cost = int(body.get('totalCost', None))
        qty = int(body.get('totalQuantity', None))
        created_by = int(body.get('created_by', None))

        new_order = Orders(
            qty=qty,
            total_price=total_price,
            total_cost=total_cost,
            created_by=created_by,
        )

        try:
            new_order.insert()
            # get new list id
            user_order = Orders.query.order_by(db.desc(Orders.id)).first()
            for item in cart_items:
                print(item)
                qty = int(item[ 'quantity' ])
                total_price = int(item[ 'total' ])
                total_cost = int(item[ 'totalCost' ])
                order_id = int(user_order.id)
                product_id = int(item[ 'id' ])

                new_order_items = OrderItems(
                    qty=qty,
                    total_price=total_price,
                    total_cost=total_cost,
                    order_id=order_id,
                    product_id=product_id
                )
                user_product = Products.query.get(product_id)
                if isinstance(user_product.sold, int):
                    user_product.sold += qty
                else:
                    user_product.sold = qty
                try:
                    new_order_items.insert()
                    user_product.update()
                except Exception as e:
                    print(e)
                    abort(400)

            return jsonify({
                'success': True,
                'message': 'Order Added successfully'
            })
        except Exception as e:
            print(e)
            abort(400)

    @app.route('/sales/month', methods=[ 'GET' ])
    def get_month_orders():
        try:
            orders_query = Orders.query.filter(
                extract('year', Orders.created_on) == datetime.utcnow().year
            ).filter(
                extract('month', Orders.created_on) == datetime.utcnow().month
            ).order_by(db.desc(Orders.id)).all()
            orders = [ order.format() for order in orders_query ]
            return jsonify({'orders': orders})
        except Exception as e:
            print(e)
            abort(400)

    @app.route('/sales/today', methods=[ 'GET' ])
    def get_today_orders():
        try:
            orders_query = Orders.query.filter(
                extract('year', Orders.created_on) == datetime.utcnow().year
            ).filter(
                extract('month', Orders.created_on) == datetime.utcnow().month
            ).filter(
                extract('day', Orders.created_on) == datetime.utcnow().day
            ).order_by(db.desc(Orders.id)).all()
            orders = [ order.format() for order in orders_query ]
            return jsonify({'orders': orders})
        except Exception as e:
            print(e)
            abort(400)
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
