/*global Phaser*/
export default class Tank extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);

    //tank turret
    this.turret = config.scene.add.sprite(config.x, config.y - 40, 'tankTurret');
    this.turret.setFlipX(true);

    //tank body
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);
    this.body.setSize(192, 64);

    //tank shells
    this.shells = this.scene.physics.add.group({
      defaultKey: "shell"
    });

    //variables
    this.moveCounter = 0;
    this.turretAngleRAD;
    this.turretAngleDEG;

    this.health = 100;
    this.speed = 1.0;
    this.shellSpeed = 1000;
    this.isActive = true;

  }

  //TANK HELPER FUNCTIONS
  reset() {
    console.log('[resetTank]');
    this.tank.isActive = true;
  }

  updateHealth(damage) {
    /*
    function called when player beam hits tank.
    will subtract damage from tank health and if tank health = 0,
    it will update level levelCompleted status
    */
    console.log('[tank.updateHealth]');
    this.health = this.health - damage;
  }

  move() {
    /*
    function to create tank behavior loop:
    back and forth movement, calling shoot function periodically.
    only runs if this.activeTank = true
    */

    if (this.isActive) {
      this.moveCounter += 1

      //TURRET ANGLE
      var betweenPoints = Phaser.Math.Angle.BetweenPoints;
      var angleRAD = betweenPoints(this.turret, this.scene.player);
      var angleDEG = Phaser.Math.RAD_TO_DEG * angleRAD;

      if ((-180 < angleDEG) && (angleDEG < 10) || (angleDEG > 170)) {
        //update turret angle values for use in shoot function
        this.turretAngleRAD = angleRAD;
        this.turretAngleDEG = angleDEG;
        this.turret.setAngle(this.turretAngleDEG);

      } else {
        //reset angle values outside of the range the turret can shoot in
        this.turretAngleRAD = 10;
        this.turretAngleDEG = 10;
      }

      //TURRET X POSITION
      if (((this.turretAngleDEG < -90) || (this.turretAngleDEG > 170)) && (this.turret.x != this.x - 40)) {
        //adjust for flipping past vertical to the left
        this.turret.x -= 0.5;

      } else if ((this.turretAngleDEG > -90) && (this.turretAngleDEG < 10) && (this.turret.x != this.x)) {
        //adjust for flipping past vertical to the right
        this.turret.x += 0.5;
      }

      // TURRET Y POSITION TESTING
      // if (((this.turretAngleDEG > -155) && (this.turretAngleDEG < -25)) && (this.turret.y > this.y - 50)) {
      //   //adjust up for flipping turret over top of tank
      //   this.turret.y -= 0.5;
      //
      // } else if (this.turret.y < this.y - 40) {
      //   //adjust back down for turret in normal position
      //   this.turret.y += 0.5;
      //
      // } else {
      //   //if error, affix turret to top of tank
      //   this.turret.y = this.y - 40;
      // }

      //TURRET Y POSITION
      if (this.turret.y != this.y) {
        //affix turret to top of tank
        this.turret.y = this.y - 40;
      }

      //TANK MOVEMENT
      if (this.moveCounter < 250) {
        this.x += this.speed;
        this.turret.x += this.speed;
      } else {
        this.x -= this.speed;
        this.turret.x -= this.speed;
      }

      //TANK SHOOTING (5 times per count cycle)
      if (this.moveCounter % 100 == 0) {
        this.shoot(this.scene.player);
      }

      //REPEAT BEHAVIOR LOOP
      if (this.moveCounter == 500) {
        this.moveCounter = 0;
      }
    }
  }

  shoot(player) {
    /*
    function to define behavior of tank shooting at the player
    */

    if ((-180 < this.turretAngleDEG) && (this.turretAngleDEG < 10) || (this.turretAngleDEG > 170)) {
      console.log('[tank.shoot]');

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
    }
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
    this.player.updateHealth(50);
  }

}
