# AudioSync

**AudioSync** is a music streaming application designed to allow users to browse and stream songs, explore artists, and create playlists. Built with a **React** frontend and a **Flask** backend, AudioSync integrates withh the **Spotify API** and leverages **MySQL** for data storage.


## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Frontend](#frontend)
- [License](#license)


## Features

- **User Authentication**: Sign up, login, and session management.
- **Music Search**: Search for songs and artists.

# Project Structure

- **Frontend**: React, React Router, TypeScript
- **Backend**: Flask
- **Database**: MySQL
- **API Integration**: Spotify API
- **Other Tools**: Docker


## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) and npm (for frontend)
- [Python 3](https://www.python.org/) and pip (for backend)
- [Docker](https://www.docker.com/) (for containerized development)
- [MySQL](https://www.mysql.com/) (for data storage)

### Installation

1. **Clone the repository**:
	```bash
	git clone https://github.com/teogr99/audiosync.git
	cd audiosync
	```
2. **Setup Backend**:
	```bash
	cd backend
	pip3 install -r requirements.txt
	```
3. **Setup Frontend**:
	```bash
	cd ../frontend
	npm install
	```
4. **Setup DB**:
	```bash
	cd ../backend/scripts
	chmod +x setup_db.sh
	./setup_db.sh


