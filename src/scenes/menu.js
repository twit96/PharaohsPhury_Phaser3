/*global Phaser*/
export default class menu extends Phaser.Scene {
  constructor () {
    super('menu');
  }

  init (data) {
    // Initialization code goes here
  }

  preload () {
    // Preload assets
    this.load.spritesheet('buttons', './assets/spriteSheets/buttons.png', {
      frameHeight: 100,
      frameWidth: 200
    });

    this.load.audio('pops', './assets/sounds/buttonPops.mp3');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //Add event listeners
    //ChangeScene.addSceneEventListeners(this);

    //Create the scene
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

    //text
     this.titleText;
     this.titleText = this.add.text(this.centerX-320, this.centerY-250, "Pharaoh's Phury", {
    fontSize: "70px",
    //fill: "#110"
    });

    var newGameText = this.add.text(this.centerX - 125, this.centerY-100, 'New Game', {
      fontFamily: 'Arial',
      fontSize: 52,
      color: '#fcba03' });
    newGameText.setInteractive();

    //var b2 = this.add.sprite(400, 500, 'buttons', 2).setInteractive();
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
      this.scene.start('levelPicker');
    }, this);
}

  update (time, delta) {
    // Update the scene
  }
}
