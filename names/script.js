// 获取表单元素
const surnameInput = document.getElementById('surname');
const yearInput = document.getElementById('year');
const monthInput = document.getElementById('month');
const dayInput = document.getElementById('day');
const calculateBtn = document.querySelector('form button[type="submit"]');

// 计算八字五行
function calculateBazi(year, month, day) {
    // Here should be the API or algorithm call for Bazi calculation
    return {
        year: 'Metal',
        month: 'Wood',
        day: 'Water',
        hour: 'Fire',
        shen: 'Fire and Earth',
        deficient: 'Fire',
        prosperous: 'Water'
    };
}

// 计算紫微斗数
function calculateZiwei(year, month, day) {
    // Here should be the API or algorithm call for Ziwei Dou Shu calculation
    return {
        life: 'Tian Xiang',
        wealth: 'Zi Wei',
        career: 'Wu Qu',
        migration: 'Tian Ji',
        love: 'Southwest',
        major: '2025 Encounters Tian Tong Star Transforming into Luck',
        annual: '2025 Yearly Auspicious Star'
    };
}

// 计算西方占星
function calculateAstrology(year, month, day) {
    // Here should be the API or algorithm call for Astrology calculation
    return {
        sun: 'Scorpio',
        moon: 'Cancer',
        ascendant: 'Cancer',
        lucky: 'Pluto',
        lifeNumber: '7',
        aspects: 'Pluto Conjunct Mars'
    };
}

// 计算综合评分
function calculateCompositeScore(bazi, ziwwei, astrology) {
    // 这里应该是复杂的评分算法
    return {
        total: 85,
        rating: 'Excellent',
        elements: 80,
        ziwwei: 85,
        astro: 90,
        career: '★★★★☆',
        wealth: '★★★★☆',
        love: '★★★☆☆',
        caution: '注意情绪波动',
        avoid: '避免冲动决策',
        unfavorable: '不利水火相冲'
    };
}

// 生成推荐名字
function generateRecommendedNames(bazi, ziwwei, astrology) {
    // 示例数据，实际应用中应根据八字、紫微斗数和占星结果生成
    return [
        {
            name: "William",
            chineseName: "威廉",
            rating: 8.5,
            reasons: {
                elements: "Balanced with Metal and Water",
                ziwwei: "Favorable Life Palace",
                astro: "Harmonious with Sun Sign"
            }
        },
        {
            name: "Sophia",
            chineseName: "索菲亚",
            rating: 8.2,
            reasons: {
                elements: "Enhances Fire Element",
                ziwwei: "Good Wealth Palace",
                astro: "Compatible with Moon Sign"
            }
        },
        {
            name: "James",
            chineseName: "詹姆斯",
            rating: 7.9,
            reasons: {
                elements: "Strengthens Earth Element",
                ziwwei: "Positive Career Palace",
                astro: "Good with Ascendant"
            }
        }
    ];
}

// 输入验证
function validateInputs() {
    if (!surnameInput.value || !yearInput.value || !monthInput.value || !dayInput.value) {
        Swal.fire({
            icon: 'error',
            title: '输入错误',
            text: '请填写所有字段！',
            confirmButtonText: '确定'
        });
        return false;
    }
    return true;
}

// 事件处理
document.addEventListener('DOMContentLoaded', function() {
    if (!calculateBtn || !surnameInput || !yearInput || !monthInput || !dayInput) {
        console.error('表单元素未找到');
        return;
    }

    calculateBtn.closest('form').addEventListener('submit', (e) => {
        e.preventDefault();
        calculateDestiny();
    });
});

// 生成名字
function generateName(seed) {
    const eastNames = ["梓涵", "浩宇", "诗雨", "子轩", "欣怡"];
    const westNames = ["Olivia", "Liam", "Aurora", "Theo", "Luna"];
    const index = seed % eastNames.length;
    return eastNames[index] + "·" + westNames[(index + 2) % westNames.length];
}

