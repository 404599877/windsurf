const fs = require('fs');
const https = require('https');

const images = [
    { url: 'https://raw.githubusercontent.com/cascadeflow/sample-images/main/snake.png', name: 'snake.png' },
    { url: 'https://raw.githubusercontent.com/cascadeflow/sample-images/main/apple.png', name: 'apple.png' },
    { url: 'https://raw.githubusercontent.com/cascadeflow/sample-images/main/banana.png', name: 'banana.png' },
    { url: 'https://raw.githubusercontent.com/cascadeflow/sample-images/main/grape.png', name: 'grape.png' },
    { url: 'https://raw.githubusercontent.com/cascadeflow/sample-images/main/strawberry.png', name: 'strawberry.png' },
    { url: 'https://raw.githubusercontent.com/cascadeflow/sample-images/main/obstacle.png', name: 'obstacle.png' }
];

const downloadImage = (url, filename) => {
    const file = fs.createWriteStream(`assets/images/${filename}`);
    https.get(url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log(`Downloaded ${filename}`);
        });
    });
};

images.forEach(img => downloadImage(img.url, img.name));
