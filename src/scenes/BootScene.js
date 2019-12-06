/*global Phaser*/
export default class BootScene extends Phaser.Scene {
  constructor () {
    super('Boot');
  }

  preload () {
    console.log('\n[BOOTSCENE]');
    console.log('[preload]');

    this.loadingTxt = this.add.text(300, 400, "Loading game...",{
      fontFamily: 'Arial',
      fontSize: 30,
      color: '#FFFFFF'});

    //LOAD LEVEL ASSETS
    //tile sets
    this.load.image("incaBackTiles", "../assets/tilesets/inca_back.png");
    this.load.image("incaFrontTiles", "../assets/tilesets/inca_front.png");
    this.load.image("incaBack2Tiles", "../assets/tilesets/inca_back2.png");
    this.load.image("sandTiles", "../assets/tilesets/sand_tiles.png");

    //tile maps
    this.load.tilemapTiledJSON("level0map", "../assets/tilemaps/tutorialMap.json");
    this.load.tilemapTiledJSON("level1map", "../assets/tilemaps/level1map.json");
    this.load.tilemapTiledJSON("level2map", "../assets/tilemaps/level2map.json");
    this.load.tilemapTiledJSON("level3map", "../assets/tilemaps/level3map.json");
    this.load.tilemapTiledJSON("level4map", "../assets/tilemaps/level4map.json");
    this.load.tilemapTiledJSON("level5map", "../assets/tilemaps/level5map.json");
    this.load.tilemapTiledJSON("level6map", "../assets/tilemaps/level6map.json");
    this.load.tilemapTiledJSON("level7map", "../assets/tilemaps/level7map.json");
    this.load.tilemapTiledJSON("level8map", "../assets/tilemaps/finalBossMap.json");

    //items
    this.load.image("gem", "../assets/sprites/gem.png");
    this.load.image("cane", "../assets/sprites/cane.png");
    this.load.image("scroll", "../assets/sprites/Scroll.png");
    this.load.image("arrow", "../assets/sprites/arrow.png");
    this.load.image("mask", "../assets/sprites/mask.png");
    this.load.image("exit", "../assets/images/exit.png");

    this.load.image("bullet", "../assets/sprites/bullet.png");
    this.load.image("shell", "../assets/sprites/shell.png");
    this.load.image("bomb", "../assets/sprites/bomb.png");

    this.load.image("healthBarFrame","../assets/images/healthbarframe.png");
    this.load.image("healthBarFill","../assets/images/healthbarfill.png");
    this.load.image("heart","../assets/images/lifeHeart.png");

    this.load.image('bossbackground', './assets/images/bossbackground.jpg');
    this.load.image('background1', './assets/images/egyptianbackground.jpg');

    this.load.image("manaFill", "../assets/images/manaBarFilled.png");
    this.load.image("manaFrame", "../assets/images/manaBarFrame.png");
    this.load.image("scroll_BG", "../assets/images/Scroll_1.png");


    console.log('loaded level assets');

    //LOAD SPRITESHEET ASSETS
    //ASSETS
    this.load.spritesheet("chest", "../assets/spriteSheets/chest.png", {
      frameWidth: 48,
      frameHeight: 32
    });

    //PLAYER (mummy)
    //walking/idle
    this.load.spritesheet("mummyIdle", "../assets/spriteSheets/mummy_idle.png", {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet("mummyWalk", "../assets/spriteSheets/mummy_walk.png", {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet("mummyCaneIdle", "../assets/spriteSheets/mummyCane_idle.png", {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet("mummyCaneWalk", "../assets/spriteSheets/mummyCane_walk.png", {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet("pharoahCaneIdle", "../assets/spriteSheets/mummyMask_idle.png", {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet("pharoahCaneWalk", "../assets/spriteSheets/mummyMaskWalk.png", {
      frameWidth: 64,
      frameHeight: 64
    });

    //attacks
    this.load.spritesheet("mummyBeam", "../assets/spriteSheets/beam.png", {
      frameWidth: 28,
      frameHeight: 7
    });
    this.load.spritesheet("mummyCane", "../assets/spriteSheets/mummyCane_melee.png", {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet("pharoahCane", "../assets/spriteSheets/mummyMask_melee.png", {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet("mummyRangeCane", "../assets/spriteSheets/mummyCane_beam.png", {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet("pharoahRangeCane", "../assets/spriteSheets/mummyMask_beam.png", {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet("caneHitbox", "../assets/spriteSheets/cane_hitbox.png", {
      frameWidth: 64,
      frameHeight: 64
    });

    //enemies
    this.load.spritesheet("archeologist", "../assets/spriteSheets/arch_walk.png", {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet("soldier", "../assets/spriteSheets/soldier_walk.png", {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet("soldierShot", "../assets/spriteSheets/soldier_shot.png", {
      frameWidth: 96,
      frameHeight: 64
    });
    this.load.spritesheet("gunner", "../assets/spriteSheets/gunner_walk.png", {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet("gunnerShot", "../assets/spriteSheets/gunner_shot.png", {
      frameWidth: 96,
      frameHeight: 64
    });

    //final boss (tank)
    this.load.spritesheet("tankBase", "../assets/spriteSheets/tankBase.png", {
      frameWidth: 192,
      frameHeight: 64
    });
    this.load.spritesheet("tankTurret", "../assets/spriteSheets/tankTurret.png", {
      frameWidth: 128,
      frameHeight: 30
    });
    this.load.spritesheet("tankTurretHigh", "../assets/spriteSheets/tankTurretHigh.png", {
      frameWidth: 112,
      frameHeight: 64
    });

    console.log('loaded spritesheet assets');

    //LOAD AUDIO ASSETS
    this.load.audio('bg', './assets/sounds/background.mp3');
    this.load.audio('bg1', './assets/sounds/background1.mp3');
    this.load.audio('bg2', './assets/sounds/background2.mp3');
    this.load.audio('bg3', './assets/sounds/background3.mp3')
    this.load.audio('beam', './assets/sounds/beam.mp3');
    this.load.audio('pops', './assets/sounds/buttonPops.mp3');
    this.load.audio('mummyDied', './assets/sounds/dyingSound_1.1.mp3');
    this.load.audio('enemyDied', './assets/sounds/dyingSound_2.1.mp3');
    this.load.audio('bomb', './assets/sounds/explosion.mp3');
    this.load.audio('HE', './assets/sounds/happyEndingPlay.mp3');
    this.load.audio('meleeAttack', './assets/sounds/meleeAttack.mp3');
    this.load.audio('pickupSound', './assets/sounds/pickup.mp3');
    console.log('loaded audio assets');
  }

  create (data) {
    console.log('[create]');

    //CREATE SPRITE ANIMATIONS
    this.anims.create({
      key: "chestOpen",
      frames: this.anims.generateFrameNumbers("chest"),
      frameRate: 3,
      repeat: 0
    });
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
    //with cane
    this.anims.create({
      key: "mummyCaneIdleAnim",
      frames: this.anims.generateFrameNumbers("mummyCaneIdle"),
      frameRate: 4,
      repeat: -1
    });
    this.anims.create({
      key: "mummyCaneWalkAnim",
      frames: this.anims.generateFrameNumbers("mummyCaneWalk"),
      frameRate: 10,
      repeat: -1
    });
    //with pharaoh mask
    this.anims.create({
      key: "pharoahCaneIdleAnim",
      frames: this.anims.generateFrameNumbers("pharoahCaneIdle"),
      frameRate: 4,
      repeat: -1
    });
    this.anims.create({
      key: "pharoahCaneWalkAnim",
      frames: this.anims.generateFrameNumbers("pharoahCaneWalk"),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "mummyCaneAnim",
      frames: this.anims.generateFrameNumbers("mummyCane"),
      frameRate: 10,
      repeat: 0
    });
    this.anims.create({
      key: "pharoahCaneAnim",
      frames: this.anims.generateFrameNumbers("pharoahCane"),
      frameRate: 10,
      repeat: 0
    });
    this.anims.create({
      key: "mummyRangeCaneAnim",
      frames: this.anims.generateFrameNumbers("mummyRangeCane", {start: 0, end: 6}),
      frameRate: 10,
      repeat: 0
    });
    this.anims.create({
      key: "pharoahRangeCaneAnim",
      frames: this.anims.generateFrameNumbers("pharoahRangeCane", {start: 0, end: 6}),
      frameRate: 10,
      repeat: 0
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
    this.anims.create({
      key: "soldierShotAnim",
      frames: this.anims.generateFrameNumbers("soldierShot"),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "gunnerAnim",
      frames: this.anims.generateFrameNumbers("gunner"),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "gunnerShotAnim",
      frames: this.anims.generateFrameNumbers("gunnerShot"),
      frameRate: 10,
      repeat: -1
    });

    //final boss (tank)
    this.anims.create({
      key: "tankMove",
      frames: this.anims.generateFrameNumbers("tankBase"),
      frameRate: 4,
      repeat: -1
    });
    this.anims.create({
      key: "tankAttack",
      frames: this.anims.generateFrameNumbers("tankTurret"),
      frameRate: 10,
      repeat: 0
    });

    this.anims.create({
      key: "raiseTurret",
      frames: this.anims.generateFrameNumbers("tankTurretHigh", {
        start: 0,
        end: 3
      }),
      frameRate: 4,
      repeat: 0
    });
    this.anims.create({
      key: "lowerTurret",
      frames: this.anims.generateFrameNumbers("tankTurretHigh", {
        start: 7,
        end: 9
      }),
      frameRate: 4,
      repeat: 0
    });

    this.anims.create({
      key: "tankAttackHigh",
      frames: this.anims.generateFrameNumbers("tankTurretHigh", {
        start: 4,
        end: 7
      }),
      frameRate: 10,
      repeat: 0
    });
    console.log('created spritesheet animations');


    console.log('[BOOTSCENE COMPLETE]');
    this.scene.start("menu");
  }

  update (time, delta) {

  }
}
