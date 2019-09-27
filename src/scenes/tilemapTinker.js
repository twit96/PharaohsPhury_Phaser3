/*globals Phaser*/
import * as ChangeScene from './ChangeScene.js';
import Player from "./player.js";
import EnemyBasic from "./enemyBasic.js";
export default class Scene5 extends Phaser.Scene {
  constructor () {
    super('TilemapTinker');
  }

  preload() {
    this.load.image("sky", "./assets/sprites/sky.png");
    this.load.image("ground", "./assets/sprites/platform.png");
    this.load.image("star", "./assets/sprites/star.png");
    this.load.image("bomb", "./assets/sprites/bomb.png");
    this.load.spritesheet("dude", "./assets/sprites/dude.png", {
      frameWidth: 32,
      frameHeight: 48
    });

    this.load.image('inca_front', '../assets/tilesets/inca_front.png');
    this.load.tilemapTiledJSON("map", "../assets/tilemaps/map1.json");

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create() {

    //load level
    var map = this.make.tilemap({ key: 'map' });
    var tileset = map.addTilesetImage('inca_front');
    var layer = map.createDynamicLayer(0, tileset, 0, 0);

    // The exit tile id is 26, and 27
    var exitDoor = map.Tileset.getTileCollisionGroup(26);
    var exitDoor.setCollisionByProperty({ collides: true });
    console.log(exitDoor)
    this.completedLevel = Matter.SAT.collides(this.player, exitDoor);

    // Set colliding tiles before converting the layer to Matter bodies!
    map.setCollisionByExclusion([ -1, 0 ]);

    this.matter.world.convertTilemapLayer(layer);
    this.matter.world.setBounds(map.widthInPixels, map.heightInPixels);

    //place player
    this.player = new Player(this, 100, 280);

    // Smoothly follow the player
    this.cameras.main.startFollow(this.player.sprite, false, 0.5, 0.5);

    //place enemy
    this.player = new EnemyBasic(this, 1000, 280);
}

  update() {
    if (this.gameOver) {
      this.scene.start('GameOverScene', { score: this.score });
      return;
    }

    if this.completedLevel {
      this.scene.start('endScene', { level: 0 ,
      diamond: 0, killed : 0,
      done: false});
    }

  }

}
