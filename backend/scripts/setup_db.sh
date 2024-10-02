#!/bin/bash
sudo service mysql start

# Log in and create the database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS audiosync_db;"

# Import relevant files
mysql -u root -p audiosync_db < ../../database/tables.sql

# Insert test data into DB
mysql -u root -p audiosync_db < ../../database/data.sql

# Insert stored procedures into DB
mysql -u root -p audiosync_db < ../../database/user_queries.sql