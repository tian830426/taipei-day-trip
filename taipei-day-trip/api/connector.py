import mysql.connector
import mysql.connector.pooling

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
