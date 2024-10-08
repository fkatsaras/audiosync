from flask import jsonify
from app.models.api_response import ApiResponse
from typing import Dict, Any

def success_response(message: str, body: Dict[str, Any] | str =None, code: int = 200) -> tuple:
    """Utility function to create a success ApiResponse.

    :param message: Success message to return.
    :param body: Body of the response, typically the data being returned. Can have 
    JSON format (Dict[str, Any])  or just a simple string.
    :param code: HTTP status code, defaults to 200 OK.
    :return: Tuple containing the response data and the HTTP status code.
    """
    response = ApiResponse(
        code=code,
        type='success',
        message=message,
        body=body
    )
    return jsonify(response.to_dict()), code

def error_response(message: str, code: int = 404) -> tuple:
    """Utility function to create an error ApiResponse.

    :param message: Error message to return.
    :param code: HTTP status code, defaults to 404 Not Found.
    :return: Tuple containing the response data and the HTTP status code.
    """
    response = ApiResponse(
        code=code,
        type='error',
        message=message,
        body=None
    )
    return jsonify(response.to_dict()), code