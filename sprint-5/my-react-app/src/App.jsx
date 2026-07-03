import { useState, useEffect } from 'react'
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  closestCorners,
} from '@dnd-kit/core'
import './App.css'

// ---------- Constants ----------
const COLUMNS = [
  { id: 'todo', title: 'To Do' },
  { id: 'inprogress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
]

const PRIORITIES = ['High', 'Medium', 'Low']

const STORAGE_KEY = 'taskflow-board-tasks'

// ---------- SearchBar Component ----------
// Reusable search input, controlled by parent via props
function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="🔍 Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
    </div>
  )
}

// ---------- TaskForm Component ----------
// Handles new task creation, lifts state up via onAddTask prop
function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('Medium')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (title.trim() === '') return

    onAddTask(title.trim(), priority)
    setTitle('')
    setPriority('Medium')
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter a new task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="task-input"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="priority-select"
      >
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {p} Priority
          </option>
        ))}
      </select>
      <button type="submit" className="add-btn">
        + Add Task
      </button>
    </form>
  )
}

// ---------- TaskCard Component ----------
// Represents a single draggable task with edit/delete functionality
function TaskCard({ task, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)

  // useDraggable hook from dnd-kit makes this card draggable
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 999 : 'auto',
        opacity: isDragging ? 0.8 : 1,
      }
    : undefined

  const handleSave = () => {
    if (editTitle.trim() === '') return
    onEdit(task.id, editTitle.trim())
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditTitle(task.title)
    setIsEditing(false)
  }

  const priorityClass = `priority-${task.priority.toLowerCase()}`

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`task-card ${priorityClass} ${isDragging ? 'dragging' : ''}`}
    >
      {isEditing ? (
        // ---- Edit Mode ----
        <div className="edit-mode">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="edit-input"
            autoFocus
          />
          <div className="edit-actions">
            <button className="save-btn" onClick={handleSave}>
              Save
            </button>
            <button className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        // ---- View Mode ----
        <>
          {/* Drag handle covers the main content area */}
          <div className="task-drag-handle" {...listeners} {...attributes}>
            <span className={`priority-badge ${priorityClass}`}>
              {task.priority}
            </span>
            <p className="task-title">{task.title}</p>
          </div>
          <div className="task-actions">
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              ✏️ Edit
            </button>
            <button className="delete-btn" onClick={() => onDelete(task.id)}>
              🗑️ Delete
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ---------- BoardColumn Component ----------
// Represents one droppable column (To Do / In Progress / Done)
function BoardColumn({ column, tasks, onDelete, onEdit }) {
  // useDroppable hook from dnd-kit makes this column a drop target
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  })

  return (
    <div
      ref={setNodeRef}
      className={`board-column ${isOver ? 'column-over' : ''}`}
    >
      <div className="column-header">
        <h2>{column.title}</h2>
        <span className="task-count">{tasks.length}</span>
      </div>

      <div className="column-body">
        {tasks.length === 0 ? (
          <p className="empty-message">No tasks here yet</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))
        )}
      </div>
    </div>
  )
}

// ---------- App Component (Root) ----------
function App() {
  // Load tasks from localStorage on first render (lazy initializer)
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error('Failed to load tasks from localStorage:', error)
      return []
    }
  })

  const [searchTerm, setSearchTerm] = useState('')

  // Persist tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  // Sensors control how drag interactions are detected
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // avoid accidental drags on click
      },
    })
  )

  // ---- Task CRUD Handlers ----
  const addTask = (title, priority) => {
    const newTask = {
      id: Date.now().toString(),
      title,
      status: 'todo',
      priority,
    }
    setTasks((prev) => [...prev, newTask])
  }

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const editTask = (id, newTitle) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, title: newTitle } : task
      )
    )
  }

  // ---- Drag and Drop Handler ----
  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over) return

    const taskId = active.id
    const newStatus = over.id

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    )
  }

  // Filter tasks based on search term (case-insensitive)
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="app">
      <header className="app-header">
        <h1>📋 TaskFlow Board</h1>
        <p className="subtitle">Organize your work, your way</p>
      </header>

      <div className="controls-bar">
        <TaskForm onAddTask={addTask} />
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="board">
          {COLUMNS.map((column) => (
            <BoardColumn
              key={column.id}
              column={column}
              tasks={filteredTasks.filter((task) => task.status === column.id)}
              onDelete={deleteTask}
              onEdit={editTask}
            />
          ))}
        </div>
      </DndContext>
    </div>
  )
}

export default App