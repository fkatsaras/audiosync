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
INSERT INTO `songs` (`id`, `title`, `artist`, `album`, `duration`, `cover`, `liked`, `playlists`, `is_playing`) VALUES
    (1, 'Master of Puppets', 'Metallica', 'Master of Puppets', 515, 'https://example.com/covers/master_of_puppets.jpg', TRUE, '[]', FALSE),
    (2, 'One', 'Metallica', '...And Justice for All', 447, 'https://example.com/covers/and_justice_for_all.jpg', FALSE, '[]', FALSE),
    (3, 'Fade to Black', 'Metallica', 'Ride the Lightning', 417, 'https://example.com/covers/ride_the_lightning.jpg', TRUE, '[]', FALSE),
    (4, 'The Trooper', 'Iron Maiden', 'Piece of Mind', 249, 'https://example.com/covers/piece_of_mind.jpg', TRUE, '[]', FALSE),
    (5, 'Aces High', 'Iron Maiden', 'Powerslave', 296, 'https://example.com/covers/powerslave.jpg', FALSE, '[]', FALSE),
    (6, 'Hallowed Be Thy Name', 'Iron Maiden', 'The Number of the Beast', 431, 'https://example.com/covers/the_number_of_the_beast.jpg', TRUE, '[]', TRUE),
    (7, 'Schism', 'Tool', 'Lateralus', 412, 'https://example.com/covers/lateralus.jpg', TRUE, '[]', FALSE),
    (8, 'Forty Six & Two', 'Tool', 'Ænima', 402, 'https://example.com/covers/aenima.jpg', FALSE, '[]', FALSE),
    (9, 'Sober', 'Tool', 'Undertow', 311, 'https://example.com/covers/undertow.jpg', TRUE, '[]', FALSE);
/*!40000 ALTER TABLE `songs` ENABLE KEYS */;

-- Dumping data for table audiosync_db.artists
/*!40000 ALTER TABLE `artists` DISABLE KEYS */;
INSERT INTO `artists` (`id`, `name`, `songs`, `followers`, `is_followed`) VALUES
    (1, 'Metallica', '[1, 2, 3]', 100, TRUE),
    (2, 'Iron Maiden', '[4, 5, 6]', 150, FALSE),
    (3, 'Tool', '[7, 8, 9]', 200, TRUE);
/*!40000 ALTER TABLE `artists` ENABLE KEYS */;