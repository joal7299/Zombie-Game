const Phaser = require('phaser');
const SerialPortReader = require('../SerialPortReader');

//Import Actors
const Player = require('../Player');
const Arm = require('../Arm');
const Enemy = require('../Enemy');
const HitRect = require('../HitRect');

var movement;
var leftFire;
var rightFire;

function isCircleCollision(c1, c2) {
    // Get the distance between the two circles
    const distSq = (c1.x - c2.x) * (c1.x - c2.x) + (c1.y - c2.y) * (c1.y - c2.y);
    const radiiSq = (c1.radius * c1.radius) + (c2.radius * c2.radius);
  
    // Returns true if the distance btw the circle's center points is less than the sum of the radii
    return (distSq < radiiSq);
}



function isBoxCollision(c, r) {
    if((c.x > r.xmin) && (c.x < r.xmax) && (c.y > r.ymin) && (c.y < r.ymax)) {
        return true;
    }
    
    if((c.x > r.xmin) && (c.x < r.xmax) && (c.y > r.ymin - c.radius) && (c.y < r.ymax + c.radius)) {
        return true;
    }

    if((c.x > r.xmin - c.radius) && (c.x < r.xmax + c.radius) && (c.y > r.ymin) && (c.y < r.ymax)) {
        return true;
    }
    
    if((c.x < r.xmin) && (c.y < r.ymin)) {
        const distSq = (c.x - r.xmin) * (c.x - r.xmin) + (c.y - r.ymin) * (c.y - r.ymin);
        const radiiSq = (c.radius * c.radius);
    
        return (distSq < radiiSq);
    }

    if((c.x > r.xmax) && (c.y < r.ymin)) {
        const distSq = (c.x - r.xmax) * (c.x - r.xmax) + (c.y - r.ymin) * (c.y - r.ymin);
        const radiiSq = (c.radius * c.radius);
    
        return (distSq < radiiSq);
    }

    if((c.x < r.xmin) && (c.y > r.ymax)) {
        const distSq = (c.x - r.xmin) * (c.x - r.xmin) + (c.y - r.ymax) * (c.y - r.ymax);
        const radiiSq = (c.radius * c.radius);
    
        return (distSq < radiiSq);
    }

    if((c.x > r.xmax) && (c.y > r.ymax)) {
        const distSq = (c.x - r.xmax) * (c.x - r.xmax) + (c.y - r.ymax) * (c.y - r.ymax);
        const radiiSq = (c.radius * c.radius);
    
        return (distSq < radiiSq);
    }

    else {
        return false;
    }
}

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
    this.load.image('zombie', '../assets/zombie.png');
    this.load.image('wall', '../assets/wall.png');
    this.load.image('leftarm', '../assets/leftarm.png');
    this.load.image('rightarm', '../assets/rightarm.png');
    this.load.image('zombieright', '../assets/zombieright.png');
    this.load.image('zombieleft', '../assets/zombieleft.png');
    this.load.image('zombienoarms', '../assets/zombienoarms.png');
    this.load.image('heart', '../assets/heart.png');

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

    this.walls = [];
    for (let i = 0; i < 12; i ++) {
            this.walls.push(new HitRect());
    }
    
    //Outer walls
    this.walls[0].setSize(-1,-1,-1,751);
    this.walls[1].setSize(-1,401,50,50);
    this.walls[2].setSize(-1,401,751,751);
    this.walls[3].setSize(401,401,-1,751);

    //Layout walls
    this.walls[4].setSize(60,400,690,750);
    this.walls[5].setSize(0,150,550,600);
    this.walls[6].setSize(250,400,550,600);
    this.walls[7].setSize(80,320,250,470);
    this.walls[8].setSize(70,330,130,180);
    // this.walls[9].setSize(100,800,400,400);
    // this.walls[10].setSize(300,300,400,500);
    // this.walls[11].setSize(500,500,500,600);

    

    //End goal door
    this.door = new HitRect(180,220,51,56);
    
    //Game vars
    this.p1 = this.add.existing(new Player(this, 30, 720));
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
}


