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
        var i = 0;
        while(i < maxRender && i < this.cards.length) {
            // offset the top cards
            this.cards[this.cards.length - 1 - i].setPosition(this.x + 1 * i, this.y + 1 * i);
            this.cards[this.cards.length - 1 - i].render(ctx);
            i += 1;
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

    this.place = function(card) {
        card.setPosition(this.x, this.y);
        this.cards.push(card);
    }
};
