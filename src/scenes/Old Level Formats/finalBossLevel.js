/*globals Phaser*/
import * as ChangeScene from './ChangeScene.js';
import Mummy from "./mummy.js";
import Tank from "./tank.js";

import EnemyArch from './enemyArch.js';
import EnemySoldier from './enemySoldier.js';


export default class finalBossLevel extends Phaser.Scene {
  constructor () {
    super('finalBossLevel');
  }

  preload() {
    console.log('\n[FINALBOSSLEVEL]');
    console.log('[preload]');
    this.load.image('bubble', './assets/images/opaquebubble.png');
    this.load.image('bossbackground', './assets/images/bossbackground.jpg');
  }

  create() {
    console.log('[create]');

    //Add change scene event listeners
    ChangeScene.addSceneEventListeners(this);

    // background image
    this.add.image(1600, 320, 'bossbackground');

    //AUDIO
    //this.backgroundMusic = this.sound.add("bg4");
    this.backgroundMusic.play({loop:true});

    this.bomb = this.sound.add("bomb");
    this.meleeSound = this.sound.add("meleeAttack");
    this.shootBeam = this.sound.add("beam");
    this.cry = this.sound.add("diedCry");
    this.pickupSound = this.sound.add("pickupSound");

    //VARIABLES
    //player
    this.spawnX = 25;
    this.spawnY = 300;
    this.levelName = "Final Boss";

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

    this.enemyHealth = this.add.container(400, 450);
    this.EhealthBar = this.add.sprite(0,0,"healthBarFrame").setOrigin(0,0).setScale(0.1);
    this.EhealthBarFill = this.add.sprite(0,0,"healthBarFill").setOrigin(0,0).setScale(0.1);
    this.EhealthBarOrgWidth = this.EhealthBarFill.width;
    this.EhealthBarOrgHeight = this.EhealthBarFill.width;
    this.enemyHealth.add(this.EhealthBar);
    this.enemyHealth.add(this.EhealthBarFill);


    this.tank = new Tank({
      scene: this,
      key: "tankBase",
      x: 400,
      y: 400
    });

    //diamonds
    this.collectItems = this.add.group();
    this.collectItems.enableBody = true;

    console.log('created map layers and sprites');

    //player physics/input
    this.player.body.setCollideWorldBounds(true);

    //tank physics
    this.tank.body.setCollideWorldBounds(true);
    this.tank.setInteractive();

    //world/camera bounds
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player);

    //configure sprite collisions
    this.physics.add.collider(this.player, worldLayer);
    this.physics.add.collider(this.tank, worldLayer);
    this.physics.add.collider(this.tank.enemiesA, worldLayer);
    this.physics.add.collider(this.tank.enemiesS, worldLayer);
    this.physics.add.collider(this.collectItems, worldLayer);
    this.physics.add.collider(this.collectItems, this.collectItems);

    //configure sprite overlaps
    //for player
    this.physics.add.overlap(
      this.player,
      this.tank,
      this.playerRanIntoTank,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.tank.enemiesA,
      this.playerRanIntoEnemy,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.tank.enemiesS,
      this.playerRanIntoEnemy,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.collectItems,
      this.pickup,
      null,
      this
    );

