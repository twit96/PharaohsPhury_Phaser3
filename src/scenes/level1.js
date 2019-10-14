/*globals Phaser*/
import * as ChangeScene from './ChangeScene.js';
import Mummy from "./mummy.js";
import EnemyArch from './enemyArch.js';
import EnemySoldier from './enemySoldier.js';

export default class level1 extends Phaser.Scene {
  constructor () {
    super('level1');
  }

  preload() {
    console.log('\n[LEVEL1]');
    console.log('[preload]')
    this.load.json("levelSetting","./src/data/levelSetting.json");
  }

  create() {
    console.log('[create]');

    //Add change scene event listeners
    ChangeScene.addSceneEventListeners(this);

    //AUDIO
    this.backgroundMusic = this.sound.add("creepy");
    this.backgroundMusic.play({loop:true});
    this.shootBeam = this.sound.add("beam");
    this.yell = this.sound.add("diedYell");
    this.cry = this.sound.add("diedCry");
    this.pickupSound = this.sound.add("pickupSound");

    //VARIABLES
    //player
    this.spawnX = 50;
    this.spawnY = 500;
    this.levelName = 1;

    //CREATE LEVEL
    // level Data parse from json
    this.levelSettingInfo = this.cache.json.get('levelSetting');
    this.enemyACount = this.levelSettingInfo.enemyA[this.levelName-1];
    this.enemySCount = this.levelSettingInfo.enemyS[this.levelName-1];
    console.log("populating " + this.enemyALocation + " enemyA");
    console.log("populating " + this.enemySLocation + " enemyS");
    this.enemyALocation = this.levelSettingInfo.coordinates[this.levelName-1].enemyA;
    this.enemySLocation = this.levelSettingInfo.coordinates[this.levelName-1].enemyS;


    //declare map and tilesets
      //addTilesetImage parameters: name of tileset in Tiled, key for tileset in bootscene
      //createStaticLayer parameters: layer name (or index) from Tiled, tileset, x, y
    const map1 = this.make.tilemap({ key: "level1map" });
    const below2Tileset =map1.addTilesetImage("inca_back2", "incaBack2Tiles");
    //const belowTileset = map1.addTilesetImage("inca_back", "incaBackTiles");
    const worldTileset = map1.addTilesetImage("inca_front", "incaFrontTiles");

    //render map/player/enemies in specific order
    const bgLayer = map1.createStaticLayer("Below Player", below2Tileset, 0, 0);
    //const belowLayer = map1.createStaticLayer("Below Player", belowTileset, 0, 0);
    const worldLayer = map1.createStaticLayer("World", worldTileset, 0, 0);
    worldLayer.setCollisionByProperty({ collides: true });
    worldLayer.setTileIndexCallback﻿﻿([27,28], this.hitExit, this);

    /*
    // for collecting item @ dyven
    const itemTiles = this.map.addTilesetImage﻿(imageKey﻿);
    const itemLayer = this.map.createDynamicLayer(dynamicLayerName, itemTiles, 0, 0);
    itemLayer.setTileIndexCallback(tileIndex , this.collectItem, this);
    */

    //diamonds
    this.collectItems = this.add.group();
    this.collectItems.enableBody = true;

    //enemies
    // this.enemies = this.add.group();
    // this.enemies.enableBody = true;
    // var a,s;

    //this.width = map1.widthInPixels;
    //this.height = map1.heightInPixels;
    // for (a = 0; a < this.enemyACount; a++) {
    //   this.enemies.add(this.physics.add.sprite(Phaser.Math.Between(0, this.width),Phaser.Math.Between(0, this.height),'archeologist'));
    // }
    // for (s = 0; s < this.enemySCount; s++) {
    //   this.enemies.add(this.physics.add.sprite(Phaser.Math.Between(0, this.width),Phaser.Math.Between(0, this.height),'soldier'));
    // }

    //player
    this.player = new Mummy({
      scene: this,
      key: "mummyWalk",
      x: this.spawnX,
      y: this.spawnY
    });

    //Enemies
    this.enemy1 = new EnemyArch({
      scene: this,
      key: "archeologist",
      x: 500,
      y: 500
    });

    this.enemy2 = new EnemySoldier({
      scene: this,
      key: "soldier",
      x: 600,
      y: 600,
      //worldLayer: worldLayer
    });

    //const aboveLayer = map1.createStaticLayer("Above Player", worldTileset, 0, 0);

    console.log('created map layers and sprites');

    //player physics/input
    this.player.body.setCollideWorldBounds(true);
    this.cursors = this.input.keyboard.createCursorKeys();

    //enemy physics
    this.enemy1.play("archeologistAnim");
    this.enemy2.play("soldierAnim");
    this.enemy1.body.setCollideWorldBounds(true);
    this.enemy2.body.setCollideWorldBounds(true);
    this.enemy1.setInteractive();
    this.enemy2.setInteractive();

    //world/camera bounds
    this.physics.world.setBounds(0, 0, map1.widthInPixels, map1.heightInPixels);
    this.cameras.main.setBounds(0, 0, map1.widthInPixels, map1.heightInPixels);
    this.cameras.main.startFollow(this.player);

    //configure sprite collisions
    this.boundaryBox = map1.heightInPixels - this.player.body.height;

    this.physics.add.collider(this.player, worldLayer);
    this.physics.add.collider(this.enemy1, worldLayer);
    this.physics.add.collider(this.enemy2, worldLayer);
    this.physics.add.collider(this.collectItems, worldLayer);

    this.physics.add.overlap(
      this.player,
      this.enemy1,
      this.playerRanIntoEnemy,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.enemy2,
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
    this.physics.add.overlap(
      this.enemy2.bullets,
      worldLayer,
      this.enemy2.bulletHitWall,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.collectItems,
      this.pickup,
      null,
      this
    );

    console.log('configured sprites and physics');
    console.log('completed create function');

    // Create timer
    this.startTime = new Date();
    this.endTime = new Date();
    this.duration = this.endTime-this.startTime

    // create score
    this.score = 0;

    // Generate Display text
    this.timerDisplay = this.add.text(10,50, "Timer: "+ this.duration);
    this.ScoreDisplay = this.add.text(10,70, "Score: "+ this.score);
    this.HealthDisplay = this.add.text(10,90, "Health: " + this.player.health);
    this.LifeDisplay = this.add.text(10,110, "Life Left: " + this.player.lives);
    //this.EnemyHealthDisplay = this.add.text(650,50,"Tank Health: "+this.tank.health);

    console.log("completed configurating display")
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
    //this.EnemyHealthDisplay.setText("Tank Health:" + this.tank.health)

    //check for and handle gameOver or levelCompleted
    if (this.gameOver || this.levelCompleted) {
      console.log('end of level triggered');
      console.log('[LEVEL1 ENDING]');

      this.backgroundMusic.stop();
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
            this.enemy1,
            this.player.beamHitEnemy,
            null,
            this
          );
          this.physics.add.overlap(
            b,
            this.enemy2,
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

    //configure overlaps for active enemy bullets
    this.enemy2.bullets.children.each(
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
    );
  }

  hitExit() {
    this.levelCompleted = true;
  }

  pickup(player,item) {
    item.destroy();
    this.player.diamondsCollected++;
    console.log("Now Diamonds count is:" + this.player.diamondsCollected);
    this.pickupSound.play();
  }

  enemyHit﻿(enemy, beam){

    //generate random number of diamonds to burst from dead enemy
    var randAmount = Math.floor(Math.random() * Math.floor(10));
    var x;
    for (x = 0; x < randAmount; x++) {
      var randomShiftX = Math.floor(Math.random() * Math.floor(150)) - 75;

      var randomShiftY = Math.floor(Math.random() * Math.floor(75));

      var diamondX = enemy.x + randomShiftX;
      var diamondY = enemy.y - randomShiftY;
      this.spawnDiamond(diamondX, diamondY);
    }

    //destroy enemy, update player stats
    enemy.destro();
    this.cry.play();
    this.player.enemyKilled++;
    console.log("Now killed count is:" + this.player.enemyKilled);
    
    this.spawnDiamond(enemy.x, enemy.y);

  }

  playerRanIntoEnemy(player, enemy) {
    /*
    function to handle the case of player colliding with an enemy.
    Player loses a life if not attacking, and enemy is always destroyed.
    */

    //generate random number of diamonds to burst from dead enemy
    var randAmount = Math.floor(Math.random() * Math.floor(10));
    var x;
    for (x = 0; x < randAmount; x++) {
      var randomShiftX = Math.floor(Math.random() * Math.floor(150)) - 75;

      var randomShiftY = Math.floor(Math.random() * Math.floor(75));

      var diamondX = enemy.x + randomShiftX;
      var diamondY = enemy.y - randomShiftY;
      this.spawnDiamond(diamondX, diamondY);
    }

    //player takes damage if not attacking when collision occurs
    if (player.isAttacking == false) {
        player.updateHealth(25);  //25 ARBITRARILY CHOSEN FOR NOW
    }

    //destroy enemy, update player stats
    enemy.destro();
    this.cry.play();
    this.enemyKilled++;
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

}
