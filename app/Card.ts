import { CARD, FACE, SPECIAL, SUIT } from "./Constants";
import { FRONT_SPRITE, BACK_SPRITE, BACK_NAME, cardMap } from "./CardMap";

class Card {
    value: number;
    suit: number;
    name: string;

    x: number;
    y: number;

    height: number;
    width: number;

    faceUp: boolean;
    transparent: boolean;
    highlighted: boolean;
    selected: boolean;
    constructor(
        value: number,
        suit: number,
        x: number,
        y: number,
        faceUp: boolean,
        transparent: boolean
    ) {
        // base attributes
        this.value = value;
        this.suit = suit;

        // geometry attributes
        this.x = x;
        this.y = y;
        this.height = CARD.HEIGHT;
        this.width = CARD.WIDTH;

        // visual attributes
        this.faceUp = faceUp != null ? faceUp : false;
        this.transparent = transparent != null ? transparent : false;
        this.highlighted = false;

        // name in sprite sheet map
        this.name = this.getName(suit, value);
    }

    getName(suit: number, value: number) {
        let name = "";
        switch (suit) {
            case SUIT.SPADE:
                name += "Spades";
                break;
            case SUIT.DIAMOND:
                name += "Diamonds";
                break;
            case SUIT.CLOVER:
                name += "Clubs";
                break;
            case SUIT.HEART:
                name += "Hearts";
                break;
        }
        switch (value) {
            case FACE.JACK:
                name += "J";
                break;
            case FACE.QUEEN:
                name += "Q";
                break;
            case FACE.KING:
                name += "K";
                break;
            case FACE.ACE:
                name += "A";
                break;
            default:
                name += value;
                break;
        }
        return name;
    }

    render(ctx: CanvasRenderingContext2D) {
        if (this.faceUp == false) {
            // render back of card
            this.draw(ctx, BACK_NAME, BACK_SPRITE);
        } else if (this.transparent == true) {
            // render as transparent
            ctx.globalAlpha = CARD.INVISIBLE.OPACITY;
            ctx.fillStyle = CARD.INVISIBLE.COLOR;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.globalAlpha = 1;
        } else {
            // normal face up card
            this.draw(ctx, this.name, FRONT_SPRITE);
        }

        // in all cases draw the border
        // ctx.fillStyle = CARD.BORDER_COLOR;
        // ctx.strokeRect(this.x, this.y, this.width, this.height);

        if (this.highlighted) {
            ctx.fillStyle = CARD.HOVER.COLOR;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }

        if (this.selected) {
            ctx.fillStyle = CARD.SELECTED.COLOR;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }

    draw(ctx: any, cardMapName: string, elementId: string) {
        let position = cardMap[cardMapName];
        let sx = position.x;
        let sy = position.y;
        let sWidth = position.width;
        let sHeight = position.height;

        let dx = this.x;
        let dy = this.y;
        let dWidth = this.width;
        let dHeight = this.height;
        ctx.drawImage(
            document.getElementById(elementId),
            sx,
            sy,
            sWidth,
            sHeight,
            dx,
            dy,
            dWidth,
            dHeight
        );
    }

    flip() {
        this.faceUp = !this.faceUp;
        return this;
    }

    setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    translate(dx: number, dy: number) {
        this.x += dx;
        this.y += dy;
    }

    isAt(x: number, y: number) {
        return this.x == x && this.y == y;
    }

    moveTo(x: number, y: number, v: number): boolean {
        if (this.isAt(x, y)) {
            return true;
        }

        let a = x - this.x;
        let b = y - this.y;
        let d = Math.sqrt(a * a + b * b);
        let dx = (a / d) * v;
        let dy = (b / d) * v;

        if (Math.abs(dx) > Math.abs(a)) {
            dx = a;
        }
        if (Math.abs(dy) > Math.abs(b)) {
            dy = b;
        }
        this.translate(dx, dy);

        return this.isAt(x, y);
    }

    compareTo(card: Card) {
        if (card == null) {
            return 1;
        }

        return this.value - card.value;
    }

    isSpecial() {
        return (
            this.value == SPECIAL.RESET ||
            this.value == SPECIAL.INVISIBLE ||
            this.value == SPECIAL.BURN
        );
    }

    inBound(x: number, y: number): boolean {
        if (x > this.x && x < this.x + this.width) {
            if (y > this.y && y < this.y + this.height) {
                return true;
            }
        }
        return false;
    }
}

export default Card;
