var Deck = function(x, y, maxRender) {

    this.x = x;
    this.y = y;
    this.cards = [];
    this.maxRender = maxRender;

    this.generate = function(faceUp) {
        this.cards = [];
        for (var suit in SUIT) {
            for(var value = 2; value < FACE.ACE; value++) {
                this.cards.push(new Card(value, SUIT[suit], this.x, this.y, faceUp));
            }
        }
    };

    this.render = function(ctx) {
        var count = 0;
        for(var i = Math.max(0, this.cards.length - maxRender); i < this.cards.length; i++) {
            // offset the top cards
            this.cards[i].setPosition(this.x + 1 * count, this.y + 1 * count);
            this.cards[i].render(ctx);
            count += 1;
        }
    };

    this.shuffle = function() {
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
    };

    this.draw = function() {
        return this.cards.pop();
    };

    this.pickUp = function() {
        var cards = this.cards;
        this.cards = [];
        return cards;
    };

    this.place = function(card) {
        card.setPosition(this.x, this.y);
        this.cards.push(card);
    };

    this.isEmpty = function() {
        return this.cards.length == 0;
    };

    this.peek = function() {
        if (this.cards.length == 0) {
            return null;
        } else if (this.cards[this.cards.length - 1].faceUp) {
            return this.cards[this.cards.length - 1];
        } else {
            return null;
        }
    };
};
