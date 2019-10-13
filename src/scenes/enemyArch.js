export default class EnemyArch extends Phaser.GameObjects.Sprite{
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);

    // Create the physics-based sprite that we will move around and animate
    //this.sprite = config.scene.physics.add.sprite(config.x, config.y, "archeologist");

    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);

    this.body.setSize(40, 64, 50, 50);

    //intialize count
    this.count = 0;

    this.destroyed = false;
    config.scene.events.on("update", this.update, this);
    config.scene.events.once("shutdown", this.destroy, this);
    config.scene.events.once("destroy", this.destroy, this);
  }

  update() {
    if (this.destroyed) return;

    const sprite = this.sprite;
    //const velocity = sprite.body.velocity;
    //const isOnGround = this.isTouching.ground;
    //const isInAir = !isOnGround;

    // Adjust the movement so that the player is slower in the air
    //const moveForce = isOnGround ? 0.01 : 0.005;
    const moveForce = 140;
    //sprite.applyForce({ x: -moveForce, y: 0 });

    //count update for movment
    this.count ++
    if (this.count >= 200) {this.count = 0;}
    //console.log(this.count)

    if (this.count <= 100){
      this.body.setVelocityX(moveForce);
      this.setFlipX(false);
      this.anims.play("archeologistAnim", true);
    } else {
      this.body.setVelocityX(-moveForce);
      this.setFlipX(true);
      this.anims.play("archeologistAnim", true);
    }

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
