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

-- Dumping structure for table audiosync_db.users
CREATE TABLE IF NOT EXISTS `users` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    `first_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    `last_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    `active` boolean NOT NULL DEFAULT true,
    PRIMARY KEY (`id`),
    UNIQUE KEY (`username`),
    UNIQUE KEY (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exported was unselected

-- Dumping structure for table audiosync_db.artists
CREATE TABLE IF NOT EXISTS `artists` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `followers` int unsigned NOT NULL,
  `profile_picture` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exported was unselected

-- Dumping structure for table audiosync_db.songs
CREATE TABLE IF NOT EXISTS `songs` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `artist_id` INT UNSIGNED NOT NULL,  -- Foreign key for artist
  `album` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `duration` int NOT NULL,
  `cover` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `playlists` json DEFAULT NULL,        -- !TODO! when creating the playlist table , the playlist column must be replaced with playlist id (FOREIGN KEY)
  `is_playing` boolean NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_artist` FOREIGN KEY (`artist_id`) REFERENCES `artists` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table audiosync_db.liked_songs
CREATE TABLE IF NOT EXISTS `liked_songs` (
  `user_id` int unsigned NOT NULL,
  `song_id` int unsigned NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`song_id`) REFERENCES `songs`(`id`) ON DELETE CASCADE,
  PRIMARY KEY (`user_id`, `song_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exported was unselected

-- Dumping structure for table audiosync_db.followed_artists
CREATE TABLE IF NOT EXISTS `followed_artists` (
    `user_id` int unsigned NOT NULL,
    `artist_id` int unsigned NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON DELETE CASCADE,
    PRIMARY KEY (`user_id`, `artist_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exported was unselected
