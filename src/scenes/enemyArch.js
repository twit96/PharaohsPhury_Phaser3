/*global Phaser*/
export default class EnemyArch extends Phaser.GameObjects.Sprite{
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);

    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);

    //variables
    this.moveCounter = 0
    this.health = 10;

    this.speed = 100;
    this.isActive = true;
  }

  //ARCHEOLOGIST HELPER FUNCTIONS
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
    console.log('[enemyArch.reset]');
    this.isActive = true;
  }

  updateHealth(damage) {
    /** To subtract damage from this enemy's health when player attacks it. */
    console.log('[enemyArch.updateHealth]');

    this.health = this.health - damage;

    //handle "death" if necessary
    if (this.health <= 0) {
      this.isActive = false;
      this.scene.physics.world.disable(this);
      this.visible = false;
    }
  }

  move() {
    /*
    function for back and forth movement
    */
    if (this.isActive) {

      //update or reset counter
      this.moveCounter ++;
      if (this.moveCounter == 500) {
        this.moveCounter = 0;
      }

      //handle movement and animations
      if (this.moveCounter < 250) {
        this.body.setVelocityX(this.speed);
        this.setFlipX(false);
      } else {
        this.body.setVelocityX(-this.speed);
        this.setFlipX(true);
      }

    }
  }
}
