class Arm {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.forward = 0;
    this.radius = 25;
    this.moveSpeed = 200;
    this.isActive = false;
    this.isMoving = true;

    this.moveTime = 0;
  }

  activate(x, y, forward) {
    this.x = x;
    this.y = y;
    this.forward = forward;
    this.isActive = true;
    this.moveTime = 1000;
    this.moveSpeed = 400;
  }

  deactivate() {
    this.isActive = false;
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
      graphics.fillRect(17, 0, 15, 35);
      graphics.restore();
    }
  }
}

module.exports = Arm;
