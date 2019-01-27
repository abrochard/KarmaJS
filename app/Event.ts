import * as _ from 'lodash';

interface EventListeners {
    onHover: (x: number, y: number) => void;
    onClick: (x: number, y: number) => void;
    onDrag: (x: number, y: number, dx: number, dy: number) => void;
    onDrop: (x: number, y: number) => void;
}

export class EventHandler {
    canvas: HTMLElement;
    listeners: EventListeners;
    acceptInput: boolean;
    lastCursorPosition: { x: number, y: number };
    constructor(canvas: HTMLElement, listeners: EventListeners) {
        this.canvas = canvas;
        this.listeners = listeners;

        this.acceptInput = false;
        this.lastCursorPosition = null;

        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
    }

    listen() {
        this.acceptInput = true;
    }

    pause() {
        this.acceptInput = false;
    }

    getMousePosition(e: MouseEvent): { x: number, y: number } {
        let x = e.offsetX - this.canvas.offsetWidth / 2;
        let y = e.offsetY - this.canvas.offsetHeight / 2;
        return { x, y };
    }

    onMouseDown(e: MouseEvent) {
        if (!this.acceptInput) {
            return;
        }

        let { x, y } = this.getMousePosition(e);
        this.lastCursorPosition = { x, y };
        this.listeners.onClick(x, y);
    }

    onMouseMove(e: MouseEvent) {
        if (!this.acceptInput) {
            return;
        }

        let { x, y } = this.getMousePosition(e);
        this.listeners.onHover(x, y);

        if (this.lastCursorPosition) {
            this.listeners.onDrag(x, y, x - this.lastCursorPosition.x, y - this.lastCursorPosition.y);
            this.lastCursorPosition = { x, y };
        }
    }


    onMouseUp(e: MouseEvent) {
        if (!this.acceptInput) {
            return;
        }

        let { x, y } = this.getMousePosition(e);
        this.lastCursorPosition = null;
        this.listeners.onDrop(x, y);
    }
}
