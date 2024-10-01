import mysql.connector
from mysql.connector import Error
from flask import current_app

def create_connection() -> None:
    """Create a connection to the MySQL database.

    :return: MySQL connection object if the connection is successful, None otherwise.
    """
    connection = None
    try:
         connection = mysql.connector.connect(
            host=current_app.config['DB_HOST'],
            user=current_app.config['DB_USER'],
            password=current_app.config['DB_PASSWORD'],
            database=current_app.config['DB_NAME']
         )
         if connection.is_connected():
            print("Connection to MySQL DB was successful")
    except Error as e:
        print(f"An error occured during connection: {e}")

    return connection

def close_connection(connection: mysql.connector.connection.MySQLConnection) -> None:
    """Close the given MySQL database connection.

    :param connection: The MySQL connection object to close.
    """

    if connection and connection.is_connected():
        connection.close()
        print("Connection to MySQL DB closed.")


def execute_query(connection: mysql.connector.connection.MySQLConnection, query: str) -> None:
    """Execute a given SQL query using the provided database connection.

    :param connection: The MySQL connection object to use for executing the query.
    :param query: The SQL query to execute.
    :return: None; commits the transaction if successful.
    """

    cursor = connection.cursor()
    try:
        cursor.execute(query)
        connection.commit()
        print("Query executed successfully")
    except Error as e:
        print(f"An error occured during query execution: {e}")