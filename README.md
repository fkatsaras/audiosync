# AudioSync

**AudioSync** is a music streaming application designed to allow users to browse and stream songs, explore artists, and create playlists. Built with a **React** frontend and a **Express** backend using **OpenAPI**, AudioSync integrates with the **Spotify API** and leverages **MySQL** for data storage.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Frontend](#frontend)
- [License](#license)

## Features

- **User Authentication**: Sign up, login, and session management.
- **Music Search**: Search for songs and artists.
- **Playlist Management**: Create and manage personal playlists.
- **Artist Pages**: Explore artist profiles, including their albums and top tracks.
- **Responsive Design**: Fully responsive interface for mobile and desktop views.

## Technologies Used

- **Frontend**: React, React Router, Webpack, styled-components.
- **Backend**: Node.js, Express, OpenAPI, JWT for authentication.
- **Database**: MySQL for data storage.
- **External APIs**: Spotify API for streaming music.
- **Development Tools**: Swagger for API documentation.

## Getting Started

### Without Docker
If you prefer to run the application without Docker, follow the steps below for each component:

#### Backend 

1. Clone the repository:
   ```bash
   git clone https://github.com/teogr99/audiosync.git
   ```
2. Make sure you have MySQL installed and running.
3. Set up the database by running the SQL scripts in the `database/prod` folder.

4. Install backend dependencies
    ```bash
    cd backend
    npm install
    ```

5. Set up the environment variables by creating a .env file in the backend directory and adding the following variables:
    ```bash
    MYSQL_HOST
    MYSQL_PORT
    MYSQL_USER
    MYSQL_PASSWORD
    MYSQL_DATABASE
    JWT_SECRET
    ```
5. Start the backend server:
    ```bash
    npm start
    ```

### Frontend
1. Make sure your backend server is running on `http://localhost:5000`.

2. Install frontend dependencies:
    ```bash
    cd frontend
    npm install
    ```

3. Set up environment variables for the frontend:
    Create a `.env` file in the `frontend` directory and add the following:
    ```bash
    REACT_APP_API_URL=http://localhost:5000
    ```

4. Start the frontend application:
    ```bash
    npm start
    ```

    This will run the React app on `http://localhost:3000`.

#### With Docker

1. Clone the repository:
   ```bash
   git clone https://github.com/teogr99/audiosync.git
   ```

2. Navigate to the project root directory
    ```bash
    cd audiosync
    ```
3. Build and start the services using Docker Compose:
    ```bash
    docker-compose up --build
    ```

This will start the following services:

- **MySQL** (database)
- **Backend** (Express server)
- **Frontend** (React app)

4. The backend will be available at http://localhost:5000, and the frontend will be available at http://localhost:3000



   