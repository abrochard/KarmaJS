import _ from 'lodash';
import { GAME, SPECIAL, PILE, CARD, LOG, BOARD, DECK, MESSAGE } from './Constants';
import Deck from './Deck';
import Player from './Player';

import SwapEventListeners from './SwapEventListeners';

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = null;
    this.deck = null;
    this.pile = null;
    this.players = [];
    this.winners = [];

    this.pickedCards = [];
    this.selectedCards = [];
    this.acceptInput = false;
    this.acceptMove = false;
    this.inputType = '';
    this.swapCards = false;
    this.clickedOnPile = false;
    this.clickedOnDeck = false;

    this.finished = false;

    this.playAI = this.playAI.bind(this);
    this.playAICallback = this.playAICallback.bind(this);
    this.detectDeckClick = this.detectDeckClick.bind(this);
    this.detectPileClick = this.detectPileClick.bind(this);
    this.render = this.render.bind(this);

    this.selected = false;
    this.engaged = false;
    this.highligted = null;
    this.lastPosition = {};

    this.swapEL = null;
  }

  // EVENT LISTENERS
  pickDown(e) {
    if (this.acceptInput) {
      // start listening for hovering
      this.acceptMove = true;

      // determines which cards can be picked
      var human = this.players[0];
      if (human.emptyHand() == false) {
        // detect hand cards
        this.inputType = 'hand';
      } else if (human.noFaceUps() == false) {
        // detect face up cards
        this.inputType = 'faceup';
      } else {
        // detect facedown
        this.inputType = 'facedown';
      }

      // add the card clicked on
      var x = e.offsetX - this.canvas.width / 2;
      var y = e.offsetY - this.canvas.height / 2;
      this.detectSelection(x, y);

      if (this.inputType == 'facedown') {
        // can only play one facedown card per turn
        this.acceptMove = false;
        this.playCards();
        this.pickedCards = [];
      }
    }
  }

  pickMove(e) {
    if (this.acceptMove) {
      // detects what cards are being hovered over
      var x = e.offsetX - this.canvas.width / 2;
      var y = e.offsetY - this.canvas.height / 2;
      this.detectSelection(x, y);
    }
  }

  pickUp(e) {
    if (this.acceptMove || this.clickedOnPile || this.clickedOnDeck) {
      // stop listening for hovering and play cards
      this.acceptMove = false;
      this.playCards();
      this.pickedCards = [];
    }
  }

  swapDown(e) {
    if (this.swapCards == false) {
      return;
    }

    var human = this.players[0];
    var x = e.offsetX - this.canvas.width / 2;
    var y = e.offsetY - this.canvas.height / 2;

    if (this.detectDeckClick(x, y)) {
      // start the game
      this.swapCards = false;
      this.canvas.removeEventListener('mousedown', this.swapDown.bind(this));
      this.canvas.addEventListener('mousedown', this.pickDown.bind(this));
      this.canvas.addEventListener('mousemove', this.pickMove.bind(this));
      this.canvas.addEventListener('mouseup', this.pickUp.bind(this));
      this.render();
    } else {
      // swap cards
      var indices = [];
      indices.push(human.selectCard(x, y, 'hand'));
      indices.push(human.selectCard(x, y, 'faceup'));

      for (var i = 0; i < indices.length; i++) {
        var index = indices[i];
        if (index != null) {
          this.selectedCards.push(index);
          break;
        }
      }

      if (this.selectedCards.length == 2) {
        human.swapCards(this.selectedCards[1], this.selectedCards[0]);
        this.selectedCards = [];
        this.render();
      }
    }
  }

  init(nPlayers = GAME.PLAYERS) {
    this.ctx = this.canvas.getContext('2d');

    // DECK
    this.deck = new Deck(DECK.X, DECK.Y, DECK.MAX_RENDER);
    this.deck.generate(false);
    this.deck.shuffle();

    // PLAYERS
    this.players = [];
    _.range(nPlayers).forEach(i => {
      var p = new Player(i == 0);

      var faceDowns = [];
      var faceUps = [];
      var hand = [];
      _.range(3).forEach(() => {
        faceDowns.push(this.deck.draw());

        var c = this.deck.draw();
        c.flip();
        faceUps.push(c);

        hand.push(this.deck.draw());
      });

      p.addToFaceDown(faceDowns);
      p.addToFaceUps(faceUps);
      p.addToHand(hand);

      // AI swap cards
      if (i > 0) {
        p.autoSwapCards();
      }

      this.players.push(p);
    });

    // PILE
    this.pile = new Deck(PILE.X, PILE.Y, PILE.MAX_RENDER);

    // CARD SWAPPING
    this.acceptInput = true;
    this.swapCards = true;
    // this.canvas.addEventListener('mousedown', this.swapDown.bind(this));

    // NEW
    var swapFct = (handCard, faceUpCard) => {
      var human = this.players[0];
      var handIndex = _.indexOf(human.hand, handCard);
      var faceUpIndex = _.indexOf(human.faceUpCards, faceUpCard);
      human.swapCards(handIndex, faceUpIndex);
    };

    this.swapEL = new SwapEventListeners(
      this.canvas.width,
      this.canvas.height,
      this.render,
      (x, y) => {
        return this.players[0].selectCard(x, y, 'hand');
      },
      (x, y) => {
        return this.players[0].selectCard(x, y, 'faceup');
      },
      this.detectPileClick,
      this.detectDeckClick,
      swapFct,
      this.players[0].reorderHand.bind(this)
    );

    this.canvas.addEventListener('mousedown', this.swapEL.onMouseDown);
    this.canvas.addEventListener('mousemove', this.swapEL.onMouseMove);
    this.canvas.addEventListener('mouseup', this.swapEL.onMouseUp);

    this.render();
  };

  loop() {
    // trigger the AI playing loop
    this.acceptInput = false;
    window.setTimeout(this.playAI, GAME.DELAY, this, 1);
  };

  playAI(game, index) {
    // timeout cascade function
    var p = game.players[index];

    if (LOG) {
      console.log('Player ' + index);
    }

    if (p.isDone()) {
      if (index < game.players.length - 1) {
        window.setTimeout(game.playAI, GAME.DELAY, game, index + 1);
      } else {
        game.acceptInput = true;
      }
    } else {
      var total = p.play(game.pile.topValue());
      var delay = GAME.DELAY2;

      if (total == 0 && !game.deck.isEmpty()) {
        game.deck.flipTop();
      } else if (total == 0) {
        delay = 0;// don't wait and just pick up the card
      }

      game.render(game.ctx);
      window.setTimeout(this.playAICallback, delay, game, index);
    }
  };

  playAICallback(game, index) {
    var p = game.players[index];
    var cards = p.playCallback();

    if (cards[0] == null && game.deck.isEmpty() == false) { // could not play a card, attempt to flip
      if (LOG) {
        console.log('AI flips deck');
      }
      cards[0] = game.deck.draw();
    }

    if (cards[0] == null) { // nothing in deck to flip...
      p.addToHand(game.pile.pickUp());

      if (LOG) {
        console.log('picked up');
      }
    } else if (game.validPlay(cards, game.pile.topValue()) == false) { // not valid card
      if (LOG) {
        console.log('Invalid play: ' + cards[0].value +
                    ' on ' + game.pile.topValue());
      }

      p.addToHand(game.pile.pickUp());
      p.addToHand(cards);
    } else {
      game.applyCards(cards);

      while (game.deck.isEmpty() == false && p.cardsInHand() < 3) {
        p.addToHand([game.deck.draw()]);
      }
    }

    if (p.isDone()) {
      // this was the winning move
      game.winners.push(index);

      if (game.winners.length == 3) { // player got wrecked
        game.finished = true;
      }
    }
    game.render();

    if (index < game.players.length - 1) {
      window.setTimeout(game.playAI, GAME.DELAY, game, index + 1);
    } else {
      game.acceptInput = true;
    }
  };

  applyCards(cards) {
    if (LOG) {
      var top = this.pile.isEmpty() ? 'nothing' : this.pile.peek().value;
      console.log('Played ' + cards.length + ' ' +
                  cards[0].value + ' on ' + top);
    }

    cards.forEach(c => {
      c.setFaceUp(true);
    });

    var value = cards[0].value;

    if (value == SPECIAL.INVISIBLE && this.pile.isEmpty() == false) {
      cards.forEach(c => {
        c.setTransparent(true);
      });
    }

    this.pile.place(cards);

    if (this.pile.peek().value == SPECIAL.BURN) {
      this.pile.pickUp(); // discard the pile
    }

    if (cards.length == 4) {
      this.pile.pickUp(); // discard the pile
    }

    if (this.pile.sameLastFour()) {
      this.pile.pickUp(); // discard the pile
    }

  };

  render() {
    // recenter
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    // clear the board
    this.ctx.clearRect(
      -this.canvas.height / 2,
      -this.canvas.width / 2,
      this.canvas.width,
      this.canvas.height
    );

    // render board
    this.ctx.fillStyle = BOARD.COLOR;
    this.ctx.fillRect(
      -this.canvas.width / 2,
      -this.canvas.height / 2,
      this.canvas.width,
      this.canvas.height
    );

    this.deck.render(this.ctx);
    this.pile.render(this.ctx);

    // show instructions
    if (this.swapCards) {
      this.ctx.fillStyle = MESSAGE.COLOR;
      this.ctx.font = MESSAGE.FONT;
      this.ctx.fillText(
        'Click the deck to start playing',
        MESSAGE.ZONE1.x,
        MESSAGE.ZONE1.y
      );
      this.ctx.fillText(
        'Swap cards first',
        MESSAGE.ZONE2.x,
        MESSAGE.ZONE2.y
      );
    }

    // render all players
    this.players.forEach(p => {
      p.render(this.ctx);
      // rotate the canvas for each player
      this.ctx.rotate((360 / this.players.length) * Math.PI / 180);
    });

    // HACKY
    this.players[0].render(this.ctx);

    // render picked cards
    this.pickedCards.forEach(c => {
      c.render(this.ctx);
    });


    // show scoreboard
    if (this.finished) {
      var position = this.winners.length + 1;
      this.ctx.fillStyle = BOARD.MESSAGECOLOR;
      this.ctx.font = BOARD.MESSAGEFONT;
      this.ctx.fillText(
        'Congrats you finished #' + position,
        MESSAGE.ZONE1.x,
        MESSAGE.ZONE1.y
      );
    }

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  };

  detectSelection(x, y) {
    var human = this.players[0];
    var card = human.pickCard(x, y, this.inputType);

    if (card == null &&
        this.pickedCards.length == 0 &&
        this.detectDeckClick(x, y)) {
      if (LOG) {
        console.log('Player tries to flip the deck');
      }
      this.clickedOnDeck = true;
      this.pickedCards.push(this.deck.draw());
      this.acceptMove = false;
    }

    if (card == null &&
        this.pickedCards.length == 0 &&
        this.detectPileClick(x, y)) {
      if (LOG) {
        console.log('Player picks up');
      }
      this.clickedOnPile = true;
      this.acceptMove = false;
    }

    if (card != null) {
      this.pickedCards.push(card);
    }

  };

  playCards() {
    var human = this.players[0];
    if (this.pickedCards.length > 0) {
      if (LOG) {
        console.log('Human player');
      }

      this.clickedOnDeck = false;

      if (this.validPlay(this.pickedCards, this.pile.topValue())) {
        this.applyCards(this.pickedCards);

        while (this.deck.isEmpty() == false && human.cardsInHand() < 3) {
          human.addToHand([this.deck.draw()]);
        }

        if (human.isDone()) { // winning move
          this.finished = true;
          this.render();
          return;
        }

      } else { // invalid play
        if (LOG) {
          console.log('Invalid play: ' + this.pickedCards[0].value +
                      ' on ' + this.pile.topValue());
        }
        human.addToHand(this.pickedCards);
        human.addToHand(this.pile.pickUp());
      }
      this.render();
      this.loop();
    } else if (this.clickedOnPile) {
      if (LOG) {
        console.log('Picked up the pile');
      }
      human.addToHand(this.pile.pickUp());
      this.clickedOnPile = false;
      this.render();
      this.loop();
    }
  };

  detectDeckClick(x, y) {
    if (x > this.deck.x && x < this.deck.x + CARD.WIDTH) {
      if (y > this.deck.y && y < this.deck.y + CARD.HEIGHT) {
        if (!this.deck.isEmpty()) {
          return true;
        }
      }
    }
    return false;
  };

  detectPileClick(x, y) {
    if (x > this.pile.x && x < this.pile.x + CARD.WIDTH) {
      if (y > this.pile.y && y < this.pile.y + CARD.HEIGHT) {
        if (!this.pile.isEmpty()) {
          return true;
        }
      }
    }
    return false;
  };

  validPlay(cards, topValue) {
    // make sure all cards are of the same value
    var value = cards[0].value;
    for (var i = 1; i < cards.length; i++) {
      if (cards[i].value != value) {
        return false;
      }
    }

    // played four of a kind
    if (cards.length == 4) {
      return true;
    }

    // nothing on pile
    if (topValue == null || topValue == 0) {
      return true;
    }

    // played a special card
    if (cards[0].isSpecial()) {
      return true;
    }

    // played on top of a two
    if (topValue == SPECIAL.RESET) {
      return true;
    }

    // top is a 7
    if (topValue == SPECIAL.REVERSE) {
      if (cards[0].value <= SPECIAL.REVERSE) {
        return true;
      } else {
        return false;
      }
    }

    // just compare values
    return value >= topValue;
  };

  encodeGame() {
    var game = {};
    game.nPlayers = this.players.length;
    game.deck = this.deck.cardsRemaining();
    game.pile = this.pile.cardsRemaining();
    game.players = [];
    this.players.forEach(p => {
      game.players.push(p.encode());
    });
  }
}

export default Game;
