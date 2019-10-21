export default class EnemyArch extends Phaser.GameObjects.Sprite{
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);

    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);

    this.body.setSize(40, 64, 50, 50);

    //variables
    this.isActive = true;
    this.moveCounter = 0
    this.speed = 1.0;
    this.destroyed = false;

    config.scene.events.on("update", this.update, this);
    config.scene.events.once("shutdown", this.destroy, this);
    config.scene.events.once("destroy", this.destroy, this);
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
    console.log('[archeologist.stun]');
    this.isActive = false;

    this.scene.time.addEvent({
      delay: 1000,
      callback: this.reset,
      callbackScope: this,
      loop: false
    });
  }
  reset() {
    console.log('[archeologist.reset]');
    this.isActive = true;
  }

  move() {
    /*
    function for back and forth movement
    */
    this.moveCounter += 1

    if (this.moveCounter < 250) {
      this.body.setVelocityX(this.speed+100);
      this.setFlipX(false);
    } else {
      this.body.setVelocityX(-this.speed-100);
      this.setFlipX(true);
    }

    //reset count at 500 to repeat the behavior loop
    if (this.moveCounter == 500) {
      this.moveCounter = 0;
    }
  }

  destro() {
   this.destroyed = true;

   //event listeners
   this.scene.events.off("update", this.update, this);
   this.scene.events.off("shutdown", this.destroy, this);
   this.scene.events.off("destroy", this.destroy, this);

   this.destroy();
  }

}
