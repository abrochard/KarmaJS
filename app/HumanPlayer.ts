import * as _ from 'lodash';
import Player from './Player';
import Card from './Card';

interface DetectDeck {
    (x: number, y: number): boolean;
}
interface PlayCards {
    (cards: Card[]): void;
}
interface FlipDeck {
    (): void;
}

class HumanPlayer extends Player {
    detectDeck: DetectDeck;
    detectPile: DetectDeck;
    playCards: PlayCards;
    flipDeck: FlipDeck;
    constructor(
        detectDeck: DetectDeck,
        detectPile: DetectDeck,
        playCards: PlayCards,
        flipDeck: FlipDeck
    ) {
        super();

        this.detectDeck = detectDeck;
        this.detectPile = detectPile;
        this.playCards = playCards;
        this.flipDeck = flipDeck;
    }

    onHover(x: number, y: number): boolean {
        let card = _.find(this.hand, card => {
            return card.inBound(x, y);
        });

        if (!card) {
            if (this.highlighted) {
                this.highlighted.highlighted = false;
                this.highlighted = null;
                return true;
            }
            return false;
        }

        if (card == this.highlighted) {
            return false;
        }

        if (this.highlighted) {
            this.highlighted.highlighted = false;
        }
        card.highlighted = true;
        this.highlighted = card;
        return true;
    }

    onClick(x: number, y: number): boolean {
        if (this.detectDeck(x, y)) {
            this.flipDeck();
            return true;
        }

        let card = _.find(this.hand, card => {
            return card.inBound(x, y);
        });

        if (!card) {
            return false;
        }

        this.selected.push(card);
        card.selected = true;
        return true;
    }

    onDrag(x: number, y: number, dx: number, dy: number): boolean {
        let temp = _.filter(this.hand, card => {
            return card.inBound(x, y);
        });
        _.forEach(temp, card => {
            if (!_.includes(this.selected, card)) {
                this.selected.push(card);
                card.selected = true;
            }
        });

        _.forEach(this.selected, card => {
            card.translate(dx, dy);
        });
        return true;
    }

    onDrop(x: number, y: number): boolean {
        if (this.detectPile(x, y)) {
            _.pullAll(this.hand, this.selected);
            if (!_.isEmpty(this.selected)) {
                this.playCards(this.selected);
            }
        } else {
            this.reorderHand();
        }

        _.forEach(this.selected, card => {
            card.selected = false;
        });
        this.selected = [];

        return true;
    }
}

export default HumanPlayer;
