from flask import *
import mysql.connector
import mysql.connector.pooling
import json
import jwt
from api.connector import connection_pool

attraction_api = Blueprint("attraction_api",__name__)

@attraction_api.route('/api/attractions',methods = ['GET'])
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


@attraction_api.route('/api/attraction/<attractionId>',methods = ['GET'])
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
