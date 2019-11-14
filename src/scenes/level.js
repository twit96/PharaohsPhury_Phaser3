/*globals Phaser*/
import * as ChangeScene from './ChangeScene.js';
import Mummy from "./mummy.js";
import EnemyArch from './enemyArch.js';
import EnemySoldier from './enemySoldier.js';

export default class levelScene extends Phaser.Scene {
  constructor () {
    super('levelScene');
  }

  init (data) {
    /*
    TO CALL THIS SCENE FROM ANY LEVEL:
      this.scene.start('levelScene', {
        level: this.levelNum
      });
    */
    this.levelNum = data.level;
  }

  preload() {
    console.log('\n[LEVEL' + this.levelNum.toString() + ']');
    console.log('[preload]')

    this.load.json("levelSetting","./src/data/levelSetting.json");
    this.load.image('background1', './assets/images/egyptianbackground.jpg');

    //tutorial images
    this.load.image('bubble', './assets/images/opaquebubble.png');
    this.load.image('awdbtn', './assets/images/awdbuttons.png');
    this.load.image('spacebtn', './assets/images/spacebutton.png');
    this.load.image('mbtn', './assets/images/mbutton.png');

}

  create() {
    console.log('[create]');

    //Add change scene event listeners
    ChangeScene.addSceneEventListeners(this);


    //SPRITE GROUPS
    //scrolls and chests
    this.collectItems = this.add.group();
    this.collectItems.enableBody = true;
    this.scroll = this.add.group();
    this.scroll.enableBody = true;
    this.chests = this.physics.add.group({
      defaultKey: "chest"
    });

    //enemies
    this.enemiesA = this.add.group();
    this.enemiesA.enableBody = true;
    this.enemiesS = this.add.group();
    this.enemiesS.enableBody = true;

    //arrow traps
    this.arrows = this.physics.add.group({
      defaultKey: "arrow"
    });
    this.arrowTimer = 0;

    //RENDER LEVEL (layers below sprites only)
    //background image
    this.add.image(2240,384,'background1');

    //declare map and tilesets
      //addTilesetImage parameters: name of tileset in Tiled, key for tileset in bootscene
      //createStaticLayer parameters: layer name (or index) from Tiled, tileset, x, y
    const map = this.make.tilemap({ key: "level" + this.levelNum.toString() + "map" });
    const below2Tileset = map.addTilesetImage("inca_back2", "incaBack2Tiles");
    const worldTileset = map.addTilesetImage("inca_front", "incaFrontTiles");

    //render map/player/enemies in specific order
    const bgLayer = map.createStaticLayer("Below Player", below2Tileset, 0, 0);
    const invisLayer = map.createStaticLayer("Invisible", worldTileset, 0, 0);
    this.worldLayer = map.createStaticLayer("World", worldTileset, 0, 0);
    this.worldLayer.setCollisionByProperty({ collides: true });
    invisLayer.setCollisionByProperty({ collides: true });
    this.worldLayer.setTileIndexCallback﻿﻿([30,28], this.hitExit, this);
    invisLayer.setAlpha(0);


    //SPAWN SPRITES
    //tutorial images
    if (this.levelNum == 1) {
      //jump
      this.add.image(180,530, 'bubble').setScale(.4,.4);
      this.add.image(180,530, 'awdbtn').setScale(.3,.3);
      this.add.text(125,570, "Left   Right");
      this.add.text(162, 475, "Jump");
      //gumba
      this.add.image(685, 510, 'bubble').setScale(.4, .4);
      this.add.text(625, 475, "Jump on top\n\nof enemies\n\nto kill them.");
    }
    if (this.levelNum == 3) {
      //melee
      this.add.image(180,330, 'bubble').setScale(.4,.4);
      this.add.image(180,330, 'spacebtn').setScale(.3,.3);
      this.add.text(155, 280, "Melee");
    } else if (this.levelNum == 6) {
      //shoot beam
      this.add.image(180,530, 'bubble').setScale(.4,.4);
      this.add.image(180,530, 'mbtn').setScale(.3,.3);
      this.add.text(155, 480, "Shoot");
    }

    //parse level sprite data from json, read coordinates into array of [x,y];
    //(need to format levelN callback somehow to avoid repetitive if statements)
    if (this.levelNum == 1) {
      this.levelSettingInfo = this.cache.json.get('levelSetting');
      this.enemyACor = this.levelSettingInfo.level1.enemyA;
      this.enemySCor = this.levelSettingInfo.level1.enemyS;
      this.gemCor = this.levelSettingInfo.level1.gem;
      this.chestCor = this.levelSettingInfo.level1.chest;
      this.arrowCor = this.levelSettingInfo.level1.arrow;
    } else if (this.levelNum == 2) {
      this.levelSettingInfo = this.cache.json.get('levelSetting');
      this.enemyACor = this.levelSettingInfo.level2.enemyA;
      this.enemySCor = this.levelSettingInfo.level2.enemyS;
      this.gemCor = this.levelSettingInfo.level2.gem;
      this.chestCor = this.levelSettingInfo.level2.chest;
      this.arrowCor = this.levelSettingInfo.level2.arrow;
    } else if (this.levelNum == 3) {
      this.levelSettingInfo = this.cache.json.get('levelSetting');
      this.enemyACor = this.levelSettingInfo.level3.enemyA;
      this.enemySCor = this.levelSettingInfo.level3.enemyS;
      this.gemCor = this.levelSettingInfo.level3.gem;
      this.chestCor = this.levelSettingInfo.level3.chest;
      this.arrowCor = this.levelSettingInfo.level3.arrow;
    } else if (this.levelNum == 4) {
      this.levelSettingInfo = this.cache.json.get('levelSetting');
      this.enemyACor = this.levelSettingInfo.level4.enemyA;
      this.enemySCor = this.levelSettingInfo.level4.enemyS;
      this.gemCor = this.levelSettingInfo.level4.gem;
      this.chestCor = this.levelSettingInfo.level4.chest;
      this.arrowCor = this.levelSettingInfo.level4.arrow;
    } else if (this.levelNum == 5) {
      this.levelSettingInfo = this.cache.json.get('levelSetting');
      this.enemyACor = this.levelSettingInfo.level5.enemyA;
      this.enemySCor = this.levelSettingInfo.level5.enemyS;
      this.gemCor = this.levelSettingInfo.level5.gem;
      this.chestCor = this.levelSettingInfo.level5.chest;
      this.arrowCor = this.levelSettingInfo.level5.arrow;
    } else if (this.levelNum == 6) {
      this.levelSettingInfo = this.cache.json.get('levelSetting');
      this.enemyACor = this.levelSettingInfo.level6.enemyA;
      this.enemySCor = this.levelSettingInfo.level6.enemyS;
      this.gemCor = this.levelSettingInfo.level6.gem;
      this.chestCor = this.levelSettingInfo.level6.chest;
      this.arrowCor = this.levelSettingInfo.level6.arrow;
    } else if (this.levelNum == 7) {
      this.levelSettingInfo = this.cache.json.get('levelSetting');
      this.enemyACor = this.levelSettingInfo.level7.enemyA;
      this.enemySCor = this.levelSettingInfo.level7.enemyS;
      this.gemCor = this.levelSettingInfo.level7.gem;
      this.chestCor = this.levelSettingInfo.level7.chest;
      this.arrowCor = this.levelSettingInfo.level7.arrow;
    }

    //console.log("populating enemyA at " + this.enemyACor + ". There are " + Object.keys(this.enemyACor).length);
    //console.log("populating enemyS at " + this.enemySCor);
    //console.log("populating gem at " + this.gemCor);
    //console.log("populating chest at " + this.chestCor);

    //archaeologists
    for (var count in this.enemyACor) {
      var x = this.enemyACor[count][0];
      var y = this.enemyACor[count][1];
      var enemy = new EnemyArch({
        scene: this,
        key: "archeologist",
        x: x,
        y: y
      });
      enemy.play("archeologistAnim");
      enemy.body.setCollideWorldBounds(true);
      enemy.setInteractive();
      this.enemiesA.add(enemy);
    }
    //soldiers
    for (var count in this.enemySCor) {
      var x = this.enemySCor[count][0];
      var y = this.enemySCor[count][1];
      var enemy = new EnemySoldier({
        scene: this,
        key: "soldier",
        x: x,
        y: y,
      });
      enemy.play("soldierAnim");
      enemy.body.setCollideWorldBounds(true);
      enemy.setInteractive();
      this.enemiesS.add(enemy);
    }

    //diamonds (gems)
    for (var count in this.gemCor) {
      var x = this.gemCor[count][0];
      var y = this.gemCor[count][1];
      this.collectItems.add(this.physics.add.sprite(x,y,'gem'));
    }
    //chests
    for (var count in this.chestCor) {
      var x = this.chestCor[count][0];
      var y = this.chestCor[count][1];

      var chest = this.chests.get();
      chest
        .enableBody(true, x, y, true, true);
    }

    //player
    this.spawnPoints = [
      [180, 440], //level1
      [286, 416], //level2
      [58, 320],  //level3
      [94, 630],  //level4
      [173, 320], //level5
      [75, 512],  //level6
      [94, 192],  //level7
      [50, 100]   //level8
    ];
    this.player = new Mummy({
      scene: this,
      key: "mummyWalk",
      x: this.spawnPoints[this.levelNum - 1][0],
      y: this.spawnPoints[this.levelNum - 1][1]
    });


    //RENDER LEVEL (layers above sprites only)
    const aboveLayer = map.createStaticLayer("Above Player", worldTileset, 0, 0);
    this.hiddenCaveLayer = map.createStaticLayer("Above Player Change", worldTileset, 0, 0);
    this.hiddenCaveLayer.setCollisionByProperty({ collides: true });
    console.log('created map layers and sprites');


    //LEVEL MECHANICS
    //world/camera bounds
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player);

