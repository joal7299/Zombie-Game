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

  activate(x, y, forward) {
    this.x = x;
    this.y = y;
    this.forward = forward;
    this.isActive = true;
  }

      this.setTexture('enemy').setScale(.08);
    }

    activate(x, y) {
      this.x = x;
      this.y = y;
      this.isActive = true;
    }

    deactivate() {
      this.isActive = false;
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

    draw(graphics) {
      if (this.isActive) {
        graphics.save();
        graphics.translate(this.x, this.y);
        graphics.strokeCircle(0, 0, this.radius);
        this.setPosition(this.x, this.y);
        graphics.restore();
      }
    }
  }

  module.exports = Enemy;
