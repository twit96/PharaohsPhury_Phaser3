/*global Phaser*/
import EnemyArch from './enemyArch.js';
import EnemySoldier from './enemySoldier.js';

export default class Tank extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);

    //TURRET
    this.turret = config.scene.add.sprite(config.x - 30, config.y - 50, 'tankTurret');
    this.highTurret = config.scene.add.sprite(config.x - 30, config.y - 60, 'tankTurretHigh');
    this.highTurret.visible = false;

    //BASE
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);
    this.body.setSize(192, 64);
    this.play("tankMove");

    //SHELLS
    this.shells = this.scene.physics.add.group({
      defaultKey: "shell"
    });

    //CLUSTER BOMBS
    this.bombs = this.scene.physics.add.group({
      defaultKey: "bomb"
    });

    //VARIABLES
    //general
    this.health = 100;
    this.speed = 0.5;
    this.shellSpeed = 1500;
    this.bombSpeed = 750;
    this.isActive = true;

    //for behavior cycle
    this.moveCounter = 0;
    this.maxCount = 1000;
    this.maxCountIncrement = 500;

    //count values where tank does triple shot attacks
    this.triShootAttackCounts = [
      900, 920, 940,
      1300, 1320, 1340,
      1900, 1920, 1940
    ];

    //count values where tank spawns new enemies
    this.archeologistSwarmCounts = [
      725, 750, 775,
      1025, 1050, 1075,
      1525, 1550, 1575
    ];
    this.soldierSwarmCounts = [
      700, 800,
      1000, 1100,
      1500, 1600
    ];

    //to store shoot angles
    this.turretAngleRAD;
    this.turretAngleDEG;
  }

  //TANK HELPER FUNCTIONS
  reset() {
    console.log('[tank.reset]');
    this.tank.isActive = true;
  }

  updateHealth(damage) {
    /*
    function called when player beam hits tank.
    Subtracts damage from tank health.
    */
    console.log('[tank.updateHealth]');
    this.health -= damage;
  }


  //BEHAVIOR CYCLE HELPER FUNCTIONS
  move() {
    /*
    function to create a repeating tank behavior cycle, consisting of:
      3 behavior loops of increasing length and intensity,
      which play in reverse after completion to start the behavior cycle over.

      Here is a visual of what the code is doing to the tank...

      Behavior Cycle:
      ----------------------------->
      |-loop1-|--Loop2--|---Loop3---|   cycle moves tank in forward direction

      |---Loop3---|--Loop2--|-loop1-|   cycle moves tank in reverse direction
      <-----------------------------

    Note:
    - tank moves during first 3/4 of each loop,
    - stationary attacks occur during the final 1/4 of each loop,
    - tank does single shots at regular intervals throughout each loop.

    This function runs while this.isActive = true. Allows for pausing the cycle.
    */

    if (this.isActive) {
      this.moveCounter ++;

      //anim
      if (this.moveCounter == 0) {
        this.play("tankMove");
      }

      //TANK MOVEMENT
      if (this.moveCounter < (3 * this.maxCount / 4)) {
        this.x += this.speed;
        this.turret.x += this.speed;
        this.highTurret.x += this.speed;
      } else {
        //pause anim for stationary part of loop
        this.setFrame(0);
      }

      //TURRET POSITION
      this.adjustTurretPosition();

      //SHOOTING ATTACK
      if (this.moveCounter % 200 == 0) {
        this.shoot(this.scene.player);
      }
      if (this.moveCounter % 200 == 25) {
        //reset turret sprite after shoot completes
        this.turret.setFrame(0);
        this.highTurret.setFrame(0);
      }

      //TRIPLE SHOT ATTACK
      if (this.triShootAttackCounts.includes(this.moveCounter)) {
        this.shoot();
      }
      if (this.triShootAttackCounts.includes(this.moveCounter - 15)) {
        //reset turret after shoot completes
        this.turret.setFrame(0);
        this.highTurret.setFrame(0);
      }

      //CLUSTER BOMB ATTACK
      if (this.moveCounter == 1700) {
        this.clusterBomb();
      }
      if (this.moveCounter == 1725) {
        this.turret.setFrame(0);
        this.highTurret.setFrame(0);
      }

      //ENEMY SWARMS
      if (this.archeologistSwarmCounts.includes(this.moveCounter)) {
        this.archeologistSwarm();
      }
      if (this.soldierSwarmCounts.includes(this.moveCounter)) {
        this.soldierSwarm();
      }

      //UPDATE AND REPEAT BEHAVIOR LOOP
      if (this.moveCounter == this.maxCount) {
        this.updateBehaviorLoop();
      }
    }
  }

  updateBehaviorLoop() {
    /*
    function that adjusts the total length of the behavior loop of the tank,
    which in turn "uncovers" or "re-covers" more complex attacks that trigger
    when the moveCounter reaches higher values. After the 3 loops complete,
    function swaps the direction of the tank and repeats the 3 loops.
    */
    console.log('[tank.updateBehaviorLoop] - end of loop\n\n');

    //update length of behavior loop and moveCounter
    this.maxCount += this.maxCountIncrement;
    this.moveCounter = 0;

    //handle tank switching directions after three behavior loops
    if (this.maxCount > 2000) {
      console.log('tank behavior cycle reversing\n\n');

      this.maxCount = 1000;
      this.speed *= -1;
    }
  }


  //TURRET AND SHOOTING HELPER FUNCTIONS
  adjustTurretPosition() {
    /*
    function to adjust turret position based on position
    of the player and the tank body.
    */

    //fix position on tank
    if (this.turret.y != this.y - 40) {
      this.turret.y = this.y - 40;
    }
    if (this.highTurret.y != this.y - 60) {
      this.highTurret.y = this.y - 60;
    }

    //update turret direction
    if (this.scene.player.x > this.x) {
      this.turret.setFlipX(true);
      this.highTurret.setFlipX(true);
      this.turretAngleDEG = -1;
    } else {
      this.turret.setFlipX(false);
      this.highTurret.setFlipX(false);
      this.turretAngleDEG = -179;
    }

    //update shoot angle
    var lastAngle = this.turretAngleDEG;
    var betweenPoints = Phaser.Math.Angle.BetweenPoints;
    var angleDEG = Phaser.Math.RAD_TO_DEG * betweenPoints(this.turret, this.scene.player);
    if (((-180 < angleDEG) && (angleDEG < 10)) || (angleDEG > 170)) {
      this.turretAngleDEG = this.closestAngle(angleDEG);
      this.turretAngleRAD = Phaser.Math.DEG_TO_RAD * this.turretAngleDEG;
    }
  }

  closestAngle(angle) {
    /*
    function to find the closest allowed shoot angle to the one calculated
    between the player and the tank.
    Used to update shoot angle in this.adjustTurretPosition.
    */

    //angles that the tank can shoot at
    var shootAngles = [-179, -135, -45, -1];
    if (angle > 0) {
      angle = -180;
    }

    //iterate through values to find closest one to our angle parameter
    var curr = shootAngles[0];
    var diff = Math.abs(angle - curr);
    for (var val = 0; val < shootAngles.length; val++) {
      var newDiff = Math.abs(angle - shootAngles[val]);
      if (newDiff < diff) {
        diff = newDiff;
        curr = shootAngles[val];
      }
    }
    return curr
  }

  shoot(player) {
    /*
    function to define behavior of tank shooting at the player
    */
    console.log('[tank.shoot]');

    //swap visibility of turret sprites and handle animation
    if ((this.turretAngleDEG == -135) || (this.turretAngleDEG == -45)) {
      this.turret.visible = false;
      this.highTurret.visible = true;
      this.highTurret.play('tankAttackHigh');
    } else {
      this.turret.visible = true;
      this.highTurret.visible = false;
      this.turret.play('tankAttack');
    }

    var velocityFromRotation = this.scene.physics.velocityFromRotation;

    //create a variable called velocity from a vector2
    var velocity = new Phaser.Math.Vector2();
    velocityFromRotation(this.turretAngleRAD, this.shellSpeed, velocity);

    //get the shells group and generate shell
    var shell = this.shells.get();
    shell.setAngle(this.turretAngleDEG);
    shell
      .enableBody(true, this.turret.x, this.turret.y, true, true)
      .setVelocity(velocity.x, velocity.y)
      .setScale(1.2)

  }

  clusterBomb() {
    /*
    function to define behavior of tank's cluster bomb shooting at the player
    */
    console.log('[tank.clusterBomb]');

    //swap visibility of turret sprites and handle animation
    if ((this.turretAngleDEG == -135) || (this.turretAngleDEG == -45)) {
      this.turret.visible = false;
      this.highTurret.visible = true;
      this.highTurret.play('tankAttackHigh');
    } else {
      this.turret.visible = true;
      this.highTurret.visible = false;
      this.turret.play('tankAttack');
    }

    var velocityFromRotation = this.scene.physics.velocityFromRotation;

    //create a variable called velocity from a vector2
    var velocity = new Phaser.Math.Vector2();
    velocityFromRotation(this.turretAngleRAD, this.shellSpeed, velocity);

    //get the shells group and generate shell
    var bomb = this.bombs.get();
    bomb.setAngle(this.turretAngleDEG);
    bomb
      .enableBody(true, this.turret.x, this.turret.y, true, true)
      .setVelocity(velocity.x, velocity.y)
  }


  archeologistSwarm() {
    /*
    function called to spawn a swarm of enemies around the tank
    */
    var enemy = new EnemyArch({
      scene: this.scene,
      key: "archeologist",
      x: this.x,
      y: this.y
    });
    enemy.play("archeologistAnim");
    enemy.body.setCollideWorldBounds(true);
    enemy.setInteractive();
    this.scene.enemiesA.add(enemy);
  }

  soldierSwarm() {
    /*
    function called to spawn a swarm of enemies around the tank
    */
    var enemy = new EnemySoldier({
      scene: this.scene,
      key: "soldier",
      x: this.x,
      y: this.y
    });
    enemy.play("soldierAnim");
    enemy.body.setCollideWorldBounds(true);
    enemy.setInteractive();
    this.scene.enemiesS.add(enemy);
  }


  //TANK SHELLS HELPER FUNCTIONS
  shellHitWall(shell, worldLayer) {
    /*
    function to check each worldLayer tile the tank shell overlaps with for
    its collides property. destroys the shell if it encounters a tile with
    collides = true (i.e. the shell hit a wall tile)
    */
    if (worldLayer.collides) {
      console.log('[tank.shellHitWall]');
      shell.disableBody(true, true);
      this.bomb.play();
    }
  }

  shellHitPlayer(shell, player) {
    /*
    function to handle overlap between player and tank shell
    (i.e. tank shell hit player)
    */
    console.log('[tank.shellHitPlayer]');
    this.bomb.play();

    //disable shell
    shell.disableBody(true, true);

    if (player.isAttacking == false) {
      //update player stats
      this.player.updateHealth(5);
    }
  }

}
