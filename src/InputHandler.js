export class InputHandler {
    constructor() {
        this.keys = {};
        window.addEventListener('keydown', (e) => this.keys[e.code] = true);
        window.addEventListener('keyup', (e) => this.keys[e.code] = false);
    }

    isKeyDown(code) {
        return !!this.keys[code];
    }
    
    getMovementVector() {
        let x = 0;
        let y = 0;

        if (this.isKeyDown('KeyW') || this.isKeyDown('ArrowUp')) y -= 1;
        if (this.isKeyDown('KeyS') || this.isKeyDown('ArrowDown')) y += 1;
        if (this.isKeyDown('KeyA') || this.isKeyDown('ArrowLeft')) x -= 1;
        if (this.isKeyDown('KeyD') || this.isKeyDown('ArrowRight')) x += 1;

        // Normalize
        if (x !== 0 || y !== 0) {
            const len = Math.sqrt(x*x + y*y);
            x /= len;
            y /= len;
        }

        return { x, y };
    }
}
