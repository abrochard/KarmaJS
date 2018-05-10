import _ from 'lodash';
import EventListeners from './EventListeners';

class SwapEventListeners extends EventListeners {
  constructor(width, height, render, detectHand, detectFaceUp, detectPile, detectDeck, swapFct, reorderHand) {
    super(width, height, render, detectHand, detectFaceUp, detectPile, detectDeck);

    // this.highlighted = {
    //   hand: null,
    //   faceUp: null
    // };
    this.highlighted = null;

    this.swapFct = swapFct;
    this.reorderHand = reorderHand;


    this.selected = null;

    this.lastCursorPosition = null;
  }

  onMouseDown(e) {
    var {x, y} = this.getMousePosition(e);
    var c = this.detectHand(x, y);
    var type = 'hand';
    if (!c) {
      c = this.detectFaceUp(x, y);
      type = 'faceup';
    }

    if (c) {
      this.selected = {c, type};
      this.lastCursorPosition = {x, y};
    }
  }

  onMouseMove(e) {
    var toRender = false;
    var {x, y} = this.getMousePosition(e);

    var c = this.detectHand(x, y);
    if (!c) {
      c = this.detectFaceUp(x, y);
    }

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
    } else if(this.highlighted) {
      this.highlighted.setHighlight(false);
      this.highlighted = null;
      toRender = true;
    }

    if (this.selected && this.lastCursorPosition) {
      var dx = x - this.lastCursorPosition.x;
      var dy = y - this.lastCursorPosition.y;
      this.selected.c.translate(dx, dy);
      this.lastCursorPosition = {x, y};
      toRender = true;
    }

    if (toRender) {
      this.render();
    }
  }

  onMouseUp(e) {
    if (!this.selected) {
      return;
    }

    var {x, y} = this.getMousePosition(e);
    var c = this.detectFaceUp(x, y);

    if (this.selected.type == 'faceup') {
      c = this.detectHand(x, y);
    }

    if (c && this.selected.type == 'hand') {
      this.swapFct(this.selected.c, c);
    } else if (c && this.selected.type == 'faceup') {
      this.swapFct(c, this.selected.c);
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