    //for player beams
    this.physics.add.overlap(
      this.player.beams,
      this.tank.enemiesA,
      this.player.beamHitEnemy,
      null,
      this
    );
    this.physics.add.overlap(
      this.player.beams,
      this.tank.enemiesS,
      this.player.beamHitEnemy,
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

    //for tank projectiles
    this.physics.add.overlap(
      this.tank.shells,
      worldLayer,
      this.tank.shellHitWall,
      null,
      this
    );
    this.physics.add.overlap(
      this.tank.bombs,
      worldLayer,
      this.tank.shellHitWall,
      null,
      this
    );

    console.log('configured sprites and physics');
    console.log('completed create function');

    // Create timer
    this.startTime = new Date();
    this.endTime = new Date();
    this.duration = this.endTime-this.startTime

    // create score
    this.score = 0;

    // Generate Display text
    // this.add.image(100,80, 'bubble').setScale(.5,.5).setScrollFactor(0);
    this.UserLevel = this.add.text(10,20, this.registry.get("userName")+" at "+this.levelName,{ color: '#00000' }).setScrollFactor(0,0);
    this.LifeDisplay = this.add.text(10,40, "Life Left: " + this.player.lives,{ color: '#00000' }).setScrollFactor(0,0);
    this.HealthDisplay = this.add.text(10,60, "Health: " + this.player.health,{ color: '#00000' }).setScrollFactor(0,0);
    this.timerDisplay = this.add.text(10,80, "Timer: "+ this.duration,{ color: '#00000' }).setScrollFactor(0,0);
    this.ScoreDisplay = this.add.text(10,100, "Score: "+ this.score,{ color: '#00000' }).setScrollFactor(0,0);

    // this.EnemyHealthDisplay = this.add.text(650,10,"Tank Health: "+this.tank.health, { color: '#00000' }).setScrollFactor(0,0);
    var h;
    this.hearts = this.add.group();
    for (h = 0; h < this.player.lives; h++) {
      var xLocation = 150 + h*20 ;
      this.hearts.add(this.add.image(xLocation,48, "heart").setScrollFactor(0,0).setScale(0.03));
    }
    this.healthBar = this.add.image(120,58,"healthBarFrame").setOrigin(0,0).setScale(0.08).setScrollFactor(0,0);
    this.healthBarFill = this.add.image(120,58,"healthBarFill").setOrigin(0,0).setScale(0.08).setScrollFactor(0,0);
    this.healthBarOrgWidth = this.healthBarFill.width;
    this.healthBarOrgHeight = this.healthBarFill.width;

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
    // this.EnemyHealthDisplay.setText("Tank Health:" + this.tank.health)
    this.updateHealthBar();
    this.updateEHealthBar();
    this.enemyHealth.x = this.tank.x - 60;

    // player heart update - if hearts isn't equal to the player lifes, delete one heart
    if (this.player.lives != this.hearts.countActive()) {
      this.scene.pause();
      this.hearts.killAndHide(this.hearts.getFirstAlive());
      this.scene.resume();
      // not working delay below
      /*this.time.addEvent({
        delay: 50,
        callback: this.scene.resume,
        callbackScope: this,
        loop: false
      });*/
    }

    //detect if tank died
    if (this.tank.health <= 0) {
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
        done: this.player.levelCompleted
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

    //configure overlaps for active tank bombs
    this.tank.bombs.children.each(
      function (b) {
        if (b.active) {
          this.physics.add.overlap(
            b,
            this.player,
            this.tank.shellHitPlayer,
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

    //enemy movement
    this.tank.enemiesA.children.each(function(enemyA) {
      enemyA.move();
    }, this);
    this.tank.enemiesS.children.each(function(enemyS) {
      enemyS.move();
    }, this);

    //configure overlaps for active enemy bullets
    this.tank.enemiesS.children.each(function(enemyS) {
          enemyS.bullets.children.each(
            function (b) {
              if (b.active) {
                this.physics.add.overlap(
                  b,
                  this.player,
                  this.shellHitPlayer,
                  null,
                  this
                );

                //deactivate bullets once they leave the screen
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
          )
        }, this);


  }

  shellHitPlayer(shell, player) {
    /*
    function to handle overlap between player and tank shell
    (i.e. tank shell hit player)
    */
    console.log('[level.shellHitPlayer]');


    //disable shell
    shell.disableBody(true, true);

    //update player stats
    player.updateHealth(20);
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

  playerRanIntoEnemy(player, enemy) {
    /*
    function to handle the case of player colliding with an enemy.
    Player loses a life if not attacking, and enemy is always destroyed.
    */
    console.log('[level.playerRanIntoEnemy]');

    var enemyDied = false;

    //HANDLE COLLISION IF PLAYER IS NOT ATTACKING
    if (player.isAttacking == false) {
      console.log('player was not attacking');

      //variables to adjust player x away from enemy
      var enemyHalfWidth = enemy.width / 2;
      var enemyRightX = enemy.x + enemyHalfWidth;
      var enemyLeftX = enemy.x - enemyHalfWidth;

      //variables to adjust player y away from enemy
      var playerHalfHeight = this.player.height / 2;
      var enemyHalfHeight = enemy.height / 2;
      var enemyBottomY = enemy.y + enemyHalfHeight;

      if (this.player.body.touching.down) {
        //collision on top or bottom of enemy
        enemyDied = true;
        enemy.isActive = false;

        this.player.body.setVelocityY(-330);

      } else if (this.player.body.touching.right) {
        //collision on left side of enemy
        this.player.x = enemyLeftX - this.player.width;
        this.player.y = enemyBottomY - playerHalfHeight;

        //player takes damage
        player.updateHealth(25);  //25 ARBITRARILY CHOSEN

        //enemy briefly disabled
        enemy.stun();

      }  else if (this.player.body.touching.left) {
        //collision on right side of enemy
        this.player.x = enemyRightX + this.player.width;
        this.player.y = enemyBottomY - playerHalfHeight;

        //player takes damage
        player.updateHealth(25);  //75 ARBITRARILY CHOSEN

        //enemy briefly disabled
        enemy.stun();
      }

      console.log("adjusted player coordinates: (" + player.x + ", " + player.y + ")");

    //HANDLE COLLISION IF PLAYER IS ATTACKING
    } else {
      console.log('player was attacking');
      enemyDied = true;
    }

    //HANDLE ENEMY DEATH IF NEEDED
    if (enemyDied == true) {
      console.log('enemy died');

      //generate random number of diamonds to burst from dead enemy
      var randAmount = Math.floor(Math.random() * Math.floor(10));
      var x;
      for (x = 0; x < randAmount; x++) {
        //within 75 pixels left or right from the enemy
        var randomShiftX = Math.floor(Math.random() * Math.floor(150)) - 75;

        //up to 75 pixels above the enemy
        var randomShiftY = Math.floor(Math.random() * Math.floor(75));

        //spawn diamond
        var diamondX = enemy.x + randomShiftX;
        var diamondY = enemy.y - randomShiftY;
        this.spawnDiamond(diamondX, diamondY);
      }

      //"kill" enemy, update player stats
      enemy.updateHealth(1000); //soldier health is 25, arch health is 10, really really make sure they die with 1000 damage
      this.cry.play();
      player.enemiesKilled++;
    }
  }

  spawnDiamond(diamondX, diamondY){
    this.collectItems.add(this.physics.add.sprite(diamondX,diamondY,"gem"));
  }

  pickup(player,item) {
    item.destroy();
    this.player.diamondsCollected++;
    console.log("diamonds collected:" + this.player.diamondsCollected);
    this.pickupSound.play();
  }

  updateHealthBar(){
    this.healthBarFill.setCrop(0,0,this.healthBarOrgWidth*this.player.health /100,this.healthBarOrgHeight);
    //console.log("Update player health bar fill");
  }
  updateEHealthBar(){
    this.EhealthBarFill.setCrop(0,0,this.EhealthBarOrgWidth*this.tank.health /100,this.EhealthBarOrgHeight);
    //console.log("Update player health bar fill");
  }
}
