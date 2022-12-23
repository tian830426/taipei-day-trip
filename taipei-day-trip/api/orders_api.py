from flask import *
import mysql.connector
import mysql.connector.pooling
import json
import jwt
from api.connector import connection_pool

orders_api = Blueprint("orders_api",__name__)

# 根據訂單編號取得訂單資訊
@orders_api.route("/api/order/<orderNumber>", methods =["GET"])
def api_orderId(orderNumber):
    id = orderNumber

# 建立新的訂單，完成付款程序
@orders_api.route("/api/orders", methods = ['POST'])
def api_orders():
    connection_object = connection_pool.get_connection()
    response = ""
    new_payment = request.get_json()
    print(new_payment)
    prime = new_payment["prime"]
    print(prime)
    # try:
    #     if prime != "":
    return '123'     