update(totalTime,deltaTime) {  //could replace totalTime with _ to indicate it is not used
    // Update Player
    this.p1.update(deltaTime, this.keys, movement);

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
    }

    // Fires right arm once when the d key is pressed
    if ((this.keys.d.isDown || rightFire == 'h') && this.p1.rightArmIsOn) {
        this.rightArm.activate(this.p1.x, this.p1.y, this.p1.forwardRot);
        this.p1.rightArmIsOn = false;
    }

    // Reattach arm when player collides with fired left arm
    if (!this.p1.leftArmIsOn && isCircleCollision(this.p1, this.leftArm) && this.leftArm.moveTime < 200) {
        this.leftArm.deactivate();
        this.p1.leftArmIsOn = true;
    }

    // Reattach arm when player collides with fired right arm
    if (!this.p1.rightArmIsOn && isCircleCollision(this.p1, this.rightArm) && this.rightArm.moveTime < 200) {
        this.rightArm.deactivate();
        this.p1.rightArmIsOn = true;
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
        }
        if (e.isActive && this.rightArm.isActive && isCircleCollision(e, this.rightArm)) {
            e.deactivate();
            this.rightArm.stopMoving();
        }
        if (e.isActive && isCircleCollision(e, this.p1)) {
            //e.deactivate();
            this.p1.alpha = 0.5;
            if (!this.p1.isHit) {
                this.p1.health -= 1;
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

    this.walls.forEach(w => {
        if (this.leftArm.isActive && isBoxCollision(this.leftArm, w)) {
            this.leftArm.stopMoving();
        }
        if (this.rightArm.isActive && isBoxCollision(this.rightArm, w)) {
            this.rightArm.stopMoving();
        }
    });

    //this.p1.isColliding = isBoxCollision(this.p1, wall1);

    // if (isBoxCollision(this.p1, wall1)) {
    //     this.p1.isColliding = true;
    //     this.bounceTime = 100;
    // }

    // if ((this.bounceTime > 0) && (this.p1.isColliding)) {
    //     this.bounceTime -= deltaTime;
    // }

    // if (this.bounceTime <= 0) {
    //     this.p1.isColliding = false;
    //     this.bounceTime = 100;
    // }
    
    this.walls.forEach(w => {
        if (isBoxCollision(this.p1, w)) {
            this.p1.isColliding = true;
            this.bounceTime = 100;
        }
    });

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
        w.draw(this.graphics);
    });
    this.door.draw(this.graphics);
    //this.graphics.fillRect(100,100,5,100);
    //map rectanlges
    //map outer walls
    // this.graphics.fillRect(-1, 0, 1, 600);
    // this.graphics.fillRect(0, 0, 800, 1);
    // this.graphics.fillRect(0, 600, 800, 1);
    // this.graphics.fillRect(800, 0, 1, 800);

    //inner walls
    // this.graphics.fillRect(100, 0, 5, 30);
    // this.graphics.fillRect(100, 100, 5, 200);
    // this.graphics.fillRect(0, 300, 300, 5);
    // this.graphics.fillRect(400, 0, 5, 300);
    // this.graphics.fillRect(365, 300, 40, 5);
    // this.graphics.fillRect(400, 200, 100, 5);
    // this.graphics.fillRect(500, 100, 100, 5);
    // this.graphics.fillRect(600, 200, 80, 5);
    // this.graphics.fillRect(740, 200, 80, 5);
    // this.graphics.fillRect(600, 100, 5, 300);
    // this.graphics.fillRect(0, 400, 740, 5);
    // this.graphics.fillRect(400, 460, 5, 140);

    // Draw everything
    // this.graphics.clear();
    // this.p1.draw(this.graphics);
    // this.leftArm.draw(this.graphics);
    // this.rightArm.draw(this.graphics);
    // this.enemies.forEach(e => e.draw(this.graphics));
    // //map rectanlges
    // //map outer walls
    // this.graphics.fillRect(0, 0, 1, 600);
    // this.graphics.fillRect(0, 0, 799, 1);
    // this.graphics.fillRect(0, 599, 800, 1);
    // this.graphics.fillRect(799, 0, 1, 800);

    

    // if(this.keys.space.isDown) {
    //     this.scene.start('EndScreen');
    // }
}
}

module.exports = MainScene;