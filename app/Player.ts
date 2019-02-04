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

        // render animations and
        // remove all those which are done
        _.remove(this.animations, anim => {
            return anim(ctx);
        });

        // render the selected cards so they appear on top
        this.selected.forEach(r);

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

    cardsInHand(): number {
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

    swapCards(handIndex: number, faceUpIndex: number) {
        let card: any = this.hand.splice(handIndex, 1)[0];
        card = this.faceUpCards.splice(faceUpIndex, 1, card);
        this.addToHand(card);
        this.reorderHand();
        this.reAlignFaceUps();
    }

    getSpecialIndex(cards: Card[]) {
        return _.findIndex(cards, card => {
            return card.isSpecial();
        });
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
}

export default Player;
