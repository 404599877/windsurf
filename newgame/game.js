const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 260,
    parent: 'game-container',
    scene: { preload, create, update },
    backgroundColor: "#f0f0f0"
};
const game = new Phaser.Game(config);

function preload() {
    this.load.image("potato", "assets/potato.png");
    this.load.image("potato_level2", "assets/potato_level2.png");
    this.load.atlas("flares", "assets/flares.png", "assets/flares.json");
    this.load.audio("bruh_sound", "assets/bruh.mp3");
}

function create() {
    // 获取容器宽高
    const width = this.sys.game.config.width;
    const height = this.sys.game.config.height;
    // 创建两个可拖拽物品，居中显示并自适应缩放
    const item1 = this.add.image(width / 2 - 60, height / 2, "potato").setInteractive();
    const item2 = this.add.image(width / 2 + 60, height / 2, "potato").setInteractive();
    this.input.setDraggable(item1);
    this.input.setDraggable(item2);

    // 图片自适应缩放
    [item1, item2].forEach(item => {
        item.setOrigin(0.5);
        const scaleX = 80 / item.width;
        const scaleY = 80 / item.height;
        const scale = Math.min(scaleX, scaleY);
        item.setScale(scale);
    });

    // 拖拽跟随
    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        gameObject.x = dragX;
        gameObject.y = dragY;
    });

    // 拖拽结束检测合并
    this.input.on("dragend", (pointer, gameObject) => {
        const target = findOverlappingItem(gameObject, this.children.list);
        if (target && target.texture.key === gameObject.texture.key) {
            mergeItems.call(this, gameObject, target);
        }
    }, this);
}

function update() {}

function findOverlappingItem(item, allItems) {
    for (let other of allItems) {
        if (other !== item && other.texture && other.texture.key === item.texture.key) {
            const dx = other.x - item.x;
            const dy = other.y - item.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 60) {
                return other;
            }
        }
    }
    return null;
}

function mergeItems(item1, item2) {
    // 爆炸粒子效果
    const particles = this.add.particles("flares");
    particles.createEmitter({
        frame: "red",
        x: item2.x, y: item2.y,
        speed: { min: 100, max: 200 },
        angle: { min: 0, max: 360 },
        scale: { start: 0.4, end: 0 },
        lifespan: 500,
        quantity: 12,
        blendMode: "SCREEN"
    });

    // 播放音效
    this.sound.play("bruh_sound");

    // 销毁物品
    item1.destroy();
    item2.destroy();

    // 生成新物品，居中显示并自适应缩放
    const newItem = this.add.image(item2.x, item2.y, "potato_level2").setOrigin(0.5);
    const scaleX = 90 / newItem.width;
    const scaleY = 90 / newItem.height;
    const scale = Math.min(scaleX, scaleY);
    newItem.setScale(scale);
    this.input.setDraggable(newItem);
} 