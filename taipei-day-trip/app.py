from flask import *
#引入套件
from flask import Flask,request,render_template,redirect,session,url_for,make_response
import mysql.connector
import json
from flask import jsonify

app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

# #設定 session 密鑰
app.secret_key='tian12345'

# mysql.connector 引入方式
new = mysql.connector.connect(
  host="localhost",
  user="root",
  password="tian0426",
  database="taipeiDayTrip" 
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

#取得景點列表API
@app.route('/api/attractions',methods = ['GET'])
def api_attractions():
    page_num = request.args.get('page','')
    page_num = int(page_num)
    key_word = request.args.get('keyword','')
    
    #先判斷是否需要比對key_word還是單純page_num
    if key_word == '':
        #最多筆
        page_count_maxnum = 12
        #計算每頁從第幾筆開始撈
        page_count_stage = page_num * page_count_maxnum 
        mycursor = new.cursor()
        sql = "select * from datas2 limit %s,%s "
        val =(page_count_stage,page_count_maxnum)
        mycursor.execute(sql,val)
        count_result = mycursor.fetchall()
        print(count_result[0][9])
        count_result_len = len(count_result)
        # print(count_result_len)
        #處理資料庫型態
        for i in range(count_result_len):
            count_result[i]=list(count_result[i])
            count_result[i][9]=count_result[i][9].split(" ")
        

        count_result_title = mycursor.description
        result_title = [tit[0] for tit in count_result_title]
        count_data = []
        for i in range (count_result_len):
            count_data.append(dict(zip(result_title,count_result[i])))

        if count_result_len >= 12 :
            return jsonify({
            "nextPage": page_num+1,
            "data": count_data
        }) 
        elif count_result_len < 12 and count_result_len !=0 :
            return jsonify({
            "nextPage": None,
            "data": count_data
        })
        else :
            return jsonify({                              
            "error": True,
            "message": "沒有了"	
        })

    #判斷模糊比對及完全比對
    else:
        #最多筆
        page_count_maxnum = 12
        #計算每頁從第幾筆開始撈
        page_count_stage = page_num * page_count_maxnum

        #讀取12筆資料
        mycursor1 = new.cursor()
        sql = "select * from datas2 where category = %s or name like concat('%',%s,'%') limit %s,%s"
        val = (key_word , key_word , page_num * page_count_maxnum , page_count_maxnum)
        mycursor1.execute(sql,val)
        key_word_result = mycursor1.fetchall()
        key_word_result_len = len(key_word_result)

        #讀取13筆資料去判斷是否有下一頁
        mycursor2 = new.cursor()
        sql2 = "select * from datas2 where category = %s or name like concat('%',%s,'%') limit %s,%s"
        val2 = (key_word , key_word , page_num * page_count_maxnum , page_count_maxnum+1)
        mycursor2.execute(sql2,val2)
        key_word_result2 = mycursor2.fetchall()
        key_word_result_len2 = len(key_word_result2)
        
        if key_word_result_len !=0:
            for i in range(key_word_result_len):
                key_word_result[i]=list(key_word_result[i])
                key_word_result[i][9]=key_word_result[i][9].split(" ")

            key_word_result_title = mycursor1.description
            key_word_result_title_name = [tit[0] for tit in key_word_result_title]

            key_word_data = []
            for i in range (key_word_result_len):
                key_word_data.append(dict(zip(key_word_result_title_name,key_word_result[i])))

            if key_word_result_len2 >= page_count_maxnum :
                return jsonify({
                "nextPage": page_num+1,
                "data": key_word_data
            })
            else :
                return jsonify({
                "nextPage": None,
                "data": key_word_data
            })
        
        else :
            return jsonify({
            "error": True,
            "data": '沒有了'
        })

# #根據景點編號取得景點資料API
@app.route('/api/attraction/<attractionId>',methods = ['GET'])
def api_attractionId(attractionId):
    id = attractionId
    try :
        if id != '' :
        #撈出id長度
            mycursor_len = new.cursor() 
            sql = 'select id from datas2'
            mycursor_len.execute(sql)
            id_result_number = mycursor_len.fetchall()
            id_result_item = [res[0] for res in id_result_number ]
            id_result_len = len(id_result_item)
            # print(id_result_item)
            # print(type(id_result_item))
            mycursor_data = new.cursor()
            sql2 = "select * from datas2 where id = %s"
            val2 = (id,)
            mycursor_data.execute(sql2,val2)
            id_result = mycursor_data.fetchone()
            # print(id_result==None)
        if id_result == None:
            return jsonify({
            "error":True,
            "message": "景點編號不正確"
            })

        else :

            id_result =list(id_result)
            id_result[9]=id_result[9].split(" ")
            # print(id_result[9])
            
            id_result_title = mycursor_data.description
            id_column_name = [col[0] for col in id_result_title]
            
            id_result_data = []    
            id_result_data.append(dict(zip(id_column_name,id_result)))
            id_result_data = id_result_data[0]
    
            return jsonify({	
                "data": id_result_data
            })

    except : 
        return jsonify({
            "error": true,
            "message": "錯誤"     
        })
          
@app.route('/api/categories',methods = ['GET'])
def api_categories():
    try:
        mycursor = new.cursor()
        sql = "select distinct category from datas2 "
        mycursor.execute(sql)
        category_result = mycursor.fetchall()
        category_data = [cat[0] for cat in category_result]
        print(category_data)
        return jsonify({	
            "data": category_data
        })

    except TypeError :
        return jsonify({
        "error":True,
        "message":"型別錯誤"
    })

    except :
        return jsonify({
        "error":True,
        "message":"未定義"
    })

app.run(host='0.0.0.0',port=3000)

