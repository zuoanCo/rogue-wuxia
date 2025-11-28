import { Utils } from './Utils.js';
import { Assets } from './Assets.js';
import { Projectile } from './Projectile.js';

export class Enemy {
    constructor(game, type = 'basic') {
        this.game = game;
        this.type = type;
        this.markedForDeletion = false;
        
        this.x = 0;
        this.y = 0;
        
        // Boss State
        this.state = 'chase'; // chase, charge_dash, dashing, charge_aoe, aoe
        this.stateTimer = 0;
        this.dashVector = {x:0, y:0};
        this.aoeRadius = 150;
        
        // Animation
        this.flipX = false;
        
        this.setStats(type);
    }

    setStats(type) {
        // Base stats, can be modified by difficulty multiplier
        const difficulty = this.game.difficultyMultiplier || 1;
        
        if (type === 'basic') {
            this.radius = 12;
            this.speed = 1.5 + (difficulty * 0.1);
            this.hp = 10 * difficulty;
            this.maxHp = this.hp;
            this.damage = 5;
            this.xpValue = 1;
        } else if (type === 'fast') {
            this.radius = 8;
            this.speed = 3 + (difficulty * 0.2);
            this.hp = 5 * difficulty;
            this.maxHp = this.hp;
            this.damage = 3;
            this.xpValue = 2;
        } else if (type === 'tank') {
            this.radius = 20;
            this.speed = 0.8 + (difficulty * 0.05);
            this.hp = 30 * difficulty;
            this.maxHp = this.hp;
            this.damage = 10;
            this.xpValue = 5;
        } else if (type === 'shooter') {
            this.radius = 10;
            this.speed = 1.0 + (difficulty * 0.1);
            this.hp = 8 * difficulty;
            this.maxHp = this.hp;
            this.damage = 5;
            this.xpValue = 3;
            this.attackRange = 250;
            this.attackCooldown = 2000;
            this.attackTimer = Math.random() * 2000;
        } else if (type === 'charger') {
            this.radius = 14;
            this.speed = 2.0 + (difficulty * 0.15);
            this.hp = 12 * difficulty;
            this.maxHp = this.hp;
            this.damage = 8;
            this.xpValue = 4;
            this.chargeCooldown = 3000;
            this.chargeTimer = Math.random() * 3000;
            this.isCharging = false;
        } else if (type === 'boss') {
            this.radius = 40;
            this.speed = 1.2 + (difficulty * 0.1);
            this.hp = 500 * difficulty;
            this.maxHp = this.hp;
            this.damage = 20;
            this.xpValue = 100;
            this.isBoss = true;
            this.actionTimer = 0; // Timer to decide next action
        }
    }

    update(deltaTime) {
        const player = this.game.player;
        const dist = Utils.getDistance(this.x, this.y, player.x, player.y);

        if (this.isBoss) {
            this.updateBossBehavior(deltaTime, player, dist);
        } else {
            // General facing logic
            if (this.x > player.x) this.flipX = true;
            else this.flipX = false;

            if (this.type === 'shooter') {
                 // Shooter Logic
                 this.attackTimer += deltaTime;
                 
                 if (dist > this.attackRange) {
                     // Move towards player
                     const angle = Math.atan2(player.y - this.y, player.x - this.x);
                     this.x += Math.cos(angle) * this.speed;
                     this.y += Math.sin(angle) * this.speed;
                 } else {
                     // Stop and Shoot
                     if (this.attackTimer > this.attackCooldown) {
                         this.attackTimer = 0;
                         const proj = new Projectile(this.game, this.x, this.y, 'enemy_bullet', {
                             damage: this.damage,
                             isEnemy: true,
                             speed: 4,
                             color: '#e74c3c',
                             radius: 6
                         });
                         const angle = Math.atan2(player.y - this.y, player.x - this.x);
                         proj.vx = Math.cos(angle) * 4;
                         proj.vy = Math.sin(angle) * 4;
                         this.game.projectiles.push(proj);
                     }
                 }
            } else if (this.type === 'charger') {
                 // Charger Logic
                 this.chargeTimer += deltaTime;
                 let currentSpeed = this.speed;
                 
                 if (this.isCharging) {
                     currentSpeed *= 3; // Fast charge
                     if (this.chargeTimer > 500) { // Charge duration 0.5s
                         this.isCharging = false;
                         this.chargeTimer = 0; // Reset for cooldown
                     }
                 } else {
                     if (this.chargeTimer > this.chargeCooldown && dist < 300) { // Start charge if close enough
                         this.isCharging = true;
                         this.chargeTimer = 0; // Reset for duration
                     }
                 }
                 
                 const angle = Math.atan2(player.y - this.y, player.x - this.x);
                 this.x += Math.cos(angle) * currentSpeed;
                 this.y += Math.sin(angle) * currentSpeed;
                 
            } else {
                // Basic/Fast/Tank Enemy Behavior: Just chase
                 if (dist > 0) {
                    const dx = (player.x - this.x) / dist;
                    const dy = (player.y - this.y) / dist;
                    
                    this.x += dx * this.speed;
                    this.y += dy * this.speed;
                }
            }
        }

        // Collision with player
        if (Utils.checkCollision(this, player)) {
             // For Boss Dash/AOE we might handle damage differently, but contact damage always applies
            player.takeDamage(this.damage * 0.05); 
        }
    }
    
