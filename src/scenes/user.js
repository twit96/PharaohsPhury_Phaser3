export default class User extends Phaser.GameObjects.Sprite{
  constructor(name) {
    this.userName = name;
    this.levelCompletion = [0,0,0,0,0,0,0,0];
  }
  islevelCompleted(level) {
    return this.levelCompletion[level] == 1;
  }
  levelNowCompleted(index){
    this.levelCompletion[index] = 1;
    return
  }
}


//// Discarded.
