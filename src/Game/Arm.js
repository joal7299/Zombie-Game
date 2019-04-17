const Phaser = require('phaser');

class Arm extends Phaser.GameObjects.Sprite {
  constructor(scene, isLeftArm) {
    super(scene, isLeftArm);
    this.x = 0;
    this.y = 0;
    this.forward = 0;
    this.radius = 15;
    this.moveSpeed = 400;
    this.isActive = false;
    this.isMoving = false;
    this.isLeftArm = isLeftArm;

    if(this.isLeftArm) {
      this.setTexture('__DEFAULT').setScale(.3);
    }

    else if(!this.isLeftArm){
      this.setTexture('__DEFAULT').setScale(.3);
    }

    this.moveTime = 0;
  }

  activate(x, y, forward) {
    this.x = x;
    this.y = y;
    this.forward = forward;
    this.rotation = this.forward + Math.PI/2;
    this.isActive = true;
    this.isMoving = true;
    this.moveTime = 400;
    this.moveSpeed = 400;
    
    if(this.isLeftArm) {
      this.setTexture('leftarm').setScale(.3);
    }

    else if(!this.isLeftArm){
      this.setTexture('rightarm').setScale(.3);
    }

    //console.log(this.x);
  }

  deactivate() {
    this.setTexture('__DEFAULT');
    this.isActive = false;
    this.wasMoving = true;
  }

  stopMoving() {
    this.isMoving = false;
    this.moveSpeed = 0;
  }

  update(deltaTime) {
    if (this.isActive) {
      // Calculate forward vector
      const forwardX = -Math.sin(this.forward);
      const forwardY = Math.cos(this.forward);
      this.x += this.moveSpeed * forwardX * deltaTime / 1000;
      this.y += this.moveSpeed * forwardY * deltaTime / 1000;

      // Deactivate bullet when it's been alive for too long 
      this.moveTime -= deltaTime;
      if (this.moveTime < 0) {
        this.stopMoving();
      }
    }
  }

  draw(graphics) {
    if (this.isActive) {
      graphics.save();
      graphics.translate(this.x, this.y);
      graphics.rotate(this.forward);
      //graphics.fillRect(0, 0, 15, 35);
      if(this.isLeftArm){
        //graphics.fillCircle(10,10,this.radius);
      }
      else{
        //graphics.fillCircle(-10,10,this.radius);
      }
      this.setPosition(this.x,this.y);
      graphics.restore();
    }
  }
}

module.exports = Arm;
