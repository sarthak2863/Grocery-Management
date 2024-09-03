import mysql.connector

__cnx = None

def get_sql_connection():
    print("Opening MySQL connection")
    global __cnx

    if __cnx is None:
        try:
            __cnx = mysql.connector.connect(
                user='root', 
                password='root', 
                database='grocery_project', 
                host='localhost'  # Ensure you're connecting to the right host
            )
            print("Connection established")
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            __cnx = None  # Reset connection if an error occurs

    return __cnx
