var Player = function(human) {

    this.faceDownCards = [];
    this.faceUpCards = [];
    this.hand = [];

    this.x = PLAYER.X;
    this.y = PLAYER.Y;

    this.human = human;

    this.render = function(ctx) {
        this.reorderHand();
        // render face down cards
        for (var i = 0; i < this.faceDownCards.length; i++) {
            this.faceDownCards[i].render(ctx);
        }
        // render face up cards
        for (i = 0; i < this.faceUpCards.length; i++) {
            this.faceUpCards[i].render(ctx);
        }
        // render hand
        for (i = 0; i < this.hand.length; i++) {
            this.hand[i].render(ctx);
        }
    };

    this.addToFaceDown = function(cards) {
        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            card.setPosition(this.x + PLAYER.CARD_SPREAD * i, this.y - PLAYER.FACEUP_DIST);
            this.faceDownCards.push(card);
        }
    };

    this.addToFaceUps = function(cards) {
        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            card.setFaceUp(true);
            card.setPosition(
                this.x + PLAYER.CARD_SPREAD * i + PLAYER.FACEUP_X_OFF,
                this.y - (PLAYER.FACEUP_DIST - PLAYER.FACEUP_Y_OFF)
            );
            this.faceUpCards.push(card);
        }
    };

    this.addToHand = function(cards) {
        var card = null;
        for (var i = 0; i < cards.length; i++) {
            card = cards[i];
            card.setFaceUp(this.human || DEBUG);
            this.hand.push(card);
        }
        this.reorderHand();
    };

    this.emptyHand = function() {
        return this.hand.length == 0;
    };

    this.cardsInHand = function() {
        return this.hand.length;
    };

    this.noFaceUps = function() {
        return this.faceUpCards.length == 0;
    };

    this.noFaceDowns = function() {
        return this.faceDownCards.length == 0;
    };

    this.isDone = function() {
        return (this.noFaceDowns() && this.noFaceUps() && this.emptyHand());
    };

    this.play = function(top) {
        if (this.hand.length > 0) {
            var cards = this.playHand(top);
            this.reorderHand();
            return cards;
        } else if (this.faceUpCards.length > 0) {
            return this.playFaceUp(top);
        } else {
            return [this.faceDownCards.pop()];
        }
    };

    this.playHand = function(top) {
        var min = null;
        if (top == SPECIAL.REVERSE) {
            min = this.findMinUnder(top, this.hand);
        } else {
            min = this.findMinAbove(top, this.hand);
        }

        if (min != null) {
            return this.hand.splice(min.index, min.total);
        } else {
            return this.playSpecial(this.hand);
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

    this.playFaceUp = function(top) {
        var min = null;
        var indices = [];
        var i = 0;
        var cards = [];
        var c = null;

        if (top == SPECIAL.REVERSE) {
            min = this.findMinUnder(top, this.faceUpCards);
        } else {
            min = this.findMinAbove(top, this.faceUpCards);
        }
        if (min != null) {
            indices = findAllCardsOfSameValue(this.faceUpCards, min.value);
            cards = [];
            for(i = indices.length - 1; i >= 0; i--) {
                c = this.faceUpCards.splice(indices[i], 1)[0];
                cards.push(c);
            }
            return cards;
        } else {
            var special = this.playSpecial(this.faceUpCards);
            if (special[0] != null) {
                special = special[0];
                indices = findAllCardsOfSameValue(this.faceUpCards, special.value);
                cards = [special];
                for(i = 0; i < indices.length; i++) {
                    c = this.faceUpCards.splice(indices[i], 1)[0];
                    cards.push(c);
                }
                return cards;
            } else {
                return [this.faceUpCards.pop()]; // just pick one
            }
        }
    };

    this.findMinAbove = function(top, cards) {
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

    this.findMinUnder = function(top, cards) {
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

    this.playSpecial = function(cards) {
        for(var i = 0; i < cards.length; i++) {
            if (cards[i].isSpecial()) {
                return cards.splice(i, 1);
            }
        }
        return [null];
    };

    this.reorderHand = function() {
        this.hand.sort(function (a, b) {
            return a.compareTo(b);
        });
        var offset = (this.hand.length - 3) / 2 * PLAYER.CARD_SPREAD * (-1);
        for(var i = 0; i < this.hand.length; i++) {
            this.hand[i].setPosition(this.x + PLAYER.CARD_SPREAD * i + offset, this.y);
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

    this.getCards = function(type) {
        var cards = [];
        if (type == 'hand') {
            cards = this.hand;
        } else if (type == 'faceup') {
            cards = this.faceUpCards;
        } else if (type == 'facedown') {
            cards = this.faceDownCards;
        }
        return cards;
    };

    this.pickCard = function(x, y, type) {
        var index = this.selectCard(x, y, type);
        var cards = this.getCards(type);

        if (index != null) {
            return cards.splice(index, 1)[0];
        } else {
            return null;
        }
    };

    this.selectCard = function(x, y, type) {
        var cards = this.getCards(type);

        var index = null;
        for(var i = 0; i < cards.length; i++) {
            if (clickedCard(x, y, cards[i])) {
                index = i;
                break;
            }
        }
        return index;
    };

    this.swapCards = function(handIndex, faceUpIndex) {
        var card = this.hand.splice(handIndex, 1)[0];
        card = this.faceUpCards.splice(faceUpIndex, 1, card);
        this.addToHand(card);
        this.reorderHand();

        // sneaky way to preserve order in among face up cards
        var temp = this.faceUpCards.splice(0, this.faceUpCards.length);
        this.addToFaceUps(temp);
    };

    function getSpecialIndex(cards) {
        for(var i = 0; i < cards.length; i++) {
            if (cards[i].isSpecial()) {
                return i;
            }
        }
        return -1;
    }

    this.autoSwapCards = function() {
        // tries to make the best swap possible,
        // with special and high cards ending up as face up
        this.reorderHand();
        var specialInHand = getSpecialIndex(this.hand);
        for(var i = 0; i < this.faceUpCards.length; i++) {
            if (this.faceUpCards[i].isSpecial() == false) {
                if (specialInHand >= 0) {
                    this.swapCards(specialInHand, i);
                    specialInHand = getSpecialIndex(this.hand);
                } else if (this.faceUpCards[i].value < this.hand[this.hand.length - 1].value) {
                    // no special cards in hand
                    // just pick the biggest one
                    this.swapCards(this.hand.length - 1, i);
                }
            }
        }
        this.reorderHand();
    };

    this.encode = function() {
        var p = {};
        p.hand = this.hand.length;
        p.faceUpCards = this.faceUpCards.length;
        p.faceDownCards = this.faceDownCards.length;
        return p;
    };
};
