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


USE `byq8k2pc8zerxxbrtwut`;

-- Dumping data for table audiosync_db.songs
/*!40000 ALTER TABLE `songs` DISABLE KEYS */;
INSERT INTO `songs` (id, title, artist_id, album, duration, cover, is_playing) VALUES
    (1, 'Master of Puppets', 1, 'Master of Puppets', 515, NULL, false),                         -- !TODO! get a placeholder image to display in case spotify api fails
    (2, 'One', 1, '...And Justice for All', 447, NULL, false),                                 
    (3, 'Fade to Black', 1, 'Ride the Lightning', 417, NULL, false),
    (4, 'The Trooper', 2, 'Piece of Mind', 249, NULL, false),
    (5, 'Aces High', 2, 'Powerslave', 296, NULL, false),
    (6, 'Hallowed Be Thy Name', 2, 'The Number of the Beast', 431, NULL, true),
    (7, 'Schism', 3, 'Lateralus', 412, NULL, false),
    (8, 'Forty Six & Two', 3, 'Ænima', 402, NULL, false),
    (9, 'Sober', 3, 'Undertow', 311, NULL, false),
    (10, 'Run to the Hills', 2, 'The Number of the Beast', 300, NULL, false),
    (11, 'Fear of the Dark', 2, 'Fear of the Dark', 432, NULL, false),
    (12, 'Holy Wars... The Punishment Due', 4, 'Rust in Peace', 391, NULL, false),
    (13, 'Symphony of Destruction', 4, 'Countdown to Extinction', 244, NULL, false),
    (14, 'Chop Suey!', 5, 'Toxicity', 240, NULL, false),
    (15, 'Toxicity', 5, 'Toxicity', 212, NULL, false),
    (16, 'Stinkfist', 3, 'Ænima', 304, NULL, false),
    (17, 'Aenema', 3, 'Ænima', 315, NULL, true),
    (18, 'Enter Sandman', 1, 'Metallica', 331, NULL, false),
    (19, 'Creeping Death', 1, 'Ride the Lightning', 260, NULL, false),
    (20, 'Tornado of Souls', 4, 'Rust in Peace', 432, NULL, false),
    (21, 'Hangar 18', 4, 'Rust in Peace', 388, NULL, false),
    (22, 'Aerials', 5, 'Toxicity', 400, NULL, false),
    (23, 'B.Y.O.B.', 5, 'Mezmerize', 230, NULL, false),
    (24, 'The Pot', 3, '10,000 Days', 337, NULL, false),
    (25, 'Paranoid', 4, 'Peace Sells... But Whos Buying?', 212, NULL, false);

/*!40000 ALTER TABLE `songs` ENABLE KEYS */;

-- Dumping data for table audiosync_db.artists
/*!40000 ALTER TABLE `artists` DISABLE KEYS */;
INSERT INTO `artists` (id, name, followers, profile_picture) VALUES
    (1, 'Metallica', 100, NULL),
    (2, 'Iron Maiden', 150, NULL),
    (3, 'Tool', 200, NULL),
    (4, 'Megadeth', 120, NULL),
    (5, 'System of a Down', 180, NULL);
/*!40000 ALTER TABLE `artists` ENABLE KEYS */;

-- Dumping data for table audiosync_db.playlists
/*!40000 ALTER TABLE `playlists` DISABLE KEYS */;
INSERT INTO `playlists` (`id`, `title`, `owner`, `cover`, `edit_mode`, `is_public`, `created_at`, `updated_at`) VALUES
(1, 'Chill Vibes', 2, NULL, false, true, NOW(), NOW()),
(2, 'Workout Mix', 2, NULL, true, false, NOW(), NOW()),
(3, 'Throwback Hits', 2, NULL, false, true, NOW(), NOW());
/*!40000 ALTER TABLE `playlists` ENABLE KEYS */;

-- Dumping data for table audiosync_db.playlist_songs
/*!40000 ALTER TABLE `playlist_songs` DISABLE KEYS */;
INSERT INTO `playlist_songs` (`playlist_id`, `song_id`) VALUES
-- Songs for 'Chill Vibes' playlist
(1, 1),
(1, 2),
(1, 3),
-- Songs for 'Workout Mix' playlist
(2, 4),
(2, 5),
(2, 6),
-- Songs for 'Throwback Hits' playlist
(3, 2),
(3, 3),
(3, 4);
/*!40000 ALTER TABLE `playlist_songs` ENABLE KEYS */;




