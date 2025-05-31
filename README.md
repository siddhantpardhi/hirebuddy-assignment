# HireBuddy

HireBuddy is a full-stack job board web application where users can search and explore job listings, upload resumes, and get AI-based job role predictions for personalized search suggestions.

---

## Features

- Intelligent job search with filters (location, source)
- Resume upload with ML-based job role prediction
- Infinite scrolling for job listings
- Redis-based caching for performance
- Filter metadata fetched dynamically (location, sources)
- Secure backend built with Express, MongoDB, and Redis
- Modern frontend using React + Tailwind CSS

---

## Project Structure
```
hirebuddy-assignment/
├── client/ # React Frontend
├── server/ # Node.js + Express + MongoDB Backend
└── README.md # You're here
```

---

## Tech Stack

| Layer        | Technology                            |
|--------------|----------------------------------------|
| Frontend     | React, Tailwind CSS, Axios             |
| Backend      | Node.js, Express.js, MongoDB, Redis    |
| AI/ML        | Job role prediction model (TBA)        |
---

## Local Development

### 1. Clone the Repository

```bash
git clone https://github.com/siddhantpardhi/hirebuddy-assignment.git
cd hirebuddy-assignment
```

### 2. Setup Environment Variables
Backend(/server/.env)

```
PORT=
MONGODB_URI=
CORS_ORIGIN =
#NODE_ENV=development
COHERE_API_KEY=
```

Frontend(/client/.env)
```
VITE_API_BASE_URL=
```

### 3. Connect to Redis

```
docker run --name redis-local -p 6379:6379 -d redis
```
### 4. Install Dependencies

Server
```
cd server
npm install
npm run start
```

Client
```
cd client
npm install
npm run dev
```

### 5. Populate the Database

```
cd server
node ./src/scripts/loadjobs.js
```

## API Endpoints

/api/v1/jobs/search
```
GET: Search for jobs based on query, location, and source

Query params: query, location, source, page
```

/api/v1/jobs/upload-resume
```
POST: Upload resume and predict job role
```
/api/v1/meta/filters
```
GET: Returns available filters for job location and source
```