    updateBossBehavior(deltaTime, player, dist) {
        if (this.x > player.x) this.flipX = true;
        else this.flipX = false;
        
        if (this.state === 'chase') {
            // Chase logic
             if (dist > 0) {
                const dx = (player.x - this.x) / dist;
                const dy = (player.y - this.y) / dist;
                this.x += dx * this.speed;
                this.y += dy * this.speed;
            }
            
            this.actionTimer += deltaTime;
            if (this.actionTimer > 3000) { // Every 3s pick an action
                this.actionTimer = 0;
                const rand = Math.random();
                if (rand < 0.4) {
                    this.state = 'charge_dash';
                    this.stateTimer = 1000; // 1s charge
                    // Aim at player
                    const dx = player.x - this.x;
                    const dy = player.y - this.y;
                    const len = Math.sqrt(dx*dx + dy*dy);
                    this.dashVector = { x: dx/len, y: dy/len };
                } else if (rand < 0.7) {
                    this.state = 'charge_aoe';
                    this.stateTimer = 1500; // 1.5s warning
                } else {
                    this.state = 'summon_minions';
                    this.stateTimer = 1000; // 1s casting time
                }
            }
        } else if (this.state === 'summon_minions') {
            this.stateTimer -= deltaTime;
            if (this.stateTimer <= 0) {
                 // Summon logic
                 for (let i = 0; i < 3; i++) {
                     const angle = (Math.PI * 2 / 3) * i;
                     const spawnX = this.x + Math.cos(angle) * 80;
                     const spawnY = this.y + Math.sin(angle) * 80;
                     
                     const minion = new Enemy(this.game, 'basic');
                     minion.x = spawnX;
                     minion.y = spawnY;
                     this.game.enemies.push(minion);
                 }
                 this.state = 'chase';
            }
        } else if (this.state === 'charge_dash') {
            this.stateTimer -= deltaTime;
            if (this.stateTimer <= 0) {
                this.state = 'dashing';
                this.stateTimer = 500; // 0.5s dash duration
            }
        } else if (this.state === 'dashing') {
            this.x += this.dashVector.x * this.speed * 8; // Fast speed
            this.y += this.dashVector.y * this.speed * 8;
            this.stateTimer -= deltaTime;
            if (this.stateTimer <= 0) {
                this.state = 'chase';
            }
        } else if (this.state === 'charge_aoe') {
            this.stateTimer -= deltaTime;
            if (this.stateTimer <= 0) {
                this.state = 'aoe';
                // Deal damage
                if (dist < this.aoeRadius) {
                    player.takeDamage(40); // Big damage
                }
                this.stateTimer = 500; // Linger for effect
            }
        } else if (this.state === 'aoe') {
            this.stateTimer -= deltaTime;
            if (this.stateTimer <= 0) {
                this.state = 'chase';
            }
        }
    }

    draw(ctx) {
        let img = Assets.images.enemy_basic;
        let size = this.radius * 2;
        
        if (this.type === 'fast') {
            img = Assets.images.enemy_fast;
            size = this.radius * 3; // Make bat look bigger visually
        } else if (this.type === 'tank') {
            img = Assets.images.enemy_tank;
            size = this.radius * 2.5;
        } else if (this.type === 'shooter') {
            img = Assets.images.enemy_basic;
            size = this.radius * 2;
        } else if (this.type === 'charger') {
            img = Assets.images.enemy_fast;
            size = this.radius * 3;
        } else if (this.type === 'boss') {
            img = Assets.images.enemy_boss;
            size = this.radius * 2.5;
        }
        
        // Draw Sprite
        ctx.save();
        ctx.translate(this.x, this.y);
        if (this.flipX) ctx.scale(-1, 1);
        
        // Boss Effects
        if (this.isBoss) {
            if (this.state === 'charge_dash') {
                ctx.globalAlpha = 0.5 + Math.sin(Date.now() / 100) * 0.3; // Flash
            }
            if (this.state === 'summon_minions') {
                 ctx.shadowBlur = 20;
                 ctx.shadowColor = 'purple';
            }
        }
        
        ctx.drawImage(img, -size/2, -size/2, size, size);
        ctx.restore();
        
        // Boss AOE Warning/Effect
        if (this.isBoss) {
             if (this.state === 'charge_aoe') {
                 ctx.save();
                 ctx.beginPath();
                 ctx.arc(this.x, this.y, this.aoeRadius, 0, Math.PI * 2);
                 ctx.fillStyle = 'rgba(231, 76, 60, 0.3)';
                 ctx.fill();
                 ctx.restore();
            }
            if (this.state === 'aoe') {
                 ctx.save();
                 ctx.beginPath();
                 ctx.arc(this.x, this.y, this.aoeRadius, 0, Math.PI * 2);
                 ctx.fillStyle = 'rgba(231, 76, 60, 0.8)';
                 ctx.fill();
                 ctx.restore();
            }
            
            // HP Bar
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x - 30, this.y - this.radius - 20, 60, 10);
            ctx.fillStyle = 'green';
            const pct = Math.max(0, this.hp / this.maxHp);
            ctx.fillRect(this.x - 30, this.y - this.radius - 20, 60 * pct, 10);
            ctx.strokeStyle = 'black';
            ctx.strokeRect(this.x - 30, this.y - this.radius - 20, 60, 10);
        }
    }

    takeDamage(amount) {
        this.hp -= amount;
        // Hit effect
        if (this.hp <= 0) {
            this.markedForDeletion = true;
            this.game.spawnDrop(this.x, this.y, this.xpValue);
            
            // Spawn chest for Boss
            if (this.isBoss) {
                this.game.spawnChest(this.x, this.y);
            }

            this.game.stats.kills++;
        }
    }
}
