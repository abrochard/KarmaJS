var Player = function(human) {

    this.faceDownCards = [];
    this.faceUpCards = [];
    this.hand = [];

    this.x = PLAYER.X;
    this.y = PLAYER.Y;

    this.human = human;

    this.render = function(ctx) {
        // render face down cards
        for (var i = 0; i < this.faceDownCards.length; i++) {
            this.faceDownCards[i].render(ctx);
        }
        // render face up cards
        for (var i = 0; i < this.faceUpCards.length; i++) {
            this.faceUpCards[i].render(ctx);
        }
        // render hand
        for (var i = 0; i < this.hand.length; i++) {
            this.hand[i].render(ctx);
        }
    };

    this.addToFaceDown = function(cards) {
        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            card.setPosition(this.x + PLAYER.CARDSPREAD * i, this.y - PLAYER.FACEUPDIST);
            this.faceDownCards.push(card);
        }
    };

    this.addToFaceUps = function(cards) {
        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            card.setPosition(
                this.x + PLAYER.CARDSPREAD * i + PLAYER.FACEUPXOFF,
                this.y - (PLAYER.FACEUPDIST - PLAYER.FACEUPYOFF)
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
        var card = null;
        if (this.hand.length > 0) {
            card = this.playHand(top);
            this.reorderHand();
        } else if (this.faceUpCards.length > 0) {
            card = this.playFaceUp(top);
        } else {
            card = this.faceDownCards.pop();
        }
        return card;
    };

    this.playHand = function(top) {
        var min = this.findMinAbove(top, this.hand);
        if (min != null) {
            return this.hand.splice(min, 1)[0];
        } else {
            return null;
        }
    };

    this.playFaceUp = function(top) {
        var min = this.findMinAbove(top, this.faceUpCards);
        if (min != null) {
            return this.faceUpCards.splice(min, 1)[0];
        } else {
            return null;
        }
    };

    this.findMinAbove = function(top, cards) {
        // assume the cards are sorted
        for(var i = 0; i < cards.length; i++) {
            if (cards[i].compareTo(top) >= 0) {
                return i;
            }
        }
        return null;
    };

    this.reorderHand = function() {
        this.hand.sort(function (a, b) {
            return a.compareTo(b);
        });
        var offset = (this.hand.length - 3) / 2 * PLAYER.CARDSPREAD * (-1);
        for(var i = 0; i < this.hand.length; i++) {
            this.hand[i].setPosition(this.x + PLAYER.CARDSPREAD * i + offset, this.y);
        }
    };

    this.pickFromHand = function(x, y) {
        var card = this.selectCard(x, y, this.hand);
        this.reorderHand();
        return card;
    };

    this.pickFromFaceUps = function(x, y) {
        return this.selectCard(x, y, this.faceUpCards);
    };

    this.pickFromFaceDowns = function(x, y) {
        return this.selectCard(x, y, this.faceDownCards);
    };

    function clickedCard(x, y, card) {
        if (x > card.x && x < card.x + CARD.WIDTH) {
            if (y > card.y && y < card.y + CARD.HEIGHT) {
                return true;
            }
        }
        return false;
    }

    this.selectCard = function(x, y, cards) {
        var index = null;
        for(var i = 0; i < cards.length; i++) {
            if (clickedCard(x, y, cards[i])) {
                index = i;
                break;
            }
        }

        if (index == null) {
            return null;
        } else {
            return cards.splice(index, 1)[0];
        }
    };
};
