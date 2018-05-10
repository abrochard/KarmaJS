class EventListeners {
  constructor(width, height, render, detectHand, detectFaceUp, detectPile, detectDeck) {
    this.width = width;
    this.height = height;

    this.render = render;
    this.detectHand = detectHand;
    this.detectFaceUp = detectFaceUp;
    this.detectPile = detectPile;
    this.detectDeck = detectDeck;

    this.getMousePosition = this.getMousePosition.bind(this);
    this.detectCard = this.detectCard.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  getMousePosition(e) {
    var x = e.offsetX - this.width / 2;
    var y = e.offsetY - this.height / 2;
    return {x, y};
  }

  detectCard({x, y}) {
    var c = this.detectHand(x, y);
    var type = 'hand';

    if (c) {
      return {c, type};
    }

    c = this.detectFaceUp(x, y);
    type = 'faceUp';
    if (c) {
      return {c, type};
    }

    return {c: null, type: null};
  }

  onMouseDown(e) {

  }

  onMouseMove(e) {

  }

  onMouseUp(e) {

  }
}

export default EventListeners;
