// Import outside libraries
const Phaser = require('phaser');
const Player = require('./Player');
const Bullet = require('./Bullet');
const Enemy = require('./Enemy');

const phaserConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600
};

let graphics;
let keys;

const p1 = new Player(phaserConfig.width / 2, phaserConfig.height / 2);

const bulNum = 30;
const bullets = [];
for (let i = 0; i < bulNum; i ++) {
  bullets.push(new Bullet());
}

const eneNum = 5;
const enemies = [];
for (let i = 0; i < eneNum; i++) {
  enemies.push(new Enemy());
}

let hitTimer = 0;

// Code for only firing bullet on space up
let isLastSpaceDown = false;

let score = 0;

/**
 * Helper function for checking if two circles are colliding
 * 
 * @param {object} c1 : must have x, y, and radius property
 * @param {object} c2 : must have x, y, and radius property
 */
function isCircleCollision(c1, c2) {
  // Get the distance between the two circles
  const distSq = (c1.x - c2.x) * (c1.x - c2.x) + (c1.y - c2.y) * (c1.y - c2.y);
  const radiiSq = (c1.radius * c1.radius) + (c2.radius * c2.radius);

  // Returns true if the distance btw the circle's center points is less than the sum of the radii
  return (distSq < radiiSq);
}

function create() {
  keys = { left:
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
    right:
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
    up:
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
    down:
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
    space:
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
    a:
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
    d:
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };
  graphics = this.add.graphics({
    fillStyle: { color: 0xeeeeee },
    lineStyle: { width: 3, color: 0xeeeeee }
  });
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function update(totalTime, deltaTime) {
  // Update Player
  p1.update(deltaTime, keys);

  // Keep player on screen
  if (p1.x > phaserConfig.width + 10) {
    p1.setX(0);
  }

  if (p1.x < -10) {
    p1.setX(phaserConfig.width - 10);
  }

  if (p1.y > phaserConfig.height + 10) {
    p1.setY(0);
  }

  if (p1.y < -10) {
    p1.setY(phaserConfig.height - 10);
  }

  // Fire bullet once when space key is pressed
  if (keys.space.isDown && !isLastSpaceDown) {
    const newBullet = bullets.find(b => !b.isActive);
    if (newBullet) newBullet.activate(p1.x, p1.y, p1.canRot+p1.forwardRot);
  }
  isLastSpaceDown = keys.space.isDown;

  const newEnemy = enemies.find(e => !e.isActive);
  // if(newEnemy) {
  //   console.log(totalTime % 3000);
  // }
  if ((totalTime % 3000 <= 20) && newEnemy) {
    newEnemy.activate(getRandomInt(phaserConfig.width),getRandomInt(phaserConfig.height), p1.x, p1.y);
  }

  // Update bullets
  bullets.forEach(b => b.update(deltaTime));

  enemies.forEach(e => e.update(deltaTime));

  for(let i = 0; i < bulNum; i++) {
    for(let j = 0; j < eneNum; j++){
      if(bullets[i].isActive && enemies[j].isActive) {
        if(isCircleCollision(bullets[i],enemies[j])) {
          bullets[i].deactivate();
          enemies[j].deactivate();
          score += 100;
          console.log(score);
        }
      }
    }
  }

  for(let i = 0; i < eneNum; i++) {
    if(enemies[i].isActive) {
      if(isCircleCollision(p1, enemies[i])) {
        hitTimer = 100;
        enemies[i].deactivate();
        score -= 1000;
        console.log(score);
      }
    }
  }

  // Draw everything
  graphics.clear();
  if(hitTimer > 0) {
    graphics.fillStyle(0xee0000, 1);
    graphics.lineStyle(3, 0xee0000, 1);
    //p1.draw(graphics);
    hitTimer -= deltaTime;
  }
  p1.draw(graphics);
  graphics.fillStyle(0xeeeeee, 1);
  graphics.lineStyle(3, 0xeeeeee, 1);
  bullets.forEach(b => b.draw(graphics));
  enemies.forEach(e => e.draw(graphics));
  new Text(Phaser.Game,phaserConfig.height/2, phaserConfig.height/2, score);
}

phaserConfig.scene = {
  create: create,
  update: update
};

let game;

// Exported Module
const GameManager = {
  init: () => {
    game = new Phaser.Game(phaserConfig);
  },
};

module.exports = GameManager;