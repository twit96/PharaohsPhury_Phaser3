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

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    console.log('[create]');
    // Background and title images
    var menuBG = this.add.image(400,300,'menu').setScale(.5,.5);

    // Audio
    this.backgroundMusic = this.sound.add("bg1");
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
      this.centerX ,
      this.centerY + 110,
      "New User", {
        fontFamily: 'Arial',
        fontSize: 60,
        color: '#fcba03',
        stroke: '#000000',
        strokeThickness: 7
      }
    );
    newGameText.setInteractive().on("pointerover", function() {
      sound.play('low');
      this.setScale(1.2);
      this.x -= 25;
      this.y -= 10;
    }).on("pointerout", function () {
      this.setScale(1.0);
      this.x += 25;
      this.y += 10;
    }).on("pointerup", function () {
      sound.play('high');

      this.backgroundMusic.stop();
      console.log('[MENU COMPLETE]');
      this.scene.start('userScene', {
        isNew: true
      });
    }, this);

    var continueOldGameText = this.add.text(
      this.centerX ,
      this.centerY + 170,
      "Continue", {
        fontFamily: 'Arial',
        fontSize: 60,
        color: '#fcba03',
        stroke: '#000000',
        strokeThickness: 7
      }
    );
    continueOldGameText.setInteractive().on("pointerover", function() {
      sound.play('low');
      this.setScale(1.2);
      this.x -= 25;
    }).on("pointerout", function () {
      this.setScale(1.0);
      this.x += 25;
    }).on("pointerup", function () {
      sound.play('high');
      this.backgroundMusic.stop();
      console.log('[MENU COMPLETE]');
      console.log('[Directing to user page]');
      this.scene.start('userScene', {
        isNew: false
      });
    }, this);
}

  update (time, delta) {
    // Update the scene
  }
}
