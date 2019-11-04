/*global Phaser*/
export default class Tank extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);

    //tank body
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);
    this.body.setSize(192, 64);

    //tank turret
    this.turret = config.scene.add.sprite(config.x - 40, config.y - 50, 'tankTurret');


    //tank shells
    this.shells = this.scene.physics.add.group({
      defaultKey: "shell"
    });

    //variables
    this.moveCounter = 0
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

      //adjust turret position (workaround for sprite follow sprite)
      if (this.turret.y != (this.y - 50)) {
        this.turret.y = (this.y - 50);
      }
      if (this.turret.x != (this.x - 40)) {
        this.turret.x = (this.x - 40);
      }

      //adjust turret angle
      var betweenPoints = Phaser.Math.Angle.BetweenPoints;
      var angle = Phaser.Math.RAD_TO_DEG * betweenPoints(this.turret, this.scene.player);
      this.turret.setAngle(angle);

      //tank back and forth movement
      if (this.moveCounter < 250) {
        this.x += this.speed;
        this.turret.x += this.speed;
      } else {
        this.x -= this.speed;
        this.turret.x -= this.speed;
      }

      //tank shooting behavior (5 times per back and forth cycle)
      if (this.moveCounter % 100 == 0) {
        this.shoot(this.scene.player);
      }

      //reset count at 500 to repeat the behavior loop
      if (this.moveCounter == 500) {
        this.moveCounter = 0;
      }
    }
  }

  shoot(player) {
    /*
    function to define behavior of tank shooting at the player
    */
    console.log('[tank.shoot]');

    var betweenPoints = Phaser.Math.Angle.BetweenPoints;
    var angle = betweenPoints(this, this.scene.player);
    var velocityFromRotation = this.scene.physics.velocityFromRotation;

    //create a variable called velocity from a vector2
    var velocity = new Phaser.Math.Vector2();
    velocityFromRotation(angle, this.shellSpeed, velocity);

    //get the shells group and generate shell
    var shell = this.shells.get();
    shell.setAngle(Phaser.Math.RAD_TO_DEG * angle);
    shell
      .enableBody(true, this.x, this.y, true, true)
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
