const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dataDir = path.join(__dirname, '../data');
const dataFile = path.join(dataDir, 'db.json');

// 确保数据目录存在
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 初始化数据库
function loadDB() {
  if (!fs.existsSync(dataFile)) {
    const initialData = {
      users: [
        { id: 1, username: 'admin', password: bcrypt.hashSync('admin123', 10) }
      ],
      notes: []
    };
    fs.writeFileSync(dataFile, JSON.stringify(initialData, null, 2));
  }
  return JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
}

function saveDB(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

const db = {
  data: loadDB(),
  
  getUsers() {
    return this.data.users;
  },
  
  getUserByUsername(username) {
    return this.data.users.find(u => u.username === username);
  },
  
  createUser(username, password) {
    const newUser = {
      id: this.data.users.length + 1,
      username,
      password: bcrypt.hashSync(password, 10)
    };
    this.data.users.push(newUser);
    saveDB(this.data);
    return newUser;
  },
  
  getNotes(userId) {
    return this.data.notes
      .filter(n => n.user_id === userId)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  },
  
  getNoteById(id, userId) {
    return this.data.notes.find(n => n.id === id && n.user_id === userId);
  },
  
  createNote(userId, title, content) {
    const newNote = {
      id: Date.now(),
      user_id: userId,
      title,
      content,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.data.notes.push(newNote);
    saveDB(this.data);
    return newNote;
  },
  
  updateNote(id, userId, title, content) {
    const note = this.data.notes.find(n => n.id === id && n.user_id === userId);
    if (note) {
      note.title = title;
      note.content = content;
      note.updated_at = new Date().toISOString();
      saveDB(this.data);
      return true;
    }
    return false;
  },
  
  deleteNote(id, userId) {
    const index = this.data.notes.findIndex(n => n.id === id && n.user_id === userId);
    if (index > -1) {
      this.data.notes.splice(index, 1);
      saveDB(this.data);
      return true;
    }
    return false;
  }
};

module.exports = db;
