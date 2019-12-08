/*global Phaser*/
export default class Mummy extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);

    //MUMMY
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);
    this.body.setSize(20, 55, 50, 80);
    this.body.setBounce(0.2);

    //short range attacks
    this.canes = this.scene.physics.add.group({
      defaultKey: "caneHitbox",
      allowGravity: false
    });

    //long range attacks
    this.beams = this.scene.physics.add.group({
      defaultKey: "mummyBeam",
      allowGravity: false,
      setScale: { x: 2, y: 2}
    });

    //variables
    this.lives = 3;
    this.health = 100;
    this.isActive = true;
    this.canAttack = true;
    this.isAttacking = false;
    this.beamSpeed = 750;
    this.beamAngle;
    this.beamDirection = 0;
    this.MP = 5;
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

  }

  reset() {
    /*
    function to restore sprite defaults after a change in tint,
    canAttack, or being disabled after taking damage.
    */
    console.log('[mummy.reset]');

    if (this.scene.levelNum == "1" || this.scene.levelNum == "2"){
      this.anims.play("mummyIdleAnim", true);
    } else if (this.scene.levelNum == "3" || this.scene.levelNum == "4" || this.scene.levelNum == "5"){
      this.anims.play("mummyCaneIdleAnim", true);
    } else if (this.scene.levelNum == "6" || this.scene.levelNum == "7" || this.scene.levelNum == "8" || this.scene.levelNum == "0") {
      this.anims.play("pharoahCaneIdleAnim", true);
    }

    this.body.setSize(20, 55, 50, 80);
    this.setTint();
    this.isActive = true;
    this.canAttack = true;
    this.isAttacking = false;
    var x = this.x;
    var y = this.y;

    //disable any active canes
    this.canes.children.each(
      function (c) {
        if (c.active) {
          c.disableBody(true, true);
        }
      }.bind(this)
    );
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
    this.isActive = false;
    this.health -= damage;
    console.log('player health: ' + this.health);

    //update player lives if needed
    if (this.health <= 0) {
      this.scene.yell.play({volume: 2});

      this.body.setVelocityY(0);

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
    if (this.isActive) {
      if (this.cursors.left.isDown) {
        this.flipX = true;
        this.beamDirection = 1;
        this.body.setVelocityX(-220);

        if (this.canAttack) {
          //animations only play while player is not attacking
          //animation dependent on level
          if (this.scene.levelNum == "1" || this.scene.levelNum == "2"){
            this.anims.play("mummyWalkAnim", true);
          } else if (this.scene.levelNum == "3" || this.scene.levelNum == "4" || this.scene.levelNum == "5"){
            this.anims.play("mummyCaneWalkAnim", true);
          } else if (this.scene.levelNum == "6" || this.scene.levelNum == "7" || this.scene.levelNum == "8" || this.scene.levelNum == "0") {
            this.anims.play("pharoahCaneWalkAnim", true);
          }
        }

        this.beamAngle = Phaser.ANGLE_LEFT;
        //this.beam.flipX;
        this.beamSpeed = -750;

      } else if (this.cursors.right.isDown) {
        this.flipX = false;
        this.beamDirection = 0;
        this.body.setVelocityX(220);

        if (this.canAttack) {
          //animations only play while player is not attacking
          //animations dependent on level
          if (this.scene.levelNum == "1" || this.scene.levelNum == "2"){
            this.anims.play("mummyWalkAnim", true);
          } else if (this.scene.levelNum == "3" || this.scene.levelNum == "4" || this.scene.levelNum == "5"){
            this.anims.play("mummyCaneWalkAnim", true);
          } else if (this.scene.levelNum == "6" || this.scene.levelNum == "7" || this.scene.levelNum == "8" || this.scene.levelNum == "0"){
            this.anims.play("pharoahCaneWalkAnim", true);
          }
        }
        this.beamAngle = Phaser.ANGLE_RIGHT;
        this.beamSpeed = 750;

      //idle
      } else {
        this.body.setVelocityX(0);
        if (this.canAttack) {
          //animations only play while player is not attacking
          if (this.scene.levelNum == "1" || this.scene.levelNum == "2"){
            this.anims.play("mummyIdleAnim", true);
          } else if (this.scene.levelNum == "3" || this.scene.levelNum == "4" || this.scene.levelNum == "5"){
            this.anims.play("mummyCaneIdleAnim", true);
          } else if (this.scene.levelNum == "6" || this.scene.levelNum == "7" || this.scene.levelNum == "8" || this.scene.levelNum == "0") {
            this.anims.play("pharoahCaneIdleAnim", true);
          }
        }
      }

      //jumping
      if (this.cursors.up.isDown && this.body.onFloor())  {
        //only jumps if sprite body is on ground
        this.body.setVelocityY(-530);
      }

      //short range attacks
      if ((this.cursors.space.isDown) && (this.canAttack)) {
        this.shortRangeAttack();
      }

      //long range attacks
      if (this.cursors.m.isDown && this.canAttack && (this.scene.levelNum == "6" || this.scene.levelNum == "7" || this.scene.levelNum == "8" ||
       this.scene.levelNum == "0")) {
        this.canAttack = false;
        this.anims.play("pharoahRangeCaneAnim");

        this.scene.time.addEvent({
          delay: 500,
          callback: this.shoot,
          callbackScope: this,
          loop: false
        });
      }
    } else {
      //player is briefly stunned
      this.body.setVelocityX(0);
      this.body.setVelocityY(0);
    }
  }


  //PLAYER CANE ATTACK HELPER FUNCTIONS
  shortRangeAttack() {
    /*
    function to define behavior of player using melee (short-range) attacks
    */
    if (this.scene.levelNum == "3" || this.scene.levelNum == "4" || this.scene.levelNum == "5" || this.scene.levelNum == "6" || this.scene.levelNum == "7" || this.scene.levelNum == "8" ||
     this.scene.levelNum == "0") {
      console.log('[mummy.shortRangeAttack]');

      //temporarily disable more attacks
      this.canAttack = false;
      this.isAttacking = true;

      //generate a beam attack sprite
      var cane = this.canes.get();
      cane
        .enableBody(true, this.x, this.y, true, true)

       if (this.scene.levelNum == "3" || this.scene.levelNum == "4" || this.scene.levelNum == "5"){
        this.anims.play("mummyCaneAnim", true);
      } else if (this.scene.levelNum == "6" || this.scene.levelNum == "7" || this.scene.levelNum == "8" ||
       this.scene.levelNum == "0"){
        this.anims.play("pharoahCaneAnim", true);
      }

      //attack audio
      this.scene.meleeSound.play({volume: 1});

      //enable player attacks again after a delay
      this.scene.time.addEvent({
        delay: 500,
        callback: this.reset,
        callbackScope: this,
        loop: false
      });
    }
  }

  caneHitTank(cane, tank) {
    /*
    function to handle overlap between player cane and tank
    (i.e. player beam hit tank)
    */
    console.log('[mummy.caneHitTank]');

    //disable cane
    cane.disableBody(true, true);

    //knock player back
    this.body.setVelocityY(-50);
    this.body.setVelocityX(-50);

    //update tank stats
    this.tank.updateHealth(5);
  }

  caneHitEnemy(cane, enemy) {
    /*
    function to handle overlap between player cane and enemy
    (i.e. player beam hit enemy)
    */
    console.log('[mummy.caneHitEnemy]');

    //disable cane
    cane.disableBody(true, true);

    //update player stats
    enemy.updateHealth(20);
    enemy.stun();

    //generate diamond pyramid to burst from dead enemy

    // pyramid coordinates for diamonds
    var x = enemy.x;
    var y = enemy.y;
    var coors = [[x, (y-20)],
                 [(x-10), y], [(x+10), y],
               ];

    //spawn diamond pyramid
    var i;
    for (i = 0; i < coors.length; i++) {
      //spawn diamond
      var dX = coors[i][0];
      var dY = coors[i][1];
      this.spawnDiamond(dX, dY);
    }

    //generate pyramid of scrolls to burst from dead enemy
    if (this.levelNum >= 6 || this.levelNum == 0){
      var doesSpawn = Math.floor(Math.random() * Math.floor(3));
      if (doesSpawn > 0) {
        //scroll coordinates
        var x = enemy.x;
        var y = enemy.y;
        var coors = [[x, (y-30)],
                     [(x-10), (y-10)], [(x+10), (y-10)],
                   ];

        //spawn scrolls
        var randAmount = Math.floor(Math.random() * Math.floor(2) + 1);
        var x;
        for (i = 0; i < randAmount; i++) {
          //spawn diamond
          var dX = coors[i][0];
          var dY = coors[i][1];
          this.spawnScroll(dX, dY);
        }
      }
    }

  }


  //PLAYER BEAMS HELPER FUNCTIONS
  shoot() {
    /*
    function to define behavior of player shooting long range attacks
    */
    console.log('[mummy.shoot]');
    if (this.MP > 0) {
      //temporarily disable more attacks
      this.canAttack = false;

      //generate a beam attack sprite
      var beam = this.beams.get();

      beam.setAngle(this.beamAngle);

      if (this.beamDirection == 1){
        beam.flipX = true;
      } else {
        beam.flipX = false;
      }

      beam
        .enableBody(true, this.x, this.y - 15, true, true)
        .setVelocity(this.beamSpeed, 0)
        .setScale(2.5)

      // AUDIO
      this.scene.shootBeam.play({volume: 1});

      //enable player attacks again after a delay
      this.scene.time.addEvent({
        delay: 500,
        callback: this.reset,
        callbackScope: this,
        loop: false
      });
      this.MP --;
    }
  }

  beamHitWall(beam, worldLayer) {
    /*
    function to check each worldLayer tile the player beam overlaps with for
    its collides property. destroys the beam if it encounters a tile with
    collides = true (i.e. the beam hit a wall tile)
    */

    //test each worldLayer tile outside of player for collides = true
    if (worldLayer.collides) {
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
    enemy.updateHealth(30);
    enemy.isActive = false;

    //generate pyramid of diamonds to burst from dead enemy
    var x = enemy.x;
    var y = enemy.y;
    var coors = [[x, (y-40)],
                 [(x-10), (y-20)], [(x+10), (y-20)],
                 [(x-20), y], [x, y], [(x+20), y]
               ];

    //spawn diamond pyramid
    var i;
    for (i = 0; i < coors.length; i++) {
      //spawn diamond
      var dX = coors[i][0];
      var dY = coors[i][1];
      this.spawnDiamond(dX, dY);
    }

    //generate pyramid of scrolls to burst from dead enemy
    if (this.levelNum >= 6 || this.levelNum == 0){
      var doesSpawn = Math.floor(Math.random() * Math.floor(3));
      if (doesSpawn > 0) {
        //scroll coordinates
        var x = enemy.x;
        var y = enemy.y;
        var coors = [[x, (y-50)],
                     [(x-10), (y-30)], [(x+10), (y-30)],
                     [(x-20), (y-10)], [x, (y-10)], [(x+20), (y-10)]
                   ];

        //spawn scrolls
        var randAmount = Math.floor(Math.random() * Math.floor(5) + 1);
        var i;
        for (i = 0; i < randAmount; i++) {
          //spawn diamond
          var dX = coors[i][0];
          var dY = coors[i][1];
          this.spawnScroll(dX, dY);
        }
      }
    }

  }
}
