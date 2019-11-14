/*globals Phaser*/
import * as ChangeScene from './ChangeScene.js';
import Mummy from "./mummy.js";
import EnemyArch from './enemyArch.js';
import EnemySoldier from './enemySoldier.js';

export default class level8 extends Phaser.Scene {
  constructor () {
    super('level8');
  }

  preload() {
    console.log('\n[level8]');
    console.log('[preload]')
    this.load.json("levelSetting","./src/data/levelSetting.json");
    this.load.image('background1', './assets/images/egyptianbackground.jpg');

    this.load.image('bubble', './assets/images/opaquebubble.png');
    this.load.image('mbtn', './assets/images/mbutton.png');
  }

  create() {
    console.log('[create]');

    //Add change scene event listeners
    ChangeScene.addSceneEventListeners(this);

    //background image
    this.add.image(2240,384,'background1');

    //AUDIO
    this.backgroundMusic = this.sound.add("bg");
    this.backgroundMusic.play({loop:true});
    this.shootBeam = this.sound.add("beam");
    this.meleeSound = this.sound.add("meleeAttack");
    this.yell = this.sound.add("diedYell");
    this.cry = this.sound.add("diedCry");
    this.pickupSound = this.sound.add("pickupSound");

    //VARIABLES
    //player
    this.spawnX = 50;
    this.spawnY = 100;
    this.levelName = 8;

    //declare map and tilesets
      //addTilesetImage parameters: name of tileset in Tiled, key for tileset in bootscene
      //createStaticLayer parameters: layer name (or index) from Tiled, tileset, x, y
    const map = this.makelevel.tilemap({ key: "level8map" });
    const below2Tileset =map.addTilesetImage("inca_back2", "incaBack2Tiles");
    //const belowTileset = map.addTilesetImage("inca_back", "incaBackTiles");
    const worldTileset = map.addTilesetImage("inca_front", "incaFrontTiles");

    //render map/player/enemies in specific order
    const bgLayer = map.createStaticLayer("Below Player", below2Tileset, 0, 0);
    const invisLayer = map.createStaticLayer("Invisible", worldTileset, 0, 0);
    const worldLayer = map.createStaticLayer("World", worldTileset, 0, 0);
    worldLayer.setCollisionByProperty({ collides: true });
    worldLayer.setTileIndexCallback﻿﻿([30,28], this.hitExit, this);
    invisLayer.setAlpha(0);

    /*
    // for collecting item @ dyven
    const itemTiles = this.map.addTilesetImage﻿(imageKey﻿);
    const itemLayer = this.map.createDynamicLayer(dynamicLayerName, itemTiles, 0, 0);
    itemLayer.setTileIndexCallback(tileIndex , this.collectItem, this);
    */

    //diamonds
    this.collectItems = this.add.group();
    this.collectItems.enableBody = true;
    this.scroll = this.add.group();
    this.scroll.enableBody = true;
    this.chests = this.physics.add.group({
      defaultKey: "chest"
    });
    //create enemies group
    this.enemiesA = this.add.group();
    this.enemiesA.enableBody = true;
    this.enemiesS = this.add.group();
    this.enemiesS.enableBody = true;

    //CREATE LEVEL
    // level Data parse from json, read cordination into array of [x,y];
    this.levelSettingInfo = this.cache.json.get('levelSetting');
    this.enemyACor = this.levelSettingInfo.level8.enemyA;
    this.enemySCor = this.levelSettingInfo.level8.enemyS;
    this.gemCor = this.levelSettingInfo.level8.gem;
    this.chestCor = this.levelSettingInfo.level8.chest;

    console.log("populating enemyA at " + this.enemyACor + ". There are " + Object.keys(this.enemyACor).length);
    console.log("populating enemyS at " + this.enemySCor);
    console.log("populating gem at " + this.gemCor);
    console.log("populating chest at " + this.chestCor);

    // spawn
    for (var count in this.enemyACor) {
      var x = this.enemyACor[count][0];
      var y = this.enemyACor[count][1];
      var enemy = new EnemyArch({
        scene: this,
        key: "archeologist",
        x: x,
        y: y
      });
      enemy.play("archeologistAnim");
      enemy.body.setCollideWorldBounds(true);
      enemy.setInteractive();
      this.enemiesA.add(enemy);
      console.log("Created "+this.enemiesA.children);
    }
    for (var count in this.enemySCor) {
      var x = this.enemySCor[count][0];
      var y = this.enemySCor[count][1];
      var enemy = new EnemySoldier({
        scene: this,
        key: "soldier",
        x: x,
        y: y,
      });
      enemy.play("soldierAnim");
      enemy.body.setCollideWorldBounds(true);
      enemy.setInteractive();
      this.enemiesS.add(enemy);
      console.log("Created "+this.enemiesS.children);
    }

    for (var count in this.gemCor) {
      var x = this.gemCor[count][0];
      var y = this.gemCor[count][1];
      this.collectItems.add(this.physics.add.sprite(x,y,'gem'));
    }
    for (var count in this.chestCor) {
      var x = this.chestCor[count][0];
      var y = this.chestCor[count][1];

      var chest = this.chests.get();
      chest
        .enableBody(true, x, y, true, true);
    }
    //player
    this.player = new Mummy({
      scene: this,
      key: "mummyWalk",
      x: this.spawnX,
      y: this.spawnY
    });

    const aboveLayer = map.createStaticLayer("Above Player", worldTileset, 0, 0);

    console.log('created map layers and sprites');

    //player physics/input
    this.player.body.setCollideWorldBounds(true);
    this.cursors = this.input.keyboard.createCursorKeys();

    //world/camera bounds
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player);

