/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

const SUIT = {
  SPADE: 0,
  DIAMOND: 1,
  CLOVER: 2,
  HEART: 3
};
/* harmony export (immutable) */ __webpack_exports__["l"] = SUIT;


const FACE = {
  JACK: 11,
  QUEEN: 12,
  KING: 13,
  ACE: 14
};
/* harmony export (immutable) */ __webpack_exports__["e"] = FACE;


const SPECIAL = {
  RESET: 2,
  INVISIBLE: 3,
  BURN: 10,
  REVERSE: 7
};
/* harmony export (immutable) */ __webpack_exports__["k"] = SPECIAL;


const CARD = {
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
/* harmony export (immutable) */ __webpack_exports__["b"] = CARD;


const DECK = {
  MAX_RENDER: 3,
  X: -50,
  Y: -35
};
/* harmony export (immutable) */ __webpack_exports__["d"] = DECK;


const PILE = {
  MAX_RENDER: 3,
  X: 10,
  Y: -35
};
/* harmony export (immutable) */ __webpack_exports__["i"] = PILE;


const PLAYER = {
  X: -80,
  Y: 300,
  FACEUP_DIST: 100,
  CARD_SPREAD: 55,
  FACEUP_X_OFF: 3,
  FACEUP_Y_OFF: 4
};
/* harmony export (immutable) */ __webpack_exports__["j"] = PLAYER;


const GAME = {
  PLAYERS: 4,
  DELAY: 500,
  DELAY2: 800
};
/* harmony export (immutable) */ __webpack_exports__["f"] = GAME;


const BOARD = {
  COLOR: 'rgb(8, 132, 36)'
};
/* harmony export (immutable) */ __webpack_exports__["a"] = BOARD;


const MESSAGE = {
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
/* harmony export (immutable) */ __webpack_exports__["h"] = MESSAGE;


const DEBUG = true;
/* harmony export (immutable) */ __webpack_exports__["c"] = DEBUG;

const LOG = true;
/* harmony export (immutable) */ __webpack_exports__["g"] = LOG;


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Game__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Constants__ = __webpack_require__(0);



function Karma() {
  var canvas = document.getElementById('board');
  canvas.width = document.body.clientWidth - 2;
  canvas.height = document.body.clientHeight - 2;
  if (canvas.getContext) {
    var game = new __WEBPACK_IMPORTED_MODULE_0__Game__["a" /* default */](canvas);
    game.init();
  }
}

document.addEventListener("DOMContentLoaded", function (event) {
  Karma();
});

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Constants__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Deck__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Player__ = __webpack_require__(6);




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

  init(nPlayers = __WEBPACK_IMPORTED_MODULE_0__Constants__["f" /* GAME */].PLAYERS) {
    this.ctx = this.canvas.getContext('2d');

    // DECK
    this.deck = new __WEBPACK_IMPORTED_MODULE_1__Deck__["a" /* default */](__WEBPACK_IMPORTED_MODULE_0__Constants__["d" /* DECK */].X, __WEBPACK_IMPORTED_MODULE_0__Constants__["d" /* DECK */].Y, __WEBPACK_IMPORTED_MODULE_0__Constants__["d" /* DECK */].MAX_RENDER);
    this.deck.generate(false);
    this.deck.shuffle();

    // PLAYERS
    this.players = [];
    // nPlayers = 0; // no players DEBUG
    for (var i = 0; i < nPlayers; i++) {
      var p = new __WEBPACK_IMPORTED_MODULE_2__Player__["a" /* default */](i == 0);

      var faceDowns = [];
      var faceUps = [];
      var hand = [];
      for (var j = 0; j < 3; j++) {
        faceDowns.push(this.deck.draw());

        var c = this.deck.draw();
        c.flip();
        faceUps.push(c);

        hand.push(this.deck.draw());
      }

      p.addToFaceDown(faceDowns);
      p.addToFaceUps(faceUps);
      p.addToHand(hand);

      // AI swap cards
      if (i > 0) {
        p.autoSwapCards();
      }

      this.players.push(p);
    }

    // PILE
    this.pile = new __WEBPACK_IMPORTED_MODULE_1__Deck__["a" /* default */](__WEBPACK_IMPORTED_MODULE_0__Constants__["i" /* PILE */].X, __WEBPACK_IMPORTED_MODULE_0__Constants__["i" /* PILE */].Y, __WEBPACK_IMPORTED_MODULE_0__Constants__["i" /* PILE */].MAX_RENDER);

    // CARD SWAPPING
    this.acceptInput = true;
    this.swapCards = true;
    this.canvas.addEventListener('mousedown', this.swapDown.bind(this));

    this.render();
  }

  loop() {
    // trigger the AI playing loop
    this.acceptInput = false;
    window.setTimeout(this.playAI, __WEBPACK_IMPORTED_MODULE_0__Constants__["f" /* GAME */].DELAY, this, 1);
  }

  playAI(game, index) {
    // timeout cascade function
    var p = game.players[index];

    if (__WEBPACK_IMPORTED_MODULE_0__Constants__["g" /* LOG */]) {
      console.log('Player ' + index);
    }

    if (p.isDone()) {
      if (index < game.players.length - 1) {
        window.setTimeout(game.playAI, __WEBPACK_IMPORTED_MODULE_0__Constants__["f" /* GAME */].DELAY, game, index + 1);
      } else {
        game.acceptInput = true;
      }
    } else {
      var total = p.play(game.pile.topValue());
      var delay = __WEBPACK_IMPORTED_MODULE_0__Constants__["f" /* GAME */].DELAY2;

      if (total == 0 && !game.deck.isEmpty()) {
        game.deck.flipTop();
      } else if (total == 0) {
        delay = 0; // don't wait and just pick up the card
      }

      game.render(game.ctx);
      window.setTimeout(this.playAICallback, delay, game, index);
    }
  }

  playAICallback(game, index) {
    var p = game.players[index];
    var cards = p.playCallback();

    if (cards[0] == null && game.deck.isEmpty() == false) {
      // could not play a card, attempt to flip
      if (__WEBPACK_IMPORTED_MODULE_0__Constants__["g" /* LOG */]) {
        console.log('AI flips deck');
      }
      cards[0] = game.deck.draw();
    }

    if (cards[0] == null) {
      // nothing in deck to flip...
      p.addToHand(game.pile.pickUp());

      if (__WEBPACK_IMPORTED_MODULE_0__Constants__["g" /* LOG */]) {
        console.log('picked up');
      }
    } else if (game.validPlay(cards, game.pile.topValue()) == false) {
      // not valid card
      if (__WEBPACK_IMPORTED_MODULE_0__Constants__["g" /* LOG */]) {
        console.log('Invalid play: ' + cards[0].value + ' on ' + game.pile.topValue());
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

      if (game.winners.length == 3) {
        // player got wrecked
        game.finished = true;
      }
    }
    game.render();

    if (index < game.players.length - 1) {
      window.setTimeout(game.playAI, __WEBPACK_IMPORTED_MODULE_0__Constants__["f" /* GAME */].DELAY, game, index + 1);
    } else {
      game.acceptInput = true;
    }
  }

  applyCards(cards) {
    if (__WEBPACK_IMPORTED_MODULE_0__Constants__["g" /* LOG */]) {
      var top = this.pile.isEmpty() ? 'nothing' : this.pile.peek().value;
      console.log('Played ' + cards.length + ' ' + cards[0].value + ' on ' + top);
    }

    for (var i = 0; i < cards.length; i++) {
      cards[i].setFaceUp(true);
    }

    var value = cards[0].value;

    if (value == __WEBPACK_IMPORTED_MODULE_0__Constants__["k" /* SPECIAL */].INVISIBLE && this.pile.isEmpty() == false) {
      for (i = 0; i < cards.length; i++) {
        cards[i].setTransparent(true);
      }
    }

    this.pile.place(cards);

    if (this.pile.peek().value == __WEBPACK_IMPORTED_MODULE_0__Constants__["k" /* SPECIAL */].BURN) {
      this.pile.pickUp(); // discard the pile
    }

    if (cards.length == 4) {
      this.pile.pickUp(); // discard the pile
    }

    if (this.pile.sameLastFour()) {
      this.pile.pickUp(); // discard the pile
    }
  }

  render() {
    // recenter
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    // clear the board
    this.ctx.clearRect(-this.canvas.height / 2, -this.canvas.width / 2, this.canvas.width, this.canvas.height);

    // render board
    this.ctx.fillStyle = __WEBPACK_IMPORTED_MODULE_0__Constants__["a" /* BOARD */].COLOR;
    this.ctx.fillRect(-this.canvas.width / 2, -this.canvas.height / 2, this.canvas.width, this.canvas.height);

    this.deck.render(this.ctx);
    this.pile.render(this.ctx);

    // show instructions
    if (this.swapCards) {
      this.ctx.fillStyle = __WEBPACK_IMPORTED_MODULE_0__Constants__["h" /* MESSAGE */].COLOR;
      this.ctx.font = __WEBPACK_IMPORTED_MODULE_0__Constants__["h" /* MESSAGE */].FONT;
      this.ctx.fillText('Click the deck to start playing', __WEBPACK_IMPORTED_MODULE_0__Constants__["h" /* MESSAGE */].ZONE1.x, __WEBPACK_IMPORTED_MODULE_0__Constants__["h" /* MESSAGE */].ZONE1.y);
      this.ctx.fillText('Swap cards by clicking them', __WEBPACK_IMPORTED_MODULE_0__Constants__["h" /* MESSAGE */].ZONE2.x, __WEBPACK_IMPORTED_MODULE_0__Constants__["h" /* MESSAGE */].ZONE2.y);
    }

    // render all players
    for (var j = 0; j < this.players.length; j++) {
      this.players[j].render(this.ctx);
      // rotate the canvas for each player
      this.ctx.rotate(360 / this.players.length * Math.PI / 180);
    }

    // render picked cards
    for (var i = 0; i < this.pickedCards.length; i++) {
      this.pickedCards[i].render(this.ctx);
    }

    // show scoreboard
    if (this.finished) {
      var position = this.winners.length + 1;
      this.ctx.fillStyle = __WEBPACK_IMPORTED_MODULE_0__Constants__["a" /* BOARD */].MESSAGECOLOR;
      this.ctx.font = __WEBPACK_IMPORTED_MODULE_0__Constants__["a" /* BOARD */].MESSAGEFONT;
      this.ctx.fillText('Congrats you finished #' + position, __WEBPACK_IMPORTED_MODULE_0__Constants__["h" /* MESSAGE */].ZONE1.x, __WEBPACK_IMPORTED_MODULE_0__Constants__["h" /* MESSAGE */].ZONE1.y);
    }

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  detectSelection(x, y) {
    var human = this.players[0];
    var card = human.pickCard(x, y, this.inputType);

    if (card == null && this.pickedCards.length == 0 && this.detectDeckClick(x, y)) {
      if (__WEBPACK_IMPORTED_MODULE_0__Constants__["g" /* LOG */]) {
        console.log('Player tries to flip the deck');
      }
      this.clickedOnDeck = true;
      this.pickedCards.push(this.deck.draw());
      this.acceptMove = false;
    }

    if (card == null && this.pickedCards.length == 0 && this.detectPileClick(x, y)) {
      if (__WEBPACK_IMPORTED_MODULE_0__Constants__["g" /* LOG */]) {
        console.log('Player picks up');
      }
      this.clickedOnPile = true;
      this.acceptMove = false;
    }

    if (card != null) {
      this.pickedCards.push(card);
    }
  }

  playCards() {
    var human = this.players[0];
    if (this.pickedCards.length > 0) {
      if (__WEBPACK_IMPORTED_MODULE_0__Constants__["g" /* LOG */]) {
        console.log('Human player');
      }

      this.clickedOnDeck = false;

      if (this.validPlay(this.pickedCards, this.pile.topValue())) {
        this.applyCards(this.pickedCards);

        while (this.deck.isEmpty() == false && human.cardsInHand() < 3) {
          human.addToHand([this.deck.draw()]);
        }

        if (human.isDone()) {
          // winning move
          this.finished = true;
          this.render();
          return;
        }
      } else {
        // invalid play
        if (__WEBPACK_IMPORTED_MODULE_0__Constants__["g" /* LOG */]) {
          console.log('Invalid play: ' + this.pickedCards[0].value + ' on ' + this.pile.topValue());
        }
        human.addToHand(this.pickedCards);
        human.addToHand(this.pile.pickUp());
      }
      this.render();
      this.loop();
    } else if (this.clickedOnPile) {
      if (__WEBPACK_IMPORTED_MODULE_0__Constants__["g" /* LOG */]) {
        console.log('Picked up the pile');
      }
      human.addToHand(this.pile.pickUp());
      this.clickedOnPile = false;
      this.render();
      this.loop();
    }
  }

  detectDeckClick(x, y) {
    if (x > this.deck.x && x < this.deck.x + __WEBPACK_IMPORTED_MODULE_0__Constants__["b" /* CARD */].WIDTH) {
      if (y > this.deck.y && y < this.deck.y + __WEBPACK_IMPORTED_MODULE_0__Constants__["b" /* CARD */].HEIGHT) {
        if (!this.deck.isEmpty()) {
          return true;
        }
      }
    }
    return false;
  }

  detectPileClick(x, y) {
    if (x > this.pile.x && x < this.pile.x + __WEBPACK_IMPORTED_MODULE_0__Constants__["b" /* CARD */].WIDTH) {
      if (y > this.pile.y && y < this.pile.y + __WEBPACK_IMPORTED_MODULE_0__Constants__["b" /* CARD */].HEIGHT) {
        if (!this.pile.isEmpty()) {
          return true;
        }
      }
    }
    return false;
  }

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
    if (topValue == __WEBPACK_IMPORTED_MODULE_0__Constants__["k" /* SPECIAL */].RESET) {
      return true;
    }

    // top is a 7
    if (topValue == __WEBPACK_IMPORTED_MODULE_0__Constants__["k" /* SPECIAL */].REVERSE) {
      if (cards[0].value <= __WEBPACK_IMPORTED_MODULE_0__Constants__["k" /* SPECIAL */].REVERSE) {
        return true;
      } else {
        return false;
      }
    }

    // just compare values
    return value >= topValue;
  }

  encodeGame() {
    var game = {};
    game.nPlayers = this.players.length;
    game.deck = this.deck.cardsRemaining();
    game.pile = this.pile.cardsRemaining();
    game.players = [];
    for (var i = 0; i < this.players.length; i++) {
      game.players.push(this.players[i].encode());
    }
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Game);

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Constants__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Card__ = __webpack_require__(4);



class Deck {
  constructor(x, y, maxRender) {
    this.x = x;
    this.y = y;
    this.cards = [];
    this.maxRender = maxRender;
  }

  generate(faceUp) {
    this.cards = [];
    for (var suit in __WEBPACK_IMPORTED_MODULE_0__Constants__["l" /* SUIT */]) {
      for (var value = 2; value < __WEBPACK_IMPORTED_MODULE_0__Constants__["e" /* FACE */].ACE; value++) {
        this.cards.push(new __WEBPACK_IMPORTED_MODULE_1__Card__["a" /* default */](value, __WEBPACK_IMPORTED_MODULE_0__Constants__["l" /* SUIT */][suit], this.x, this.y, faceUp, false));
      }
    }
  }

  render(ctx) {
    var count = 0;
    var max = Math.max(0, this.cards.length - this.maxRender);
    for (var i = max; i < this.cards.length; i++) {
      // offset the top cards
      this.cards[i].setPosition(this.x + 1 * count, this.y + 1 * count);
      this.cards[i].render(ctx);
      count += 1;
    }
  }

  shuffle() {
    var currentIndex = this.cards.length;
    var temporaryValue;
    var randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = this.cards[currentIndex];
      this.cards[currentIndex] = this.cards[randomIndex];
      this.cards[randomIndex] = temporaryValue;
    }
  }

  draw() {
    return this.cards.pop();
  }

  pickUp() {
    var cards = this.cards;
    this.cards = [];

    // because nobody wants to pick up transparent cards
    for (var i = 0; i < cards.length; i++) {
      cards[i].setTransparent(false);
    }

    return cards;
  }

  place(cards) {
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      card.setPosition(this.x, this.y);
      this.cards.push(card);
    }
  }

  isEmpty() {
    return this.cards.length == 0;
  }

  peek() {
    if (this.cards.length == 0) {
      return null;
    } else if (this.cards[this.cards.length - 1].faceUp) {
      return this.cards[this.cards.length - 1];
    } else {
      return null;
    }
  }

  sameLastFour() {
    if (this.cards.length < 4) {
      return false;
    }

    var total = 4;
    var value = this.cards[this.cards.length - 1].value;
    for (var i = 1; i < total; i++) {
      var index = this.cards.length - 1 - i;
      if (index < 0) {
        return false;
      }

      if (this.cards[index].value != __WEBPACK_IMPORTED_MODULE_0__Constants__["k" /* SPECIAL */].INVISIBLE && this.cards[index].value != value) {
        return false;
      } else if (this.cards[index].value == __WEBPACK_IMPORTED_MODULE_0__Constants__["k" /* SPECIAL */].INVISIBLE) {
        total += 1;
      }
    }
    return true;
  }

  topValue() {
    // gets the top on the pile, excluding INVISIBLE
    var i = this.cards.length - 1;
    while (i >= 0 && this.cards[i].value == __WEBPACK_IMPORTED_MODULE_0__Constants__["k" /* SPECIAL */].INVISIBLE) {
      i -= 1;
    }

    if (i < 0) {
      // there are only INVISIBLE or no pile
      return 0;
    } else {
      return this.cards[i].value;
    }
  }

  cardsRemaining() {
    return this.cards.length;
  }

  flipTop() {
    this.cards[this.cards.length - 1].flip();
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Deck);

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Constants__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__CardMap__ = __webpack_require__(5);



class Card {
  constructor(value, suit, x, y, faceUp, transparent) {
    // base attributes
    this.value = value;
    this.suit = suit;

    // geometry attributes
    this.x = x;
    this.y = y;
    this.height = __WEBPACK_IMPORTED_MODULE_0__Constants__["b" /* CARD */].HEIGHT;
    this.width = __WEBPACK_IMPORTED_MODULE_0__Constants__["b" /* CARD */].WIDTH;

    // visual attributes
    this.faceUp = faceUp != null ? faceUp : false;
    this.transparent = transparent != null ? transparent : false;

    // name in sprite sheet map
    this.name = this.getName(suit, value);
  }

  getName(suit, value) {
    var name = '';
    switch (suit) {
      case __WEBPACK_IMPORTED_MODULE_0__Constants__["l" /* SUIT */].SPADE:
        name += 'Spades';
        break;
      case __WEBPACK_IMPORTED_MODULE_0__Constants__["l" /* SUIT */].DIAMOND:
        name += 'Diamonds';
        break;
      case __WEBPACK_IMPORTED_MODULE_0__Constants__["l" /* SUIT */].CLOVER:
        name += 'Clubs';
        break;
      case __WEBPACK_IMPORTED_MODULE_0__Constants__["l" /* SUIT */].HEART:
        name += 'Hearts';
        break;
    }
    switch (value) {
      case __WEBPACK_IMPORTED_MODULE_0__Constants__["e" /* FACE */].JACK:
        name += 'J';
        break;
      case __WEBPACK_IMPORTED_MODULE_0__Constants__["e" /* FACE */].QUEEN:
        name += 'Q';
        break;
      case __WEBPACK_IMPORTED_MODULE_0__Constants__["e" /* FACE */].KING:
        name += 'K';
        break;
      case __WEBPACK_IMPORTED_MODULE_0__Constants__["e" /* FACE */].ACE:
        name += 'A';
        break;
      default:
        name += value;
        break;
    }
    return name;
  }

  render(ctx) {
    if (this.faceUp == false) {
      // render back of card
      this.drawCard(ctx, __WEBPACK_IMPORTED_MODULE_1__CardMap__["a" /* BACK_NAME */], __WEBPACK_IMPORTED_MODULE_1__CardMap__["b" /* BACK_SPRITE */]);
    } else if (this.transparent == true) {
      // render as transparent
      ctx.globalAlpha = __WEBPACK_IMPORTED_MODULE_0__Constants__["b" /* CARD */].INVISIBLE.OPACITY;
      ctx.fillStyle = __WEBPACK_IMPORTED_MODULE_0__Constants__["b" /* CARD */].INVISIBLE.COLOR;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.globalAlpha = 1;
    } else {
      // normal face up card
      this.drawCard(ctx, this.name, __WEBPACK_IMPORTED_MODULE_1__CardMap__["c" /* FRONT_SPRITE */]);
    }

    // in all cases draw the border
    ctx.fillStyle = __WEBPACK_IMPORTED_MODULE_0__Constants__["b" /* CARD */].BORDER_COLOR;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }

  drawCard(ctx, cardMapName, elementId) {
    var position = __WEBPACK_IMPORTED_MODULE_1__CardMap__["d" /* cardMap */][cardMapName];
    var sx = position.x;
    var sy = position.y;
    var sWidth = position.width;
    var sHeight = position.height;

    var dx = this.x;
    var dy = this.y;
    var dWidth = this.width;
    var dHeight = this.height;
    ctx.drawImage(document.getElementById(elementId), sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
  }

  flip() {
    this.faceUp = !this.faceUp;
  }

  setFaceUp(faceUp) {
    this.faceUp = faceUp;
  }

  setTransparetn(transparent) {
    this.transparent = transparent;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  compareTo(card) {
    if (card == null) {
      return 1;
    }

    return this.value - card.value;
  }

  isSpecial() {
    return this.value == __WEBPACK_IMPORTED_MODULE_0__Constants__["k" /* SPECIAL */].RESET || this.value == __WEBPACK_IMPORTED_MODULE_0__Constants__["k" /* SPECIAL */].INVISIBLE || this.value == __WEBPACK_IMPORTED_MODULE_0__Constants__["k" /* SPECIAL */].BURN;
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Card);

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// card sprite sheet thanks to http://opengameart.org/users/kenney

const FRONT_SPRITE = 'front';
/* harmony export (immutable) */ __webpack_exports__["c"] = FRONT_SPRITE;


const BACK_SPRITE = 'back';
/* harmony export (immutable) */ __webpack_exports__["b"] = BACK_SPRITE;

const BACK_NAME = 'cardBack_red2';
/* harmony export (immutable) */ __webpack_exports__["a"] = BACK_NAME;


const cardMap = {
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
/* harmony export (immutable) */ __webpack_exports__["d"] = cardMap;


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Constants__ = __webpack_require__(0);


class Player {
  constructor(human) {
    this.faceDownCards = [];
    this.faceUpCards = [];
    this.hand = [];

    this.x = __WEBPACK_IMPORTED_MODULE_0__Constants__["j" /* PLAYER */].X;
    this.y = __WEBPACK_IMPORTED_MODULE_0__Constants__["j" /* PLAYER */].Y;

    this.human = human;

    this.pickedCards = {
      index: 0,
      total: 0,
      value: 0,
      collection: null
    };
  }

  render(ctx) {
    this.reorderHand();
    // render face down cards
    for (var i = 0; i < this.faceDownCards.length; i++) {
      this.faceDownCards[i].render(ctx);
    }
    // render face up cards
    for (i = 0; i < this.faceUpCards.length; i++) {
      this.faceUpCards[i].render(ctx);
    }
    // render hand
    for (i = 0; i < this.hand.length; i++) {
      this.hand[i].render(ctx);
    }
  }

  addToFaceDown(cards) {
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      card.setPosition(this.x + __WEBPACK_IMPORTED_MODULE_0__Constants__["j" /* PLAYER */].CARD_SPREAD * i, this.y - __WEBPACK_IMPORTED_MODULE_0__Constants__["j" /* PLAYER */].FACEUP_DIST);
      this.faceDownCards.push(card);
    }
  }

  addToFaceUps(cards) {
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      card.setFaceUp(true);
      card.setPosition(this.x + __WEBPACK_IMPORTED_MODULE_0__Constants__["j" /* PLAYER */].CARD_SPREAD * i + __WEBPACK_IMPORTED_MODULE_0__Constants__["j" /* PLAYER */].FACEUP_X_OFF, this.y - (__WEBPACK_IMPORTED_MODULE_0__Constants__["j" /* PLAYER */].FACEUP_DIST - __WEBPACK_IMPORTED_MODULE_0__Constants__["j" /* PLAYER */].FACEUP_Y_OFF));
      this.faceUpCards.push(card);
    }
  }

  addToHand(cards) {
    var card = null;
    for (var i = 0; i < cards.length; i++) {
      card = cards[i];
      card.setFaceUp(this.human || __WEBPACK_IMPORTED_MODULE_0__Constants__["c" /* DEBUG */]);
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
    return this.noFaceDowns() && this.noFaceUps() && this.emptyHand();
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
    if (top == __WEBPACK_IMPORTED_MODULE_0__Constants__["k" /* SPECIAL */].REVERSE) {
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

    for (var i = 0; i < this.pickedCards.total; i++) {
      this.hand[this.pickedCards.index + i].setFaceUp(true);
    }
  }

  findAllCardsOfSameValue(cards, value) {
    var indices = [];
    for (var i = 0; i < cards.length; i++) {
      if (cards[i].value == value) {
        indices.push(i);
      }
    }
    return indices;
  }

  playFaceUp(top) {
    var min = null;

    if (top == __WEBPACK_IMPORTED_MODULE_0__Constants__["k" /* SPECIAL */].REVERSE) {
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
  }

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
  findMinAbove(top, cards) {
    // assume the cards are sorted
    var min = { index: null };
    for (var i = 0; i < cards.length; i++) {
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
    var min = { index: null };
    for (var i = 0; i < cards.length; i++) {
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
  }

  selectSpecial(cards) {
    for (var i = 0; i < cards.length; i++) {
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
    var offset = (this.hand.length - 3) / 2 * __WEBPACK_IMPORTED_MODULE_0__Constants__["j" /* PLAYER */].CARD_SPREAD * -1;
    for (var i = 0; i < this.hand.length; i++) {
      this.hand[i].setPosition(this.x + __WEBPACK_IMPORTED_MODULE_0__Constants__["j" /* PLAYER */].CARD_SPREAD * i + offset, this.y);
    }
  }

  clickedCard(x, y, card) {
    if (x > card.x && x < card.x + __WEBPACK_IMPORTED_MODULE_0__Constants__["b" /* CARD */].WIDTH) {
      if (y > card.y && y < card.y + __WEBPACK_IMPORTED_MODULE_0__Constants__["b" /* CARD */].HEIGHT) {
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
    var index = this.selectCard(x, y, type);
    var cards = this.getCards(type);

    if (index != null) {
      return cards.splice(index, 1)[0];
    } else {
      return null;
    }
  }

  selectCard(x, y, type) {
    var cards = this.getCards(type);

    var index = null;
    for (var i = 0; i < cards.length; i++) {
      if (this.clickedCard(x, y, cards[i])) {
        index = i;
        break;
      }
    }
    return index;
  }

  swapCards(handIndex, faceUpIndex) {
    var card = this.hand.splice(handIndex, 1)[0];
    card = this.faceUpCards.splice(faceUpIndex, 1, card);
    this.addToHand(card);
    this.reorderHand();

    // sneaky way to preserve order in among face up cards
    var temp = this.faceUpCards.splice(0, this.faceUpCards.length);
    this.addToFaceUps(temp);
  }

  getSpecialIndex(cards) {
    for (var i = 0; i < cards.length; i++) {
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
    for (var i = 0; i < this.faceUpCards.length; i++) {
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

/* harmony default export */ __webpack_exports__["a"] = (Player);

/***/ })
/******/ ]);