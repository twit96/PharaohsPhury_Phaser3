/*global Phaser*/
export default class levelPicker extends Phaser.Scene {
  constructor () {
    super('levelPicker');
  }

  init (data) {
    // Initialization code goes here
  }

  preload () {
    console.log('\n[LEVELPICKER]');
    console.log('[preload]');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
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
      duration: 1.5   // note: duration is the stopping point rather than the length of the sound. i.e. 'high' plays from 1.1 to 1.5 seconds
    });

    //create title text
    var title = this.add.text(this.centerX - 75, 15, 'Levels', {
      fontFamily: 'Arial',
      fontSize: 52,
      color: '#fcba03' });

    console.log('configured audio and title');

    //create and configure buttons
    var b0 = this.add.sprite(175, 150, 'buttons', 0).setInteractive();
    b0.on("pointerover", function() {
      this.setFrame(1);
      sound.play('low')
    });
    b0.on("pointerout", function () {
      this.setFrame(0);
    });
    b0.on("pointerup", function () {
      sound.play('high');
      //this.scene.start('level0');
    }, this   // scope so above line works
    );


    var b1 = this.add.sprite(400, 150, 'buttons', 2).setInteractive();
    b1.on("pointerover", function() {
      this.setFrame(3);
      sound.play('low')
    });
    b1.on("pointerout", function () {
      this.setFrame(2);
    });
    b1.on("pointerup", function () {
      sound.play('high');
      this.backgroundMusic.stop();
      this.scene.start('level1');
    }, this
    );

    var b2 = this.add.sprite(625, 150, 'buttons', 4).setInteractive();
    b2.on("pointerover", function() {
      this.setFrame(5);
      sound.play('low')
    });
    b2.on("pointerout", function () {
      this.setFrame(4);
    });
    b2.on("pointerup", function () {
      sound.play('high');
      //this.scene.start('level2');
    }, this
    );

    var b3 = this.add.sprite(175, 275, 'buttons', 6).setInteractive();
    b3.on("pointerover", function() {
      this.setFrame(7);
      sound.play('low')
    });
    b3.on("pointerout", function () {
      this.setFrame(6);
    });
    b3.on("pointerup", function () {
      sound.play('high');
      //this.scene.start('level3');
    }, this   // scope so above line works
    );

    var b4 = this.add.sprite(400, 275, 'buttons', 8).setInteractive();
    b4.on("pointerover", function() {
      this.setFrame(9);
      sound.play('low')
    });
    b4.on("pointerout", function () {
      this.setFrame(8);
    });
    b4.on("pointerup", function () {
      sound.play('high');
      //this.scene.start('level4');
      }, this
    );

    var b5 = this.add.sprite(625, 275, 'buttons', 10).setInteractive();
    b5.on("pointerover", function() {
      this.setFrame(11);
      sound.play('low')
    });
    b5.on("pointerout", function () {
      this.setFrame(10);
    });
    b5.on("pointerup", function () {
      sound.play('high');
      //this.scene.start('level5');
    }, this
    );

    var b6 = this.add.sprite(175, 400, 'buttons', 12).setInteractive();
    b6.on("pointerover", function() {
      this.setFrame(13);
      sound.play('low')
    });
    b6.on("pointerout", function () {
      this.setFrame(12);
    });
    b6.on("pointerup", function () {
      sound.play('high');
      //this.scene.start('level6');
    }, this   // scope so above line works
    );

    var b7 = this.add.sprite(400, 400, 'buttons', 14).setInteractive();
    b7.on("pointerover", function() {
      this.setFrame(15);
      sound.play('low')
    });
    b7.on("pointerout", function () {
      this.setFrame(14);
    });
    b7.on("pointerup", function () {
      sound.play('high');
      //this.scene.start('level7');
      }, this
    );

    var b8 = this.add.sprite(625, 400, 'buttons', 16).setInteractive();
    b8.on("pointerover", function() {
      this.setFrame(17);
      sound.play('low')
    });
    b8.on("pointerout", function () {
      this.setFrame(16);
    });
    b8.on("pointerup", function () {
      sound.play('high');
      //this.scene.start('level8');
    }, this
    );

    var b9 = this.add.sprite(400, 525, 'buttons', 18).setInteractive();
    b9.on("pointerover", function() {
      this.setFrame(19);
      sound.play('low')
    });
    b9.on("pointerout", function () {
      this.setFrame(18);
    });
    b9.on("pointerup", function () {
      sound.play('high');
      this.backgroundMusic.stop();
      this.scene.start('finalBossLevel');
    }, this
    );

    console.log('configured buttons');
  }

  update (time, delta) {
    // Update the scene
  }
}
