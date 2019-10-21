/*globals Phaser*/
import * as ChangeScene from './ChangeScene.js';

export default class level1 extends Phaser.Scene {
  constructor () {
    super('level1');
  }

  preload() {
    console.log('\n[LEVEL22222222]');
    console.log('[preload]')
    this.load.json("levelSetting","./src/data/levelSetting.json");
    this.load.image('background1', './assets/images/egyptianbackground.jpg');
  }

  create() {
    console.log('[create]');
    // background image
    this.add.image(2240,384,'background1');
    // Audio
    this.backgroundMusic = this.sound.add("creepy");
    this.backgroundMusic.play({loop:true});
    this.shootBeam = this.sound.add("beam");
    this.yell = this.sound.add("diedYell");
    this.cry = this.sound.add("diedCry");
    this.pickupSound = this.sound.add("pickupSound");

    //Add change scene event listeners
    ChangeScene.addSceneEventListeners(this);

    //SCENE VARIABLES
    //player
    this.spawnX = 50;
    this.spawnY = 500;
    this.player;
    this.cursors;

    this.playerLives = 3;
    this.playerHealth = 100;

    this.playerCanAttack = true;
    this.beamSpeed = 1000;
    this.beamAngle;

    // LevelScene Property
    this.levelName = 1;
    this.diamondsCollected = 0;
    this.enemiesKilled = 0;
    this.gameOver = false;
    this.levelCompleted = false;

    // level Data parse from json
    this.levelSettingInfo = this.cache.json.get('levelSetting');
    this.enemyACount = this.levelSettingInfo.enemyA[this.levelName];
    this.enemySCount = this.levelSettingInfo.enemyS[this.levelName];
    console.log("populating " + this.enemyACount + " enemyA");
    console.log("populating " + this.enemySCount + " enemyS");

    //CREATE LEVEL
    //declare map and tilesets
      //addTilesetImage parameters: name of tileset in Tiled, key for tileset in bootscene
      //createStaticLayer parameters: layer name (or index) from Tiled, tileset, x, y
    const map1 = this.make.tilemap({ key: "level1map" });
    const worldTileset = map1.addTilesetImage("inca_front", "incaFrontTiles");
    this.weight = map1.widthInPixels;
    this.height = map1.heightInPixels;

    //render map/player/enemies in specific order
    const worldLayer = map1.createStaticLayer("World", worldTileset, 0, 0);
    worldLayer.setCollisionByProperty({ collides: true });
    worldLayer.setTileIndexCallback﻿﻿([27,28], this.hitExit, this);

/* // for collecting item @ dyven
    const itemTiles = this.map.addTilesetImage﻿(imageKey﻿);
    const itemLayer = this.map.createDynamicLayer(dynamicLayerName, itemTiles, 0, 0);
    itemLayer.setTileIndexCallback(tileIndex , this.collectItem, this);
*/

    // Diamond
    this.collectItems = this.add.group();
    this.collectItems.enableBody = true;
    // enemy
    this.enemies = this.add.group();
    this.enemies.enableBody = true;
    var a,s;
    for (a = 0; a < this.enemyACount; a++) {
      this.enemies.add(this.physics.add.sprite(Phaser.Math.Between(0, this.weight),Phaser.Math.Between(0, this.height),'archeologist'));
    }
    for (s = 0; s < this.enemySCount; s++) {
      this.enemies.add(this.physics.add.sprite(Phaser.Math.Between(0, this.weight),Phaser.Math.Between(0, this.height),'soldier'));
    }

    // player
    this.player = this.physics.add.sprite(this.spawnX, this.spawnY, "mummyWalk");

    const aboveLayer = map1.createStaticLayer("Above Player", worldTileset, 0, 0);
    console.log('created map layers and sprites');

    //player physics/input
    this.player.body.setSize(40, 64, 50, 50);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.cursors = this.input.keyboard.createCursorKeys();

    //long range attacks
    this.beams = this.physics.add.group({
      defaultKey: "mummyBeam",
      allowGravity: false
    });

    //world/camera bounds
    this.physics.world.setBounds(0, 0, map1.widthInPixels, map1.heightInPixels);
    this.cameras.main.setBounds(0, 0, map1.widthInPixels, map1.heightInPixels);
    this.cameras.main.startFollow(this.player);

    //configure sprite collisions
    this.boundaryBox = map1.heightInPixels - this.player.body.height;
    this.physics.add.overlap(this.player,this.collectItems,this.pickup,null,this);
    this.physics.add.collider(this.player, worldLayer);
    this.physics.add.collider(this.enemies, worldLayer);
    this.physics.add.collider(this.enemies, this.player);
    this.physics.add.collider(this.collectItems, worldLayer);

    console.log('configured sprites and physics');
    console.log('completed create function');


  }

