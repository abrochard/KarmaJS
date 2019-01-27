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
import AIPlayer from './AIPlayer';
import HumanPlayer from './HumanPlayer';
import Card from "./Card";
import { Animation, cardDrawAnimation, cardPlayAnimation } from './Animation';

class Game {
    ctx: CanvasRenderingContext2D;
    aiPlayers: AIPlayer[];
    human: HumanPlayer;
    deck: Deck;
    pile: Deck;
    animations: Animation[];
    lastCursorPosition: { x: number, y: number };
    constructor(canvas: HTMLCanvasElement, nPlayers = GAME.PLAYERS) {
        this.ctx = canvas.getContext('2d');

        this.deck = new Deck(DECK.X, DECK.Y, DECK.MAX_RENDER);
        this.deck.generate(false);
        this.deck.shuffle();

        this.pile = new Deck(PILE.X, PILE.Y, PILE.MAX_RENDER);

        this.human = new HumanPlayer(
            this.detector(this.deck),
            this.detector(this.pile),
            this.playHuman.bind(this),
            () => { console.log('deck flip'); }
        );
        this.setupPlayer(this.human);

        this.aiPlayers = [];
        _.range(nPlayers - 1).forEach(() => {
            var p = new AIPlayer();

            this.setupPlayer(p);

            this.aiPlayers.push(p);
        });


        this.lastCursorPosition = null;

        this.temp();

        this.render(() => {
            this.aiPlayers.forEach(p => {
                p.autoSwapCards();
            })
            this.render(() => {
                console.log('done');
            })
        })
    }

    detector(d: Deck): (x: number, y: number) => boolean {
        return (x: number, y: number) => {
            if (x > d.x && x < d.x + CARD.WIDTH) {
                if (y > d.y && y < d.y + CARD.HEIGHT) {
                    return true;
                }
            }
            return false;
        }
    }

    setupPlayer(p: Player) {
        _.range(3).forEach(() => {
            p.animations.push(cardDrawAnimation(p, CardType.FaceDown, this.deck.draw()))
        });

        _.range(3).forEach(() => {
            p.animations.push(cardDrawAnimation(p, CardType.FaceUp, this.deck.draw().flip()));
        });

        _.range(3).forEach(() => {
            p.animations.push(cardDrawAnimation(p, CardType.Hand, this.deck.draw()));
        })
    }

    getPosition(e: MouseEvent): { x: number, y: number } {
        let x = e.offsetX - this.ctx.canvas.offsetWidth / 2;
        let y = e.offsetY - this.ctx.canvas.offsetHeight / 2;
        return { x, y };
    }

    playHuman(cards: Card[]) {
        if (this.validPlay(cards, this.pile.topValue())) {
            this.applyCards(cards);
        } else {
            this.human.addToHand(_.concat(cards, this.pile.pickUp()));
        }

        this.render(() => {
            this.loop();
        });
    }

    loop(index = 0) {
        let self = this;
        window.setTimeout(() => {
            self.playAI(index);
        }, GAME.DELAY);
    }

    playAI(index: number) {
        let p = this.aiPlayers[index];

        if (p.isDone()) {
            if (index >= this.aiPlayers.length) {
                // accept input
                return;
            }

            this.loop(index + 1);
            return;
        }

        let cards = p.play(this.pile.topValue());
        if (_.isEmpty(cards)) {
            // TODO flip top card

            p.addToHand(this.pile.pickUp());
            this.render();
            this.loop(index + 1);
            return;
        }

        p.animations.push(cardPlayAnimation(cards));
        // this.applyCards(cards);

        this.render();
    }

    validPlay(cards: Card[], topValue: number) {
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

    applyCards(cards: Card[]) {
        if (LOG) {
            var top = this.pile.isEmpty() ? "nothing" : this.pile.peek().value;
            console.log("Played " + cards.length + " " + cards[0].value + " on " + top);
        }

        cards.forEach(c => {
            c.faceUp = true;
        });

        var value = cards[0].value;

        if (value == SPECIAL.INVISIBLE && this.pile.isEmpty() == false) {
            cards.forEach(c => {
                c.transparent = true;
            });
        }

        this.pile.place(cards);

        if (this.pile.peek().value == SPECIAL.BURN) {
            this.pile.pickUp(); // discard the pile
        }

        if (cards.length == 4) {
            this.pile.pickUp(); // discard the pile
        }

        if (this.pile.sameLastFour()) {
            this.pile.pickUp(); // discard the pile
        }
    }

    temp() {
        this.ctx.canvas.addEventListener('mousemove', e => {
            let toRender = false;
            let { x, y } = this.getPosition(e);
            toRender = toRender || this.human.onHover(x, y);

            if (this.lastCursorPosition) {
                toRender = toRender || this.human.onDrag(x, y, x - this.lastCursorPosition.x, y - this.lastCursorPosition.y);
                this.lastCursorPosition = { x, y };
            }

            if (toRender) {
                this.render();
            }
        })

        this.ctx.canvas.addEventListener('mouseup', e => {
            let { x, y } = this.getPosition(e);
            this.lastCursorPosition = null;
            if (this.human.onDrop(x, y)) {
                this.render();
            }
        });

        this.ctx.canvas.addEventListener('mousedown', e => {
            let { x, y } = this.getPosition(e);
            this.lastCursorPosition = { x, y };
            if (this.human.onClick(x, y)) {
                this.render();
            }
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

        // render AI players
        let panimDone = _.every(_.map(this.aiPlayers, p => {
            this.ctx.rotate(((360 / (this.aiPlayers.length + 1)) * Math.PI) / 180);
            return p.render(this.ctx);
        }));

        this.ctx.rotate(Math.PI / 2);


        // render human player
        this.human.render(this.ctx);

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
        _.remove(this.animations, animate => {
            return !animate(this.ctx);
        });
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