// 获取运势分析
function getFortuneAnalysis(month) {
    const zodiacAnalysis = {
        1: { zodiac: "水瓶座", trait: "创新精神", element: "木", suggestion: "科技感" },
        2: { zodiac: "双鱼座", trait: "敏感特质", element: "水", suggestion: "平衡" },
        3: { zodiac: "白羊座", trait: "冒险精神", element: "火", suggestion: "活力" },
        4: { zodiac: "金牛座", trait: "稳重特质", element: "土", suggestion: "传统优雅" },
        5: { zodiac: "双子座", trait: "多变性格", element: "风", suggestion: "灵活" },
        6: { zodiac: "巨蟹座", trait: "温柔特质", element: "水", suggestion: "水元素" },
        7: { zodiac: "狮子座", trait: "领导气质", element: "火", suggestion: "大气磅礴" },
        8: { zodiac: "处女座", trait: "完美主义", element: "土", suggestion: "精致" },
        9: { zodiac: "天秤座", trait: "平衡特质", element: "风", suggestion: "和谐" },
        10: { zodiac: "天蝎座", trait: "神秘特质", element: "水", suggestion: "内涵" },
        11: { zodiac: "射手座", trait: "自由精神", element: "火", suggestion: "开阔" },
        12: { zodiac: "魔羯座", trait: "务实性格", element: "土", suggestion: "稳重" }
    };
    const zodiacData = zodiacAnalysis[month];
    return zodiacData 
        ? `${zodiacData.zodiac}的${zodiacData.trait}配合${zodiacData.element}属性姓氏，适合带有${zodiacData.suggestion}的名字`
        : "此生辰蕴含特殊能量，推荐使用中性名字";
}

