/*globals Phaser*/
import Player from "./player.js";
import EnemyBasic from "./enemyBasic.js";
export default class finalBossLevel extends Phaser.Scene {
  constructor () {
    super('finalBossLevel');
  }

  preload() {
    //scene assets
    this.load.image('sky', './assets/sprites/sky.png');
    this.load.image('inca_front', '../assets/tilesets/inca_front.png');
    this.load.tilemapTiledJSON("bossMap", "../assets/tilemaps/finalBossLevel.json");

    //player assets
    this.load.spritesheet('player', './assets/spritesheets/mummy.png', {
      frameWidth: 32,
      frameHeight: 48
    });
    this.load.spritesheet("attackLR", "assets/spritesheets/longRangeAttack.png",{
      frameWidth: 16,
      frameHeight: 16
    });

    //boss (tank) assets
    this.load.image('base', './assets/sprites/tankBase.png');
    this.load.image('turret', './assets/sprites/tankTurret.png');
    this.load.image('bomb', './assets/sprites/bomb.png');
    this.load.spritesheet("explosion", "assets/spritesheets/explosion.png",{
      frameWidth: 16,
      frameHeight: 16
    });

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create() {
    //scene background
    //this.add.image(400, 300, 'sky');

    this.levelNum = 10;
    this.completedLevel = false;

    //scene map
    var map = this.make.tilemap({ key: 'bossMap' });
    var tileset = map.addTilesetImage('inca_front');
    var layer = map.createDynamicLayer(0, tileset, 0, 0);

    // Set colliding tiles before converting the layer to Matter bodies!
    map.setCollisionByExclusion([ -1, 0, 27, 28]);

    // The exit tile id is 27, and 28;
    var setCompletedLevel = { emitBlock: function() { console.log("haha") } };
    layer = map.setTileIndexCallback([7],setCompletedLevel.emitBlock);

    this.matter.world.convertTilemapLayer(layer);
    //this.matter.world.setBounds(map.widthInPixels, map.heightInPixels);
    this.cameras.main.setBounds(0, 0, 960, 480);
    this.matter.world.setBounds(0, 0, 960, 480);

    //place player
    this.player = new Player(this, 100, 50);

  }

  update() {
    if (this.player.gameOver) {
      this.player.isStatic = true;
    }

    //console.log(this.completedLevel);
    if (this.completedLevel) {
    }
  }

}
