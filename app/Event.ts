import * as _ from 'lodash';

interface Element {
    x: number,
    y: number,
    width: number,
    height: number
}

interface Callback {
    (x: number, y: number, active: boolean): void
}

export enum EventType {
    Click,
    Hover,
    Drag,
    Drop
}

interface Listener {
    element: Element,
    fct: Callback,
    eventType: EventType
}

function inBound(element: Element, x: number, y: number): Boolean {
    if (x > element.x && x < element.x + element.width) {
        if (y > element.y && y < element.y + element.height) {
            return true;
        }
    }
    return false;
}

function isEventType(eventType: EventType): (listener: Listener) => boolean {
    return (listener: Listener): boolean => {
        return listener.eventType == eventType;
    }
}


export class EventHandler {
    canvas: HTMLElement;
    acceptInput: boolean;
    listeners: Listener[];
    clickedOn: Listener[];
    hoveredOn: Listener[];
    lastCursorPosition: { x: number, y: number };
    constructor(canvas: HTMLElement) {
        this.canvas = canvas;
        this.acceptInput = false;

        this.listeners = [];
        this.clickedOn = []
        this.hoveredOn = [];

        this.lastCursorPosition = null;

        this.canvas.addEventListener('mousedown', this.onClick.bind(this));
        this.canvas.addEventListener('mousemove', this.onHover.bind(this));
        this.canvas.addEventListener('mousemove', this.onDrag.bind(this));
        this.canvas.addEventListener('mouseup', this.onDrop.bind(this));
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

    register(element: Element, eventType: EventType, fct: Callback) {
        this.listeners.push({ element, fct, eventType });
    }

    deregister(element: Element, eventType: EventType) {
        _.remove(this.listeners, listener => {
            return !(listener.element == element && listener.eventType == eventType);
        })
    }

    onClick(e: MouseEvent) {
        if (!this.acceptInput) {
            return;
        }

        let { x, y } = this.getMousePosition(e);
        _.filter(this.listeners, isEventType(EventType.Click)).forEach(listener => {
            if (inBound(listener.element, x, y)) {
                listener.fct(x, y, true);
                this.clickedOn.push(listener);
                this.lastCursorPosition = { x, y };
            }
        });
    }


    onHover(e: MouseEvent) {
        if (!this.acceptInput) {
            return;
        }

        let { x, y } = this.getMousePosition(e);

        let hoveringOn = this.listeners.filter(({ element, eventType }) => {
            if (eventType !== EventType.Hover) {
                return false;
            }

            return inBound(element, x, y);
        })


        let notHoveringAnymore = _.filter(this.hoveredOn, listener => {
            return !_.includes(hoveringOn, listener);
        });
        let newHovers = _.filter(hoveringOn, listener => {
            return !_.includes(this.hoveredOn, listener);
        })

        notHoveringAnymore.forEach((listener) => {
            listener.fct(x, y, false);
        })

        newHovers.forEach((listener) => {
            listener.fct(x, y, true);
        })

        this.hoveredOn = hoveringOn;
    }

    onDrag(e: MouseEvent) {
        if (!this.acceptInput) {
            return;
        }

        if (_.isEmpty(this.clickedOn)) {
            return;
        }

        let { x, y } = this.getMousePosition(e);
        _.filter(this.listeners, isEventType(EventType.Drag)).forEach(listener => {
            let i = _.findIndex(this.clickedOn, ({ element }) => {
                return element == listener.element;
            })
            if (i >= 0) {
                let dx = x - this.lastCursorPosition.x;
                let dy = y - this.lastCursorPosition.y;
                this.lastCursorPosition = { x, y };
                listener.fct(dx, dy, true);
            }
        });
    }

    onDrop(e: MouseEvent) {
        if (!this.acceptInput) {
            return;
        }

        if (_.isEmpty(this.clickedOn)) {
            return;
        }

        let { x, y } = this.getMousePosition(e);
        _.filter(this.listeners, isEventType(EventType.Drop)).forEach(listener => {
            let i = _.findIndex(this.clickedOn, ({ element }) => {
                return element == listener.element;
            })
            if (i >= 0) {
                listener.fct(x, y, true);
                _.remove(this.clickedOn, listener);
            }
        });
    }
}
