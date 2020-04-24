/*global Phaser, window*/
import Config from './PharaohsPhury_Phaser3/src/config/config.js';
import BootScene from './PharaohsPhury_Phaser3/src/scenes/BootScene.js';
import menu from './PharaohsPhury_Phaser3/src/scenes/menu.js';
import userScene from './PharaohsPhury_Phaser3/src/scenes/userRegister.js';
import levelPicker from './PharaohsPhury_Phaser3/src/scenes/levelPicker.js';
import levelScene from './PharaohsPhury_Phaser3/src/scenes/level.js';
import gameOverScene from './PharaohsPhury_Phaser3/src/scenes/gameOverScene.js';

class Game extends Phaser.Game {
  constructor () {
    super(Config);
    this.scene.add('Boot', BootScene);
    this.scene.add('menu', menu);
    this.scene.add('userScene', userScene);
    this.scene.add('levelPicker', levelPicker);
    this.scene.add('levelScene', levelScene);
    this.scene.add('gameOverScene', gameOverScene);
    this.scene.start('Boot');
  }
}

window.game = new Game();
