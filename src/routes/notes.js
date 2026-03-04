const express = require('express');
const db = require('../db');
const { authenticateToken } = require('./auth');

const router = express.Router();

// 获取笔记列表
router.get('/', authenticateToken, (req, res) => {
  const notes = db.getNotes(req.user.id);
  res.json(notes);
});

// 获取单个笔记
router.get('/:id', authenticateToken, (req, res) => {
  const note = db.getNoteById(parseInt(req.params.id), req.user.id);
  
  if (!note) {
    return res.status(404).json({ error: '笔记不存在' });
  }
  
  res.json(note);
});

// 创建笔记
router.post('/', authenticateToken, (req, res) => {
  const { title, content } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: '标题不能为空' });
  }
  
  const note = db.createNote(req.user.id, title, content || '');
  res.json(note);
});

// 更新笔记
router.put('/:id', authenticateToken, (req, res) => {
  const { title, content } = req.body;
  const id = parseInt(req.params.id);
  
  const updated = db.updateNote(id, req.user.id, title, content);
  
  if (!updated) {
    return res.status(404).json({ error: '笔记不存在' });
  }
  
  res.json({ message: '更新成功' });
});

// 删除笔记
router.delete('/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const deleted = db.deleteNote(id, req.user.id);
  
  if (!deleted) {
    return res.status(404).json({ error: '笔记不存在' });
  }
  
  res.json({ message: '删除成功' });
});

module.exports = router;
