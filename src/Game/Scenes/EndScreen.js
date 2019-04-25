const Phaser = require('phaser');
const SerialPortReader = require('../SerialPortReader');

var movement;
var leftFire;
var rightFire;

class EndScreen extends Phaser.Scene {
    constructor() {
        super('EndScreen');
        SerialPortReader.addListener(this.onSerialMessage.bind(this));
    }

    create() {
        this.overlay = document.querySelector('#end-screen-win');
        this.overlay.classList.remove('hidden');

        this.keys = {
            space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
          };
    }

    onSerialMessage(msg) {
        // Put your serial reading code in here. msg will be a string
        console.log(msg);
        movement = msg[0];
        leftFire = msg[2];
        rightFire = msg[4];
    }

    update() {
        if(this.keys.space.isDown || leftFire == 'h' || rightFire == 'h') {
            this.overlay.classList.add('hidden');
            this.scene.start('Level1');
        }
    }
}

module.exports = EndScreen;