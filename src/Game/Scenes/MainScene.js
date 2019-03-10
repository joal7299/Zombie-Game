const Phaser = require('phaser');

//Import Actors
const Player = require('../Player');
const Arm = require('../Arm');
const Enemy = require('../Enemy');

function isCircleCollision(c1, c2) {
    // Get the distance between the two circles
    const distSq = (c1.x - c2.x) * (c1.x - c2.x) + (c1.y - c2.y) * (c1.y - c2.y);
    const radiiSq = (c1.radius * c1.radius) + (c2.radius * c2.radius);
  
    // Returns true if the distance btw the circle's center points is less than the sum of the radii
    return (distSq < radiiSq);
  }

var walls;

class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

preload() {
    this.load.image('zombie', '../assets/zombie.png');
    this.load.image('wall', '../assets/wall.png');
}



create() {
    //creating walls as a static group
    walls = this.physics.add.staticGroup();

    //width then height
    this.add.image(50, 100, 'wall').setScale(10, .5);
    //this.add.image(100, 25, 'wall').setScale(.5, 5);
    this.add.image(200, 300, 'wall').setScale(40, .5);
    this.add.image(400, 100, 'wall').setScale(.5, 20);
    this.add.image(500, 300, 'wall').setScale(20, .5);
    this.add.image(600, 200, 'wall').setScale(.5, 20);
    this.add.image(450, 400, 'wall').setScale(70, .5);
    this.add.image(300, 450, 'wall').setScale(.5, 10);
    this.add.image(500, 550, 'wall').setScale(.5, 10);

    
    


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

    //Game vars
    this.p1 = this.add.existing(new Player(this, this.game.config.width / 2, this.game.config.height / 2));
    
    //create arm objects
    this.leftArm = new Arm();
    this.rightArm = new Arm();

    this.enemies = [];
        for (let i = 0; i < 20; i ++) {
            this.enemies.push(new Enemy());
        }
    //this.enemySpawnTime = 2000;
    
    //spawning enemies
    this.enemies[0].activate(100, 200);
    this.enemies[1].activate(400, 250);
    this.enemies[2].activate(600, 50);
    this.enemies[3].activate(400, 350);
    this.enemies[4].activate(50, 500);
    this.enemies[5].activate(400, 500);
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
        this.leftArm.activate(this.p1.x + (17 * Math.sin(Math.PI/2 + this.p1.forwardRot)), this.p1.y + (17 * Math.cos(Math.PI/2 - this.p1.forwardRot)), this.p1.forwardRot);
        this.p1.leftArmIsOn = false;
    }

    // Fires right arm once when the d key is pressed
    if (this.keys.d.isDown && this.p1.rightArmIsOn) {
        this.rightArm.activate(this.p1.x + (32 * Math.sin(3*Math.PI/2 + this.p1.forwardRot)), this.p1.y + (32 * Math.cos(3*Math.PI/2 - this.p1.forwardRot)), this.p1.forwardRot);
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
    if (!this.p1.leftArmIsOn && isCircleCollision(this.p1, this.leftArm) && this.leftArm.moveTime < 300) {
        this.leftArm.deactivate();
        this.p1.leftArmIsOn = true;
    }

    // Reattach arm when player collides with fired right arm
    if (!this.p1.rightArmIsOn && isCircleCollision(this.p1, this.rightArm) && this.rightArm.moveTime < 300) {
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
    });

    

    // Draw everything
    this.graphics.clear();
    this.p1.draw(this.graphics);
    this.leftArm.draw(this.graphics);
    this.rightArm.draw(this.graphics);
    this.enemies.forEach(e => e.draw(this.graphics));
    //map rectanlges
    //map outer walls
    this.graphics.fillRect(-1, 0, 1, 600);
    this.graphics.fillRect(0, 0, 800, 1);
    this.graphics.fillRect(0, 600, 800, 1);
    this.graphics.fillRect(800, 0, 1, 800);

    //inner walls
    this.graphics.fillRect(100, 0, 5, 30);
    this.graphics.fillRect(100, 100, 5, 200);
    this.graphics.fillRect(0, 300, 300, 5);
    this.graphics.fillRect(400, 0, 5, 300);
    this.graphics.fillRect(365, 300, 40, 5);
    this.graphics.fillRect(400, 200, 100, 5);
    this.graphics.fillRect(500, 100, 100, 5);
    this.graphics.fillRect(600, 200, 80, 5);
    this.graphics.fillRect(740, 200, 80, 5);
    this.graphics.fillRect(600, 100, 5, 300);
    this.graphics.fillRect(0, 400, 740, 5);
    this.graphics.fillRect(400, 460, 5, 140);

    // Draw everything
    this.graphics.clear();
    this.p1.draw(this.graphics);
    this.leftArm.draw(this.graphics);
    this.rightArm.draw(this.graphics);
    this.enemies.forEach(e => e.draw(this.graphics));
    //map rectanlges
    //map outer walls
    this.graphics.fillRect(0, 0, 1, 600);
    this.graphics.fillRect(0, 0, 799, 1);
    this.graphics.fillRect(0, 599, 800, 1);
    this.graphics.fillRect(799, 0, 1, 800);

    

    
}
}

module.exports = MainScene;