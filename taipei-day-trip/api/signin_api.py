from flask import *
import mysql.connector
import mysql.connector.pooling
import json
import jwt
from api.connector import connection_pool

#python dotenv .env
import os
from dotenv import load_dotenv
load_dotenv()

signin_api = Blueprint("signin_api",__name__)

jwt_secret_key = os.getenv('JWT_SECRET_KEY')
print(jwt_secret_key)

# get signup_data from frontend 
@signin_api.route("/api/user", methods = ['POST'])
def api_signup_data():
    connection_object = connection_pool.get_connection()
    response = ""
    try:    
        if request.method == "POST":
            signup_data = request.get_json()
            print(signup_data)
            name = signup_data["name"]
            email = signup_data["email"]
            password = signup_data["password"]  
            mycursor = connection_object.cursor()
            sql = "SELECT email FROM user WHERE email = %s "
            val = (email,)
            mycursor.execute(sql,val)
            myresult = mycursor.fetchall()     
            if (mycursor.rowcount != 0) :
                response = jsonify({
                    "error": True,
                    "message": "此email已被註冊"
                })
            else:
                mycursor2 = connection_object.cursor()
                sql2 = "INSERT INTO user(name, email, password) VALUES (%s, %s, %s)"
                val2 = (name, email, password)
                mycursor2.execute(sql2,val2)
                connection_object.commit()
                response = jsonify({
                    "ok": True
                })
                mycursor2.close()
            mycursor.close()
    except mysql.connector.Error as err:
        response = jsonify({
            "error" : True,
            "message" : "系統錯誤"
        },500)
    finally:
        connection_object.close()
    return response

# get signup_data from frontend
@signin_api.route("/api/user/auth",methods=['PUT','GET','DELETE'])
def api_signin_data():
    connection_object = connection_pool.get_connection()
    response = ""
    try:
        if request.method == "PUT":
            signin_data = request.get_json()
            print(signin_data)
            email = signin_data["email"]
            password = signin_data["password"]
            mycursor = connection_object.cursor()
            
            sql = "SELECT email, password FROM user WHERE email = %s and password = %s "
            val = (email,password)
            mycursor.execute(sql,val)
            myresult = mycursor.fetchall()
            
            if  mycursor.rowcount != 0 :
                
                encoded_jwt = jwt.encode({"email":email}, jwt_secret_key, algorithm="HS256")
                # encoded_jwt = jwt.encode({"id":id,"name":name ,"email":email}, jwt_secret_key, algorithm="HS256")
                print(encoded_jwt)
                get_jwt_token = jsonify({"ok": True}) 
                get_jwt_token.set_cookie("token",encoded_jwt,max_age = 7 * 24 * 60 * 60)    
                response = get_jwt_token
            else:        
                response =  jsonify({
                    "error": True,
                    "message":"帳號密碼輸入錯誤"
                    })
            # mycursor.close()             
        if request.method == "GET":
            get_cookie_token = request.cookies.get("token")
            # print(get_cookie_token)
            if get_cookie_token != None:
                
                decoded = jwt.decode(get_cookie_token,jwt_secret_key,algorithms = 'HS256')
                # print(decoded)
                # print(decoded["email"])
                mycursor = connection_object.cursor()
                sql = "SELECT * FROM user WHERE email = %s "
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
            get_cookie_token = request.cookies.get("token")
            if get_cookie_token != None:
                clear_cookie_token = jsonify({"ok": True})
                clear_cookie_token.set_cookie('token','',expires = 0)
                # print (clear_cookie_token)
                response = clear_cookie_token
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