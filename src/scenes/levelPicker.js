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
    this.load.image('background', './assets/images/lvlselect.jpg');
    this.load.image('slab1', './assets/images/slab1.png');
    this.load.image('slab2', './assets/images/slab2.png');
    this.load.image('slab3', './assets/images/slab3.png');
    this.load.image('slab4', './assets/images/slab4.png');
    this.load.image('slab5', './assets/images/slab5.png');
    this.load.image('slab6', './assets/images/slab6.png');
    this.load.image('slab7', './assets/images/slab7.png');
    this.load.image('slab8', './assets/images/slab8.png');
    this.load.image('final', './assets/images/final1.png');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
  }

  create (data) {
    // User information
    console.log(this.registry.get("userName"));
    console.log(this.registry.get("levelCompletion"));
    this.levelCompletion = this.registry.get("levelCompletion");

    console.log('[create]');
    this.add.image(400,300,'background').setScale(.5,.5);
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

    console.log('configured audio and title');

    //create and configure buttons

    var b1 = this.add.image(285, 140, 'slab1').setScale(.5,.5).setInteractive();
    b1.on("pointerover", function() {
      this.setScale(.7);
      sound.play('low')
    });
    b1.on("pointerout", function () {
      this.setScale(.5);
    });
    b1.on("pointerup", function () {
      sound.play('high');
      this.backgroundMusic.stop();
      this.scene.start('level1');
    }, this
    );

    var b2 = this.add.image(515, 140, 'slab2').setScale(.5,.5).setInteractive();
    if (this.levelCompletion[0] != 1) {
      b2.tint = 0x707070;
    } else {
      b2.on("pointerover", function() {
        this.setScale(.7);
        sound.play('low')
      });
      b2.on("pointerout", function () {
        this.setScale(.5);
      });
      b2.on("pointerup", function () {
        sound.play('high');
        this.backgroundMusic.stop();
        this.scene.start('level2');
      }, this
      );
    }

    var b3 = this.add.image(285, 225, 'slab3').setScale(.5,.5).setInteractive();
    if (this.levelCompletion[1] != 1) {
      b3.tint = 0x707070;
    } else{
    b3.on("pointerover", function() {
      this.setScale(.7);
      sound.play('low')
    });
    b3.on("pointerout", function () {
      this.setScale(.5);
    });
    b3.on("pointerup", function () {
      sound.play('high');
      this.backgroundMusic.stop();
      this.scene.start('level3');
    }, this   // scope so above line works
    );
  }

    var b4 = this.add.image(515, 225, 'slab4').setScale(.5,.5).setInteractive();
    if (this.levelCompletion[2] != 1) {
      b4.tint = 0x707070;
    } else {
      b4.on("pointerover", function() {
        this.setScale(.7);
        sound.play('low')
      });
      b4.on("pointerout", function () {
        this.setScale(.5);
      });
      b4.on("pointerup", function () {
        sound.play('high');
        this.backgroundMusic.stop();
        this.scene.start('level4');
        }, this
      );
    }

    var b5 = this.add.sprite(285, 315, 'slab5').setScale(.5,.5).setInteractive();
    if (this.levelCompletion[3] != 1) {
      b5.tint = 0x707070;
    } else{
      b5.on("pointerover", function() {
        this.setScale(.7);
        sound.play('low')
      });
      b5.on("pointerout", function () {
        this.setScale(.5);
      });
      b5.on("pointerup", function () {
        sound.play('high');
        this.backgroundMusic.stop();
        this.scene.start('level5');
      }, this
      );
    }

    var b6 = this.add.image(515, 315, 'slab6').setScale(.5,.5).setInteractive();
    if (this.levelCompletion[4] != 1) {
      b6.tint = 0x707070;
    } else {
      b6.on("pointerover", function() {
        this.setScale(.7);
        sound.play('low')
      });
      b6.on("pointerout", function () {
        this.setScale(.5);
      });
      b6.on("pointerup", function () {
        sound.play('high');
        this.backgroundMusic.stop();
        this.scene.start('level6');
      }, this   // scope so above line works
      );
    }

    var b7 = this.add.image(285, 405, 'slab7').setScale(.5,.5).setInteractive();
    if (this.levelCompletion[5] != 1) {
      b7.tint = 0x707070;
    } else {
    b7.on("pointerover", function() {
      this.setScale(.7);
      sound.play('low')
    });
    b7.on("pointerout", function () {
      this.setScale(.5);
    });
    b7.on("pointerup", function () {
      sound.play('high');
      this.backgroundMusic.stop();
      this.scene.start('level7');
      }, this
    );}

    var b8 = this.add.image(515, 405, 'slab8').setScale(.5,.5).setInteractive();
    if (this.levelCompletion[6] != 1) {
      b8.tint = 0x707070;
    } else {
    b8.on("pointerover", function() {
      this.setScale(.7);
      sound.play('low')
    });
    b8.on("pointerout", function () {
      this.setScale(.5);
    });
    b8.on("pointerup", function () {
      sound.play('high');
      this.backgroundMusic.stop();
      // this.scene.start('level8');
    }, this
  );}

    var b9 = this.add.image(388, 538, 'final').setScale(.55,.55).setInteractive();
    if (this.levelCompletion[7] != 1) {
      b9.tint = 0x707070;
    } else {
    b9.on("pointerover", function() {
      this.setScale(.7);
      sound.play('low')
    });
    b9.on("pointerout", function () {
      this.setScale(.5);
    });
    b9.on("pointerup", function () {
      sound.play('high');
      this.scene.start('finalBossLevel');
    }, this
  );}
    console.log('configured buttons');
}

  update (time, delta) {
    // Update the scene
  }
}
