import Game from './Game';

function Karma() {
    let canvas: any = document.getElementById('board');
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    if (canvas.getContext) {
        var game = new Game(canvas);
        game.init();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    Karma();
});
