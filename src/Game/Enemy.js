class Bullet {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.radius = 20;
    this.isActive = false;

    this.activeTime = 0;
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
      graphics.restore();
    }
  }
}

module.exports = Bullet;
