var Deck = function(x, y, maxRender) {

    this.x = x;
    this.y = y;
    this.cards = [];
    this.maxRender = maxRender;

    this.generate = function(faceUp) {
        this.cards = [];
        for (var suit in SUIT) {
            for(var value = 2; value < FACE.ACE; value++) {
                this.cards.push(new Card(value, SUIT[suit], this.x, this.y, faceUp, false));
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

        // because nobody wants to pick up transparent cards
        for(var i = 0; i < cards.length; i++) {
            cards[i].setTransparent(false);
        }

        return cards;
    };

    this.place = function(cards) {
        for(var i = 0; i < cards.length; i++) {
            var card = cards[i];
            card.setPosition(this.x, this.y);
            this.cards.push(card);
        }
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

    this.sameLastFour = function() {
        if (this.cards.length < 4) {
            return false;
        }

        var total = 4;
        var value = this.cards[this.cards.length - 1].value;
        for(var i = 1; i < total; i++) {
            var index = this.cards.length - 1 - i;
            if (index < 0) {
                return false;
            }

            if (this.cards[index].value != SPECIAL.INVISIBLE && this.cards[index].value != value) {
                return false;
            } else if (this.cards[index].value == SPECIAL.INVISIBLE) {
                total += 1;
            }
        }
        return true;
    };

    this.topValue = function() {
        // gets the top on the pile, excluding INVISIBLE
        var i = this.cards.length - 1;
        while(i >= 0 && this.cards[i].value == SPECIAL.INVISIBLE) {
            i -= 1;
        }

        if (i < 0) {            // there are only INVISIBLE or no pile
            return 0;
        } else {
            return this.cards[i].value;
        }
    };

    this.cardsRemaining = function() {
        return this.cards.length;
    };
};
