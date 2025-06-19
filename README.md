# Book Club Management System

A full-stack web application for organizing and participating in book clubs. Users can sign up as members or organizers, create clubs, join or leave clubs, and leave reviews. Features include real-time join/leave status, club ratings, secure authentication, and search filtering by club name, category or organizer.
Features


## 🚀 Project Overview

This application allows users to discover, join, and manage book clubs. It supports two user roles:

* **Member**: Can browse, join clubs, view current books, and leave reviews.
* **Organizer**: Can create clubs and update the current book being read.

## 🎯 Core Features

###  Member Features

* Discover clubs with cover image, name, description, open spots, and organizer info
* Join/Leave clubs dynamically based on availability
* View current book being read
* Rate and review clubs (5-star system)
* Search clubs by name, category, or organizer

###  Organizer Features

* Create new clubs with name, description, cover image, genre, and capacity
* Update current book being read by the club

###  Additional Features

* Role-based authentication & authorization
* Real-time UI updates after joining/leaving a club
* Club cards display average rating

##  Authentication & Authorization

* JWT-based secure login and registration
* Distinct roles: `member`, `organizer`
* Only organizers can create or update clubs
* Logged-in users see personalized UI

##  Tech Stack

### Frontend

* React v19.1.0
* React Router DOM v7.6.2
* Axios v1.9.0
* Bootstrap v5.3.6
* Vite v6.3.5

### Backend

* Node.js v18.19.1
* Express v5.1.0
* Mongoose v8.15.2
* Dotenv v16.5.0
* BcryptJS v3.0.2
* JSON Web Token (JWT) v9.0.2

### Database

* MongoDB v6.0.13

## ⚙️ Setup Instructions

### 🔧 Backend

1. Go to the `server` folder
2. Create a `.env` file with:

   ```env
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```
3. Install dependencies:

   ```bash
   npm install
   ```
4. Start the server:

   ```bash
   npm start
   ```

### 🔧 Frontend

1. Go to the `client` folder
2. Create a `.env` file with:

   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
3. Install dependencies:

   ```bash
   npm install
   ```
4. Start the frontend:

   ```bash
   npm run dev
   ```

## 📌 Assumptions

* Reviews are visible to all users
* Clubs can only be joined if spots are available



---


