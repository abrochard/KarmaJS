import * as _ from 'lodash';
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

export function cardPlayAnimation(cards: Card[]): Animation {
    return ctx => {
        // let arrived = cards[0].moveTo(DECK.X, DECK.Y, 1);
        // cards[0].render(ctx);
        // return arrived;

        return _.every(cards, card => {
            let arrived = card.moveTo(DECK.X, DECK.Y, 5);
            card.render(ctx);
            return arrived;
        });
    }
}
