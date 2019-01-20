import EventListeners from "./EventListeners";

class PlayEventListeners extends EventListeners {
    playCard: any;
    reorderHand: any;
    highlighted: any;
    selected: any;
    lastCursorPosition: any;
    constructor(
        width: number,
        height: number,
        render: any,
        detectCard: any,
        playCard: any,
        reorderHand: any
    ) {
        super(width, height, render, detectCard);

        this.playCard = playCard;
        this.reorderHand = reorderHand;

        this.highlighted = null;

        this.selected = null;

        this.lastCursorPosition = null;
    }

    onMouseDown(e: any) {
        var { x, y } = this.getMousePosition(e);
        var { c, type } = this.detectCard(x, y, "hand");

        if (c) {
            this.selected = { c, type };
            this.lastCursorPosition = { x, y };
        }
    }

    onMouseMove(e: any) {
        var toRender = false;
        var { x, y } = this.getMousePosition(e);
        var { c } = this.detectCard(x, y);

        if (c) {
            if (this.highlighted) {
                if (this.highlighted != c) {
                    this.highlighted.setHighlight(false);
                    this.highlighted = null;
                }
            }
            this.highlighted = c;
            this.highlighted.setHighlight(true);
            toRender = true;
        } else if (this.highlighted) {
            this.highlighted.setHighlight(false);
            this.highlighted = null;
            toRender = true;
        }

        if (this.selected && this.lastCursorPosition) {
            var dx = x - this.lastCursorPosition.x;
            var dy = y - this.lastCursorPosition.y;
            this.selected.c.translate(dx, dy);
            this.lastCursorPosition = { x, y };
            toRender = true;
        }

        if (toRender) {
            this.render();
        }
    }

    onMouseUp(e: any) {
        var { x, y } = this.getMousePosition(e);
        var { c, type } = this.detectCard(x, y, "pile");

        if (type) {
            this.playCard(this.selected.c);
        } else {
            this.reorderHand();
        }

        this.selected = null;
        this.lastCursorPosition = null;
        this.render();
    }
}

export default PlayEventListeners;
