import json
import mysql.connector

with open("taipei-attractions.json", "r" , encoding="utf-8") as response:
    data = json.load(response)  #利用json模組處理json資料格式
for item in data['result']['results']:
    # print(item["file"])
    # print(item['_id'])
    # print(item['name'])
    # print(item['CAT'])
    # print(item['description'])
    # print(item['address'])
    # print(item['direction'])
    # print(item['MRT'])
    # print(item['latitude'])
    # print(item['longitude'])
           
new = mysql.connector.connect(
  host="localhost",
  user="root",
  password="tian0426",
  database="taipeiDayTrip" 
)

with open("taipei-attractions.json", "r" , encoding="utf-8") as response:
    data = json.load(response)  
for item in data['result']['results']:
    itemLen = len(data['result']['results']) 
    fileLen = len(item['file'].lower().split('https'))
    new_file = []
    for i in range(0,fileLen):
        file_format = "https"+item['file'].lower().split('https')[i]          
        if ".jpg" in file_format:    
            new_file.append(file_format) 
    
    
    new_file = str(new_file)
    # .replace("[","").replace("]","").replace(",","").replace("'","")
    print(new_file)
    item['file'] = new_file
    # print(item['file'])

    #增加資料到資料夾
    # mycursor = new.cursor()
    # sql = "INSERT INTO datas(id, name, category, description, address, transport, mrt, lat, lng, images) VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    # val=(item['_id'], item['name'], item['CAT'].replace(" ",""), item['description'], item['address'], item['direction'], item['MRT'], item['latitude'], item['longitude'], str(item['file']))
    # mycursor.execute(sql,val)
    # new.commit()

    # 創建第二個資料庫 datas2
    # create table datas2(id int ,
    # name varchar(255) ,
    # category varchar(255) ,
    # description TEXT,
    # address varchar(255) ,
    # transport varchar(255) ,
    # mrt varchar(255) ,
    # lat float ,
    # lng  float ,
    # images TEXT);

    #增加資料到資料夾  
    # mycursor = new.cursor()
    # sql = "INSERT INTO datas2(id, name, category, description, address, transport, mrt, lat, lng, images) VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    # val=(item['_id'], item['name'], item['CAT'].replace(" ",""), item['description'], item['address'], item['direction'], item['MRT'], item['latitude'], item['longitude'], item['file'])
    # mycursor.execute(sql,val)
    # new.commit()

    # 判斷型別
    # print(type(item['CAT']))  
    # print(type(item['file'])) 
    # print(type(str(item['file']) ) ) 

    # mysql报错：1406, "Data too long for column
    # 參考資料：http://huanyouchen.github.io/2018/05/22/mysql-error-1406-Data-too-long-for-column/
    # SET @@global.sql_mode= '';






