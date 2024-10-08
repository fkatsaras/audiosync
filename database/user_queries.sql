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

-- Creating stored procedure for registering a user
DELIMITER //

CREATE PROCEDURE `register_user` (
    IN `p_username` VARCHAR(255),
    IN `p_password_hash` VARCHAR(255),
    IN `p_email` VARCHAR(255),
    IN `p_first_name` VARCHAR(255),
    IN `p_last_name` VARCHAR(255),
    OUT `p_success` INT,
    OUT `p_message` VARCHAR(255)
)
BEGIN
    DECLARE `user_exists` INT;
    
    -- Check if username or email already exists
    SELECT COUNT(*) INTO `user_exists`
    FROM `users`
    WHERE `username` = `p_username` OR `email` = `p_email`;
    
    IF `user_exists` > 0 THEN
        SET `p_success` = 0;
        SET `p_message` = 'Username or email already exists';
    ELSE
        -- Insert new user
        INSERT INTO `users` (`username`, `password_hash`, `email`, `first_name`, `last_name`)
        VALUES (`p_username`, `p_password_hash`, `p_email`, `p_first_name`, `p_last_name`);
        
        SET `p_success` = 1;
        SET `p_message` = 'User registered successfully';
    END IF;
END //

DELIMITER ;

-- Creating stored procedure for logging in a user
DELIMITER //

CREATE PROCEDURE `login_user` (
    IN `p_username` VARCHAR(255),
    OUT `p_user_id` INT,                    -- WARNING: Order of the out params matters!
    OUT `p_password_hash` VARCHAR(255),
    OUT `p_success` INT,
    OUT `p_message` VARCHAR(255)
)
BEGIN
    DECLARE `user_exists` INT;
    
    -- Check if the user exists
    SELECT `password_hash`, `id` INTO `p_password_hash`, `p_user_id`
    FROM `users`
    WHERE `username` = `p_username`;
    
    IF p_password_hash IS NOT NULL THEN
        SET `p_success` = 1;
        SET `p_message` = 'User exists, password hash retrieved';
    ELSE
        SET `p_success` = 0;
        SET `p_message` = 'Invalid username';
    END IF;
END //

DELIMITER ;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
