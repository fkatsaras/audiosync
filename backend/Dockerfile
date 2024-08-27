# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONBUFFERED 1

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt /app/
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . /app/

# Expose the apps port
EXPOSE 5000

# Set the command to run the application
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "wsgi:app"]
