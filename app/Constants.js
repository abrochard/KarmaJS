
export const SUIT = {
  SPADE: 0,
  DIAMOND: 1,
  CLOVER: 2,
  HEART: 3
};

export const FACE = {
  JACK: 11,
  QUEEN: 12,
  KING: 13,
  ACE: 14
};

export const SPECIAL = {
  RESET: 2,
  INVISIBLE: 3,
  BURN: 10,
  REVERSE: 7
};

export const CARD = {
  HEIGHT: 70,
  WIDTH: 50,
  BORDER_COLOR: 'black',
  INVISIBLE: {
    COLOR: 'red',
    OPACITY: 0.3
  },
  SELECTED: {
    COLOR: 'rgb(0,200,0)'
  }
};

export const DECK = {
  MAX_RENDER: 3,
  X: -50,
  Y: -35
};

export const PILE = {
  MAX_RENDER: 3,
  X: 10,
  Y: -35
};

export const PLAYER = {
  X: -80,
  Y: 300,
  FACEUP_DIST: 100,
  CARD_SPREAD: 55,
  FACEUP_X_OFF: 3,
  FACEUP_Y_OFF: 4
};

export const GAME = {
  PLAYERS: 4,
  DELAY: 500,
  DELAY2: 800
};

export const BOARD = {
  COLOR: 'rgb(8, 132, 36)'
};

export const MESSAGE = {
  ZONE1: {
    x: -120,
    y: 90
  },
  ZONE2: {
    x: -350,
    y: 270
  },
  FONT: '20px serif',
  COLOR: 'black'
};

export const DEBUG = true;
export const LOG = true;
