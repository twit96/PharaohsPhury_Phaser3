/*globals Phaser*/
import * as ChangeScene from './ChangeScene.js';
export default class finalBossLevel extends Phaser.Scene {
  constructor () {
    super('finalBossLevel');
  }

  preload() {
    console.log('\n[FINALBOSSLEVEL]');
    console.log('[preload]')
    this.load.image('bossbackground', './assets/images/bossbackground.jpg');
  }

  create() {
    console.log('[create]');
    // background image
    this.add.image(2560, 384, 'bossbackground');
    // Audio
    this.backgroundMusic = this.sound.add("platformerSound");
    this.backgroundMusic.play({loop:true});
    this.bomb = this.sound.add("bomb");
    this.shootBeam = this.sound.add("beam");
    this.cry = this.sound.add("diedCry");

    //Add change scene event listeners
    ChangeScene.addSceneEventListeners(this);

    //SCENE VARIABLES
    //player
    this.player;
    this.cursors;

    this.playerLives = 3;
    this.playerHealth = 100;
    this.playerAttackPoint = 5;
    this.playerCanAttack = true;
    this.beamSpeed = 1000;
    this.beamAngle;

    this.diamondsCollected = 0;
    this.enemiesKilled = 0;
    this.gameOver = false;
    this.levelCompleted = false;

    //level
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
    this.player = this.physics.add.sprite(25, 500, "mummyWalk");
    this.tank = this.physics.add.sprite(400, 400, "tankMove");
    console.log('created map layers and sprites');

    //player physics/input
    this.player.body.setSize(40, 64, 50, 50);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

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
      this.playerRanIntoTank,
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
    if (this.tankHealth <= 0) {
      this.levelCompleted = true;
      this.backgroundMusic.stop();
    }
    //check for and handle gameOver or levelCompleted
    if (this.gameOver || this.levelCompleted) {
      console.log('end of level triggered');
      console.log('[FINALBOSSLEVEL ENDING]');

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


  //PLAYER HELPER FUNCTIONS
  resetPlayer() {
    /*
    function to restore player sprite defaults after a change in tint,
    canAttack, or being disabled after taking damage.
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

    //movement
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

    //idle
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("mummyIdleAnim", true);
    }

    //jumping
    if (this.cursors.up.isDown && this.player.body.onFloor())  {
      //only jumps if sprite body is on ground
      this.player.setVelocityY(-330);
    }

    //long range attacks
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

    this.physics.add.overlap(this.tank, beam, this.updateTankHealth(5), null, this);﻿

    //enable player attacks again after a delay
    this.time.addEvent({
      delay: 500,
      callback: this.resetPlayer,
      callbackScope: this,
      loop: false
    });
  }

  playerRanIntoTank(player, enemy) {
    /*
    function to handle special case of player taking damage: running into tank.
    player loses one life and then respawns away from the tank so this function
    won't get called over and over
    */
    console.log('[playerRanIntoTank]')

    //disable tank, update player health
    this.activeTank = false;
    this.updatePlayerHealth(100); //i.e. player loses 1 life
    player.disableBody(true, false);
    player.setTint(0xff0000);

    //MOVE PLAYER SPRITE
    //variables to adjust x value
    var enemyHalfWidth = enemy.width / 2;
    var enemyRightX = enemy.x + enemyHalfWidth;
    var enemyLeftX = enemy.x - enemyHalfWidth;

    //variables to adjust y value
    var playerHalfHeight = player.height / 2;
    var enemyHalfHeight = enemy.height / 2;
    var enemyBottomY = enemy.y + enemyHalfHeight;

    //adjust player x
    if (player.body.touching.right) {
      //collision on left side of enemy
      player.x = enemyLeftX - player.width;
    } else if (player.body.touching.left) {
      //collision on right side of enemy
      player.x = enemyRightX + player.width;
    } else {
      //collision on top or bottom of enemy
      player.x = enemyLeftX - player.width;
    }

    //adjust player y
    player.y = enemyBottomY - playerHalfHeight;

    console.log("adjusted player coordinates: (" + player.x + ", " + player.y + ")");

    //delay and reset player at new spawn, then re-enable player sprite
    this.time.addEvent({
      delay: 500,
      callback: this.resetPlayer,
      callbackScope: this,
      loop: false
    });

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
    this.updatePlayerHealth(50);
    this.time.addEvent({
      delay: 250,
      callback: this.resetPlayer,
      callbackScope: this,
      loop: false
    });
  }

}
