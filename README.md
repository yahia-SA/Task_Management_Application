# Task Management Application

A simple full-stack task management application built for a Junior Software Engineer technical assessment.

## Tech Stack

- **Backend**: Node.js, Express, SQLite, Sequelize
- **Frontend**: React (Vite), Axios, CSS
- **Authentication**: JWT (JSON Web Tokens)

## Project Structure

- `backend/`: REST API server
- `frontend/`: React client application

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### 1. Backend Setup

```bash
cd backend
npm install
npm run dev
```

The server will start on `http://localhost:3000`.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The client will start on `http://localhost:5173`.

## API Endpoints

### Authentication

- `POST /auth/register`: Register a new user
- `POST /auth/login`: Login and receive a JWT

### Tasks (Protected)

- `GET /tasks`: Get all tasks for the logged-in user
- `POST /tasks`: Create a new task
- `PUT /tasks/:id`: Update a task status
- `DELETE /tasks/:id`: Delete a task

## API Documentation

Interactive Swagger API documentation is available at: http://localhost:3000/docs

## Assumptions

- Users can only see and manage their own tasks.
- No password recovery mechanism is implemented.
- Database is SQLite (file-based) for simplicity.
