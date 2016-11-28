// card sprite sheet thanks to http://opengameart.org/users/kenney

var FRONT_SPRITE = 'front';

var BACK_SPRITE = 'back';
var BACK_NAME = 'cardBack_red2';

var cardMap = {
  SpadesQ: {
    height: 190,
    width: 140,
    y: 0,
    x: 0
  },
  SpadesK: {
    height: 190,
    width: 140,
    y: 190,
    x: 0
  },
  SpadesJ: {
    height: 190,
    width: 140,
    y: 380,
    x: 0
  },
  SpadesA: {
    height: 190,
    width: 140,
    y: 570,
    x: 0
  },
  Spades9: {
    height: 190,
    width: 140,
    y: 950,
    x: 0
  },
  Spades8: {
    height: 190,
    width: 140,
    y: 1140,
    x: 0
  },
  Spades7: {
    height: 190,
    width: 140,
    y: 1330,
    x: 0
  },
  Spades6: {
    height: 190,
    width: 140,
    y: 1520,
    x: 0
  },
  Spades5: {
    height: 190,
    width: 140,
    y: 1710,
    x: 0
  },
  Spades4: {
    height: 190,
    width: 140,
    y: 0,
    x: 140
  },
  Spades3: {
    height: 190,
    width: 140,
    y: 190,
    x: 140
  },
  Spades2: {
    height: 190,
    width: 140,
    y: 380,
    x: 140
  },
  Spades10: {
    height: 190,
    width: 140,
    y: 760,
    x: 0
  },
  Joker: {
    height: 190,
    width: 140,
    y: 570,
    x: 140
  },
  HeartsQ: {
    height: 190,
    width: 140,
    y: 760,
    x: 140
  },
  HeartsK: {
    height: 190,
    width: 140,
    y: 950,
    x: 140
  },
  HeartsJ: {
    height: 190,
    width: 140,
    y: 1140,
    x: 140
  },
  HeartsA: {
    height: 190,
    width: 140,
    y: 1330,
    x: 140
  },
  Hearts9: {
    height: 190,
    width: 140,
    y: 1710,
    x: 140
  },
  Hearts8: {
    height: 190,
    width: 140,
    y: 0,
    x: 280
  },
  Hearts7: {
    height: 190,
    width: 140,
    y: 190,
    x: 280
  },
  Hearts6: {
    height: 190,
    width: 140,
    y: 380,
    x: 280
  },
  Hearts5: {
    height: 190,
    width: 140,
    y: 570,
    x: 280
  },
  Hearts4: {
    height: 190,
    width: 140,
    y: 760,
    x: 280
  },
  Hearts3: {
    height: 190,
    width: 140,
    y: 950,
    x: 280
  },
  Hearts2: {
    height: 190,
    width: 140,
    y: 380,
    x: 700
  },
  Hearts10: {
    height: 190,
    width: 140,
    y: 1520,
    x: 140
  },
  DiamondsQ: {
    height: 190,
    width: 140,
    y: 1330,
    x: 280
  },
  DiamondsK: {
    height: 190,
    width: 140,
    y: 1520,
    x: 280
  },
  DiamondsJ: {
    height: 190,
    width: 140,
    y: 1710,
    x: 280
  },
  DiamondsA: {
    height: 190,
    width: 140,
    y: 0,
    x: 420
  },
  Diamonds9: {
    height: 190,
    width: 140,
    y: 380,
    x: 420
  },
  Diamonds8: {
    height: 190,
    width: 140,
    y: 570,
    x: 420
  },
  Diamonds7: {
    height: 190,
    width: 140,
    y: 760,
    x: 420
  },
  Diamonds6: {
    height: 190,
    width: 140,
    y: 950,
    x: 420
  },
  Diamonds5: {
    height: 190,
    width: 140,
    y: 1140,
    x: 420
  },
  Diamonds4: {
    height: 190,
    width: 140,
    y: 1330,
    x: 420
  },
  Diamonds3: {
    height: 190,
    width: 140,
    y: 1520,
    x: 420
  },
  Diamonds2: {
    height: 190,
    width: 140,
    y: 1710,
    x: 420
  },
  Diamonds10: {
    height: 190,
    width: 140,
    y: 190,
    x: 420
  },
  ClubsQ: {
    height: 190,
    width: 140,
    y: 0,
    x: 560
  },
  ClubsK: {
    height: 190,
    width: 140,
    y: 190,
    x: 560
  },
  ClubsJ: {
    height: 190,
    width: 140,
    y: 380,
    x: 560
  },
  ClubsA: {
    height: 190,
    width: 140,
    y: 570,
    x: 560
  },
  Clubs9: {
    height: 190,
    width: 140,
    y: 950,
    x: 560
  },
  Clubs8: {
    height: 190,
    width: 140,
    y: 1140,
    x: 560
  },
  Clubs7: {
    height: 190,
    width: 140,
    y: 1330,
    x: 560
  },
  Clubs6: {
    height: 190,
    width: 140,
    y: 1520,
    x: 560
  },
  Clubs5: {
    height: 190,
    width: 140,
    y: 1710,
    x: 560
  },
  Clubs4: {
    height: 190,
    width: 140,
    y: 0,
    x: 700
  },
  Clubs3: {
    height: 190,
    width: 140,
    y: 190,
    x: 700
  },
  Clubs2: {
    height: 190,
    width: 140,
    y: 1140,
    x: 280
  },
  Clubs10: {
    height: 190,
    width: 140,
    y: 760,
    x: 560
  },
  cardBack_red5: {
    height: 190,
    width: 140,
    y: 0,
    x: 0
  },
  cardBack_red4: {
    height: 190,
    width: 140,
    y: 190,
    x: 0
  },
  cardBack_red3: {
    height: 190,
    width: 140,
    y: 380,
    x: 0
  },
  cardBack_red2: {
    height: 190,
    width: 140,
    y: 570,
    x: 0
  },
  cardBack_red1: {
    height: 190,
    width: 140,
    y: 760,
    x: 0
  },
  cardBack_green5: {
    height: 190,
    width: 140,
    y: 0,
    x: 140
  },
  cardBack_green4: {
    height: 190,
    width: 140,
    y: 190,
    x: 140
  },
  cardBack_green3: {
    height: 190,
    width: 140,
    y: 760,
    x: 280
  },
  cardBack_green2: {
    height: 190,
    width: 140,
    y: 570,
    x: 140
  },
  cardBack_green1: {
    height: 190,
    width: 140,
    y: 760,
    x: 140
  },
  cardBack_blue5: {
    height: 190,
    width: 140,
    y: 0,
    x: 280
  },
  cardBack_blue4: {
    height: 190,
    width: 140,
    y: 190,
    x: 280
  },
  cardBack_blue3: {
    height: 190,
    width: 140,
    y: 380,
    x: 280
  },
  cardBack_blue2: {
    height: 190,
    width: 140,
    y: 570,
    x: 280
  },
  cardBack_blue1: {
    height: 190,
    width: 140,
    y: 380,
    x: 140
  }
};
