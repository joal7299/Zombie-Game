const Phaser = require('phaser');

//Import Actors
const Player = require('../Player');
const Arm = require('../Arm');
const Enemy = require('../Enemy');
const HitRect = require('../HitRect');

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

var walls;
//const wall1 = new HitRect(-1,0,0,600);
// this.graphics.fillRect(-1, 0, 1, 600);
// this.graphics.fillRect(0, 0, 800, 1);
// this.graphics.fillRect(0, 600, 800, 1);
// this.graphics.fillRect(800, 0, 1, 800);

class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

preload() {
    this.load.image('zombie', '../assets/zombie.png');
    this.load.image('wall', '../assets/wall.png');
    this.load.image('leftarm', '../assets/leftarm.png');
    this.load.image('rightarm', '../assets/rightarm.png');
    this.load.image('zombieright', '../assets/zombieright.png');
    this.load.image('zombieleft', '../assets/zombieleft.png');
    this.load.image('zombienoarms', '../assets/zombienoarms.png');
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
    this.walls[0].setSize(0,0,0,600);
    this.walls[1].setSize(0,800,0,0);
    this.walls[2].setSize(-0,800,600,600);
    this.walls[3].setSize(800,800,0,600);

    //Layout walls
    this.walls[4].setSize(0,100,100,100);
    this.walls[5].setSize(0,400,300,300);
    this.walls[6].setSize(400,400,0,200);
    this.walls[7].setSize(400,600,300,300);
    this.walls[8].setSize(600,600,100,300);
    this.walls[9].setSize(100,800,400,400);
    this.walls[10].setSize(300,300,400,500);
    this.walls[11].setSize(500,500,500,600);
    
    //Game vars
    this.p1 = this.add.existing(new Player(this, 50, 50));
    // console.log(this.p1.enableBody);
    // this.p1.enableBody = true;
    // console.log(this.p1.enableBody);
    //this.p1.physicsBodyType = Phaser.Physics.ARCADE;
    //this.p1.setCollideWorldBounds = true;
    
    //create arm objects
    this.leftArm = this.add.existing(new Arm(this, true));
    this.rightArm = this.add.existing(new Arm(this, false));

    this.enemies = [];
        for (let i = 0; i < 20; i ++) {
            this.enemies.push(new Enemy(this));
        }
    //this.enemySpawnTime = 2000;

    this.e1 = this.add.existing(new Enemy(this, 100, 200));
    this.e2 = this.add.existing(new Enemy(this, 400, 250));
    this.e3 = this.add.existing(new Enemy(this, 600, 50));
    this.e4 = this.add.existing(new Enemy(this, 400, 350));
    this.e5 = this.add.existing(new Enemy(this, 50, 500));
    this.e6 = this.add.existing(new Enemy(this, 400, 500));
    
    //spawning enemies
    // this.enemies[0].activate(100, 200);
    // this.enemies[1].activate(400, 250);
    // this.enemies[2].activate(600, 50);
    // this.enemies[3].activate(400, 350);
    // this.enemies[4].activate(50, 500);
    // this.enemies[5].activate(400, 500);

    
}


update(totalTime,deltaTime) {  //could replace totalTime with _ to indicate it is not used
    // Update Player
    this.p1.update(deltaTime, this.keys);

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
    if (this.keys.a.isDown && this.p1.leftArmIsOn) {
        this.leftArm.activate(this.p1.x, this.p1.y, this.p1.forwardRot);
        this.p1.leftArmIsOn = false;
    }

    // Fires right arm once when the d key is pressed
    if (this.keys.d.isDown && this.p1.rightArmIsOn) {
        this.rightArm.activate(this.p1.x, this.p1.y, this.p1.forwardRot);
        this.p1.rightArmIsOn = false;
    }

    // Spawn enemies 
    // this.enemies[0].activate(100, 200);
    // this.enemies[1].activate(400, 250);
    // this.enemies[2].activate(600, 50);
    // this.enemies[3].activate(400, 350);
    // this.enemies[4].activate(50, 500);
    // this.enemies[5].activate(400, 500);

    
    
       
    
    //this.enemySpawnTime -= deltaTime;

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

    this.enemies.forEach(e => {
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
            this.p1.isHit = true;
            this.hitTime = 100;
        }
    });

    if ((this.hitTime > 0) && (this.p1.isHit)) {
        this.hitTime -= deltaTime;
    }

    if (this.hitTime <= 0) {
        this.p1.isHit = false;
        this.p1.alpha = 1.0;
        this.hitTime = 100;
    }


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