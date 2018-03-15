import config from './config';
import leapMovement from './leapMotionMovement';

export default class Level4 extends Phaser.Scene{
    constructor(){
        super({key:'level4'});
    }

    preload(){
        this.load.image('bg', 'assets/spritesEnvironement/desertSprite/BG.png');

        this.loadIdle();
        this.loadRun();
        this.loadRunReverse();

        this.loadPlatform();
        this.loadIngredients();

        this.load.image('arrow', 'assets/spritesEnvironement/desertSprite/SignArrow.png');
    }

    create(){
        // Background
        this.add.image(640, 330, 'bg');

        // Anim joueur
        this.anims.create({
            key: 'idle',
            frames: [
                { key: 'Idle1' },
                { key: 'Idle2' },
                { key: 'Idle3' },
                { key: 'Idle4' },
                { key: 'Idle5' },
                { key: 'Idle6' },
                { key: 'Idle7' },
                { key: 'Idle8' },
                { key: 'Idle9' },
                { key: 'Idle10', duration: 50 }
            ],
            frameRate: 15,
            repeat: -1
        });
        this.anims.create({
            key: 'runRight',
            frames: [
                { key: 'Run1' },
                { key: 'Run2' },
                { key: 'Run3' },
                { key: 'Run4' },
                { key: 'Run5' },
                { key: 'Run6' },
                { key: 'Run7' },
                { key: 'Run8', duration: 50  }
            ],
            frameRate: 15,
            repeat: -1
        });
        this.anims.create({
            key: 'runLeft',
            frames: [
                { key: 'Run1Reverse' },
                { key: 'Run2Reverse' },
                { key: 'Run3Reverse' },
                { key: 'Run4Reverse' },
                { key: 'Run5Reverse' },
                { key: 'Run6Reverse' },
                { key: 'Run7Reverse' },
                { key: 'Run8Reverse', duration: 50  }
            ],
            frameRate: 15,
            repeat: -1
        });

        this.player = this.physics.add.sprite(50, 490, 'Idle1').setScale(0.19).setCollideWorldBounds(true).play('idle');
        this.input = this.input.keyboard.createCursorKeys();

        // Create platform position
        this.sPlatforms = [{x:350,y:320,scale:.60}, {x:850,y:300,scale:.60}];
        this.Platforms = [{x:670,y:450,scale:.35}];
        this.hPlatforms = [ {x: 150, y: 730, scale: .75}, {x: 50, y: 250, scale: .30}, {x: 1150, y: 750, scale: .7}];
        this.listIngredients = [{x:50,y:160},{x:360,y:279},{x:700,y:415},{x:860,y:258}];

        // Group platform
        this.objectPlatform = this.physics.add.staticGroup();
        this.objectPlatform.enableBody = true;

        this.Platforms.forEach(Platform => {
            this.objectPlatform
                .create(Platform.x, Platform.y, 'Platform')
                .setScale( Platform.scale ? Platform.scale : 1 )
                .refreshBody();
        });
        this.sPlatforms.forEach(sPlatform => {
            this.objectPlatform
                .create(sPlatform.x, sPlatform.y, 'sPlatform')
                .setScale( sPlatform.scale ? sPlatform.scale : 1 )
                .refreshBody();
        });
        this.hPlatforms.forEach(hPlatform => {
            this.objectPlatform
                .create(hPlatform.x, hPlatform.y, 'hPlatform')
                .setScale( hPlatform.scale ? hPlatform.scale : 1 )
                .refreshBody();
        });


        // Group cheeses
        this.ingredients =['fraise', 'cheese', 'carrots'];


        this.objectIngredients = this.physics.add.staticGroup();
        this.objectIngredients.enableBody = true;
        this.listIngredients.forEach(listIngredient => {
            this.objectIngredients
                .create(listIngredient.x, listIngredient.y, this.ingredients[Math.floor(Math.random()*this.ingredients.length)])
                .setScale( listIngredient.scale ? listIngredient.scale : 1 )
                .refreshBody();
        });

        //score
        this.score = 0;
        this.scoreText = this.add.text(16, 16,`Ingrédients:  ${this.score}` , { fontSize: '20px', fill: '#000' });

        this.physics.add.overlap(this.player, this.objectIngredients, this.collectIngredients, null, this);

        // Leap movement
        leapMovement.call(this);

        // Next level
        this.nextLevel = this.physics.add.image(1200, 0,'arrow');
        this.physics.add.overlap(this.player, this.nextLevel, this.startNextLevel, null, this);

    }
    update(){
        // Collision
        this.physics.add.collider(this.player, this.objectPlatform);
        this.physics.add.collider(this.nextLevel, this.objectPlatform);

        // Défaite
        if (this.player.y + (this.player.height * 0.19) >= config.height) {
            this.scene.start('gameover');
        }
    }

