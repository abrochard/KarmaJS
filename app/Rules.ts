import * as _ from 'lodash';
import { SPECIAL } from './Constants';
import Card from './Card';
import Deck from './Deck';

export function ValidPlay(cards: Card[], topValue: number) {
    if (_.isEmpty(cards)) {
        return false;
    }

    // make sure all cards are of the same value
    let allSame = _.every(cards, card => {
        return card.value == cards[0].value;
    });
    if (!allSame) {
        return false;
    }

    // played four of a kind
    if (cards.length == 4) {
        return true;
    }

    // nothing on pile
    if (topValue == null || topValue == 0) {
        return true;
    }

    // played a special card
    if (cards[0].isSpecial()) {
        return true;
    }

    // played on top of a two
    if (topValue == SPECIAL.RESET) {
        return true;
    }

    // top is a 7
    if (topValue == SPECIAL.REVERSE) {
        if (cards[0].value <= SPECIAL.REVERSE) {
            return true;
        } else {
            return false;
        }
    }

    // just compare values
    return cards[0].value >= topValue;
}

export function ApplyCards(cards: Card[], pile: Deck) {
    cards.forEach(c => {
        c.faceUp = true;
    });

    let value = cards[0].value;

    if (value == SPECIAL.INVISIBLE && pile.isEmpty() == false) {
        cards.forEach(c => {
            c.transparent = true;
        });
    }

    pile.place(cards);

    if (pile.peek().value == SPECIAL.BURN) {
        pile.pickUp(); // discard the pile
    }

    if (cards.length == 4) {
        pile.pickUp(); // discard the pile
    }

    if (pile.sameLastFour()) {
        pile.pickUp(); // discard the pile
    }
}

export function TotalToDraw(hand: number, deck: Deck): number {
    return Math.min(Math.max(0, 3 - hand), Math.min(3, deck.total()));
}
