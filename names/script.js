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
            title: 'Input Error',
            text: 'Please fill in all fields!',
            confirmButtonText: 'OK'
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

            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 25px 0;">
                <!-- 第一行 -->
                <div>
                    <!-- 元素分析 -->
                    <div class="module-card">
                        <h3>Elements Analysis</h3>
                        <ul>
                            <li><strong>Elements Pattern</strong></li>
                            <li><strong>Beneficial Elements:</strong> ${bazi.shen}</li>
                            <li><strong>Deficient Element:</strong> ${bazi.deficient}</li>
                            <li><strong>Prosperous Element:</strong> ${bazi.prosperous}</li>
                        </ul>
                    </div>
                </div>
                <div>
                    <!-- 紫微斗数 -->
                    <div class="module-card">
                        <h3>Purple Star Astrology</h3>
                        <ul>
                            <li><strong>Key Palaces</strong></li>
                            <li>Life Palace: ${ziwwei.life}</li>
                            <li>Wealth Palace: ${ziwwei.wealth}</li>
                            <li>Career Palace: ${ziwwei.career}</li>
                        </ul>
                    </div>
                </div>
                <div>
                    <!-- 西方占星 -->
                    <div class="module-card">
                        <h3>Western Astrology</h3>
                        <ul>
                            <li><strong>Key Signs</strong></li>
                            <li>Sun Sign: ${astrology.sun}</li>
                            <li>Moon Sign: ${astrology.moon}</li>
                            <li>Ascendant: ${astrology.ascendant}</li>
                        </ul>
                    </div>
                </div>
                <!-- 第二行 -->
                <div>
                    <!-- 关键考量 -->
                    <div class="module-card">
                        <h3>Key Considerations</h3>
                        <ul>
                            <li>Elements Balance: ${recommendedNames[0].reasons.elements}</li>
                            <li>Purple Star Influence: ${recommendedNames[0].reasons.ziwwei}</li>
                            <li>Zodiac Harmony: ${recommendedNames[0].reasons.astro}</li>
                        </ul>
                    </div>
                </div>
                <div>
                    <!-- 名字推荐 -->
                    <div class="module-card">
                        <h3>Name Recommendations</h3>
                        <ul>
                            <li><strong>Top 3 Names</strong></li>
                            ${recommendedNames.map(name => `<li>${name.name} (${name.rating}/10)</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <div>
                    <!-- LIMITED OFFER -->
                    <div class="module-card limited-offer">
                        <div class="upgrade-label">✨ LIMITED OFFER</div>
                        <h3>✨ LIMITED OFFER</h3>
                        <ul>
                            <li>Full report includes:</li>
                            <li>Luckiest career paths</li>
                            <li>2025 fortune forecast</li>
                            <li>Ideal partner analysis</li>
                        </ul>
                        <div class="upgrade-count">
                            🔥 82 upgraded today
                        </div>
                        <a href="#pricing" class="upgrade-button" onclick="event.stopPropagation()">
                            Upgrade Now →
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;

    Swal.fire({
        title: 'Professional Name Analysis Report',
        html: reportHTML,
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
        },
        preConfirm: () => {
            downloadPDF();
            return false;
        }
    });
}

// PDF导出功能
function downloadPDF() {
    const content = document.querySelector('.swal2-html-container') || document.querySelector('.swal2-content');
    if (!content) {
        Swal.fire({
            title: '内容未找到',
            text: '无法导出PDF，请重试。',
            icon: 'error'
        });
        return;
    }
    // 临时加白色背景class
    content.classList.add('pdf-blue-bg');
    // 临时为综合评分区域加蓝色背景class
    const scoreBox = content.querySelector('.bg-gradient-to-r, .score-box, .comprehensive-score, .score-bg, .bg-black');
    if (scoreBox) scoreBox.classList.add('pdf-score-bg');
    // 只隐藏升级按钮和升级计数
    const pdfHideEls = content.querySelectorAll('.upgrade-button, .upgrade-count');
    pdfHideEls.forEach(el => el.classList.add('pdf-export-hide'));
    const jsPDFConstructor = window.jsPDF || window.jspdf.jsPDF;
    const doc = new jsPDFConstructor({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
    });
    doc.html(content, {
        callback: function (doc) {
            content.classList.remove('pdf-blue-bg');
            if (scoreBox) scoreBox.classList.remove('pdf-score-bg');
            pdfHideEls.forEach(el => el.classList.remove('pdf-export-hide'));
            doc.save('Name_Analysis_Report.pdf');
        },
        x: 10,
        y: 10,
        width: 190,
        windowWidth: 800
    });
}
