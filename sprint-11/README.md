Sprint 11 — MERN Post Manager

A full-stack MERN application built for Sprint 11 of the Prodesk IT Internship.

The project connects a React frontend to an Express and Node.js backend, stores post data in MongoDB Atlas, and uploads post thumbnails to Cloudinary using Multer and FormData.

Live Links

Frontend: https://prodesk-it-internship-5jv7.vercel.app

Backend API: https://prodesk-it-internship-vu88.vercel.app

Health Check: https://prodesk-it-internship-vu88.vercel.app/api/health

Posts Endpoint: https://prodesk-it-internship-vu88.vercel.app/api/posts

GitHub Repository: https://github.com/mohitkorodiyabece-bit/prodesk-it-internship-

Features

Fetch posts from MongoDB through the Express API

Render database content in React using useEffect

Create posts from the frontend

Upload optional JPG, PNG, or WebP thumbnails

Send multipart requests with FormData

Parse image uploads with Multer

Upload image buffers to Cloudinary

Store Cloudinary image URLs and public IDs in MongoDB

Delete posts from the frontend

Delete associated Cloudinary images

Update the React interface without refreshing

Display loading, creating, uploading, deleting, empty, and error states

Validate required fields

Restrict images to supported formats and a 5 MB limit

Configure CORS for local and deployed frontend origins

Deploy frontend and backend as separate Vercel projects

Sprint Requirements Covered

Phase 1 — Base Architecture

Replaced dummy API data with a local and deployed Node.js API

Used useEffect to request data from MongoDB

Rendered API payloads inside React

Installed and configured CORS in Express

Phase 2 — State and Integration

Created a React form that sends POST requests

Added new MongoDB documents from the user interface

Added DELETE requests from post cards

Updated the DOM after create and delete actions

Added asynchronous loading and error states

Phase 3 — Advanced Optimization

Added thumbnail uploads

Used FormData for multipart requests

Used Multer memory storage to access file buffers

Uploaded files to Cloudinary

Stored Cloudinary URLs and public IDs in MongoDB

Removed Cloudinary assets when posts are deleted

Technology Stack

Frontend

React

Vite

JavaScript

CSS

Fetch API

Backend

Node.js

Express

MongoDB Atlas

Mongoose

Multer

Cloudinary

CORS

Morgan

dotenv

Nodemon

Deployment

Vercel frontend project

Vercel Express backend project

MongoDB Atlas

Cloudinary

Project Structure

sprint-11/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── db.js
│   ├── controllers/
│   │   └── postController.js
│   ├── middleware/
│   │   ├── errorMiddleware.js
│   │   ├── notFoundMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   └── Post.js
│   ├── routes/
│   │   └── postRoutes.js
│   ├── utils/
│   │   ├── asyncHandler.js
│   │   └── uploadToCloudinary.js
│   ├── .env.example
│   ├── .gitignore
│   ├── app.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── postApi.js
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ErrorMessage.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── PostCard.jsx
│   │   │   ├── PostForm.jsx
│   │   │   └── PostList.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md

Environment Variables

Create backend/.env:

PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

Create frontend/.env:

VITE_API_URL=http://localhost:5000/api

For deployment:

VITE_API_URL=https://prodesk-it-internship-vu88.vercel.app/api

CLIENT_URL=https://prodesk-it-internship-5jv7.vercel.app

Never commit real .env files or secret credentials.

Local Installation

Clone the repository:

git clone https://github.com/mohitkorodiyabece-bit/prodesk-it-internship-.git
cd prodesk-it-internship-/sprint-11

Run the Backend

cd backend
npm install
npm run dev

Backend URL:

http://localhost:5000

Run the Frontend

Open another terminal:

cd frontend
npm install
npm run dev

Frontend URL:

http://localhost:5173

API Endpoints

Method

Endpoint

Description

GET

/

Confirm the API is running

GET

/api/health

Return server health information

GET

/api/posts

Fetch all posts

GET

/api/posts/:id

Fetch one post

POST

/api/posts

Create a post with an optional thumbnail

DELETE

/api/posts/:id

Delete a post and its Cloudinary image

Create Post Request

The frontend sends a multipart request using FormData.

Field

Type

Required

title

Text

Yes

author

Text

Yes

content

Text

Yes

thumbnail

File

No

Supported images:

JPG

PNG

WebP

Maximum size: 5 MB

Example:

const requestData = new FormData();

requestData.append("title", title);
requestData.append("author", author);
requestData.append("content", content);

if (thumbnail) {
  requestData.append("thumbnail", thumbnail);
}

Do not manually set the multipart Content-Type header. The browser generates the boundary automatically.

Example API Response

{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "_id": "POST_ID",
    "title": "My MERN Post",
    "content": "A post created from the React frontend.",
    "author": "Mohit",
    "thumbnail": "https://res.cloudinary.com/...",
    "thumbnailPublicId": "sprint-11-posts/...",
    "createdAt": "2026-07-26T00:00:00.000Z",
    "updatedAt": "2026-07-26T00:00:00.000Z"
  }
}

Error Handling

The project handles:

Missing required fields

Invalid MongoDB document IDs

Missing posts

Database connection failures

Unsupported image formats

Images larger than 5 MB

Incorrect multipart field names

Failed Cloudinary uploads

Failed frontend requests

Unknown backend routes

Available Scripts

Backend

npm run dev
npm start

Frontend

npm run dev
npm run lint
npm run build
npm run preview

Production Validation

Before submission, verify that the live application can:

Load posts from the deployed backend.

Create a text-only post.

Create a post with an image.

Preserve the post after refreshing.

Delete a post from MongoDB.

Delete the related Cloudinary image.

Display an error when the backend is unavailable.

Security Notes

.env files are excluded through .gitignore.

Frontend VITE_ variables should contain public values only.

MongoDB and Cloudinary secrets belong only in backend variables.

Rotate any credentials that were exposed.

Use a strong MongoDB password.

Restrict MongoDB Atlas access when possible.

Author

Mohit Korodiya

Prodesk IT Internship — Sprint 11Track B: Fullstack System Integration
