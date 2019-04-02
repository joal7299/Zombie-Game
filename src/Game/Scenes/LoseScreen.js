const Phaser = require('phaser');

class LoseScreen extends Phaser.Scene {
    constructor() {
        super('LoseScreen');
    }

    create() {
        this.overlay = document.querySelector('#lose-screen-win');
        this.overlay.classList.remove('hidden');

        this.keys = {
            space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
          };
    }

    update() {
        if(this.keys.space.isDown) {
            this.overlay.classList.add('hidden');
            this.scene.start('MainScene');
        }
    }
}

module.exports = LoseScreen;