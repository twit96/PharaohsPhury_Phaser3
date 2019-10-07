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

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    console.log('[create]');

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

    //create text
    this.titleText = this.add.text(
      this.centerX-320,
      this.centerY-250,
      "Pharaoh's Phury", {
        fontSize: "70px"
      }
    );
    var newGameText = this.add.text(
      this.centerX - 125,
      this.centerY-100,
      "New Game", {
        fontFamily: 'Arial',
        fontSize: 52,
        color: '#fcba03'
      }
    );
    newGameText.setInteractive();

    //handle player interaction
    newGameText.on("pointerover", function() {
      sound.play('low');
      this.setScale(1.5);
      this.x -= 70;
      this.setTintFill(0x00ffff, 0x00ffff, 0x00ffff, 0x00ffff);
    });
    newGameText.on("pointerout", function () {
      this.setTintFill(0xfcba03, 0xfcba03, 0xfcba03, 0xfcba03);
      this.x += 70;
      this.setScale(1);
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
