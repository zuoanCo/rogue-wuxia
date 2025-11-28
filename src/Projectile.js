import { Assets } from './Assets.js';
import { Utils } from './Utils.js';
import { Particle } from './Particle.js';

export class Projectile {
    constructor(game, x, y, angle, speed, damage, duration, type = 'bullet', behavior = 'straight') {
        this.game = game;
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = speed;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.baseVx = this.vx;
        this.baseVy = this.vy;
        this.damage = damage;
        this.duration = duration;
        this.timer = 0;
        this.markedForDeletion = false;
        this.type = type;
        this.behavior = behavior;
        this.radius = 5;
        this.scale = 1.0;
        this.color = '#f1c40f';
        
        // Behavior specific state
        this.hitTimers = new Map(); // Track hit cooldowns per enemy

        if (behavior === 'orbit') {
            this.orbitAngle = angle;
            this.orbitRadius = 100;
            this.pierce = 999; // Orbiting weapons usually don't break on impact
            this.duration = 5000; // Orbit lasts longer
        } else if (type === 'piercing') {
            this.pierce = 3;
            this.color = '#e67e22';
        } else if (type === 'sword') {
            this.pierce = 2;
        } else if (type === 'snake') {
             this.pierce = 4;
        } else if (type === 'snake_giant') {
             this.pierce = 999; // Infinite pierce
             this.radius = 20; // Big hitbox
             this.duration = 3000;
        } else if (type === 'bagua') {
             this.pierce = 999;
             this.radius = 40; // Large shield
             this.duration = 5000;
        } else if (type === 'divine') {
             this.pierce = 999; // Infinite pierce
             this.radius = 8;
             this.color = '#3498db';
        } else if (type === 'spirit_sword') {
             this.pierce = 3;
             this.radius = 6;
             this.color = '#00d2d3';
        } else if (type === 'dragon') {
             this.pierce = 999;
             this.radius = 20; // Big hitbox
             this.duration = 2000;
        } else if (type === 'stone') {
             this.pierce = 3; // Ricochet count basically
             this.radius = 5;
        } else if (type === 'staff') {
             this.pierce = 999;
             this.radius = 40; // Hitbox radius
             this.duration = 1000;
        } else if (type === 'roar') {
             this.pierce = 999;
             this.radius = 10; 
             this.baseRadius = 10;
             this.duration = 1000;
        } else if (type === 'claw') {
             this.pierce = 999;
             this.radius = 25;
             this.duration = 300; // Very short slash
        } else if (type === 'seven_star') {
             this.pierce = 2;
             this.radius = 8;
        } else if (type === 'needle') {
             this.pierce = 1;
             this.radius = 3;
        } else if (type === 'flower') {
             this.pierce = 2;
             this.radius = 5;
        } else if (type === 'note') {
             this.pierce = 2;
             this.radius = 8;
        } else if (type === 'sound_wave') {
             this.pierce = 999;
             this.radius = 20;
             this.baseRadius = 20;
        } else if (type === 'flying_dagger') {
             this.pierce = 0;
             this.radius = 4;
        } else if (type === 'desolate_flash') {
             this.pierce = 10;
             this.radius = 8;
        } else if (type === 'huashan') {
             this.pierce = 1;
             this.radius = 6;
        } else if (type === 'evil_warding') {
             this.pierce = 3;
             this.radius = 6;
        } else {
            this.pierce = 1;
        }
    }

    update(deltaTime) {
        // Update hit timers
        for (const [enemy, time] of this.hitTimers) {
             const newTime = time - deltaTime;
             if (newTime <= 0) this.hitTimers.delete(enemy);
             else this.hitTimers.set(enemy, newTime);
        }

        if (this.behavior === 'orbit') {
            this.updateOrbit(deltaTime);
        } else if (this.behavior === 'homing') {
            this.updateHoming(deltaTime);
        } else if (this.behavior === 'wavy') {
            this.updateWavy(deltaTime);
        } else if (this.behavior === 'ricochet') {
            this.updateRicochet(deltaTime);
        } else if (this.behavior === 'spin_follow') {
            this.updateSpinFollow(deltaTime);
        } else if (this.behavior === 'expand') {
            this.updateExpand(deltaTime);
        } else {
            this.updateStraight(deltaTime);
        }

        this.timer += deltaTime;
        if (this.timer > this.duration) {
            this.markedForDeletion = true;
        }

        this.spawnTrail();
    }

