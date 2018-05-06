import { CARD, FACE, SPECIAL, SUIT } from './Constants';
import { FRONT_SPRITE, BACK_SPRITE, BACK_NAME, cardMap } from './CardMap';

class Card {
  constructor(value, suit, x, y, faceUp, transparent) {
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

    // name in sprite sheet map
    this.name = this.getName(suit, value);

  }

  getName(suit, value) {
    var name = '';
    switch (suit) {
    case SUIT.SPADE:
      name += 'Spades';
      break;
    case SUIT.DIAMOND:
      name += 'Diamonds';
      break;
    case SUIT.CLOVER:
      name += 'Clubs';
      break;
    case SUIT.HEART:
      name += 'Hearts';
      break;
    }
    switch (value) {
    case FACE.JACK:
      name += 'J';
      break;
    case FACE.QUEEN:
      name += 'Q';
      break;
    case FACE.KING:
      name += 'K';
      break;
    case FACE.ACE:
      name += 'A';
      break;
    default:
      name += value;
      break;
    }
    return name;
  }

  render(ctx) {
    if (this.faceUp == false) {
      // render back of card
      this.drawCard(ctx, BACK_NAME, BACK_SPRITE);
    } else if (this.transparent == true) {
      // render as transparent
      ctx.globalAlpha = CARD.INVISIBLE.OPACITY;
      ctx.fillStyle = CARD.INVISIBLE.COLOR;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.globalAlpha = 1;
    } else {
      // normal face up card
      this.drawCard(ctx, this.name, FRONT_SPRITE);
    }

    // in all cases draw the border
    // ctx.fillStyle = CARD.BORDER_COLOR;
    // ctx.strokeRect(this.x, this.y, this.width, this.height);
  }

  drawCard(ctx, cardMapName, elementId) {
    var position = cardMap[cardMapName];
    var sx = position.x;
    var sy = position.y;
    var sWidth = position.width;
    var sHeight = position.height;

    var dx = this.x;
    var dy = this.y;
    var dWidth = this.width;
    var dHeight = this.height;
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
    this.faceUp = !(this.faceUp);
  }

  setFaceUp(faceUp) {
    this.faceUp = faceUp;
  }

  setTransparent(transparent) {
    this.transparent = transparent;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  compareTo(card) {
    if (card == null) {
      return 1;
    }

    return this.value - card.value;
  }

  isSpecial() {
    return (this.value == SPECIAL.RESET ||
            this.value == SPECIAL.INVISIBLE ||
            this.value == SPECIAL.BURN);
  };
}

export default Card;
