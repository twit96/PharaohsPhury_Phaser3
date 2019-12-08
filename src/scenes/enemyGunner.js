/*global Phaser*/
export default class EnemyGunner extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);

    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);

    this.body.setSize(20,55,50,80);

    //variables
    this.moveCounter = 0
    this.health = 30;

    this.speed = 100;
    this.bulletSpeed = 2000;
    this.isActive = true;

    //soldier bullets
    this.bullets = this.scene.physics.add.group({
      defaultKey: "bullet",
      allowGravity: false,
    });

  }

  //SOLDIER HELPER FUNCTIONS
  stun() {
    /**
    * function to delay this enemy's movement function when the player runs
    * into it, allowing the player time to run away.
    */
    console.log('[enemyGunner.stun]');

    this.isActive = false;
    this.body.setVelocityX(0);
    this.tint = 0xff0000;

    this.scene.time.addEvent({
      delay: 2000,
      callback: this.reset,
      callbackScope: this,
      loop: false
    });
  }
  reset() {
    /**
    function to start this enemy's movement function again after a delay.
    (if statement is a bug fix: does not reset if enemy was killed during delay)
    */
    if (this.health > 0) {
      console.log('[enemyGunner.reset]');
      this.isActive = true;
      this.setTint();
    }
  }

  updateHealth(damage) {
    /** To subtract damage from this enemy's health when player attacks it. */
    console.log('[enemyGunner.updateHealth]');

    this.health = this.health - damage;

    //handle "death" if necessary
    if (this.health <= 0) {
      this.scene.cry.play();

      this.isActive = false;
      this.scene.physics.world.disable(this);
      this.visible = false;
    }
  }

  move() {
    /** Creates this enemy's behavior loop. Only runs if this.isActive = true */

    if (this.isActive) {

      //UPDATE OR RESET COUNTER
      this.moveCounter ++;
      if (this.moveCounter > 300) {
        this.moveCounter = 0;
      }

      //HANDLE ANIMATIONS
      if (this.moveCounter == 0) {
        //walking animation to the right
        this.setFlipX(false);
        this.anims.play("gunnerAnim", true);

      } else if (this.moveCounter == 100) {
        //shooting animation
        this.anims.play("gunnerShotAnim", true);

      } else if (this.moveCounter == 120) {
        //shoot bullet at exactly 130
        var distance = (this.scene.player.x - this.x)
        if (distance > -800 && distance <800) {
        this.shoot();
      }

      } else if (this.moveCounter == 130) {
        //shoot bullet at exactly 130
        var distance = (this.scene.player.x - this.x)
        if (distance > -800 && distance <800) {
        this.shoot();
      }

      } else if (this.moveCounter == 140) {
        //shoot bullet at exactly 130
        var distance = (this.scene.player.x - this.x)
        if (distance > -800 && distance <800) {
        this.shoot();
      }

      } else if (this.moveCounter == 170) {
        //change to walking animation in opposite direction
        this.setFlipX(true);
        this.anims.play("gunnerAnim", true);
      }

      //HANDLE MOVEMENT
      if (this.moveCounter <= 100) {
        //walk to the right
        this.body.setSize(40, 64, 50, 50);
        this.body.setVelocityX(this.speed);

      } else if (this.moveCounter > 100 && this.moveCounter < 170 ) {
        //pause to allow shoot animation
        this.body.setSize(40, 64, 100, 100);
        this.body.setVelocityX(0);

      } else if (this.moveCounter >= 170) {
        //walk to the left
        this.body.setSize(40, 64, 50, 50);
        this.body.setVelocityX(-this.speed);
      }
    }
  }

  shoot(player) {
    /*
    function to define behavior of enemy shooting at the player
    */
    console.log("gunnershot");
    var bullet = this.bullets.create();
    bullet.setAngle(180);
    bullet.enableBody(true, this.x, (this.y+5), true, true);
    if (this.scene.player.x > this.x) {
      bullet.setVelocity(2000,0);
    } else {
      this.setFlipX(true);
      bullet.setVelocity(-2000,0);
    }
  }




  //SOLDIER BULLETS HELPER FUNCTIONS
  bulletHitWall(bullet, worldLayer, invisLayer) {
    /*
    function to check each worldLayer tile the soldier bullet overlaps with for
    its collides property. destroys the bullet if it encounters a tile with
    collides = true (i.e. the bullet hit a wall tile)
    */
    if (worldLayer.collides) {
      console.log('[enemyGunner.bulletHitWall]');
      bullet.disableBody(true, true);
    }

  }

  bulletHitPlayer(bullet, player) {
    /*
    function to handle overlap between player and tank shell
    (i.e. tank shell hit player)
    */
    console.log('[enemyGunner.bulletHitPlayer]');
    this.bomb.play();

    //disable shell
    bullet.disableBody(true, true);

    if (player.isAttacking == false) {
      //update player stats
      this.player.updateHealth(10);
    }
  }

}
