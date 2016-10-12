var Card = function(value, suit, x, y, faceUp, transparent, selected) {

    // base attributes
    this.value = value;
    this.suit = suit;

    // geometry attributes
    this.x = x;
    this.y = y;
    this.height = CARD.HEIGHT;
    this.width = CARD.WIDTH;

    // visual attributes
    this.faceUp = faceUp != null ? faceUp: false;
    this.transparent = transparent != null ? transparent: false;
    this.selected = selected != null ? selected: false;

    this.render = function(ctx) {
        if (this.faceUp == false) {
            // render back of card
            ctx.fillStyle = CARD.BACKCOLOR;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        } else if (this.transparent == true) {
            // render as transparent
            ctx.globalAlpha = CARD.INVISIBLE.OPACITY;
            ctx.fillStyle = CARD.INVISIBLE.COLOR;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.globalAlpha = 1;
        } else if (this.selected == true) {
            // render as selected
            this.drawFace(ctx, CARD.SELECTED.COLOR);
        } else {
            // normal face up card
            this.drawFace(ctx, CARD.BACKGROUNDCOLOR);
        }

        // in all cases draw the border
        ctx.fillStyle = CARD.BORDERCOLOR;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    };

    this.drawFace = function(ctx, background) {
        ctx.fillStyle = background;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        var centerX = this.x + this.width / 2 - 5;
        var centerY = this.y + this.height / 2;
        ctx.fillStyle = CARD.VALUECOLOR;
        ctx.font = CARD.FONT;

        var face = "";
        if (this.value < FACE.JACK) {
            face = this.value;
        } else if (this.value == FACE.JACK) {
            face = 'J';
        } else if (this.value == FACE.QUEEN) {
            face = 'Q';
        } else if (this.value == FACE.KING) {
            face = 'K';
        } else {
            face = 'A';
        }
        ctx.fillText(face, centerX, centerY);
        ctx.fillStyle = "red";  // TODO get suit rendering
        ctx.fillText(Object.keys(SUIT)[this.suit][0], centerX, centerY + 20);
    };

    this.flip = function() {
        this.faceUp = !(this.faceUp);
    };

    this.setFaceUp = function(faceUp){
        this.faceUp = faceUp;
    };

    this.setTransparent = function(transparent) {
        this.transparent = transparent;
    };

    this.setSelected = function(selected) {
        this.selected = selected;
    };

    this.setPosition = function(x, y) {
        this.x = x;
        this.y = y;
    };

    this.compareTo = function(card) {
        if (card == null) {
            return 1;
        }

        return this.value - card.value;
    };

    this.isSpecial = function() {
        return (this.value == SPECIAL.RESET
                || this.value == SPECIAL.INVISIBLE
                || this.value == SPECIAL.BURN);
    };
};
