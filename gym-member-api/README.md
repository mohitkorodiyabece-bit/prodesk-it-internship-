# Gym Member Management System

A local gym member management REST API with an in-browser dashboard, built with Node.js and Express.

## Features

- Full CRUD for gym members
- Search by name, email, phone, or membership type
- Filter by membership type and active status
- Input validation and sanitization
- Duplicate email/phone prevention
- Accessible frontend dashboard

## Tech Stack

- Node.js, Express.js, ES Modules
- In-memory data storage
- express-validator, validator
- CORS, Helmet, Morgan
- HTML5, CSS3, Vanilla JavaScript
- Vitest, Supertest

## Project Structure

```text
gym-member-api/
├── src/
│   ├── controllers/
│   ├── data/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   └── server.js
├── public/
├── tests/
├── .env.example
├── package.json
└── README.md
```

## Installation

```bash
npm install
```

## Run

```bash
npm run dev
npm start
```

## API Endpoints

| Method | Endpoint             | Description                  |
|--------|-----------------------|-------------------------------|
| GET    | /api/health           | Health check                 |
| GET    | /api/members          | Get all members (with query) |
| GET    | /api/members/:id      | Get a single member          |
| POST   | /api/members          | Create a member              |
| PUT    | /api/members/:id      | Update a member               |
| DELETE | /api/members/:id      | Delete a member              |

## Example Request Body

```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "phone": "9876543210",
  "membershipType": "Premium",
  "joiningDate": "2026-07-14",
  "isActive": true
}
```

## Example JSON Response

```json
{
  "success": true,
  "message": "Member created successfully",
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "phone": "9876543210",
    "membershipType": "Premium",
    "joiningDate": "2026-07-14",
    "isActive": true,
    "createdAt": "2026-07-14T10:00:00.000Z",
    "updatedAt": "2026-07-14T10:00:00.000Z"
  }
}
```

## Testing

```bash
npm test
```

## Deployment Notes

Data is stored in memory and resets on server restart. Set `PORT` and `CORS_ORIGIN` via environment variables in production.