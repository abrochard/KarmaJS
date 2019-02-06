import * as _ from 'lodash';
import Player from './Player';
import Card from './Card';
import { CardType, DECK, PLAYER } from './Constants';

export interface Animation {
    (ctx: CanvasRenderingContext2D): boolean
}

export function cardDrawAnimation(player: Player, t: CardType, card: Card, speed = 17): Animation {
    // card.setPosition(DECK.X, DECK.Y);

    let destination: { x: number, y: number } = { x: PLAYER.X, y: PLAYER.Y };
    destination.x += Math.round(Math.random() * 150);

    return ctx => {
        let arrived = card.moveTo(destination.x, destination.y, speed);
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
    _.forEach(cards, card => {
        card.faceUp = true;
    });

    return ctx => {
        return _.every(_.map(cards, card => {
            let arrived = card.moveTo(DECK.X, DECK.Y, 15);
            card.render(ctx);
            return arrived;
        }));
    }
}

export function bannerAnimation(text: string, speed = 12): Animation {
    let x = 0;
    let textOffset = -text.length * 15;

    let BANNER_WIDTH = 120;
    let top = BANNER_WIDTH / 2 + 5;

    return ctx => {
        let width = ctx.canvas.width / 2;

        // background
        ctx.fillStyle = 'black';
        ctx.fillRect(-width, -top, 2 * width, BANNER_WIDTH);

        // loading bar
        ctx.fillStyle = 'red';
        ctx.fillRect(-width, -top, x, BANNER_WIDTH);

        // text
        ctx.fillStyle = 'white';
        ctx.font = '80px serif';
        ctx.fillText(text, textOffset, 10);

        x += speed;

        return x > 2.5 * width;
    };
};
