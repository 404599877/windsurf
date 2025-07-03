const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// 替换为你自己的API Key和Secret Key
const API_KEY = '4mtbDHA9O9p6PyJIL8GQVVpq';
const SECRET_KEY = 'af4pQD09rbYLcxLxu50TPAqPvN7Kyd7e';

// 获取access_token
async function getAccessToken() {
  const res = await axios.post(
    `https://aip.baidubce.com/oauth/2.0/token`,
    null,
    {
      params: {
        grant_type: 'client_credentials',
        client_id: API_KEY,
        client_secret: SECRET_KEY
      }
    }
  );
  return res.data.access_token;
}

// 调用文心一言API
async function getBaiduAIResult(prompt) {
  const access_token = await getAccessToken();
  const url = `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions?access_token=${access_token}`;
  const res = await axios.post(
    url,
    {
      messages: [
        { role: 'user', content: prompt }
      ]
    },
    { headers: { 'Content-Type': 'application/json' } }
  );
  // 返回AI回复内容
  return res.data.result || res.data;
}

// 前端POST /api/ai-report，body: { name, birth }
app.post('/api/ai-report', async (req, res) => {
  const { name, birth } = req.body;
  // 设计Prompt，要求AI返回结构化JSON
  const prompt = `
请根据以下信息生成姓名分析报告，内容包括：综合评分、五行分析、紫微斗数分析、西方星座分析、关键建议、推荐名字。请以如下JSON格式返回：
{
  "score": 85,
  "elements_analysis": "...",
  "purple_star": "...",
  "western_astrology": "...",
  "key_considerations": "...",
  "recommend_names": ["张三", "李四", "王五"]
}
用户信息：姓名=${name}，生日=${birth}
  `;
  try {
    const aiResult = await getBaiduAIResult(prompt);
    // 尝试解析JSON
    let resultObj;
    try {
      resultObj = JSON.parse(aiResult);
    } catch (e) {
      // AI返回不是标准JSON时，做简单修正
      resultObj = eval('(' + aiResult + ')');
    }
    res.json(resultObj);
  } catch (err) {
    res.status(500).json({ error: 'AI服务异常', detail: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`AI服务已启动，端口：${PORT}`);
}); 