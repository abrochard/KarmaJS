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

        this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this));
        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this));
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.canvas.addEventListener('touchend', this.onTouchEnd.bind(this));
        this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
    }

    listen() {
        this.acceptInput = true;
    }

    pause() {
        this.acceptInput = false;
        this.lastCursorPosition = null;
    }

    getMousePosition(e: MouseEvent): { x: number, y: number } {
        let x = e.offsetX - this.canvas.offsetWidth / 2;
        let y = e.offsetY - this.canvas.offsetHeight / 2;
        return { x, y };
    }

    getTouchPosition(e: TouchEvent): { x: number, y: number } {
        if (e.touches.length == 0) {
            // this is a touchend event, need to send last coordinates
            return this.lastCursorPosition;
        }

        const x = e.touches[0].clientX - this.canvas.offsetWidth / 2;
        const y = e.touches[0].clientY - this.canvas.offsetHeight / 2;
        return { x, y };
    }

    onTouchStart(e: TouchEvent) {
        e.preventDefault();
        if (!this.acceptInput) {
            return;
        }

        let { x, y } = this.getTouchPosition(e);
        this.down(x, y);
    }

    onMouseDown(e: MouseEvent) {
        if (!this.acceptInput) {
            return;
        }

        let { x, y } = this.getMousePosition(e);
        this.down(x, y);
    }

    down(x: number, y: number) {
        this.lastCursorPosition = { x, y };
        this.listeners.onClick(x, y);
    }

    onTouchMove(e: TouchEvent) {
        e.preventDefault()
        if (!this.acceptInput) {
            return;
        }

        let { x, y } = this.getTouchPosition(e);
        this.move(x, y);
    }

    onMouseMove(e: MouseEvent) {
        if (!this.acceptInput) {
            return;
        }

        let { x, y } = this.getMousePosition(e);
        this.move(x, y);
    }

    move(x: number, y: number) {
        this.listeners.onHover(x, y);

        if (this.lastCursorPosition) {
            this.listeners.onDrag(x, y, x - this.lastCursorPosition.x, y - this.lastCursorPosition.y);
            this.lastCursorPosition = { x, y };
        }
    }

    onTouchEnd(e: TouchEvent) {
        e.preventDefault()
        if (!this.acceptInput) {
            return;
        }

        let { x, y } = this.getTouchPosition(e);
        this.up(x, y);
    }

    onMouseUp(e: MouseEvent) {
        if (!this.acceptInput) {
            return;
        }

        let { x, y } = this.getMousePosition(e);
        this.up(x, y);
    }

    up(x: number, y: number) {
        this.lastCursorPosition = null;
        this.listeners.onDrop(x, y);

    }
}
