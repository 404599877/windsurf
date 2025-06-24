// 确保DOM完全加载后再执行代码
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    
    // 获取表单元素
    const nameForm = document.getElementById('nameForm');
    if (!nameForm) {
        console.error('Form not found');
        return;
    }

    // 获取提交按钮
    const submitButton = nameForm.querySelector('button[type="submit"]');
    if (!submitButton) {
        console.error('Submit button not found');
        return;
    }

    // 添加表单提交事件监听器
    nameForm.addEventListener('submit', async function(e) {
        console.log('Form submitted');
        e.preventDefault();
        
        // 获取所有输入值
        const surname = document.getElementById('surname')?.value || '';
        const year = document.getElementById('year')?.value || '';
        const month = document.getElementById('month')?.value || '';
        const day = document.getElementById('day')?.value || '';

        console.log('Form values:', { surname, year, month, day });

        // 验证输入
        if (!surname.trim() || !year || !month || !day) {
            console.error('Missing required fields');
            alert('Please fill in all fields');
            return;
        }

        // 组合日期
        const birthDate = `${year}-${month}-${day}`;
        console.log('Birth date:', birthDate);

        // 显示加载状态
        submitButton.disabled = true;
        submitButton.textContent = 'Calculating...';

        try {
            // 模拟API调用
            console.log('Calculating compatibility...');
            const result = await calculateNameCompatibility(surname, birthDate);
            console.log('Analysis result:', result);
            
            // 创建并显示结果模态框
            showResultModal(result);
        } catch (error) {
            console.error('Error calculating compatibility:', error);
            alert('Error calculating compatibility. Please try again.');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Calculate Your Destiny';
        }
    });
});

// 确保所有辅助函数都已定义
function getZodiacDescription(zodiac) {
    const descriptions = {
        '鼠': '机智灵活，善于交际',
        '牛': '勤劳稳重，值得信赖',
        '虎': '勇敢自信，领导力强',
        '兔': '温柔体贴，善于思考',
        '龙': '充满活力，富有创造力',
        '蛇': '智慧敏锐，善于分析',
        '马': '自由奔放，充满活力',
        '羊': '温和善良，富有同情心',
        '猴': '聪明机智，善于变通',
        '鸡': '勤奋好学，注重细节',
        '狗': '忠诚可靠，正直诚实',
        '猪': '乐观开朗，待人真诚'
    };
    return descriptions[zodiac] || '个性独特，充满潜力';
}

function getZodiacCompatibility(zodiac) {
    const compatibilities = {
        '鼠': '与龙、猴最相配',
        '牛': '与蛇、鸡最相配',
        '虎': '与马、狗最相配',
        '兔': '与羊、猪最相配',
        '龙': '与鼠、猴最相配',
        '蛇': '与牛、鸡最相配',
        '马': '与虎、狗最相配',
        '羊': '与兔、猪最相配',
        '猴': '与鼠、龙最相配',
        '鸡': '与牛、蛇最相配',
        '狗': '与虎、马最相配',
        '猪': '与兔、羊最相配'
    };
    return compatibilities[zodiac] || '与大多数人相配';
}

function getPurpleStarDescription(star) {
    const descriptions = {
        '紫微': '领导之星，适合领导岗位',
        '天机': '智慧之星，善于思考',
        '太阳': '光明之星，充满活力',
        '武曲': '武将之星，坚强勇敢',
        '天同': '和平之星，善于协调',
        '廉贞': '正直之星，坚持原则',
        '天府': '财富之星，善于理财',
        '太阴': '温柔之星，善于理解',
        '贪狼': '进取之星，善于开拓',
        '巨门': '口才之星，善于表达',
        '天相': '辅助之星，善于支持',
        '天梁': '仁慈之星，善于帮助'
    };
    return descriptions[star] || '个性独特，充满潜力';
}

