import Game from './Game';
import Constants from './Constants';

function Karma() {
  var canvas = document.getElementById('board');
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
  if (canvas.getContext) {
    var game = new Game(canvas);
    game.init();
  }
}

document.addEventListener("DOMContentLoaded", function(event) {
  Karma();
});
