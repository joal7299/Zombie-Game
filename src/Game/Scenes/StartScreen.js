const Phaser = require('phaser');

class StartScreen extends Phaser.Scene {
    constructor() {
        super('StartScreen');
    }

    create() {
        this.overlay = document.querySelector('#start-screen');
        this.overlay.classList.remove('hidden');

        this.keys = {
            space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
          };
    }

    update() {
        if(this.keys.space.isDown) {
            this.overlay.classList.add('hidden');
            //transition to gameplay
            this.scene.start('MainScene');
        }
    }
}

module.exports = StartScreen;