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

    this.canRot = Math.PI/2;
    this.canSpeed = 2;

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
    if (keys.left.isDown) {
      this.forwardRot -= this.rotSpeed * deltaTime / 1000;
    }
    else if (keys.right.isDown) {
      this.forwardRot += this.rotSpeed * deltaTime / 1000;
    }

    // Calculate forward vector
    const forwardX = Math.cos(this.forwardRot);
    const forwardY = Math.sin(this.forwardRot);
    
    if (keys.down.isDown) {
      this.x += this.moveSpeed * forwardX * deltaTime / 1000;
      this.y += this.moveSpeed * forwardY * deltaTime / 1000;
    }

    if (keys.up.isDown) {
      this.x -= this.moveSpeed * forwardX * deltaTime / 1000;
      this.y -= this.moveSpeed * forwardY * deltaTime / 1000;
    }

    if (keys.a.isDown) {
      this.canRot -= this.canSpeed * deltaTime / 1000;
    }
    else if (keys.d.isDown) {
      this.canRot += this.canSpeed * deltaTime / 1000;
    }

    //console.log(this.x, this.y)
  }

  draw(graphics) {
    // render player base
    graphics.save();
    graphics.translate(this.x, this.y);
    graphics.rotate(this.forwardRot+Math.PI/2);
    graphics.strokePoints(this.baseGeo);

    // render cannon
    graphics.rotate(this.canRot-Math.PI/2);
    graphics.fillCircle(0, 0, 12);
    graphics.fillRect(-5, 0, 10, 25);
    graphics.restore();
  }
}

module.exports = Player;
