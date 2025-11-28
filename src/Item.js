import { Utils } from './Utils.js';
import { Assets } from './Assets.js';

export class Item {
    constructor(game, x, y, type, value) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.type = type; // 'xp', 'health', 'magnet', 'nuke', 'coin'
        this.value = value;
        this.markedForDeletion = false;
        this.radius = 5;
        this.magnetized = false;
        this.speed = 0;
        
        switch(type) {
            case 'xp':
                this.color = '#3498db';
                break;
            case 'health':
                this.color = '#e74c3c';
                this.radius = 8;
                break;
            case 'coin':
                this.color = '#f1c40f';
                break;
            case 'magnet':
                this.color = '#9b59b6';
                this.radius = 8;
                break;
            case 'nuke':
                this.color = '#2ecc71'; // Radioactive green
                this.radius = 8;
                break;
            case 'chest':
                this.color = '#8e44ad';
                this.radius = 12;
                break;
        }
    }

    update(deltaTime) {
        // Magnet logic
        const player = this.game.player;
        const dist = Utils.getDistance(this.x, this.y, player.x, player.y);
        
        if (this.magnetized || dist < player.pickupRange) {
            this.magnetized = true;
            this.speed += 0.5; // Accelerate towards player
            
            const dx = (player.x - this.x);
            const dy = (player.y - this.y);
            const angle = Math.atan2(dy, dx);
            
            this.x += Math.cos(angle) * (5 + this.speed);
            this.y += Math.sin(angle) * (5 + this.speed);
            
            if (dist < player.radius + this.radius) {
                this.collect();
            }
        }
    }

    draw(ctx) {
        let img;
        switch(this.type) {
            case 'xp': img = Assets.images.item_xp; break;
            case 'health': img = Assets.images.item_health; break;
            case 'coin': img = Assets.images.item_coin; break;
            case 'magnet': img = Assets.images.item_magnet; break;
            case 'nuke': img = Assets.images.item_nuke; break;
            case 'chest': img = Assets.images.item_chest; break;
        }

        if (img) {
            const size = 24; // Scale down a bit from 32
            ctx.drawImage(img, this.x - size/2, this.y - size/2, size, size);
        } else {
            ctx.beginPath();
            if (this.type === 'xp') {
                // Draw diamond for XP
                ctx.moveTo(this.x, this.y - this.radius);
                ctx.lineTo(this.x + this.radius, this.y);
                ctx.lineTo(this.x, this.y + this.radius);
                ctx.lineTo(this.x - this.radius, this.y);
            } else {
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            }
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }
    }

    collect() {
        this.markedForDeletion = true;
        const player = this.game.player;
        
        switch(this.type) {
            case 'xp':
                player.gainXp(this.value);
                break;
            case 'health':
                player.hp = Math.min(player.hp + 20, player.maxHp);
                break;
            case 'coin':
                this.game.stats.coins += 10;
                break;
            case 'magnet':
                this.game.items.forEach(i => i.magnetized = true);
                break;
            case 'nuke':
                this.game.enemies.forEach(e => e.takeDamage(9999));
                break;
            case 'chest':
                this.game.triggerChestReward();
                break;
        }
    }
}
