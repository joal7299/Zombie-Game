const Phaser = require('phaser');

class EndScreen extends Phaser.Scene {
    constructor() {
        super('EndScreen');
    }

    create() {
        this.overlay = document.querySelector('#end-screen-win');
        this.overlay.classList.remove('hidden2');

        this.keys = {
            space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
          };
    }

    update() {
        if(this.keys.space.isDown) {
            this.overlay.classList.add('hidden2');
            this.scene.start('MainScene');
        }
    }
}

module.exports = StartScreen;