/*globals Phaser*/
import * as ChangeScene from './ChangeScene.js';
import Mummy from "./mummy.js";

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
    // Audio
    this.backgroundMusic = this.sound.add("platformerSound");
    this.backgroundMusic.play({loop:true});
    this.bomb = this.sound.add("bomb");
    this.shootBeam = this.sound.add("beam");
    this.cry = this.sound.add("diedCry");

    //Add change scene event listeners
    ChangeScene.addSceneEventListeners(this);

    //SCENE VARIABLES

    //level
    this.cursors;
    this.levelName = 'Final Boss';

    //tank
    this.tankMoveCounter = 0
    this.tankDifficulties = [1000, 500, 250, 100];  //not implemented yet, to give tank faster firing and movement as he gets closer to dying
    this.tankHealth = 100;
    this.tankSpeed = 1.00;

    this.shellSpeed = 1000;
    this.activeTank = true;

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
      x: 25,
      y: 500
    });

    this.tank = this.physics.add.sprite(400, 400, "tankMove");
    console.log('created map layers and sprites');

    //player physics/input
    this.player.body.setSize(40, 64, 50, 50);
    this.player.body.setBounce(0.2);
    this.player.body.setCollideWorldBounds(true);

    this.cursors = this.input.keyboard.createCursorKeys();

    //tank physics
    this.tank.setCollideWorldBounds(true);
    this.tank.play("tankMove");
    this.tank.setInteractive();

    //tank shells
    this.shells = this.physics.add.group({
      defaultKey: "shell"
    });

    //player long range attacks
    this.beams = this.physics.add.group({
      defaultKey: "mummyBeam",
      allowGravity: false
    });

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
      this.playerRanIntoEnemy,
      null,
      this
    );
    this.physics.add.overlap(
      this.shells,
      worldLayer,
      this.shellHitWall,
      null,
      this
    );
    console.log('configured sprites and physics');
    console.log('completed create function');

  }

  update() {
    //check for and handle gameOver or levelCompleted
    if (this.player.gameOver || this.player.levelCompleted) {
      console.log('end of level triggered');
      console.log('[FINALBOSSLEVEL ENDING]');

      this.backgroundMusic.stop();
      this.scene.start('gameOverScene', {
        level: this.levelName,
        diamond: this.diamondsCollected,
        killed: this.enemiesKilled,
        done: this.levelCompleted
      });
      return;
    }

    //player motion
    this.player.move();

    //tank motion
    this.tankMove(this.tank, this.tankSpeed);

    //configure active tank shells
    this.shells.children.each(
      function (b) {
        if (b.active) {
          this.physics.add.overlap(
            b,
            this.player,
            this.shellHitPlayer,
            null,
            this
          );

          //deactivate shells once they leave the screen
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

  playerRanIntoEnemy(player, enemy) {
    /*
    function to handle special case of player taking damage: running into tank.
    player loses one life and then respawns away from the tank so this function
    won't get called over and over
    */
    console.log('[playerRanIntoEnemy]')

    //disable tank, update player health
    this.activeTank = false;
    this.player.updateHealth(100); //i.e. player loses 1 life
    this.player.setTint(0xff0000);

    //MOVE PLAYER SPRITE
    //variables to adjust x value
    var enemyHalfWidth = enemy.width / 2;
    var enemyRightX = enemy.x + enemyHalfWidth;
    var enemyLeftX = enemy.x - enemyHalfWidth;

    //variables to adjust y value
    var playerHalfHeight = this.player.height / 2;
    var enemyHalfHeight = enemy.height / 2;
    var enemyBottomY = enemy.y + enemyHalfHeight;

    //adjust player x
    if (this.player.body.touching.right) {
      //collision on left side of enemy
      this.player.x = enemyLeftX - this.player.width;
    } else if (this.player.body.touching.left) {
      //collision on right side of enemy
      this.player.x = enemyRightX + this.player.width;
    } else {
      //collision on top or bottom of enemy
      this.player.x = enemyLeftX - this.player.width;
    }

    //adjust player y
    this.player.y = enemyBottomY - playerHalfHeight;

    console.log("adjusted player coordinates: (" + player.x + ", " + player.y + ")");

    //disabled tank set to respawn with a longer delay than player sprite
    this.time.addEvent({
      delay: 2500,
      callback: this.resetTank,
      callbackScope: this,
      loop: false
    });
  }


  //TANK HELPER FUNCTIONS
  resetTank() {
    console.log('[resetTank]');
    this.activeTank = true;
  }

  updateTankHealth(damage) {
    /*
    function called when player beam hits tank.
    will subtract damage from tank health and if tank health = 0,
    it will update level levelCompleted status
    */
    this.tankHealth = this.tankHealth - damage;
    console.log(this.tankHealth);

    //UNFINISHED
    //needs overlap detector in update function that calls this function:
      //nearly identical to the way the tank shells are declared near line 140

  }

  tankMove(tank, speed) {
    /*
    function to create tank behavior loop:
    back and forth movement, calling shoot function periodically.
    only runs if this.activeTank = true
    */

    if (this.activeTank) {
      this.tankMoveCounter += 1

      //tank back and forth movement
      if (this.tankMoveCounter < 250) {
        tank.x += speed
      } else {
        tank.x -= speed
      }

      //tank shooting behavior (5 times per back and forth cycle)
      if (this.tankMoveCounter % 100 == 0) {
        this.tankShoot(this.tank, this.player);
      }

      //reset count at 500 to repeat the behavior loop
      if (this.tankMoveCounter == 500) {
        this.tankMoveCounter = 0;
      }
    }
  }

  tankShoot() {
    /*
    function to define behavior of tank shooting at the player
    */
    var betweenPoints = Phaser.Math.Angle.BetweenPoints;
    var angle = betweenPoints(this.tank, this.player);
    var velocityFromRotation = this.physics.velocityFromRotation;

    //create a variable called velocity from a vector2
    var velocity = new Phaser.Math.Vector2();
    velocityFromRotation(angle, this.shellSpeed, velocity);

    //get the shells group and generate shell
    var shell = this.shells.get();
    shell.setAngle(Phaser.Math.RAD_TO_DEG * angle);
    shell
      .enableBody(true, this.tank.x, this.tank.y, true, true)
      .setVelocity(velocity.x, velocity.y)
  }

  //TANK SHELLS HELPER FUNCTIONS
  shellHitWall(shell, worldLayer) {
    /*
    function to check each worldLayer tile the tank shell overlaps with for
    its collides property. destroys the shell if it encounters a tile with
    collides = true (i.e. the shell hit a wall tile)
    */
    if (worldLayer.collides) {
      console.log('[shellHitWall]');
      shell.disableBody(true, true);
      this.bomb.play();
    }
  }

  shellHitPlayer(shell, player) {
    /*
    function to handle overlap between player and tank shell
    (i.e. tank shell hit player)
    */
    console.log('[shellHitPlayer]');
    this.bomb.play();

    //disable shell
    shell.disableBody(true, true);

    //update player stats
    this.player.updateHealth(50);
  }

}
