from flask import *
import mysql.connector
import mysql.connector.pooling
import json
import jwt
from api.connector import connection_pool

categories_api = Blueprint("categories_api",__name__)

# #insert connector.pooling 
# dbconfig = {
#     "user" : "root",
#     "password" : "tian0426",
#     "host" : "localhost",
#     "database" : "taipeiDayTrip",
# }

# connection_pool = mysql.connector.pooling.MySQLConnectionPool(
#     pool_name = "wehelp_pool",
#     pool_size = 5,
#     pool_reset_session = True,
#     **dbconfig
# )

@categories_api.route('/api/categories',methods = ['GET'])
def api_categories():
    response = ""
    connection_object = connection_pool.get_connection()
    try:
        mycursor = connection_object.cursor()
        # mycursor = new.cursor()
        sql = "select distinct category from datas2 "
        mycursor.execute(sql)
        category_result = mycursor.fetchall()
        category_data = [cat[0] for cat in category_result]
        mycursor.close()
        # print(category_data)
        response = jsonify({	
            "data": category_data
        })

    except TypeError :
        response = jsonify({
        "error":True,
        "message":"型別錯誤"
    })

    except mysql.connector.Error as err:
        print(err)
        response = jsonify({
        "error":True,
        "message":"未定義"
    })
    finally:
        connection_object.close()
    
    return response 