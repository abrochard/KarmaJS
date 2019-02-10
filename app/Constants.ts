export const enum CardType {
    FaceUp,
    FaceDown,
    Hand
};

export const enum CardState {
    Default,
    Playable,
    Invalid
};

export const SUIT: any = {
    SPADE: 0,
    DIAMOND: 1,
    CLOVER: 2,
    HEART: 3
};

export const FACE: any = {
    JACK: 11,
    QUEEN: 12,
    KING: 13,
    ACE: 14
};

export const SPECIAL: any = {
    RESET: 2,
    INVISIBLE: 3,
    BURN: 10,
    REVERSE: 7
};

export const CARD: any = {
    HEIGHT: 100,
    WIDTH: 80,
    BORDER_COLOR: 'black',
    INVISIBLE: {
        COLOR: 'red',
        OPACITY: 0.3
    },
    HOVER: {
        COLOR: 'rgb(0,200,0)'
    },
    SELECTED: {
        COLOR: 'rgb(139,0,0)'
    }
};

export const DECK: any = {
    MAX_RENDER: 3,
    X: -90,
    Y: -35
};

export const PILE: any = {
    MAX_RENDER: 3,
    X: 10,
    Y: -35
};

export const PLAYER: any = {
    X: -80,
    Y: 300,
    FACEUP_DIST: 120,
    CARD_SPREAD: 85,
    FACEUP_X_OFF: 3,
    FACEUP_Y_OFF: 4
};

export const GAME: any = {
    PLAYERS: 4,
    DELAY: 500,
    DELAY2: 800
};

export const BOARD: any = {
    COLOR: 'rgb(8, 132, 36)'
};

export const MESSAGE: any = {
    ZONE1: {
        x: -120,
        y: 90
    },
    ZONE2: {
        x: -250,
        y: 270
    },
    FONT: '20px serif',
    COLOR: 'black'
};

export const DEBUG = false;
export const LOG = true;
