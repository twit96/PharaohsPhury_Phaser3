export { addSceneEventListeners };

function addSceneEventListeners (that) {
    that.input.keyboard.on(
      "keydown_ESC",
        function () {
          that.scene.start('levelPicker');
        }
    );

}
