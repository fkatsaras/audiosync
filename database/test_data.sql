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

USE `se2_audiosync_test_db`;

INSERT INTO `users` (id, username, password_hash, email, first_name, last_name, active) VALUES
    (1, 'testuser', '$2b$10$8bdHr3IRuVzVlYuM3snSH.O4818FsouWxXrHOKd036L2dwxWqVcrm', 'test@test.com', 'test_last_name', 'test_first_name', 1),
    (3, 'existinguser', '$2b$10$QLBiJ7oGDUExHPPkPL7NWuiVSXC6IOMMT2ELzXz09Zq6AQ4..iQ5i', 'existinguser@example.com', 'Existing', 'User', 1)