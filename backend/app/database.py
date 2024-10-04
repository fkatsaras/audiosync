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
    :return: The result of the query as a list of dictionaries, or None if not applicable.

    Example return (for a SELECT query):
    
    [
        {
            'id': 1,
            'title': 'Song Title 1',
            'artist_id': 101,
            'album': 'Album Name',
            'duration': 240,
            'cover': 'cover_url',
            'liked': 1,
            'playlists': 2,
            'is_playing': 0
        },
        {
            'id': 2,
            'title': 'Song Title 2',
            'artist_id': 102,
            'album': 'Another Album',
            'duration': 210,
            'cover': 'cover_url_2',
            'liked': 0,
            'playlists': 1,
            'is_playing': 0
        }
    ]
    """

    # Use the DictCursor to return results as dictionaries
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute(operation=query, params=values)  # Pass the values for parameterized query
        result = cursor.fetchall()  # Fetch all results
        connection.commit()  # Commit transaction
        # print("Query executed successfully: " + query)
        return result  # Return the fetched results as a list of dictionaries
    except mysql.connector.Error as e:
        print(f"An error occurred during query execution: {e}")
        return None  # Return None on error
    finally:
        cursor.close()  # Ensure the cursor is closed

def call_procedure(connection: mysql.connector.connection.MySQLConnection, procedure_name: str, in_params: tuple, out_params: list) -> tuple:
    """
    Calls a stored procedure with IN and OUT parameters and fetches the OUT parameters from the result.

    :param connection: The database connection object
    :param procedure_name: The name of the stored procedure to call
    :param in_params: A tuple containing the input parameters to pass to the procedure
    :param out_params: A list of output parameter names (strings) to retrieve from the procedure
    :returns: A tuple containing the output parameter values in the same order as the out_params list
    :raises: Any exceptions that occur during database interaction

    Example return:
    
    If the stored procedure returns two OUT parameters, 'out_param1' and 'out_param2':

    Stored procedure call:
    CALL my_procedure(?, ?, @out_param1, @out_param2);

    Result:
    ('value1', 'value2')

    Dictionary format from the intermediate result:
    [
        {
            '@out_param1': 'value1',
            '@out_param2': 'value2'
        }
    ]
    """
    try:
        # Prepare the call for IN parameters placeholders
        in_placeholders = ', '.join(['%s'] * len(in_params))
        # Prepare the call for OUT parameters placeholders
        out_placeholders = ', '.join([f"@{param}" for param in out_params])
        
        # Configure the procedure query with both IN and OUT parameters
        query = f"CALL {procedure_name}({in_placeholders}, {out_placeholders});"

        # Execute procedure query using the execute_query function
        execute_query(connection=connection, query=query, values=in_params)

        # Fetch the OUT parameters from the procedure
        output_result = execute_query(
            connection=connection,
            query=f"SELECT {', '.join([f'@{param}' for param in out_params])};"
        )

        # Return the OUT parameters if available
        if output_result:
            # Ensure the result is a dictionary, then extract the OUT parameters in the correct order
            out_values = tuple(output_result[0][f"@{param}"] for param in out_params)
            return out_values
        else:
            raise RuntimeError(f"No output returned from procedure {procedure_name}")

    except Exception as e:
        raise RuntimeError(f"Error calling stored procedure {procedure_name}: {str(e)}")
