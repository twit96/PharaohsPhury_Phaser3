/*globals Phaser*/
import * as ChangeScene from './ChangeScene.js';
import Mummy from "./mummy.js";
import Tank from "./tank.js";

export default class finalBossLevel extends Phaser.Scene {
  constructor () {
    super('finalBossLevel');
  }

  preload() {
    console.log('\n[FINALBOSSLEVEL]');
    console.log('[preload]')
  }

  create() {
    console.log('[create]');

    //Add change scene event listeners
    ChangeScene.addSceneEventListeners(this);

    //AUDIO
    this.backgroundMusic = this.sound.add("platformerSound");
    this.backgroundMusic.play({loop:true});
    this.bomb = this.sound.add("bomb");
    this.shootBeam = this.sound.add("beam");
    this.cry = this.sound.add("diedCry");

    //VARIABLES
    //player
    this.spawnX = 25;
    this.spawnY = 500;
    this.levelName = 'Final Boss';

    //CREATE LEVEL
    //declare map and tilesets
      //addTilesetImage parameters: name of tileset in Tiled, key for tileset in bootscene
      //createStaticLayer parameters: layer name (or index) from Tiled, tileset, x, y
    const map = this.make.tilemap({ key: "finalBossMap" });
    const belowTileset = map.addTilesetImage("inca_back", "incaBackTiles");
    const worldTileset = map.addTilesetImage("inca_front", "incaFrontTiles");

    //render map/player/enemies in specific order
    const belowLayer = map.createStaticLayer("Below Player", belowTileset, 0, 0);
    const worldLayer = map.createStaticLayer("World", worldTileset, 0, 0);
    worldLayer.setCollisionByProperty({ collides: true });

    this.player = new Mummy({
      scene: this,
      key: "mummyWalk",
      x: this.spawnX,
      y: this.spawnY
    });

    this.tank = new Tank({
      scene: this,
      key: "tankMove",
      x: 400,
      y: 400
    });

    console.log('created map layers and sprites');

    //player physics/input
    this.player.body.setCollideWorldBounds(true);
    this.cursors = this.input.keyboard.createCursorKeys();

    //tank physics
    this.tank.play("tankMove");
    this.tank.body.setCollideWorldBounds(true);
    this.tank.setInteractive();

    //world/camera bounds
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player);

    //configure sprite collisions
    this.physics.add.collider(this.player, worldLayer);
    this.physics.add.collider(this.tank, worldLayer);

    this.physics.add.overlap(
      this.player,
      this.tank,
      this.playerRanIntoTank,
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
      this.tank.shells,
      worldLayer,
      this.tank.shellHitWall,
      null,
      this
    );

    console.log('configured sprites and physics');
    console.log('completed create function');
    // Create display bar
    //var graphics = this.add.graphics();
    //graphics.fillStyle(0x000000,1);
    //graphics.beginPath();
    //graphics.lineTo(config.width,0);
    //graphics.lineTo(config.width,20);
    //graphics.lineTo(0,20);
    //graphics.lineTo(0,0);
    //graphics.closePath();
    //graphics.fillPath();

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
    this.EnemyHealthDisplay = this.add.text(650,50,"Tank Health: "+this.tank.health);

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
    this.EnemyHealthDisplay.setText("Tank Health:" + this.tank.health)

    //detect if tank died
    if (this.tank.health == 0) {
      this.player.levelCompleted = true;
    }

    //check for and handle gameOver or levelCompleted
    if (this.player.gameOver || this.player.levelCompleted) {
      console.log('end of level triggered');
      console.log('[FINALBOSSLEVEL ENDING]');

      this.backgroundMusic.stop();

      this.scene.start('gameOverScene', {
        level: this.levelName,
        diamond: this.player.diamondsCollected,
        killed: this.player.enemiesKilled,
        done: this.levelCompleted
      });
      return;
    }

    //player motion
    this.player.move();

    //configure overlaps for active player beams
    this.player.beams.children.each(
      function (b) {
        if (b.active) {
          this.physics.add.overlap(
            b,
            this.tank,
            this.player.beamHitTank,
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

    //tank motion
    this.tank.move();

    //configure overlaps for active tank shells
    this.tank.shells.children.each(
      function (s) {
        if (s.active) {
          this.physics.add.overlap(
            s,
            this.player,
            this.tank.shellHitPlayer,
            null,
            this
          );

          //deactivate shells once they leave the screen
          if (s.y < 0) {
            s.setActive(false)
          } else if (s.y > this.cameras.main.height) {
            s.setActive(false)
          } else if (s.x < 0) {
            s.setActive(false)
          } else if (s.x > this.cameras.main.width) {
            s.setActive(false)
          }
        }
      }.bind(this)  //binds the function to each of the children. scope of function
    );

  }


  playerRanIntoTank(player, tank) {
    /*
    function to handle special case of player taking damage: running into tank.
    player loses one life and then respawns away from the tank so this function
    won't get called over and over.
    */
    console.log('[playerRanIntoTank]')

    //disable enemy, update player health
    this.tank.isActive = false;
    this.player.updateHealth(100); //i.e. player loses 1 life
    this.player.setTint(0xff0000);
    this.player.setVelocity = 0;

    //MOVE PLAYER SPRITE
    //variables to adjust x value
    var tankHalfWidth = tank.width / 2;
    var tankRightX = tank.x + tankHalfWidth;
    var tankLeftX = tank.x - tankHalfWidth;

    //variables to adjust y value
    var playerHalfHeight = this.player.height / 2;
    var tankHalfHeight = tank.height / 2;
    var tankBottomY = tank.y + tankHalfHeight;

    //adjust player x
    if (this.player.body.touching.right) {
      //collision on left side of enemy
      this.player.x = tankLeftX - this.player.width;
    } else if (this.player.body.touching.left) {
      //collision on right side of enemy
      this.player.x = tankRightX + this.player.width;
    } else {
      //collision on top or bottom of enemy
      this.player.x = tankLeftX - this.player.width;
    }

    //adjust player y
    this.player.y = tankBottomY - playerHalfHeight;

    console.log("adjusted player coordinates: (" + player.x + ", " + player.y + ")");

    //disabled tank set to respawn with a longer delay than player sprite
    this.time.addEvent({
      delay: 2500,
      callback: this.tank.reset,
      callbackScope: this,
      loop: false
    });
  }
}
