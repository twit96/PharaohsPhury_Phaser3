/*global Phaser*/
import User from './user.js';

export default class userScene extends Phaser.Scene {
  constructor () {
    super('userScene');
  }

  init (data) {
    // Initialization code goes here
    this.isNew = data.isNew;
  }

  preload () {
    console.log('\n[User Page]')
    console.log('[preload]');
    this.load.image('menu', './assets/images/menu.jpg');
    this.load.image('title', './assets/images/gametitle.png');
    this.load.json("users","./src/data/users.json");

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
    this.keySpace;
    this.keyBackspace;
    this.textEntry;
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

    this.add.text(240, 320, 'Please type your name:', { font: '32px Courier', fill: '#000000' });
    var textEntry = this.add.text(240, 360, '', { font: '32px Courier', fill: '#000000' });

    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.keyBackspace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE);

    this.input.keyboard.on('keydown', function (event) {

        if (event.keyCode === 8 && textEntry.text.length > 0)
        {
            textEntry.text = textEntry.text.substr(0, textEntry.text.length - 1);
        }
        else if (event.keyCode === 32 || (event.keyCode >= 48 && event.keyCode < 90))
        {
            textEntry.text += event.key;
        }
    });


    var enterBtn = this.add.text(
      this.centerX + 100,
      this.centerY + 160,
      "START NOW", {
        fontFamily: 'Arial',
        fontSize: 30,
        color: '#fcba03',
        stroke: '#000000',
        strokeThickness: 7
      }
    );

    enterBtn.setInteractive().on("pointerover", function() {
      sound.play('low');
      this.setScale(1.1);
      this.x -= 25;
    }).on("pointerout", function () {
      this.setScale(1.0);
      this.x += 25;
    }).on("pointerup", function () {
      sound.play('high');
      this.checkUserName(textEntry.text);
    }, this);

    var enterBtn = this.add.text(
      this.centerX - 100,
      this.centerY + 160,
      "BACK", {
        fontFamily: 'Arial',
        fontSize: 30,
        color: '#fcba03',
        stroke: '#000000',
        strokeThickness: 7
      }
    );

    enterBtn.setInteractive().on("pointerover", function() {
      sound.play('low');
      this.setScale(1.1);
      this.x -= 25;
    }).on("pointerout", function () {
      this.setScale(1.0);
      this.x += 25;
    }).on("pointerup", function () {
      sound.play('high');
      this.scene.start("menu");
    }, this);
}

checkUserName (input){
  this.allUser = this.cache.json.get('users');
  var foundUser = this.getUserFromJson(input);
  console.log("Found in storage");
  console.log(foundUser);
  this.registry.reset();

  // create new profile
  if (this.isNew){
    console.log("New user creating....");
    if (foundUser == null){
      // Set user data to registry for runtime get and set
      this.registry.set({ userName: input, levelCompletion:[0,0,0,0,0,0,0,0,0]});
      this.backgroundMusic.stop();
      console.log("New name received, created new user");
      this.scene.start('levelPicker');
    } else { // if already exist
      console.log("The user name has been taken; Please enter another name");
    }
  }
  // Retrive old profile
  else {
    console.log("Old user searching....");
    if (foundUser == null){ // if did not exist
      console.log("The user name has not been found; Please make sure you enter the correct name");
    } else {
      // Found user; then instanciate an object using the info;
      // Set user to registry for runtime get and set
      this.registry.set({ userName: foundUser.userName, levelCompletion:foundUser.levelCompletion});
      this.backgroundMusic.stop();
      console.log("Old name found, directing to level picker");
      this.scene.start('levelPicker');
    }
  }
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
