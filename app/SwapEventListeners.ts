import * as _ from "lodash";
import EventListeners from "./EventListeners";

class SwapEventListeners extends EventListeners {
    done: any;
    swapFct: any;
    reorderHand: any;
    highlighted: any;
    selected: any;
    lastCursorPosition: any;
    constructor(
        width: number,
        height: number,
        render: any,
        detectCard: any,
        done: any,
        swapFct: any,
        reorderHand: any
    ) {
        super(width, height, render, detectCard);

        this.highlighted = null;

        this.swapFct = swapFct;
        this.reorderHand = reorderHand;
        this.done = done;

        this.selected = null;

        this.lastCursorPosition = null;
    }

    onMouseDown(e: any) {
        var { x, y } = this.getMousePosition(e);
        var { c, type } = this.detectCard(x, y);

        if (c && (type == "hand" || type == "faceup")) {
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
        var { c, type } = this.detectCard(x, y);

        if (type == "deck") {
            this.done();
            this.render();
            return;
        }

        if (!this.selected) {
            return;
        }

        if (this.selected.type == "hand") {
            var result = this.detectCard(x, y, "faceup");
            c = result.c;
            type = result.type;

            if (type) {
                this.swapFct(this.selected.c, c);
            }
        } else if (this.selected.type == "faceup") {
            var result = this.detectCard(x, y, "hand");
            c = result.c;
            type = result.type;

            if (type) {
                this.swapFct(c, this.selected.c);
            }
        } else {
            // just dropped it
            this.reorderHand();
        }

        this.selected = null;
        this.lastCursorPosition = null;
        this.render();
    }
}

export default SwapEventListeners;
