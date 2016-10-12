
var SUIT = {
    SPADE: 0,
    DIAMOND: 1,
    CLOVER: 2,
    HEART: 3
};

var FACE = {
    JACK: 11,
    QUEEN: 12,
    KING: 13,
    ACE: 14
};

var SPECIAL = {
    RESET: 2,
    INVISIBLE: 3,
    BURN: 10
};

var CARD = {
    HEIGHT: 70,
    WIDTH: 50,
    BACKCOLOR: "rgb(200,0,0)",
    BACKGROUNDCOLOR: "white",
    BORDERCOLOR: "black",
    VALUECOLOR: "black",
    FONT: "18px serif",
    INVISIBLE: {
        COLOR: "red",
        OPACITY: 0.3
    },
    SELECTED: {
        COLOR: "rgb(0,200,0)"
    }
};

var DECK = {
    MAXRENDER: 3,
    X: -50,
    Y: -35
};

var PILE = {
    MAXRENDER: 3,
    X: 10,
    Y: -35
};

var PLAYER = {
    X: -80,
    Y: 300,
    FACEUPDIST: 100,
    CARDSPREAD: 55,
    FACEUPXOFF: 3,
    FACEUPYOFF: 4
};

var GAME = {
    PLAYERS: 4,
    DELAY: 500
};

var DEBUG = false;
var LOG = true;
