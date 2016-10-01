var Game = function(canvas) {
    this.canvas = canvas;
    this.ctx = null;
    this.deck = null;
    this.pile = null;
    this.players = [];
    this.winners = [];

    // EVENTS
    this.pointX = 0;
    this.pointY = 0;
    this.canvas.onmousedown = function (e) {
        this.pointX = e.x;
        this.pointY = e.y;
    };

    this.init = function(nPlayers) {
        this.ctx = this.canvas.getContext('2d');

        // DECK
        this.deck = new Deck(DECK.X, DECK.Y, DECK.MAXRENDER);
        this.deck.generate(false);
        this.deck.shuffle();

        // PLAYERS
        this.players = [];
        for(var i = 0; i < nPlayers; i++) {
            var p = new Player(i == 0);

            var faceDowns = [];
            var faceUps = [];
            var hand = [];
            for(var j = 0; j < 3; j++) {
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

        // TEST
        var x = this.deck.draw();
        x.flip();
        this.pile.place(x);

        // Game loop
        while(this.winners.length != nPlayers) {

            for(var i = 0; i < this.players.length; i++) {
                var p = this.players[i];

                if (!p.isDone()) {
                    p.play();

                    if (p.isDone()) {
                        // this was the winning move
                        this.winners.push(i);
                    }
                }

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
                for(var j = 0; j < this.players.length; j++) {
                    this.players[j].render(this.ctx);
                    // rotate the canvas for each player
                    this.ctx.rotate((360 / nPlayers) * Math.PI / 180);
                }
                this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            }
        }

        console.log('done');

    };

};
