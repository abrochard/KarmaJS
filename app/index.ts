import Game from './NewGame';

function Karma() {
    let canvas: any = document.getElementById('board');
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    if (canvas.getContext) {
        let game = new Game(canvas);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    Karma();
});
