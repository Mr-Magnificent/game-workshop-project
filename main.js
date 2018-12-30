let game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'first-game', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

function preload() {
    game.load.image('bomb', 'bomb_PNG41.png');
    game.load.image('jet', 'jet.png');
    game.load.image('space', 'starfield.png');
    game.load.image('coin', 'coin.png');
    game.load.image('coins', 'coins.png');
    game.load.image('heart','PixelArt.png');
    game.load.audio('coin_touch', 'metal.wav');
    game.load.image('woman', './L2/sheet.png', 189, 230, 14);
}

let player;
let space;
let coins;
let bombs;
let score = 0;
let text;
let hearts;
let endText;
let woman;
let cursors;
let moreCoin;
let bullets;
let coinSound;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    space = game.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, 'space');
    
    player = game.add.sprite(game.input.x, game.input.y, 'jet');
    player.anchor.set(0.5, 0.5);
    game.physics.arcade.enable(player);

    coinSound = game.add.sound('coin_touch');

    coins = game.add.group();
    for (let i = 0; i < 20; i++) {
        coin = coins.create(game.rnd.between(0, window.innerWidth), game.rnd.between(0, window.innerHeight), 'coin');
        coin.scale.setTo(0.2, 0.2);
        coin.anchor.set(0.5, 0.5);
        game.physics.arcade.enable(coin);
        coin.body.mass = -10;
    }

    // woman = game.add.sprite(200, 200, 'woman');
    // woman.animations.add('walk');

    // woman.animations.play('walk', 14, true);

    game.physics.arcade.enable(woman)
    cursors = game.input.keyboard.createCursorKeys();

    moreCoin = game.add.group();
    let coinGroup = moreCoin.create(game.rnd.between(0, window.innerWidth), game.rnd.between(0, window.innerHeight), 'coins');
    coinGroup.anchor.set(0.5, 0.5);
    game.physics.arcade.enable(coinGroup);
    coinGroup.body.mass = -10;

    setInterval(() => {
        let prevCoinGroup = moreCoin.children.pop();
        prevCoinGroup.destroy();
        prevCoinGroup = null;
        let coinGroup = moreCoin.create(game.rnd.between(0, window.innerWidth), game.rnd.between(0, window.innerHeight), 'coins');
        coinGroup.anchor.set(0.5, 0.5);
        game.physics.arcade.enable(coinGroup);
        coinGroup.body.mass = -10;
    }, 3000);

    bombs = game.add.group();
    for(let i = 0; i < 20; i++) {
        bomb = bombs.create(game.rnd.between(0, window.innerWidth), game.rnd.between(0, window.innerHeight), 'bomb');
        bomb.scale.setTo(0.05, 0.05);
        bomb.anchor.set(0.5, 0.5);
        game.physics.arcade.enable(bomb);
        bomb.body.mass = -10;
    }

    bullets = game.add.group();

    hearts = game.add.group();
    for(let i = 0; i < 3; i++ ) {
        heart = hearts.create((0 + i * 40), 30, 'heart');
        heart.scale.setTo(0.1, 0.1);
    }

    let style = {
        font: "25px Arial",
        fill: "#ff0044",
        align: "center"
    }
    text = game.add.text(0, 0, `Score: ${score}`, style);
    console.log(hearts);

    endText = game.add.text((window.innerWidth / 2), (window.innerHeight / 2), '', style);
    endText.anchor.set(0.5, 0.5);
    console.log(player);
}

function update() {

    game.physics.arcade.collide(player, coins, handlerCoin, processorCoin, this);
    game.physics.arcade.collide(player, moreCoin, handlerMoreCoin, processorMoreCoin, this);
    game.physics.arcade.overlap(bullets, coins, bulletCheck, processorBullet, this);

    let output = game.physics.arcade.collide(player, bombs, handlerBomb, processorBomb, this);

    if(cursors.up.isDown) {
        shoot();
    }

    player.body.velocity.x = (game.input.x - player.x) * 4;
    player.body.velocity.y = (game.input.y - player.y) * 4;

    space.tilePosition.y -= player.body.velocity.y / 100;
    space.tilePosition.x -= player.body.velocity.x / 100;

    let degree = Math.atan2((game.input.y - player.y), (game.input.x - player.x)) * 180 / Math.PI + 90;
    //if ((game.input.x - player.x) < 0) {
      //  degree = Math.atan((game.input.y - player.y) / (game.input.x - player.x)) * 180 / Math.PI + 270;
    //}

    player.angle = degree;
}

function handlerBomb(p, b) {
    return true;
}

function handlerMoreCoin(p, mc) {
    score += 500;
    return true;
}

function processorMoreCoin(p, mc) {
    text.setText(`Score: ${score}`);
    // coinSound.play();
    mc.x = game.rnd.between(0, window.innerWidth);
    mc.y = game.rnd.between(0, window.innerHeight);
}

function processorBomb(p, b) {
    let heart;
    try {
        heart = hearts.children.pop();
        heart.destroy();
        heart = null;
    } catch (err) {
        endText.setText(`Score: ${score}, GAME OVER!!!`);
        game.paused = true;
        // throw err;
    }
    
    b.x = game.rnd.between(0, window.innerWidth);
    b.y = game.rnd.between(0, window.innerHeight);
}

function handlerCoin(p, c) {
    score += 100;
    return true;
}

function shoot() {
    let bullet = bullets.create(player.x, player.y, 'coins');
    // bullet.anchor.set(0.5, 0.5);
    bullet.scale.setTo(0.1);
    game.physics.arcade.enable(bullet);
    // bullet.body.bounce.x = 1;
    // bullet.body.bounce.y = 1;
    bullet.body.velocity.x = 1000 * Math.cos((player.angle - 90) * Math.PI / 180);
    bullet.body.velocity.y = 1000 * Math.sin((player.angle - 90) * Math.PI / 180);
}

function processorCoin(p, c) {
    text.setText(`Score: ${score}`);
    // coinSound.play();
    c.x = game.rnd.between(0, window.innerWidth);
    c.y = game.rnd.between(0, window.innerHeight);
}

function render() {
    bullets.children.forEach(element => {
        element.scale.x = element.scale.x + 0.01;
        element.scale.y = element.scale.y + 0.01;
    })
}

function bulletCheck (b, c) {
    return true;
}

function processorBullet(b, c) {
    c.x = game.rnd.between(0, window.innerWidth);
    c.y = game.rnd.between(0, window.innerWidth);
}