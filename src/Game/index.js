// Import outside libraries
const xs = require('xstream').default;
const Phaser = require('phaser');

const SerialProducer = require('./SerialProducer.js');

// create serial port and open connection
const serial = new SerialProducer();
const input$ = xs.create(serial).map(d => d.toString());

// Phaser setup
function preload () {
  this.load.image('ground', '../assets/platform.png');
  this.load.spritesheet('dude', 
      '../assets/dude.png',
      { frameWidth: 32, frameHeight: 48 }
  );
}

let player;
let cursors;

// Phaser setup
function create () {
  cursors = this.input.keyboard.createCursorKeys();

  platforms = this.physics.add.staticGroup();

  platforms.create(400, 568, 'ground').setScale(2).refreshBody();

  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');

  // Player
  player = this.physics.add.sprite(100, 450, 'dude');
  //player.physics.add.sprite(100, 450, 'dude');
  // player.create(100, 450, 'dude');
  // player.create(100, 450, 'ground').setScale(.5).refreshBody();

  player.setBounce(0.2);
  player.setCollideWorldBounds(true);
  player.body.setGravityY(270);
  this.physics.add.collider(player, platforms);
  console.log(player.body);

  this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
  });

  this.anims.create({
      key: 'turn',
      frames: [ { key: 'dude', frame: 4 } ],
      frameRate: 20
  });

  this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
  });
}

function update() {
  // Un-comment this block for keyboard controls
  
  if (cursors.left.isDown) {
      player.setVelocityX(-160);
      player.anims.play('left', true);
  }
  else if (cursors.right.isDown) {
      player.setVelocityX(160);
      player.anims.play('right', true);
  }
  else {
      player.setVelocityX(0);
      player.anims.play('turn');
  }

  if (cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-400);
  }
  
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 200 }
      }
  },
  scene: {
      preload: preload,
      create: create,
      update: update
  }
};

const game = new Phaser.Game(config);
  
// Exported Module so game can be initialized elsewhere
const gameManager = {
  init: () => {
    input$.subscribe({
      next: (command) => {
        // Parse Arduino commands
        if (command === 'l') {
          player.setVelocityX(-160);
          player.anims.play('left', true);
        }
        else if (command === 'r') {
            player.setVelocityX(160);
            player.anims.play('right', true);
        }
        else if (command === 's') {
            player.setVelocityX(0);
            player.anims.play('turn');
        }
      
        if (command === 'j' && player.body.touching.down) {
            player.setVelocityY(-400);
        }
      },
      error: console.log,
      complete: console.log,
    });


  },
};

module.exports = gameManager;
