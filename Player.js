var Player = function(human) {

    this.faceDownCards = [];
    this.faceUpCards = [];
    this.hand = [];

    this.x = PLAYER.X;
    this.y = PLAYER.Y;

    this.human = human;

    this.render = function(ctx) {
        // render face down cards
        for(var i = 0; i < this.faceDownCards.length; i++) {
            this.faceDownCards[i].render(ctx);
        }
        // render face up cards
        for(var i = 0; i < this.faceUpCards.length; i++) {
            this.faceUpCards[i].render(ctx);
        }
        // render hand
        for(var i = 0; i < this.hand.length; i++) {
            this.hand[i].render(ctx);
        }
    };

    this.addToFaceDown = function(cards) {
        for(var i = 0; i < cards.length; i++) {
            var card = cards[i];
            card.setPosition(this.x + PLAYER.CARDSPREAD * i, this.y - PLAYER.FACEUPDIST);
            this.faceDownCards.push(card);
        }
    };

    this.addToFaceUps = function(cards) {
        for(var i = 0; i < cards.length; i++) {
            var card = cards[i];
            card.setPosition(
                this.x + PLAYER.CARDSPREAD * i + PLAYER.FACEUPXOFF,
                this.y - (PLAYER.FACEUPDIST - PLAYER.FACEUPYOFF)
            );
            this.faceUpCards.push(card);
        }
    };

    this.addToHand = function(cards) {
        for(var i = 0; i < cards.length; i++) {
            var card = cards[i];
            if (this.human) {
                card.flip();
            }
            card.setPosition(this.x + PLAYER.CARDSPREAD * i, this.y);
            this.hand.push(card);
        }
    };

    this.isDone = function() {
        return (this.faceDownCards.length == 0 && this.faceUpCards.length == 0 && this.hand.length == 0);
    };

    this.play = function() {
        this.faceDownCards.pop();
        this.faceUpCards.pop();
        this.hand.pop();
    };
};
