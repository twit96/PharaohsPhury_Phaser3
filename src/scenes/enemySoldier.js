export default class EnemySoldier extends Phaser.GameObjects.Sprite{
  constructor(config) {
    super(config.scene, config.x, config.y, config.key, config.worldLayer);

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

    //tank shells
    this.shells = config.scene.physics.add.group({
      defaultKey: "bullet"
    });


    config.scene.physics.add.overlap(
      this.shells,
      config.worldLayer,
      this.shellHitWall,
      null,
      this
    );
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
    if (this.count >= 300) {this.count = 0;}

    //Soldier Movement and Animations
    if (this.count <= 100){
      this.body.setSize(40, 64, 50, 50);
      this.body.setVelocityX(moveForce);
      this.setFlipX(false);
      this.anims.play("soldierAnim", true);

    } else if (this.count > 100 && this.count <= 170 ){
        this.body.setVelocityX(0);
        this.anims.play("soldierShotAnim", true);
        this.shoot()
        this.body.setSize(40, 64, 100, 100);

    } else if (this.count >= 170) {
      this.body.setSize(40, 64, 50, 50);
      this.body.setVelocityX(-moveForce);
      this.setFlipX(true);
      this.anims.play("soldierAnim", true);
    }



}

shoot(){
  var shell = this.shells.get();
  shell.setAngle(180);
  shell
    .enableBody(true, this.x, this.y, true, true)
    .setVelocity(2000,0)

}

//TANK SHELLS HELPER FUNCTIONS
shellHitWall(shell, worldLayer) {
  /*
  function to check each worldLayer tile the tank shell overlaps with for
  its collides property. destroys the shell if it encounters a tile with
  collides = true (i.e. the shell hit a wall tile)
  */
  if (worldLayer.collides) {
    console.log('[shellHitWall]');
    shell.disableBody(true, true);
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
