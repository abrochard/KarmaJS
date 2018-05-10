import _ from 'lodash';
import { PLAYER, DEBUG, CARD, SPECIAL } from './Constants';

class Player {
  constructor(human) {
    this.faceDownCards = [];
    this.faceUpCards = [];
    this.hand = [];

    this.x = PLAYER.X;
    this.y = PLAYER.Y;

    this.human = human;

    this.pickedCards = {
      index: 0,
      total: 0,
      value: 0,
      collection: null
    };

    this.reorderHand = this.reorderHand.bind(this);
  }

  render(ctx) {
    var r = c => {
      c.render(ctx);
    };

    // this.reorderHand();

    // render face down cards
    this.faceDownCards.forEach(r);

    // render face up cards
    this.faceUpCards.forEach(r);

    // render hand
    this.hand.forEach(r);
  }

  addToFaceDown(cards) {
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      card.setPosition(this.x + PLAYER.CARD_SPREAD * i, this.y - PLAYER.FACEUP_DIST);
      this.faceDownCards.push(card);
    }
  }

  addToFaceUps(cards) {
    this.faceUpCards = _.concat(this.faceUpCards, cards);
    this.reAlignFaceUps();
  };

  addToHand(cards) {
    var card = null;
    for (var i = 0; i < cards.length; i++) {
      card = cards[i];
      card.setFaceUp(this.human || DEBUG);
      this.hand.push(card);
    }
    this.reorderHand();
  }

  emptyHand() {
    return this.hand.length == 0;
  }

  cardsInHand() {
    return this.hand.length;
  }

  noFaceUps() {
    return this.faceUpCards.length == 0;
  }

  noFaceDowns() {
    return this.faceDownCards.length == 0;
  }

  isDone() {
    return (this.noFaceDowns() && this.noFaceUps() && this.emptyHand());
  }

  play(top) {
    this.pickedCards.total = 0;

    if (this.hand.length > 0) {
      this.pickedCards.collection = this.hand;
      this.playHand(top);
    } else if (this.faceUpCards.length > 0) {
      this.pickedCards.collection = this.faceUpCards;
      this.playFaceUp(top);
    } else {
      this.pickedCards.collection = this.faceDownCards;
      this.pickedCards.total = 1;
      this.pickedCards.index = 0;

      this.faceDownCards[0].setFaceUp(true);
    }

    return this.pickedCards.total;
  }

  playCallback() {
    var cards = [null];
    if (this.pickedCards.total > 0) {
      cards = this.pickedCards.collection.splice(this.pickedCards.index, this.pickedCards.total);
      this.reorderHand();
      return cards;
    } else {
      return cards;
    }
  }

  playHand(top) {
    var min = null;
    if (top == SPECIAL.REVERSE) {
      min = this.findMinUnder(top, this.hand);
    } else {
      min = this.findMinAbove(top, this.hand);
    }

    if (min != null) {
      this.pickedCards.index = min.index;
      this.pickedCards.total = min.total;
      this.pickedCards.value = min.value;
    } else {
      var index = this.selectSpecial(this.hand);
      this.pickedCards.index = index;
      this.pickedCards.total = index != null ? 1 : 0;
    }

    for(var i = 0; i < this.pickedCards.total; i++) {
      this.hand[this.pickedCards.index + i].setFaceUp(true);
    }
  }

  findAllCardsOfSameValue(cards, value) {
    var indices = [];
    for(var i = 0; i < cards.length; i++) {
      if (cards[i].value == value) {
        indices.push(i);
      }
    }
    return indices;
  }

  playFaceUp(top) {
    var min = null;

    if (top == SPECIAL.REVERSE) {
      min = this.findMinUnder(top, this.faceUpCards);
    } else {
      min = this.findMinAbove(top, this.faceUpCards);
    }
    if (min != null) {
      this.pickedCards.index = min.index;
      this.pickedCards.total = min.total;
      this.pickedCards.value = min.value;
    } else {
      var special = this.selectSpecial(this.faceUpCards);
      if (special != null) {
        this.pickedCards.index = special;
        this.pickedCards.total = 1;
      } else {
        // just pick one
        this.pickedCards.index = 0;
        this.pickedCards.total = 1;
      }
    }
  };

  // this.playFaceUp = function(top) {
  //     var min = null;
  //     var indices = [];
  //     var i = 0;
  //     var cards = [];
  //     var c = null;

  //     if (top == SPECIAL.REVERSE) {
  //         min = this.findMinUnder(top, this.faceUpCards);
  //     } else {
  //         min = this.findMinAbove(top, this.faceUpCards);
  //     }
  //     if (min != null) {
  //         indices = findAllCardsOfSameValue(this.faceUpCards, min.value);
  //         cards = [];
  //         for(i = indices.length - 1; i >= 0; i--) {
  //             c = this.faceUpCards.splice(indices[i], 1)[0];
  //             cards.push(c);
  //         }
  //         return cards;
  //     } else {
  //         var special = this.selectSpecial(this.faceUpCards);
  //         if (special[0] != null) {
  //             special = special[0];
  //             indices = findAllCardsOfSameValue(this.faceUpCards, special.value);
  //             cards = [special];
  //             for(i = 0; i < indices.length; i++) {
  //                 c = this.faceUpCards.splice(indices[i], 1)[0];
  //                 cards.push(c);
  //             }
  //             return cards;
  //         } else {
  //             return [this.faceUpCards.pop()]; // just pick one
  //         }
  //     }
  // }
  ;

  findMinAbove(top, cards) {
    // assume the cards are sorted
    var min = {index: null};
    for(var i = 0; i < cards.length; i++) {
      if (cards[i].value >= top && !cards[i].isSpecial()) {
        if (min.index == null) {
          min.index = i;
          min.value = cards[i].value;
          min.total = 1;
        } else if (cards[i].value == min.value) {
          min.total += 1;
        } else {
          return min;
        }
      }
    }
    return min.index == null ? null : min;
  }

  findMinUnder(top, cards) {
    // assume the cards are sorted
    var min = {index: null};
    for(var i = 0; i < cards.length; i++) {
      if (cards[i].value <= top && !cards[i].isSpecial()) {
        if (min.index == null) {
          min.index = i;
          min.value = cards[i].value;
          min.total = 1;
        } else if (cards[i].value == min.value) {
          min.total += 1;
        } else {
          return min;
        }
      }
    }
    return min.index == null ? null : min;
  };

  selectSpecial(cards) {
    for(var i = 0; i < cards.length; i++) {
      if (cards[i].isSpecial()) {
        return i;
      }
    }
    return null;
  }

  reorderHand() {
    if (this.hand.length == 0) {
      return;
    }

    this.hand.sort(function (a, b) {
      return a.compareTo(b);
    });
    var offset = (this.hand.length - 3) / 2 * PLAYER.CARD_SPREAD * (-1);
    for(var i = 0; i < this.hand.length; i++) {
      this.hand[i].setPosition(this.x + PLAYER.CARD_SPREAD * i + offset, this.y);
    }
  }

  reAlignFaceUps() {
    this.faceUpCards.forEach((c, i) => {
      c.setFaceUp(true);
      c.setPosition(
        this.x + PLAYER.CARD_SPREAD * i + PLAYER.FACEUP_X_OFF,
        this.y - (PLAYER.FACEUP_DIST - PLAYER.FACEUP_Y_OFF)
      );
    });
  }

  clickedCard(x, y, card) {
    if (x > card.x && x < card.x + CARD.WIDTH) {
      if (y > card.y && y < card.y + CARD.HEIGHT) {
        return true;
      }
    }
    return false;
  }

  getCards(type) {
    var cards = [];
    if (type == 'hand') {
      cards = this.hand;
    } else if (type == 'faceup') {
      cards = this.faceUpCards;
    } else if (type == 'facedown') {
      cards = this.faceDownCards;
    }
    return cards;
  }

  pickCard(x, y, type) {
    var cards = this.getCards(type);
    var card = this.selectCard(x, y, type);
    if (card) {
      var index = cards.indexOf(card);
      return cards.splice(index, 1)[0];
    } else {
      return null;
    }
  }

  selectCard(x, y, type) {
    var cards = this.getCards(type);
    return _.find(cards, c => {
      return this.clickedCard(x, y, c);
    });
  }

  swapCards(handIndex, faceUpIndex) {
    var card = this.hand.splice(handIndex, 1)[0];
    card = this.faceUpCards.splice(faceUpIndex, 1, card);
    this.addToHand(card);
    this.reorderHand();
    this.reAlignFaceUps();
  }

  getSpecialIndex(cards) {
    for(var i = 0; i < cards.length; i++) {
      if (cards[i].isSpecial()) {
        return i;
      }
    }
    return -1;
  }

  autoSwapCards() {
    // tries to make the best swap possible,
    // with special and high cards ending up as face up
    this.reorderHand();
    var specialInHand = this.getSpecialIndex(this.hand);
    for(var i = 0; i < this.faceUpCards.length; i++) {
      if (this.faceUpCards[i].isSpecial() == false) {
        if (specialInHand >= 0) {
          this.swapCards(specialInHand, i);
          specialInHand = this.getSpecialIndex(this.hand);
        } else if (this.faceUpCards[i].value < this.hand[this.hand.length - 1].value) {
          // no special cards in hand
          // just pick the biggest one
          this.swapCards(this.hand.length - 1, i);
        }
      }
    }
    this.reorderHand();
  }

  encode() {
    var p = {};
    p.hand = this.hand.length;
    p.faceUpCards = this.faceUpCards.length;
    p.faceDownCards = this.faceDownCards.length;
    return p;
  }
}

export default Player;
