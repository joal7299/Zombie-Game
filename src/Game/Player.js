const Phaser = require('phaser');

class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y);

      this.setTexture('zombie').setScale(.3);
      //this.setPosition(x, y);
      //this.leftArm = Phaser.GameObjects.Sprite('leftarm');

      this.x = x;
      this.y = y;
      this.radius = 25; // radius used for collision detection

      //movement
      this.moveSpeed = 75;
      this.forwardRot = -Math.PI;
      this.rotSpeed = 1;
      this.isGoingForward = false;
      this.wasGoingForward = false;
      this.isGoingBack = false;
      this.wasGoingBack = false;
      this.isColliding = false;
      this.isHit = false;
      //this.bounceTime = 200;

      //arms
      this.leftArmIsOn = true;
      this.rightArmIsOn = true;

      //health
      this.health = 3;
  }
  

  
  setX(newX) {
    this.x = newX;
  }
  
  setY(newY) {
    this.y = newY;
  }

  update(deltaTime, keys, movement) {

    this.rotation = this.forwardRot+Math.PI/2;
    // Calculate forward vector
    const forwardX = -Math.sin(this.forwardRot);
    const forwardY = Math.cos(this.forwardRot);
    
    // Player Movement
    //rotate left
    if (keys.left.isDown || movement == 'S') {
      this.forwardRot -= this.rotSpeed * deltaTime / 1000
    }
    //rotate right
    if (keys.right.isDown || movement == 'P') {
      this.forwardRot += this.rotSpeed * deltaTime / 1000
    }

    //turn left
    if (movement == 'L' && !this.isColliding) {
      this.forwardRot -= this.rotSpeed * deltaTime / 1000
      this.x += this.moveSpeed * forwardX * deltaTime / 1000;
      this.y += this.moveSpeed * forwardY * deltaTime / 1000;
      this.wasGoingForward = this.isGoingForward;
      this.isGoingForward = true;
    }
    else if(!keys.up.isDown) {
      this.isGoingForward = false;
    }
    //turn right
    if (movement == 'R' && !this.isColliding) {
      this.forwardRot += this.rotSpeed * deltaTime / 1000
      this.x += this.moveSpeed * forwardX * deltaTime / 1000;
      this.y += this.moveSpeed * forwardY * deltaTime / 1000;
      this.wasGoingForward = this.isGoingForward;
      this.isGoingForward = true;
    }
    else if(!keys.up.isDown) {
      this.isGoingForward = false;
    }

    //forward
    if ((keys.up.isDown || movement == 'F') && !this.isColliding) {
      this.x += this.moveSpeed * forwardX * deltaTime / 1000;
      this.y += this.moveSpeed * forwardY * deltaTime / 1000;
      this.wasGoingForward = this.isGoingForward;
      this.isGoingForward = true;
      //console.log("up");
    }
    else if(!keys.up.isDown) {
      this.isGoingForward = false;
    }

    //backwards
    if ((keys.down.isDown || movement == 'B') && !this.isColliding) {
      this.x -= this.moveSpeed * forwardX * deltaTime / 1000;
      this.y -= this.moveSpeed * forwardY * deltaTime / 1000;
      this.wasGoingBack = this.isGoingBack;
      this.isGoingBack = true;
      //console.log("up");
    }
    else if(!keys.down.isDown) {
      this.isGoingBack = false;
    }

    //collision
    if (this.isColliding && this.isGoingForward) {
      this.x -= this.moveSpeed * forwardX * deltaTime / 700;
      this.y -= this.moveSpeed * forwardY * deltaTime / 700;
    }

    if (this.isColliding && this.isGoingBack) {
      this.x += this.moveSpeed * forwardX * deltaTime / 700;
      this.y += this.moveSpeed * forwardY * deltaTime / 700;
    }
  }

  draw(graphics) {
    // render player base
    graphics.save();
    graphics.translate(this.x, this.y);
    graphics.rotate(this.forwardRot);
    //graphics.strokePoints(this.baseGeo);
    this.setPosition(this.x,this.y);
    //graphics.fillCircle(0,0,this.radius);


    

    //arms
    if(this.isGoingForward) {
      if(this.rightArmIsOn && this.leftArmIsOn){
        this.setTexture('zombie').setScale(.3);
      }
      else if(this.rightArmIsOn) {
        this.setTexture('zombieright').setScale(.3);
      }
      else if(this.leftArmIsOn){
        this.setTexture('zombieleft').setScale(.3);
      }
      else if(!this.leftArmIsOn && !this.rightArmIsOn){
        this.setTexture('zombienoarms').setScale(.3);
      }
    }
    else if(this.isGoingBack) {
      if(this.rightArmIsOn && this.leftArmIsOn){
        this.setTexture('zombie').setScale(.3);
      }
      else if(this.rightArmIsOn) {
        this.setTexture('zombieright').setScale(.3);
      }
      else if(this.leftArmIsOn){
        this.setTexture('zombieleft').setScale(.3);
      }
      else if(!this.leftArmIsOn && !this.rightArmIsOn){
        this.setTexture('zombienoarms').setScale(.3);
      }
    }
    else {
      if(this.rightArmIsOn && this.leftArmIsOn){
        this.setTexture('zombie').setScale(.3);
      }
      else if(this.rightArmIsOn) {
        this.setTexture('zombieright').setScale(.3);
      }
      else if(this.leftArmIsOn){
        this.setTexture('zombieleft').setScale(.3);
      }
      else if(!this.leftArmIsOn && !this.rightArmIsOn){
        this.setTexture('zombienoarms').setScale(.3);
      }
    }
    graphics.restore();
  }
}

module.exports = Player;
