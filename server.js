const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const app = express();
const PORT = 3001;

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
      return res.status(500).json({ code: 1, msg: 'Database write failed', error: err.message });
    }
    res.json({ code: 0, msg: 'Save successful', id: results.insertId });
  });
});

// 查询所有分析记录
app.get('/api/analysis', (req, res) => {
  db.query('SELECT * FROM analysis ORDER BY created_at DESC', (err, results) => {
    if (err) {
      return res.status(500).json({ code: 1, msg: 'Database query failed', error: err.message });
    }
    res.json({ code: 0, data: results });
  });
});

// 用户注册
app.post('/api/register', async (req, res) => {
  const { username, password_hash, email } = req.body;
  try {
    // 邮箱格式校验
    if (email) {
      const emailRegex = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ code: 1, msg: 'Invalid email format' });
      }
      // 先检查邮箱是否已存在
      const checkEmailSql = 'SELECT id FROM users WHERE email = ?';
      db.query(checkEmailSql, [email], async (err, results) => {
        if (err) {
          return res.status(500).json({ code: 1, msg: 'Database error', error: err.message });
        }
        if (results.length > 0) {
          return res.status(400).json({ code: 1, msg: 'Email already registered' });
        }
        // 邮箱未被注册，继续注册流程
        const hash = await bcrypt.hash(password_hash, SALT_ROUNDS);
        const sql = 'INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)';
        db.query(sql, [username, hash, email], (err, results) => {
          if (err) {
            return res.status(500).json({ code: 1, msg: 'Registration failed', error: err.message });
          }
          res.json({ code: 0, msg: 'Registration successful', id: results.insertId });
        });
      });
    } else {
      // 没有填写邮箱，直接注册
      const hash = await bcrypt.hash(password_hash, SALT_ROUNDS);
      const sql = 'INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)';
      db.query(sql, [username, hash, email], (err, results) => {
        if (err) {
          return res.status(500).json({ code: 1, msg: 'Registration failed', error: err.message });
        }
        res.json({ code: 0, msg: 'Registration successful', id: results.insertId });
      });
    }
  } catch (err) {
    res.status(500).json({ code: 1, msg: 'Password encryption failed', error: err.message });
  }
});

// 用户登录
app.post('/api/login', (req, res) => {
  const { username, password_hash } = req.body;
  const sql = 'SELECT * FROM users WHERE username = ?';
  db.query(sql, [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ code: 1, msg: 'Login failed', error: err.message });
    }
    if (results.length > 0) {
      const user = results[0];
      const match = await bcrypt.compare(password_hash, user.password_hash);
      if (match) {
        res.json({ code: 0, msg: 'Login successful', user });
      } else {
        res.json({ code: 1, msg: 'Incorrect username or password' });
      }
    } else {
      res.json({ code: 1, msg: 'Incorrect username or password' });
    }
  });
});

// 启动服务
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});