    loadIdle(){
        this.load.image('Idle1', 'assets/spritesCharacter/Robin_Cook/Idle1.png');
        this.load.image('Idle2', 'assets/spritesCharacter/Robin_Cook/Idle2.png');
        this.load.image('Idle3', 'assets/spritesCharacter/Robin_Cook/Idle3.png');
        this.load.image('Idle4', 'assets/spritesCharacter/Robin_Cook/Idle4.png');
        this.load.image('Idle5', 'assets/spritesCharacter/Robin_Cook/Idle5.png');
        this.load.image('Idle6', 'assets/spritesCharacter/Robin_Cook/Idle6.png');
        this.load.image('Idle7', 'assets/spritesCharacter/Robin_Cook/Idle7.png');
        this.load.image('Idle8', 'assets/spritesCharacter/Robin_Cook/Idle8.png');
        this.load.image('Idle9', 'assets/spritesCharacter/Robin_Cook/Idle9.png');
        this.load.image('Idle10', 'assets/spritesCharacter/Robin_Cook/Idle10.png');
    }
    loadRun(){
        this.load.image('Run1', 'assets/spritesCharacter/Robin_Cook/Run1.png');
        this.load.image('Run2', 'assets/spritesCharacter/Robin_Cook/Run2.png');
        this.load.image('Run3', 'assets/spritesCharacter/Robin_Cook/Run3.png');
        this.load.image('Run4', 'assets/spritesCharacter/Robin_Cook/Run4.png');
        this.load.image('Run5', 'assets/spritesCharacter/Robin_Cook/Run5.png');
        this.load.image('Run6', 'assets/spritesCharacter/Robin_Cook/Run6.png');
        this.load.image('Run7', 'assets/spritesCharacter/Robin_Cook/Run7.png');
        this.load.image('Run8', 'assets/spritesCharacter/Robin_Cook/Run8.png');
    }
    loadRunReverse(){
        this.load.image('Run1Reverse', 'assets/spritesCharacter/Robin_Cook/Run1Reverse.png');
        this.load.image('Run2Reverse', 'assets/spritesCharacter/Robin_Cook/Run2Reverse.png');
        this.load.image('Run3Reverse', 'assets/spritesCharacter/Robin_Cook/Run3Reverse.png');
        this.load.image('Run4Reverse', 'assets/spritesCharacter/Robin_Cook/Run4Reverse.png');
        this.load.image('Run5Reverse', 'assets/spritesCharacter/Robin_Cook/Run5Reverse.png');
        this.load.image('Run6Reverse', 'assets/spritesCharacter/Robin_Cook/Run6Reverse.png');
        this.load.image('Run7Reverse', 'assets/spritesCharacter/Robin_Cook/Run7Reverse.png');
        this.load.image('Run8Reverse', 'assets/spritesCharacter/Robin_Cook/Run8Reverse.png');
    }

    loadIngredients(){
        this.load.image('cheese', 'assets/spritesEnvironement/fromage.png');
        this.load.image('fraise', 'assets/spritesEnvironement/Fraise.png');
        this.load.image('carrots', 'assets/spritesEnvironement/carrots.png');
    }
    loadPlatform(){
        this.load.image('Platform', 'assets/spritesEnvironement/desertSprite/Platform.png');
        this.load.image('hPlatform', 'assets/spritesEnvironement/desertSprite/hPlatform.png');
        this.load.image('sPlatform', 'assets/spritesEnvironement/desertSprite/sPlatform.png');
    }


    collectIngredients(player,ingredients){
        ingredients.disableBody(true, true);
        this.score += 1;
        (this.score <= 1) ? (this.scoreText.setText( `Ingrédient: ${this.score}` )) : ( this.scoreText.setText( `Ingrédients: ${this.score}` ));
    }
    startNextLevel(player, nextLevel){
        if (this.objectIngredients.countActive(true) === 0){
            nextLevel.disableBody(true, true);
            this.scene.start('win');
        }
    }
}