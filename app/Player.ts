import * as _ from 'lodash';
import { PLAYER, DEBUG, CARD, SPECIAL } from './Constants';
import Card from './Card';

import { Animation } from './Animation';

class Player {
    faceDownCards: Card[];
    faceUpCards: Card[];
    hand: Card[];

    x: number;
    y: number;

    pickedCards: any;
    animations: Animation[];
    selected: Card[];
    highlighted: Card;
    constructor() {
        this.faceDownCards = [];
        this.faceUpCards = [];
        this.hand = [];

        this.x = PLAYER.X;
        this.y = PLAYER.Y;

        this.pickedCards = {
            index: 0,
            total: 0,
            value: 0,
            collection: null
        };

        this.selected = [];
        this.highlighted = null;

        this.animations = [];

        this.reorderHand = this.reorderHand.bind(this);
    }

    render(ctx: CanvasRenderingContext2D): boolean {
        let r = (c: Card) => {
            c.render(ctx);
        };

        // this.reorderHand();

        // render face down cards
        this.faceDownCards.forEach(r);

        // render face up cards
        this.faceUpCards.forEach(r);

        // render hand
        this.hand.forEach(r);

        // render animations
        this.animations = _.filter(this.animations, anim => {
            return !anim(ctx);
        });
        // _.remove(this.animations, anim => {
        // return !anim(ctx);
        // });
        return _.isEmpty(this.animations);
    }

    addToFaceDown(cards: Card[]) {
        this.faceDownCards = _.concat(this.faceDownCards, cards);
        this.faceDownCards.forEach((c, i) => {
            c.setPosition(this.x + PLAYER.CARD_SPREAD * i, this.y - PLAYER.FACEUP_DIST);
        });
    }

    addToFaceUps(cards: Card[]) {
        this.faceUpCards = _.concat(this.faceUpCards, cards);
        this.reAlignFaceUps();
    }

    addToHand(cards: Card[]) {
        cards.forEach(c => {
            c.faceUp = DEBUG;
            this.hand.push(c);
        });
        this.reorderHand();
    }

    emptyHand() {
        return this.hand.length == 0;
    }

    cardsInHand() {
        return this.hand.length;
    }

    noFaceUps() {
        return this.faceUpCards.length == 0;
    }

    noFaceDowns() {
        return this.faceDownCards.length == 0;
    }

    isDone() {
        return (this.noFaceDowns() && this.noFaceUps() && this.emptyHand());
    }

    play(top: any) {
        this.pickedCards.total = 0;

        if (this.hand.length > 0) {
            this.pickedCards.collection = this.hand;
            this.playHand(top);
        } else if (this.faceUpCards.length > 0) {
            this.pickedCards.collection = this.faceUpCards;
            this.playFaceUp(top);
        } else {
            this.pickedCards.collection = this.faceDownCards;
            this.pickedCards.total = 1;
            this.pickedCards.index = 0;

            this.faceDownCards[0].faceUp = true;
        }

        return this.pickedCards.total;
    }

    playCallback() {
        let cards: Card[] = [null];
        if (this.pickedCards.total > 0) {
            cards = this.pickedCards.collection.splice(this.pickedCards.index, this.pickedCards.total);
            this.reorderHand();
            return cards;
        } else {
            return cards;
        }
    }

    playHand(top: any) {
        let min: any = null;
        if (top == SPECIAL.REVERSE) {
            min = this.findMinUnder(top, this.hand);
        } else {
            min = this.findMinAbove(top, this.hand);
        }

        if (min != null) {
            this.pickedCards.index = min.index;
            this.pickedCards.total = min.total;
            this.pickedCards.value = min.value;
        } else {
            let index = this.selectSpecial(this.hand);
            this.pickedCards.index = index;
            this.pickedCards.total = index ? 1 : 0;
        }

        for (var i = 0; i < this.pickedCards.total; i++) {
            this.hand[this.pickedCards.index + i].faceUp = true;
        }
    }

    findAllCardsOfSameValue(cards: Card[], value: number) {
        let indices = [];
        for (var i = 0; i < cards.length; i++) {
            if (cards[i].value == value) {
                indices.push(i);
            }
        }
        return indices;
    }

