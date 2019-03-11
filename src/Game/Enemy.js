
  class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
      super(scene, x, y);
      this.x = x;
      this.y = y;
      this.radius = 20;
      this.isActive = false;

      this.activeTime = 0;

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

    update(deltaTime) {

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