function getPurpleStarTraits(star) {
    const traits = {
        '紫微': ['领导力强', '决策果断', '善于组织'],
        '天机': ['思维敏捷', '善于分析', '创新能力强'],
        '太阳': ['乐观开朗', '充满活力', '善于激励'],
        '武曲': ['坚强勇敢', '执行力强', '善于挑战'],
        '天同': ['温和善良', '善于协调', '善于倾听'],
        '廉贞': ['正直诚实', '原则性强', '善于判断'],
        '天府': ['善于理财', '管理能力强', '决策谨慎'],
        '太阴': ['温柔体贴', '善于理解', '善于安慰'],
        '贪狼': ['进取心强', '善于开拓', '善于创新'],
        '巨门': ['口才好', '善于表达', '善于沟通'],
        '天相': ['善于支持', '善于协助', '善于配合'],
        '天梁': ['仁慈善良', '善于帮助', '善于指导']
    };
    return traits[star] || ['个性独特', '充满潜力', '善于发展'];
}

function getIChingDescription(hexagram) {
    const descriptions = {
        '乾': '刚健有力，充满活力',
        '坤': '柔顺包容，善于适应',
        '屯': '艰难起步，充满挑战',
        '蒙': '启蒙学习，善于探索',
        '需': '等待时机，善于准备',
        '訟': '争讼冲突，善于调解',
        '師': '军队组织，善于管理',
        '比': '亲近团结，善于合作',
        '小畜': '积累力量，善于储备',
        '履': '谨慎行事，善于规划',
        '泰': '通泰和谐，善于发展',
        '否': '闭塞困难，善于突破'
    };
    return descriptions[hexagram] || '充满潜力，善于发展';
}

function getIChingFortune(hexagram) {
    const fortunes = {
        '乾': '大吉大利，事业顺利',
        '坤': '平稳发展，家庭和谐',
        '屯': '艰难起步，终将成功',
        '蒙': '启蒙学习，未来可期',
        '需': '等待时机，终将成功',
        '訟': '争讼不利，和为上策',
        '師': '军队得胜，事业成功',
        '比': '亲近团结，万事如意',
        '小畜': '积累力量，终将爆发',
        '履': '谨慎行事，终将成功',
        '泰': '通泰和谐，万事顺遂',
        '否': '闭塞困难，终将突破'
    };
    return fortunes[hexagram] || '发展顺利，未来可期';
}

// Name compatibility calculation function
async function calculateNameCompatibility(surname, birthDate) {
    try {
        // Validate inputs
        if (!surname || surname.trim().length === 0) {
            throw new Error('Surname is required');
        }
        
        // Parse birth date
        const date = new Date(birthDate);
        if (isNaN(date.getTime())) {
            throw new Error('Invalid birth date');
        }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate random compatibility score
        const score = Math.floor(Math.random() * 101);
        
        // Generate random fortune elements
        const elements = [
            { name: 'Wood', score: Math.floor(Math.random() * 11) },
            { name: 'Fire', score: Math.floor(Math.random() * 11) },
            { name: 'Earth', score: Math.floor(Math.random() * 11) },
            { name: 'Metal', score: Math.floor(Math.random() * 11) },
            { name: 'Water', score: Math.floor(Math.random() * 11) }
        ];

        // Generate analysis
        const analysis = generateAnalysis(surname, birthDate);

        return {
            surname: surname,
            birthDate: birthDate,
            score: score,
            elements: elements,
            analysis: analysis
        };
    } catch (error) {
        console.error('Error in calculateNameCompatibility:', error);
        throw error;
    }
}

// Helper functions
function getRating(score) {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Very Good';
    if (score >= 55) return 'Good';
    if (score >= 40) return 'Average';
    return 'Needs Improvement';
}

// 生成五行元素分数
function generateElementScores() {
    return {
        Wood: Math.floor(Math.random() * 11),
        Fire: Math.floor(Math.random() * 11),
        Earth: Math.floor(Math.random() * 11),
        Metal: Math.floor(Math.random() * 11),
        Water: Math.floor(Math.random() * 11)
    };
}

// 计算姓名笔画
function calculateStrokeCount(surname) {
    const strokeMap = {
        '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
        '六': 6, '七': 7, '八': 8, '九': 9, '十': 10
    };
    return surname.split('').reduce((sum, char) => sum + (strokeMap[char] || 1), 0);
}

// 获取生肖
function getChineseZodiac(year) {
    const zodiacs = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
    return zodiacs[(year - 4) % 12];
}

