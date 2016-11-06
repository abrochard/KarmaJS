var Deck = function(x, y, maxRender) {

    var self = this;

    self.x = x;
    self.y = y;
    self.cards = [];
    self.maxRender = maxRender;

    self.generate = function(faceUp) {
        self.cards = [];
        for (var suit in SUIT) {
            for(var value = 2; value < FACE.ACE; value++) {
                self.cards.push(new Card(value, SUIT[suit], self.x, self.y, faceUp, false));
            }
        }
    };

    self.render = function(ctx) {
        var count = 0;
        for(var i = Math.max(0, self.cards.length - maxRender); i < self.cards.length; i++) {
            // offset the top cards
            self.cards[i].setPosition(self.x + 1 * count, self.y + 1 * count);
            self.cards[i].render(ctx);
            count += 1;
        }
    };

    self.shuffle = function() {
        var currentIndex = self.cards.length;
        var temporaryValue;
        var randomIndex;

        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = self.cards[currentIndex];
            self.cards[currentIndex] = self.cards[randomIndex];
            self.cards[randomIndex] = temporaryValue;
        }
    };

    self.draw = function() {
        return self.cards.pop();
    };

    self.pickUp = function() {
        var cards = self.cards;
        self.cards = [];

        // because nobody wants to pick up transparent cards
        for(var i = 0; i < cards.length; i++) {
            cards[i].setTransparent(false);
        }

        return cards;
    };

    self.place = function(cards) {
        for(var i = 0; i < cards.length; i++) {
            var card = cards[i];
            card.setPosition(self.x, self.y);
            self.cards.push(card);
        }
    };

    self.isEmpty = function() {
        return self.cards.length == 0;
    };

    self.peek = function() {
        if (self.cards.length == 0) {
            return null;
        } else if (self.cards[self.cards.length - 1].faceUp) {
            return self.cards[self.cards.length - 1];
        } else {
            return null;
        }
    };

    self.sameLastFour = function() {
        if (self.cards.length < 4) {
            return false;
        }

        var total = 4;
        var value = self.cards[self.cards.length - 1].value;
        for(var i = 1; i < total; i++) {
            var index = self.cards.length - 1 - i;
            if (index < 0) {
                return false;
            }

            if (self.cards[index].value != SPECIAL.INVISIBLE && self.cards[index].value != value) {
                return false;
            } else if (self.cards[index].value == SPECIAL.INVISIBLE) {
                total += 1;
            }
        }
        return true;
    };

    self.topValue = function() {
        // gets the top on the pile, excluding INVISIBLE
        var i = self.cards.length - 1;
        while(i >= 0 && self.cards[i].value == SPECIAL.INVISIBLE) {
            i -= 1;
        }

        if (i < 0) {            // there are only INVISIBLE or no pile
            return 0;
        } else {
            return self.cards[i].value;
        }
    };

    self.cardsRemaining = function() {
        return self.cards.length;
    };

    self.flipTop = function() {
        self.cards[self.cards.length - 1].flip();
    };
};