    playFaceUp(top: number) {
        let min: any = null;

        if (top == SPECIAL.REVERSE) {
            min = this.findMinUnder(top, this.faceUpCards);
        } else {
            min = this.findMinAbove(top, this.faceUpCards);
        }
        if (min != null) {
            this.pickedCards.index = min.index;
            this.pickedCards.total = min.total;
            this.pickedCards.value = min.value;
        } else {
            let special = this.selectSpecial(this.faceUpCards);
            if (special) {
                this.pickedCards.index = special;
                this.pickedCards.total = 1;
            } else {
                // just pick one
                this.pickedCards.index = 0;
                this.pickedCards.total = 1;
            }
        }
    }

    findMinAbove(top: number, cards: Card[]) {
        // assume the cards are sorted
        let min: any = { index: null };
        for (var i = 0; i < cards.length; i++) {
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
    }

    findMinUnder(top: number, cards: Card[]) {
        // assume the cards are sorted
        let min: any = { index: null };
        for (var i = 0; i < cards.length; i++) {
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
    }

    selectSpecial(cards: Card[]) {
        return _.find(cards, c => {
            c.isSpecial();
        });
    }

    reorderHand() {
        if (this.hand.length == 0) {
            return;
        }

        this.hand.sort(function(a, b) {
            return a.compareTo(b);
        });
        let offset = (this.hand.length - 3) / 2 * PLAYER.CARD_SPREAD * (-1);
        for (var i = 0; i < this.hand.length; i++) {
            this.hand[i].setPosition(this.x + PLAYER.CARD_SPREAD * i + offset, this.y);
        }
    }

    reAlignFaceUps() {
        this.faceUpCards.forEach((c, i) => {
            c.faceUp = true;
            c.setPosition(
                this.x + PLAYER.CARD_SPREAD * i + PLAYER.FACEUP_X_OFF,
                this.y - (PLAYER.FACEUP_DIST - PLAYER.FACEUP_Y_OFF)
            );
        });
    }

    clickedCard(x: number, y: number, card: Card) {
        if (x > card.x && x < card.x + CARD.WIDTH) {
            if (y > card.y && y < card.y + CARD.HEIGHT) {
                return true;
            }
        }
        return false;
    }

    getCards(type: string) {
        let cards: Card[] = [];
        if (type == 'hand') {
            cards = this.hand;
        } else if (type == 'faceup') {
            cards = this.faceUpCards;
        } else if (type == 'facedown') {
            cards = this.faceDownCards;
        }
        return cards;
    }

    pickCard(x: number, y: number, type: any) {
        let cards = this.getCards(type);
        let card = this.selectCard(x, y, type);
        if (card) {
            let index = cards.indexOf(card);
            return cards.splice(index, 1)[0];
        } else {
            return null;
        }
    }

    removeCard(card: Card, type: string) {
        let cards = this.getCards(type);
        let index = cards.indexOf(card);
        return cards.splice(index, 1)[0];
    }

    selectCard(x: number, y: number, type: string) {
        let cards = this.getCards(type);
        return _.find(cards, c => {
            return this.clickedCard(x, y, c);
        });
    }

    swapCards(handIndex: any, faceUpIndex: any) {
        let card: any = this.hand.splice(handIndex, 1)[0];
        card = this.faceUpCards.splice(faceUpIndex, 1, card);
        this.addToHand(card);
        this.reorderHand();
        this.reAlignFaceUps();
    }

    getSpecialIndex(cards: Card[]) {
        for (var i = 0; i < cards.length; i++) {
            if (cards[i].isSpecial()) {
                return i;
            }
        }
        return -1;
    }

    autoSwapCards() {
        // tries to make the best swap possible,
        // with special and high cards ending up as face up
        this.reorderHand();
        let specialInHand = this.getSpecialIndex(this.hand);
        for (var i = 0; i < this.faceUpCards.length; i++) {
            if (this.faceUpCards[i].isSpecial() == false) {
                if (specialInHand >= 0) {
                    this.swapCards(specialInHand, i);
                    specialInHand = this.getSpecialIndex(this.hand);
                } else if (this.faceUpCards[i].value < this.hand[this.hand.length - 1].value) {
                    // no special cards in hand
                    // just pick the biggest one
                    this.swapCards(this.hand.length - 1, i);
                }
            }
        }
        this.reorderHand();
    }

    encode() {
        let p: any = {};
        p.hand = this.hand.length;
        p.faceUpCards = this.faceUpCards.length;
        p.faceDownCards = this.faceDownCards.length;
        return p;
    }
}

export default Player;
