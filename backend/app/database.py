import mysql.connector
from mysql.connector import Error
from mysql.connector import IntegrityError
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

def execute_query(connection: mysql.connector.connection.MySQLConnection, query: str, values: tuple = None) -> list:
    """Execute a given SQL query using the provided database connection.

    :param connection: The MySQL connection object to use for executing the query.
    :param query: The SQL query to execute.
    :param values: A tuple of values to substitute into the query (if applicable).
    :return: The result of the query, or None if not applicable.
    """

    cursor = connection.cursor()
    try:
        cursor.execute(operation=query, params=values)  # Pass the values for parameterized query
        result = cursor.fetchall()  # Fetch all results
        connection.commit()  # Commit transaction
        print("Query executed successfully")
        return result  # Return the fetched results
    except Error as e:
        print(f"An error occurred during query execution: {e}")
        return None  # Return None on error
    finally:
        cursor.close()  # Ensure the cursor is closed