
export class Particle {
    constructor(game, x, y, type, properties = {}) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.type = type;
        this.markedForDeletion = false;
        
        // Defaults
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.size = 5;
        this.color = '#ffffff';
        this.life = 100;
        this.maxLife = 100;
        this.alpha = 1;
        this.decay = 2; // Life lost per frame (approx)
        
        // Override with properties
        Object.assign(this, properties);
    }

    update(deltaTime) {
        this.x += this.vx;
        this.y += this.vy;
        
        this.life -= this.decay * (deltaTime / 16); // Normalize to 60fps
        
        if (this.life <= 0) {
            this.markedForDeletion = true;
        }
        
        // Specific behaviors
        if (this.type === 'trail') {
            this.size *= 0.95; // Shrink
        } else if (this.type === 'explosion') {
            this.vx *= 0.9; // Slow down
            this.vy *= 0.9;
        } else if (this.type === 'smoke') {
            this.y -= 0.5; // Float up
            this.size *= 1.02; // Expand
            this.alpha = this.life / this.maxLife;
        } else if (this.type === 'shockwave') {
            this.size += 1.5; // Expand
            this.alpha = Math.pow(this.life / this.maxLife, 2); // Fade out faster
        } else if (this.type === 'sharp_trail') {
            this.size *= 0.9; // Shrink
        } else if (this.type === 'flame') {
            this.y -= 1; // Rise faster
            this.size *= 0.95; // Shrink
            this.alpha = Math.random() * 0.5 + 0.5; // Flicker
        } else if (this.type === 'sparkle') {
            this.size *= 0.9;
            this.alpha = Math.random(); // Blink
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = (this.life / this.maxLife) * this.alpha;
        ctx.translate(this.x, this.y);
        
        if (this.type === 'sword_slash') {
             // Rotate to velocity
             const angle = Math.atan2(this.vy, this.vx);
             ctx.rotate(angle);
             ctx.fillStyle = this.color;
             ctx.fillRect(-this.size, -this.size/4, this.size*2, this.size/2);
        } else if (this.type === 'shockwave') {
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.size * 0.1; // Thinner as it expands relative to size
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.stroke();
        } else if (this.type === 'sharp_trail') {
            const angle = Math.atan2(this.vy, this.vx);
            ctx.rotate(angle);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(this.size * 2, 0);
            ctx.lineTo(-this.size, this.size/2);
            ctx.lineTo(-this.size, -this.size/2);
            ctx.closePath();
            ctx.fill();
        } else if (this.type === 'petal') {
            ctx.rotate(this.life * 0.1); 
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size, this.size/2, 0, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 'note') {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(-this.size/2, 0, this.size/2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(0, -this.size * 1.5, this.size/4, this.size * 1.5);
        } else if (this.type === 'flame') {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 'sparkle') {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(0, -this.size);
            ctx.lineTo(this.size/4, -this.size/4);
            ctx.lineTo(this.size, 0);
            ctx.lineTo(this.size/4, this.size/4);
            ctx.lineTo(0, this.size);
            ctx.lineTo(-this.size/4, this.size/4);
            ctx.lineTo(-this.size, 0);
            ctx.lineTo(-this.size/4, -this.size/4);
            ctx.closePath();
            ctx.fill();
        } else if (this.type === 'text') {
            ctx.fillStyle = this.color;
            ctx.font = `${this.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.fillText(this.text || '', 0, 0);
        } else {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
}