// 获取星座
function getWesternSign(month, day) {
    const signs = [
        { name: '摩羯座', dates: [1, 20] },
        { name: '水瓶座', dates: [2, 19] },
        { name: '双鱼座', dates: [3, 20] },
        { name: '白羊座', dates: [4, 20] },
        { name: '金牛座', dates: [5, 21] },
        { name: '双子座', dates: [6, 21] },
        { name: '巨蟹座', dates: [7, 22] },
        { name: '狮子座', dates: [8, 23] },
        { name: '处女座', dates: [9, 23] },
        { name: '天秤座', dates: [10, 23] },
        { name: '天蝎座', dates: [11, 22] },
        { name: '射手座', dates: [12, 22] }
    ];
    
    for (let i = 0; i < signs.length; i++) {
        if (month === signs[i].dates[0] && day <= signs[i].dates[1]) {
            return signs[i].name;
        }
        if (month === signs[i].dates[0] + 1 && day <= signs[i].dates[1]) {
            return signs[i].name;
        }
    }
    return '射手座';
}

// 获取紫微斗数主星
function getPurpleStar(year, month, day) {
    const stars = ['紫微', '天机', '太阳', '武曲', '天同', '廉贞', '天府', '太阴', '贪狼', '巨门', '天相', '天梁'];
    return stars[Math.floor(Math.random() * 12)];
}

// 获取易经卦象
function getIChingHexagram(year, month, day) {
    const hexagrams = ['乾', '坤', '屯', '蒙', '需', '訟', '師', '比', '小畜', '履', '泰', '否'];
    return hexagrams[Math.floor(Math.random() * 12)];
}

// 获取笔画对应的五行
function getStrokeElement(stroke) {
    const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
    return elements[stroke % 5];
}

// 获取笔画的吉凶
function getStrokeAuspiciousness(stroke) {
    const auspicious = [1, 3, 5, 7, 8];
    return auspicious.includes(stroke % 10) ? '吉' : '中';
}

// 计算生命路径数
function calculateLifePathNumber(birthDate) {
    const [year, month, day] = birthDate.split('-');
    let sum = year.split('').reduce((a, b) => parseInt(a) + parseInt(b), 0) +
              month.split('').reduce((a, b) => parseInt(a) + parseInt(b), 0) +
              day.split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
    
    while (sum > 9) {
        sum = sum.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
    }
    return sum;
}

// 计算命运数
function calculateDestinyNumber(surname) {
    const strokeCount = calculateStrokeCount(surname);
    let sum = strokeCount.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
    while (sum > 9) {
        sum = sum.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
    }
    return sum;
}

// 生成名字建议
function generateNameSuggestions(surname) {
    const suggestions = [];
    const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
    
    for (let i = 0; i < 3; i++) {
        const element = elements[Math.floor(Math.random() * 5)];
        const name = `${surname}${"BCDFGHJKLMNPQRSTVWXYZ"[Math.floor(Math.random() * 21)]}${"AEIOU"[Math.floor(Math.random() * 5)]}`;
        suggestions.push(`建议名字: ${name} (${element}元素)`);
    }
    return suggestions;
}

// 生成个性发展建议
function generatePersonalityDevelopment() {
    return [
        '建议培养耐心和毅力',
        '加强沟通和表达能力',
        '注重团队合作精神'
    ];
}

// 生成职业发展建议
function generateCareerGuidance() {
    return [
        '适合从事创意相关工作',
        '适合领导岗位',
        '适合金融和投资领域'
    ];
}

// 获取幸运元素
function getLuckyElements(elements) {
    const sorted = Object.entries(elements).sort((a, b) => b[1] - a[1]);
    return sorted.slice(0, 2).map(e => e[0]);
}

// 生成吉日建议
function generateAuspiciousDates(birthDate) {
    const dates = [];
    for (let i = 0; i < 3; i++) {
        const month = Math.floor(Math.random() * 12) + 1;
        const day = Math.floor(Math.random() * 28) + 1;
        dates.push(`${month}/${day}`);
    }
    return dates;
}

// 计算整体兼容性
function calculateOverallCompatibility(elements) {
    const total = Object.values(elements).reduce((a, b) => a + b, 0);
    return Math.round(total / 5);
}

// 生成生命趋势
function generateLifeTrends() {
    return '事业稳定发展，人际关系良好，财务状况良好';
}

// 生成关键发展领域
function generateKeyAreas() {
    return '事业发展、人际关系、财务管理';
}

