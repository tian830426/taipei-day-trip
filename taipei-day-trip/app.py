# import model
from flask import *
import mysql.connector
import mysql.connector.pooling
import json
import jwt

app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

# set up blue_print public 
from flask import Flask
app = Blueprint('app', __name__)
app = Flask(__name__)

from api.attraction_api import attraction_api
from api.categories_api import categories_api
from api.signin_api import signin_api
from api.booking_api import booking_api
from api.orders_api import orders_api

# set up session secret_key
app.secret_key='tian12345'

# set up mysql.connector 
# new = mysql.connector.connect(
#   host="localhost",
#   user="root",
#   password="tian0426",
#   database="taipeiDayTrip" 
# )

# set up connector.pooling 
dbconfig = {
    "user" : "root",
    "password" : "tian0426",
    "host" : "localhost",
    "database" : "taipeiDayTrip",
}

connection_pool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name = "wehelp_pool",
    pool_size = 5,
    pool_reset_session = True,
    **dbconfig
)

# Pages of separate frontend and backend
@app.route("/")
def index():
    return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
    return render_template("attraction.html")
@app.route("/booking")
def booking():
    return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
    return render_template("thankyou.html")

app.register_blueprint(attraction_api)
app.register_blueprint(categories_api)
app.register_blueprint(signin_api)
app.register_blueprint(booking_api)
app.register_blueprint(orders_api)

app.run(host='0.0.0.0',port=3000)

