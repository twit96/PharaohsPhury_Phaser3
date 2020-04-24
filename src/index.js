/*global Phaser, window*/
import Config from './config/config.js';
import BootScene from './scenes/BootScene.js';
import menu from './scenes/menu.js';
import userScene from './scenes/userRegister.js';
import levelPicker from './scenes/levelPicker.js';
import levelScene from './scenes/level.js';
import gameOverScene from './scenes/gameOverScene.js';

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
