var Game = function(canvas) {
    this.canvas = canvas;
    this.ctx = null;
    this.deck = null;
    this.pile = null;
    this.players = [];
    this.winners = [];

    this.selectedCards = [];
    this.acceptInput = false;
    this.acceptMove = false;
    this.inputType = "";

    // EVENTS
    canvas.addEventListener('mousedown', function (e) {
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
            var x = e.x - this.canvas.width / 2;
            var y = e.y - this.canvas.height / 2;
            this.detectSelection(x, y);

            if (this.inputType == 'facedown') {
                // can only play one facedown card per turn
                this.acceptMove = false;
                this.playCards();
                this.selectedCards = [];
            }
        }
    }.bind(this));
    canvas.addEventListener('mousemove', function (e) {
        if (this.acceptMove) {
            // detects what cards are being hovered over
            var x = e.x - this.canvas.width / 2;
            var y = e.y - this.canvas.height / 2;
            this.detectSelection(x, y);
        }
    }.bind(this));
    canvas.addEventListener('mouseup', function (e) {
        if (this.acceptMove) {
            // stop listening for hovering and play cards
            this.acceptMove = false;
            this.playCards();
            this.selectedCards = [];
        }
    }.bind(this));


    this.init = function(nPlayers) {
        this.ctx = this.canvas.getContext('2d');

        // DECK
        this.deck = new Deck(DECK.X, DECK.Y, DECK.MAXRENDER);
        this.deck.generate(false);
        this.deck.shuffle();

        // PLAYERS
        this.players = [];
        for (var i = 0; i < nPlayers; i++) {
            var p = new Player(i == 0);

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
            this.players.push(p);
        }

        // PILE
        this.pile = new Deck(PILE.X, PILE.Y, PILE.MAXRENDER);

        this.render();

        this.acceptInput = true;
        console.log('done');
    };

    this.loop = function() {
        // trigger the AI playing loop
        this.acceptInput = false;
        window.setTimeout(this.playAI, GAME.DELAY, this, 1);
    };

    this.playAI = function(game, index) {
        // timeout cascade function
        var p = game.players[index];

        if (LOG) {
            console.log("Player " + index);
        }

        if (!p.isDone()) {
            var cards = p.play(game.pile.topValue());

            if (cards[0] == null) { // could not play a card
                p.addToHand(game.pile.pickUp());

                if (LOG) {
                    console.log("picked up");
                }
            } else if (game.validPlay(cards, game.pile.topValue()) == false) { // not valid card
                if (LOG) {
                    console.log("Invalid play: " + cards[0].value + " on " + game.pile.topValue());
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
            }
            game.render();
        }

        if (index < game.players.length - 1) {
            window.setTimeout(game.playAI, GAME.DELAY, game, index + 1);
        } else {
            game.acceptInput = true;
        }
    };

    this.applyCards = function(cards) {
        if (LOG) {
            var top = this.pile.isEmpty() ? "nothing": this.pile.peek().value;
            console.log("Played " + (cards.length + 1) + " " + cards[0].value + " on " + top);
        }

        for(var i = 0; i < cards.length; i++) {
            cards[i].setFaceUp(true);
        }

        var value = cards[0].value;

        if (value == SPECIAL.INVISIBLE && this.pile.isEmpty() == false) {
            for(var i = 0; i < cards.length; i++) {
                cards[i].setTransparent(true);
            }
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

    this.render = function() {
        this.ctx.translate(this.canvas.height / 2, this.canvas.width / 2); // recenter
        this.ctx.clearRect( // clear the board
            -this.canvas.height / 2,
            -this.canvas.width / 2,
            this.canvas.width,
            this.canvas.height
        );
        this.deck.render(this.ctx);
        this.pile.render(this.ctx);

        // render all players
        for (var j = 0; j < this.players.length; j++) {
            this.players[j].render(this.ctx);
            // rotate the canvas for each player
            this.ctx.rotate((360 / this.players.length) * Math.PI / 180);
        }
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    };

    this.detectSelection = function(x, y) {
        var human = this.players[0];
        var card = null;
        if (this.inputType == 'hand') {
            // detect hand cards
            card = human.pickFromHand(x, y, false);
        } else if (this.inputType == 'faceup') {
            // detect face up cards
            card = human.pickFromFaceUps(x, y);
        } else {
            // detect facedown
            card = human.pickFromFaceDowns(x, y);
        }

        // if (this.detectDeckClick(x, y)) {
        //     card = this.deck.draw();
        // }

        if (card != null) {
            this.selectedCards.push(card);
        }

    };

    this.playCards = function() {
        var human = this.players[0];
        if (this.selectedCards.length > 0) {
            if (LOG) {
                console.log("Human player");
            }

            if (this.validPlay(this.selectedCards, this.pile.topValue())) {
                this.applyCards(this.selectedCards);

                while (this.deck.isEmpty() == false && human.cardsInHand() < 3) {
                    human.addToHand([this.deck.draw()]);
                }

            } else { // invalid play
                if (LOG) {
                    console.log("Invalid play: " + this.selectedCards[0].value + " on " + this.pile.topValue());
                }
                human.addToHand(this.selectedCards);
                human.addToHand(this.pile.pickUp());
            }
            this.render();
            this.loop();
        }
    };

    this.detectDeckClick = function(x, y) {
        if (x > this.deck.x && x < this.deck.x + CARD.WIDTH) {
            if (y > this.deck.y && y < this.deck.y + CARD.HEIGHT) {
                if (!this.deck.isEmpty()) {
                    return true;
                }
            }
        }
        return false;
    };

    this.detectPileClick = function(x, y) {
        if (x > this.pile.x && x < this.pile.x + CARD.WIDTH) {
            if (y > this.pile.y && y < this.pile.y + CARD.HEIGHT) {
                if (!this.pile.isEmpty()) {
                    return true;
                }
            }
        }
        return false;
    };

    this.validPlay = function(cards, topValue) {
        // make sure all cards are of the same value
        var value = cards[0].value;
        for(var i = 1; i < cards.length; i++) {
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

        // just compare values
        return value >= topValue;
    };

};
