var Card = function(value, suit, x, y, faceUp, transparent) {

  var self = this;

  // base attributes
  self.value = value;
  self.suit = suit;

  // geometry attributes
  self.x = x;
  self.y = y;
  self.height = CARD.HEIGHT;
  self.width = CARD.WIDTH;

  // visual attributes
  self.faceUp = faceUp != null ? faceUp : false;
  self.transparent = transparent != null ? transparent : false;

  // name in sprite sheet map
  self.name = getName(suit, value);

  function getName(suit, value) {
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

  self.render = function(ctx) {
    if (self.faceUp == false) {
      // render back of card
      self.drawCard(ctx, BACK_NAME, BACK_SPRITE);
    } else if (self.transparent == true) {
      // render as transparent
      ctx.globalAlpha = CARD.INVISIBLE.OPACITY;
      ctx.fillStyle = CARD.INVISIBLE.COLOR;
      ctx.fillRect(self.x, self.y, self.width, self.height);
      ctx.globalAlpha = 1;
    } else {
      // normal face up card
      self.drawCard(ctx, self.name, FRONT_SPRITE);
    }

    // in all cases draw the border
    ctx.fillStyle = CARD.BORDER_COLOR;
    ctx.strokeRect(self.x, self.y, self.width, self.height);
  };

  self.drawCard = function(ctx, cardMapName, elementId) {
    var position = cardMap[cardMapName];
    var sx = position.x;
    var sy = position.y;
    var sWidth = position.width;
    var sHeight = position.height;
    var dx = self.x;
    var dy = self.y;
    var dWidth = self.width;
    var dHeight = self.height;
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
  };

  self.flip = function() {
    self.faceUp = !(self.faceUp);
  };

  self.setFaceUp = function(faceUp) {
    self.faceUp = faceUp;
  };

  self.setTransparent = function(transparent) {
    self.transparent = transparent;
  };

  self.setPosition = function(x, y) {
    self.x = x;
    self.y = y;
  };

  self.compareTo = function(card) {
    if (card == null) {
      return 1;
    }

    return self.value - card.value;
  };

  self.isSpecial = function() {
    return (self.value == SPECIAL.RESET ||
            self.value == SPECIAL.INVISIBLE ||
            self.value == SPECIAL.BURN);
  };
};
