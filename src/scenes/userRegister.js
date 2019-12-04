/*global Phaser*/
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
    this.load.json("users","./src/data/users.json");

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
    this.keySpace;
    this.keyBackspace;
    this.alert;
  }

  create (data) {
    console.log('[create]');
    // Background and title images
    var menuBG = this.add.image(400,300,'menu').setScale(.5,.5);

    // Audio
    this.backgroundMusic = this.sound.add("bg2");
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

    this.alert = this.add.text(300, 400, '', {
      fontFamily: 'Arial',
      fontSize: 20,
      color: '#ff5023',
      stroke: '#000000',
      strokeThickness: 7
    });

    this.add.text(240, 320, 'Please type your name (Less than 6 characters):',{
      fontFamily: 'Arial',
      fontSize: 20,
      color: '#fcba03',
      stroke: '#000000',
      strokeThickness: 4
    });

    var textEntry = this.add.text(240, 360, '', { font: '32px Courier', fill: '#000000' });

    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.keyBackspace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE);

    this.input.keyboard.on('keydown', function (event) {
        if (textEntry.text.length >= 6 && event.keyCode !== 8){
          console.log("user name is more than 6 characters");
        }
        else if (event.keyCode === 8 && textEntry.text.length > 0)
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

    var backBtn = this.add.text(
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

    backBtn.setInteractive().on("pointerover", function() {
      sound.play('low');
      this.setScale(1.1);
      this.x -= 25;
    }).on("pointerout", function () {
      this.setScale(1.0);
      this.x += 25;
    }).on("pointerup", function () {
      sound.play('high');
      this.backgroundMusic.stop();
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
      } else {
        // if already exist
        this.alert.setText("Name has been taken!! \nPlease Try Again!!");
      }
    }
    // Retrive old profile
    else {
      console.log("Old user searching....");
      if (foundUser == null){
        // if did not exist
        this.alert.setText("Name Not Found!!");
      } else {
        // Found user; then instanciate an object using the info;
        // Set user to registry for runtime get and set
        this.registry.set({ userName: foundUser.userName, levelCompletion:foundUser.levelCompletion});
        this.backgroundMusic.stop();
        console.log("Name found; directing to level picker");
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

  }
}
