# import 
from flask import *
from flask import Flask,request,render_template,redirect,session,url_for,make_response
import mysql.connector
import json
from flask import jsonify
import mysql.connector.pooling
import jwt

app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

# set up session secret_key
app.secret_key='tian12345'

# insert mysql.connector 
# new = mysql.connector.connect(
#   host="localhost",
#   user="root",
#   password="tian0426",
#   database="taipeiDayTrip" 
# )

#insert connector.pooling 
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

# Pages
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

# attractions api
@app.route('/api/attractions',methods = ['GET'])
def api_attractions():
    page_num = request.args.get('page','')
    page_num = int(page_num)
    key_word = request.args.get('keyword','')

    #先判斷是否需要比對key_word還是單純page_num
    response = ""
    connection_object = connection_pool.get_connection()
    try:    
        if key_word == '':
            #最多筆
            page_count_maxnum = 12
            #計算每頁從第幾筆開始撈
            page_count_stage = page_num * page_count_maxnum
            mycursor = connection_object.cursor()
            # mycursor = new.cursor()
            sql = "select * from datas2 limit %s,%s "
            val = (page_count_stage,page_count_maxnum)
            mycursor.execute(sql,val)
            count_result = mycursor.fetchall()
            # print(count_result[0][9])
            count_result_len = len(count_result)
            # print(count_result_len)
            #處理資料庫型態
            for i in range(count_result_len):
                count_result[i] = list(count_result[i])
                count_result[i][9] = count_result[i][9].split(" ")
            
            count_result_title = mycursor.description
            result_title = [tit[0] for tit in count_result_title]
            count_data = []

            for i in range (count_result_len):
                count_data.append(dict(zip(result_title,count_result[i])))

            if count_result_len >= 12 :
                response = jsonify({
                "nextPage": page_num+1,
                "data": count_data
            }) 
            elif count_result_len < 12 and count_result_len !=0 :
                response = jsonify({
                "nextPage": None,
                "data": count_data
            })
            else :
                response = jsonify({                              
                "error": True,
                "message": "沒有了"	
            })
            mycursor.close()

        #判斷模糊比對及完全比對
        else:
            #最多筆
            page_count_maxnum = 12
            #計算每頁從第幾筆開始撈
            page_count_stage = page_num * page_count_maxnum

            #讀取12筆資料
            mycursor1 = connection_object.cursor()
            # mycursor1 = new.cursor()
            sql = "select * from datas2 where category = %s or name like concat('%',%s,'%') limit %s,%s"
            val = (key_word , key_word , page_num * page_count_maxnum , page_count_maxnum)
            mycursor1.execute(sql,val)
            key_word_result = mycursor1.fetchall()
            key_word_result_len = len(key_word_result)

            #讀取13筆資料去判斷是否有下一頁
            mycursor2 = connection_object.cursor()
            # mycursor2 = new.cursor()
            sql2 = "select * from datas2 where category = %s or name like concat('%',%s,'%') limit %s,%s"
            val2 = (key_word , key_word , page_num * page_count_maxnum , page_count_maxnum+1)
            mycursor2.execute(sql2,val2)
            key_word_result2 = mycursor2.fetchall()
            key_word_result_len2 = len(key_word_result2)
            
            if key_word_result_len !=0:
                for i in range(key_word_result_len):
                    key_word_result[i] = list(key_word_result[i])
                    key_word_result[i][9] = key_word_result[i][9].split(" ")

                key_word_result_title = mycursor1.description
                key_word_result_title_name = [tit[0] for tit in key_word_result_title]

                key_word_data = []
                for i in range (key_word_result_len):
                    key_word_data.append(dict(zip(key_word_result_title_name,key_word_result[i])))

                if key_word_result_len2 >= page_count_maxnum :
                    response = jsonify({
                    "nextPage": page_num+1,
                    "data": key_word_data
                })
                else :
                    response = jsonify({
                    "nextPage": None,
                    "data": key_word_data
                })
                
            mycursor1.close()
            mycursor2.close()
    except mysql.connector.Error as err:  
        print(err)  
        response = jsonify({
        "error": True,
        "data": '沒有了'
        },500)
    finally:
        connection_object.close()
    return response

# attraction id API
@app.route('/api/attraction/<attractionId>',methods = ['GET'])
def api_attractionId(attractionId):
    id = attractionId
    response = ""
    connection_object = connection_pool.get_connection()
    try :
        if id != '' :
        #撈出id長度
            mycursor_len = connection_object.cursor()
            # mycursor_len = new.cursor() 
            sql = 'select id from datas2'
            mycursor_len.execute(sql)
            id_result_number = mycursor_len.fetchall()
            # mycursor_len.close()
            id_result_item = [res[0] for res in id_result_number ]
            id_result_len = len(id_result_item)
            # print(id_result_item)
            # print(type(id_result_item))
            mycursor_data = connection_object.cursor()
            # mycursor_data = new.cursor()
            sql2 = "select * from datas2 where id = %s"
            val2 = (id,)
            mycursor_data.execute(sql2,val2)
            id_result = mycursor_data.fetchone()
            
            # print(id_result==None)
        if id_result == None:
            response = jsonify({
            "error":True,
            "message": "景點編號不正確"
            })

        else :
            id_result = list(id_result)
            id_result[9] = id_result[9].split(" ")
            # print(id_result[9])
            
            id_result_title = mycursor_data.description
            id_column_name = [col[0] for col in id_result_title]
            
            id_result_data = []    
            id_result_data.append(dict(zip(id_column_name,id_result)))
            id_result_data = id_result_data[0]
            # mycursor_data.close()
    
            response = jsonify({	
                "data": id_result_data
            })

    except mysql.connector.Error as err : 
        print(err)
        response = jsonify({
            "error": True,
            "message": "錯誤"     
        },500)
    finally:
        connection_object.close()
    return response 

#categories api          
@app.route('/api/categories',methods = ['GET'])
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

# use signupData from frontend 
@app.route("/api/user", methods = ['POST'])
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
@app.route("/api/user/auth",methods=['PUT','GET','DElETE'])
def api_signinData():
    connection_object = connection_pool.get_connection()
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
                return success_token
            else:        
                return jsonify({
                    "error": True,
                    "message":"帳號密碼輸入錯誤"
                    })
            mycursor.close()             
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
                    return jsonify({
                        "data": {
                        "id":myresult_data[0] ,
                        "name":myresult_data[1] ,
                        "email":myresult_data[2]
                        }
                    })
            else:
                return jsonify({
                    "data": None
                })
        if request.method == "DELETE":
            get_token = request.cookies.get("token")
            if get_token != None:
                clear_cookie = jsonify({"ok": True})
                clear_cookie.set_cookie('token','',expires = 0)
                print (clear_cookie)
                return clear_cookie
            # else :
            #     return jsonify({
            #         "data": None
            #     })
    except mysql.connector.Error as err:
        print(err)
        return jsonify({
                "error" : True,
                "message" : "系統錯誤"
            },500)
    finally:
        connection_object.close()


app.run(host='0.0.0.0',port=3000)

