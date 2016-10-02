var Game = function(canvas) {
    this.canvas = canvas;
    this.ctx = null;
    this.deck = null;
    this.pile = null;
    this.players = [];
    this.winners = [];
    this.acceptInput = false;

    // EVENTS
    this.pointX = 0;
    this.pointY = 0;
    canvas.addEventListener('mousedown', function (e) {
        this.pointX = e.x - this.canvas.width / 2;
        this.pointY = e.y - this.canvas.height / 2;

        if (this.acceptInput) {
            if (this.pointX > this.deck.x && this.pointX < this.deck.x + CARD.WIDTH) {
                if (this.pointY > this.deck.y && this.pointY < this.deck.y + CARD.HEIGHT) {
                    if (!this.deck.isEmpty()) {
                        var card = this.deck.draw();
                        card.flip();
                        this.pile.place(card);
                        this.render();
                        this.loop();
                    }
                }
            }
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
            } else {
                card.setFaceUp(true);
                game.pile.place(card);
            }

            if (p.isDone()) {
                // this was the winning move
                game.winners.push(index);
            }
        }
        game.render();

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

};
