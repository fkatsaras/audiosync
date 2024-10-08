-- --------------------------------------------------------
-- Server:                  127.0.0.1
-- Server Version:          8.0.25 - MySQL Community Server - GPL
-- Operating System:        Linux
-- HeidiSQL Version:        11.2.0.6213
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


USE `audiosync_db`;

-- Dumping data for table audiosync_db.songs
/*!40000 ALTER TABLE `songs` DISABLE KEYS */;
INSERT INTO `songs` (id, title, artist_id, album, duration, cover, liked, playlists, is_playing) VALUES
    (1, 'Master of Puppets', 1, 'Master of Puppets', 515, NULL, true, '[]', false),                         -- !TODO! get a placeholder image to display in case spotify api fails
    (2, 'One', 1, '...And Justice for All', 447, NULL, false, '[]', false),                                 
    (3, 'Fade to Black', 1, 'Ride the Lightning', 417, NULL, true, '[]', false),
    (4, 'The Trooper', 2, 'Piece of Mind', 249, NULL, true, '[]', false),
    (5, 'Aces High', 2, 'Powerslave', 296, NULL, false, '[]', false),
    (6, 'Hallowed Be Thy Name', 2, 'The Number of the Beast', 431, NULL, true, '[]', true),
    (7, 'Schism', 3, 'Lateralus', 412, NULL, true, '[]', false),
    (8, 'Forty Six & Two', 3, 'Ænima', 402, NULL, false, '[]', false),
    (9, 'Sober', 3, 'Undertow', 311, NULL, true, '[]', false);
/*!40000 ALTER TABLE `songs` ENABLE KEYS */;

-- Dumping data for table audiosync_db.artists
/*!40000 ALTER TABLE `artists` DISABLE KEYS */;
INSERT INTO `artists` (id, name, followers, profile_picture) VALUES
    (1, 'Metallica', 100, NULL),
    (2, 'Iron Maiden', 150, NULL),
    (3, 'Tool', 200, NULL);
/*!40000 ALTER TABLE `artists` ENABLE KEYS */;