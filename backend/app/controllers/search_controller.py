from flask import jsonify
from app.models.api_response import ApiResponse
from app.models.search_result import SearchResult
from app.utils.sample_data import artists_data  # TEST: Use a DB in the future
from app.utils.sample_data import songs_data # TEST: Use a DB in the future

def search_artists_get(q):  # noqa: E501
    """Search for artists

    Retrieve search results for artists based on query # noqa: E501

    :param q: Search query string for artists
    :type q: str

    :rtype: ApiResponse
    """
    try:
        # Filter artists by search query
        matching_artists = [artist for artist in artists_data if q.lower() in artist.name.lower()]

        # If no artists found, return an error ApiResponse
        if not matching_artists:
            response = ApiResponse(
                code=404,
                type='error',
                message=f"No artists found for query: {q}"
            )
            return jsonify(response.to_dict()), 404
        
        # If artists found, create a SearchResult and return success ApiResponse
        search_result = SearchResult(artists=matching_artists)
        response = ApiResponse(
            code=200,
            type='success',
            message="Artists found successfully"
        )
        return jsonify({
            'response': response.to_dict(),
            'data': search_result.to_dict() 
        }), 200

    except Exception as e:
        # Handle unexpected errors
        response = ApiResponse(
            code=500,
            type='error',
            message=f"An error occurred: {str(e)}"
        )
        return jsonify(response.to_dict()), 500


def search_songs_get(q):  # noqa: E501
    """Search for songs

    Retrieve search results for songs based on query # noqa: E501

    :param q: Search query string for songs
    :type q: str

    :rtype: ApiResponse
    """
    try:
        # Placeholder for matching songs logic
        matching_songs = [song for song in songs_data if q.lower() in song.title.lower()]

        if not matching_songs:
            response = ApiResponse(
                code=404,
                type='error',
                message=f"No songs found for query: {q}"
            )
            return jsonify(response.to_dict()), 404

        # Create a SearchResult with the matching songs (if applicable)
        search_result = SearchResult(songs=matching_songs)  

        response = ApiResponse(
            code=200,
            type='success',
            message="Songs found successfully"
        )
        return jsonify({
            'response': response.to_dict(),
            'data': search_result.to_dict()
        }), 200

    except Exception as e:
        response = ApiResponse(
            code=500,
            type='error',
            message=f"An error occurred: {str(e)}"
        )
        return jsonify(response.to_dict()), 500