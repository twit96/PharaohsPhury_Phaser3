/*global Phaser*/
import * as ChangeScene from './ChangeScene.js';
export default class gameOverScene extends Phaser.Scene {
  constructor () {
    super('gameOverScene');
  }

  init (data) {
    /*
    TO CALL THIS SCENE FROM level:
      this.scene.start('gameOverScene', {
        level: this.levelNum ,
        diamond: this.diamondSCollected,
        killed : this.enemyKilled,
        done: this.levelCompleted
      });
    */
    this.levelNum = data.level;
    this.diamondCollected = data.diamond;
    this.enemiesKilled = data.killed;
    this.duration = data.time;
    this.score = data.score;
    this.levelCompleted = data.done;
  }

  preload () {
    console.log('\n[GAMEOVERSCENE]');
    console.log('[preload]');

    this.centerX = this.cameras.main.width / 2;
    this.load.image('gameoverbg', './assets/images/gameover.jpg');
  }

  create (data) {
    console.log('[create]');

    //Add change scene event listeners
    ChangeScene.addSceneEventListeners(this);

    //audio
    this.backgroundMusic = this.sound.add("HE");
    this.backgroundMusic.play({loop:false});

    this.add.image(400,300,'gameoverbg').setScale(.5,.5);

    //create the text that displays on the screen
    var level;
    if (this.levelNum == 0) {
      level = "Tutorial"
    } else if (this.levelNum == 8) {
      level = "Final Boss";
    } else {
      level = "Level:     " + this.levelNum;
    }
    const diamond = "Jewels:   " + this.diamondCollected;
    const enemyKilled = "Kills:       " + this.enemiesKilled;
    const timer = "Time:      " + this.duration;
    const levelscore = "Score:     " + this.score;
    this.add.text(300, 150, level, { font: '42px Georgia', fill: '#FFFFFF', fontStyle: 'bold',stroke: '#000000', strokeThickness: 5  });
    this.add.text(300, 220, diamond, { font: '42px Georgia', fill: '#FFFFFF', fontStyle: 'bold',stroke: '#000000', strokeThickness: 5 });
    this.add.text(300, 290, enemyKilled, { font: '42px Georgia', fill: '#FFFFFF', fontStyle: 'bold',stroke: '#000000', strokeThickness: 5 });
    this.add.text(300, 360, timer, { font: '42px Georgia', fill: '#FFFFFF', fontStyle: 'bold',stroke: '#000000', strokeThickness: 5 });
    this.add.text(300, 430, levelscore, { font: '42px Georgia', fill: '#FFFFFF', fontStyle: 'bold',stroke: '#000000', strokeThickness: 5 });

    //button text
    const menuText = "menu";
    var btnText = "Try Again";
    var quitText = "Quit";

    if (this.levelCompleted){
      btnText = "Continue";
    }

    if (this.levelNum == "8" && this.levelCompleted) {
      btnText = "You Won! \n You are now free";
    }

    //button actions
    this.nextButton = this.add.text(500, 500, btnText, { font: '24px Georgia', fill: '#FFFFFF', fontStyle: 'bold',stroke: '#000000', strokeThickness: 3})
      .setInteractive()
      //.on('pointerdown', () => this.getLevelScene(this.levelCompleted,this.levelNum))
      .on('pointerdown', () => this.getLevelScene(this.levelCompleted, this.levelNum))
      .on('pointerover',() => this.enterButtonHoverState(this.nextButton))﻿
      .on('pointerout',() => this.enterButtonRestState(this.nextButton));
    console.log('generated next button');

    this.exitButton = this.add.text(220, 500, quitText, { font: '24px Georgia', fill: '#FFFFFF', fontStyle: 'bold',stroke: '#000000', strokeThickness: 3})
      .setInteractive()
      //.on('pointerdown', () => this.getLevelScene(this.levelCompleted,this.levelNum))
      .on('pointerdown', () => this.quitGame())
      .on('pointerover',() => this.enterButtonHoverState(this.exitButton))﻿
      .on('pointerout',() => this.enterButtonRestState(this.exitButton));
    console.log('generated quit button');

  }

  //BUTTON PRESS HANDLERS
  getLevelScene(levelCompleted, levelNum) {
    /**
    function called when player clicks 'try again'/'continue' button. If player
    just died, the function takes the player back to the same level. If the
    player won the level, then they are taken to the next level.
    */
    console.log("[getLevelScene]");

    //stop audio
    this.backgroundMusic.stop();

    if (levelCompleted) {
      if (this.levelNum == 0 || this.levelNum == 8) {
        //final boss level or tutorial completed, player goes back to levelPicker
        this.scene.start('levelPicker');
      } else {
        //player finished a regular level, take player to next level
        this.levelNum +=  1;
        this.scene.start('levelScene', {
          level: this.levelNum
        });
      }
    } else {
      //player died, repeat same level
      this.scene.start('levelScene', {
        level: this.levelNum
      });
    }

  }

  quitGame() {
    /**
    function called when player clicks 'quit' button. takes player back to the
    main menu scene
    */
    console.log("[quitGame]");

    this.backgroundMusic.stop();
    this.scene.start("levelPicker");
  }


  //BUTTON STYLE
  enterButtonHoverState(button) {
    button.setStyle({ fill: '#00FFFF'});
    button.setScale(1.5);
  }
  enterButtonRestState(button) {
    button.setStyle({ fill: '#FFFFFF' });
    button.setScale(1.0);
  }

}
