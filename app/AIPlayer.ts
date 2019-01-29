import * as _ from 'lodash';
import Player from './Player';
import Card from './Card';
import { SPECIAL } from './Constants';

class AIPlayer extends Player {
    constructor() {
        super();
    }

    play(top: number): Card[] {
        if (this.hand.length > 0) {
            return this.playHand(top);
        }

        if (this.faceUpCards.length > 0) {
            return this.playFaceUp(top);
        }

        // just play a facedown
        return [this.faceDownCards.pop()];
    }

    playHand(top: number): Card[] {
        let min: Card = null;
        if (top == SPECIAL.REVERSE) {
            min = this.findMinUnder(top, this.hand);
        } else {
            min = this.findMinAbove(top, this.hand);
        }

        // could not find a suitable card to play
        if (!min) {
            return [];
        }


        let toPlay = this.findAllCardsOfSameValue(min.value, this.hand);
        _.pullAll(this.hand, toPlay);

        return toPlay;
    }

    playFaceUp(top: number): Card[] {
        return [];
    }

    findMinAbove(top: number, cards: Card[]): Card {
        return _.minBy(_.filter(cards, card => {
            return card.value >= top;
        }), 'value');
    }

    findMinUnder(top: number, cards: Card[]) {
        return _.minBy(_.filter(cards, card => {
            return card.value <= top;
        }), 'value');
    }

    findAllCardsOfSameValue(value: number, cards: Card[]): Card[] {
        return _.filter(cards, card => {
            return card.value == value;
        })
    }
}

export default AIPlayer;
