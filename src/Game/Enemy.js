class Enemy {
    constructor() {
      this.x = 0;
      this.y = 0;
      this.radius = 20; //for collision detection
      this.forward = 0;
      this.moveSpeed = 100;
      this.isActive = false;
  
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
    }

    // let width = 800;
    // let height = 600;
  
    activate(x, y, pX, pY) {
      this.x = x;
      this.y = y;
      let h = Math.sqrt((x-pX)*(x-pX) + (y-pY)*(y-pY));
      this.forward = Math.atan2((pY-y), (pX-x));
    //   else if(pY < y) {
    //       this.forward = Math.acos((pY-y) / (h));
    //   }
    // else if(pY < y) {
    //     this.forward = Math.atan((x-pX) / (y-pY));
    // }

      //console.log((this.forward*180/Math.PI),', ',(x-pX), ', ', (y-pY));
      this.isActive = true;
      //this.activeTime = 2000;
    }
  
    deactivate() {
      this.isActive = false;
    }
  
    update(deltaTime) {
      if (this.isActive) {
        // Calculate forward vector
        const forwardX = Math.cos(this.forward);
        const forwardY = Math.sin(this.forward);
        this.x += this.moveSpeed * forwardX * deltaTime / 1000;
        this.y += this.moveSpeed * forwardY * deltaTime / 1000;
        
        if (this.x < 0 || this.x > 800 || this.y < 0 || this.y > 600) {
            this.deactivate();
        }

        // Deactivate bullet when it's been alive for too long 
        // this.activeTime -= deltaTime;
        // if (this.activeTime < 0) {
        //   this.deactivate();
        // }
      }
    }
  
    draw(graphics) {
      if (this.isActive) {
        graphics.save();
        graphics.translate(this.x, this.y);
        graphics.rotate(this.forward-Math.PI/2);
        graphics.strokePoints(this.baseGeo);
        graphics.restore();
      }
    }
  }
  
  module.exports = Enemy;
  