    //player physics and input
    this.player.body.setCollideWorldBounds(true);
    this.cursors = this.input.keyboard.createCursorKeys();


    //SPRITE COLLISIONS
    this.boundaryBox = map.heightInPixels - this.player.body.height;

    this.physics.add.collider(this.player, this.worldLayer);
    this.physics.add.collider(this.enemiesA, this.worldLayer);
    this.physics.add.collider(this.enemiesS, this.worldLayer);
    this.physics.add.collider(this.collectItems, this.worldLayer);
    this.physics.add.collider(this.collectItems, this.collectItems);
    this.physics.add.collider(this.scroll, this.scroll);
    this.physics.add.collider(this.scroll, this.worldLayer);
    this.physics.add.collider(this.chests, this.worldLayer);
    this.physics.add.collider(this.enemiesA, invisLayer);
    this.physics.add.collider(this.enemiesS, invisLayer);

    //SPRITE OVERLAPS:
    //between player and:
    //hidden caves
    this.physics.add.overlap(
      this.player,
      this.hiddenCaveLayer,
      this.uncoverHiddenCave,
      null,
      this
    );
    //enemies
    this.physics.add.overlap(
      this.player,
      this.enemiesA,
      this.playerRanIntoEnemy,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.enemiesS,
      this.playerRanIntoEnemy,
      null,
      this
    );
    //special items
    this.physics.add.overlap(
      this.player,
      this.collectItems,
      this.pickup,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.scroll,
      this.pickup,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.chests,
      this.pickupChests,
      null,
      this
    );
    //between player beams and worldLayer
    this.physics.add.overlap(
      this.player.beams,
      this.worldLayer,
      this.player.beamHitWall,
      null,
      this
    );

