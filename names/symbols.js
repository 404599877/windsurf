// 十二星座符号
const zodiacSymbols = [
    'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
    'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

// 十二生肖符号
const chineseZodiacSymbols = [
    'rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake',
    'horse', 'sheep', 'monkey', 'rooster', 'dog', 'pig'
];

// 在HTML中添加符号容器
const symbolsContainer = document.createElement('div');
symbolsContainer.className = 'symbols-container';
document.body.appendChild(symbolsContainer);

// 生成符号并添加到容器中
function createSymbols() {
    const allSymbols = [...zodiacSymbols, ...chineseZodiacSymbols];
    symbolsContainer.innerHTML = '';
    const vw = window.innerWidth, vh = window.innerHeight;
    const zodiacCount = zodiacSymbols.length;
    const chineseCount = chineseZodiacSymbols.length;
    const zodiacGap = vh / (zodiacCount + 1);
    const chineseGap = vh / (chineseCount + 1);

    // 12星座：左侧竖直排列
    zodiacSymbols.forEach((symbol, i) => {
        const symbolElement = document.createElement('div');
        symbolElement.className = `symbol ${symbol}`;
        symbolElement.style.left = '2vw';
        symbolElement.style.top = `${(i + 1) * zodiacGap}px`;
        symbolElement.style.transform = 'translateY(-50%)';
        symbolsContainer.appendChild(symbolElement);
    });

    // 12生肖：右侧竖直排列
    chineseZodiacSymbols.forEach((symbol, i) => {
        const symbolElement = document.createElement('div');
        symbolElement.className = `symbol ${symbol}`;
        symbolElement.style.right = '2vw';
        symbolElement.style.left = '';
        symbolElement.style.top = `${(i + 1) * chineseGap}px`;
        symbolElement.style.transform = 'translateY(-50%)';
        symbolsContainer.appendChild(symbolElement);
    });
}

// 监听窗口大小变化
window.addEventListener('resize', () => {
    symbolsContainer.innerHTML = '';
    createSymbols();
});

// 初始化
createSymbols();
