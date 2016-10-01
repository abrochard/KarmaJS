var Game = function(canvas) {
    this.canvas = canvas;
    this.ctx = null;
    this.deck = null;
    this.pile = null;
    this.players = [];

    this.init = function(nPlayers) {
        this.ctx = this.canvas.getContext('2d');
        this.ctx.translate(this.canvas.height / 2, this.canvas.width / 2); // recenter

        this.deck = new Deck(DECK.X, DECK.Y, DECK.MAXRENDER);
        this.deck.generate(false);
        this.deck.shuffle();

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

        this.pile = new Deck(PILE.X, PILE.Y, PILE.MAXRENDER);

        var x = this.deck.draw();
        x.flip();
        this.pile.place(x);

        // Game loop
        this.deck.render(this.ctx);
        this.pile.render(this.ctx);
        for(var i = 0; i < this.players.length; i++) {
            this.players[i].render(this.ctx);
            // rotate the canvas for each player
            this.ctx.rotate((360 / nPlayers) * Math.PI / 180);
        }

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    };

};
