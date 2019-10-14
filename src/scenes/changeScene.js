export { addSceneEventListeners };

function addSceneEventListeners (that) {
    that.input.keyboard.on(
      "keydown_ESC",
        function () {
          console.log('\n[CHANGESCENE CALLED]');
          that.backgroundMusic.stop();
          that.scene.start('levelPicker');
        }
    );
}
