class Bullet {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.radius = 6;
    this.forward = 0;
    this.moveSpeed = 200;
    this.isActive = false;

    this.activeTime = 0;
  }

  activate(x, y, forward) {
    // this.x = x;
    // this.y = y;
    this.forward = forward;
    this.x = x + -25 * Math.sin(this.forward);
    this.y = y + 25 * Math.cos(this.forward);
    this.isActive = true;
    this.activeTime = 5000;
  }

  deactivate() {
    this.isActive = false;
  }

  update(deltaTime) {
    if (this.isActive) {
      // Calculate forward vector
      const forwardX = -Math.sin(this.forward);
      const forwardY = Math.cos(this.forward);
      this.x += this.moveSpeed * forwardX * deltaTime / 1000;
      this.y += this.moveSpeed * forwardY * deltaTime / 1000;

      // Deactivate bullet when it's been alive for too long 
      this.activeTime -= deltaTime;
      if (this.activeTime < 0) {
        this.deactivate();
      }
      if (this.x < 0 || this.x > 800 || this.y < 0 || this.y > 600) {
        this.deactivate();
      }
    }
  }

  draw(graphics) {
    if (this.isActive) {
      graphics.save();
      graphics.translate(this.x, this.y);
      graphics.fillCircle(0, 0, this.radius);
      graphics.restore();
    }
  }
}

module.exports = Bullet;
