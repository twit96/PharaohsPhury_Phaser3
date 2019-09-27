import MultiKey from "./multi-key.js";
import EnemyBasic from "./enemyBasic.js";
export default class Player {
  constructor(scene, x, y) {
    this.scene = scene;

    // Create physics-based sprite to move around and animate
    this.sprite = scene.matter.add.sprite(0, 0, "dude", 0);
    this.sprite.enableBody = true;

    const { Body, Bodies } = Phaser.Physics.Matter.Matter; // Native Matter modules
    const { width: w, height: h } = this.sprite;
    const mainBody = Bodies.rectangle(0, 0, w * 0.6, h, { chamfer: { radius: 10 } });

    this.sensors = {
      bottom: Bodies.rectangle(0, h * 0.5, w * 0.25, 2, { isSensor: true }),
      left: Bodies.rectangle(-w * 0.35, 0, 2, h * 0.5, { isSensor: true }),
      right: Bodies.rectangle(w * 0.35, 0, 2, h * 0.5, { isSensor: true })
    };

    const compoundBody = Body.create({
      parts: [mainBody, this.sensors.bottom, this.sensors.left, this.sensors.right],
      frictionStatic: 0,
      frictionAir: 0.02,
      friction: 0.2
    });

    this.x = x;
    this.y = y;
    this.sprite
      .setExistingBody(compoundBody)
      .setScale(1.3)
      .setFixedRotation() // Sets inertia to infinity so the player can't rotate
      .setPosition(x, y);
    this.lives = 3;
    this.gameOver = false;

    //add player control keyboard keys
    const { LEFT, RIGHT, UP, SPACE, A, D, W } = Phaser.Input.Keyboard.KeyCodes;
    this.leftInput = new MultiKey(scene, [LEFT, A]);
    this.rightInput = new MultiKey(scene, [RIGHT, D]);
    this.jumpInput = new MultiKey(scene, [UP, W]);
    this.attackInput = new MultiKey(scene, [SPACE]);

    this.scene.events.on("update", this.update, this);

    //track which sensors are touching something
    this.isTouching = { left: false, right: false, ground: false };

    //jump/attack "cooldown times"
    this.canJump = true;
    this.jumpCooldownTimer = null;
    this.canAttack = true;
    this.attackCooldownTimer = null;

    //before matter's update, reset our record of what surfaces the player is touching.
    scene.matter.world.on("beforeupdate", this.resetTouching, this);

    //if a sensor just started colliding with something, or it continues to collide with something,
    // call onSensorCollide
    scene.matterCollision.addOnCollideStart({
      objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
      callback: this.onSensorCollide,
      context: this
    });
    scene.matterCollision.addOnCollideActive({
      objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
      callback: this.onSensorCollide,
      context: this
    });
  }

  update() {
    //constants
    const sprite = this.sprite;
    const velocity = sprite.body.velocity;
    const isRightKeyDown = this.rightInput.isDown();
    const isLeftKeyDown = this.leftInput.isDown();
    const isJumpKeyDown = this.jumpInput.isDown();
    const isSpacebarDown = this.attackInput.isDown();
    const isOnGround = this.isTouching.ground;
    const isInAir = !isOnGround;
    var lives = this.lives;

    // Adjust the movement so that the player is slower in the air
    const moveForce = isOnGround ? 0.01 : 0.005;

    //player left movement
    if (isLeftKeyDown) {
      sprite.setFlipX(false);
      // Don't let the player push things left if they in the air
      if (!(isInAir && this.isTouching.left)) {
        sprite.applyForce({ x: -moveForce, y: 0 });
      }

    //player right movement
    } else if (isRightKeyDown) {
      sprite.setFlipX(true);
      // Don't let the player push things right if they in the air
      if (!(isInAir && this.isTouching.right)) {
        sprite.applyForce({ x: moveForce, y: 0 });
      }
    }

    // Limit horizontal speed, so player's velocity doesn't increase to infinity
    // leaving vertical velocity alone though, to avoid interfering with gravity
    if (velocity.x > 4) {
      sprite.setVelocityX(4);
    } else if (velocity.x < -4) {
      sprite.setVelocityX(-4);
    }

    //player jump movement
    if (isJumpKeyDown && this.canJump && isOnGround) {
      sprite.setVelocityY(-13);

      // Add delay between player jumps since bottom sensor will still collide
      // for a few frames after a jump
      this.canJump = false;
      this.jumpCooldownTimer = this.scene.time.addEvent({
        delay: 250,
        callback: () => (this.canJump = true)
      });
    }

    //player attack movement
    if (isSpacebarDown && this.canAttack) {
      console.log('player attacked')

      //generate attack
      //run animation
      //detect and handle collisions
      //despawn attack

      // Add delay between player attack just to be rude
      this.canAttack = false;
      this.attackCooldownTimer = this.scene.time.addEvent({
        delay: 250,
        callback: () => (this.canAttack = true)
      });
    }
  }

  //detect collisions on left, right, bottom of player sprite
  onSensorCollide({ bodyA, bodyB, pair }) {
    // We only care about collisions with physical objects
    if (bodyB.isSensor) {
      return
    };

    if (bodyA === this.sensors.left) {
      this.isTouching.left = true;
      if (pair.separation > 0.5) {
        this.sprite.x += pair.separation - 0.5
      };

    } else if (bodyA === this.sensors.right) {
      this.isTouching.right = true;
      if (pair.separation > 0.5) {
        this.sprite.x -= pair.separation - 0.5
      };

    } else if (bodyA === this.sensors.bottom) {
      // check if player hit bottom world bounds
      if (this.sprite.y > 480) {
        this.lives -= 1;
        console.log('lives left: ' + this.lives);

        if (this.lives <= 0) {
          this.gameOver = true;
          console.log('gameOver: ' + this.gameOver);
        } else {
          this.sprite.setPosition(this.x, this.y);
        }
      }
      // otherwise player is on a platform
      else {
        this.isTouching.ground = true;
      }
    }
  }

  resetTouching() {
    this.isTouching.left = false;
    this.isTouching.right = false;
    this.isTouching.ground = false;
  }

}
