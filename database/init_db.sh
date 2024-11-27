#!/bin/bash

# Setting default values for DB connection
DB_HOST=${DB_HOST:-audiosync_db}
DB_PORT=${DB_PORT:-3306}
DB_USER=${DB_USER:-root}
DB_PASSWORD=${DB_PASSWORD:-root}
DB_NAME=${DB_NAME:-se2_audiosync_db}

# Function to execute an SQL file
execute_sql_file() {
    local file=$1
    echo "Executing $file..."
    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$file"
}

# Check if mysql client is installed
if ! command -v mysql &> /dev/null; then
    echo "Error: MySQL client not found. Please install it to run this script."
    exit 1
fi

# Function to check if MySQL is ready
wait_for_mysql() {
    echo "Waiting for MySQL to be ready..."
    until mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1;" > /dev/null 2>&1; do
        echo "Waiting for MySQL..."
        sleep 5
    done
    echo "MySQL is ready!"
}

# Wait for MySQL to be ready
wait_for_mysql

# Create the db if it doesnt exist
echo "Creating Database $DB_NAME if not exists..."
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"

# Execut initialization files
# Execute SQL files in order
execute_sql_file "create_tables.sql"
execute_sql_file "seed_data.sql"
execute_sql_file "user_queries.sql"

echo "Database initialiation completed."