import os
from flask_migrate import Migrate
from flask_moment import Moment
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import base64

# Declare database name
from sqlalchemy import func

database_name = "furry-test"

# intiate db with no assigment
db = SQLAlchemy()


def setup_db(app, database_name):
    app.config.from_pyfile('config.py')
    app.config[ 'SQLALCHEMY_DATABASE_URI' ] += database_name
    moment = Moment(app)
    db.app = app
    db.init_app(app)
    # create instance migrate for data migration
    migrate = Migrate(app, db, compare_type=True)


# Users table
class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String, nullable=False, unique=True)
    email = db.Column(db.String, nullable=False, unique=True)
    password_hash = db.Column(db.String(128), nullable=False)
    products = db.relationship('Products', backref='user_products', lazy=True, cascade="all, delete-orphan")
    permissions = db.relationship('UserPermissions', backref='user_permissions', lazy=True,
                                  cascade="all, delete-orphan")
    orders = db.relationship('Orders', backref='user_sales', lazy=True, cascade="all, delete-orphan")

    def __init__(self, user_name, email, password):
        self.user_name = user_name
        self.email = email
        self.password_hash = password

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):
        return {
            'id': self.id,
            'user_name': self.user_name,
            'email': self.email,
            'password_hash': self.password_hash,
        }

    def format_no_password(self):
        return {
            'id': self.id,
            'user_name': self.user_name,
            'email': self.email,
        }


# Permissions table
class Permissions(db.Model):
    __tablename__ = 'permissions'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)
    holders = db.relationship('UserPermissions', backref='permission_holders', lazy=True, cascade="all, delete-orphan")

    def __init__(self, name):
        self.name = name

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):
        return {
            'id': self.id,
            'name': self.name,
        }


# Users permissions table
class UserPermissions(db.Model):
    __tablename__ = 'user_permissions'

    id = db.Column(db.Integer, primary_key=True)
    users_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    permission_id = db.Column(db.Integer, db.ForeignKey('permissions.id'), nullable=False)

    def __init__(self, user_id, permission_id):
        self.user_id = user_id
        self.permission_id = permission_id

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'permission_id': self.permission_id,
        }


# products table
class Products(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    code = db.Column(db.String, unique=True, nullable=False)
    qty = db.Column(db.Integer, default=0)
    sell_price = db.Column(db.Integer, nullable=False)
    buy_price = db.Column(db.Integer, nullable=False)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    mini = db.Column(db.Integer, default=0)
    maxi = db.Column(db.Integer)
    sold = db.Column(db.Integer, default=0)
    image = db.Column(db.LargeBinary)

    def __init__(self, name, code, qty, created_by, mini, maxi, sold, image, description, sell_price, buy_price):
        self.name = name
        self.code = code
        self.qty = qty if qty == True else 0
        self.created_by = created_by
        self.mini = mini if mini == True else 0
        self.maxi = maxi
        self.sold = sold if sold == True else 0
        self.description = description
        self.sell_price = sell_price
        self.buy_price = buy_price
        self.image = base64.b64decode(image)

    def insert(self):
        print(base64.urlsafe_b64encode(self.image))
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):
        if self.image:
            image = str(base64.b64encode(self.image))
        else:
            image = ''
        return {
            'id': self.id,
            'name': self.name,
            'code': self.code,
            'sell_price': self.sell_price,
            'buy_price': self.buy_price,
            'qty': self.qty,
            'created_by': self.created_by,
            'mini': self.mini,
            'maxi': self.maxi,
            'sold': self.sold,
            'image': image,
            'description': self.description
        }


# orders table
class Orders(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    qty = db.Column(db.Integer, default=0)
    total_price = db.Column(db.Integer, nullable=False)
    total_cost = db.Column(db.Integer, nullable=False)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_on = db.Column(db.DateTime(), nullable=False, default=datetime.utcnow)
    items = db.relationship('OrderItems', backref='items', lazy=True, cascade="all, delete-orphan")

    def __init__(self, qty, created_by, total_price, total_cost):
        self.qty = qty
        self.total_price = total_price
        self.total_cost = total_cost
        self.created_by = created_by

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):
        return {
            'id': self.id,
            'qty': self.qty,
            'created_by': self.created_by,
            'total_price': self.total_price,
            'total_cost': self.total_cost,
        }


# order items table
class OrderItems(db.Model):
    __tablename__ = 'order_items'

    id = db.Column(db.Integer, primary_key=True)
    qty = db.Column(db.Integer, default=0)
    total_price = db.Column(db.Integer, nullable=False)
    total_cost = db.Column(db.Integer, nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)

    def __init__(self, qty, total_price, total_cost, order_id, product_id):
        self.qty = qty
        self.total_price = total_price
        self.total_cost = total_cost
        self.order_id = order_id
        self.product_id = product_id

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):
        return {
            'id': self.id,
            'qty': self.qty,
            'total_price': self.total_price,
            'total_cost': self.total_cost,
            'order_id': self.order_id,
            'product_id': self.product_id,
        }