  update() {

    //check for and handle gameOver or levelCompleted
    if (this.gameOver || this.levelCompleted) {
      console.log('end of level triggered');
      console.log('[LEVEL1 ENDING]');

      this.scene.start('gameOverScene', {
        level: this.levelName,
        diamond: this.diamondsCollected,
        killed: this.enemiesKilled,
        done: this.levelCompleted
      });
      return;
    }

    //player motion
    this.playerMove();
    //check if player on map
    this.playerFellOffMap(this.player);
    //enemy motion
    this.enemies.getChildren().forEach(function(enemy) {
      enemy.speed = Math.random() * 2 + 1;
    }, this);
  }

  hitExit(){
    this.levelCompleted = true;
  }

  pickup(player,item){
    item.destroy();
    this.diamondsCollected++;
    console.log("Now Diamonds count is:" + this.diamondsCollected);
    this.pickupSound.play();
  }
  //PLAYER HELPER FUNCTIONS
  resetPlayer(){
    /*
    function to restore player sprite defaults after a change in tint,
    canAttack, or being disable after taking damage.
    */
    console.log('[resetPlayer]');
    this.player.setTint();
    this.playerCanAttack = true;
    var x = this.player.x;
    var y = this.player.y
    this.player.enableBody(true, x, y, true, true);
  }

  updatePlayerHealth(damage) {
    /*
    function to subtract damage from player health,
    take away a life if health reaches 0,
    and update gameOver status based on that
    */
    console.log('[updatePlayerHealth]');

    //give damage to player health
    this.player.setTint(0xff0000);
    this.playerCanAttack = false;
    this.playerHealth -= damage
    console.log('player health: ' + this.playerHealth);

    //update player lives if needed
    if (this.playerHealth <= 0) {
      this.playerLives -= 1;
      console.log('player lives: ' + this.playerLives);
      this.playerHealth = 100;

      //initiate gameOver if needed
      if (this.playerLives == 0) {
        console.log('gameOver: ' + this.gameOver);
        this.physics.pause();
        this.gameOver = true;
      }
    }
  }

  playerMove() {
    //handle keyboard inputs
    if (this.cursors.left.isDown) {
      this.player.flipX = true;
      this.player.setVelocityX(-160);
      this.player.anims.play("mummyWalkAnim", true);

      this.beamAngle = Phaser.ANGLE_LEFT;
      this.beamSpeed = -1000;

    } else if (this.cursors.right.isDown) {
      this.player.flipX = false;
      this.player.setVelocityX(160);
      this.player.anims.play("mummyWalkAnim", true);

      this.beamAngle = Phaser.ANGLE_RIGHT;
      this.beamSpeed = 1000;

    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("mummyIdleAnim", true);
    }
    if (this.cursors.up.isDown && this.player.body.onFloor())  {
      //only jumps if sprite body is on ground
      this.player.setVelocityY(-330);
    }

    //player long range attack
    if (this.cursors.space.isDown && this.playerCanAttack) {
      this.playerShoot();
    }
  }

  playerShoot() {
    /*
    function to define behavior of player shooting long range attacks
    */
    console.log('[playerShoot]');

    //temporarily disable more attacks
    this.playerCanAttack = false;

    //generate a beam attack sprite
    var beam = this.beams.get();
    beam.setAngle(this.beamAngle);
    beam
      .enableBody(true, this.player.x, this.player.y, true, true)
      .setVelocity(this.beamSpeed, 0)
      .setScale(2.5);

    // AUDIO
    this.shootBeam.play({volume: 1});

    this.physics.add.overlap(this.enemies, beam, this.enemyHit﻿, null, this);﻿

    //enable player attacks again after a delay
    this.time.addEvent({
      delay: 500,
      callback: this.resetPlayer,
      callbackScope: this,
      loop: false
    });
  }

  enemyHit﻿(enemy, beam){
    this.spwanDiamond(enemy.x,enemy.y);
    enemy.destroy();
    this.cry.play();
    this.enemyKilled++;
  }

  spwanDiamond(diamondX,diamondY){
    this.collectItems.add(this.physics.add.sprite(diamondX,diamondY,"gem"));
  }

  playerFellOffMap(player) {
    /*
    function to handle player colliding with bottom world bound
    */
    //console.log(this.boundaryBox);
    //console.log(player.y);

    if (player.y > this.boundaryBox) {
      this.player.x = this.spawnX;
      this.player.y = this.spawnY;
      this.updatePlayerHealth(100);
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
