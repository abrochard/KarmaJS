var Game = function(canvas) {
    this.canvas = canvas;
    this.ctx = null;
    this.deck = null;
    this.pile = null;
    this.players = [];
    this.winners = [];
    this.acceptInput = false;

    // EVENTS
    canvas.addEventListener('mousedown', function (e) {
        var x = e.x - this.canvas.width / 2;
        var y = e.y - this.canvas.height / 2;
        if (this.acceptInput) {
            this.detectSelection(x, y);
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

        if (!p.isDone()) {
            var card = p.play(game.pile.peek());

            if (card == null) { // could not play a card
                p.addToHand(game.pile.pickUp());
            } else if (game.validPlay(card, game.pile.peek()) == false) { // not valid card
                p.addToHand(game.pile.pickUp());
                p.addToHand([card]);
            } else {
                card.setFaceUp(true);
                game.pile.place(card);

                if (game.pile.peek().value == SPECIAL.BURN) {
                    game.pile.pickUp(); // discard the pile
                }

                if (game.deck.isEmpty() == false) {
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
        if (human.emptyHand() == false) {
            // detect hand cards
            card = human.pickFromHand(x, y);
        } else if (human.noFaceUps() == false) {
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
            if (this.validPlay(card, this.pile.peek())) {
                card.setFaceUp(true);
                this.pile.place(card);

                if (this.pile.peek().value == SPECIAL.BURN) {
                    this.pile.pickUp(); // discard the pile
                }

                if (this.deck.isEmpty() == false) {
                    human.addToHand([this.deck.draw()]);
                }

            } else {
                human.addToHand([card]);
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

    this.validPlay = function(card, top) {
        if (top == null) {
            return true;
        }

        if (card.isSpecial()) {
            return true;
        }

        if (top.value == SPECIAL.RESET) {
            return true;
        }

        return card.compareTo(top) >= 0;
    };

};