function generateAnalysis(surname, birthDate) {
    // 解析出生日期
    const [year, month, day] = birthDate.split('-');
    const birthYear = parseInt(year);
    const birthMonth = parseInt(month);
    const birthDay = parseInt(day);

    // 计算生肖
    const chineseZodiac = getChineseZodiac(birthYear);

    // 计算星座
    const westernSign = getWesternSign(birthMonth, birthDay);

    // 生成紫微斗数主星
    const purpleStar = getPurpleStar(birthYear, birthMonth, birthDay);

    // 生成易经卦象
    const iChing = getIChingHexagram(birthYear, birthMonth, birthDay);

    // 生成五行元素分数
    const elements = generateElementScores();

    // 计算姓名笔画
    const strokeCount = calculateStrokeCount(surname);

    // 生成分析内容
    return {
        chineseZodiac: {
            sign: chineseZodiac,
            description: getZodiacDescription(chineseZodiac),
            compatibility: getZodiacCompatibility(chineseZodiac)
        },
        westernSign: {
            sign: westernSign,
            description: getAstroSignDescription(westernSign),
            compatibility: getAstroCompatibility(westernSign)
        },
        purpleStar: {
            star: purpleStar,
            description: getPurpleStarDescription(purpleStar),
            traits: getPurpleStarTraits(purpleStar)
        },
        iChing: {
            hexagram: iChing,
            description: getIChingDescription(iChing),
            fortune: getIChingFortune(iChing)
        },
        nameAnalysis: {
            strokeCount: strokeCount,
            element: getStrokeElement(strokeCount),
            auspiciousness: getStrokeAuspiciousness(strokeCount)
        },
        recommendations: {
            nameSuggestions: generateNameSuggestions(surname),
            personalityDevelopment: generatePersonalityDevelopment(),
            careerGuidance: generateCareerGuidance(),
            luckyElements: getLuckyElements(elements),
            auspiciousDates: generateAuspiciousDates(birthDate)
        },
        overallAnalysis: {
            compatibilityScore: calculateOverallCompatibility(elements),
            lifeTrends: generateLifeTrends(),
            keyAreas: generateKeyAreas()
        }
    };
}
                    strong: elements[0],
                    weak: elements[4]
                },
                personality: {
                    strengths: "领导力强，创新思维，适应能力强",
                    weaknesses: "有时过于冒险，需要谨慎决策"
                }
            },
            fiveElements: {
                balance: "五行平衡，建议保持现状",
                suggestions: "保持五行平衡，避免过度偏向某一元素"
            },
            finalRecommendation: {
                score: totalScore,
                rating: getRating(totalScore),
                summary: "综合分析显示，您的名字与五行元素相匹配，建议保持现有名字"
            }
        }
    };
}
}
                            <div class="flex items-center">
                                <span class="w-24">Traits:</span>
                                <span class="font-medium">${"Independent, Innovative, Emotional, Rational".split(',')[Math.floor(Math.random() * 4)]}</span>
                            </div>
                        </div>
                    </div>

                    <div class="border-l-4 border-red-600 pl-4">
                        <h5 class="font-medium text-gray-700 mb-4">Lucky Numbers</h5>
                        <div class="space-y-3">
                            <div class="flex items-center">
                                <span class="w-24">Numbers:</span>
                                <span class="font-medium">${Math.floor(Math.random() * 9) + 1}, ${Math.floor(Math.random() * 9) + 1}, ${Math.floor(Math.random() * 9) + 1}</span>
                            </div>
                            <div class="flex items-center">
                                <span class="w-24">Suggestion:</span>
                                <span class="font-medium">${"Suitable for Name Stroke Count, Suitable for Total Name Stroke Count".split(',')[Math.floor(Math.random() * 2)]}</span>
                            </div>
                        </div>
                    </div>

                    <div class="border-l-4 border-blue-600 pl-4">
                        <h5 class="font-medium text-gray-700 mb-4">Name Recommendations</h5>
                        <div class="space-y-3">
                            <div class="flex items-center">
                                <span class="w-24">Characters:</span>
                                <span class="font-medium">${Math.floor(Math.random() * 3) + 2} characters</span>
                            </div>
                            <div class="flex items-center">
                                <span class="w-24">Strokes:</span>
                                <span class="font-medium">${Math.floor(Math.random() * 10) + 1} strokes</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Comprehensive Recommendations -->
            <div class="col-span-2 bg-white rounded-xl p-8 shadow-lg">
                <div class="text-center mb-8">
                    <h4 class="text-2xl font-bold text-gray-800 mb-2">Comprehensive Recommendations</h4>
                    <p class="text-gray-600">Integrated Name Selection Guidelines</p>
                </div>

                <div class="space-y-8">
                    <div class="border-l-4 border-orange-600 pl-4">
                        <h5 class="font-medium text-gray-700 mb-4">Name Focus</h5>
                        <div class="space-y-3">
                            <div class="flex items-center">
                                <span class="w-24">Emphasize:</span>
                                <span class="font-medium">${"Harmony, Balance, Prosperity".split(',')[Math.floor(Math.random() * 3)]}</span>
                            </div>
                            <div class="flex items-center">
                                <span class="w-24">Avoid:</span>
                                <span class="font-medium">${"Conflict, Tension, Stagnation".split(',')[Math.floor(Math.random() * 3)]}</span>
                            </div>
                        </div>
                    </div>

                    <div class="border-l-4 border-green-600 pl-4">
                        <h5 class="font-medium text-gray-700 mb-4">Five Elements</h5>
                        <div class="space-y-3">
                            <div class="flex items-center">
                                <span class="w-24">Element:</span>
                                <span class="font-medium">${"Metal, Wood, Water, Fire, Earth".split(',')[Math.floor(Math.random() * 5)]}</span>
                            </div>
                            <div class="flex items-center">
                                <span class="w-24">Suggestion:</span>
                                <span class="font-medium">${"Enhance Elements, Balance Elements, Strengthen Elements".split(',')[Math.floor(Math.random() * 3)]}</span>
                            </div>
                        </div>
                    </div>

                    <div class="border-l-4 border-purple-600 pl-4">
                        <h5 class="font-medium text-gray-700 mb-4">Final Recommendation</h5>
                        <p class="text-gray-600">${"Choose Auspicious Characters, Avoid Inauspicious Characters, Pay Attention to Character Structure".split(',')[Math.floor(Math.random() * 3)]}</p>
                    </div>
                </div>
            </div>

