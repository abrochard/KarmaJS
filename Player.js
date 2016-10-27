var Player = function(human) {

    var self = this;

    self.faceDownCards = [];
    self.faceUpCards = [];
    self.hand = [];

    self.x = PLAYER.X;
    self.y = PLAYER.Y;

    self.human = human;

    self.render = function(ctx) {
        self.reorderHand();
        // render face down cards
        for (var i = 0; i < self.faceDownCards.length; i++) {
            self.faceDownCards[i].render(ctx);
        }
        // render face up cards
        for (i = 0; i < self.faceUpCards.length; i++) {
            self.faceUpCards[i].render(ctx);
        }
        // render hand
        for (i = 0; i < self.hand.length; i++) {
            self.hand[i].render(ctx);
        }
    };

    self.addToFaceDown = function(cards) {
        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            card.setPosition(self.x + PLAYER.CARD_SPREAD * i, self.y - PLAYER.FACEUP_DIST);
            self.faceDownCards.push(card);
        }
    };

    self.addToFaceUps = function(cards) {
        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            card.setFaceUp(true);
            card.setPosition(
                self.x + PLAYER.CARD_SPREAD * i + PLAYER.FACEUP_X_OFF,
                self.y - (PLAYER.FACEUP_DIST - PLAYER.FACEUP_Y_OFF)
            );
            self.faceUpCards.push(card);
        }
    };

    self.addToHand = function(cards) {
        var card = null;
        for (var i = 0; i < cards.length; i++) {
            card = cards[i];
            card.setFaceUp(self.human || DEBUG);
            self.hand.push(card);
        }
        self.reorderHand();
    };

    self.emptyHand = function() {
        return self.hand.length == 0;
    };

    self.cardsInHand = function() {
        return self.hand.length;
    };

    self.noFaceUps = function() {
        return self.faceUpCards.length == 0;
    };

    self.noFaceDowns = function() {
        return self.faceDownCards.length == 0;
    };

    self.isDone = function() {
        return (self.noFaceDowns() && self.noFaceUps() && self.emptyHand());
    };

    self.play = function(top) {
        if (self.hand.length > 0) {
            var cards = self.playHand(top);
            self.reorderHand();
            return cards;
        } else if (self.faceUpCards.length > 0) {
            return self.playFaceUp(top);
        } else {
            return [self.faceDownCards.pop()];
        }
    };

    self.playHand = function(top) {
        var min = null;
        if (top == SPECIAL.REVERSE) {
            min = self.findMinUnder(top, self.hand);
        } else {
            min = self.findMinAbove(top, self.hand);
        }

        if (min != null) {
            return self.hand.splice(min.index, min.total);
        } else {
            return self.playSpecial(self.hand);
        }
    };

    function findAllCardsOfSameValue(cards, value) {
        var indices = [];
        for(var i = 0; i < cards.length; i++) {
            if (cards[i].value == value) {
                indices.push(i);
            }
        }
        return indices;
    }

    self.playFaceUp = function(top) {
        var min = null;
        var indices = [];
        var i = 0;
        var cards = [];
        var c = null;

        if (top == SPECIAL.REVERSE) {
            min = self.findMinUnder(top, self.faceUpCards);
        } else {
            min = self.findMinAbove(top, self.faceUpCards);
        }
        if (min != null) {
            indices = findAllCardsOfSameValue(self.faceUpCards, min.value);
            cards = [];
            for(i = indices.length - 1; i >= 0; i--) {
                c = self.faceUpCards.splice(indices[i], 1)[0];
                cards.push(c);
            }
            return cards;
        } else {
            var special = self.playSpecial(self.faceUpCards);
            if (special[0] != null) {
                special = special[0];
                indices = findAllCardsOfSameValue(self.faceUpCards, special.value);
                cards = [special];
                for(i = 0; i < indices.length; i++) {
                    c = self.faceUpCards.splice(indices[i], 1)[0];
                    cards.push(c);
                }
                return cards;
            } else {
                return [self.faceUpCards.pop()]; // just pick one
            }
        }
    };

    self.findMinAbove = function(top, cards) {
        // assume the cards are sorted
        var min = {index: null};
        for(var i = 0; i < cards.length; i++) {
            if (cards[i].value >= top && !cards[i].isSpecial()) {
                if (min.index == null) {
                    min.index = i;
                    min.value = cards[i].value;
                    min.total = 1;
                } else if (cards[i].value == min.value) {
                    min.total += 1;
                } else {
                    return min;
                }
            }
        }
        return min.index == null ? null : min;
    };

    self.findMinUnder = function(top, cards) {
        // assume the cards are sorted
        var min = {index: null};
        for(var i = 0; i < cards.length; i++) {
            if (cards[i].value <= top && !cards[i].isSpecial()) {
                if (min.index == null) {
                    min.index = i;
                    min.value = cards[i].value;
                    min.total = 1;
                } else if (cards[i].value == min.value) {
                    min.total += 1;
                } else {
                    return min;
                }
            }
        }
        return min.index == null ? null : min;
    };

    self.playSpecial = function(cards) {
        for(var i = 0; i < cards.length; i++) {
            if (cards[i].isSpecial()) {
                return cards.splice(i, 1);
            }
        }
        return [null];
    };

    self.reorderHand = function() {
        self.hand.sort(function (a, b) {
            return a.compareTo(b);
        });
        var offset = (self.hand.length - 3) / 2 * PLAYER.CARD_SPREAD * (-1);
        for(var i = 0; i < self.hand.length; i++) {
            self.hand[i].setPosition(self.x + PLAYER.CARD_SPREAD * i + offset, self.y);
        }
    };

    function clickedCard(x, y, card) {
        if (x > card.x && x < card.x + CARD.WIDTH) {
            if (y > card.y && y < card.y + CARD.HEIGHT) {
                return true;
            }
        }
        return false;
    }

    self.getCards = function(type) {
        var cards = [];
        if (type == 'hand') {
            cards = self.hand;
        } else if (type == 'faceup') {
            cards = self.faceUpCards;
        } else if (type == 'facedown') {
            cards = self.faceDownCards;
        }
        return cards;
    };

    self.pickCard = function(x, y, type) {
        var index = self.selectCard(x, y, type);
        var cards = self.getCards(type);

        if (index != null) {
            return cards.splice(index, 1)[0];
        } else {
            return null;
        }
    };

    self.selectCard = function(x, y, type) {
        var cards = self.getCards(type);

        var index = null;
        for(var i = 0; i < cards.length; i++) {
            if (clickedCard(x, y, cards[i])) {
                index = i;
                break;
            }
        }
        return index;
    };

    self.swapCards = function(handIndex, faceUpIndex) {
        var card = self.hand.splice(handIndex, 1)[0];
        card = self.faceUpCards.splice(faceUpIndex, 1, card);
        self.addToHand(card);
        self.reorderHand();

        // sneaky way to preserve order in among face up cards
        var temp = self.faceUpCards.splice(0, self.faceUpCards.length);
        self.addToFaceUps(temp);
    };

    function getSpecialIndex(cards) {
        for(var i = 0; i < cards.length; i++) {
            if (cards[i].isSpecial()) {
                return i;
            }
        }
        return -1;
    }

    self.autoSwapCards = function() {
        // tries to make the best swap possible,
        // with special and high cards ending up as face up
        self.reorderHand();
        var specialInHand = getSpecialIndex(self.hand);
        for(var i = 0; i < self.faceUpCards.length; i++) {
            if (self.faceUpCards[i].isSpecial() == false) {
                if (specialInHand >= 0) {
                    self.swapCards(specialInHand, i);
                    specialInHand = getSpecialIndex(self.hand);
                } else if (self.faceUpCards[i].value < self.hand[self.hand.length - 1].value) {
                    // no special cards in hand
                    // just pick the biggest one
                    self.swapCards(self.hand.length - 1, i);
                }
            }
        }
        self.reorderHand();
    };

    self.encode = function() {
        var p = {};
        p.hand = self.hand.length;
        p.faceUpCards = self.faceUpCards.length;
        p.faceDownCards = self.faceDownCards.length;
        return p;
    };
};
