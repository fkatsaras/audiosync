import connexion
import six

from app.models.home_page_response import HomePageResponse  # noqa: E501
from swagger_server import util


def home_get():  # noqa: E501
    """Get Home Page GUI

    Retrieve the home page GUI data # noqa: E501


    :rtype: HomePageResponse
    """
    return 'do some magic!'
