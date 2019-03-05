const Phaser = require('phaser');

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 20; // radius used for collision detection

    // movement
    this.moveSpeed = 100;
    this.forwardRot = 0;
    this.rotSpeed = 1;

    this.cannonRot = 0;

    // Geometry used for rendering
    this.baseGeo = [
      new Phaser.Geom.Point(-17, 10),
      new Phaser.Geom.Point(-8, 20),
      new Phaser.Geom.Point(8, 20),
      new Phaser.Geom.Point(17, 10),
      new Phaser.Geom.Point(17, -20),
      new Phaser.Geom.Point(-17, -20),
      new Phaser.Geom.Point(-17, 10),
    ];
  }

  setX(newX) {
    this.x = newX;
  }
  
  setY(newY) {
    this.y = newY;
  }

  update(deltaTime, keys) {
    // Player Movement
    if (keys.a.isDown) {
      this.cannonRot -= this.rotSpeed * deltaTime / 1000
    }
    else if (keys.d.isDown) {
      this.cannonRot += this.rotSpeed * deltaTime / 1000
    }

    // Player Movement
    if (keys.left.isDown) {
      this.forwardRot -= this.rotSpeed * deltaTime / 1000
    }
    else if (keys.right.isDown) {
      this.forwardRot += this.rotSpeed * deltaTime / 1000
    }

    // Calculate forward vector
    const forwardX = -Math.sin(this.forwardRot);
    const forwardY = Math.cos(this.forwardRot);
    
    if (keys.up.isDown) {
      this.x += this.moveSpeed * forwardX * deltaTime / 1000;
      this.y += this.moveSpeed * forwardY * deltaTime / 1000;
    }
  }

  draw(graphics) {
    // render player base
    graphics.save();
    graphics.translate(this.x, this.y);
    graphics.rotate(this.forwardRot);
    graphics.strokePoints(this.baseGeo);
    graphics.restore();

    // render cannon
    graphics.save();
    graphics.translate(this.x, this.y);
    graphics.rotate(this.cannonRot);
    graphics.fillCircle(0, 0, 12);
    graphics.fillRect(-5, 0, 10, 25);
    graphics.restore();
  }
}

module.exports = Player;