function showResultModal(result) {
    console.log('Showing result modal');
    
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50';
    
    // 创建模态框内容
    const modalContent = document.createElement('div');
    modalContent.className = 'relative mx-auto my-10 bg-white rounded-lg shadow-xl w-11/12 md:w-2/3 lg:w-1/2';
    
    // 创建标题
    const header = document.createElement('div');
    header.className = 'flex justify-between items-center p-6 border-b border-gray-200';
    
    const title = document.createElement('h2');
    title.className = 'text-xl font-bold text-gray-800';
    title.textContent = 'Name Compatibility Report';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'text-gray-500 hover:text-gray-700';
    closeBtn.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
    closeBtn.addEventListener('click', () => {
        console.log('Closing modal');
        modal.remove();
    });
    
    header.appendChild(title);
    header.appendChild(closeBtn);
    
    // 创建内容区域
    const body = document.createElement('div');
    body.className = 'p-6';
    
    // 添加评分部分
    const scoreSection = document.createElement('div');
    scoreSection.className = 'mb-6';
    
    const scoreTitle = document.createElement('h3');
    scoreTitle.className = 'text-lg font-semibold mb-2';
    scoreTitle.textContent = 'Compatibility Score';
    
    const scoreContainer = document.createElement('div');
    scoreContainer.className = 'flex items-center justify-between';
    
    const scoreValue = document.createElement('span');
    scoreValue.className = 'text-2xl font-bold text-blue-600';
    scoreValue.textContent = `${result.score}%`;
    
    const rating = document.createElement('span');
    rating.className = 'text-gray-600';
    rating.textContent = getRating(result.score);
    
    scoreContainer.appendChild(scoreValue);
    scoreContainer.appendChild(rating);
    
    scoreSection.appendChild(scoreTitle);
    scoreSection.appendChild(scoreContainer);
    
    // 添加五行分析
    const elementsSection = document.createElement('div');
    elementsSection.className = 'mb-6';
    
    const elementsTitle = document.createElement('h3');
    elementsTitle.className = 'text-lg font-semibold mb-4';
    elementsTitle.textContent = 'Five Elements Analysis';
    
    const elementsList = document.createElement('ul');
    elementsList.className = 'space-y-3';
    
    Object.entries(result.elements).forEach(([element, score]) => {
        const elementItem = document.createElement('li');
        elementItem.className = 'flex justify-between items-center';
        
        const elementName = document.createElement('span');
        elementName.className = 'text-gray-800';
        elementName.textContent = element;
        
        const elementScore = document.createElement('span');
        elementScore.className = 'text-blue-600 font-medium';
        elementScore.textContent = `${score}%`;
        
        elementItem.appendChild(elementName);
        elementItem.appendChild(elementScore);
        elementsList.appendChild(elementItem);
    });
    
    elementsSection.appendChild(elementsTitle);
    elementsSection.appendChild(elementsList);
    
    // 添加名字建议
    const nameSuggestionsSection = document.createElement('div');
    nameSuggestionsSection.className = 'mb-6';
    
    const nameSuggestionsTitle = document.createElement('h3');
    nameSuggestionsTitle.className = 'text-lg font-semibold mb-4';
    nameSuggestionsTitle.textContent = 'Name Recommendations';
    
    const nameSuggestionsList = document.createElement('ul');
    nameSuggestionsList.className = 'space-y-3';
    
    result.analysis.recommendations.nameSuggestions.forEach(suggestion => {
        const suggestionItem = document.createElement('li');
        suggestionItem.className = 'text-gray-700';
        suggestionItem.textContent = suggestion;
        nameSuggestionsList.appendChild(suggestionItem);
    });
    
    nameSuggestionsSection.appendChild(nameSuggestionsTitle);
    nameSuggestionsSection.appendChild(nameSuggestionsList);
    
    // 添加整体分析
    const overallAnalysisSection = document.createElement('div');
    overallAnalysisSection.className = 'mb-6';
    
    const overallAnalysisTitle = document.createElement('h3');
    overallAnalysisTitle.className = 'text-lg font-semibold mb-4';
    overallAnalysisTitle.textContent = 'Overall Analysis';
    
    const overallAnalysisContent = document.createElement('div');
    overallAnalysisContent.className = 'text-gray-700';
    
    // 构建整体分析内容
    const overallAnalysis = result.analysis.overallAnalysis;
    const analysisContent = `
        <p>兼容性评分: ${overallAnalysis.compatibilityScore}%</p>
        <p>生命趋势: ${overallAnalysis.lifeTrends}</p>
        <p>关键发展领域: ${overallAnalysis.keyAreas}</p>
    `;
    
    overallAnalysisContent.innerHTML = analysisContent;
    
    overallAnalysisSection.appendChild(overallAnalysisTitle);
    overallAnalysisSection.appendChild(overallAnalysisContent);
    
    // 将所有部分添加到内容区域
    body.appendChild(scoreSection);
    body.appendChild(elementsSection);
    body.appendChild(nameSuggestionsSection);
    body.appendChild(overallAnalysisSection);
    
    // 添加到模态框
    modalContent.appendChild(header);
    modalContent.appendChild(body);
    
    // 添加到模态框
    modal.appendChild(modalContent);
    
    // 添加到文档
    document.body.appendChild(modal);
    
    // 添加点击外部关闭功能
    modal.addEventListener('click', (e) => {
        console.log('Modal clicked');
        if (e.target === modal) {
            console.log('Closing modal by clicking outside');
            modal.remove();
        }
    });
}
    content.appendChild(scoreDiv);

    // Add analysis content
    const analysisContent = document.createElement('div');
    analysisContent.className = 'space-y-4';
    
    // Add Eastern Astrology Analysis
    const easternAnalysis = document.createElement('div');
    easternAnalysis.className = 'border-l-4 border-red-600 pl-4';
    easternAnalysis.innerHTML = `
        <h5 class="font-medium text-gray-700 mb-4">Eastern Astrology Analysis</h5>
        <div class="space-y-3">
            <div class="flex items-center">
                <span class="w-24">Four Pillars:</span>
                <span class="font-medium">${result.analysis.easternAnalysis.fourPillars.year.elements}</span>
            </div>
            <div class="flex items-center">
                <span class="w-24">Purple Star:</span>
                <span class="font-medium">${result.analysis.easternAnalysis.purpleStar.mainStars[0]}</span>
            </div>
            <div class="flex items-center">
                <span class="w-24">I Ching:</span>
                <span class="font-medium">${result.analysis.easternAnalysis.iChing.hexagram}</span>
            </div>
        </div>
    `;
    analysisContent.appendChild(easternAnalysis);

    // Add Western Astrology Analysis
    const westernAnalysis = document.createElement('div');
    westernAnalysis.className = 'border-l-4 border-blue-600 pl-4';
    westernAnalysis.innerHTML = `
        <h5 class="font-medium text-gray-700 mb-4">Western Astrology Analysis</h5>
        <div class="space-y-3">
            <div class="flex items-center">
                <span class="w-24">Zodiac Sign:</span>
                <span class="font-medium">${result.analysis.westernAnalysis.zodiacSign.sign}</span>
            </div>
            <div class="flex items-center">
                <span class="w-24">Lucky Numbers:</span>
                <span class="font-medium">${result.analysis.westernAnalysis.zodiacSign.luckyNumbers.join(', ')}</span>
            </div>
            <div class="flex items-center">
                <span class="w-24">Personality:</span>
                <span class="font-medium">${result.analysis.westernAnalysis.zodiacPersonality}</span>
            </div>
        </div>
    `;
    analysisContent.appendChild(westernAnalysis);

    // Add Recommendations
    const recommendations = document.createElement('div');
    recommendations.className = 'border-l-4 border-green-600 pl-4';
    recommendations.innerHTML = `
        <h5 class="font-medium text-gray-700 mb-4">Recommendations</h5>
        <div class="space-y-3">
            <div class="flex items-center">
                <span class="w-24">Focus:</span>
                <span class="font-medium">${result.analysis.recommendations.nameFocus.elements.strong.name}</span>
            </div>
            <div class="flex items-center">
                <span class="w-24">Balance:</span>
                <span class="font-medium">${result.analysis.recommendations.fiveElements.balance}</span>
            </div>
            <div class="flex items-center">
                <span class="w-24">Final:</span>
                <span class="font-medium">${result.analysis.recommendations.finalRecommendation.summary}</span>
            </div>
        </div>
    `;
    analysisContent.appendChild(recommendations);

    content.appendChild(analysisContent);
    modalContent.appendChild(header);
    modalContent.appendChild(content);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Close modal when clicking outside
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    };
}
    content.appendChild(ratingDiv);

    // 添加推荐建议
    const recommendationsDiv = document.createElement('div');
    recommendationsDiv.className = 'mb-6';
    
    const recommendationsTitle = document.createElement('h3');
    recommendationsTitle.className = 'text-xl font-bold mb-2';
    recommendationsTitle.textContent = 'Recommendations';
    recommendationsDiv.appendChild(recommendationsTitle);

    const recommendationsGrid = document.createElement('div');
    recommendationsGrid.className = 'grid grid-cols-2 gap-4';

    const favorableRecs = document.createElement('div');
    favorableRecs.innerHTML = `
        <h4 class="text-lg font-semibold mb-2">Favorable</h4>
        <ul class="space-y-1">
            ${result.recommendations.favorable.map(rec => `<li class="text-green-600">${rec}</li>`).join('')}
        </ul>
    `;
    recommendationsGrid.appendChild(favorableRecs);

    const unfavorableRecs = document.createElement('div');
    unfavorableRecs.innerHTML = `
        <h4 class="text-lg font-semibold mb-2">Unfavorable</h4>
        <ul class="space-y-1">
            ${result.recommendations.unfavorable.map(rec => `<li class="text-red-600">${rec}</li>`).join('')}
        </ul>
    `;
    recommendationsGrid.appendChild(unfavorableRecs);

    recommendationsDiv.appendChild(recommendationsGrid);
    content.appendChild(recommendationsDiv);

    // 添加详细分析
    const analysisDiv = document.createElement('div');
    analysisDiv.className = 'mb-6';
    analysisDiv.innerHTML = result.analysis;
    content.appendChild(analysisDiv);

    // 添加关闭按钮
    const closeButton = document.createElement('button');
    closeButton.className = 'w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors';
    closeButton.textContent = 'Close';
    closeButton.onclick = () => modal.remove();
    content.appendChild(closeButton);

    // 将内容添加到模态框
    modal.appendChild(content);
    // 将模态框添加到页面
    document.body.appendChild(modal);
}

function closeModal() {
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) {
        modal.remove();
    }
}
