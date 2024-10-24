# AI Quizzer - Backend

AI Quizzer implements a backend solution for managing quizzes, user submissions, and email notifications using Node.js, Express.js, MongoDB, and Nodemailer.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)

## Features

- **Quiz Generation**: Automatically generate quizzes using Groq AI based on specified parameters such as grade, subject, and difficulty level.
- **Quiz Submission**: Allow users to submit their quiz answers and calculate scores based on correct responses.
- **Email Notifications**: Send email notifications to users with quiz suggestions and scores.
- **User Authentication**: Secure endpoints using JWT authentication to ensure only authorized users can access protected routes.
- **Database Integration**: Store quiz data and user submissions in MongoDB for persistence.

## Technologies Used

- **Node.js**: Server-side JavaScript runtime environment.
- **Express.js**: Web application framework for Node.js.
- **MongoDB**: NoSQL database for storing quiz data and user submissions.
- **Mongoose**: MongoDB object modeling for Node.js.
- **Nodemailer**: Module for sending emails from Node.js applications.
- **Groq SDK**: API client for integrating with Groq AI services.
- **JWT**: JSON Web Token for user authentication and authorization.

## Setup Instructions

### Prerequisites

- Node.js installed on your local machine.
- MongoDB Atlas account or local MongoDB server running.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your/repository.git
   ```

2. Install dependencies:

   ```bash
   cd backend
   npm install
   ```

### Environment Variables

Create a `.env` file in the root directory of your project. Add the following environment variables:

```plaintext
PORT=5000
DATABASE_URL=your_mongodb_uri
JWT_SECRET=your_jwt_secret_here
EMAIL_USER=your_email_Id
EMAIL_PASS=your_email_password
GROQ_API_KEY=your_groq_api_key
```

### Running the Application

Start the application in development mode:

```bash
nodemon server.js
```

## API Endpoints

### Authentication

- **POST /api/auth/register**: Register a new user.
- **POST /api/auth/login**: Login and receive a JWT token for authentication.

### Quiz Management

- **POST /api/quiz/generate**: Generate a new quiz.
- **POST /api/quiz/submit**: Submit quiz responses.
- **GET /api/quiz/:id**: Retrieve a specific quiz by ID.

### Submission Management

- **GET /api/submissions/past**: Retrieve past quiz submissions for the authenticated user.

### Email Notifications

- **POST /api/user/mail**: Send quiz suggestions and scores to the user via email.

## Contributing

Contributions are welcome! Fork the repository and submit a pull request with your changes.

---
