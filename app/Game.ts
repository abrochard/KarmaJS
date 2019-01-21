import * as _ from "lodash";
import {
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

import SwapEventListeners from "./SwapEventListeners";
import PlayEventListeners from "./PlayEventListeners";

import { Animation, cardDrawAnimation, Type } from './Animation';
import { EventType, EventHandler } from './Event';

class Game {
    canvas: any;
    ctx: any;
    deck: Deck;
    pile: Deck;
    players: Player[];
    winners: Player[];
    pickedCards: Card[];
    selectedCards: Card[];
    acceptInput: boolean;
    acceptMove: boolean;
    inputType: string;
    swapCards: boolean;
    clickedOnPile: boolean;
    clickedOnDeck: boolean;
    finished: boolean;
    selected: boolean;
    engaged: any;
    highligted: any;
    lastPosition: any;
    swapEL: any;
    playEL: any;
    animations: Animation[];
    eventHandler: EventHandler;
    constructor(canvas: any) {
        this.canvas = canvas;
        this.ctx = null;
        this.deck = null;
        this.pile = null;
        this.players = [];
        this.winners = [];

        this.pickedCards = [];
        this.selectedCards = [];
        this.acceptInput = false;
        this.acceptMove = false;
        this.inputType = "";
        this.swapCards = false;
        this.clickedOnPile = false;
        this.clickedOnDeck = false;

        this.finished = false;

        this.playAI = this.playAI.bind(this);
        this.playAICallback = this.playAICallback.bind(this);
        this.detectDeckClick = this.detectDeckClick.bind(this);
        this.detectPileClick = this.detectPileClick.bind(this);
        this.render = this.render.bind(this);

        this.selected = false;
        this.engaged = false;
        this.highligted = null;
        this.lastPosition = {};

        this.swapEL = null;
        this.playEL = null;

        this.animations = [];

        this.eventHandler = new EventHandler(canvas);
    }

    init(nPlayers = GAME.PLAYERS) {
        this.ctx = this.canvas.getContext("2d");

        // DECK
        this.deck = new Deck(DECK.X, DECK.Y, DECK.MAX_RENDER);
        this.deck.generate(false);
        this.deck.shuffle();

        // PILE
        this.pile = new Deck(PILE.X, PILE.Y, PILE.MAX_RENDER);

        // PLAYERS
        this.players = [];
        _.range(nPlayers).forEach(i => {
            var p = new Player(i == 0);

            _.range(3).forEach(() => {
                let faceDown = this.deck.draw();
                p.animations.push(cardDrawAnimation(p, Type.Hand, faceDown))

                let faceUp = this.deck.draw();
                faceUp.flip();
                p.animations.push(cardDrawAnimation(p, Type.FaceUp, faceUp));

                let h = this.deck.draw();
                p.animations.push(cardDrawAnimation(p, Type.FaceDown, h));
            });

            this.players.push(p);
        });

        // animate card dealing and then start swapping
        this.render(() => {
            this.initSwap();
        });
    }

    initSwap() {
        // auto swap the AIs first
        this.players.forEach(p => {
            if (!p.human) {
                p.autoSwapCards();
            }
            p.reorderHand();
        });

        let card = this.players[0].hand[0];
        this.eventHandler.register(
            card,
            EventType.Click,
            (x, y, _) => {
                log(x, y);
            }
        );

        this.eventHandler.register(
            card,
            EventType.Drag,
            (dx, dy, _) => {
                card.translate(dx, dy);
                this.render();
            }
        );

        this.eventHandler.register(
            card,
            EventType.Drop,
            (x, y, _) => {
                log(x, y);
            }
        )

        this.eventHandler.register(
            card,
            EventType.Hover,
            (x, y, active) => {
                card.setHighlight(active);
                this.render();
            }
        )

        this.eventHandler.listen();

        // var swapFct = (handCard: Card, faceUpCard: Card) => {
        //     var human = this.players[0];
        //     var handIndex = _.indexOf(human.hand, handCard);
        //     var faceUpIndex = _.indexOf(human.faceUpCards, faceUpCard);
        //     human.swapCards(handIndex, faceUpIndex);
        // };

        // this.swapEL = new SwapEventListeners(
        //     this.canvas.width,
        //     this.canvas.height,
        //     this.render,
        //     this.detectCard.bind(this),
        //     this.doneSwapping.bind(this),
        //     swapFct,
        //     this.players[0].reorderHand.bind(this)
        // );

        // this.canvas.addEventListener("mousedown", this.swapEL.onMouseDown);
        // this.canvas.addEventListener("mousemove", this.swapEL.onMouseMove);
        // this.canvas.addEventListener("mouseup", this.swapEL.onMouseUp);

        this.render(() => {
            this.acceptInput = true;
            this.swapCards = true;
        });
    }

    detectCard(x: number, y: number, type: any = null) {
        var human = this.players[0];

        var detectHand = function(x: number, y: number) {
            var type = "hand";
            var c = human.selectCard(x, y, type);
            if (c) {
                return { c, type };
            } else {
                type = null;
                return { c, type };
            }
        };

        var detectFaceUp = function(x: number, y: number) {
            var type = "faceup";
            var c = human.selectCard(x, y, type);
            if (c) {
                return { c, type };
            } else {
                type = null;
                return { c, type };
            }
        };

        var detectPile = function(x: number, y: number) {
            var type = "pile";
            var c = null;
            if (this.detectPileClick(x, y, false)) {
                c = _.last(this.pile.cards);
            } else {
                type = null;
            }
            return { c, type };
        };

        var detectDeck = function(x: number, y: number) {
            var type = "deck";
            var c = null;
            if (this.detectDeckClick(x, y)) {
                c = _.last(this.deck.cards);
            } else {
                type = null;
            }
            return { c, type };
        };

        var detect: any = {
            hand: detectHand.bind(this),
            faceup: detectFaceUp.bind(this),
            pile: detectPile.bind(this),
            deck: detectDeck.bind(this)
        };

        if (type) {
            var result = detect[type](x, y);
            return result;
        }

        var results = _.map(detect, fct => {
            return fct(x, y);
        });

        var r = _.find(results, ({ type }) => {
            return type !== null;
        });

        if (r) {
            return r;
        } else {
            return { c: null, type: null };
        }
    }

    doneSwapping() {
        this.swapCards = false;

        var playCard = function(c: any) {
            this.players[0].removeCard(c, "hand");
            this.pickedCards.push(c);
            this.playCards();
        };

        this.playEL = new PlayEventListeners(
            this.canvas.width,
            this.canvas.height,
            this.render,
            this.detectCard.bind(this),
            playCard.bind(this),
            this.players[0].reorderHand.bind(this)
        );

        this.canvas.removeEventListener("mousedown", this.swapEL.onMouseDown);
        this.canvas.removeEventListener("mousemove", this.swapEL.onMouseMove);
        this.canvas.removeEventListener("mouseup", this.swapEL.onMouseUp);

        this.canvas.addEventListener("mousedown", this.playEL.onMouseDown);
        this.canvas.addEventListener("mousemove", this.playEL.onMouseMove);
        this.canvas.addEventListener("mouseup", this.playEL.onMouseUp);

        this.render();
    }

    loop() {
        // trigger the AI playing loop
        this.acceptInput = false;
        window.setTimeout(this.playAI, GAME.DELAY, this, 1);
    }

    playAI(game: any, index: number) {
        // timeout cascade function
        var p = game.players[index];

        if (LOG) {
            log("Player " + index);
        }

        if (p.isDone()) {
            if (index < game.players.length - 1) {
                // move on to the next player
                window.setTimeout(game.playAI, GAME.DELAY, game, index + 1);
                return;
            }

            // there is no next player
            game.acceptInput = true;
            return;
        }

        var total = p.play(game.pile.topValue());
        var delay = GAME.DELAY2;

        if (total == 0 && !game.deck.isEmpty()) {
            game.deck.flipTop();
        } else if (total == 0) {
            delay = 0; // don't wait and just pick up the card
        }

        game.render();
        window.setTimeout(this.playAICallback, delay, game, index);
    }

    playAICallback(game: any, index: number) {
        var p = game.players[index];
        var cards = p.playCallback();

        if (cards[0] == null && game.deck.isEmpty() == false) {
            // could not play a card, attempt to flip
            if (LOG) {
                log("AI flips deck");
            }
            cards[0] = game.deck.draw();
        }

        if (cards[0] == null) {
            // nothing in deck to flip...
            p.addToHand(game.pile.pickUp());

            if (LOG) {
                log("picked up");
            }
        } else if (game.validPlay(cards, game.pile.topValue()) == false) {
            // not valid card
            if (LOG) {
                log("Invalid play: " + cards[0].value + " on " + game.pile.topValue());
            }

            p.addToHand(game.pile.pickUp());
            p.addToHand(cards);
        } else {
            game.applyCards(cards);

            while (game.deck.isEmpty() == false && p.cardsInHand() < 3) {
                p.addToHand([game.deck.draw()]);
            }
        }

        if (p.isDone()) {
            // this was the winning move
            game.winners.push(index);

            if (game.winners.length == 3) {
                // player got wrecked
                game.finished = true;
            }
        }
        game.render();

        if (index < game.players.length - 1) {
            window.setTimeout(game.playAI, GAME.DELAY, game, index + 1);
        } else {
            game.acceptInput = true;
        }
    }

    applyCards(cards: Card[]) {
        if (LOG) {
            var top = this.pile.isEmpty() ? "nothing" : this.pile.peek().value;
            log("Played " + cards.length + " " + cards[0].value + " on " + top);
        }

        cards.forEach(c => {
            c.setFaceUp(true);
        });

        var value = cards[0].value;

        if (value == SPECIAL.INVISIBLE && this.pile.isEmpty() == false) {
            cards.forEach(c => {
                c.setTransparent(true);
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

    render(done?: () => void) {
        // recenter
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        // clear the board
        this.ctx.clearRect(
            -this.canvas.height / 2,
            -this.canvas.width / 2,
            this.canvas.width,
            this.canvas.height
        );

        // render board
        this.ctx.fillStyle = BOARD.COLOR;
        this.ctx.fillRect(
            -this.canvas.width / 2,
            -this.canvas.height / 2,
            this.canvas.width,
            this.canvas.height
        );

        this.deck.render(this.ctx);
        this.pile.render(this.ctx);

        // show instructions
        if (this.swapCards) {
            this.ctx.fillStyle = MESSAGE.COLOR;
            this.ctx.font = MESSAGE.FONT;
            this.ctx.fillText(
                "Click the deck to start playing",
                MESSAGE.ZONE1.x,
                MESSAGE.ZONE1.y
            );
            this.ctx.fillText("Swap cards first", MESSAGE.ZONE2.x, MESSAGE.ZONE2.y);
        }

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
        this.pickedCards.forEach(c => {
            c.render(this.ctx);
        });

        // show scoreboard
        if (this.finished) {
            var position = this.winners.length + 1;
            this.ctx.fillStyle = BOARD.MESSAGECOLOR;
            this.ctx.font = BOARD.MESSAGEFONT;
            this.ctx.fillText(
                "Congrats you finished #" + position,
                MESSAGE.ZONE1.x,
                MESSAGE.ZONE1.y
            );
        }

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

    detectSelection(x: number, y: number) {
        var human = this.players[0];
        var card = human.pickCard(x, y, this.inputType);

        if (
            card == null &&
            this.pickedCards.length == 0 &&
            this.detectDeckClick(x, y)
        ) {
            if (LOG) {
                log("Player tries to flip the deck");
            }
            this.clickedOnDeck = true;
            this.pickedCards.push(this.deck.draw());
            this.acceptMove = false;
        }

        if (
            card == null &&
            this.pickedCards.length == 0 &&
            this.detectPileClick(x, y)
        ) {
            if (LOG) {
                log("Player picks up");
            }
            this.clickedOnPile = true;
            this.acceptMove = false;
        }

        if (card != null) {
            this.pickedCards.push(card);
        }
    }

    playCards() {
        var human = this.players[0];
        if (this.pickedCards.length > 0) {
            if (LOG) {
                log("Human player");
            }

            this.clickedOnDeck = false;

            if (this.validPlay(this.pickedCards, this.pile.topValue())) {
                this.applyCards(this.pickedCards);

                while (this.deck.isEmpty() == false && human.cardsInHand() < 3) {
                    human.addToHand([this.deck.draw()]);
                }

                if (human.isDone()) {
                    // winning move
                    this.finished = true;
                    this.render();
                    return;
                }
            } else {
                // invalid play
                if (LOG) {
                    log(
                        "Invalid play: " +
                        this.pickedCards[0].value +
                        " on " +
                        this.pile.topValue()
                    );
                }
                human.addToHand(this.pickedCards);
                human.addToHand(this.pile.pickUp());
            }
            this.pickedCards = [];
            this.render();
            this.loop();
        } else if (this.clickedOnPile) {
            if (LOG) {
                log("Picked up the pile");
            }
            human.addToHand(this.pile.pickUp());
            this.clickedOnPile = false;
            this.render();
            this.loop();
        }
    }

    detectDeckClick(x: number, y: number) {
        if (x > this.deck.x && x < this.deck.x + CARD.WIDTH) {
            if (y > this.deck.y && y < this.deck.y + CARD.HEIGHT) {
                if (!this.deck.isEmpty()) {
                    return true;
                }
            }
        }
        return false;
    }

    detectPileClick(x: number, y: number, careEmpty: boolean = true) {
        if (x > this.pile.x && x < this.pile.x + CARD.WIDTH) {
            if (y > this.pile.y && y < this.pile.y + CARD.HEIGHT) {
                if (careEmpty) {
                    if (!this.pile.isEmpty()) {
                        return true;
                    }
                } else {
                    return true;
                }
            }
        }
        return false;
    }

    validPlay(cards: Card[], topValue: number) {
        // make sure all cards are of the same value
        var value = cards[0].value;
        for (var i = 1; i < cards.length; i++) {
            if (cards[i].value != value) {
                return false;
            }
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
        return value >= topValue;
    }

    encodeGame() {
        var game: any = {};
        game.nPlayers = this.players.length;
        game.deck = this.deck.cardsRemaining();
        game.pile = this.pile.cardsRemaining();
        game.players = [];
        this.players.forEach(p => {
            game.players.push(p.encode());
        });
    }
}

function log(...str: any) {
    console.log(str);
}

export default Game;
