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

        return [min];

        // if (min != null) {
        //     this.pickedCards.index = min.index;
        //     this.pickedCards.total = min.total;
        //     this.pickedCards.value = min.value;
        // } else {
        //     let index = this.selectSpecial(this.hand);
        //     this.pickedCards.index = index;
        //     this.pickedCards.total = index ? 1 : 0;
        // }

        // for (var i = 0; i < this.pickedCards.total; i++) {
        //     this.hand[this.pickedCards.index + i].faceUp = true;
        // }
        return [];
    }

    playFaceUp(top: number): Card[] {
        return [];
    }

    findMinAbove(top: number, cards: Card[]): Card {
        return _.minBy(cards, card => {
            return card.value >= top ? card.value : 1000;
        });

        // assumes the cards are sorted
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
        return _.minBy(cards, card => {
            return card.value <= top ? card.value : 1000;
        });

        // assumes the cards are sorted
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
}

export default AIPlayer;
