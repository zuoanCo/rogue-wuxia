import { Utils } from './Utils.js';
import { Assets } from './Assets.js';

export class Player {
    constructor(game) {
        this.game = game;
        this.x = game.width / 2;
        this.y = game.height / 2;
        this.radius = 15;
        this.speed = 3;
        
        // Stats
        this.maxHp = 100;
        this.hp = 100;
        this.level = 1;
        this.xp = 0;
        this.xpToNextLevel = 10;
        this.pickupRange = 100;
        
        // Weapons & Spells
        this.weapons = [];
        this.spells = [];
        this.passives = {
            snakeTech: 0,
            taijiMantra: 0,
            internalForce: 0,
            swordIntent: 0,
            yangEnergy: 0,
            muscleTendon: 0,
            qimen: 0,
            beggarHeart: 0,
            zen: 0,
            nineYin: 0,
            quanzhen: 0,
            poison: 0,
            melody: 0,
            truth: 0,
            ghost: 0,
            lifesteal: 0
        };
        
        // Animation
        this.flipX = false;
        this.lastMoveX = 1; // Default facing right
        this.lastMoveY = 0;
    }

    update(deltaTime) {
        const input = this.game.input.getMovementVector();
        this.x += input.x * this.speed;
        this.y += input.y * this.speed;
        
        if (input.x !== 0 || input.y !== 0) {
            this.lastMoveX = input.x;
            this.lastMoveY = input.y;
        }
        
        if (input.x < 0) this.flipX = true;
        if (input.x > 0) this.flipX = false;

        this.weapons.forEach(w => w.update(deltaTime));
        this.spells.forEach(s => s.update(deltaTime));
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // Draw Aura if exists
        const auraWeapon = this.weapons.find(w => w.type === 'aura');
        if (auraWeapon) {
            const yangEnergy = this.passives.yangEnergy || 0;
            const isEvolved = auraWeapon.level >= 5 && yangEnergy >= 1;
            
            ctx.save();
            ctx.beginPath();
            let radius = auraWeapon.radius * (1 + auraWeapon.level * 0.2);
            if (isEvolved) radius *= 1.5;
            
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
            
            if (isEvolved) {
                // Golden Sun Aura
                const gradient = ctx.createRadialGradient(0, 0, radius * 0.2, 0, 0, radius);
                gradient.addColorStop(0, 'rgba(241, 196, 15, 0.1)');
                gradient.addColorStop(0.5, 'rgba(230, 126, 34, 0.3)');
                gradient.addColorStop(1, 'rgba(231, 76, 60, 0.5)');
                ctx.fillStyle = gradient;
                ctx.strokeStyle = '#f1c40f';
                ctx.lineWidth = 4;
            } else {
                // Standard Red/Orange Aura (Nine Yang)
                ctx.fillStyle = 'rgba(230, 126, 34, 0.2)';
                ctx.strokeStyle = 'rgba(231, 76, 60, 0.5)';
                ctx.lineWidth = 2;
            }
            
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }

        // Draw Player Sprite
        const img = Assets.images.player;
        const size = 50; // Visual size
        
        ctx.save();
        if (this.flipX) {
            ctx.scale(-1, 1);
        }
        ctx.drawImage(img, -size/2, -size/2, size, size);
        ctx.restore();
        
        // Hitbox debug (optional)
        // ctx.beginPath();
        // ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        // ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        // ctx.stroke();

        ctx.restore();
    }
    
    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp <= 0) {
            this.game.gameOver();
        }
    }
    
    gainXp(amount) {
        this.xp += amount;
        if (this.xp >= this.xpToNextLevel) {
            this.levelUp();
        }
    }
    
    levelUp() {
        this.level++;
        this.xp -= this.xpToNextLevel;
        this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.5);
        this.game.triggerLevelUp();
    }

    upgradeWeapon(type) {
        const w = this.weapons.find(w => w.type === type);
        if (w) w.level++;
    }
}
