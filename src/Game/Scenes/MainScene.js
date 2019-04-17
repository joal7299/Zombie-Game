const Phaser = require('phaser');
const SerialPortReader = require('../SerialPortReader');

//Import Actors
const Player = require('../Player');
const Arm = require('../Arm');
const Enemy = require('../Enemy');
const HitRect = require('../HitRect');

const getAngle = require('../Utils/GetAngle');
const wallCollision = require('../Utils/WallCollision');
const isCircleCollision = require('../Utils/IsCircleCollision');
const isBoxCollision = require('../Utils/IsBoxCollision');


var movement;
var leftFire;
var rightFire;




function isBoxBetween(p, e, r) {
    if (r.xmin == r.xmax) {    //check which side of the wall is short
        if ((e.x < r.xmin && r.xmin < p.x) || (p.x < r.xmin && r.xmin < e.x)) {
            let x = Math.abs(e.x - r.xmin);
            let y = x * Math.abs(Math.tan(Math.PI/2 - (e.angle * Math.PI / 180)));
            //console.log(y);
            if ((r.ymin < y) && (y < r.ymax)){
                //console.log('a');
                return true;
            }
            else{
                //console.log('b');
                return false;
            }
        }
        else {
            return false;
        }
    }

    if (r.ymin == r.ymax) {    //check which side of the wall is short
        if ((e.y < r.ymin && r.ymin < p.y) || (p.y < r.ymin && r.ymin < e.y)) {
            let y = Math.abs(e.y - r.ymin);
            let x = y / Math.abs(Math.tan(e.angle * Math.PI / 180));
            //console.log(x);
            if ((r.xmin < x) && (x < r.xmax)){
                //console.log('c');
                return true;
            }
            else{
                //console.log('d');
                return false;
            }
        }
        else {
            return false;
        }
    }
}

var walls;
//const wall1 = new HitRect(-1,0,0,600);
// this.graphics.fillRect(-1, 0, 1, 600);
// this.graphics.fillRect(0, 0, 800, 1);
// this.graphics.fillRect(0, 600, 800, 1);
// this.graphics.fillRect(800, 0, 1, 800);

class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
        SerialPortReader.addListener(this.onSerialMessage.bind(this));
    }

preload() {
    this.load.image('zombie', ['../assets/zombie.png']);
    this.load.image('wall', ['../assets/wall.png']);
    this.load.image('leftarm', ['../assets/leftarm.png']);
    this.load.image('rightarm', ['../assets/rightarm.png']);
    this.load.image('zombieright', ['../assets/zombieright.png']);
    this.load.image('zombieleft', ['../assets/zombieleft.png']);
    this.load.image('zombienoarms', ['../assets/zombienoarms.png']);
    this.load.image('heart', ['../assets/heart.png']);
    this.load.audio('splat', ['../assets/ArmSplat.wav']);
    this.load.audio('armFire', ['../assets/Arm Firing.wav']);
    this.load.audio('damage', ['../assets/zombieDamage.wav']);
    // this.load.audio('step1', '../assets/zombieStep1');
    // this.load.audio('step2', '../assets/zombieStep2');
    this.load.audio('step', ['../assets/zombieStep.wav']);
    this.load.audio('enemyHit', ['../assets/enemyHit.wav']);
    this.load.audio('background', ['../assets/zombieBackground.mp3']);
    this.load.audio('walking', ['../assets/walking.wav']);
    this.load.audio('walkingBack', ['../assets/walkingBack.wav']);
    this.load.audio('armShoot', ['../assets/armShoot.wav']);

    //this.load.audio('whatYouWantToCallTheSound', ['../assets/explode.wav']);
    //this.sound.play('whatYouWantToCallTheSound');
    //sound markers
    //this.sound.play('whatYouWantToCallTheSound', {name: 'burst', start: 0, duration: 0.1});
    //this will start at 0 and play for 0.1 of a second
    //this.sound.play('whatYouWantToCallTheSound', { loop: true });
}

onSerialMessage(msg) {
    // Put your serial reading code in here. msg will be a string
    console.log(msg);
    movement = msg[0];
    leftFire = msg[2];
    rightFire = msg[4];
}



