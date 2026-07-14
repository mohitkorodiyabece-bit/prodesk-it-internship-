const express = require('express');
const crypto = require('crypto');

const app = express();
const PORT = 5000;

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.json());

let blogs = [];

function generateId() {
  return crypto.randomUUID();
}

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'The Data Hub API is running.'
  });
});

app.get('/api/blogs', (req, res) => {
  res.status(200).json({
    success: true,
    count: blogs.length,
    data: blogs
  });
});

app.get('/api/blogs/:id', (req, res) => {
  const blog = blogs.find((b) => b.id === req.params.id);

  if (!blog) {
    return res.status(404).json({
      success: false,
      message: `Blog not found with id of ${req.params.id}`
    });
  }

  res.status(200).json({
    success: true,
    data: blog
  });
});

app.post('/api/blogs', (req, res) => {
  const { title, content, author } = req.body || {};

  if (!title || !content || !author) {
    return res.status(400).json({
      success: false,
      message: 'Please provide title, content, and author.'
    });
  }

  const now = new Date().toISOString();

  const newBlog = {
    id: generateId(),
    title,
    content,
    author,
    createdAt: now,
    updatedAt: now
  };

  blogs.push(newBlog);

  res.status(201).json({
    success: true,
    data: newBlog
  });
});

app.put('/api/blogs/:id', (req, res) => {
  const blog = blogs.find((b) => b.id === req.params.id);

  if (!blog) {
    return res.status(404).json({
      success: false,
      message: `Blog not found with id of ${req.params.id}`
    });
  }

  const { title, content, author } = req.body || {};

  blog.title = title !== undefined ? title : blog.title;
  blog.content = content !== undefined ? content : blog.content;
  blog.author = author !== undefined ? author : blog.author;
  blog.updatedAt = new Date().toISOString();

  res.status(200).json({
    success: true,
    data: blog
  });
});

app.delete('/api/blogs/:id', (req, res) => {
  const blog = blogs.find((b) => b.id === req.params.id);

  if (!blog) {
    return res.status(404).json({
      success: false,
      message: `Blog not found with id of ${req.params.id}`
    });
  }

  blogs = blogs.filter((b) => b.id !== req.params.id);

  res.status(200).json({
    success: true,
    message: 'Blog deleted successfully.',
    data: blog
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both email and password.'
    });
  }

  const header = Buffer.from(
    JSON.stringify({ alg: 'mock', typ: 'MOCK' })
  ).toString('base64url');

  const payload = Buffer.from(
    JSON.stringify({ email, iat: Date.now() })
  ).toString('base64url');

  const signature = crypto.randomBytes(16).toString('hex');

  const mockToken = `${header}.${payload}.${signature}`;

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token: mockToken,
    warning: 'This is a mock token for demonstration purposes only.'
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed' || err instanceof SyntaxError) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON in request body.'
    });
  }

  console.error('Unhandled error:', err.message);

  res.status(500).json({
    success: false,
    message: 'Something went wrong on the server.'
  });
});

app.listen(PORT, () => {
  console.log(`The Data Hub API is running on http://localhost:${PORT}`);
});