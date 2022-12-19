from flask import *
import mysql.connector
import mysql.connector.pooling
import json
import jwt
from api.connector import connection_pool

signin_api = Blueprint("signin_api",__name__)

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

# use signupData from frontend 
@signin_api.route("/api/user", methods = ['POST'])
def api_signupData():
    try:    
        if request.method == "POST":
            signupData = request.get_json()
            name = signupData["name"]
            email = signupData["email"]
            password = signupData["password"]  
            connection_object = connection_pool.get_connection()
            mycursor = connection_object.cursor()
            sql = "select email from userinformation where email = %s "
            val = (email,)
            mycursor.execute(sql,val)
            myresult = mycursor.fetchall()     
            if (mycursor.rowcount != 0) :
                return jsonify({
                    "error": True,
                    "message": "此email已被註冊"
                })
            else:
                mycursor2 = connection_object.cursor()
                sql2 = "insert into userinformation(name, email, password) values (%s, %s, %s)"
                val2 = (name, email, password)
                mycursor2.execute(sql2,val2)
                connection_object.commit()
                return jsonify({
                    "ok": True
                })
        mycursor.close()
        mycursor2.close() 
    except mysql.connector.Error as err:
        return jsonify({
            "error" : True,
            "message" : "系統錯誤"
        },500)
    finally:
        connection_object.close()

# use signinData from frontend
@signin_api.route("/api/user/auth",methods=['PUT','GET','DELETE'])
def api_signinData():
    connection_object = connection_pool.get_connection()
    response = ""
    try:
        if request.method == "PUT":
            signinData = request.get_json() 
            email = signinData["email"]
            password = signinData["password"]
            mycursor = connection_object.cursor()
            # sql = "select * from userinformation where email = %s and password = %s "
            sql = "select email, password from userinformation where email = %s and password = %s "
            val = (email,password)
            mycursor.execute(sql,val)
            myresult = mycursor.fetchall()
            
            if  mycursor.rowcount != 0 :
                # mycursor1 = connection_object.cursor()
                # sql1 ="select * from userinformation "
                # mycursor.execute(sql1,)
                # myresult = mycursor.fetchall()
                # print(myresult)
                secretKey ='12345'
                encoded_jwt = jwt.encode({"email":email}, secretKey, algorithm="HS256")
                # encoded_jwt = jwt.encode({"id":id,"name":name ,"email":email}, secretKey, algorithm="HS256")
                print(encoded_jwt)
                success_token = jsonify({"ok": True}) 
                success_token.set_cookie("token",encoded_jwt,max_age = 7 * 24 * 60 * 60)    
                response = success_token
            else:        
                response =  jsonify({
                    "error": True,
                    "message":"帳號密碼輸入錯誤"
                    })
            # mycursor.close()             
        if request.method == "GET":
            get_token = request.cookies.get("token")
            # print(get_token)
            if get_token != None:
                secretKey = '12345'
                decoded = jwt.decode(get_token,secretKey,algorithms = 'HS256')
                # print(decoded)
                # print(decoded["email"])
                mycursor = connection_object.cursor()
                sql = "select * from userinformation where email = %s "
                val = (decoded["email"],)
                mycursor.execute(sql,val)
                myresult = mycursor.fetchall()
                # return decoded
                for myresult_data in myresult:
                    response =  jsonify({
                        "data": {
                        "id":myresult_data[0] ,
                        "name":myresult_data[1] ,
                        "email":myresult_data[2]
                        }
                    })
            else:
                response =  jsonify({
                    "data": None
                })
        if request.method == "DELETE":
            get_token = request.cookies.get("token")
            if get_token != None:
                clear_cookie = jsonify({"ok": True})
                clear_cookie.set_cookie('token','',expires = 0)
                print (clear_cookie)
                response = clear_cookie
    except mysql.connector.Error as err:
        print(err)
        response = jsonify({
                "error" : True,
                "message" : "系統錯誤"
            },500)
    finally:
        # mycursor.close()
        connection_object.close()
    return response