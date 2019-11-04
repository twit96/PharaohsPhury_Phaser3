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

    //Add change scene event listeners
    ChangeScene.addSceneEventListeners(this);

    //audio
    this.backgroundMusic = this.sound.add("HE");
    this.backgroundMusic.play({loop:false});

    this.add.image(400,300,'gameoverbg').setScale(.5,.5);

    //create the text that displays on the screen
    const level = "Level:      " +this.levelName;
    const diamond = "Jewels:   " + this.diamondCollected;
    const enemyKilled = "Kills:       " + this.enemiesKilled;

    this.add.text(300, 150, level, { font: '42px Georgia', fill: '#FFFFFF', fontStyle: 'bold',stroke: '#000000', strokeThickness: 5  });
    this.add.text(300, 250, diamond, { font: '42px Georgia', fill: '#FFFFFF', fontStyle: 'bold',stroke: '#000000', strokeThickness: 5 });
    this.add.text(300, 350, enemyKilled, { font: '42px Georgia', fill: '#FFFFFF', fontStyle: 'bold',stroke: '#000000', strokeThickness: 5 });

    //button text
    const menuText = "menu";
    var btnText = "Try Again";
    var quitText = "Quit";

    if (this.isCompleted){
      btnText = "Continue";
    }

    if (this.levelName === "Final Boss" && this.isCompleted ) {
      btnText = "You just won. \n You are now free";
    }

    //button actions
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

  //BUTTON PRESS HANDLERS
  getLevelScene(isCompleted, levelNum) {
    /**
    function called when player clicks 'try again'/'continue' button. If player
    just died, the function takes the player back to the same level. If the
    player won the level, then they are taken to the next level.
    */
    console.log("[getLevelScene]");

    //initial string to call next played level
    var levelScene = "level"

    if (isCompleted) {
      //player finished the level, levelScene string takes player to next level
      levelNum +=  1;
      levelScene += levelNum;

    } else {
      //player died, levelScene string makes player repeat the same level
      levelScene += levelNum;
    }

    //stop audio, start correct level scene, update variable to exit this scene
    this.backgroundMusic.stop();
    this.scene.start(levelScene);
  }

  quitGame() {
    /**
    function called when player clicks 'quit' button. takes player back to the
    main menu scene
    */
    console.log("[quitGame]");

    this.backgroundMusic.stop();
    this.scene.start("menu");
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
