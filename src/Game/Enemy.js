const Phaser = require('phaser'); 

class Enemy extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y) {
    super(scene, x, y);

      this.setTexture('enemy').setScale(.3);
      this.setPosition(x, y);

      this.currentX = x;
      this.currentY = y;
      this.x = y;
      this.y = x;
      this.radius = 25; //for collision detection
      this.forward = 0;
      this.angle = 0;
      this.visionDist = 200;
      this.moveSpeed = 100;
      this.isActive = false;
      this.isChasing = false;
      this.viewAngle = 25;
      this.isColliding = false;
      this.collision = false;
      this.bounceTime = 0;
  
      this.activeTime = 0;

      // Geometry used for rendering
      // this.baseGeo = [
      //   new Phaser.Geom.Point(-17, 10),
      //   new Phaser.Geom.Point(0, 20),
      //   new Phaser.Geom.Point(17, 10),
      //   new Phaser.Geom.Point(17, -20),
      //   new Phaser.Geom.Point(-17, -20),
      //   new Phaser.Geom.Point(-17, 10),
      // ];
  }

  activate(x, y, forward, visionDist, viewAngle) {
    this.currentX = x;
    this.currentY = y;
    this.setTexture('enemy').setScale(.3);
    this.setPosition(this.x, this.y);
    this.forward = forward;
    this.isActive = true;
    this.visionDist = visionDist;
    this.viewAngle = viewAngle;
    this.isColliding = false;

    //console.log(Math.ceil(this.visionDist* Math.tan(this.viewAngle)) + ', ' + this.visionDist);

    this.baseGeo = [
      new Phaser.Geom.Point(0, 0),
      new Phaser.Geom.Point(Math.ceil(this.visionDist* Math.tan(this.viewAngle * Math.PI / 180)), this.visionDist),
      new Phaser.Geom.Point(Math.ceil(-this.visionDist* Math.tan(this.viewAngle * Math.PI / 180)), this.visionDist),
      new Phaser.Geom.Point(0,0),
    ];

    // this.baseGeo = [
    //   new Phaser.Geom.Point(0, 0),
    //   new Phaser.Geom.Point(this.visionDist* Math.tan(this.viewAngle), this.visionDist),
    //   new Phaser.Geom.Point(-this.visionDist* Math.tan(this.viewAngle), this.visionDist),
    //   new Phaser.Geom.Point(0,0),
    // ];
  }

    // activate(x, y) {
    //   this.x = x;
    //   this.y = y;
    //   this.isActive = true;
    // }

  deactivate() {
    this.isActive = false;
    this.setTexture('__DEFAULT');
  }

  chase(deltaTime, pX,pY) {
    this.forward = Math.atan2((pY-this.currentY), (pX-this.currentX));
    const forwardX = Math.cos(this.forward);
    const forwardY = Math.sin(this.forward);
    this.bounceTime -= deltaTime;
    // this.x += this.moveSpeed * forwardX * deltaTime / 1000;
    // this.y += this.moveSpeed * forwardY * deltaTime / 1000;
    //console.log(this.isColliding);
    if(!this.isColliding) {
      //console.log('a');
      this.x += this.moveSpeed * forwardX * deltaTime / 1000;
      this.y += this.moveSpeed * forwardY * deltaTime / 1000;
      this.currentX = this.x;
      this.currentY = this.y;
    }
    else if(this.bounceTime > 0 && this.isColliding) {
      //console.log('b');
      this.x -= this.moveSpeed * forwardX * deltaTime / 700;
      this.y -= this.moveSpeed * forwardY * deltaTime / 700;
      this.currentX = this.x;
      this.currentY = this.y;
    }
    else if(this.bounceTime <= 0 && this.isColliding) {
      //console.log('c');
      this.collision = false;
      this.isColliding = false;
      this.bounceTime = 100;
    }
  }

  update(deltaTime, pX, pY) {
    this.angle = Math.abs(Math.atan2((pY-this.currentY), (pX-this.currentX)));
    let dist = Math.sqrt((this.currentX-pX)*(this.currentX-pX) + (this.currentY-pY)*(this.currentY-pY));
    if (dist <= this.visionDist) {
      if (this.angle <= this.forward + (this.viewAngle * Math.PI / 180) && this.angle >= this.forward - (this.viewAngle * Math.PI / 180)) {
        this.isChasing = true;
        //console.log(this.isChasing);
      }
    }
    else {
      this.isChasing = false;
    }
  }

  draw(graphics) {
    if (this.isActive) {
      graphics.save();
      graphics.translate(this.currentX, this.currentY);
      graphics.rotate(this.forward-Math.PI/2);
      //graphics.strokePoints(this.baseGeo);
      this.setPosition(this.currentX, this.currentY);
      this.setRotation(this.forward);
      //graphics.fillCircle(0,0,this.radius);
      graphics.restore();
    }
  }
}

  module.exports = Enemy;
