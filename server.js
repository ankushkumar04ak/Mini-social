const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;
const DATA = path.join(__dirname, 'data');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function read(name) {
  const file = path.join(DATA, name + '.json');
  if (!fs.existsSync(file)) fs.writeFileSync(file, '[]');
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}
function write(name, value) {
  fs.writeFileSync(path.join(DATA, name + '.json'), JSON.stringify(value, null, 2));
}

app.get('/api/data', (req, res) => {
  res.json({ users: read('users'), posts: read('posts') });
});

app.post('/api/users', (req, res) => {
  const { name, username, bio = '' } = req.body;
  if (!name || !username) return res.status(400).json({ error: 'Name and username are required.' });
  const users = read('users');
  if (users.some(u => u.username.toLowerCase() === username.trim().toLowerCase()))
    return res.status(409).json({ error: 'That username is already taken.' });
  const user = { id: Date.now().toString(), name: name.trim(), username: username.trim().replace(/^@/, ''), bio, following: [] };
  users.push(user); write('users', users); res.status(201).json(user);
});

app.post('/api/posts', (req, res) => {
  const { userId, text } = req.body;
  const users = read('users');
  const user = users.find(u => u.id === userId);
  if (!user || !text || !text.trim()) return res.status(400).json({ error: 'Choose a profile and write something first.' });
  const posts = read('posts');
  const post = { id: Date.now().toString(), userId, text: text.trim(), createdAt: new Date().toISOString(), likes: [], comments: [] };
  posts.unshift(post); write('posts', posts); res.status(201).json(post);
});

app.post('/api/posts/:id/like', (req, res) => {
  const { userId } = req.body; const posts = read('posts');
  const post = posts.find(p => p.id === req.params.id);
  if (!post || !userId) return res.status(404).json({ error: 'Post or user not found.' });
  post.likes = post.likes.includes(userId) ? post.likes.filter(id => id !== userId) : [...post.likes, userId];
  write('posts', posts); res.json(post);
});

app.post('/api/posts/:id/comments', (req, res) => {
  const { userId, text } = req.body; const posts = read('posts'); const users = read('users');
  const post = posts.find(p => p.id === req.params.id); const user = users.find(u => u.id === userId);
  if (!post || !user || !text || !text.trim()) return res.status(400).json({ error: 'Write a comment first.' });
  post.comments.push({ id: Date.now().toString(), userId, text: text.trim(), createdAt: new Date().toISOString() });
  write('posts', posts); res.status(201).json(post);
});

app.post('/api/users/:id/follow', (req, res) => {
  const { currentUserId } = req.body; const users = read('users');
  const target = users.find(u => u.id === req.params.id); const current = users.find(u => u.id === currentUserId);
  if (!target || !current || target.id === current.id) return res.status(400).json({ error: 'Cannot follow this profile.' });
  current.following = current.following || [];
  current.following = current.following.includes(target.id) ? current.following.filter(id => id !== target.id) : [...current.following, target.id];
  write('users', users); res.json(current);
});

app.listen(PORT, () => console.log(`Social Mini is running at http://localhost:${PORT}`));
