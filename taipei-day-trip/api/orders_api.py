from flask import *
import mysql.connector
import mysql.connector.pooling
import json
import jwt
from api.connector import connection_pool
from datetime import datetime
import requests

#python dotenv .env
import os
from dotenv import load_dotenv
load_dotenv()

orders_api = Blueprint("orders_api",__name__)

#錯誤卡號測試:4242 4216 0218 4242	
#根據訂單編號取得訂單資訊及狀態
@orders_api.route("/api/order/<orderNumber>", methods =["GET"])
def api_orderId(orderNumber):
    id = str(orderNumber)
    response = ""
    connection_object = connection_pool.get_connection()
    print(orderNumber)
    try:
        if id != "" :
            mycursor = connection_object.cursor()
            sql = "SELECT attraction.id, attraction.name, attraction.address, cart.attraction_image, cart.order_number, order_price, cart.trip_date, cart.trip_time, cart.contact_name, cart.contact_email, cart.contact_phone, cart.status FROM attraction INNER JOIN cart ON attraction.id = cart.attraction_Id "
            mycursor.execute(sql,)
            myresult = mycursor.fetchall()
            for order_data in myresult:
                print(order_data)
            response = jsonify({
                "data": {
                    "number": order_data[4],
                    "price": order_data[5],
                    "trip": {
                    "attraction": {
                        "id": order_data[0],
                        "name": order_data[1],
                        "address": order_data[2],
                        "image": order_data[3]
                    },
                    "date": order_data[6],
                    "time": order_data[7]
                    },
                    "contact": {
                    "name": order_data[8],
                    "email": order_data[9],
                    "phone": order_data[10]
                    },
                    "status": order_data[11]
                }
            }) 
            mycursor.close()
        elif id == "":
            response = jsonify({
                "data" : None
            })
        else:
            response = jsonify({
               "error": True,
                "message": "未登入系統，拒絕存取" 
            })
    except mysql.connector.Error as err:
        print(err)
        response = jsonify({
                "error" : True,
                "message" : "伺服器錯誤"
            },500)
    finally:
        connection_object.close()        
    return response 

# 建立新訂單，完成付款程序
@orders_api.route("/api/orders", methods = ['POST'])
def api_orders():
    connection_object = connection_pool.get_connection()
    response = ""
    prime_data = request.get_json()
    prime = prime_data["prime"]
    payment_status = "未付款"
    order_price = prime_data["order"]["price"]
    attraction_Id = prime_data["order"]["trip"]["attraction"]["id"]
    attraction_image = prime_data["order"]["trip"]["attraction"]["image"]
    trip_date = prime_data["order"]["trip"]["date"]
    trip_time = prime_data["order"]["trip"]["time"]
    contact_name = prime_data["order"]["contact"]["name"]
    contact_email = prime_data["order"]["contact"]["email"]
    contact_phone = prime_data["order"]["contact"]["phone"]
    # attraction_loction = prime_data["order"]["trip"]["attraction"]["name"]
    # attraction_address = prime_data["order"]["trip"]["attraction"]["address"]
    try:
        if contact_name != "" and contact_email != "" and contact_phone != "":
            now = datetime.now()
            order_number = now.strftime('%Y%m%d%s')
            # last_insert_id = 0  
            # next_id = str(last_insert_id + 1).zfill(3)
            # order_number = date_string + next_id
            # status ="balance payment"
            mycursor = connection_object.cursor()
            sql = "INSERT INTO cart(payment_status, order_number, order_price, attraction_Id, attraction_image, trip_date, trip_time, contact_name, contact_email, contact_phone) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
            val = (payment_status, order_number, order_price, attraction_Id, attraction_image, 
            trip_date, trip_time, contact_name, contact_email, contact_phone)
            mycursor.execute(sql,val)
            connection_object.commit()
             
            if payment_status == "未付款" :
                pay_by_prime_for_tappay = {
                    "partner_key": os.getenv('PARTNER_KEY'),
                    "prime": prime,
                    "amount": order_price,
                    "merchant_id": os.getenv('MERCHANT_ID'),
                    "details": "taipei day trip",
                    "cardholder": {
                        "name": contact_name,
                        "phone_number": contact_phone,
                        "email": contact_email,
                    },
                    "remeber": True
                }
                url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
                headers = {
                    "content-type": "application/json",
                    "x-api-key": os.getenv('X-API-KEY')
                }
                response = requests.post(url, json=pay_by_prime_for_tappay, headers=headers)
                response_data = response.json()
                status = response_data["status"]

                # print(status)
                if status == 0:
                    payment_status = "已付款"
                    mycursor = connection_object.cursor()
                    sql = "update cart set status = %s, payment_status = %s"
                    val = (status, payment_status)
                    mycursor.execute(sql,val)
                    connection_object.commit()
                    
                    sql2 = "DELETE FROM reservation"
                    mycursor.execute(sql2,)
                    connection_object.commit()
                    response = jsonify({
                        "data":{
                            "number": order_number,
                            "payment":{
                                "status":status,
                                "message":'付款成功'
                            }
                        }
                    })
                    mycursor.close()
                elif status != 0:
                    print(status)
                    print(order_number)
                    #預設付款失敗 status == 1
                    #付款不成功也更新status的狀態碼
                    mycursor = connection_object.cursor()
                    sql = "update cart set status = %s"
                    val = (status,)
                    mycursor.execute(sql,val)
                    connection_object.commit()
                    response = jsonify({
                        "data":{
                            "number": order_number,
                            "payment":{
                                "status":status,
                                "message":'付款失敗'
                            }
                        }
                    })
                else :
                    response = jsonify({
                        "error": True,
                        "message": "伺服器內部錯誤"
                    })
    except mysql.connector.Error as err:
            print(err)
            response = jsonify({
                    "error" : True,
                    "message" : "伺服器錯誤"
                },500)
    finally:
        connection_object.close()
        return response
        
        
        

    

    
    



           
         