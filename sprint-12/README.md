Sprint 12 — Real-Time Chat Application

A full-stack real-time chat application built with React, Vite, Node.js, Express, and Socket.IO.

The application demonstrates real-time bidirectional communication between a React client and a Node.js server. Users can join chat rooms, exchange messages instantly, see typing indicators, switch between isolated rooms, and receive join/leave notifications.

Features

Real-time messaging with Socket.IO

Persistent client-to-server WebSocket connection

Username-based session identification

Two isolated chat rooms:

General

Developers

Live typing indicators

Join and leave system messages

Connection and disconnection status

Room switching

Message timestamps

Separate styling for:

Current user's messages

Other users' messages

System messages

Empty-message prevention

Backend payload validation

Responsive desktop and mobile layout

Express health-check endpoint

Production-ready Vite build

Technology Stack

Frontend

React

Vite

JavaScript

Socket.IO Client

Plain CSS

React Hooks

Backend

Node.js

Express

Socket.IO

CORS

dotenv

Nodemon

Database

This project does not use a database. Messages remain available only while the application is running.

Project Structure

sprint-12/
├── .gitignore
├── README.md
│
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   ├── .env.example
│   ├── server.js
│   ├── app.js
│   │
│   ├── config/
│   │   └── socket.js
│   │
│   ├── constants/
│   │   └── rooms.js
│   │
│   ├── middleware/
│   │   ├── errorMiddleware.js
│   │   └── notFoundMiddleware.js
│   │
│   └── utils/
│       ├── messageUtils.js
│       └── validation.js
│
└── frontend/
    ├── package.json
    ├── package-lock.json
    ├── .env.example
    ├── index.html
    ├── vite.config.js
    │
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── App.css
        ├── socket.js
        │
        ├── components/
        │   ├── JoinScreen.jsx
        │   ├── ChatLayout.jsx
        │   ├── ChatHeader.jsx
        │   ├── RoomSelector.jsx
        │   ├── MessageList.jsx
        │   ├── MessageItem.jsx
        │   ├── MessageInput.jsx
        │   ├── TypingIndicator.jsx
        │   ├── ConnectionStatus.jsx
        │   └── ErrorMessage.jsx
        │
        ├── constants/
        │   └── rooms.js
        │
        ├── hooks/
        │   └── useChatSocket.js
        │
        └── utils/
            ├── formatTime.js
            └── typingText.js

Installation

Clone the repository and move into the Sprint 12 folder:

git clone https://github.com/mohitkorodiyabece-bit/prodesk-it-internship-.git
cd prodesk-it-internship-/sprint-12

Environment Variables

Backend

Create a .env file inside backend/.

PORT=5000
CLIENT_URL=http://localhost:5173

You can copy the example file:

cd backend
cp .env.example .env

PowerShell:

Copy-Item .env.example .env

Frontend

Create a .env file inside frontend/.

VITE_SOCKET_URL=http://localhost:5000

You can copy the example file:

cd frontend
cp .env.example .env

PowerShell:

Copy-Item .env.example .env

Run the Backend

Open a terminal inside the backend folder:

cd backend
npm install
npm run dev

Expected output:

Sprint 12 chat server listening on port 5000
Accepting client connections from: http://localhost:5173

When a client connects, the backend logs a Socket.IO connection ID:

Client connected: SOCKET_ID

When a client disconnects:

Client disconnected: SOCKET_ID

Run the Frontend

Open a second terminal inside the frontend folder:

cd frontend
npm install
npm run dev

Open:

http://localhost:5173

Keep both frontend and backend terminals running while testing the application.

Health Check Endpoint

Use the backend health route:

GET /api/health

Local URL:

http://localhost:5000/api/health

Example response:

{
  "success": true,
  "message": "Sprint 12 real-time chat server is running"
}

Opening http://localhost:5000/ may return a route-not-found response because the backend root route is not used by the application.

Socket.IO Event Flow

