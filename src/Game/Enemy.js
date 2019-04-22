class Enemy {
  constructor() {
    this.x = 0;
      this.y = 0;
      this.radius = 20; //for collision detection
      this.forward = 0;
      this.angle = 0;
      this.visionDist = 300;
      this.moveSpeed = 100;
      this.isActive = false;
      this.isChasing = false;
      this.viewAngle = 25;
  
      this.activeTime = 0;

      // Geometry used for rendering
      this.baseGeo = [
        new Phaser.Geom.Point(-17, 10),
        new Phaser.Geom.Point(0, 20),
        new Phaser.Geom.Point(17, 10),
        new Phaser.Geom.Point(17, -20),
        new Phaser.Geom.Point(-17, -20),
        new Phaser.Geom.Point(-17, 10),
      ];
      
      // this.baseGeo = [
      //   new Phaser.Geom.Point(0, 0),
      //   new Phaser.Geom.Point(this.visionDist * Math.tan(this.viewAngle), this.visionDist),
      //   new Phaser.Geom.Point(-this.visionDist * Math.tan(this.viewAngle), this.visionDist),
      //   new Phaser.Geom.Point(0,0),
      // ];
  }

  activate(x, y, forward) {
    this.x = x;
    this.y = y;
    this.forward = forward;
    this.isActive = true;
  }

    // activate(x, y) {
    //   this.x = x;
    //   this.y = y;
    //   this.isActive = true;
    // }

  deactivate() {
    this.isActive = false;
  }

  chase(deltaTime, pX,pY) {
    this.forward = Math.atan2((pY-this.y), (pX-this.x));
    const forwardX = Math.cos(this.forward);
    const forwardY = Math.sin(this.forward);
    this.x += this.moveSpeed * forwardX * deltaTime / 1000;
    this.y += this.moveSpeed * forwardY * deltaTime / 1000;
  }

  update(deltaTime, pX, pY) {
    this.angle = Math.atan2((pY-this.y), (pX-this.x));
    let dist = Math.sqrt((this.x-pX)*(this.x-pX) + (this.y-pY)*(this.y-pY));
    if (dist <= this.visionDist) {
      if (this.angle <= this.forward + (this.viewAngle * Math.PI / 180) && this.angle >= this.forward - (this.viewAngle * Math.PI / 180)) {
        this.isChasing = true;
        //console.log(this.isChasing);
      }
    }
    else {
      this.isChasing = false;
    }
    // if (this.isChasing) {
    //   this.forward = Math.atan2((pY-this.y), (pX-this.x));
    //   const forwardX = Math.cos(this.forward);
    //   const forwardY = Math.sin(this.forward);
    //   this.x += this.moveSpeed * forwardX * deltaTime / 1000;
    //   this.y += this.moveSpeed * forwardY * deltaTime / 1000;
    // }
  }

  draw(graphics) {
    if (this.isActive) {
      graphics.save();
      graphics.translate(this.x, this.y);
      graphics.rotate(this.forward-Math.PI/2);
      graphics.strokePoints(this.baseGeo);
      //graphics.fillCircle(0,0,this.radius);
      graphics.restore();
    }

    // draw(graphics) {
    //   if (this.isActive) {
    //     graphics.save();
    //     graphics.translate(this.x, this.y);
    //     graphics.strokeCircle(0, 0, this.radius);
    //     this.setPosition(this.x, this.y);
    //     graphics.restore();
    //   }
    // }
  }
}

  module.exports = Enemy;
