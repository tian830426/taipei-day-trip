from flask import *
#引入套件
from flask import Flask,request,render_template,redirect,session,url_for,make_response
import mysql.connector
import json
from flask import jsonify

app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

#設定 session 密鑰
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
	page_num = request.args.get('page',None)
	page_num = int(page_num) 
	key_word = request.args.get('keyword',None)

	mycursor = new.cursor()
	sql = "select * from datas"
	mycursor.execute(sql)
	item_result = mycursor.fetchall() 

	mycursor2 = new.cursor()
	sql2 = "select distinct category from datas"
	mycursor2.execute(sql2)
	category_result = mycursor2.fetchall() 
	category_data = [cat[0] for cat in category_result]

	# mytitle = mycursor.description
	# column_name =[col[0] for col in mytitle]
	# data = [dict(zip(column_name, list(row)))
	# for row in item_result]
	# data[images] = list(data[images])[0]
	
	# print(category_result)
	# print(type(category_result))
	
	# category_data=[]
	# for e in category_result:
	# 	category_data.append(str(e).replace("(","").replace(")","").replace(",","").replace("'","").replace("\\u3000",""))

	#取陣列的長度
	item_result_len = len(item_result)
	#取category的長度
	category_result_len = len(category_result)

	#完全比對
	if key_word != None and key_word in category_data:
		mycursor = new.cursor()
		sql2 = "select * from datas where category = %s "
		val2 = (key_word,)
		mycursor.execute(sql2,val2)
		new_category_result = mycursor.fetchall()
		new_category_result_len = len(new_category_result)
		item_result_len = new_category_result_len 
		item_result = new_category_result
	
	#模糊比對
	elif key_word != None :
		mycursor = new.cursor()
		sql3 = "select * from datas where name like concat('%',%s,'%')"
		val3 = (key_word,)
		mycursor.execute(sql3,val3)
		new_name_result = mycursor.fetchall()
		new_name_result_len = len(new_name_result)
		item_result_len = new_name_result_len
		item_result = new_name_result

	#have next page
	if page_num < (item_result_len//12) and page_num >= 0:
		mytitle = mycursor.description
		column_name = [col[0] for col in mytitle]
		data=[]
		for i in range((page_num)*12,(page_num+1)*12):
   			data.append(dict(zip(column_name,list(item_result[i]))))
		print(data)
		# data = [dict(zip(column_name, list(row)))for row in item_result]

		return jsonify({
			"nextPage": page_num+1,
			"data": data
		})

	#no next page
	elif page_num == (item_result_len//12) and item_result_len !=0 :
		mytitle = mycursor.description
		column_name = [col[0] for col in mytitle]
		# data = [dict(zip(column_name, list(row)))for row in item_result]
		data=[]
		for i in range((page_num)*12,item_result_len):
   			data.append(dict(zip(column_name,list(item_result[i]))))
		return jsonify({
			"nextPage": None,
			"data": data
		})
	
	else:
		return jsonify({
			"error": True,
			"message": "沒有了"
		})

#根據景點編號取得景點資料API
@app.route('/api/attractions/<attractionId>',methods = ['GET'])
def api_attractionId(attractionId):
	id = attractionId
	mycursor = new.cursor()
	sql ="select id from datas"
	mycursor.execute(sql)
	id_result = mycursor.fetchall()
	id_result_data = [str(id[0]) for id in id_result]
	# print(id_result_data)
	mycursor2 = new.cursor()
	sql2 = "select * from datas where id = %s"
	val = (id,)
	mycursor2.execute(sql2,val)
	id2_result = mycursor2.fetchall()
	try:
		if id != "" and id in id_result_data :
			return jsonify({	
				"data": id2_result
			})

		elif id not in id_result_data:
			return jsonify({
				"error":True,
				"message": "請輸入正確ID"
		})
	except:
		return jsonify({
		"error":True,
		"message": "壞掉了"
	})

@app.route('/api/categories',methods = ['GET'])
def api_categories():
	try:
		mycursor = new.cursor()
		sql = "select distinct category from datas "
		mycursor.execute(sql)
		category_result = mycursor.fetchall()
		category_data = [cat[0] for cat in category_result]
		# print(category_data)
		return jsonify({	
			"data": category_data
		})

	except:
		jsonify({
		"error":True,
		"message":"壞掉了"
	})

app.run(port=3000)