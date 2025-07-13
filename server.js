const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;
const path = require('path');
const fs = require('fs');
const multer = require('multer');

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

// 设置头像上传目录
const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, 'public', 'avatars');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, name);
  }
});
const upload = multer({ storage: avatarStorage });

// PayPal集成
const paypal = require('@paypal/checkout-server-sdk');
const PAYPAL_CLIENT_ID = 'AVM6fk_52rpHi7h7SfukalTh1jchOXvGBrORkVPWMchoLCo5JPRgwrhUYrf8OrfA0pafwfOq2TEVowcb';
const PAYPAL_CLIENT_SECRET = 'EJaqfCX4i_GsqoBsY1Br2joicxZumdVDFy57qGz08CHN4Ig48oPGsY8bivyMOD_1euyHiazsMtDrTEUd';
function environment() {
  return new paypal.core.SandboxEnvironment(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET);
}
function client() {
  return new paypal.core.PayPalHttpClient(environment());
}
const priceMap = [29, 49, 99];
const descMap = ['Basic Report', 'Premium', 'VIP Package'];
// 创建PayPal订单
app.post('/api/create-paypal-order', async (req, res) => {
  console.log('[PayPal] 收到支付请求:', req.body);
  try {
    const { plan } = req.body;
    const amount = priceMap[plan];
    const description = descMap[plan];
    if (!amount) return res.status(400).json({ error: 'Invalid plan' });
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: { currency_code: 'USD', value: amount.toFixed(2) },
        description
      }]
    });
    const order = await client().execute(request);
    console.log('[PayPal] 返回order对象:', order.result);
    // 新增：保存订单到数据库
    const orderId = order.result.id;
    const status = order.result.status;
    const now = new Date();
    const sql = 'INSERT INTO orders (order_id, plan, amount, description, status, create_time, update_time, raw_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [
      orderId,
      plan,
      amount,
      description,
      status,
      now,
      now,
      JSON.stringify(order.result)
    ], (err, results) => {
      if (err) {
        console.error('[DB] 保存订单失败:', err);
      } else {
        console.log('[DB] 订单已保存:', orderId);
      }
    });
    res.json(order.result);
  } catch (err) {
    console.error('[PayPal] Create Order Error:', err);
    res.status(500).json({ error: 'PayPal create order failed' });
  }
});
// 捕获PayPal订单
app.post('/api/capture-paypal-order', async (req, res) => {
  try {
    const { orderID } = req.body;
    if (!orderID) return res.status(400).json({ error: 'Missing orderID' });
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});
    const capture = await client().execute(request);
    if (capture.result.status === 'COMPLETED') {
      // 新增：更新订单状态
      const sql = 'UPDATE orders SET status=?, update_time=?, raw_json=? WHERE order_id=?';
      db.query(sql, [
        capture.result.status,
        new Date(),
        JSON.stringify(capture.result),
        orderID
      ], (err) => {
        if (err) console.error('[DB] 更新订单状态失败:', err);
      });
      res.json({ status: 'COMPLETED', details: capture.result });
    } else {
      res.json({ status: capture.result.status });
    }
  } catch (err) {
    console.error('[PayPal] Capture Order Error:', err);
    res.status(500).json({ error: 'PayPal capture order failed' });
  }
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
  const { username, password_hash, email, img_url } = req.body;
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
        const imgUrl = img_url || `https://p5.ssl.qhimgs1.com/sdr/400__/t0489f1c219465f2685.jpg?seed=${encodeURIComponent(username)}`;
        const sql = 'INSERT INTO users (username, password_hash, email, img_url) VALUES (?, ?, ?, ?)';
        db.query(sql, [username, hash, email, imgUrl], (err, results) => {
          if (err) {
            // 常见唯一性冲突
            if (err.code === 'ER_DUP_ENTRY') {
              if (err.message.includes('username')) {
                return res.status(400).json({ code: 1, msg: 'Username already exists' });
              }
              if (err.message.includes('email')) {
                return res.status(400).json({ code: 1, msg: 'Email already registered' });
              }
              return res.status(400).json({ code: 1, msg: 'Duplicate entry' });
            }
            return res.status(500).json({ code: 1, msg: err.message || 'Registration failed' });
          }
          res.json({ code: 0, msg: 'Registration successful', id: results.insertId });
        });
      });
    } else {
      // 没有填写邮箱，直接注册
      const hash = await bcrypt.hash(password_hash, SALT_ROUNDS);
      const imgUrl = img_url || `https://p5.ssl.qhimgs1.com/sdr/400__/t0489f1c219465f2685.jpg?seed=${encodeURIComponent(username)}`;
      const sql = 'INSERT INTO users (username, password_hash, email, img_url) VALUES (?, ?, ?, ?)';
      db.query(sql, [username, hash, email, imgUrl], (err, results) => {
        if (err) {
          // 常见唯一性冲突
          if (err.code === 'ER_DUP_ENTRY') {
            if (err.message.includes('username')) {
              return res.status(400).json({ code: 1, msg: 'Username already exists' });
            }
            if (err.message.includes('email')) {
              return res.status(400).json({ code: 1, msg: 'Email already registered' });
            }
            return res.status(400).json({ code: 1, msg: 'Duplicate entry' });
          }
          return res.status(500).json({ code: 1, msg: err.message || 'Registration failed' });
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
  // 只查users表，不再关联names表
  const sql = 'SELECT * FROM users WHERE username = ?';
  db.query(sql, [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ code: 1, msg: 'Login failed', error: err.message });
    }
    if (results.length > 0) {
      const user = results[0];
      const match = await bcrypt.compare(password_hash, user.password_hash);
      if (match) {
        user.avatar = user.img_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(username)}`;
        res.json({ code: 0, msg: 'Login successful', user });
      } else {
        res.json({ code: 1, msg: 'Incorrect username or password' });
      }
    } else {
      res.json({ code: 1, msg: 'Incorrect username or password' });
    }
  });
});

// 用户信息修改
app.post('/api/user/update', async (req, res) => {
  const { id, username, email, password, img_url } = req.body;
  if (!id) return res.status(400).json({ code: 1, msg: 'User ID is required' });
  // 检查用户名唯一
  if (username) {
    const checkUserSql = 'SELECT id FROM users WHERE username = ? AND id != ?';
    const [userRows] = await db.promise().query(checkUserSql, [username, id]);
    if (userRows.length > 0) {
      return res.status(400).json({ code: 1, msg: 'Username already exists' });
    }
  }
  // 检查邮箱唯一
  if (email) {
    const emailRegex = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ code: 1, msg: 'Invalid email format' });
    }
    const checkEmailSql = 'SELECT id FROM users WHERE email = ? AND id != ?';
    const [emailRows] = await db.promise().query(checkEmailSql, [email, id]);
    if (emailRows.length > 0) {
      return res.status(400).json({ code: 1, msg: 'Email already registered' });
    }
  }
  // 新增：新密码不能和旧密码一致
  if (password) {
    const [oldRows] = await db.promise().query('SELECT password_hash FROM users WHERE id = ?', [id]);
    if (oldRows.length > 0) {
      const oldHash = oldRows[0].password_hash;
      const isSame = await bcrypt.compare(password, oldHash);
      if (isSame) {
        return res.status(400).json({ code: 1, msg: 'New password cannot be the same as the old password.' });
      }
    }
  }
  // 构建更新SQL
  let updateFields = [];
  let updateValues = [];
  if (username) { updateFields.push('username = ?'); updateValues.push(username); }
  if (email) { updateFields.push('email = ?'); updateValues.push(email); }
  if (img_url) { updateFields.push('img_url = ?'); updateValues.push(img_url); }
  if (password) {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    updateFields.push('password_hash = ?');
    updateValues.push(hash);
  }
  if (updateFields.length === 0) {
    return res.status(400).json({ code: 1, msg: 'No fields to update' });
  }
  updateValues.push(id);
  const sql = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
  db.query(sql, updateValues, (err, results) => {
    if (err) {
      return res.status(500).json({ code: 1, msg: 'Update failed', error: err.message });
    }
    // 返回最新用户信息
    db.query('SELECT id, username, email, img_url FROM users WHERE id = ?', [id], (err2, rows) => {
      if (err2) {
        return res.status(500).json({ code: 1, msg: 'Query user failed', error: err2.message });
      }
      res.json({ code: 0, msg: 'Update successful', user: rows[0] });
    });
  });
});

// 头像上传接口
app.post('/api/user/upload-avatar', upload.single('avatar'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ code: 1, msg: 'No file uploaded' });
  }
  const url = `/avatars/${req.file.filename}`;
  res.json({ code: 0, msg: 'Upload successful', url });
});

// 静态资源服务
app.use('/avatars', express.static(path.join(__dirname, 'public', 'avatars')));

// 启动服务
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});