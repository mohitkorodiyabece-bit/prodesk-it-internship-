# The Data Hub

The Data Hub is a RESTful Blog API built with **Node.js** and **Express.js** for Sprint 9 of the Prodesk IT Internship.

This project demonstrates backend development concepts such as REST architecture, CRUD operations, middleware, validation, error handling, API testing, mock authentication, and deployment.

## Live API

**Base URL**

```text
https://prodesk-it-internship-e44d.vercel.app
```

Available live endpoints:

```text
https://prodesk-it-internship-e44d.vercel.app/
https://prodesk-it-internship-e44d.vercel.app/api/blogs
```

## Features

- Express server running locally on port `5000`
- RESTful Blog API
- Create, read, update, and delete blog posts
- In-memory array used as temporary storage
- Unique IDs generated with Node.js Crypto
- Custom request logger middleware
- JSON request-body parsing
- Input validation
- Proper HTTP status codes
- Unknown-route handling
- Global error-handling middleware
- Mock login endpoint
- Mock JWT-like token generation
- API testing with `requests.http`
- Successful Vercel deployment

## Technologies Used

- Node.js
- Express.js
- JavaScript
- Node.js Crypto module
- REST Client for VS Code
- Git and GitHub
- Vercel

## Project Structure

```text
sprint-9/
├── .gitignore
├── package-lock.json
├── package.json
├── requests.http
└── server.js
```

The `node_modules` folder is generated automatically after installing dependencies and is excluded from GitHub.

## Installation

Clone the repository:

```bash
git clone https://github.com/mohitkorodiyabece-bit/prodesk-it-internship-.git
```

Move into the project folder:

```bash
cd prodesk-it-internship-/sprint-9
```

Install dependencies:

```bash
npm install
```

## Run Locally

Run the project in development mode:

```bash
npm run dev
```

Or run it normally:

```bash
npm start
```

The local API will be available at:

```text
http://localhost:5000
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Confirms that the API is running |
| GET | `/api/blogs` | Returns all blog posts |
| GET | `/api/blogs/:id` | Returns one blog by ID |
| POST | `/api/blogs` | Creates a new blog |
| PUT | `/api/blogs/:id` | Updates an existing blog |
| DELETE | `/api/blogs/:id` | Deletes a blog |
| POST | `/api/login` | Returns a mock authentication token |

## Blog Object Structure

```json
{
  "id": "generated-unique-id",
  "title": "My First Blog",
  "content": "This is my blog content.",
  "author": "Mohit",
  "createdAt": "2026-07-14T10:01:01.515Z",
  "updatedAt": "2026-07-14T10:01:01.515Z"
}
```

## Create a Blog

### Request

```http
POST /api/blogs
Content-Type: application/json
```

```json
{
  "title": "My First Blog",
  "content": "This is my blog content.",
  "author": "Mohit"
}
```

### Successful Response

```json
{
  "success": true,
  "data": {
    "id": "generated-unique-id",
    "title": "My First Blog",
    "content": "This is my blog content.",
    "author": "Mohit",
    "createdAt": "2026-07-14T10:01:01.515Z",
    "updatedAt": "2026-07-14T10:01:01.515Z"
  }
}
```

## Get All Blogs

### Request

```http
GET /api/blogs
```

### Response

```json
{
  "success": true,
  "count": 0,
  "data": []
}
```

## Get One Blog

### Request

```http
GET /api/blogs/:id
```

A `404 Not Found` response is returned when the blog ID does not exist.

## Update a Blog

### Request

```http
PUT /api/blogs/:id
Content-Type: application/json
```

```json
{
  "title": "My Updated Blog Title",
  "content": "This content has been updated."
}
```

Fields that are not included in the request keep their existing values.

## Delete a Blog

### Request

```http
DELETE /api/blogs/:id
```

### Response

```json
{
  "success": true,
  "message": "Blog deleted successfully.",
  "data": {}
}
```

## Mock Login

### Request

```http
POST /api/login
Content-Type: application/json
```

```json
{
  "email": "test@example.com",
  "password": "123456"
}
```

### Response

```json
{
  "success": true,
  "message": "Login successful",
  "token": "mock-jwt-like-token",
  "warning": "This is a mock token for demonstration purposes only."
}
```

The login endpoint is only authentication scaffolding. It does not use a real user database or a real signed JWT.

## Request Logger Middleware

Every incoming request is logged in the terminal with:

- Current date and time
- HTTP method
- Requested URL

Example:

```text
[2026-07-14T10:30:00.000Z] GET /api/blogs
```

## Validation and Error Handling

The API includes:

- Required-field validation
- `400 Bad Request` for invalid input
- `404 Not Found` for missing blogs
- `404 Not Found` for unknown routes
- `500 Internal Server Error` handling
- Invalid JSON handling
- Consistent JSON responses

Example validation response:

```json
{
  "success": false,
  "message": "Please provide title, content, and author."
}
```

## API Testing

The `requests.http` file contains requests for testing:

1. Root API
2. Get all blogs
3. Create a blog
4. Get one blog
5. Update a blog
6. Delete a blog
7. Successful mock login
8. Login validation error
9. Unknown route handling

Open `requests.http` in VS Code and use the **REST Client** extension to click **Send Request** above each request.

The API can also be tested with Postman or Thunder Client.

## Important Storage Limitation

The project uses an in-memory array:

```js
let blogs = [];
```

This means blog data is temporary.

Data may be lost when:

- The local server restarts
- The project is redeployed
- A Vercel serverless instance resets
- Different serverless instances handle separate requests

A production version should use a persistent database such as MongoDB or PostgreSQL.

## Sprint Requirements Covered

### Phase 1 — Base Architecture

- Node.js environment
- Express framework
- Port 5000
- Five standard REST endpoints

### Phase 2 — State and Integration

- In-memory database
- POST logic
- GET logic
- PUT logic
- DELETE filtering
- CRUD testing

### Phase 3 — Advanced Optimization

- Custom request logger middleware
- Mock login endpoint
- Mock JWT-like token response

## Author

**Mohit Korodiya**

Prodesk IT Internship — Sprint 9
