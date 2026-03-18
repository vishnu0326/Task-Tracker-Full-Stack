# Task Tracker Full Stack Application

A full stack task tracking application built to practice real-world development using React, FastAPI, MongoDB, Redis, and Docker.

## Features

- Create tasks
- View tasks
- Edit task title and description
- Toggle task status between pending and completed
- Delete tasks
- Filter tasks by status
- Dashboard cards for total, completed, and pending tasks
- Redis caching for task list
- Dockerized backend services

## Tech Stack

### Frontend
- React
- Vite
- Axios
- Tailwind CSS

### Backend
- FastAPI
- Python

### Database and Cache
- MongoDB
- Redis

### DevOps
- Docker
- Docker Compose

## Project Structure

```text
AssignmentProject/
├── backend/
├── frontend/
├── docker-compose.yml
├── .gitignore
└── README.md

How to Run the Project
1. Start backend, MongoDB, and Redis
Run from the project root:

docker compose up --build -d
2. Start frontend
Open another terminal:

cd frontend
npm install
npm run dev
3. Open the application
Frontend:

http://localhost:5173
Backend API docs:

http://localhost:8080/docs