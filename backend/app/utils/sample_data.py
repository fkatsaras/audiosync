from app.models.artist import Artist
from app.models.song import Song
from werkzeug.security import generate_password_hash

global user
# TEST : In-memory user store for demonstration --- Use a db in the future
user = {
    "testuser": generate_password_hash("ellipsis") 
}


artists_data = [
    Artist(id=1, name="Metallica", songs=['Master of Puppets', 'One', 'Fade to Black'], followers=100, is_followed=True),
    Artist(id=2, name="Iron Maiden", songs=['The Trooper', 'Aces High', 'Hallowed Be Thy Name'], followers=150, is_followed=False),
    Artist(id=3, name="Tool", songs=['Schism', 'Forty Six & Two', 'Sober'], followers=200, is_followed=True)
]

songs_data = [
    Song(
        id=1,
        title="Master of Puppets",
        artist="Metallica",
        album="Master of Puppets",
        duration=515,
        cover="https://example.com/covers/master_of_puppets.jpg",
        liked=True,
        playlists=[],  #  Populate this with Playlist objects
        is_playing=False
    ),
    Song(
        id=2,
        title="One",
        artist="Metallica",
        album="...And Justice for All",
        duration=447,
        cover="https://example.com/covers/and_justice_for_all.jpg",
        liked=False,
        playlists=[],
        is_playing=False
    ),
    Song(
        id=3,
        title="Fade to Black",
        artist="Metallica",
        album="Ride the Lightning",
        duration=417,
        cover="https://example.com/covers/ride_the_lightning.jpg",
        liked=True,
        playlists=[],
        is_playing=False
    ),
    Song(
        id=4,
        title="The Trooper",
        artist="Iron Maiden",
        album="Piece of Mind",
        duration=249,
        cover="https://example.com/covers/piece_of_mind.jpg",
        liked=True,
        playlists=[],
        is_playing=False
    ),
    Song(
        id=5,
        title="Aces High",
        artist="Iron Maiden",
        album="Powerslave",
        duration=296,
        cover="https://example.com/covers/powerslave.jpg",
        liked=False,
        playlists=[],
        is_playing=False
    ),
    Song(
        id=6,
        title="Hallowed Be Thy Name",
        artist="Iron Maiden",
        album="The Number of the Beast",
        duration=431,
        cover="https://example.com/covers/the_number_of_the_beast.jpg",
        liked=True,
        playlists=[],
        is_playing=True
    ),
    Song(
        id=7,
        title="Schism",
        artist="Tool",
        album="Lateralus",
        duration=412,
        cover="https://example.com/covers/lateralus.jpg",
        liked=True,
        playlists=[],
        is_playing=False
    ),
    Song(
        id=8,
        title="Forty Six & Two",
        artist="Tool",
        album="Ænima",
        duration=402,
        cover="https://example.com/covers/aenima.jpg",
        liked=False,
        playlists=[],
        is_playing=False
    ),
    Song(
        id=9,
        title="Sober",
        artist="Tool",
        album="Undertow",
        duration=311,
        cover="https://example.com/covers/undertow.jpg",
        liked=True,
        playlists=[],
        is_playing=False
    )
]