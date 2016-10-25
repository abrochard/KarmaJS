
// Not the cleanest but efficient way to load all the scripts
document.write('<script type="text/javascript" src="Constants.js"></script>');
document.write('<script type="text/javascript" src="CardMap.js"></script>');
document.write('<script type="text/javascript" src="Card.js"></script>');
document.write('<script type="text/javascript" src="Deck.js"></script>');
document.write('<script type="text/javascript" src="Player.js"></script>');
document.write('<script type="text/javascript" src="Game.js"></script>');
document.write('<div style="display:none;"><img id="front" src="playingCards.png">' +
               '<img id="back" src="playingCardBacks.png"></div>');


function Karma(){
    var canvas = document.getElementById('board');
    if (canvas.getContext){
        var game = new Game(canvas);
        game.init(GAME.PLAYERS);
    }
}
