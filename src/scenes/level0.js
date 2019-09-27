/*globals Phaser*/
import * as ChangeScene from './ChangeScene.js';
import Player from "./player.js";
import EnemyBasic from "./enemyBasic.js";
export default class level0 extends Phaser.Scene {
  constructor () {
    super('level0');
  }

  preload() {
    const { Engine, Render, World, Bodies, Body, Events } = Phaser.Physics.Matter.Matter;
    this.load.spritesheet("dude", "./assets/sprites/dude.png", {
      frameWidth: 32,
      frameHeight: 48
    });
    this.load.spritesheet('longRangeAttack', './assets/spritesheets/beam.png', {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.image('inca_front', '../assets/tilesets/inca_front.png');
    this.load.tilemapTiledJSON("map", "../assets/tilemaps/map1.json");

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create() {
    //Add event listeners
    ChangeScene.addSceneEventListeners(this);

    this.levelNum = 0;
    this.killedCount = 0;
    this.completedLevel = false;

    //load level
    var map0 = this.make.tilemap({ key: 'map' });
    var tileset0 = map0.addTilesetImage('inca_front');
    var layer0 = map0.createDynamicLayer(0, tileset0, 0, 0);

    // Set colliding tiles before converting the layer to Matter bodies!
    map0.setCollisionByExclusion([ -1, 0, 27, 28]);

    // The exit tile id is 27, and 28;
    var setCompletedLevel = { emitBlock: function() { console.log("haha") } };
    layer0 = map0.setTileIndexCallback([7],setCompletedLevel.emitBlock);

    this.matter.world.convertTilemapLayer(layer0);
    //this.matter.world.setBounds(map.widthInPixels, map.heightInPixels);
    this.cameras.main.setBounds(0, 0, 4500, 525);
    this.matter.world.setBounds(0, 0, 4500, 525);

    //place player
    this.player = new Player(this, 100, 280);

    // Smoothly follow the player
    this.cameras.main.startFollow(this.player.sprite, false, 0.5, 0.5);

    //place enemy
    this.enemy1 = new EnemyBasic(this, 1000, 280);
    this.enemy2 = new EnemyBasic(this, 2000, 280);
    this.enemy3 = new EnemyBasic(this, 3000, 280);



    this.matterCollision.addOnCollideStart({
      objectA: [ this.player.sensors.left, this.player.sensors.right],
      objectB: this.enemy1.sprite,
      callback: eventData => {
        console.log("Player hit an enemy");
      this.enemy1.destroy();
      this.killedCount ++ ;
      // eventData.gameObjectB will be the specific enemy that was hit
      }
    });

    this.matterCollision.addOnCollideStart({
      objectA: [ this.player.sensors.left, this.player.sensors.right],
      objectB: this.enemy2.sprite,
      callback: eventData => {
        console.log("Player hit an enemy");
      this.enemy2.destroy();
      this.killedCount ++ ;
      // eventData.gameObjectB will be the specific enemy that was hit
      }
    });

    this.matterCollision.addOnCollideStart({
      objectA: [ this.player.sensors.left, this.player.sensors.right],
      objectB: this.enemy3.sprite,
      callback: eventData => {
        console.log("Player hit an enemy");
      this.enemy3.destroy();
      this.killedCount ++ ;
      // eventData.gameObjectB will be the specific enemy that was hit
      }
    });
  }

  update() {
    if (this.player.gameOver) {
      this.player.isStatic = true;

      this.scene.start('gameOverScene', { level: this.levelNum ,
      diamond: 0, kiiled : this.killedCount,
      done: this.completedLevel});
      return;
    }

    //console.log(this.completedLevel);
    if (this.completedLevel) {
        this.scene.start('gameOverScene', { level: this.levelNum ,
        diamond: 0, kiiled : this.killedCount,
        done: this.completedLevel});
    }
  }
}