    updateStraight(deltaTime) {
        this.x += this.vx;
        this.y += this.vy;
    }

    updateSpinFollow(deltaTime) {
        this.x = this.game.player.x;
        this.y = this.game.player.y;
        this.angle += this.speed * deltaTime * 0.005;
    }

    updateExpand(deltaTime) {
        this.x = this.game.player.x;
        this.y = this.game.player.y;
        this.scale += this.speed * deltaTime * 0.002;
        this.radius = this.baseRadius * this.scale * 4; // Visual scale vs Hitbox scale
    }

    updateOrbit(deltaTime) {
        // Orbit around player
        this.orbitAngle += this.speed * 0.005; // Angular speed
        this.x = this.game.player.x + Math.cos(this.orbitAngle) * this.orbitRadius;
        this.y = this.game.player.y + Math.sin(this.orbitAngle) * this.orbitRadius;
    }

    updateWavy(deltaTime) {
        // Path: P(t) = P0 + V*t + A*sin(w*t)*Normal
        // Velocity: V_total = V + A*w*cos(w*t)*Normal
        
        const frequency = 0.01; // Oscillation speed
        const amplitude = this.speed * 0.5; // Lateral speed magnitude
        
        // Calculate normal vector (rotate velocity by 90 deg)
        // Normal of (vx, vy) is (-vy, vx)
        const mag = Math.sqrt(this.baseVx*this.baseVx + this.baseVy*this.baseVy);
        const nx = -this.baseVy / mag;
        const ny = this.baseVx / mag;
        
        // Lateral velocity component
        const wave = Math.cos(this.timer * frequency) * amplitude;
        
        this.vx = this.baseVx + nx * wave;
        this.vy = this.baseVy + ny * wave;
        
        this.x += this.vx;
        this.y += this.vy;
    }

    updateHoming(deltaTime) {
        // Find nearest enemy
        let nearest = null;
        let minDist = 400; // Detection range

        this.game.enemies.forEach(e => {
            const dist = Utils.getDistance(this.x, this.y, e.x, e.y);
            if (dist < minDist) {
                minDist = dist;
                nearest = e;
            }
        });

        if (nearest) {
            const targetAngle = Math.atan2(nearest.y - this.y, nearest.x - this.x);
            // Smooth turn
            const diff = targetAngle - this.angle;
            // Normalize angle diff
            let angleDiff = Math.atan2(Math.sin(diff), Math.cos(diff));
            
            const turnSpeed = 0.1;
            this.angle += angleDiff * turnSpeed;
            
            this.vx = Math.cos(this.angle) * this.speed;
            this.vy = Math.sin(this.angle) * this.speed;
        }

        this.x += this.vx;
        this.y += this.vy;
    }

    updateRicochet(deltaTime) {
        // Move
        this.x += this.vx;
        this.y += this.vy;
    }