create() {
    //creating walls as a static group
    //walls = this.physics.add.staticGroup();

    //width then height
    // this.add.image(50, 100, 'wall').setScale(10, .5);
    // this.add.image(200, 300, 'wall').setScale(40, .5);
    // this.add.image(400, 100, 'wall').setScale(.5, 20);
    // this.add.image(500, 300, 'wall').setScale(20, .5);
    // this.add.image(600, 200, 'wall').setScale(.5, 20);
    // this.add.image(450, 400, 'wall').setScale(70, .5);
    // this.add.image(300, 450, 'wall').setScale(.5, 10);
    // this.add.image(500, 550, 'wall').setScale(.5, 10);

    // this.overlay = document.querySelector('#main-screen');
    // this.overlay.classList.remove('hidden');

    var bounceTime = 100;
    var hitTime = 100;

    var wallIsCollidingLeft = false;
    var wallIsCollidingRight = false;

    var leftFire = false;
    var rightFire = false;

    var walking = false;
    var wasGoingForward = false; 
    var wasGoingBack = false;

    var soundExistsF = false;
    var soundExistsB = false;

    var firstTimeL = true;
    var firstTimeR = true;


    //Phaser Elements
    this.keys = {
        left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
        right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
        up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
        down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
        space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
        a: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        d: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
    
    this.graphics = this.add.graphics({
        fillStyle: { color: 0xeeeeee },
        lineStyle: { width: 3, color: 0xeeeeee }
    });

    //this.walls = [];
    // for (let i = 0; i < 12; i ++) {
    //         this.walls.push(new HitRect());
    // }
    
    //Outer walls
    // this.walls[0].setSize(-1,-1,-1,751);
    // this.walls[1].setSize(-1,401,50,50);
    // this.walls[2].setSize(-1,401,751,751);
    // this.walls[3].setSize(401,401,-1,751);

    //Layout walls
    // this.walls[4].setSize(60,400,690,750);
    // this.walls[5].setSize(0,150,550,600);
    // this.walls[6].setSize(250,400,550,600);
    // this.walls[7].setSize(80,320,250,470);
    // this.walls[8].setSize(70,330,130,180);
    // this.walls[9].setSize(100,800,400,400);
    // this.walls[10].setSize(300,300,400,500);
    // this.walls[11].setSize(500,500,500,600);

    this.walls = [
        [{x: -1, y: -1},{x: -1, y: 751}],
        [{x: -1, y: 50},{x: 401, y: 50}],
        [{x: -1, y: 751},{x: 401, y: 751}],
        [{x: 401, y: -1},{x: 401, y: 751}],
        [{x: 80, y: 700},{x: 400, y: 700}, {x: 400, y: 750}, {x: 80, y: 750}],
        [{x: 0, y: 550},{x: 150, y: 550}, {x: 150, y: 600}, {x: 0, y: 600}],
        [{x: 250, y: 550},{x: 400, y: 550}, {x: 400, y: 600}, {x: 250, y: 600}],
        [{x: 80, y: 250},{x: 320, y: 250}, {x: 320, y: 470}, {x: 80, y: 470}],
        [{x: 70, y: 130},{x: 330, y: 130}, {x: 330, y: 180}, {x: 70, y: 180}]
    ];

    this.numWalls = 9;
    this.pointNums = [
        2,
        2,
        2,
        2,
        4,
        4,
        4,
        4,
        4
    ];

    this.strokeA = [
        new Phaser.Geom.Point(this.walls[0][0].x,this.walls[0][0].y),
        new Phaser.Geom.Point(this.walls[0][1].x,this.walls[0][1].y)
    ];
    this.strokeB = [
        new Phaser.Geom.Point(this.walls[1][0].x,this.walls[1][0].y),
        new Phaser.Geom.Point(this.walls[1][1].x,this.walls[1][1].y)
    ];
    this.strokeC = [
        new Phaser.Geom.Point(this.walls[2][0].x,this.walls[2][0].y),
        new Phaser.Geom.Point(this.walls[2][1].x,this.walls[2][1].y)
    ];
    this.strokeD = [
        new Phaser.Geom.Point(this.walls[3][0].x,this.walls[3][0].y),
        new Phaser.Geom.Point(this.walls[3][1].x,this.walls[3][1].y)
    ];
    this.strokeE = [
        new Phaser.Geom.Point(this.walls[4][0].x,this.walls[4][0].y),
        new Phaser.Geom.Point(this.walls[4][1].x,this.walls[4][1].y),
        new Phaser.Geom.Point(this.walls[4][2].x,this.walls[4][2].y),
        new Phaser.Geom.Point(this.walls[4][3].x,this.walls[4][3].y),
        new Phaser.Geom.Point(this.walls[4][0].x,this.walls[4][0].y)
    ];
    this.strokeF = [
        new Phaser.Geom.Point(this.walls[5][0].x,this.walls[5][0].y),
        new Phaser.Geom.Point(this.walls[5][1].x,this.walls[5][1].y),
        new Phaser.Geom.Point(this.walls[5][2].x,this.walls[5][2].y),
        new Phaser.Geom.Point(this.walls[5][3].x,this.walls[5][3].y),
        new Phaser.Geom.Point(this.walls[5][0].x,this.walls[5][0].y)
    ];
    this.strokeG = [
        new Phaser.Geom.Point(this.walls[6][0].x,this.walls[6][0].y),
        new Phaser.Geom.Point(this.walls[6][1].x,this.walls[6][1].y),
        new Phaser.Geom.Point(this.walls[6][2].x,this.walls[6][2].y),
        new Phaser.Geom.Point(this.walls[6][3].x,this.walls[6][3].y),
        new Phaser.Geom.Point(this.walls[6][0].x,this.walls[6][0].y)
    ];
    this.strokeH = [
        new Phaser.Geom.Point(this.walls[7][0].x,this.walls[7][0].y),
        new Phaser.Geom.Point(this.walls[7][1].x,this.walls[7][1].y),
        new Phaser.Geom.Point(this.walls[7][2].x,this.walls[7][2].y),
        new Phaser.Geom.Point(this.walls[7][3].x,this.walls[7][3].y),
        new Phaser.Geom.Point(this.walls[7][0].x,this.walls[7][0].y)
    ];
    this.strokeI = [
        new Phaser.Geom.Point(this.walls[8][0].x,this.walls[8][0].y),
        new Phaser.Geom.Point(this.walls[8][1].x,this.walls[8][1].y),
        new Phaser.Geom.Point(this.walls[8][2].x,this.walls[8][2].y),
        new Phaser.Geom.Point(this.walls[8][3].x,this.walls[8][3].y),
        new Phaser.Geom.Point(this.walls[8][0].x,this.walls[8][0].y)
    ];

    this.wallStrokes = [
        this.strokeA,
        this.strokeB,
        this.strokeC,
        this.strokeD,
        this.strokeE,
        this.strokeF,
        this.strokeG,
        this.strokeH,
        this.strokeI
    ];

    

    //End goal door
    this.door = new HitRect(180,220,51,56);
    
    //Game vars
    this.p1 = this.add.existing(new Player(this, 40, 710));
    this.heart1 = this.add.sprite(305, 25, 'heart').setScale(0.1);
    this.heart2 = this.add.sprite(340, 25, 'heart').setScale(0.1);
    this.heart3 = this.add.sprite(375, 25, 'heart').setScale(0.1);
    
    //create arm objects
    this.leftArm = this.add.existing(new Arm(this, true));
    this.rightArm = this.add.existing(new Arm(this, false));

    this.enemies = [];
        for (let i = 0; i < 20; i ++) {
            this.enemies.push(new Enemy(this));
        }
    //this.enemySpawnTime = 2000;

    this.e1 = this.add.existing(new Enemy(this, 200, 100));
    this.e2 = this.add.existing(new Enemy(this, 50, 250));
    this.e3 = this.add.existing(new Enemy(this, 350, 250));
    this.e4 = this.add.existing(new Enemy(this, 300, 650));
    // this.e5 = this.add.existing(new Enemy(this, 50, 500));
    // this.e6 = this.add.existing(new Enemy(this, 400, 500));
    
    //spawning enemies
    this.enemies[0].activate(200, 90, -30 * Math.PI / 180);
    this.enemies[1].activate(40, 350, 180 * Math.PI / 180);
    this.enemies[2].activate(360, 350, 180 * Math.PI / 180);
    this.enemies[3].activate(300, 650, 0 * Math.PI / 180);
    // this.enemies[4].activate(50, 500, -90 * Math.PI / 180);
    // this.enemies[5].activate(400, 500, 180 * Math.PI / 180);

    this.sound.play('background', {volume: 0.5, loop: true});


    this.sound.play('walking', {loop: true});
    this.walkSound = this.sound.sounds.find(s => s.key == 'walking');
    this.walkSound.stop();

    this.sound.play('walkingBack', {loop: true});
    this.walkSoundBack = this.sound.sounds.find(s => s.key == 'walkingBack');
    this.walkSoundBack.stop();
}


update(totalTime,deltaTime) {  //could replace totalTime with _ to indicate it is not used
    // Update Player
    this.p1.update(deltaTime, this.keys, movement);

    this.wasGoingForward = this.p1.isGoingForward;
    //walking sounds
    //forward
    if(this.p1.isGoingForward == true && this.p1.wasGoingForward == false){
        this.walkSound.play();
    }
    if(this.p1.isGoingForward == false && this.p1.wasGoingForward == true){
        this.walkSound.stop();
    }
    //back
    if(this.p1.isGoingBack == true && this.p1.wasGoingBack == false){
        this.walkSoundBack.play();
    }
    if(this.p1.isGoingBack == false && this.p1.wasGoingBack == true){
        this.walkSoundBack.stop();
    }

    // Keep player on screen
    if (this.p1.x > this.game.config.width + 10) {
        this.p1.setX(0);
    }

    if (this.p1.x < -10) {
        this.p1.setX(this.game.config.width - 10);
    }

    if (this.p1.y > this.game.config.height + 10) {
        this.p1.setY(0);
    }

    if (this.p1.y < -10) {
        this.p1.setY(this.game.config.height - 10);
    }

    //Fires left arm once when the a key is pressed
    if ((this.keys.a.isDown || leftFire == 'h') && this.p1.leftArmIsOn) {
        this.leftArm.activate(this.p1.x, this.p1.y, this.p1.forwardRot);
        this.p1.leftArmIsOn = false;
        
        this.leftFire = true;
        if(this.leftFire == true){
            this.sound.play('armShoot');
            this.leftFire = false;
        }
    }

    // Fires right arm once when the d key is pressed
    if ((this.keys.d.isDown || rightFire == 'h') && this.p1.rightArmIsOn) {
        this.rightArm.activate(this.p1.x, this.p1.y, this.p1.forwardRot);
        this.p1.rightArmIsOn = false;

        this.rightFire = true;
        if(this.rightFire == true){
            this.sound.play('armShoot');
            this.rightFire = false;
        }
    }

    // Reattach arm when player collides with fired left arm
    if (!this.p1.leftArmIsOn && isCircleCollision(this.p1, this.leftArm) && this.leftArm.moveTime < 200) {
        this.leftArm.deactivate();
        this.p1.leftArmIsOn = true;
        this.wallIsCollidingLeft = false;
    }

    // Reattach arm when player collides with fired right arm
    if (!this.p1.rightArmIsOn && isCircleCollision(this.p1, this.rightArm) && this.rightArm.moveTime < 200) {
        this.rightArm.deactivate();
        this.p1.rightArmIsOn = true;
        this.wallIsCollidingRight = false;
    }

    // Update arms
    this.leftArm.update(deltaTime);
    this.rightArm.update(deltaTime);

    // console.log('angle');
    // console.log(this.enemies[0].angle);
    // console.log('forward');
    // console.log(this.enemies[0].forward);

    var isBlocked = false;
    var shouldMove = true;

    var isDamaged =false;

    this.enemies.forEach(e => {
        e.update(deltaTime, this.p1.x, this.p1.y);
        if (e.isChasing) {
            this.walls.forEach(w => {
                this.isBlocked = isBoxBetween(this.p1,e,w);
                //console.log(isBlocked);
                if (this.isBlocked) {
                    shouldMove = false;
                    //console.log(shouldMove);
                }
                //console.log(shouldMove);
            });
            //console.log(shouldMove);
            if (shouldMove) {
                e.chase(deltaTime, this.p1.x, this.p1.y);
            }
            //isBlocked = false;
        }
        if (e.isActive && this.leftArm.isActive && isCircleCollision(e, this.leftArm)) {
            e.deactivate();
            this.leftArm.stopMoving();
            this.sound.play('enemyHit');
        }
        if (e.isActive && this.rightArm.isActive && isCircleCollision(e, this.rightArm)) {
            e.deactivate();
            this.rightArm.stopMoving();
            this.sound.play('enemyHit');
        }
        if (e.isActive && isCircleCollision(e, this.p1)) {
            //e.deactivate();
            this.p1.alpha = 0.5;

            if (!this.p1.isHit) {
                this.p1.health -= 1;
                this.sound.play('damage', {volume: 0.7});
            }
            this.p1.isHit = true;
            this.hitTime = 100;
        }
    });


    if (this.p1.health == 2) {
        this.heart3.alpha = 0.2;
    }

    if (this.p1.health == 1) {
        this.heart2.alpha = 0.2;
        this.heart3.alpha = 0.2;
    }

    if (this.p1.health == 0) {
        this.heart1.alpha = 0.2;
        this.heart2.alpha = 0.2;
        this.heart3.alpha = 0.2;
    }

    if ((this.hitTime > 0) && (this.p1.isHit)) {
        this.hitTime -= deltaTime;
    }

    if (this.hitTime <= 0) {
        this.p1.isHit = false;
        this.p1.alpha = 1.0;
        this.hitTime = 100;
    }

    // this.walls.forEach(w => {
    //     if (this.leftArm.isActive && isBoxCollision(this.leftArm, w)) {
    //         this.leftArm.stopMoving();
    //         if(this.wallIsCollidingLeft == false){
    //             this.sound.play('splat', {volume: 0.5});
    //             this.wallIsCollidingLeft = true;
    //         } 
    //     }
    //     // else{
    //     //     this.wallIsCollidingLeft = false;
    //     // }
    //     if (this.rightArm.isActive && isBoxCollision(this.rightArm, w)) {
    //         this.rightArm.stopMoving();
    //         if(this.wallIsCollidingRight == false){
    //             this.sound.play('splat', {volume: 0.5});
    //             this.wallIsCollidingRight = true;
    //         } 
    //     }
    //     // else{
    //     //     this.wallIsCollidingRight = false;
    //     // }
    // });

    let i;
    for(i = 0; i < this.numWalls; i++) {
        let j;
        for(j = 1; j < this.pointNums[i]; j++) {
            //console.log(this.pointNums[i]);
            //console.log(i + ', ' + j + ', ' + this.walls[i][j].x + ', ' + this.walls[i][j].y);
            if(wallCollision(this.walls[i][j-1],this.walls[i][j],this.p1)) {
                this.p1.isColliding = true;
                this.bounceTime = 100;
            }
            if (this.leftArm.isMoving && wallCollision(this.walls[i][j-1],this.walls[i][j], this.leftArm)) {
                this.leftArm.stopMoving();
                this.sound.play('splat', {volume: 0.5});
            }
            if (this.rightArm.isMoving && wallCollision(this.walls[i][j-1],this.walls[i][j], this.rightArm)) {
                this.rightArm.stopMoving();
                this.sound.play('splat', {volume: 0.5});
            }
        }
        //console.log('last: ' + this.walls[i][this.pointNums[i] - 1] + ', ' + this.walls[i][0]);
        //console.log('last: ' + this.walls[i][this.pointNums[i] - 1].x + ', ' + this.walls[i][this.pointNums[i] - 1].y);
        //console.log(this.pointNums[i]);
        if(wallCollision(this.walls[i][this.pointNums[i] - 1],this.walls[i][0],this.p1) && !this.p1.isColliding) {
            this.p1.isColliding = true;
            this.bounceTime = 100;
        }
        if (this.leftArm.isActive && wallCollision(this.walls[i][this.pointNums[i] - 1],this.walls[i][0], this.leftArm)) {
            this.leftArm.stopMoving();
            this.sound.play('splat', {volume: 0.5});
        }
        if (this.rightArm.isActive && wallCollision(this.walls[i][this.pointNums[i] - 1],this.walls[i][0], this.rightArm)) {
            this.rightArm.stopMoving();
            this.sound.play('splat', {volume: 0.5});
        }
        //console.log(this.p1.isColliding);
    }

    // this.walls.forEach(w => {
    //     if (isBoxCollision(this.p1, w)) {
    //         this.p1.isColliding = true;
    //         this.bounceTime = 100;
    //     }
    // });

    if ((this.bounceTime > 0) && (this.p1.isColliding)) {
        this.bounceTime -= deltaTime;
    }

    if (this.bounceTime <= 0) {
        this.p1.isColliding = false;
        this.bounceTime = 100;
    }

    if (isBoxCollision(this.p1,this.door)) {
        //console.log('yay?');
        //this.overlay.classList.add('hidden');
        this.walkSound.stop();
        this.sound.sounds.find(s => s.key == 'background').destroy();
        this.scene.start('EndScreen');
        //console.log('what?');
    }

    if (this.p1.health <= 0){
        this.scene.start('LoseScreen');
    }
    

    // Draw everything
    this.graphics.clear();
    this.p1.draw(this.graphics);
    this.leftArm.draw(this.graphics);
    this.rightArm.draw(this.graphics);
    this.enemies.forEach(e => e.draw(this.graphics));
    //wall1.draw(this.graphics);
    this.walls.forEach(w => {
        //w.draw(this.graphics);
    });
    this.door.draw(this.graphics);
    //this.graphics.lineStyle(0xee0000, 1);
    //this.graphics.strokePoints(this.strokeA);
    this.wallStrokes.forEach(s => {
        this.graphics.strokePoints(s);
    })
    //this.graphics.lineStyle(0xeeeeee, 1);
    
}
}

module.exports = MainScene;