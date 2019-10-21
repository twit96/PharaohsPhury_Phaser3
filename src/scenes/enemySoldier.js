export default class EnemySoldier extends Phaser.GameObjects.Sprite{
  constructor(config) {
    super(config.scene, config.x, config.y, config.key, config.worldLayer);

    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);

    this.body.setSize(40, 64, 50, 50);

    //variables
    this.isActive = true;
    this.moveCounter = 0;
    this.speed = 1.0;
    this.destroyed = false;

    config.scene.events.on("update", this.update, this);
    config.scene.events.once("shutdown", this.destroy, this);
    config.scene.events.once("destroy", this.destroy, this);

    //soldier bullets
    this.bullets = config.scene.physics.add.group({
      defaultKey: "bullet",
      allowGravity: false
    });
  }

  update() {
    if (this.destroyed) return;
    if (this.isActive) {
      this.move();
    } else {
      this.body.setVelocityX(0);
    }

  }

  stun() {
    console.log('[soldier.stun]');
    this.isActive = false;

    this.scene.time.addEvent({
      delay: 1000,
      callback: this.reset,
      callbackScope: this,
      loop: false
    });
  }
  reset() {
    console.log('[soldier.reset]');
    this.isActive = true;
  }

  move() {

    this.moveCounter ++;
    if (this.moveCounter >= 300) {
      this.moveCounter = 0;
    }

    //Soldier Movement and Animations
    if (this.moveCounter <= 100) {
      this.body.setSize(40, 64, 50, 50);
      this.body.setVelocityX(this.speed+100);
      this.setFlipX(false);
      this.anims.play("soldierAnim", true);

    } else if (this.moveCounter > 100 && this.moveCounter <= 170 ) {  
        this.anims.play("soldierShotAnim", true);
        this.body.setVelocityX(0);
        this.shoot();
        this.body.setSize(40, 64, 100, 100);

    } else if (this.moveCounter >= 170) {
      this.body.setSize(40, 64, 50, 50);
      this.body.setVelocityX(-this.speed-100);
      this.setFlipX(true);
      this.anims.play("soldierAnim", true);
    }

  }

  shoot () {
    var bullet = this.bullets.get();
    bullet.setAngle(180);
    bullet
      .enableBody(true, this.x, this.y, true, true)
      .setVelocity(2000,0)
  }

  //SOLDIER BULLETS HELPER FUNCTIONS
  bulletHitWall(bullet, worldLayer) {
    /*
    function to check each worldLayer tile the soldier bullet overlaps with for
    its collides property. destroys the bullet if it encounters a tile with
    collides = true (i.e. the bullet hit a wall tile)
    */
    if (worldLayer.collides) {
      console.log('[bulletHitWall]');
      bullet.disableBody(true, true);
    }
  }

  bulletHitPlayer(bullet, player) {
    /*
    function to handle overlap between player and tank shell
    (i.e. tank shell hit player)
    */
    console.log('[enemySoldier.bulletHitPlayer]');
    this.bomb.play();

    //disable shell
    bullet.disableBody(true, true);

    //update player stats
    this.player.updateHealth(50);
  }


 destro() {
   this.destroyed = true;

   // Event listeners
   this.scene.events.off("update", this.update, this);
   this.scene.events.off("shutdown", this.destroy, this);
   this.scene.events.off("destroy", this.destroy, this);

   this.destroy();
 }

}
