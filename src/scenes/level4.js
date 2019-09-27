/*globals Phaser*/
import * as ChangeScene from './ChangeScene.js';
import Player from "./player.js";
import EnemyBasic from "./enemyBasic.js";
export default class TilemapTinker extends Phaser.Scene {
  constructor () {
    super('level4');
  }

  preload() {
    this.load.spritesheet("dude", "./assets/sprites/dude.png", {
      frameWidth: 32,
      frameHeight: 48
    });
    this.load.spritesheet('longRangeAttack', './assets/spritesheets/beam.png', {
      frameWidth: 16,
      frameHeight: 16
    });

    this.load.image('inca_front', '../assets/tilesets/inca_front.png');
    this.load.tilemapTiledJSON("map4", "../assets/tilemaps/map4.json");

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;

  }

  create() {
    //Add event listeners
    ChangeScene.addSceneEventListeners(this);

    //load level
    var map = this.make.tilemap({ key: 'map4' });
    var tileset = map.addTilesetImage('inca_front');
    var layer = map.createDynamicLayer(0, tileset, 0, 0);

    // Set colliding tiles before converting the layer to Matter bodies!
    map.setCollisionByExclusion([ -1, 0 ]);

    this.matter.world.convertTilemapLayer(layer);
    this.cameras.main.setBounds(0, 0, 4500, 525);
    this.matter.world.setBounds(0, 0, 4500, 525);

    //place player
    this.player = new Player(this, 100, 280);

    // Smoothly follow the player
   this.cameras.main.startFollow(this.player.sprite, false, 0.5, 0.5);

   //place enemy
   this.enemy1 = new EnemyBasic(this, 1000, 280);
   this.enemy2 = new EnemyBasic(this, 2000, 280);
   this.enemy3 = new EnemyBasic(this, 3500, 280);



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

    if (this.player.y > this.matter.world.height) { // do not work
      this.gameOver = true;
    }

    if (this.gameOver) { // should work
      this.scene.start('endScene', { level: this.levelNum ,
      diamond: this.diamondCollected, kiiled : this.enemyKilled,
      done: this.isCompleted});
      return;
    }

  }

}
