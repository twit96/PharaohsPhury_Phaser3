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
    this.load.image("incaBackTiles", "../../PharaohsPhury_Phaser3/assets/tilesets/inca_back.png");
    this.load.image("incaFrontTiles", "../../PharaohsPhury_Phaser3/assets/tilesets/inca_front.png");
    this.load.image("incaBack2Tiles", "../../PharaohsPhury_Phaser3/assets/tilesets/inca_back2.png");
    this.load.image("sandTiles", "../../PharaohsPhury_Phaser3/assets/tilesets/sand_tiles.png");

    //tile maps
    this.load.tilemapTiledJSON("level0map", "../../PharaohsPhury_Phaser3/assets/tilemaps/tutorialMap.json");
    this.load.tilemapTiledJSON("level1map", "../../PharaohsPhury_Phaser3/assets/tilemaps/level1map.json");
    this.load.tilemapTiledJSON("level2map", "../../PharaohsPhury_Phaser3/assets/tilemaps/level2map.json");
    this.load.tilemapTiledJSON("level3map", "../../PharaohsPhury_Phaser3/assets/tilemaps/level3map.json");
    this.load.tilemapTiledJSON("level4map", "../../PharaohsPhury_Phaser3/assets/tilemaps/level4map.json");
    this.load.tilemapTiledJSON("level5map", "../../PharaohsPhury_Phaser3/assets/tilemaps/level5map.json");
    this.load.tilemapTiledJSON("level6map", "../../PharaohsPhury_Phaser3/assets/tilemaps/level6map.json");
    this.load.tilemapTiledJSON("level7map", "../../PharaohsPhury_Phaser3/assets/tilemaps/level7map.json");
    this.load.tilemapTiledJSON("level8map", "../../PharaohsPhury_Phaser3/assets/tilemaps/finalBossMap.json");

    //items
    this.load.image("gem", "../../PharaohsPhury_Phaser3/assets/sprites/gem.png");
    this.load.image("cane", "../../PharaohsPhury_Phaser3/assets/sprites/cane.png");
    this.load.image("scroll", "../../PharaohsPhury_Phaser3/assets/sprites/Scroll.png");
    this.load.image("arrow", "../../PharaohsPhury_Phaser3/assets/sprites/Arrow.png");
    this.load.image("mask", "../../PharaohsPhury_Phaser3/assets/sprites/mask.png");
    this.load.image("exit", "../../PharaohsPhury_Phaser3/assets/images/exit.png");

    this.load.image("bullet", "../../PharaohsPhury_Phaser3/assets/sprites/bullet.png");
    this.load.image("shell", "../../PharaohsPhury_Phaser3/assets/sprites/shell.png");
    this.load.image("bomb", "../../PharaohsPhury_Phaser3/assets/sprites/bomb.png");

    this.load.image("healthBarFrame","../../PharaohsPhury_Phaser3/assets/images/healthBarFrame.png");
    this.load.image("healthBarFill","../../PharaohsPhury_Phaser3/assets/images/healthBarFill.png");
    this.load.image("heart","../../PharaohsPhury_Phaser3/assets/images/lifeHeart.png");

    this.load.image('bossbackground', '../../PharaohsPhury_Phaser3/assets/images/bossbackground.jpg');
    this.load.image('background1', '../../PharaohsPhury_Phaser3/assets/images/egyptianbackground.jpg');

    this.load.image("manaFill", "../../PharaohsPhury_Phaser3/assets/images/manaBarFilled.png");
    this.load.image("manaFrame", "../../PharaohsPhury_Phaser3/assets/images/manaBarFrame.png");
    this.load.image("scroll_BG", "../../PharaohsPhury_Phaser3/assets/images/Scroll_1.png");


    console.log('loaded level assets');

    //LOAD SPRITESHEET ASSETS
    //ASSETS
    this.load.spritesheet("chest", "../../PharaohsPhury_Phaser3/assets/spriteSheets/chest.png", {
      frameWidth: 48,
      frameHeight: 32
    });

    //PLAYER (mummy)
    //walking/idle
    this.load.spritesheet("mummyIdle", "../../PharaohsPhury_Phaser3/assets/spriteSheets/mummy_idle.png", {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet("mummyWalk", "../../PharaohsPhury_Phaser3/assets/spriteSheets/mummy_walk.png", {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet("mummyCaneIdle", "../../PharaohsPhury_Phaser3/assets/spriteSheets/mummyCane_idle.png", {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet("mummyCaneWalk", "../../PharaohsPhury_Phaser3/assets/spriteSheets/mummyCane_walk.png", {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet("pharoahCaneIdle", "../../PharaohsPhury_Phaser3/assets/spriteSheets/mummyMask_idle.png", {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet("pharoahCaneWalk", "../../PharaohsPhury_Phaser3/assets/spriteSheets/mummyMaskWalk.png", {
      frameWidth: 64,
      frameHeight: 64
    });

    //attacks
    this.load.spritesheet("mummyBeam", "../../PharaohsPhury_Phaser3/assets/spriteSheets/beam.png", {
      frameWidth: 28,
      frameHeight: 7
    });
    this.load.spritesheet("mummyCane", "../../PharaohsPhury_Phaser3/assets/spriteSheets/mummyCane_melee.png", {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet("pharoahCane", "../../PharaohsPhury_Phaser3/assets/spriteSheets/mummyMask_melee.png", {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet("mummyRangeCane", "../../PharaohsPhury_Phaser3/assets/spriteSheets/mummyCane_beam.png", {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet("pharoahRangeCane", "../../PharaohsPhury_Phaser3/assets/spriteSheets/mummyMask_beam.png", {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet("caneHitbox", "../../PharaohsPhury_Phaser3/assets/spriteSheets/cane_hitbox.png", {
      frameWidth: 64,
      frameHeight: 64
    });

    //enemies
    this.load.spritesheet("archeologist", "../../PharaohsPhury_Phaser3/assets/spriteSheets/arch_walk.png", {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet("soldier", "../../PharaohsPhury_Phaser3/assets/spriteSheets/soldier_walk.png", {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet("soldierShot", "../../PharaohsPhury_Phaser3/assets/spriteSheets/soldier_shot.png", {
      frameWidth: 96,
      frameHeight: 64
    });
    this.load.spritesheet("gunner", "../../PharaohsPhury_Phaser3/assets/spriteSheets/gunner_walk.png", {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet("gunnerShot", "../../PharaohsPhury_Phaser3/assets/spriteSheets/gunner_shot.png", {
      frameWidth: 96,
      frameHeight: 64
    });

    //final boss (tank)
    this.load.spritesheet("tankBase", "../../PharaohsPhury_Phaser3/assets/spriteSheets/tankBase.png", {
      frameWidth: 192,
      frameHeight: 64
    });
    this.load.spritesheet("tankTurret", "../../PharaohsPhury_Phaser3/assets/spriteSheets/tankTurret.png", {
      frameWidth: 128,
      frameHeight: 30
    });
    this.load.spritesheet("tankTurretHigh", "../../PharaohsPhury_Phaser3/assets/spriteSheets/tankTurretHigh.png", {
      frameWidth: 112,
      frameHeight: 64
    });

    console.log('loaded spritesheet assets');

    //LOAD AUDIO ASSETS
    this.load.audio('bg', '../../PharaohsPhury_Phaser3/assets/sounds/background.mp3');
    this.load.audio('bg1', '../../PharaohsPhury_Phaser3/assets/sounds/background1.mp3');
    this.load.audio('bg2', '../../PharaohsPhury_Phaser3/assets/sounds/background2.mp3');
    this.load.audio('bg3', '../../PharaohsPhury_Phaser3/assets/sounds/background3.mp3')
    this.load.audio('beam', '../../PharaohsPhury_Phaser3/assets/sounds/beam.mp3');
    this.load.audio('pops', '../../PharaohsPhury_Phaser3/assets/sounds/buttonPops.mp3');
    this.load.audio('mummyDied', '../../PharaohsPhury_Phaser3/assets/sounds/dyingSound_1.1.mp3');
    this.load.audio('enemyDied', '../../PharaohsPhury_Phaser3/assets/sounds/dyingSound_2.2.mp3');
    this.load.audio('bomb', '../../PharaohsPhury_Phaser3/assets/sounds/explosion.mp3');
    this.load.audio('meleeAttack', '../../PharaohsPhury_Phaser3/assets/sounds/MeleeAttack.mp3');
    this.load.audio('HE', '../../PharaohsPhury_Phaser3/assets/sounds/HappyEndingPlay.mp3');
    this.load.audio('pickupSound', '../../PharaohsPhury_Phaser3/assets/sounds/pickup.mp3');
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
