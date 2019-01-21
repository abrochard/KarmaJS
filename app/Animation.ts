import Player from './Player';
import Card from './Card';
import { DECK, PLAYER } from './Constants';

export interface Animation {
    (ctx: CanvasRenderingContext2D): boolean
}

export enum Type {
    Hand = 'hand',
    FaceUp = 'faceup',
    FaceDown = 'facedown'
}

export function cardDrawAnimation(player: Player, t: Type, card: Card): Animation {
    card.setPosition(DECK.X, DECK.Y);

    return ctx => {
        let arrived = card.moveTo(PLAYER.X, PLAYER.Y, 20);
        card.render(ctx);

        if (arrived) {
            if (t == 'hand') {
                player.addToHand([card]);
            } else if (t == 'faceup') {
                player.addToFaceUps([card]);
            } else {
                player.addToFaceDown([card]);
            }
        }

        return arrived;
    }
}
