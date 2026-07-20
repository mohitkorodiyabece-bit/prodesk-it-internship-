# MongoDB Post API

A REST API for managing users and posts, built with Node.js, Express.js, MongoDB Atlas, and Mongoose.

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- dotenv
- cors
- morgan
- nodemon (development)

## Project Structure

```text
mongodb-post-api/
├── config/
│   └── db.js
├── controllers/
│   ├── postController.js
│   └── userController.js
├── middleware/
│   ├── errorMiddleware.js
│   └── notFoundMiddleware.js
├── models/
│   ├── Post.js
│   └── User.js
├── routes/
│   ├── postRoutes.js
│   └── userRoutes.js
├── utils/
│   ├── asyncHandler.js
│   └── errorResponse.js
├── .env.example
├── .gitignore
├── app.js
├── server.js
└── package.json
```

## Setup

1. Clone or copy the project files into a folder.
2. Install dependencies:
```bash
   npm install
```
3. Create a `.env` file in the root directory based on `.env.example`:
```env
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   NODE_ENV=development
```
4. Start the server:
```bash
   npm run dev
```
   or
```bash
   npm start
```

## API Endpoints

```text
POST   /api/users
GET    /api/users
GET    /api/users/:id
POST   /api/posts
GET    /api/posts
GET    /api/posts/recent
GET    /api/posts/:id
DELETE /api/posts/:id
```

## Data Models

### User

| Field | Type   | Rules                                      |
|-------|--------|---------------------------------------------|
| name  | String | required, trimmed, 2–80 characters          |
| email | String | required, unique, lowercase, valid format   |

### Post

| Field    | Type     | Rules                                        |
|----------|----------|-----------------------------------------------|
| title    | String   | required, trimmed, 3–150 characters           |
| content  | String   | required, trimmed, minimum 10 characters      |
| authorId | ObjectId | required, references `User`                   |

Both models include automatic `createdAt` and `updatedAt` timestamps.

## Response Format

**Success:**
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {}
}
```

**Error:**
```json
{
  "success": false,
  "message": "Post not found"
}
```

## Notes

- No authentication is implemented in this sprint.
- All data is persisted in MongoDB Atlas via Mongoose — no mock arrays are used.
- The `/api/posts/recent` route returns the 3 most recently created posts using a Mongoose aggregation pipeline (`$sort`, `$limit`, `$lookup`, `$unwind`, `$project`).