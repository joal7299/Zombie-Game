// Import outside libraries
const Phaser = require('phaser');

const StartScreen = require('./Scenes/StartScreen');
const MainScene = require('./Scenes/MainScene');


const phaserConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 300 },
        debug: false
    }
  },
  scene: [StartScreen, MainScene],
};


let game;

// Exported Module
const GameManager = {
  init: () => {
    game = new Phaser.Game(phaserConfig);
  },
};

module.exports = GameManager;