// 计算命运
function calculateDestiny() {
    const surname = surnameInput.value;
    const year = yearInput.value;
    const month = monthInput.value;
    const day = dayInput.value;

    if (!validateInputs()) {
        return;
    }

    // 计算八字五行
    const bazi = calculateBazi(year, month, day);
    // 计算紫微斗数
    const ziwwei = calculateZiwei(year, month, day);
    // 计算西方占星
    const astrology = calculateAstrology(year, month, day);
    // 计算综合评分
    const score = calculateCompositeScore(bazi, ziwwei, astrology);

    // 生成推荐名字
    const recommendedNames = generateRecommendedNames(bazi, ziwwei, astrology);

    const reportHTML = `
        <div>
            <h3 class="font-bold text-lg">${surname} Name Analysis Report</h3>
            <p>Birth Date: ${year}-${month}-${day}</p>
            <hr class="my-2">
            <div class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-lg mb-8">
                <div class="flex flex-col items-center">
                    <h4 class="text-2xl font-bold mb-4">Comprehensive Score</h4>
                    <div class="flex flex-col items-center mb-6">
                        <div class="text-4xl font-bold mb-2">${score.total}</div>
                        <div class="text-lg">${score.rating}</div>
                    </div>
                </div>
                <div class="grid grid-cols-3 gap-6 w-full">
                    <div class="flex flex-col items-center">
                        <div class="text-lg font-semibold mb-1">Elements Score</div>
                        <div class="text-2xl font-bold">${score.elements}</div>
                    </div>
                    <div class="flex flex-col items-center">
                        <div class="text-lg font-semibold mb-1">Purple Star Score</div>
                        <div class="text-2xl font-bold">${score.ziwwei}</div>
                    </div>
                    <div class="flex flex-col items-center">
                        <div class="text-lg font-semibold mb-1">Astrology Score</div>
                        <div class="text-2xl font-bold">${score.astro}</div>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 25px 0;">
                <!-- 第一列 -->
                <div>
                    <!-- 元素分析 -->
                    <div style="background: #FFF9F2; border-radius: 8px; padding: 16px; margin-bottom: 20px; border-left: 3px solid #FFB74D;">
                        <h3 style="color: #D84315; margin: 0 0 12px 0; font-size: 15px;">Elements Analysis</h3>
                        <ul style="margin: 0; padding-left: 18px; color: #5D4037; line-height: 1.7; font-size: 13px;">
                            <li><strong>Elements Pattern</strong></li>
                            <li><strong>Beneficial Elements:</strong> ${bazi.shen}</li>
                            <li><strong>Deficient Element:</strong> ${bazi.deficient}</li>
                            <li><strong>Prosperous Element:</strong> ${bazi.prosperous}</li>
                        </ul>
                    </div>

                    <!-- 紫微斗数 -->
                    <div style="background: #FFF9F2; border-radius: 8px; padding: 16px; margin-bottom: 20px; border-left: 3px solid #FFB74D;">
                        <h3 style="color: #D84315; margin: 0 0 12px 0; font-size: 15px;">Purple Star Astrology</h3>
                        <ul style="margin: 0; padding-left: 18px; color: #5D4037; line-height: 1.7; font-size: 13px;">
                            <li><strong>Key Palaces</strong></li>
                            <li>Life Palace: ${ziwwei.life}</li>
                            <li>Wealth Palace: ${ziwwei.wealth}</li>
                            <li>Career Palace: ${ziwwei.career}</li>
                        </ul>
                    </div>

                    <!-- 关键考量 -->
                    <div style="background: #FFF9F2; border-radius: 8px; padding: 16px; border-left: 3px solid #FFB74D;">
                        <h3 style="color: #D84315; margin: 0 0 12px 0; font-size: 15px;">Key Considerations</h3>
                        <ul style="margin: 0; padding-left: 18px; color: #5D4037; line-height: 1.7; font-size: 13px;">
                            <li>Elements Balance: ${recommendedNames[0].reasons.elements}</li>
                            <li>Purple Star Influence: ${recommendedNames[0].reasons.ziwwei}</li>
                            <li>Zodiac Harmony: ${recommendedNames[0].reasons.astro}</li>
                        </ul>
                    </div>
                </div>

                <!-- 第二列 -->
                <div>
                    <!-- 西方占星 -->
                    <div style="background: #FFF9F2; border-radius: 8px; padding: 16px; margin-bottom: 20px; border-left: 3px solid #FFB74D;">
                        <h3 style="color: #D84315; margin: 0 0 12px 0; font-size: 15px;">Western Astrology</h3>
                        <ul style="margin: 0; padding-left: 18px; color: #5D4037; line-height: 1.7; font-size: 13px;">
                            <li><strong>Key Signs</strong></li>
                            <li>Sun Sign: ${astrology.sun}</li>
                            <li>Moon Sign: ${astrology.moon}</li>
                            <li>Ascendant: ${astrology.ascendant}</li>
                        </ul>
                    </div>

                    <!-- 名字推荐 -->
                    <div style="background: #FFF9F2; border-radius: 8px; padding: 16px; margin-bottom: 20px; border-left: 3px solid #FFB74D;">
                        <h3 style="color: #D84315; margin: 0 0 12px 0; font-size: 15px;">Name Recommendations</h3>
                        <ul style="margin: 0; padding-left: 18px; color: #5D4037; line-height: 1.7; font-size: 13px;">
                            <li><strong>Top 3 Names</strong></li>
                            ${recommendedNames.map(name => `<li>${name.name} (${name.rating}/10)</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;

    const upgradePrompt = `
        <div style="
            position: absolute;
            right: 20px;
            bottom: 70px;
            width: 180px;
            padding: 12px;
            background: #FFF3E0;
            border-radius: 6px;
            border-left: 3px solid #FFA000;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            z-index: 100;
        ">
            <div style="
                position: absolute;
                top: -8px;
                right: 15px;
                background: #FF5722;
                color: white;
                padding: 2px 8px;
                border-radius: 10px;
                font-size: 10px;
                font-weight: bold;
            ">✨ LIMITED OFFER</div>
            
            <p style="
                margin: 15px 0 8px 0;
                font-size: 12px;
                color: #5D4037;
                line-height: 1.4;
            ">
                <b>Full report includes:</b><br>
                • Luckiest career paths<br>
                • 2025 fortune forecast<br>
                • Ideal partner analysis
            </p>
            
            <div style="
                background: rgba(255,152,0,0.1);
                padding: 6px;
                border-radius: 4px;
                margin-bottom: 10px;
                text-align: center;
                font-size: 11px;
                color: #E65100;
            ">
                🔥 82 upgraded today
            </div>
            
            <a href="#pricing" style="
                display: block;
                background: linear-gradient(to right, #FF9800, #FB8C00);
                color: white;
                padding: 8px;
                border-radius: 4px;
                text-align: center;
                text-decoration: none;
                font-weight: bold;
                transition: all 0.2s;
            " onclick="event.stopPropagation()"
            onmouseover="this.style.transform='translateY(-2px)'
            onmouseout="this.style.transform='none'">
                Upgrade Now →
            </a>
        </div>
    `;

    Swal.fire({
        title: 'Professional Name Analysis Report',
        html: reportHTML + upgradePrompt,
        width: '80%',
        backdrop: 'rgba(0,0,0,0.4)',
        showCloseButton: true,
        customClass: {
            container: 'max-w-4xl mx-auto',
            content: 'p-4'
        },
        buttonsStyling: false,
        confirmButtonText: '<i class="fa fa-thumbs-up"></i> Download Full Report',
        confirmButtonAriaLabel: 'Download',
        showCancelButton: true,
        cancelButtonText: '<i class="fa fa-ban"></i> Cancel',
        cancelButtonAriaLabel: 'Cancel',
        customClass: {
            confirmButton: 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded',
            cancelButton: 'bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-4'
        }
    });
}