Connection

React client → Socket.IO server

The backend receives a new connection and logs the socket ID.

Join Room

join-room

The client sends the selected username and room. The server validates the data, stores the active session details, and joins the socket to the selected room.

Send Message

send-message

The client sends a chat message to the server.

The server validates the payload and broadcasts the message only to users in the same room.

Receive Message

receive-message

Clients in the selected room receive the message and render it instantly in the React interface.

Typing Events

typing-start
typing-stop
typing-users

Typing events are sent only to users inside the same room.

Leave Room

leave-room

The socket leaves the current room, and users in that room receive a system notification.

Error Handling

chat-error

The server returns validation problems to the sender without crashing the application.

Supported Socket.IO Events

Event

Direction

Purpose

connection

Server

Detect a newly connected client

join-room

Client → Server

Join a selected chat room

leave-room

Client → Server

Leave the current room

send-message

Client → Server

Send a message

receive-message

Server → Client

Receive a room message

typing-start

Client → Server

Notify that a user started typing

typing-stop

Client → Server

Notify that a user stopped typing

typing-users

Server → Client

Update users currently typing

system-message

Server → Client

Show join and leave notifications

chat-error

Server → Client

Display validation errors

disconnect

Server

Detect a disconnected client

Room Isolation

The project uses Socket.IO rooms instead of global broadcasting.

Available rooms:

general
developers

Messages sent in general are delivered only to users who joined general.

Messages sent in developers are delivered only to users who joined developers.

The same isolation applies to typing indicators and room system messages.

Testing with Two Browser Tabs

Start the backend.

Start the frontend.

Open http://localhost:5173 in two tabs.

Join the first tab as Mohit in General.

Join the second tab as Alex in General.

Send messages from both tabs.

Confirm messages appear instantly.

Type without sending and confirm the typing indicator appears in the other tab.

Move one user to Developers.

Confirm General messages do not appear in Developers.

Click Leave Chat and confirm the leave notification appears.

Production Build

Inside the frontend folder, run:

npm run build

A successful build creates:

frontend/dist/

The dist directory is ignored by Git and should not be committed.

To preview the production build locally:

npm run preview

Git Safety

The following files and folders should not be committed:

.env
node_modules/
dist/

The .env.example files should remain in the repository because they document the required environment variables.

Deployment Notes

The frontend and backend must be deployed separately.

Frontend

Set:

VITE_SOCKET_URL=https://your-backend-domain.example

Build command:

npm run build

Output directory:

dist

Backend

Set:

PORT=5000
CLIENT_URL=https://your-frontend-domain.example

The backend hosting provider must support persistent WebSocket connections.

After updating deployment environment variables, redeploy both services.

Troubleshooting

Frontend cannot connect

Confirm:

Backend is running on port 5000

Frontend is running on port 5173

VITE_SOCKET_URL points to the backend

CLIENT_URL matches the frontend URL

Both .env files are saved

Both development servers were restarted after changing environment variables

Vite starts on port 5174

Update the backend .env:

CLIENT_URL=http://localhost:5174

Restart the backend afterward.

Backend root says route not found

Use:

http://localhost:5000/api/health

instead of:

http://localhost:5000/

Messages appear in the wrong room

Confirm that the client leaves the previous room before joining the next room and that the server broadcasts with room-based Socket.IO methods.

npm install reports an invalid package.json

Ensure package.json contains valid JSON and is not empty.

Sprint Requirements Completed

Phase 1 — Base Architecture

Socket.IO backend configuration

Persistent React client connection

Bidirectional real-time messaging

Phase 2 — State and Integration

Username/session identification

Typing events and typing indicators

Real-time client event handling

Phase 3 — Advanced Optimization

Multiple Socket.IO rooms

Room selection interface

Strict room-isolated messaging

Room-isolated typing indicators

Author

Mohit Korodiya

Sprint 12 project for the Prodesk IT Internship.
