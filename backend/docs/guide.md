# Configure MySQL extension for VS Code

After creating the root user and running setup_db.sh
If you get an error when setting up the DB connection:

Run the following command in wsl:

sudo mysql -u  root -p

mysql> ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';

mysql> FLUSH PRIVILEGES;

sudo systemctl restart mysql