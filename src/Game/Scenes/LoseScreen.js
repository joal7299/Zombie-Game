const Phaser = require('phaser');
const SerialPortReader = require('../SerialPortReader');

var movement;
var leftFire;
var rightFire;

class LoseScreen extends Phaser.Scene {
    constructor() {
        super('LoseScreen');
        SerialPortReader.addListener(this.onSerialMessage.bind(this));
    }

    create() {
        this.overlay = document.querySelector('#lose-screen-win');
        this.overlay.classList.remove('hidden');

        this.keys = {
            space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
          };

        this.sound.play('walking', {loop: true});
        this.walkSound = this.sound.sounds.find(s => s.key == 'walking');
        this.walkSound.stop();

        this.sound.play('walkingBack', {loop: true});
        this.walkSoundBack = this.sound.sounds.find(s => s.key == 'walkingBack');
        this.walkSoundBack.stop();
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
            this.walkSound.destroy();
            this.walkSoundBack.destroy();
            this.scene.start('Level1');
        }
    }
}

module.exports = LoseScreen;