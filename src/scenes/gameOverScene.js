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
    this.levelName = data.level;
    this.diamondCollected = data.diamond;
    this.enemiesKilled = data.killed;
    this.isCompleted = data.done;
  }

  preload () {
    console.log('\n[GAMEOVERSCENE]');
    console.log('[preload]');
    this.centerX = this.cameras.main.width / 2;
    this.load.image('gameoverbg', './assets/images/gameover.jpg');

  }

  create (data) {
    console.log('[create]');
    this.HESound = this.sound.add("HE");
    this.HESound.play({loop:true});
    this.add.image(400,300,'gameoverbg').setScale(.5,.5);

    //Add change scene event listeners
    ChangeScene.addSceneEventListeners(this);

    // create the text that display on the screen
    const level = "Level:      " +this.levelName;
    const diamond = "Jewels:   " + this.diamondCollected;
    const enemyKilled = "Kills:       " + this.enemiesKilled;

    this.add.text(300, 150, level, { font: '42px Georgia', fill: '#FFFFFF', fontStyle: 'bold',stroke: '#000000', strokeThickness: 5  });
    this.add.text(300, 250, diamond, { font: '42px Georgia', fill: '#FFFFFF', fontStyle: 'bold',stroke: '#000000', strokeThickness: 5 });
    this.add.text(300, 350, enemyKilled, { font: '42px Georgia', fill: '#FFFFFF', fontStyle: 'bold',stroke: '#000000', strokeThickness: 5 });

    const menuText = "menu";
    var btnText = "Try Again";
    var quitText = "Quit";
    if (this.isCompleted){
      btnText = "Continue";
    }
    if (this.levelName === "Final Boss" && this.isCompleted ) {
      btnText = "You just won. \n You are now free";
    }

    this.nextButton = this.add.text(500, 500, btnText, { font: '24px Georgia', fill: '#FFFFFF', fontStyle: 'bold',stroke: '#000000', strokeThickness: 3})
      .setInteractive()
      //.on('pointerdown', () => this.getLevelScene(this.isCompleted,this.levelNum))
      .on('pointerdown', () => this.getLevelScene(this.isCompleted, this.levelName))
      .on('pointerover',() => this.enterButtonHoverState(this.nextButton))﻿
      .on('pointerout',() => this.enterButtonRestState(this.nextButton));
    console.log('generated next button');

    this.exitButton = this.add.text(220, 500, quitText, { font: '24px Georgia', fill: '#FFFFFF', fontStyle: 'bold',stroke: '#000000', strokeThickness: 3})
      .setInteractive()
      //.on('pointerdown', () => this.getLevelScene(this.isCompleted,this.levelNum))
      .on('pointerdown', () => this.quitGame())
      .on('pointerover',() => this.enterButtonHoverState(this.exitButton))﻿
      .on('pointerout',() => this.enterButtonRestState(this.exitButton));
    console.log('generated quit button');
  }

  getLevelScene(isCompleted,levelNum){
    var gameover = "gameover";
    var levelScene = "level"
    if (isCompleted) {
      // player finished the level
      levelNum +=  1;
      levelScene += levelNum;
      console.log(levelScene);
    } else {
      // player died
      levelScene = gameover;
    }
    console.log(levelScene);

    this.scene.stop(gameover);
    this.scene.pause(levelScene);
    this.scene.start(levelScene);
  }

  quitGame(){
    var menu = "menu";
    console.log("Quit button pressed")
    this.scene.start(menu);
  }


  enterButtonHoverState(button) {
    button.setStyle({ fill: '#00FFFF'});
    button.setScale(1.5);
  }

  enterButtonRestState(button) {
    button.setStyle({ fill: '#FFFFFF' });
    button.setScale(1.0);
  }

  update (time, delta) {
    // Update the scene
  }
}
