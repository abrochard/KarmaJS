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
        return this.playFrom(this.hand, top);
    }

    playFaceUp(top: number): Card[] {
        let toPlay = this.playFrom(this.faceUpCards, top);
        if (_.isEmpty(toPlay)) {
            // just pick one
            // TODO better picking
            toPlay = [this.faceUpCards.pop()];
        }

        return toPlay;
    }

    playFrom(cards: Card[], top: number): Card[] {
        let min: Card = null;

        if (top == SPECIAL.REVERSE) {
            min = this.findMinUnder(top, cards);
        } else {
            min = this.findMinAbove(top, cards);
        }

        // could not find a suitable card to play
        if (!min) {
            let special = this.findSpecial(cards);
            if (!special) {
                // no special card to swoop in
                return [];
            }

            min = special;
        }


        let toPlay = this.findAllCardsOfSameValue(min.value, cards);
        _.pullAll(cards, toPlay);

        return toPlay;
    }

    findMinAbove(top: number, cards: Card[]): Card {
        return _.minBy(_.filter(cards, card => {
            return card.value >= top && !card.isSpecial();
        }), 'value');
    }

    findMinUnder(top: number, cards: Card[]) {
        return _.minBy(_.filter(cards, card => {
            return card.value <= top && !card.isSpecial();
        }), 'value');
    }

    findAllCardsOfSameValue(value: number, cards: Card[]): Card[] {
        return _.filter(cards, card => {
            return card.value == value;
        })
    }

    findSpecial(cards: Card[]): Card {
        return _.find(cards, card => {
            return card.isSpecial();
        });
    }
}

export default AIPlayer;
