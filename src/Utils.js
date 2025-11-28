export class Utils {
    static getDistance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    static checkCollision(circle1, circle2) {
        const dist = this.getDistance(circle1.x, circle1.y, circle2.x, circle2.y);
        return dist < (circle1.radius + circle2.radius);
    }

    static checkRectCollision(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    }

    static randomRange(min, max) {
        return Math.random() * (max - min) + min;
    }
}
