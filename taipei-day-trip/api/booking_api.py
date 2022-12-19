from flask import *
import mysql.connector
import mysql.connector.pooling
import json
import jwt
from api.connector import connection_pool

booking_api = Blueprint("booking_api",__name__)

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

@booking_api.route("/api/booking", methods= ['GET','POST','DELETE'])
def api_booking():
    connection_object = connection_pool.get_connection()
    get_token = request.cookies.get("token")
    data = request.get_json()
    # print(data)
    response = ""
    try :
        if request.method == "GET":
            #data2.id 和 reservation.id 相同時取得以下資料 
            mycursor = connection_object.cursor()
            sql = "SELECT datas2.id,datas2.name,datas2.address,datas2.images,reservation.date,reservation.time,reservation.price FROM datas2 INNER JOIN reservation ON datas2.id = reservation.attractionId "
            mycursor.execute(sql)
            myresult = mycursor.fetchall()
            myresultlen = len(myresult)
            
            if myresultlen == 1: 
                print(myresultlen)
                myresult_tour = myresult[0]
                # print(myresult_tour)
                img = myresult_tour[3].split(' ')
                # print(img[0])
                # print(myresult_tour)
                # print(myresult_tour[1])
                if myresult != 0:
                    response =  jsonify({
                        "data": {
                            "attraction": {
                            "id": myresult_tour[0],
                            "name": myresult_tour[1],
                            "address": myresult_tour[2],
                            "image": img[0]
                            },
                            "date": myresult_tour[4],
                            "time": myresult_tour[5],
                            "price": myresult_tour[6]
                            }
                    })
            else:
                print(myresultlen)
                response =  jsonify({
                    "data": None
                }) 
        if request.method == "POST":
            new_tour = request.get_json()
            # print(new_tour)
            # print("----")
            attractionId = new_tour["attractionId"]
            date = new_tour["date"]
            time = new_tour["time"]
            price = new_tour["price"]
            
            # 判斷是否登入狀態
            if get_token == None :
                
                # print(get_token)
                response = jsonify({
                    "error": True,
                    "message": "未登入狀態" 
                })
            else :
                #判斷 前端填入內容是否有空值，如果沒有就判斷資料庫是否有一筆資料
                if attractionId != "" and date != "" and time != "" and price != "" :
                    mycursor = connection_object.cursor()
                    sql = "SELECT * FROM reservation"
                    mycursor.execute(sql)
                    myresult =  mycursor.fetchone()
                    # print(myresult)
                    #如果資料庫有一筆資料便 更新取代原本資料 
                    if myresult != None :
                        sql = 'UPDATE reservation set attractionId = %s, date =%s, time =%s, price=%s'
                        val = (attractionId, date, time, price)
                        mycursor.execute(sql,val)
                        connection_object.commit()
                        response =  jsonify({
                            "ok": True
                        }) 
                    #如果資料庫沒有東西， 新增                   
                    else:
                        mycursor = connection_object.cursor()
                        sql = "INSERT INTO reservation(attractionId, date, time, price) values (%s, %s, %s, %s)"
                        val = (attractionId, date, time, price)
                        mycursor.execute(sql,val)
                        connection_object.commit()
                        response = jsonify({
                            "ok": True
                        })
                else :
                    print ('填寫不完全')
                    response = jsonify({
                        "error" : True,
                        "message" : "資料填寫不齊全" 
                    })
                    
        if request.method == "DELETE":
            print('delete loop')
            get_token = request.cookies.get("token")
            print('get_token')
            if get_token == None :
                print(get_token)
                response =  jsonify({
                    "error": True,
                    "message": "未登入狀態" 
                })
            else:
                mycursor = connection_object.cursor()
                sql = "DELETE FROM reservation"
                mycursor.execute(sql,)
                connection_object.commit()
                response = jsonify({
                    "ok": True
                })
        mycursor.close()    
    except mysql.connector.Error as err:
        print(err)
        response = jsonify({
                "error" : True,
                "message" : "伺服器錯誤"
            },500)
    finally:
        connection_object.close()
    return response