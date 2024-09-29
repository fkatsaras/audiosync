from app.models.artist import Artist
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