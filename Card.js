var Card = function(value, suit, x, y, faceUp, transparent) {

    // base attributes
    this.value = value;
    this.suit = suit;

    // geometry attributes
    this.x = x;
    this.y = y;
    this.height = CARD.HEIGHT;
    this.width = CARD.WIDTH;

    // visual attributes
    this.faceUp = faceUp;
    this.backColor = CARD.BACKCOLOR;
    this.borderColor = CARD.BORDERCOLOR;
    this.transparent = transparent;

    this.render = function(ctx) {
        if (this.faceUp == false && this.transparent == false) {
            ctx.fillStyle = this.backColor;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        } else if(this.transparent == false) {
            ctx.fillStyle = "white";
            ctx.fillRect(this.x, this.y, this.width, this.height);

            var centerX = this.x + this.width / 2 - 5;
            var centerY = this.y + this.height / 2;
            ctx.fillStyle = "black";
            ctx.font = CARD.FONT;
            ctx.fillText(this.value, centerX, centerY);
            ctx.fillStyle = "red";
            ctx.fillText(Object.keys(SUIT)[this.suit][0], centerX, centerY + 20);
        } else {
            // draw with less opacity
            ctx.globalAlpha = CARD.INVISIBLE;
            ctx.fillStyle = "red";
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.globalAlpha = 1;
        }

        ctx.fillStyle = this.borderColor;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
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
