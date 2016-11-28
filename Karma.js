function Karma() {
  var canvas = document.getElementById('board');
  if (canvas.getContext) {
    var game = new Game(canvas);
    game.init(GAME.PLAYERS);
  }
}
