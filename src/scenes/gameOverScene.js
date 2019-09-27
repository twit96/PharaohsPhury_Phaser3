/*global Phaser*/
//import * as ChangeScene from './ChangeScene.js';
export default class gameOverScene extends Phaser.Scene {
  constructor () {
    super('gameOverScene');
  }

  init (data) {
    // Initialization code goes here
    // this.scene.start('gameOverScene', { level: this.levelNum ,
    // diamond: this.diamondCollected, kiiled : this.enemyKilled,
    // done: this.isCompleted});
    // should be included for the scene that it comes from
    this.levelNum = data.level;
    this.diamondCollected = data.diamond;
    this.enemyKilled = data.kiiled;
    this.isCompleted = data.done;
  }

  preload () {
    // for picture in the future
  }

  create (data) {
    // create the text that display on the screen
    const level = "Level: " + this.levelNum;
    const diamond = "Diamond Collected: " + this.diamondCollected;
    const enemyKilled = "Enemy Killed: " + this.enemyKilled;

    this.add.text(300, 200, level, { font: '16px Courier', fill: '#FFFFFF' });
    this.add.text(300, 300, diamond, { font: '16px Courier', fill: '#FFFFFF' });
    this.add.text(300, 400, enemyKilled, { font: '16px Courier', fill: '#FFFFFF' });

    // Deal with different Scenarios (next level or replay level) for btn
    if (this.isCompleted) {
      var btnText = "Click to Next Level";
    } else {
      var btnText = "Click to Replay Level";
    }

    this.nextButton = this.add.text(400, 500, btnText, { fill: '#0f0' })
      .setInteractive()
      .on('pointerdown', () => this.getLevelScene(this.isCompleted,this.levelNum))
      .on('pointerover',() => this.enterButtonHoverState())﻿
      .on('pointerout',() => this.enterButtonRestState());
  }

  getLevelScene(isCompleted,levelNum){
    if (isCompleted) {
      // player finished the level
      var levelNum = levelNum + 1;
      const levelScene = "level" + levelNum;
    } else {
      // player died
      var levelScene = 'levelPicker';
    }
    this.scene.start(levelScene);
  }

  enterButtonHoverState() {
    this.nextButton.setStyle({ fill: '#ff0'});
  }

  enterButtonRestState() {
    this.nextButton.setStyle({ fill: '#0f0' });
  }

  update (time, delta) {
    // Update the scene
  }
}
