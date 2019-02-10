import * as _ from 'lodash';
import Player from './Player';
import Card from './Card';

interface DetectDeck {
    (x: number, y: number): boolean;
}
interface PlayCards {
    (cards: Card[]): void;
}
interface ClickDeck {
    (): void;
}

enum PlayerState {
    Swap,
    Play
};

class HumanPlayer extends Player {
    detectDeck: DetectDeck;
    detectPile: DetectDeck;
    playCards: PlayCards;
    clickDeck: ClickDeck;
    state: PlayerState;
    constructor(
        detectDeck: DetectDeck,
        detectPile: DetectDeck,
        playCards: PlayCards,
        clickDeck: ClickDeck
    ) {
        super();

        this.detectDeck = detectDeck;
        this.detectPile = detectPile;
        this.playCards = playCards;
        this.clickDeck = clickDeck;

        this.state = PlayerState.Swap;
    }

    addToHand(cards: Card[]) {
        cards.forEach(c => {
            c.faceUp = true;
            this.hand.push(c);
        });
        this.reorderHand();
    }

    switchPlayState() {
        this.state = PlayerState.Play;
    }

    activeCollection(): Card[] {
        if (this.hand.length > 0) {
            return this.hand;
        }

        if (this.faceUpCards.length > 0) {
            return this.faceUpCards;
        }

        return this.faceDownCards;
    }

    onHover(x: number, y: number): boolean {
        let card = _.find(this.activeCollection(), card => {
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
            this.clickDeck();
            return true;
        }

        let card = _.find(this.activeCollection(), card => {
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
        if (this.state == PlayerState.Swap) {
            return this.swapOnDrag(x, y, dx, dy);
        }

        return this.playOnDrag(x, y, dx, dy);
    }

    swapOnDrag(x: number, y: number, dx: number, dy: number): boolean {
        if (_.isEmpty(this.selected)) {
            return false;
        }

        _.forEach(this.selected, card => {
            card.translate(dx, dy);
        });

        return true;
    }

    playOnDrag(x: number, y: number, dx: number, dy: number): boolean {
        let temp = _.filter(this.activeCollection(), card => {
            return card.inBound(x, y);
        });

        if (_.isEmpty(temp) && _.isEmpty(this.selected)) {
            return false;
        }

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
        if (this.state == PlayerState.Swap) {
            return this.swapOnDrop(x, y);
        }

        return this.playOnDrop(x, y);
    }

    swapOnDrop(x: number, y: number): boolean {
        if (_.isEmpty(this.selected)) {
            return false;
        }

        let faceUpIndex = _.findIndex(this.faceUpCards, card => {
            return card.inBound(x, y);
        });

        if (faceUpIndex < 0) {
            this.reorderHand();
            _.forEach(this.selected, card => {
                card.selected = false;
            });
            this.selected = [];

            return true;
        }

        let handIndex = _.indexOf(this.hand, this.selected[0]);

        this.swapCards(handIndex, faceUpIndex);

        _.forEach(this.selected, card => {
            card.selected = false;
        });
        this.selected = [];

        return true;
    }

    playOnDrop(x: number, y: number): boolean {
        if (this.detectPile(x, y)) {
            _.pullAll(this.activeCollection(), this.selected);
            if (!_.isEmpty(this.selected)) {
                this.playCards(this.selected);
            }
        }

        this.reorderHand();

        _.forEach(this.selected, card => {
            card.selected = false;
        });
        this.selected = [];

        return true;
    }
}

export default HumanPlayer;
