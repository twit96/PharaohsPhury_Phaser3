/*global Phaser*/

export default {
  type: Phaser.AUTO,
  parent: 'phaser-example',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
  width: 800,
  height: 600,
  physics: {
    default: 'matter',
    matter: {
        gravity: { y: 2 },
        debug: false
    }
  },
//pixelArt: true
plugins: {
  scene: [
    {
      plugin: PhaserMatterCollisionPlugin, // The plugin class
      key: "matterCollision", // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
      mapping: "matterCollision" // Where to store in the Scene, e.g. scene.matterCollision
    }
  ]
}
};
