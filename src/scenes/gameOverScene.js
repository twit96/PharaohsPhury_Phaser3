/*global Phaser*/
import * as ChangeScene from './ChangeScene.js';
export default class gameOverScene extends Phaser.Scene {
  constructor () {
    super('gameOverScene');
  }

  init (data) {
    /*
    TO CALL THIS SCENE FROM ANY LEVEL:
      this.scene.start('gameOverScene', {
        level: this.levelNum ,
        diamond: this.diamondSCollected,
        killed : this.enemyKilled,
        done: this.isCompleted
      });
    */
    this.levelNum = data.level;
    this.diamondCollected = data.diamond;
    this.enemiesKilled = data.killed;
    this.isCompleted = data.done;
  }

  preload () {
    console.log('\n[GAMEOVERSCENE]');
    console.log('[preload]');
    this.centerX = this.cameras.main.width / 2;
  }

  create (data) {
    console.log('[create]');

    //Add change scene event listeners
    ChangeScene.addSceneEventListeners(this);

    // create the text that display on the screen
    const level = "Level: " + this.levelNum;
    const diamond = "Diamonds Collected: " + this.diamondCollected;
    const enemyKilled = "Enemies Killed: " + this.enemiesKilled;

    this.add.text(300, 200, level, { font: '16px Courier', fill: '#FFFFFF' });
    this.add.text(300, 300, diamond, { font: '16px Courier', fill: '#FFFFFF' });
    this.add.text(300, 400, enemyKilled, { font: '16px Courier', fill: '#FFFFFF' });

    var btnText = "Continue";

    if (this.levelNum = "Final Boss" && this.isCompleted ) {
      btnText = "You just win the British Army. \n You are now free";
    }

    this.nextButton = this.add.text(this.centerX - 50, 500, btnText, { fill: '#0f0' })
      .setInteractive()
      //.on('pointerdown', () => this.getLevelScene(this.isCompleted,this.levelNum))
      .on('pointerdown', () => this.getLevelScene())
      .on('pointerover',() => this.enterButtonHoverState())﻿
      .on('pointerout',() => this.enterButtonRestState());
    console.log('generated text and buttons');
  }

  getLevelScene() {
    this.scene.start('levelPicker');
  }

  /*
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
  */

  enterButtonHoverState() {
    this.nextButton.setStyle({ fill: '#ff0'});
    this.nextButton.setScale(1.5);
  }

  enterButtonRestState() {
    this.nextButton.setStyle({ fill: '#0f0' });
    this.nextButton.setScale(1.0);
  }

  update (time, delta) {
    // Update the scene
  }
}
