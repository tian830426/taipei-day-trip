# from flask import *
# import mysql.connector
# import mysql.connector.pooling
# import json
# import jwt
# from api.connector import connection_pool

# member_api = Blueprint("member_api",__name__)


# @member_api.route("/api/member", methods = ["GET"])
# def api_member():
#     get_cookie_token = request.cookies.get("token")
#     print(get_cookie_token)
#     new_revise_data = request.get_json()
#     print(new_revise_data)
#     return '123'