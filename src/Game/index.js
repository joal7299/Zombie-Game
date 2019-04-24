// Import outside libraries
const Phaser = require('phaser');
const SerialPortReader = require('./SerialPortReader');

const StartScreen = require('./Scenes/StartScreen');
const EndScreen = require('./Scenes/EndScreen');
const LoseScreen = require('./Scenes/LoseScreen');
const Level1 = require('./Scenes/Level1');
const Level2 = require('./Scenes/Level2');
const Level3 = require('./Scenes/Level3');
const Level4 = require('./Scenes/Level4');
const Level5 = require('./Scenes/Level5');


const phaserConfig = {
  type: Phaser.AUTO,
  width: 400,
  height: 750,
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 300 },
        debug: false
    }
  },
  scene: [StartScreen, EndScreen, LoseScreen, Level1, Level2, Level3, Level4, Level5],
};


let game;

// Exported Module
const GameManager = {
  init: () => {
    game = new Phaser.Game(phaserConfig);
    SerialPortReader.openPort(p => /Arduino/.test(p.manufacturer), '\n');

    game.canvas.classList.add('shake-enabled');
  },
};

module.exports = GameManager;