    //configure sprite collisions
    this.boundaryBox = map.heightInPixels - this.player.body.height;

    this.physics.add.collider(this.player, worldLayer);
    this.physics.add.collider(this.enemiesA, worldLayer);
    this.physics.add.collider(this.enemiesS, worldLayer);
    this.physics.add.collider(this.collectItems, worldLayer);
    this.physics.add.collider(this.collectItems, this.collectItems);
    this.physics.add.collider(this.scroll, this.scroll);
    this.physics.add.collider(this.scroll, worldLayer);
    this.physics.add.collider(this.chests, worldLayer);
    this.physics.add.collider(this.enemiesA, invisLayer);
    this.physics.add.collider(this.enemiesS, invisLayer);

    this.physics.add.overlap(
      this.player,
      this.enemiesA,
      this.playerRanIntoEnemy,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.enemiesS,
      this.playerRanIntoEnemy,
      null,
      this
    );
    this.physics.add.overlap(
      this.player.beams,
      worldLayer,
      this.player.beamHitWall,
      null,
      this
    );
    this.enemiesS.children.each(function(enemyS) {
      this.physics.add.overlap(
        enemyS.bullets,
        worldLayer,
        enemyS.bulletHitWall,
        null,
        this
      );
    }, this);
    this.enemiesS.children.each(function(enemyS) {
      this.physics.add.overlap(
        enemyS.bullets,
        invisLayer,
        enemyS.bulletHitWall,
        null,
        this
      );
    }, this);
    this.physics.add.overlap(
      this.player,
      this.collectItems,
      this.pickup,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.scroll,
      this.pickup,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.chests,
      this.pickupChests,
      null,
      this
    );
    console.log('configured sprites and physics');

    // Create timer
    this.startTime = new Date();
    this.endTime = new Date();
    this.duration = this.endTime-this.startTime

    // create score
    this.score = 0;

    // Generate  text
    this.LifeDisplay = this.add.text(10,20, "Life Left: " + this.player.lives).setScrollFactor(0,0);
    this.HealthDisplay = this.add.text(10,40, "Health: " + this.player.health).setScrollFactor(0,0);
    this.timerDisplay = this.add.text(10,60, "Timer: "+ this.duration).setScrollFactor(0,0);
    this.ScoreDisplay = this.add.text(10,80, "Score: "+ this.score).setScrollFactor(0,0);
    // this.location = this.add.text(10,100, "Score: "+ this.player.x + "," + this.player.y).setScrollFactor(0,0);

    // display heart for life
    var h;
    this.hearts = this.add.group();
    for (h = 0; h < this.player.lives; h++) {
      var xLocation = 150 + h*20 ;
      this.hearts.add(this.add.image(xLocation,28, "heart").setScrollFactor(0,0).setScale(0.03));
    }
    this.healthBar = this.add.image(120,38,"healthBarFrame").setOrigin(0,0).setScale(0.08).setScrollFactor(0,0);
    this.healthBarFill = this.add.image(120,38,"healthBarFill").setOrigin(0,0).setScale(0.08).setScrollFactor(0,0);
    this.healthBarOrgWidth = this.healthBarFill.width;
    this.healthBarOrgHeight = this.healthBarFill.width;

