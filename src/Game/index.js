// Import outside libraries
const Phaser = require('phaser');
const SerialPortReader = require('./SerialPortReader');

const StartScreen = require('./Scenes/StartScreen');
const MainScene = require('./Scenes/MainScene');
const EndScreen = require('./Scenes/EndScreen');
const LoseScreen = require('./Scenes/LoseScreen');


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
  scene: [StartScreen, MainScene, EndScreen, LoseScreen],
};


let game;

// Exported Module
const GameManager = {
  init: () => {
    game = new Phaser.Game(phaserConfig);
    SerialPortReader.openPort(p => /Arduino/.test(p.manufacturer), ':');
  },
};

module.exports = GameManager;
