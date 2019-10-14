/*global Phaser*/
export default class BootScene extends Phaser.Scene {
  constructor () {
    super('Boot');
  }

  preload () {
    console.log('\n[BOOTSCENE]');
    console.log('[preload]');
    this.load.image('title', './assets/images/gametitle.png');



    //LOAD LEVEL ASSETS
    //tile maps
    this.load.image("incaBackTiles", "../assets/tilesets/inca_back.png");
    this.load.image("incaFrontTiles", "../assets/tilesets/inca_front.png");

    this.load.tilemapTiledJSON("level1map", "../assets/tilemaps/level1map.json");
    this.load.tilemapTiledJSON("level2map", "../assets/tilemaps/level2map.json");
    this.load.tilemapTiledJSON("level3map", "../assets/tilemaps/level3map.json");
    this.load.tilemapTiledJSON("level4map", "../assets/tilemaps/level4map.json");
    this.load.tilemapTiledJSON("level5map", "../assets/tilemaps/level5map.json");
    this.load.tilemapTiledJSON("level6map", "../assets/tilemaps/level6map.json");
    this.load.tilemapTiledJSON("level7map", "../assets/tilemaps/level7map.json");
    this.load.tilemapTiledJSON("finalBossMap", "../assets/tilemaps/finalBossMap.json");

    //items
    this.load.image("gem", "../assets/sprites/gem.png");
    this.load.image("cane", "../assets/sprites/mummyCane.png");

    this.load.image("bullet", "../assets/sprites/soldierBullet.png");
    this.load.image("shell", "../assets/sprites/bomb.png");
    console.log('loaded level assets');

    //LOAD SPRITESHEET ASSETS
    //levelPicker
    this.load.spritesheet('buttons', './assets/spriteSheets/buttons.png', {
      frameHeight: 100,
      frameWidth: 200
    });

    //player (mummy)
    this.load.spritesheet("mummyIdle", "../assets/spriteSheets/MummyIdle.png", {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet("mummyWalk", "../assets/spriteSheets/MummyWalk.png", {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet("mummyBeam", "../assets/spriteSheets/mummyBeam.png", {
      frameWidth: 44,
      frameHeight: 48
    });

    //enemies
    this.load.spritesheet("archeologist", "../assets/spriteSheets/archeologist.png", {
      frameWidth: 40.66666667,
      frameHeight: 80
    });
    this.load.spritesheet("soldier", "../assets/spriteSheets/britishSoldier.png", {
      frameWidth: 40.66666667,
      frameHeight: 80
    });

    //final boss (tank)
    this.load.spritesheet("tankMove", "../assets/spriteSheets/tankMove.png", {
      frameWidth: 201,
      frameHeight: 140
    });
    this.load.spritesheet("tankAttack", "../assets/spriteSheets/tankAttack.png", {
      frameWidth: 197,
      frameHeight: 136
    });
    this.load.spritesheet("tankAttackHigh", "../assets/spriteSheets/tankAttackHigh.png", {
      frameWidth: 196.4,
      frameHeight: 136
    });
    this.load.spritesheet("explosion", "../assets/spriteSheets/tankAttackHigh.png", {
      frameWidth: 16,
      frameHeight: 16
    });
    console.log('loaded spritesheet assets');

    //LOAD AUDIO ASSETS
    this.load.audio('beam', './assets/sounds/beam.mp3');
    this.load.audio('pops', './assets/sounds/buttonPops.mp3');
    this.load.audio('creepy', './assets/sounds/creepy.mp3');
    this.load.audio('diedCry', './assets/sounds/dyingSound_1.mp3');
    this.load.audio('diedYell', './assets/sounds/dyingSound_2.mp3');
    this.load.audio('bomb', './assets/sounds/explosion.mp3');
    this.load.audio('HE', './assets/sounds/HappyEndingPlay.mp3');
    this.load.audio('pickupSound', './assets/sounds/pickup.mp3');
    this.load.audio('short', './assets/sounds/short.mp3');
    this.load.audio('platformerSound', './assets/sounds/typicalPlatformer.mp3');
    console.log('loaded audio assets');
  }

  create (data) {
    console.log('[create]');

    var titleImage = this.add.image(470,120, "title").setScale(.5,.5);

    this.loadingTxt = this.add.text(380, 400, "Loading game...",{
      fontFamily: 'Arial',
      fontSize: 52,
      color: '#FFFFFF'});

    //CREATE SPRITE ANIMATIONS
    //player (mummy)
    this.anims.create({
      key: "mummyIdleAnim",
      frames: this.anims.generateFrameNumbers("mummyIdle"),
      frameRate: 4,
      repeat: -1
    });
    this.anims.create({
      key: "mummyWalkAnim",
      frames: this.anims.generateFrameNumbers("mummyWalk"),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "mummyBeamAnim",
      frames: this.anims.generateFrameNumbers("mummyBeam"),
      frameRate: 10,
      repeat: 0
    });

    //enemies
    this.anims.create({
      key: "archeologistAnim",
      frames: this.anims.generateFrameNumbers("archeologist"),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "soldierAnim",
      frames: this.anims.generateFrameNumbers("soldier"),
      frameRate: 10,
      repeat: -1
    });

    //final boss (tank)
    this.anims.create({
      key: "tankMove",
      frames: this.anims.generateFrameNumbers("tankMove"),
      frameRate: 4,
      repeat: -1
    });
    this.anims.create({
      key: "tankAttack",
      frames: this.anims.generateFrameNumbers("tankAttack"),
      frameRate: 4,
      repeat: -1
    });
    this.anims.create({
      key: "tankAttackHigh",
      frames: this.anims.generateFrameNumbers("tankAttackHigh"),
      frameRate: 4,
      repeat: -1
    });
    this.anims.create({
      key: "explode",
      frames: this.anims.generateFrameNumbers("explosion"),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true
    });
    console.log('created spritesheet animations');


    console.log('[BOOTSCENE COMPLETE]');
    this.scene.start("menu");
  }

  update (time, delta) {
    // Update the scene
    this.loadingTxt.text = "Loading game.." + ".";
  }
}
