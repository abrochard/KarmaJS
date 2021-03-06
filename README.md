# KarmaJS
Typescript based Karma card game

## Demo
Latest version playable at [https://abrochard.com/KarmaJS](https://abrochard.com/KarmaJS)

## How to play
For rules see below.

Click on a card to play it. Drag with the mouse on multiple cards of
the same value to play them together.

At the beginning of the game you are allowed to swap cards between
your hand and your face up cards. To do so, click on a card to select
it and then on another one to swap it with the selected card. When you
are done swapping, click on the deck to begin the game.

## Rules

### Goal
The goal of the game is to get rid of all your cards. For that you
must play a card of value equal or greater to what is on top of the
pile. If the pile is empty you can play anything. If you cannot beat
the top card, you must pick up the entire pile. Once you got rid of
all the cards in your hand, you have to play from the three face up
cards in front of you. Once you have no more face up cards, you must
randomly pick from the three face down cards and hope to beat the top
card.

### Setup
Each player is given 3 cards as a hand, 3 cards face up and visible to
all, and 3 cards face down and unknown. The player is allowed before
the game begins to swap cards between his hands and his face up cards.

### Typical turn
On a typical turn, you would:
  * play a card from your hand/faceups/facedowns. If you have multiple
    cards of the same value, you can play them all together.
  * If you cannot beat the top card you can:
    * Directly pick up the pile
    * Test your luck by drawing the first card of the deck
  * keep drawing from the deck if there are still cards in it and if
    you have less than 3 cards in hand.

### Special cards
There are a few special rules and cards.
  * The 2 can be played on top of any card and acts as a reset. The
    player after you can play anything on top.
  * The 3 can be played on top of any card and is considered
    invisible. The player after you has to beat the value of the card
    below your 3.
  * The 10 can be played on top of any card and burns the entire
    pile. The pile is removed from play and no one can pick it up.
  * The 7 can only be played on a 7 or below. The player after you has
    to play 7 or below (instead of 7 or above). The game goes back to
    normal after, unless the player after you puts another 7,
    propagating the effect to the next next player.
  * Four of a kind (or four consecutive cards of the same value) can
    be played at any time and acts like a 10. Notice that if at any
    time the pile contains four consecutive cards of the same value
    the pile is burned. And 3 being invisible, a combination like 5 5
    3 3 5 5 would still burn the pile.

## TODO
  * smarter AI
  * mobile compatibility
  * AI play face up multiple cards
  * too many cards in hands
  * self flip animation
  * invisible card duplicate rendering bug?
  * AI not picking best faceup value
  * visual select for card swapping
  * playable cards highlighting
  * force to play when player can play
  * fix the drop face up/face down where cards don't go back to their place