    //between enemy bullets and player
    this.enemiesS.children.each(function(enemyS) {
      this.physics.add.overlap(
        enemyS.bullets,
        this.worldLayer,
        enemyS.bulletHitWall,
        null,
        this
      );
    }, this);

    console.log('configured sprites and physics');

    //USER INTERFACE
    //timer
    this.startTime = new Date();
    this.endTime = new Date();
    this.duration = this.endTime-this.startTime

    //score
    this.score = 0;

    //text
    this.UserLevel = this.add.text(10,20, this.registry.get("userName")+" at Level "+ this.levelNum).setScrollFactor(0,0);
    this.LifeDisplay = this.add.text(10,40, "Life Left: " + this.player.lives).setScrollFactor(0,0);
    this.HealthDisplay = this.add.text(10,60, "Health: " + this.player.health).setScrollFactor(0,0);
    this.timerDisplay = this.add.text(10,80, "Timer: "+ this.duration).setScrollFactor(0,0);
    this.ScoreDisplay = this.add.text(10,100, "Score: "+ this.score).setScrollFactor(0,0);
    this.location = this.add.text(10,120, "Score: "+ this.player.x + "," + this.player.y).setScrollFactor(0,0);

    //life hearts
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

    console.log("configured on-screen display");

    //AUDIO
    this.backgroundMusic = this.sound.add("bg");
    this.backgroundMusic.play({loop:true});

    this.bomb = this.sound.add("bomb");
    this.shootBeam = this.sound.add("beam");
    this.meleeSound = this.sound.add("meleeAttack");
    this.yell = this.sound.add("diedYell");
    this.cry = this.sound.add("diedCry");
    this.pickupSound = this.sound.add("pickupSound");
    console.log('configured audio');

