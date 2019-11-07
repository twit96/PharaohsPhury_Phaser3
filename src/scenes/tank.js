/*global Phaser*/
export default class Tank extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);

    //TURRET
    this.turret = config.scene.add.sprite(config.x, config.y - 40, 'tankTurret');
    this.highTurret = config.scene.add.sprite(config.x, config.y - 60, 'tankTurretHigh');
    //this.turret.setFlipX(true);

    //BASE
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);
    this.body.setSize(192, 64);

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
    this.shellSpeed = 1000;
    this.isActive = true;

    //for behavior cycle
    this.moveCounter = 0;
    this.maxCount = 1000;
    this.maxCountIncrement = 500;

    //count values where tank does special attack
    this.triShootAttackCounts = [800, 1300, 1800];

    //angles that tank can shoot at
    this.shootAngles = [-179, -135, -45, -1];

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

      //TANK MOVEMENT
      if (this.moveCounter < (3 * this.maxCount / 4)) {
        this.x += this.speed;
        this.turret.x += this.speed;
        this.highTurret.x += this.speed;
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
      }

      //TRIPLE SHOT ATTACK
      //check if the move counter is at the preset values for triShoot attack
      if (this.triShootAttackCounts.indexOf(this.moveCounter) !== -1) {
        this.triShootAttack();
      }

      //CLUSTER BOMB ATTACK
      if (this.moveCounter == Math.floor(7 * this.maxCount / 8)) {
        this.clusterBomb();
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
    console.log('[tank.updateBehaviorLoop] - end of loop');

    //update length of behavior loop and moveCounter
    this.maxCount += this.maxCountIncrement;
    this.moveCounter = 0;

    //handle tank switching directions after three behavior loops
    if (this.maxCount > 2000) {
      console.log('behavior cycle reversing');

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

    //FIX POSITION ON TANK
    if (this.turret.y != this.y - 40) {
      this.turret.y = this.y - 40;
    }
    if (this.highTurret.y != this.y - 60) {
      this.highTurret.y = this.y - 60;
    }

    //UPDATE ANGLE VALUE
    if (this.scene.player.x > this.x) {
      this.turret.setFlipX(true);
      this.highTurret.setFlipX(true);
      this.turretAngleDEG = -1;
    } else {
      this.turret.setFlipX(false);
      this.highTurret.setFlipX(false);
      this.turretAngleDEG = -179;
    }
  }

  shoot(player) {
    /*
    function to define behavior of tank shooting at the player
    */
    console.log('[tank.shoot]');

    //this.turret.play('tankAttackHigh');
    this.turret.setFrame(3);

    var velocityFromRotation = this.scene.physics.velocityFromRotation;

    var deg = -135;
    var rad = Phaser.Math.DEG_TO_RAD * deg;

    //create a variable called velocity from a vector2
    var velocity = new Phaser.Math.Vector2();
    //velocityFromRotation(this.turretAngleRAD, this.shellSpeed, velocity);
    velocityFromRotation(rad, this.shellSpeed, velocity);

    //get the shells group and generate shell
    var shell = this.shells.get();
    shell.setAngle(deg);
    shell
      .enableBody(true, this.turret.x, this.turret.y, true, true)
      .setVelocity(velocity.x, velocity.y)

  }

  triShootAttack() {
    console.log('[tank.triShootAttack]');
  }

  clusterBomb() {
    /*
    function to define the behavior of the tank when it is stationary
    (in the last 1/4 of each behavior loop)
    */
    console.log('[tank.stationaryAttack]');
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

    //update player stats
    this.player.updateHealth(5);
  }

}
