export default class EnemyArch {
  constructor(scene, x, y) {
    this.scene = scene;

    // Create the physics-based sprite that we will move around and animate
    this.sprite = scene.physics.add.sprite(x, y, "archeologist");
    this.sprite.body.setSize(40, 64, 50, 50);
    //this.sprite.enableBody = true;
    this.sprite.setCollideWorldBounds(true);

    //colliders
    // scene.physics.add.collider(this.sprite.body, worldLayer);
    // console.log(this);
    // console.log(scene);

    //intialize count
    this.count = 0;

    this.destroyed = false;
    this.scene.events.on("update", this.update, this);
    this.scene.events.once("shutdown", this.destroy, this);
    this.scene.events.once("destroy", this.destroy, this);
  }

  update() {
    if (this.destroyed) return;

    const sprite = this.sprite;
    const velocity = sprite.body.velocity;
    //const isOnGround = this.isTouching.ground;
    //const isInAir = !isOnGround;

    // Adjust the movement so that the player is slower in the air
    //const moveForce = isOnGround ? 0.01 : 0.005;
    const moveForce = 2;
    //sprite.applyForce({ x: -moveForce, y: 0 });

    //count update for movment
    this.count ++
    if (this.count >= 200) {this.count = 0;}
    //console.log(this.count)

    if (this.count <= 100){
      this.sprite.x -= moveForce;
      sprite.setFlipX(false);
    } else {
      this.sprite.x += moveForce;
      sprite.setFlipX(true);
    }

 // Limit horizontal speed, without this the player's velocity would just keep increasing to
 // absurd speeds. We don't want to touch the vertical velocity though, so that we don't
 // interfere with gravity.
 if (velocity.x > 7) sprite.setVelocityX(7);
 else if (velocity.x < -7) sprite.setVelocityX(-7);
}


 onSensorCollide({ bodyA, bodyB, pair }) {
   if (bodyB.isSensor) return; // We only care about collisions with physical objects
   if (bodyA === this.sensors.left) {
     this.isTouching.left = true;
     if (pair.separation > 0.5) this.sprite.x += pair.separation - 0.5;
   } else if (bodyA === this.sensors.right) {
     this.isTouching.right = true;
     if (pair.separation > 0.5) this.sprite.x -= pair.separation - 0.5;
   } else if (bodyA === this.sensors.bottom) {
     this.isTouching.ground = true;
   }
 }

 resetTouching() {
   this.isTouching.left = false;
   this.isTouching.right = false;
   this.isTouching.ground = false;
 }

 destroy() {
   this.destroyed = true;

   // Event listeners
   this.scene.events.off("update", this.update, this);
   this.scene.events.off("shutdown", this.destroy, this);
   this.scene.events.off("destroy", this.destroy, this);
   if (this.scene.matter.world) {
     this.scene.matter.world.off("beforeupdate", this.resetTouching, this);
   }

   // Matter collision plugin
   const sensors = [this.sensors.bottom, this.sensors.left, this.sensors.right];
   this.scene.matterCollision.removeOnCollideStart({ objectA: sensors });
   this.scene.matterCollision.removeOnCollideActive({ objectA: sensors });

   // Don't want any timers triggering post-mortem
   if (this.jumpCooldownTimer) this.jumpCooldownTimer.destroy();

   this.sprite.destroy();
 }

}
