class EventListeners {
    width: number;
    height: number;
    render: any;
    detectCard: any;
    constructor(width: number, height: number, render: any, detectCard: any) {
        this.width = width;
        this.height = height;

        this.render = render;
        this.detectCard = detectCard;

        this.getMousePosition = this.getMousePosition.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
    }

    getMousePosition(e: any) {
        var x = e.offsetX - this.width / 2;
        var y = e.offsetY - this.height / 2;
        return { x, y };
    }

    onMouseDown(e: any) {

    }

    onMouseMove(e: any) {

    }

    onMouseUp(e: any) {

    }
}

export default EventListeners;
