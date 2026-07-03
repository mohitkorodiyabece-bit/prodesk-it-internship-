# Trello-Style Task Management Board

A modern Trello-style Kanban task management board built using React.js and Vite.  
This project includes draggable task cards, priority badges, inline editing, search filtering, and localStorage persistence.

---

## 🚀 Project Overview

This is a responsive task management dashboard where users can create, edit, delete, search, and drag tasks between different workflow columns.

The board contains three main columns:

- To Do
- In Progress
- Done

Each task is stored as an object with:

- ID
- Title
- Status
- Priority

---

## 🛠️ Tech Stack

- React.js
- Vite
- JavaScript ES6
- CSS3
- @dnd-kit/core
- localStorage

---

## ✨ Features

### Core Features

- Add new tasks
- Delete tasks
- Three-column Kanban layout
- Task state managed with React `useState`
- Props / prop drilling based component structure

### Priority Features

- Priority dropdown while creating tasks
- High, Medium, and Low priority badges
- Different styling based on task priority
- Inline task editing
- Save and cancel edit options

### Advanced Features

- Drag and drop tasks between columns
- Global real-time search
- Data persistence using localStorage
- Responsive design for desktop, tablet, and mobile
- Modern dark gradient dashboard UI

---

## 📁 Project Structure

```txt
my-react-app/
├── index.html
├── package.json
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   └── App.css