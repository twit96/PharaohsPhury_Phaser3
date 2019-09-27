/*global Phaser*/
export default class levelPicker extends Phaser.Scene {
  constructor () {
    super('levelPicker');
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
      duration: 1.5   // note: duration is the stopping point rather than the length of the sound. i.e. 'high' plays from 1.1 to 1.5 seconds
    });

    //Create Title
    var title = this.add.text(this.centerX - 75, 15, 'Levels', {
      fontFamily: 'Arial',
      fontSize: 52,
      color: '#fcba03' });

    //Create buttons
    var b1 = this.add.sprite(175, 150, 'buttons', 0).setInteractive();
    b1.on("pointerover", function() {
      this.setFrame(1);
      sound.play('low')
    });

    b1.on("pointerout", function () {
      this.setFrame(0);
    });

    b1.on("pointerup", function () {
      sound.play('high');
      this.scene.start('level0');
    }, this   // scope so above line works
  );


    var b2 = this.add.sprite(400, 150, 'buttons', 2).setInteractive();
    b2.on("pointerover", function() {
      this.setFrame(3);
      sound.play('low')
    });

    b2.on("pointerout", function () {
      this.setFrame(2);
    });

    b2.on("pointerup", function () {
      sound.play('high');
      this.scene.start('level1');
      }, this
  );

    var b3 = this.add.sprite(625, 150, 'buttons', 4).setInteractive();
    b3.on("pointerover", function() {
      this.setFrame(5);
      sound.play('low')
    });

    b3.on("pointerout", function () {
      this.setFrame(4);
    });

    b3.on("pointerup", function () {
      sound.play('high');
      this.scene.start('level2');
    }, this
  );

    var b4 = this.add.sprite(175, 275, 'buttons', 6).setInteractive();
    b4.on("pointerover", function() {
      this.setFrame(7);
      sound.play('low')
    });

    b4.on("pointerout", function () {
      this.setFrame(6);
    });

    b4.on("pointerup", function () {
      sound.play('high');
      this.scene.start('level3');
    }, this   // scope so above line works
  );

    var b5 = this.add.sprite(400, 275, 'buttons', 8).setInteractive();
    b5.on("pointerover", function() {
      this.setFrame(9);
      sound.play('low')
    });

    b5.on("pointerout", function () {
      this.setFrame(8);
    });

    b5.on("pointerup", function () {
      sound.play('high');
      this.scene.start('level4');
      }, this
  );

    var b6 = this.add.sprite(625, 275, 'buttons', 10).setInteractive();
    b6.on("pointerover", function() {
      this.setFrame(11);
      sound.play('low')
    });

    b6.on("pointerout", function () {
      this.setFrame(10);
    });

    b6.on("pointerup", function () {
      sound.play('high');
      this.scene.start('level5');
    }, this
  );

    var b7 = this.add.sprite(175, 400, 'buttons', 12).setInteractive();
    b7.on("pointerover", function() {
      this.setFrame(13);
      sound.play('low')
    });

    b7.on("pointerout", function () {
      this.setFrame(12);
    });

    b7.on("pointerup", function () {
      sound.play('high');
      this.scene.start('level6');
    }, this   // scope so above line works
  );

    var b8 = this.add.sprite(400, 400, 'buttons', 14).setInteractive();
    b8.on("pointerover", function() {
      this.setFrame(15);
      sound.play('low')
    });

    b8.on("pointerout", function () {
      this.setFrame(14);
    });

    b8.on("pointerup", function () {
      sound.play('high');
      this.scene.start('level7');
      }, this
  );

    var b9 = this.add.sprite(625, 400, 'buttons', 16).setInteractive();
    b9.on("pointerover", function() {
      this.setFrame(17);
      sound.play('low')
    });

    b9.on("pointerout", function () {
      this.setFrame(16);
    });

    b9.on("pointerup", function () {
      sound.play('high');
      //this.scene.start('level8');
    }, this
  );

  var b10 = this.add.sprite(400, 525, 'buttons', 18).setInteractive();
  b10.on("pointerover", function() {
    this.setFrame(19);
    sound.play('low')
  });

  b10.on("pointerout", function () {
    this.setFrame(18);
  });

  b10.on("pointerup", function () {
    sound.play('high');
    this.scene.start('level9');
  }, this
  );


}

  update (time, delta) {
    // Update the scene
  }
}
