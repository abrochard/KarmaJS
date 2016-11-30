var Game = function(canvas) {

  var self = this;

  self.canvas = canvas;
  self.ctx = null;
  self.deck = null;
  self.pile = null;
  self.players = [];
  self.winners = [];

  self.pickedCards = [];
  self.selectedCards = [];
  self.acceptInput = false;
  self.acceptMove = false;
  self.inputType = '';
  self.swapCards = false;
  self.clickedOnPile = false;
  self.clickedOnDeck = false;

  self.finished = false;

  // EVENT LISTENERS
  function pickDown(e) {
    if (self.acceptInput) {
      // start listening for hovering
      self.acceptMove = true;

      // determines which cards can be picked
      var human = self.players[0];
      if (human.emptyHand() == false) {
        // detect hand cards
        self.inputType = 'hand';
      } else if (human.noFaceUps() == false) {
        // detect face up cards
        self.inputType = 'faceup';
      } else {
        // detect facedown
        self.inputType = 'facedown';
      }

      // add the card clicked on
      var x = e.offsetX - self.canvas.width / 2;
      var y = e.offsetY - self.canvas.height / 2;
      self.detectSelection(x, y);

      if (self.inputType == 'facedown') {
        // can only play one facedown card per turn
        self.acceptMove = false;
        self.playCards();
        self.pickedCards = [];
      }
    }
  }

  function pickMove(e) {
    if (self.acceptMove) {
      // detects what cards are being hovered over
      var x = e.offsetX - self.canvas.width / 2;
      var y = e.offsetY - self.canvas.height / 2;
      self.detectSelection(x, y);
    }
  }

  function pickUp(e) {
    if (self.acceptMove || self.clickedOnPile || self.clickedOnDeck) {
      // stop listening for hovering and play cards
      self.acceptMove = false;
      self.playCards();
      self.pickedCards = [];
    }
  }

  function swapDown(e) {
    if (self.swapCards == false) {
      return;
    }

    var human = self.players[0];
    var x = e.offsetX - self.canvas.width / 2;
    var y = e.offsetY - self.canvas.height / 2;

    if (self.detectDeckClick(x, y)) {
      // start the game
      self.swapCards = false;
      self.canvas.removeEventListener('mousedown', swapDown); // why isn't self working?
      self.canvas.addEventListener('mousedown', pickDown.bind(self));
      self.canvas.addEventListener('mousemove', pickMove.bind(self));
      self.canvas.addEventListener('mouseup', pickUp.bind(self));
      self.render();
    } else {
      // swap cards
      var indices = [];
      indices.push(human.selectCard(x, y, 'hand'));
      indices.push(human.selectCard(x, y, 'faceup'));

      for (var i = 0; i < indices.length; i++) {
        var index = indices[i];
        if (index != null) {
          self.selectedCards.push(index);
          break;
        }
      }

      if (self.selectedCards.length == 2) {
        human.swapCards(self.selectedCards[1], self.selectedCards[0]);
        self.selectedCards = [];
        self.render();
      }
    }
  }

  self.init = function(nPlayers) {
    self.ctx = self.canvas.getContext('2d');

    // DECK
    self.deck = new Deck(DECK.X, DECK.Y, DECK.MAX_RENDER);
    self.deck.generate(false);
    self.deck.shuffle();

    // PLAYERS
    self.players = [];
    for (var i = 0; i < nPlayers; i++) {
      var p = new Player(i == 0);

      var faceDowns = [];
      var faceUps = [];
      var hand = [];
      for (var j = 0; j < 3; j++) {
        faceDowns.push(self.deck.draw());

        var c = self.deck.draw();
        c.flip();
        faceUps.push(c);

        hand.push(self.deck.draw());
      }

      p.addToFaceDown(faceDowns);
      p.addToFaceUps(faceUps);
      p.addToHand(hand);

      // AI swap cards
      if (i > 0) {
        p.autoSwapCards();
      }

      self.players.push(p);
    }

    // PILE
    self.pile = new Deck(PILE.X, PILE.Y, PILE.MAX_RENDER);

    // CARD SWAPPING
    self.acceptInput = true;
    self.swapCards = true;
    self.canvas.addEventListener('mousedown', swapDown.bind(self));

    self.render();
  };

  self.loop = function() {
    // trigger the AI playing loop
    self.acceptInput = false;
    window.setTimeout(self.playAI, GAME.DELAY, self, 1);
  };

  self.playAI = function(game, index) {
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
      window.setTimeout(self.playAICallback, delay, game, index);
    }
  };

  self.playAICallback = function(game, index) {
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
      // self was the winning move
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

  self.applyCards = function(cards) {
    if (LOG) {
      var top = self.pile.isEmpty() ? 'nothing' : self.pile.peek().value;
      console.log('Played ' + cards.length + ' ' +
                  cards[0].value + ' on ' + top);
    }

    for (var i = 0; i < cards.length; i++) {
      cards[i].setFaceUp(true);
    }

    var value = cards[0].value;

    if (value == SPECIAL.INVISIBLE && self.pile.isEmpty() == false) {
      for (i = 0; i < cards.length; i++) {
        cards[i].setTransparent(true);
      }
    }

    self.pile.place(cards);

    if (self.pile.peek().value == SPECIAL.BURN) {
      self.pile.pickUp(); // discard the pile
    }

    if (cards.length == 4) {
      self.pile.pickUp(); // discard the pile
    }

    if (self.pile.sameLastFour()) {
      self.pile.pickUp(); // discard the pile
    }

  };

  self.render = function() {
    // recenter
    self.ctx.translate(self.canvas.height / 2, self.canvas.width / 2);
    // clear the board
    self.ctx.clearRect(
      -self.canvas.height / 2,
      -self.canvas.width / 2,
      self.canvas.width,
      self.canvas.height
    );

    // render board
    self.ctx.fillStyle = BOARD.COLOR;
    self.ctx.fillRect(
      -self.canvas.height / 2,
      -self.canvas.width / 2,
      self.canvas.width,
      self.canvas.height
    );

    self.deck.render(self.ctx);
    self.pile.render(self.ctx);

    // show instructions
    if (self.swapCards) {
      self.ctx.fillStyle = MESSAGE.COLOR;
      self.ctx.font = MESSAGE.FONT;
      self.ctx.fillText(
        'Click the deck to start playing',
        MESSAGE.ZONE1.x,
        MESSAGE.ZONE1.y
      );
      self.ctx.fillText(
        'Swap cards by clicking them',
        MESSAGE.ZONE2.x,
        MESSAGE.ZONE2.y
      );
    }

    // render all players
    for (var j = 0; j < self.players.length; j++) {
      self.players[j].render(self.ctx);
      // rotate the canvas for each player
      self.ctx.rotate((360 / self.players.length) * Math.PI / 180);
    }

    // render picked cards
    for (var i = 0; i < self.pickedCards.length; i++) {
      self.pickedCards[i].render(self.ctx);
    }

    // show scoreboard
    if (self.finished) {
      var position = self.winners.length + 1;
      self.ctx.fillStyle = BOARD.MESSAGECOLOR;
      self.ctx.font = BOARD.MESSAGEFONT;
      self.ctx.fillText(
        'Congrats you finished #' + position,
        MESSAGE.ZONE1.x,
        MESSAGE.ZONE1.y
      );
    }

    self.ctx.setTransform(1, 0, 0, 1, 0, 0);
  };

  self.detectSelection = function(x, y) {
    var human = self.players[0];
    var card = human.pickCard(x, y, self.inputType);

    if (card == null &&
        self.pickedCards.length == 0 &&
        self.detectDeckClick(x, y)) {
      if (LOG) {
        console.log('Player tries to flip the deck');
      }
      self.clickedOnDeck = true;
      self.pickedCards.push(self.deck.draw());
      self.acceptMove = false;
    }

    if (card == null &&
        self.pickedCards.length == 0 &&
        self.detectPileClick(x, y)) {
      if (LOG) {
        console.log('Player picks up');
      }
      self.clickedOnPile = true;
      self.acceptMove = false;
    }

    if (card != null) {
      self.pickedCards.push(card);
    }

  };

  self.playCards = function() {
    var human = self.players[0];
    if (self.pickedCards.length > 0) {
      if (LOG) {
        console.log('Human player');
      }

      self.clickedOnDeck = false;

      if (self.validPlay(self.pickedCards, self.pile.topValue())) {
        self.applyCards(self.pickedCards);

        while (self.deck.isEmpty() == false && human.cardsInHand() < 3) {
          human.addToHand([self.deck.draw()]);
        }

        if (human.isDone()) { // winning move
          self.finished = true;
          self.render();
          return;
        }

      } else { // invalid play
        if (LOG) {
          console.log('Invalid play: ' + self.pickedCards[0].value +
                      ' on ' + self.pile.topValue());
        }
        human.addToHand(self.pickedCards);
        human.addToHand(self.pile.pickUp());
      }
      self.render();
      self.loop();
    } else if (self.clickedOnPile) {
      if (LOG) {
        console.log('Picked up the pile');
      }
      human.addToHand(self.pile.pickUp());
      self.clickedOnPile = false;
      self.render();
      self.loop();
    }
  };

  self.detectDeckClick = function(x, y) {
    if (x > self.deck.x && x < self.deck.x + CARD.WIDTH) {
      if (y > self.deck.y && y < self.deck.y + CARD.HEIGHT) {
        if (!self.deck.isEmpty()) {
          return true;
        }
      }
    }
    return false;
  };

  self.detectPileClick = function(x, y) {
    if (x > self.pile.x && x < self.pile.x + CARD.WIDTH) {
      if (y > self.pile.y && y < self.pile.y + CARD.HEIGHT) {
        if (!self.pile.isEmpty()) {
          return true;
        }
      }
    }
    return false;
  };

  self.validPlay = function(cards, topValue) {
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

  self.encodeGame = function() {
    var game = {};
    game.nPlayers = self.players.length;
    game.deck = self.deck.cardsRemaining();
    game.pile = self.pile.cardsRemaining();
    game.players = [];
    for (var i = 0; i < self.players.length; i++) {
      game.players.push(self.players[i].encode());
    }
  };
};
