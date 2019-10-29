/*global Phaser, window*/
import Config from './config/config.js';
import BootScene from './scenes/BootScene.js';
import menu from './scenes/menu.js';
import levelPicker from './scenes/levelPicker.js';

import level1 from './scenes/level1.js';
import level2 from './scenes/level2.js';
import level3 from './scenes/level3.js';
import level4 from './scenes/level4.js';
import level5 from './scenes/level5.js';
import level6 from './scenes/level6.js';
import level7 from './scenes/level7.js';
import level8 from './scenes/level8.js';

import finalBossLevel from './scenes/finalBossLevel.js';
import gameOverScene from './scenes/gameOverScene.js';

class Game extends Phaser.Game {
  constructor () {
    super(Config);
    this.scene.add('Boot', BootScene);
    this.scene.add('menu', menu);
    this.scene.add('levelPicker', levelPicker);

    this.scene.add('level1', level1);
    this.scene.add('level2', level2);
    this.scene.add('level3', level3);
    this.scene.add('level4', level4);
    this.scene.add('level5', level5);
    this.scene.add('level6', level6);
    this.scene.add('level7', level7);
    this.scene.add('level8', level8);
    this.scene.add('finalBossLevel', finalBossLevel);
    this.scene.add('gameOverScene', gameOverScene);
    this.scene.start('Boot');
  }
}

window.game = new Game();
