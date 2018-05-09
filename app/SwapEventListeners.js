import _ from 'lodash';
import EventListeners from './EventListeners';

class SwapEventListeners extends EventListeners {
  constructor(width, height, render, detectHand, detectFaceUp, swapFct) {
    super(width, height, render, detectHand, detectFaceUp);

    // this.highlighted = {
    //   hand: null,
    //   faceUp: null
    // };
    this.highlighted = null;

    this.swapFct = swapFct;


    this.selected = null;

    this.lastCursorPosition = null;
  }

  onMouseDown(e) {
    var {x, y} = this.getMousePosition(e);
    var c = this.detectHand(x, y);

    if (c) {
      this.selected = c;
      this.lastCursorPosition = {x, y};
    }
  }

  onMouseMove(e) {
    var toRender = false;
    var {x, y} = this.getMousePosition(e);

    var c = this.detectHand(x, y);

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
      this.selected.translate(dx, dy);
      this.lastCursorPosition = {x, y};
      toRender = true;
    }

    if (toRender) {
      this.render();
    }
  }

  onMouseUp(e) {
    var {x, y} = this.getMousePosition(e);
    var c = this.detectFaceUp(x, y);

    if (c) {
      this.swapFct(this.selected, c);
    }


    this.selected = null;
    this.lastCursorPosition = null;

    this.render();
  }
}

export default SwapEventListeners;
