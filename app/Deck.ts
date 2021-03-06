import { SUIT, FACE, SPECIAL, CARD } from './Constants';
import Card from './Card';

class Deck {
    x: number;
    y: number;
    width: number;
    height: number;
    cards: Card[];
    maxRender: number;
    constructor(x: number, y: number, maxRender: number) {
        this.x = x;
        this.y = y;
        this.cards = [];
        this.maxRender = maxRender;

        this.width = CARD.WIDTH;
        this.height = CARD.HEIGHT;
    }

    generate(faceUp: boolean) {
        this.cards = [];
        for (var suit in SUIT) {
            for (var value = 2; value < FACE.ACE; value++) {
                this.cards.push(
                    new Card(value, SUIT[suit], this.x, this.y, faceUp, false)
                );
            }
        }
    }

    render(ctx: CanvasRenderingContext2D) {
        let count = 0;
        let max = Math.max(0, this.cards.length - this.maxRender);
        for (var i = max; i < this.cards.length; i++) {
            // offset the top cards
            this.cards[i].setPosition(this.x + 1 * count, this.y + 1 * count);
            this.cards[i].render(ctx);
            count += 1;
        }
        if (max == 0) {
            // still render something
            ctx.fillStyle = 'black';
            ctx.strokeRect(this.x, this.y, CARD.WIDTH, CARD.HEIGHT);
        }
    }

    shuffle() {
        let currentIndex = this.cards.length;
        let temporaryValue;
        let randomIndex;

        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = this.cards[currentIndex];
            this.cards[currentIndex] = this.cards[randomIndex];
            this.cards[randomIndex] = temporaryValue;
        }
    }

    draw() {
        return this.cards.pop();
    }

    pickUp() {
        let cards = this.cards;
        this.cards = [];

        // because nobody wants to pick up transparent cards
        for (var i = 0; i < cards.length; i++) {
            cards[i].transparent = false;
        }

        return cards;
    }

    place(cards: Card[]) {
        cards.forEach(c => {
            c.setPosition(this.x, this.y);
            this.cards.push(c);
        });
    }

    isEmpty() {
        return this.cards.length == 0;
    }

    peek() {
        if (this.cards.length == 0) {
            return null;
        } else if (this.cards[this.cards.length - 1].faceUp) {
            return this.cards[this.cards.length - 1];
        } else {
            return null;
        }
    }

    sameLastFour(): boolean {
        if (this.cards.length < 4) {
            return false;
        }

        let total = 4;
        let value = this.cards[this.cards.length - 1].value;
        for (var i = 1; i < total; i++) {
            let index = this.cards.length - 1 - i;
            if (index < 0) {
                return false;
            }

            if (this.cards[index].value != SPECIAL.INVISIBLE &&
                this.cards[index].value != value) {
                return false;
            } else if (this.cards[index].value == SPECIAL.INVISIBLE) {
                total += 1;
            }
        }
        return true;
    }

    topValue(): number {
        // gets the top on the pile, excluding INVISIBLE
        let i = this.cards.length - 1;
        while (i >= 0 && this.cards[i].value == SPECIAL.INVISIBLE) {
            i -= 1;
        }

        if (i < 0) {            // there are only INVISIBLE or no pile
            return 0;
        } else {
            return this.cards[i].value;
        }
    }

    cardsRemaining() {
        return this.cards.length;
    }

    flipTop() {
        this.cards[this.cards.length - 1].flip();
    }

    total(): number {
        return this.cards.length;
    }
}

export default Deck;
