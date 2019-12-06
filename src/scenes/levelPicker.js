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

    this.load.json("users","./src/data/users.json");
    this.load.image('background', './assets/images/lvlselect.jpg');

    //buttons
    this.load.image('tutorial', './assets/images/slabT.png');
    this.load.image('slab1', './assets/images/slab1.png');
    this.load.image('slab2', './assets/images/slab2.png');
    this.load.image('slab3', './assets/images/slab3.png');
    this.load.image('slab4', './assets/images/slab4.png');
    this.load.image('slab5', './assets/images/slab5.png');
    this.load.image('slab6', './assets/images/slab6.png');
    this.load.image('slab7', './assets/images/slab7.png');
    this.load.image('final', './assets/images/final.png');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
  }

  create (data) {
    console.log('[create]');

    // User information
    this.levelCompletion = this.registry.get("levelCompletion");
    console.log(this.registry.get("userName"));
    console.log(this.levelCompletion);

    //background
    this.add.image(400,300,'background').setScale(.5,.5);

    //audio
    this.backgroundMusic = this.sound.add("bg3");
    this.backgroundMusic.play({loop:true});
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
    console.log('configured audio');

    //create and configure buttons
    var b0 = this.add.image(675, 515, 'tutorial').setScale(.5,.5).setInteractive();
    b0.on("pointerover", function() {
      this.setScale(.7);
      sound.play('low')
    });
    b0.on("pointerout", function () {
      this.setScale(.5);
    });
    b0.on("pointerup", function () {
      sound.play('high');
      this.backgroundMusic.stop();
      this.scene.start('levelScene', {
        level: 0
      });
    }, this
    );

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
      this.scene.start('levelScene', {
        level: 1
      });
    }, this
    );

    var b2 = this.add.image(515, 140, 'slab2').setScale(.5,.5).setInteractive();
    if (this.levelCompletion[1] != 1) {
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
        this.scene.start('levelScene', {
          level: 2
        });
      }, this
      );
    }

    var b3 = this.add.image(285, 225, 'slab3').setScale(.5,.5).setInteractive();
    if (this.levelCompletion[2] != 1) {
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
      this.scene.start('levelScene', {
        level: 3
      });
    }, this   // scope so above line works
    );
  }

    var b4 = this.add.image(515, 225, 'slab4').setScale(.5,.5).setInteractive();
    if (this.levelCompletion[3] != 1) {
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
        this.scene.start('levelScene', {
          level: 4
        });
        }, this
      );
    }

    var b5 = this.add.sprite(285, 315, 'slab5').setScale(.5,.5).setInteractive();
    if (this.levelCompletion[4] != 1) {
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
        this.scene.start('levelScene', {
          level: 5
        });
      }, this
      );
    }

    var b6 = this.add.image(515, 315, 'slab6').setScale(.5,.5).setInteractive();
    if (this.levelCompletion[5] != 1) {
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
        this.scene.start('levelScene', {
          level: 6
        });
      }, this   // scope so above line works
      );
    }

    var b7 = this.add.image(410, 405, 'slab7').setScale(.5,.5).setInteractive();
    if (this.levelCompletion[6] != 1) {
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
      this.scene.start('levelScene', {
        level: 7
      });
      }, this
    );}

    var b8 = this.add.image(388, 538, 'final').setScale(.55,.55).setInteractive();
    if (this.levelCompletion[7] != 1) {
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
      this.scene.start('levelScene', {
        level: 8
      });
    }, this
  );}

  var saveLeaveBtn = this.add.sprite(this.centerX - 180,555,"exit").setScale(.15,.15).setFlipX(true);
  saveLeaveBtn.setInteractive().on("pointerover", function() {
    sound.play('low');
    this.setScale(.2);
    //this.x += 25;
  }).on("pointerout", function () {
    this.setScale(.15);
    //this.x -= 25;
  }).on("pointerup", function () {
    sound.play('high');
    this.saveANDLeave();
  }, this);

  console.log('configured buttons');
}

saveANDLeave(){
  var user = {userName:this.registry.get("userName"), levelCompletion:this.registry.get("levelCompletion")};
  this.allUser = this.cache.json.get('users');
  var foundUser = this.getUserFromJson(this.registry.get("userName"));
  if (foundUser == null) {
    console.log("new user record needs to be append into json");
    this.allUser.push(user);
    console.log(this.allUser);
    // this.load.saveJSON(this.allUser,"./src/data/users.json" );
    this.save = function () {
        jQuery.ajax({
            type : "POST",
            dataType : "json",
            url : 'save.php',
            data : {'json': JSON.stringify(this.allUser)},
            success : function() {
                console.log("SUCCESS");
            },
            error : function() {
                console.log("ERROR");
            }
       });
    }
  } else {
    console.log("old user record needs to be updated");

    var filtered = this.allUser.filter(function(eachUser){
      return eachUser.userName != user.userName;
    });
    filtered.push(user);
    console.log(filtered);
    // this.load.saveJSON(filtered,"./src/data/users.json" );
    this.save = function () {
        jQuery.ajax({
            type : "POST",
            dataType : "json",
            url : 'save.php',
            data : {'json': JSON.stringify(filtered)},
            success : function() {
                console.log("SUCCESS");
            },
            error : function() {
                console.log("ERROR");
            }
       });
    }
  }
  this.backgroundMusic.stop();
  this.scene.start("menu");
}

getUserFromJson(name) {
  for (var user of this.allUser) {
    if (user.userName == name ) {
      return user
    }
  }
  return null;
}

  update (time, delta) {
    // Update the scene
  }
}
