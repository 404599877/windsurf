const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

// 允许跨域
app.use(cors());
app.use(express.json());

// 配置MySQL连接（请根据实际情况修改下面的配置）
const db = mysql.createPool({
  host: 'localhost',      // 数据库主机
  user: 'dev',           // 数据库用户名
  password: 'Rr8Y4y7F2BLCSZRe', // 数据库密码
  database: 'dev', // 数据库名
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running.' });
});

// 保存分析结果
app.post('/api/analysis', (req, res) => {
  const { name, birth, result } = req.body;
  const sql = 'INSERT INTO analysis (name, birth, result) VALUES (?, ?, ?)';
  db.query(sql, [name, birth, result], (err, results) => {
    if (err) {
      return res.status(500).json({ code: 1, msg: '数据库写入失败', error: err.message });
    }
    res.json({ code: 0, msg: '保存成功', id: results.insertId });
  });
});

// 查询所有分析记录
app.get('/api/analysis', (req, res) => {
  db.query('SELECT * FROM analysis ORDER BY created_at DESC', (err, results) => {
    if (err) {
      return res.status(500).json({ code: 1, msg: '数据库查询失败', error: err.message });
    }
    res.json({ code: 0, data: results });
  });
});

// 用户注册
app.post('/api/register', (req, res) => {
  const { username, password_hash, email } = req.body;
  const sql = 'INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)';
  db.query(sql, [username, password_hash, email], (err, results) => {
    if (err) {
      return res.status(500).json({ code: 1, msg: '注册失败', error: err.message });
    }
    res.json({ code: 0, msg: '注册成功', id: results.insertId });
  });
});

// 用户登录（实际项目建议用bcrypt加密比对）
app.post('/api/login', (req, res) => {
  const { username, password_hash } = req.body;
  const sql = 'SELECT * FROM users WHERE username = ? AND password_hash = ?';
  db.query(sql, [username, password_hash], (err, results) => {
    if (err) {
      return res.status(500).json({ code: 1, msg: '登录失败', error: err.message });
    }
    if (results.length > 0) {
      res.json({ code: 0, msg: '登录成功', user: results[0] });
    } else {
      res.json({ code: 1, msg: '用户名或密码错误' });
    }
  });
});

// 启动服务
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});