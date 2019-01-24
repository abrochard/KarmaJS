import Player from './Player';
import Card from './Card';
import { CardType, DECK, PLAYER } from './Constants';

export interface Animation {
    (ctx: CanvasRenderingContext2D): boolean
}

export function cardDrawAnimation(player: Player, t: CardType, card: Card): Animation {
    card.setPosition(DECK.X, DECK.Y);

    let destination: { x: number, y: number } = { x: PLAYER.X, y: PLAYER.Y };
    destination.x += Math.round(Math.random() * 150);

    return ctx => {
        let arrived = card.moveTo(destination.x, destination.y, 17);
        card.render(ctx);

        if (arrived) {
            if (t == CardType.Hand) {
                player.addToHand([card]);
            } else if (t == CardType.FaceUp) {
                player.addToFaceUps([card]);
            } else {
                player.addToFaceDown([card]);
            }
        }

        return arrived;
    }
}

export function cardPlayAnimation(card: Card): Animation {
    return ctx => {
        let arrived = card.moveTo(DECK.X, DECK.Y, 10);
        card.render(ctx);

        if (arrived) {

        }

        return arrived;
    }
}
