FROM mysql:8.0

# Set env
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=se2_audiosync_db

# Copy init scripts
COPY ./prod /docker-entrypoint-initdb.d/

# Expose MySQL port
EXPOSE 3306