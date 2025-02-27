# Backend Project

This is a Node.js backend project built with TypeScript. Below are instructions for setup, scripts, and usage.

## Features
- TypeScript for strongly typed development.
- ESLint & Prettier for linting and code formatting.
- Nodemon for development with auto-restarts.
- Support for local, development, and production environments.

## Prerequisites

Before you begin, ensure that you have the following installed:

- **Node.js** (v18.x or higher)
  - Download and install Node.js from [here](https://nodejs.org/).
  
- **MongoDB** (locally or via a cloud service like MongoDB Atlas)
  - If using MongoDB locally, download and install from [here](https://www.mongodb.com/try/download/community).
  - Alternatively, use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for a cloud instance.


## Installation
git clone git@github.com:lokesh75way/user-basic-auth.git && cd backend && npm install

## Scripts
- `npm run local`: Start the server with nodemon for development.
- `npm start`: Start the server in local mode using ts-node.
- `npm run dev`: Build the project and run the server in development mode.
- `npm run prod`: Build the project and run the server in production mode.
- `npm run build`: Compile TypeScript to JavaScript in the `dist` folder.
- `npm run lint`: Run ESLint to find code issues.
- `npm run lint:fix`: Automatically fix linting issues.
- `npm run format`: Format code using Prettier.
- `npm run format:check`: Check code formatting with Prettier.


## env vaiables

PORT = 8000
JWT_ACCESS_SECRET = "TOP_SECRET"
JWT_REFRESH_SECRET = "TOP_SECRET"
MONGODB_URI = "mongodb://localhost:27017/test_db"
