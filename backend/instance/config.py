import os
from datetime import timedelta

SECRET_KEY = os.urandom(32)
# Grabs the folder where the script runs.
basedir = os.path.abspath(os.path.dirname(__file__))
# create JWT secretkey
JWT_SECRET_KEY = os.urandom(32)
JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=12)
# Enable debug mode.
DEBUG = True

# DATABASE URL
SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:tafiTAFI@127.0.0.1:5432/'
SQLALCHEMY_TRACK_MODIFICATIONS = False