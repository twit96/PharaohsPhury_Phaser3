/*global Phaser*/
export default class Mummy extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);

    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);

    this.body.setSize(20, 55, 50, 80);
    this.body.setBounce(0.2);

    //variables
    this.lives = 3;
    this.health = 100;
    this.canAttack = true;
    this.isAttacking = false;
    this.beamSpeed = 750;
    this.beamAngle;
    this.beamDirection = 0;

    this.diamondsCollected = 0;
    this.enemiesKilled = 0;
    this.gameOver = false;
    this.levelCompleted = false;

    //this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.cursors = this.scene.input.keyboard.addKeys({
      up:Phaser.Input.Keyboard.KeyCodes.W,
      left:Phaser.Input.Keyboard.KeyCodes.A,
      right:Phaser.Input.Keyboard.KeyCodes.D,
      space:Phaser.Input.Keyboard.KeyCodes.SPACE,
      m:Phaser.Input.Keyboard.KeyCodes.M
    });

    //long range attacks
    this.beams = this.scene.physics.add.group({
      defaultKey: "mummyBeam",
      allowGravity: false
    });
  }

  reset() {
    /*
    function to restore sprite defaults after a change in tint,
    canAttack, or being disabled after taking damage.
    */
    console.log('[mummy.reset]');

    this.anims.play("mummyCaneIdleAnim", true);
    this.body.setSize(20, 55, 50, 80);

    if (this.scene.scene.key == "level1"){
      this.anims.play("mummyIdleAnim", true);
    } else if (this.scene.scene.key == "level2"){
      this.anims.play("mummyCaneIdleAnim", true);
    } else if (this.scene.scene.key == "level3" || this.scene.scene.key == "finalBossLevel") {
      this.anims.play("pharoahCaneIdleAnim", true);
    }
    this.body.setSize(40, 64, 50, 50);

    this.setTint();
    this.canAttack = true;
    this.isAttacking = false;
    var x = this.x;
    var y = this.y;
  }

  updateHealth(damage) {
    /*
    function to subtract damage from player health,
    take away a life if health reaches 0,
    and update gameOver status based on that
    */
    console.log('[mummy.updateHealth]');

    //give damage to player health
    this.tint = 0xff0000;
    this.canAttack = false;
    this.health -= damage
    console.log('player health: ' + this.health);

    //update player lives if needed
    if (this.health <= 0) {
      //this.tint = 0x000000;

      this.x = this.scene.spawnX;
      this.y = this.scene.spawnY;

      this.lives -= 1;
      console.log('player lives: ' + this.lives);
      this.health = 100;

      //initiate gameOver if needed
      if (this.lives == 0) {
        console.log('gameOver: ' + this.gameOver);
        this.scene.physics.pause();
        this.gameOver = true;
      }
    }

    this.scene.time.addEvent({
      delay: 250,
      callback: this.reset,
      callbackScope: this,
      loop: false
    });

  }

  move() {
    //movement
    if (this.cursors.left.isDown) {
      this.flipX = true;
      this.beamDirection = 1;
      this.body.setVelocityX(-160);
      if (this.canAttack) {
        //animations only play while player is not attacking
        //animation dependent on level
        if (this.scene.scene.key == "level1"){
          this.anims.play("mummyWalkAnim", true);
        } else if (this.scene.scene.key == "level2"){
          this.anims.play("mummyCaneWalkAnim", true);
        } else if (this.scene.scene.key == "level3" || this.scene.scene.key == "finalBossLevel") {
          this.anims.play("pharoahCaneWalkAnim", true);
        }
      }
      this.beamAngle = Phaser.ANGLE_LEFT;
      //this.beam.flipX;
      this.beamSpeed = -750;

    } else if (this.cursors.right.isDown) {
      this.flipX = false;
      this.beamDirection = 0;
      this.body.setVelocityX(160);

      if (this.canAttack) {
        //animations only play while player is not attacking
        //animations dependent on level
        if (this.scene.scene.key == "level1"){
          this.anims.play("mummyWalkAnim", true);
        } else if (this.scene.scene.key == "level2"){
          this.anims.play("mummyCaneWalkAnim", true);
        } else if (this.scene.scene.key == "level3" || this.scene.scene.key == "finalBossLevel"){
          this.anims.play("pharoahCaneWalkAnim", true);
        }
      }
      this.beamAngle = Phaser.ANGLE_RIGHT;
      this.beamSpeed = 750;

    //idle
  } else if (this.canAttack) {
      this.body.setVelocityX(0);
      if (this.canAttack) {
        //animations only play while player is not attacking
        if (this.scene.scene.key == "level1"){
          this.anims.play("mummyIdleAnim", true);
        } else if (this.scene.scene.key == "level2"){
          this.anims.play("mummyCaneIdleAnim", true);
        } else if (this.scene.scene.key == "level3" || this.scene.scene.key == "finalBossLevel") {
          this.anims.play("pharoahCaneIdleAnim", true);
        }
      }
    }

    //jumping
    if (this.cursors.up.isDown && this.body.onFloor())  {
      //only jumps if sprite body is on ground
      this.body.setVelocityY(-330);
    }

    //short range attacks
    if (this.cursors.space.isDown) {
      this.shortRangeAttack();
    }

    //long range attacks
    if (this.cursors.m.isDown && this.canAttack && (this.scene.scene.key == "level3" || this.scene.scene.key == "finalBossLevel")) {
      //this.anims.play("mummyRangeCaneAnim", true);
      console.log('shoot');
      this.canAttack = false;
      this.anims.play("pharoahRangeCaneAnim");

      this.on('animationcomplete-pharoahRangeCaneAnim',  ()=>{
                     this.shoot();
                     }, this);
    }
  }

  shortRangeAttack() {
    if (this.scene.scene.key == "level2" || this.scene.scene.key == "level3") {
      /*
      function to define behavior of player using melee (short-range) attacks
      */
      console.log('[mummy.shortRangeAttack]');

      //temporarily disable more attacks
      this.canAttack = false;
      this.isAttacking = true;

      //generate a cane attack (or replace mummy sprite with attack sprite)
      this.caneAttack = this.scene.physics.add.sprite('mummyCane');
      this.body.setSize(64, 64, 50, 50);

       if (this.scene.scene.key == "level2"){
        this.anims.play("mummyCaneAnim", true);
      } else if (this.scene.scene.key == "level3" || this.scene.scene.key == "finalBossLevel"){
        this.anims.play("pharoahCaneAnim", true);
      }

      //attack audio

      //enable player attacks again after a delay
      this.scene.time.addEvent({
        delay: 500,
        callback: this.reset,
        callbackScope: this,
        loop: false
      });
    }
  }



  shoot() {
    /*
    function to define behavior of player shooting long range attacks
    */
    console.log('[mummy.shoot]');


    //temporarily disable more attacks
    this.canAttack = false;

    //generate a beam attack sprite
    var beam = this.beams.get();
    beam.setAngle(this.beamAngle);
    console.log(beam);
    if (this.beamDirection == 1){
      beam.flipX = true;
    } else {
      beam.flipX = false;
    }
    beam
      .enableBody(true, this.x, this.y- 15, true, true)
      .setVelocity(this.beamSpeed, 0)
      .setScale(2.5)
      .body.setSize(25, 8, 0, 0)
      .setOffset(12,20);

    // AUDIO
    this.scene.shootBeam.play({volume: 1});

    //enable player attacks again after a delay
    this.scene.time.addEvent({
      delay: 500,
      callback: this.reset,
      callbackScope: this,
      loop: false
    });
  }

  //PLAYER BEAMS HELPER FUNCTIONS
  beamHitWall(beam, worldLayer) {
    /*
    function to check each worldLayer tile the player beam overlaps with for
    its collides property. destroys the beam if it encounters a tile with
    collides = true (i.e. the beam hit a wall tile)
    */

    //make sure beam is outside of player before detecting collisions
    var playerWidthBox = this.player.width / 2;
    var playerHeightBox = this.player.height / 2;
    var toleranceX = Math.abs(this.player.x - beam.x);
    var toleranceY = Math.abs(this.player.y - beam.y);
    var beamHittingPlayer = true;

    //update beamHittingPlayer if beam is outside of player
    if (toleranceX > playerWidthBox && toleranceY > playerHeightBox) {
      beamHittingPlayer = false;
    }

    //test each worldLayer tile outside of player for collides = true
    if (worldLayer.collides && !beamHittingPlayer) {
      console.log('[mummy.beamHitWall]');
      beam.disableBody(true, true);
      this.shootBeam.play();
    }
  }

  beamHitTank(beam, tank) {
    /*
    function to handle overlap between player beam and tank
    (i.e. player beam hit tank)
    */
    console.log('[mummy.beamHitTank]');
    this.shootBeam.play();

    //disable shell
    beam.disableBody(true, true);

    //update player stats
    this.tank.updateHealth(10);
  }

  beamHitEnemy(beam, enemy) {
    /*
    function to handle overlap between player beam and enemy
    (i.e. player beam hit enemy)
    */
    console.log('[mummy.beamHitEnemy]');
    this.shootBeam.play();

    //disable beam
    beam.disableBody(true, true);

    //update player stats
    enemy.updateHealth(20);
  }

}
