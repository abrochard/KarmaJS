import * as _ from 'lodash';

class Panel {
    x: number;
    y: number;

    width: number;
    height: number;

    content: string;
    lines: string[];

    constructor(x: number, y: number, content: string) {
        this.x = x;
        this.y = y;
        this.content = content;

        this.lines = content.split('\n');

        this.height = this.lines.length * 40;
        this.width = 8 * _.maxBy(this.lines, 'length').length + 20;
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.fillStyle = 'black';
        ctx.globalAlpha = .7;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.fillStyle = 'white';
        ctx.globalAlpha = 1;
        ctx.font = '20px serif';
        _.forEach(this.lines, (line, i) => {
            ctx.fillText(line, this.x + 10, this.y + 35 + i * 30);
        })
        ctx.restore();
    }
}

export default Panel;