    console.log("configured on-screen display");
    console.log('completed create function');
  }

  update() {
    //duration and score
    this.endTime = new Date();
    this.duration = (this.endTime.getTime() - this.startTime.getTime())/1000;
    this.score = 50*this.player.enemiesKilled + 10*this.player.diamondsCollected;

    //display
    this.timerDisplay.setText("Timer: "+ this.duration);
    this.ScoreDisplay.setText("Score: "+ this.score);
    this.HealthDisplay.setText("Health: " + this.player.health);
    this.LifeDisplay.setText("Life Left: " + this.player.lives);
    // this.location.setText("Score: "+ this.player.x + "," + this.player.y);

    this.updateHealthBar();

    // player heart update - if hearts isn't equal to the player lifes, delete one heart
    if (this.player.lives != this.hearts.countActive()) {
      this.hearts.killAndHide(this.hearts.getFirstAlive());
    }
    //check for and handle gameOver or levelCompleted
    if (this.player.gameOver || this.player.levelCompleted) {
      console.log('end of level triggered');
      console.log('[LEVEL ENDING]');
      if (this.player.levelCompleted){
        var newLevelCompletion = this.registry.pop("levelCompletion");
        newLevelCompletion[0] = 1;

        this.registry.set({levelCompletion:newLevelCompletion});
        console.log(this.registry);
      }
      this.backgroundMusic.stop();
      var newLevelCompletion = this.registry.pop("levelCompletion");
      newLevelCompletion[7] = 1;

      this.registry.set({levelCompletion:newLevelCompletion});
      console.log(this.registry);

      this.scene.start('gameOverScene', {
        level: this.levelName,
        diamond: this.player.diamondsCollected,
        killed: this.player.enemiesKilled,
        done: this.player.levelCompleted
      });
      return;
    }

    //player motion
    this.player.move();


    //check if player on map
    this.playerFellOffMap(this.player);

    //configure overlaps for active player beams
    this.player.beams.children.each(
      function (b) {
        if (b.active) {
          this.physics.add.overlap(
            b,
            this.enemiesA,
            this.player.beamHitEnemy,
            null,
            this
          );
          this.physics.add.overlap(
            b,
            this.enemiesS,
            this.player.beamHitEnemy,
            null,
            this
          );

          //deactivate beams once they leave the screen
          if (b.y < 0) {
            b.setActive(false)
          } else if (b.y > this.cameras.main.height) {
            b.setActive(false)
          } else if (b.x < 0) {
            b.setActive(false)
          } else if (b.x > this.cameras.main.width) {
            b.setActive(false)
          }
        }
      }.bind(this)  //binds the function to each of the children. scope of function
    );

    //enemy movement
    this.enemiesA.children.each(function(enemyA) {
      enemyA.move();
    }, this);
    this.enemiesS.children.each(function(enemyS) {
      enemyS.move();
    }, this);

    //configure overlaps for active enemy bullets
    this.enemiesS.children.each(function(enemyS) {
          enemyS.bullets.children.each(
            function (b) {
              if (b.active) {
                this.physics.add.overlap(
                  b,
                  this.player,
                  this.shellHitPlayer,
                  null,
                  this
                );

                //deactivate bullets once they leave the screen
                if (b.y < 0) {
                  b.setActive(false)
                } else if (b.y > this.cameras.main.height) {
                  b.setActive(false)
                } else if (b.x < 0) {
                  b.setActive(false)
                } else if (b.x > this.cameras.main.width) {
                  b.setActive(false)
                }
              }
            }.bind(this)  //binds the function to each of the children. scope of function
          )
        }, this);
      }

  hitExit() {
    /**
    function to update levelCompleted to true when player reaches the exit
    */
    console.log("[level.hitExit]");
    this.player.levelCompleted = true;
  }

  shellHitPlayer(shell, player) {
    /*
    function to handle overlap between player and tank shell
    (i.e. tank shell hit player)
    */
    console.log('[level.shellHitPlayer]');


    //disable shell
    shell.disableBody(true, true);

    //update player stats
    player.updateHealth(20);
  }

  pickup(player,item) {
    item.destroy();
    this.player.diamondsCollected++;
    console.log("diamonds collected:" + this.player.diamondsCollected);
    this.pickupSound.play();
  }
  pickupChests(player,chest) {
    chest.play("chestOpen");
    this.scroll.add(this.physics.add.sprite(chest.x,chest.y-50,'scroll'));
    chest.setFrame(2);
    chest.disableBody(true,false);
    this.pickupSound.play();
  }

  pickUpScroll() {
    item.destroy();
    this.player.scrollsCollected++;
    console.log("scrollsC collected:" + this.player.scrollsCollected);
    this.pickupSound.play();
  }

  playerRanIntoEnemy(player, enemy) {
    /*
    function to handle the case of player colliding with an enemy.
    Player loses a life if not attacking, and enemy is always destroyed.
    */
    console.log('[level.playerRanIntoEnemy]');

    var enemyDied = false;

    //HANDLE COLLISION IF PLAYER IS NOT ATTACKING
    if (player.isAttacking == false) {
      console.log('player was not attacking');

      //variables to adjust player x away from enemy
      var enemyHalfWidth = enemy.width / 2;
      var enemyRightX = enemy.x + enemyHalfWidth;
      var enemyLeftX = enemy.x - enemyHalfWidth;

      //variables to adjust player y away from enemy
      var playerHalfHeight = this.player.height / 2;
      var enemyHalfHeight = enemy.height / 2;
      var enemyBottomY = enemy.y + enemyHalfHeight;

      if (this.player.body.touching.down) {
        //collision on top or bottom of enemy
        enemyDied = true;
        enemy.isActive = false;

        this.player.body.setVelocityY(-330);

      } else if (this.player.body.touching.right) {
        //collision on left side of enemy
        this.player.x = enemyLeftX - this.player.width;
        this.player.y = enemyBottomY - playerHalfHeight;

        //player takes damage
        player.updateHealth(25);  //25 ARBITRARILY CHOSEN

        //enemy briefly disabled
        enemy.stun();

      }  else if (this.player.body.touching.left) {
        //collision on right side of enemy
        this.player.x = enemyRightX + this.player.width;
        this.player.y = enemyBottomY - playerHalfHeight;

        //player takes damage
        player.updateHealth(25);  //75 ARBITRARILY CHOSEN

        //enemy briefly disabled
        enemy.stun();
      }


      console.log("adjusted player coordinates: (" + player.x + ", " + player.y + ")");

    //HANDLE COLLISION IF PLAYER IS ATTACKING
    } else {
      console.log('player was attacking');
      enemyDied = true;
    }

    //HANDLE ENEMY DEATH IF NEEDED
    if (enemyDied == true) {
      console.log('enemy died');

      //generate random number of diamonds to burst from dead enemy
      var randAmount = Math.floor(Math.random() * Math.floor(10));
      var x;
      for (x = 0; x < randAmount; x++) {
        //within 75 pixels left or right from the enemy
        var randomShiftX = Math.floor(Math.random() * Math.floor(150)) - 75;

        //up to 75 pixels above the enemy
        var randomShiftY = Math.floor(Math.random() * Math.floor(75));

        //spawn diamond
        var diamondX = enemy.x + randomShiftX;
        var diamondY = enemy.y - randomShiftY;
        this.spawnDiamond(diamondX, diamondY);
      }

      //"kill" enemy, update player stats
      enemy.updateHealth(1000); //soldier health is 25, arch health is 10, really really make sure they die with 1000 damage
      this.cry.play();
      player.enemiesKilled++;
    }
  }

  spawnDiamond(diamondX, diamondY){
    this.collectItems.add(this.physics.add.sprite(diamondX,diamondY,"gem"));
  }

  playerFellOffMap(player) {
    /*
    function to handle player colliding with bottom world bound
    */

    if (player.y > this.boundaryBox) {
      this.player.x = this.spawnX;
      this.player.y = this.spawnY;
      this.player.updateHealth(100);
      this.yell.play({volume: 5});

      //delay and reset player at spawn, then enable
      this.time.addEvent({
        delay: 1000,
        callback: this.resetPlayer,
        callbackScope: this,
        loop: false
      });
    }
  }
  updateHealthBar(){
    this.healthBarFill.setCrop(0,0,this.healthBarOrgWidth*this.player.health /100,this.healthBarOrgHeight);
  }
}
