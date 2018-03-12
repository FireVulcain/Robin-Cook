import config from './config';

export default {
    preload : preload,
    create : create,
    update : update,
    render : render
}
// Variables
let platforms = [ {x: config.width/2 , y:config.height, scale: 2}, {x:600,y:400}, {x:50,y:250}, {x:750,y:220} ];
let objectPlatform;

let player;
let input;

let cheeses;
let score = 0;
let scoreText;

let bombs;

function preload (){
    this.load.image('bg', 'assets/test/BG.png');
    this.load.image('ground', 'assets/test/platform.png');
    this.load.image('cheese', 'assets/test/fromage.png');
    this.load.image('bomb', 'assets/test/bomb.png');
    this.load.spritesheet('player', 'assets/test/dude.png',{frameWidth: 32,frameHeight: 48});
}

function create (){
    // Background
    this.add.image(400, 300, 'bg');

    // Create platforms
    objectPlatform = this.physics.add.staticGroup();
    objectPlatform.enableBody = true;

    platforms.forEach(platform => {
        objectPlatform
            .create(platform.x, platform.y, 'ground')
            .setScale( platform.scale ? platform.scale : 1 )
            .refreshBody();
    });

    // Player
    player = this.physics.add.sprite(100, 450, 'player');
    player.setCollideWorldBounds(true);

    // Sprite animation
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'player', frame: 4 } ],
        frameRate: 20
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
    input = this.input.keyboard.createCursorKeys();

    // Cheeses and scoring
    cheeses = this.physics.add.group({ key: 'cheese', repeat: 11, setXY: { x: 12, y: 0, stepX: 70 } });
    cheeses.enableBody = true;
    scoreText = this.add.text(16, 16,`Fromage:  ${score}` , { fontSize: '20px', fill: '#000' });

    // Bomb
    bombs = this.physics.add.group();

    // Overlap player / cheeses
    this.physics.add.overlap(player, cheeses, collectCheese, null, this);

}

function update(){
    // Collision
    this.physics.add.collider(player, objectPlatform);
    this.physics.add.collider(cheeses, objectPlatform);
    this.physics.add.collider(bombs, objectPlatform);
    this.physics.add.collider(player, bombs, hitBomb, null, this);

    movement();
}

function movement(){
    if (input.left.isDown){
        player.setVelocityX(-160);
        player.anims.play('left', true);
    }
    else if (input.right.isDown){
        player.setVelocityX(160);
        player.anims.play('right', true);
    }else{
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if (input.up.isDown && player.body.touching.down){
        player.setVelocityY(-390);
    }
}
function collectCheese (player, cheese){
    cheese.disableBody(true, true);

    score += 1;

    (score <= 1) ? (scoreText.setText( `Fromage: ${score}` )) : ( scoreText.setText( `Fromages: ${score}` ));

    if (cheeses.countActive(true) === 0){
        // Respawn cheeses if number cheese = 0
        cheeses.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });
        spawnBomb();
    }
}
function spawnBomb(){
    let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    let bomb = bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;
}
function hitBomb (player, bomb) {
    this.physics.pause(); // Block player
    player.setTint(0xff0000); // Red color
    player.anims.play('turn');
}
function render() {

}