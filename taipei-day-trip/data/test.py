import json
import mysql.connector

# with open("taipei-attractions.json", "r" , encoding="utf-8") as response:
#     data = json.load(response)  #利用json模組處理json資料格式
# for item in data['result']['results']:
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
           
# new = mysql.connector.connect(
#   host="localhost",
#   user="root",
#   password="tian0426",
#   database="taipeiDayTrip" 
# )


# with open("taipei-attractions.json", "r" , encoding="utf-8") as response:
#     data = json.load(response)  
# for item in data['result']['results']:
#     itemLen = len(data['result']['results']) 
#     fileLen = len(item['file'].lower().split('https'))
#     new_file = []
#     for i in range(0,fileLen):
#         file_format = "https"+item['file'].lower().split('https')[i]          
#         if ".jpg" in file_format:    
#             new_file.append(file_format) 
    
#     new_file = str(new_file)
#     # .replace("[","").replace("]","").replace(",","").replace("'","")
#     print(new_file)
#     item['file'] = new_file
    # print(item['file'])

    #增加資料到資料夾
    # mycursor = new.cursor()
    # sql = "INSERT INTO datas(id, name, category, description, address, transport, mrt, lat, lng, images) VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    # val=(item['_id'], item['name'], item['CAT'].replace(" ",""), item['description'], item['address'], item['direction'], item['MRT'], item['latitude'], item['longitude'], str(item['file']))
    # mycursor.execute(sql,val)
    # new.commit()

    # 創建第二個資料庫 attraction
    # create table attraction(id int ,
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
    # sql = "INSERT INTO attraction(id, name, category, description, address, transport, mrt, lat, lng, images) VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
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


    #創建 user資料表
    # create table user(
    # id_people bigint PRIMARY KEY AUTO_INCREMENT,
    # name varchar(255) NOT NULL,
    # email varchar(255) NOT NULL,
    # password varchar(255)  NOT NULL
    # );
    
    #創建 reservation資料表
    # create table reservation(
    # id bigint PRIMARY KEY AUTO_INCREMENT,
    # attrcactionId varchar(255) NOT NULL, 
    # date varchar(255) NOT NULL,
    # time varchar(255) NOT NULL,
    # price varchar(255)  NOT NULL
    # );
    
    #刪除前十筆資料
    # delete from information where id in(select top 10 id from information  order by id)
    
    #檢視 資料夾欄位    
    # describe table ;
    
    #更改欄位 姓名
    #ALTER TABLE userinformation RENAME COLUMN username TO email;
    
    #更改資料夾 姓名
    # RENAME TABLE old_table TO new_table;


    #創建 order 資料表
    # create table cart(
    # id bigint PRIMARY KEY AUTO_INCREMENT,
    # order_number varchar(255) NOT NULL,
    # order_price varchar(255) NOT NULL,
    # attraction_Id varchar(255) NOT NULL,
    # attraction_loction varchar(255)  NOT NULL,
    # attraction_address varchar(255) NOT NULL, 
    # attraction_image varchar(255) NOT NULL,
    # trip_date varchar(255) NOT NULL,
    # trip_time varchar(255)  NOT NULL,
    # contact_name varchar(255) NOT NULL, 
    # contact_email varchar(255) NOT NULL,
    # contact_phone varchar(255) NOT NULL,
    # status varchar(255) NOT NULL
    # );
    
    # create table cart(
    # id bigint PRIMARY KEY AUTO_INCREMENT,
    # status varchar(255),
    # payment_status varchar(255),
    # order_number varchar(255) NOT NULL,
    # order_price varchar(255) NOT NULL,
    # attraction_Id varchar(255) NOT NULL,
    # attraction_image varchar(255) NOT NULL,
    # trip_date varchar(255) NOT NULL,
    # trip_time varchar(255)  NOT NULL,
    # contact_name varchar(255) NOT NULL, 
    # contact_email varchar(255) NOT NULL,
    # contact_phone varchar(255) NOT NULL
    # );
    
    #測試 number 自動生成 
    
    # create table happy(
    # id bigint PRIMARY KEY AUTO_INCREMENT,
    # order_number varchar(255) NOT NULL,
    # contact_email varchar(255) NOT NULL
    # );
    # insert into happy(order_number, contact_email) values (CONCAT(DATE_FORMAT(now(),'%Y%m%d%s'),LPAD(LAST_INSERT_ID()+1,4,'0')),CONCAT(DATE_FORMAT(now(),'%Y%m%d%s'),LPAD(LAST_INSERT_ID()+1,8,'0')));








