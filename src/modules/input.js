export class InputHandler {
    constructor() {
        this.keys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false,
            w: false,
            a: false,
            s: false,
            d: false,
            Enter: false
        };

        window.addEventListener('keydown', (e) => {
            if (this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = true;
            }
        });

        window.addEventListener('keyup', (e) => {
            if (this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = false;
            }
        });
    }

    get direction() {
        let dx = 0;
        let dy = 0;

        if (this.keys.ArrowLeft || this.keys.a) dx = -1;
        if (this.keys.ArrowRight || this.keys.d) dx = 1;
        if (this.keys.ArrowUp || this.keys.w) dy = -1;
        if (this.keys.ArrowDown || this.keys.s) dy = 1;

        return { x: dx, y: dy };
    }
}
