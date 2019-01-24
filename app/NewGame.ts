import * as _ from 'lodash';
import {
    CardType,
    GAME,
    SPECIAL,
    PILE,
    CARD,
    LOG,
    BOARD,
    DECK,
    MESSAGE,
    PLAYER
} from "./Constants";
import Deck from "./Deck";
import Player from "./Player";
import Card from "./Card";
import { Animation, cardDrawAnimation } from './Animation';

class Game {
    ctx: CanvasRenderingContext2D;
    players: Player[];
    human: Player;
    deck: Deck;
    pile: Deck;
    animations: Animation[];
    constructor(canvas: HTMLCanvasElement, nPlayers = GAME.PLAYERS) {
        this.ctx = canvas.getContext('2d');

        this.deck = new Deck(DECK.X, DECK.Y, DECK.MAX_RENDER);
        this.deck.generate(false);
        this.deck.shuffle();

        this.pile = new Deck(PILE.X, PILE.Y, PILE.MAX_RENDER);

        this.players = [];
        _.range(nPlayers).forEach(i => {
            var p = new Player(i == 0);

            _.range(3).forEach(() => {
                p.animations.push(cardDrawAnimation(p, CardType.FaceDown, this.deck.draw()))
            });

            _.range(3).forEach(() => {
                p.animations.push(cardDrawAnimation(p, CardType.FaceUp, this.deck.draw().flip()));
            });

            _.range(3).forEach(() => {
                p.animations.push(cardDrawAnimation(p, CardType.Hand, this.deck.draw()));
            })

            this.players.push(p);
        });

        this.render(() => {
            this.players.forEach(p => {
                if (!p.human) {
                    p.autoSwapCards();
                }
            })
            this.render(() => {
                console.log('done');
            })
        })
    }

    render(done?: () => void) {
        // recenter
        this.ctx.translate(this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
        // clear the board
        this.ctx.clearRect(
            -this.ctx.canvas.height / 2,
            -this.ctx.canvas.width / 2,
            this.ctx.canvas.width,
            this.ctx.canvas.height
        );

        // render board
        this.ctx.fillStyle = BOARD.COLOR;
        this.ctx.fillRect(
            -this.ctx.canvas.width / 2,
            -this.ctx.canvas.height / 2,
            this.ctx.canvas.width,
            this.ctx.canvas.height
        );

        this.deck.render(this.ctx);
        this.pile.render(this.ctx);

        // show instructions
        // if (this.swapCards) {
        //     this.ctx.fillStyle = MESSAGE.COLOR;
        //     this.ctx.font = MESSAGE.FONT;
        //     this.ctx.fillText(
        //         "Click the deck to start playing",
        //         MESSAGE.ZONE1.x,
        //         MESSAGE.ZONE1.y
        //     );
        //     this.ctx.fillText("Swap cards first", MESSAGE.ZONE2.x, MESSAGE.ZONE2.y);
        // }

        // render all players
        let panimDone = true;
        this.players.forEach(p => {
            panimDone = panimDone && p.render(this.ctx);
            // rotate the canvas for each player
            this.ctx.rotate(((360 / this.players.length) * Math.PI) / 180);
        });

        // HACKY
        this.players[0].render(this.ctx);

        // render picked cards
        // this.pickedCards.forEach(c => {
        // c.render(this.ctx);
        // });

        // show scoreboard
        // if (this.finished) {
        //     var position = this.winners.length + 1;
        //     this.ctx.fillStyle = BOARD.MESSAGECOLOR;
        //     this.ctx.font = BOARD.MESSAGEFONT;
        //     this.ctx.fillText(
        //         "Congrats you finished #" + position,
        //         MESSAGE.ZONE1.x,
        //         MESSAGE.ZONE1.y
        //     );
        // }

        // render animations
        this.animations = _.filter(this.animations, animate => {
            return !animate(this.ctx);
        })
        let arrived = _.isEmpty(this.animations);

        // re-center board
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);

        if (arrived && panimDone) {
            if (done) {
                return done();
            }
            return;
        }

        let self = this;
        window.requestAnimationFrame(() => {
            self.render(done);
        })
    }
}

export default Game;
