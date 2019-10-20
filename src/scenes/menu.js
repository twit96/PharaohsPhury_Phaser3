/*global Phaser*/
export default class menu extends Phaser.Scene {
  constructor () {
    super('menu');
  }

  init (data) {
    // Initialization code goes here
  }

  preload () {
    console.log('\n[MENU]')
    console.log('[preload]');
    this.load.image('menu', './assets/images/menu.jpg');
    this.load.image('title', './assets/images/gametitle.png');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    console.log('[create]');
    // Background and title images
    var menuBG = this.add.image(400,300,'menu').setScale(.5,.5);
    var titleImage = this.add.image(470,120, "title").setScale(.5,.5);


    // Audio
    this.backgroundMusic = this.sound.add("short");
    this.backgroundMusic.play({loop:true});

    //configure audio
    var sound = this.sound.add('pops');
    sound.addMarker({
      name: 'low',
      start: 0.15,
      duration: 0.5
    });
    sound.addMarker({
      name: 'high',
      start: 1.1,
      duration: 1.5
    });

    var newGameText = this.add.text(
      this.centerX - 100,
      this.centerY-80,
      "New Game", {
        fontFamily: 'Arial',
        fontSize: 64,
        color: '#fcba03',
        stroke: '#000000',
        strokeThickness: 7
      }
    );
    newGameText.setInteractive();

    //handle player interaction
    newGameText.on("pointerover", function() {
      sound.play('low');
      this.x += 50;
    });
    newGameText.on("pointerout", function () {
      this.x -= 50;
    });
    newGameText.on("pointerup", function () {
      sound.play('high');
      this.backgroundMusic.stop();
      console.log('[MENU COMPLETE]');
      this.scene.start('levelPicker');
    }, this);
}

  update (time, delta) {
    // Update the scene
  }
}
