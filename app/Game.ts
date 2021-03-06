import * as _ from 'lodash';
import {
    CardType,
    GAME,
    PILE,
    CARD,
    LOG,
    BOARD,
    DECK,
    MESSAGE
} from "./Constants";
import Deck from "./Deck";
import Player from "./Player";
import AIPlayer from './AIPlayer';
import HumanPlayer from './HumanPlayer';
import Card from "./Card";
import Panel from './Panel';
import { ValidPlay, ApplyCards, TotalToDraw } from './Rules';
import { Animation, cardDrawAnimation, cardPlayAnimation, bannerAnimation } from './Animation';
import { EventHandler } from './Event';

class Game {
    ctx: CanvasRenderingContext2D;
    aiPlayers: AIPlayer[];
    human: HumanPlayer;
    deck: Deck;
    pile: Deck;
    panels: Panel[];
    animations: Animation[];
    eventHandler: EventHandler;
    winners: string[];
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
            this.triggerPlayPhase.bind(this)
        );
        this.setupPlayer(this.human);

        this.aiPlayers = [];
        _.range(nPlayers - 1).forEach(() => {
            var p = new AIPlayer();

            this.setupPlayer(p);

            this.aiPlayers.push(p);
        });

        this.panels = [];
        this.animations = [];
        this.registerEventHandler();
        this.winners = [];

        this.animations.push(bannerAnimation('Swap Phase', 25));

        this.render(() => {
            this.aiPlayers.forEach(p => {
                p.autoSwapCards();
            })

            const msg = 'Swap cards between your hand and\nyour face ups by dragging them.\nHint: you want the powerful cards as face ups.';
            this.panels.push(new Panel(this.human.x + 280, this.human.y - 100, msg));
            this.panels.push(new Panel(this.deck.x + 90, this.deck.y + 10, 'Click on the deck\nwhen you are ready '));

            this.render(() => {
                this.eventHandler.listen();
            })
        })
    }

    triggerPlayPhase() {
        this.human.switchPlayState();
        this.human.clickDeck = this.humanDeckFlip.bind(this);

        this.animations.push(bannerAnimation('Play Phase'));

        this.panels = [];
        this.panels.push(new Panel(this.human.x + 280, this.human.y - 100, 'You can play multiple cards at \nonce by dragging them together  '));
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

    playHuman(cards: Card[]) {
        this.panels = [];

        if (ValidPlay(cards, this.pile.topValue())) {
            this.applyCards(cards);

            let total = TotalToDraw(this.human.cardsInHand(), this.deck);
            _.forEach(_.range(total), () => {
                let card = this.deck.draw();
                card.faceUp = true;
                this.human.animations.push(cardDrawAnimation(this.human, CardType.Hand, card, 8));
            });
        } else {
            this.human.addToHand(_.concat(cards, this.pile.pickUp()));
        }

        if (this.human.isDone()) { // winning move
            this.winners.push('Player');
        }

        this.eventHandler.pause();
        this.render(() => {
            this.loop();
        });
    }

    humanDeckFlip() {
        if (this.deck.isEmpty()) {
            return;
        }

        this.eventHandler.pause();
        this.deck.flipTop();
        this.render();


        let self = this;
        window.setTimeout(() => {
            let cards = [self.deck.draw().flip()];
            self.playHuman(cards);
        }, 500);
    }

    loop(index = 0) {
        if (index >= this.aiPlayers.length) {
            this.eventHandler.listen();
            return;
        }

        let self = this;
        window.setTimeout(() => {
            self.playAI(index);
        }, GAME.DELAY);
    }

    playAI(index: number) {
        let p = this.aiPlayers[index];

        if (p.isDone()) {
            this.loop(index + 1);
            return;
        }

        let cards = p.play(this.pile.topValue());
        if (_.isEmpty(cards) || !ValidPlay(cards, this.pile.topValue())) {
            // TODO flip top card

            _.forEach(this.pile.pickUp(), card => {
                p.animations.push(cardDrawAnimation(p, CardType.Hand, card));
            });

            this.render(() => {
                // one more rendering for hand re-ordering
                p.reorderHand();
                this.render(() => {
                    this.loop(index + 1);
                });
            });

            return;
        }

        p.animations.push(cardPlayAnimation(cards));

        if (p.isDone()) { // winning move
            this.winners.push('AI #' + (index + 1));
        }

        this.render(() => {
            this.applyCards(cards);

            let total = TotalToDraw(p.cardsInHand(), this.deck);
            _.forEach(_.range(total), () => {
                p.animations.push(cardDrawAnimation(p, CardType.Hand, this.deck.draw()));
            });

            this.render(() => {
                p.reorderHand();
                this.render(() => {
                    this.loop(index + 1);
                });
            });
        });
    }

    applyCards(cards: Card[]) {
        if (LOG) {
            console.log("Played [" + _.join(_.map(cards, 'value')) + "] on " + (this.pile.isEmpty() ? "nothing" : this.pile.peek().value));
        }

        ApplyCards(cards, this.pile);
    }

    gameover(): boolean {
        return (this.winners.length == (this.aiPlayers.length + 1)) || _.indexOf(this.winners, 'Player') >= 0;
    }

    registerEventHandler() {
        let onHover = function(x: number, y: number) {
            if (this.human.onHover(x, y)) {
                this.render();
            }
        }.bind(this);

        let onClick = function(x: number, y: number) {
            if (this.human.onClick(x, y)) {
                this.render();
            }
        }.bind(this);

        let onDrag = function(x: number, y: number, dx: number, dy: number) {
            if (this.human.onDrag(x, y, dx, dy)) {
                this.render();
            }
        }.bind(this);

        let onDrop = function(x: number, y: number) {
            if (this.human.onDrop(x, y)) {
                this.render();
            }
        }.bind(this);

        this.eventHandler = new EventHandler(this.ctx.canvas, { onHover, onClick, onDrag, onDrop });
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
        let aiAnimsDone = _.every(_.map(this.aiPlayers, p => {
            this.ctx.rotate(((360 / (this.aiPlayers.length + 1)) * Math.PI) / 180);
            return p.render(this.ctx);
        }));

        this.ctx.rotate(Math.PI / 2);

        // render human player
        let humanAnimsDone = this.human.render(this.ctx);

        // show scoreboard
        if (this.gameover()) {
            var position = _.indexOf(this.winners, 'Player') + 1;
            this.ctx.fillStyle = BOARD.MESSAGECOLOR;
            this.ctx.font = BOARD.MESSAGEFONT;
            this.ctx.fillText(
                "Congrats you finished #" + position,
                MESSAGE.ZONE1.x,
                MESSAGE.ZONE1.y
            );
        }

        _.forEach(this.panels, panel => {
            panel.render(this.ctx);
        });

        // render animations
        _.remove(this.animations, animate => {
            return animate(this.ctx);
        });
        let globalAnimsDone = _.isEmpty(this.animations);

        // re-center board
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);

        if (humanAnimsDone && aiAnimsDone && globalAnimsDone) {
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
