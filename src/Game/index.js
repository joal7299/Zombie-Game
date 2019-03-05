// Import outside libraries
const Phaser = require('phaser');

const StartScreen = require('./Scenes/StartScreen');
const MainScene = require('./Scenes/MainScene');

// const Player = require('./Player');
// const Bullet = require('./Bullet');
// const Enemy = require('./Enemy');

const phaserConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [StartScreen, MainScene],
};

// let graphics;
// let keys;

// const p1 = new Player(phaserConfig.width / 2, phaserConfig.height / 2);

// const bullets = [];
// for (let i = 0; i < 20; i ++) {
//   bullets.push(new Bullet());
// }

// const enemies = [];
// for (let i = 0; i < 20; i ++) {
//   enemies.push(new Enemy());
// }
// let enemySpawnTime = 2000;

// // Code for only firing bullet on space up
// let isLastSpaceDown = false;

// /**
//  * Helper function for checking if two circles are colliding
//  * 
//  * @param {object} c1 : must have x, y, and radius property
//  * @param {object} c2 : must have x, y, and radius property
//  */
// function isCircleCollision(c1, c2) {
//   // Get the distance between the two circles
//   const distSq = (c1.x - c2.x) * (c1.x - c2.x) + (c1.y - c2.y) * (c1.y - c2.y);
//   const radiiSq = (c1.radius * c1.radius) + (c2.radius * c2.radius);

//   // Returns true if the distance btw the circle's center points is less than the sum of the radii
//   return (distSq < radiiSq);
// }

// function create() {
//   // keys = {
//   //   left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
//   //   right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
//   //   up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
//   //   down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
//   //   space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
//   //   a: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
//   //   d: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
//   // };

//   // graphics = this.add.graphics({
//   //   fillStyle: { color: 0xeeeeee },
//   //   lineStyle: { width: 3, color: 0xeeeeee }
//   // });
// }

// function update(totalTime, deltaTime) {
//   // // Update Player
//   // p1.update(deltaTime, keys);

//   // // Keep player on screen
//   // if (p1.x > phaserConfig.width + 5) {
//   //   p1.setX(0);
//   // }

//   // if (p1.x < -5) {
//   //   p1.setX(phaserConfig.width - 5);
//   // }

//   // if (p1.y > phaserConfig.height + 5) {
//   //   p1.setY(0);
//   // }

//   // if (p1.y < -5) {
//   //   p1.setY(phaserConfig.height - 5);
//   // }

//   // // Fire bullet once when space key is pressed
//   // if (keys.space.isDown && !isLastSpaceDown) {
//   //   const newBullet = bullets.find(b => !b.isActive);
//   //   if (newBullet) newBullet.activate(p1.x, p1.y, p1.cannonRot);
//   // }
//   // isLastSpaceDown = keys.space.isDown;

//   // // Spawn enemies every 2 sec
//   // if (enemySpawnTime < 0) {
//   //   const newEnemy = enemies.find(e => !e.isActive);
//   //   if (newEnemy) newEnemy.activate(Math.random() * phaserConfig.width, Math.random() * phaserConfig.height);
//   //   enemySpawnTime = 5000;
//   // }
//   // enemySpawnTime -= deltaTime;

//   // // Update bullets
//   // bullets.forEach(b => b.update(deltaTime));
//   // enemies.forEach(e => {
//   //   if (e.isActive) {
//   //     bullets.forEach(b => {
//   //       if (b.isActive && isCircleCollision(e, b)) {
//   //         e.deactivate();
//   //         b.deactivate();
//   //       }
//   //     });
//   //   }
//   // });

//   // // Draw everything
//   // graphics.clear();
//   // p1.draw(graphics);
//   // bullets.forEach(b => b.draw(graphics));
//   // enemies.forEach(e => e.draw(graphics));
// }

// phaserConfig.scene = {
//   create: create,
//   update: update
// };

let game;

// Exported Module
const GameManager = {
  init: () => {
    game = new Phaser.Game(phaserConfig);
  },
};

module.exports = GameManager;
