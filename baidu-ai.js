const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const OpenAI = require("openai");
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// DeepSeek API Key（请替换为你自己的）
const DEEPSEEK_API_KEY = "sk-99a9193e9e1d4e36bb788d3067813c29";

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: DEEPSEEK_API_KEY
});

// 调用DeepSeek API
async function getDeepSeekResult(prompt) {
  const res = await openai.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      { role: "system", content: "You are a professional English name analysis expert. All your responses must be in English and must be detailed and complete JSON as required." },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" }
  });
  // 返回AI回复内容
  return res.choices[0].message.content;
}

// 前端POST /api/ai-report，body: { name, birth }
app.post('/api/ai-report', async (req, res) => {
  const { name, birth } = req.body;
  console.log('[AI-REQ] 收到请求:', { name, birth });
  // 设计Prompt，要求AI返回结构化JSON，且必须用英文详细输出，不删减内容，所有字段都要有内容
  const prompt = `
Please generate a detailed name analysis report in English based on the following information. The report must include ALL of the following fields, and each field must have a detailed value (do not leave any field empty or summarized):
{
  "score": 88,
  "rating": "Excellent",
  "elements": 80,
  "ziwwei": 85,
  "astro": 90,
  "elements_analysis": "...",
  "beneficial_elements": "...",
  "deficient_element": "...",
  "prosperous_element": "...",
  "life_palace": "...",
  "wealth_palace": "...",
  "career_palace": "...",
  "purple_star": "...",
  "western_astrology": "...",
  "sun_sign": "...",
  "moon_sign": "...",
  "ascendant": "...",
  "elements_balance": "...",
  "purple_star_influence": "...",
  "zodiac_harmony": "...",
  "key_considerations": "...",
  "recommend_names": ["Name1", "Name2", "Name3"]
}
User info: Name=${name}, Birth=${birth}
  `;
  try {
    const aiResult = await getDeepSeekResult(prompt);
    console.log('[AI-RESP] AI返回内容:', aiResult);
    // 尝试解析JSON
    let resultObj;
    try {
      resultObj = JSON.parse(aiResult);
    } catch (e) {
      console.warn('[AI-JSON] JSON解析失败，尝试eval', aiResult);
      resultObj = eval('(' + aiResult + ')');
    }
    // 字段补全模板
    const fill = (val, fallback) => (val === undefined || val === null || val === "") ? fallback : val;
    const fieldTemplate = {
      beneficial_elements: "The beneficial elements for this name are Water and Wood, which bring harmony and growth.",
      deficient_element: "The deficient element is Fire, suggesting a need for more passion or energy.",
      prosperous_element: "The prosperous element is Water, indicating a strong potential for adaptability and flexibility.",
      life_palace: "The Life Palace is influenced by the Traveling Star, indicating movement and exploration.",
      wealth_palace: "The Wealth Palace is governed by the Purple Star, bringing leadership and financial opportunities.",
      career_palace: "The Career Palace is associated with Wu Qu, suggesting a strong work ethic and ambition.",
      sun_sign: "Gemini - adaptable, intelligent, and communicative.",
      moon_sign: "Cancer - sensitive, intuitive, and nurturing.",
      ascendant: "Leo - confident, charismatic, and creative.",
      elements_balance: "Balanced with Water and Wood, but needs more Fire.",
      purple_star_influence: "Strong leadership and charisma from the Purple Star.",
      zodiac_harmony: "Harmonious with Sun and Moon signs, but needs grounding."
    };
    // 补全所有字段
    Object.keys(fieldTemplate).forEach(key => {
      resultObj[key] = fill(resultObj[key], fieldTemplate[key]);
    });
    console.log('[AI-RESP] 返回前内容:', resultObj);
    res.json(resultObj);
  } catch (err) {
    console.error('[AI-ERR] AI服务异常:', err);
    res.status(500).json({ error: 'AI服务异常', detail: err.message });
  }
});

const PORT = 3010;
app.listen(PORT, () => {
  console.log(`AI服务已启动，端口：${PORT}`);
}); 