    console.log('completed create function');
  }

  update() {
    //between arrows and
    //worldlayer
    this.arrows.children.each(function(arrow) {
      this.physics.add.overlap(
        arrow,
        this.worldLayer,
        this.arrowHitWall,
        null,
        this
      );
    }, this);

    //player
    this.arrows.children.each(function(arrow) {
      this.physics.add.overlap(
        arrow,
        this.player,
        this.arrowHitPlayer,
        null,
        this
      );
    }, this);
    //CHECK/HANDLE END OF LEVEL
    if (this.player.gameOver || this.player.levelCompleted) {
      console.log('end of level triggered');
      console.log('[LEVEL ENDING]');
      if (this.player.levelCompleted) {
        var newLevelCompletion = this.registry.pop("levelCompletion");
        newLevelCompletion[this.levelNum - 1] = 1;
        this.registry.set({levelCompletion:newLevelCompletion});
        console.log(this.registry);
      }
      this.backgroundMusic.stop();
      this.scene.start('gameOverScene', {
        level: this.levelNum,
        diamond: this.player.diamondsCollected,
        killed: this.player.enemiesKilled,
        done: this.player.levelCompleted
      });
      return;
    }
    // Arrow timer
    this.arrowTimer ++;
    if (this.arrowTimer > 100){
      this.arrowTimer = 0;
      this.spawnArrow();
    }

    //USER INTERFACE
    //duration and score
    this.endTime = new Date();
    this.duration = (this.endTime.getTime() - this.startTime.getTime())/1000;
    this.score = 50*this.player.enemiesKilled + 10*this.player.diamondsCollected;

    //display
    this.timerDisplay.setText("Timer: "+ this.duration);
    this.ScoreDisplay.setText("Score: "+ this.score);
    this.HealthDisplay.setText("Health: " + this.player.health);
    this.LifeDisplay.setText("Life Left: " + this.player.lives);
    this.location.setText("Location: "+ this.player.x + "," + this.player.y);

    this.updateHealthBar();

    // player heart update - if hearts isn't equal to the player lifes, delete one heart
    if (this.player.lives != this.hearts.countActive()) {
      this.hearts.killAndHide(this.hearts.getFirstAlive());
    }


    //SPRITE MOVEMENT
    //player motion
    this.player.move();
    //check if player on map
    this.playerFellOffMap(this.player);

    //enemy movement
    this.enemiesA.children.each(function(enemyA) {
      enemyA.move();
    }, this);
    this.enemiesS.children.each(function(enemyS) {
      enemyS.move();
    }, this);


    //SPRITE INTERACTIONS
    //configure overlaps for active player attacks
    //canes
    this.player.canes.children.each(
      function (c) {
        if (c.active) {
          this.physics.add.overlap(
            c,
            this.enemiesA,
            this.player.caneHitEnemy,
            null,
            this
          );
          this.physics.add.overlap(
            c,
            this.enemiesS,
            this.player.caneHitEnemy,
            null,
            this
          );
          this.physics.add.overlap(
            c,
            this.this.worldLayer,
            this.player.caneHitWall,
            null,
            this
          );

          //have cane follow player
          if (c.x != this.player.x) {
            c.x = this.player.x;
          }
          if (c.y != this.player.y) {
            c.y = this.player.y;
          }
        }
      }.bind(this)  //binds the function to each of the children. scope of function
    );

    //beams
    this.player.beams.children.each(
      function (b) {
        if (b.active) {
          this.physics.add.overlap(
            b,
            this.enemiesA,
            this.player.beamHitEnemy,
            null,
            this
          );
          this.physics.add.overlap(
            b,
            this.enemiesS,
            this.player.beamHitEnemy,
            null,
            this
          );
          this.physics.add.overlap(
            b,
            this.this.worldLayer,
            this.player.beamHitWall,
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
      }.bind(this)
    );

    //configure overlaps for active enemy bullets
    this.enemiesS.children.each(function(enemyS) {
          enemyS.bullets.children.each(
            function (b) {
              if (b.active) {
                this.physics.add.overlap(
                  b,
                  this.player,
                  enemyS.bulletHitPlayer,
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
            }.bind(this)
          )
        }, this);
  }


  //SPRITE COLLISION HELPER FUNCTIONS
  hitExit() {
    /**
    function to update levelCompleted to true when player reaches the exit
    */
    console.log("[level.hitExit]");
    this.player.levelCompleted = true;
  }

  pickup(player,item) {
    item.destroy();
    this.player.diamondsCollected++;
    console.log("diamonds collected:" + this.player.diamondsCollected);
    this.pickupSound.play();
  }

  pickupChests(player,chest) {
    chest.play("chestOpen");
    this.scroll.add(this.physics.add.sprite(chest.x,chest.y-50,'scroll'));
    chest.setFrame(2);
    chest.disableBody(true,false);
    this.pickupSound.play();
  }

  pickUpScroll() {
    item.destroy();
    this.player.scrollsCollected++;
    console.log("scrollsC collected:" + this.player.scrollsCollected);
    this.pickupSound.play();
  }

  playerRanIntoEnemy(player, enemy) {
    /*
    function to handle the case of player colliding with an enemy when not
    attacking. Gumba jump kills enemy, and side jumps disable enemies and
    knock the player back.
    */
    console.log('[level.playerRanIntoEnemy]');

    //variables to adjust player x away from enemy
    var enemyHalfWidth = enemy.width / 2;
    var enemyRightX = enemy.x + enemyHalfWidth;
    var enemyLeftX = enemy.x - enemyHalfWidth;

    //variables to adjust player y away from enemy
    var playerHalfHeight = this.player.height / 2;
    var playerHalfWidth = this.player.width / 2;
    var enemyHalfHeight = enemy.height / 2;
    var enemyBottomY = enemy.y + enemyHalfHeight;

    if (this.player.body.touching.down) {
      //collision on top or bottom of enemy
      console.log('gumba jump: enemy died');

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

      //"kill" enemy
      enemy.updateHealth(1000); //soldier health is 25, arch health is 10, really really make sure they die with 1000 damage
      enemy.isActive = false;
      this.cry.play();

      //update player
      this.player.body.setVelocityY(-330);
      player.enemiesKilled++;

    } else if (this.player.body.touching.right) {
      //collision on left side of enemy
      this.player.x = enemyLeftX - playerHalfWidth;
      this.player.y = enemyBottomY - playerHalfHeight;
      console.log("adjusted player coordinates: (" + player.x + ", " + player.y + ")");

      //enemy briefly disabled
      enemy.stun();

      //player takes damage
      player.updateHealth(25);  //25 ARBITRARILY CHOSEN

    }  else if (this.player.body.touching.left) {
      //collision on right side of enemy
      this.player.x = enemyRightX + playerHalfWidth;
      this.player.y = enemyBottomY - playerHalfHeight;
      console.log("adjusted player coordinates: (" + player.x + ", " + player.y + ")");

      //enemy briefly disabled
      enemy.stun();

      //player takes damage
      player.updateHealth(25);  //25 ARBITRARILY CHOSEN
    }

  }

  spawnDiamond(diamondX, diamondY){
    this.collectItems.add(this.physics.add.sprite(diamondX,diamondY,"gem"));
  }

  playerFellOffMap(player) {
    /*
    function to handle player colliding with bottom world bound
    */

    if (player.y > this.boundaryBox) {
      console.log('[level.playerFellOffMap]')
      this.player.updateHealth(100);
      this.yell.play({volume: 5});
    }
  }

  arrowHitWall(arrow, worldLayer) {
    /*
    function to check each worldLayer tile the soldier bullet overlaps with for
    its collides property. destroys the bullet if it encounters a tile with
    collides = true (i.e. the bullet hit a wall tile)
    */
    if (worldLayer.collides) {
      console.log('[arrowHitWall]');
      arrow.disableBody(true, true);
    }
  }

  arrowHitPlayer(arrow, player) {
    /*
    function to handle overlap between player and tank shell
    (i.e. tank shell hit player)
    */
    console.log('[arrowHitPlayer]');
    //disable shell
    arrow.disableBody(true, true);

    //update player stats
    this.player.updateHealth(10);
  }


  //USER INTERFACE HELPER FUNCTIONS
  updateHealthBar() {
    this.healthBarFill.setCrop(0,0,this.healthBarOrgWidth*this.player.health /100,this.healthBarOrgHeight);
  }

  uncoverHiddenCave(player,hiddenCaveLayer){
    if (hiddenCaveLayer.collides) {
      this.hiddenCaveLayer.setAlpha(0);
    } else {
      this.hiddenCaveLayer.setAlpha(1);
    }
  }

  spawnArrow(){
    for (var count in this.arrowCor) {
      var x = this.arrowCor[count][0];
      var y = this.arrowCor[count][1];
      for (var i = 0; i < 3; i++) {
        var num = Math.floor(Math.random()*19) + 1;
        num *= Math.floor(Math.random()*2) == 1 ? 1 : -1; // this will add minus sign in 50% of cases
        var arrow = this.arrows.get();
        arrow
          .enableBody(true, x+num, y, true, true);
        arrow.body.setAllowGravity(false);
        arrow.body.setVelocityY(-1000);
      }
    }
  }
}