    draw(ctx) {
        let img = Assets.images.projectile;
        if (this.type === 'piercing') {
            img = Assets.images.projectile_piercing;
        } else if (this.type === 'taiji') {
            img = Assets.images.projectile_taiji;
        } else if (this.type === 'sword') {
            img = Assets.images.projectile_sword;
        } else if (this.type === 'snake') {
            img = Assets.images.projectile_snake;
        } else if (this.type === 'snake_giant') {
            img = Assets.images.projectile_snake_giant;
        } else if (this.type === 'bagua') {
            img = Assets.images.projectile_bagua;
        } else if (this.type === 'divine') {
            img = Assets.images.projectile_divine;
        } else if (this.type === 'spirit_sword') {
            img = Assets.images.projectile_spirit_sword;
        } else if (this.type === 'dragon') {
            img = Assets.images.projectile_dragon;
        } else if (this.type === 'stone') {
            img = Assets.images.projectile_stone;
        } else if (this.type === 'staff') {
            img = Assets.images.projectile_staff;
        } else if (this.type === 'roar') {
            img = Assets.images.projectile_roar;
        } else if (this.type === 'claw') {
            img = Assets.images.projectile_claw;
        } else if (this.type === 'seven_star') {
            img = Assets.images.projectile_seven_star;
        } else if (this.type === 'needle') {
            img = Assets.images.projectile_needle;
        } else if (this.type === 'flower') {
            img = Assets.images.projectile_flower;
        } else if (this.type === 'note') {
            img = Assets.images.projectile_note;
        } else if (this.type === 'sound_wave') {
            img = Assets.images.projectile_sound_wave;
        } else if (this.type === 'flying_dagger') {
            img = Assets.images.projectile_flying_dagger;
        } else if (this.type === 'desolate_flash') {
            img = Assets.images.projectile_desolate_flash;
        } else if (this.type === 'huashan') {
            img = Assets.images.projectile_huashan;
        } else if (this.type === 'evil_warding') {
            img = Assets.images.projectile_evil_warding;
        } else if (this.type === 'enemy_bullet') {
            img = Assets.images.enemy_bullet;
        }

        if (img) {
            ctx.save();
            ctx.translate(this.x, this.y);
            
            // Fade out near end of life
            if (this.duration - this.timer < 300) {
                ctx.globalAlpha = Math.max(0, (this.duration - this.timer) / 300);
            }

            // Rotation handling
            let angle = 0;
            if (this.behavior === 'orbit') {
                angle = this.orbitAngle; // Spin with orbit
            } else if (this.behavior === 'spin_follow') {
                angle = this.angle;
            } else {
                angle = Math.atan2(this.vy, this.vx);
            }
            
            // Add self-rotation for Taiji and Bagua
            if (this.type === 'taiji' || this.type === 'bagua') {
                 angle += this.timer * 0.01;
            }

            ctx.rotate(angle);
            
            // Scaling
            if (this.scale !== 1.0) {
                ctx.scale(this.scale, this.scale);
            }
            
            // Centering
            if (this.type === 'piercing') {
                ctx.drawImage(img, -16, -4);
            } else if (this.type === 'snake_giant') {
                ctx.drawImage(img, -32, -32);
            } else if (this.type === 'bagua') {
                ctx.drawImage(img, -64, -64);
            } else if (this.type === 'divine') {
                ctx.drawImage(img, -32, -8);
            } else if (this.type === 'spirit_sword') {
                ctx.drawImage(img, -24, -24);
            } else if (this.type === 'dragon') {
                ctx.drawImage(img, -32, -16);
            } else if (this.type === 'stone') {
                ctx.drawImage(img, -8, -8);
            } else if (this.type === 'staff') {
                ctx.drawImage(img, -32, -6);
            } else if (this.type === 'roar') {
                ctx.drawImage(img, -64, -64);
            } else if (this.type === 'claw') {
                ctx.drawImage(img, -24, -24);
            } else if (this.type === 'needle') {
                ctx.drawImage(img, -8, -2);
            } else if (this.type === 'flower') {
                ctx.drawImage(img, -16, -16);
            } else if (this.type === 'note') {
                ctx.drawImage(img, -12, -12);
            } else if (this.type === 'sound_wave') {
                ctx.drawImage(img, -32, -32);
            } else if (this.type === 'flying_dagger') {
                ctx.drawImage(img, -16, -6);
            } else if (this.type === 'desolate_flash') {
                ctx.drawImage(img, -32, -8);
            } else if (this.type === 'huashan') {
                ctx.drawImage(img, -24, -24);
            } else if (this.type === 'evil_warding') {
                ctx.drawImage(img, -24, -24);
            } else if (this.type === 'enemy_bullet') {
                ctx.drawImage(img, -8, -8);
            } else {
                ctx.drawImage(img, -16, -16);
            }
            ctx.restore();
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    onHit(target) {
        this.spawnImpact(target);

        // Lifesteal Logic
        const lifestealLevel = this.game.player.passives.lifesteal;
        if (lifestealLevel > 0) {
            // Chance to heal: 10% + 10% per level, or just flat 1 hp per hit per level?
            // Let's make it consistent: Heal 1 HP per hit if lifesteal > 0.
            // Maybe add a small chance check if it's too OP.
            // For "吸星大法", let's say 1 HP per hit is fine for this game scale.
            if (this.game.player.hp < this.game.player.maxHp) {
                this.game.player.hp = Math.min(this.game.player.hp + lifestealLevel, this.game.player.maxHp);
                
                // Visual feedback for healing
                 this.game.particles.push(new Particle(this.game, this.game.player.x, this.game.player.y, 'text', {
                    color: '#2ecc71',
                    text: '+' + lifestealLevel,
                    size: 16,
                    life: 40,
                    maxLife: 40,
                    vx: 0,
                    vy: -1
                }));
            }
        }

        if (this.behavior === 'ricochet') {
            let nearest = null;
            let minStartDist = 9999;
            this.game.enemies.forEach(e => {
                if (e === target || e.isDead) return;
                const dist = Utils.getDistance(this.x, this.y, e.x, e.y);
                if (dist < 300 && dist < minStartDist) {
                    minStartDist = dist;
                    nearest = e;
                }
            });
            
            if (nearest) {
                const angle = Math.atan2(nearest.y - this.y, nearest.x - this.x);
                this.vx = Math.cos(angle) * this.speed;
                this.vy = Math.sin(angle) * this.speed;
            } else {
                const angle = Math.random() * Math.PI * 2;
                this.vx = Math.cos(angle) * this.speed;
                this.vy = Math.sin(angle) * this.speed;
            }
        } else if (this.type === 'roar') {
            // Knockback
            const angle = Math.atan2(target.y - this.y, target.x - this.x);
            const force = 30 * (this.scale || 1);
            target.x += Math.cos(angle) * force;
            target.y += Math.sin(angle) * force;
        }
    }

    spawnTrail() {
        if (Math.random() > 0.5) return; // Don't spawn every frame

        if (this.type === 'dragon') {
            this.game.particles.push(new Particle(this.game, this.x, this.y, 'smoke', {
                color: '#e67e22',
                size: 8,
                life: 60,
                maxLife: 60,
                vx: (Math.random() - 0.5) * 1,
                vy: (Math.random() - 0.5) * 1
            }));
        } else if (this.type === 'snake_giant' || this.type === 'snake') {
            this.game.particles.push(new Particle(this.game, this.x, this.y, 'trail', {
                color: '#f1c40f',
                size: 5,
                life: 30,
                maxLife: 30
            }));
        } else if (this.type === 'desolate_flash') {
             this.game.particles.push(new Particle(this.game, this.x, this.y, 'sharp_trail', {
                color: '#ffffff',
                size: 6,
                life: 15,
                maxLife: 15,
                vx: 0, vy: 0 
            }));
        } else if (this.type === 'evil_warding') {
             this.game.particles.push(new Particle(this.game, this.x, this.y, 'sword_slash', {
                color: '#8e44ad',
                size: 6,
                life: 15,
                maxLife: 15,
                vx: this.vx * 0.1, 
                vy: this.vy * 0.1
            }));
        } else if (this.type === 'taiji' || this.type === 'bagua') {
             this.game.particles.push(new Particle(this.game, this.x, this.y, 'trail', {
                color: Math.random() > 0.5 ? '#000000' : '#ffffff',
                size: 4,
                life: 40,
                maxLife: 40
            }));
        } else if (this.type === 'flower') {
             this.game.particles.push(new Particle(this.game, this.x, this.y, 'petal', {
                color: '#e84393',
                size: 4,
                life: 30,
                maxLife: 30,
                vx: (Math.random() - 0.5) * 1,
                vy: (Math.random() - 0.5) * 1
            }));
        } else if (this.type === 'note') {
             if (Math.random() > 0.7) {
                 this.game.particles.push(new Particle(this.game, this.x, this.y, 'note', {
                    color: '#2ecc71',
                    size: 6,
                    life: 30,
                    maxLife: 30
                }));
             }
        } else if (this.type === 'huashan' || this.type === 'spirit_sword') {
             this.game.particles.push(new Particle(this.game, this.x, this.y, 'sharp_trail', {
                color: this.type === 'spirit_sword' ? '#00d2d3' : '#3498db',
                size: 6,
                life: 15,
                maxLife: 15,
                vx: this.vx * 0.1, 
                vy: this.vy * 0.1
            }));
        } else if (this.type === 'seven_star') {
             this.game.particles.push(new Particle(this.game, this.x, this.y, 'trail', {
                color: '#3498db',
                size: 4,
                life: 30,
                maxLife: 30
            }));
        } else if (this.type === 'divine') {
             this.game.particles.push(new Particle(this.game, this.x, this.y, 'trail', {
                color: '#f39c12',
                size: 3,
                life: 10,
                maxLife: 10
            }));
        } else if (this.type === 'flying_dagger') {
             this.game.particles.push(new Particle(this.game, this.x, this.y, 'sharp_trail', {
                color: '#bdc3c7',
                size: 4,
                life: 10,
                maxLife: 10,
                vx: 0, vy: 0
            }));
        } else if (this.type === 'needle') {
             if (Math.random() > 0.5) {
                this.game.particles.push(new Particle(this.game, this.x, this.y, 'trail', {
                    color: '#bdc3c7',
                    size: 2,
                    life: 10,
                    maxLife: 10
                }));
             }
        } else if (this.type === 'claw') {
             this.game.particles.push(new Particle(this.game, this.x, this.y, 'sharp_trail', {
                color: '#9b59b6', // Ghostly purple
                size: 5,
                life: 10,
                maxLife: 10,
                vx: 0, vy: 0
            }));
        } else if (this.type === 'staff') {
             this.game.particles.push(new Particle(this.game, this.x, this.y, 'smoke', {
                color: '#ecf0f1',
                size: 8,
                life: 20,
                maxLife: 20
            }));
        } else if (this.type === 'stone') {
              if (Math.random() > 0.7) {
                this.game.particles.push(new Particle(this.game, this.x, this.y, 'trail', {
                    color: '#95a5a6',
                    size: 2,
                    life: 10,
                    maxLife: 10
                }));
              }
        }
    }

    spawnImpact(target) {
        let color = '#ffffff';
        let count = 5;
        let particleType = 'explosion';
        
        if (this.type === 'dragon') { 
            color = '#e74c3c'; 
            count = 10; 
            // Add shockwave
            this.game.particles.push(new Particle(this.game, this.x, this.y, 'shockwave', {
                color: '#f1c40f',
                size: 10,
                life: 20,
                maxLife: 20
            }));
        }
        else if (this.type === 'claw') { 
            color = '#9b59b6'; 
            count = 6; 
            particleType = 'sharp_trail'; // Scratches
        }
        else if (this.type === 'staff') {
             color = '#2c3e50'; 
             count = 8;
             this.game.particles.push(new Particle(this.game, this.x, this.y, 'shockwave', {
                color: '#ecf0f1',
                size: 15,
                life: 20,
                maxLife: 20
            }));
        }
        else if (this.type === 'stone') { color = '#95a5a6'; }
        else if (this.type === 'snake' || this.type === 'snake_giant') { color = '#f1c40f'; }
        else if (this.type === 'taiji' || this.type === 'bagua') { color = '#ecf0f1'; }
        else if (this.type === 'desolate_flash') { color = '#f1c40f'; count = 8; }
        else if (this.type === 'evil_warding') { color = '#9b59b6'; particleType = 'sword_slash'; }
        else if (this.type === 'huashan') { color = '#3498db'; particleType = 'sword_slash'; }
        else if (this.type === 'needle') { color = '#bdc3c7'; count = 3; }
        else if (this.type === 'flower') { color = '#e84393'; count = 6; particleType = 'petal'; }
        else if (this.type === 'note') { color = '#2ecc71'; count = 4; particleType = 'note'; }
        else if (this.type === 'sound_wave') { 
            color = '#2ecc71'; 
            count = 8; 
            particleType = 'note';
            this.game.particles.push(new Particle(this.game, this.x, this.y, 'shockwave', {
                color: '#2ecc71',
                size: 15,
                life: 20,
                maxLife: 20
            }));
        }
        else if (this.type === 'roar') {
            this.game.particles.push(new Particle(this.game, this.x, this.y, 'shockwave', {
                color: '#f39c12',
                size: 20,
                life: 30,
                maxLife: 30
            }));
            return; // Roar mostly just pushes, maybe some dust
        }
        else if (this.type === 'flying_dagger') {
            color = '#ecf0f1';
            count = 3;
            particleType = 'sharp_trail';
        }

        for(let i=0; i<count; i++) {
            this.game.particles.push(new Particle(this.game, this.x, this.y, particleType, {
                color: color,
                size: Math.random() * 5 + 2,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                life: 40,
                maxLife: 40
            }));
        }
    }
}
