import { Projectile } from './Projectile.js';
import { Utils } from './Utils.js';
import { Particle } from './Particle.js';

export class Weapon {
    constructor(game, type) {
        this.game = game;
        this.type = type;
        this.level = 1;
        this.timer = 0;
        
        // Stats based on type
        if (type === 'wand') {
            this.interval = 1000;
            this.damage = 10;
            this.range = 300;
        } else if (type === 'aura') {
            this.interval = 500;
            this.damage = 2;
            this.radius = 80;
        } else if (type === 'dagger') {
            this.interval = 1500;
            this.damage = 20;
            this.range = 500;
        } else if (type === 'taiji') {
            this.interval = 2000;
            this.damage = 5;
            this.activeOrbits = 0;
        } else if (type === 'dugu') {
            this.interval = 1200;
            this.damage = 15;
            this.range = 600;
        } else if (type === 'palm') {
            this.interval = 3000;
            this.damage = 40;
            this.range = 800;
        } else if (type === 'stone') {
            this.interval = 1000;
            this.damage = 10;
            this.range = 400;
        } else if (type === 'staff') {
            this.interval = 1500;
            this.damage = 15;
            this.range = 100;
        } else if (type === 'roar') {
            this.interval = 4000;
            this.damage = 50;
            this.range = 300;
        } else if (type === 'claw') {
            this.interval = 800;
            this.damage = 25;
            this.range = 150;
        } else if (type === 'seven_star') {
            this.interval = 2500;
            this.damage = 20;
            this.range = 500;
        } else if (type === 'needle') {
            this.interval = 500;
            this.damage = 8;
            this.range = 400;
        } else if (type === 'guqin') {
            this.interval = 1500;
            this.damage = 15;
            this.range = 500;
        } else if (type === 'flying_dagger') {
            this.interval = 1200;
            this.damage = 30;
            this.range = 600;
        } else if (type === 'huashan') {
            this.interval = 1000;
            this.damage = 12;
            this.range = 400;
        } else if (type === 'blood_blade') {
            this.interval = 1500;
            this.damage = 25;
            this.range = 200; // Short range
        } else if (type === 'yang_spear') {
            this.interval = 1200;
            this.damage = 18;
            this.range = 600; // Long range
        } else if (type === 'golden_wheel') {
            this.interval = 2000;
            this.damage = 20;
            this.range = 400; // Medium range
        }
    }

    update(deltaTime) {
        if (this.type === 'taiji') {
             // Taiji logic: maintain 'level' number of projectiles
             const active = this.game.projectiles.filter(p => (p.type === 'taiji' || p.type === 'bagua') && !p.markedForDeletion).length;
             if (active < this.level) {
                 this.timer += deltaTime;
                 if (this.timer > 200) { // Fast replenish
                     this.fireTaiji(active); 
                     this.timer = 0;
                 }
             }
             return;
        }

        this.timer += deltaTime;
        if (this.timer >= this.interval) {
            this.fire();
            this.timer = 0;
        }
    }

    fire() {
        if (this.type === 'wand') {
            this.fireWand();
        } else if (this.type === 'aura') {
            this.fireAura();
        } else if (this.type === 'dagger') {
            this.fireDagger();
        } else if (this.type === 'dugu') {
            this.fireDugu();
        } else if (this.type === 'palm') {
            this.firePalm();
        } else if (this.type === 'stone') {
            this.fireStone();
        } else if (this.type === 'staff') {
            this.fireStaff();
        } else if (this.type === 'roar') {
            this.fireRoar();
        } else if (this.type === 'claw') {
            this.fireClaw();
        } else if (this.type === 'seven_star') {
            this.fireSevenStar();
        } else if (this.type === 'needle') {
            this.fireNeedle();
        } else if (this.type === 'guqin') {
            this.fireGuqin();
        } else if (this.type === 'flying_dagger') {
            this.fireFlyingDagger();
        } else if (this.type === 'huashan') {
            this.fireHuashan();
        } else if (this.type === 'blood_blade') {
            this.fireBloodBlade();
        } else if (this.type === 'yang_spear') {
            this.fireYangSpear();
        } else if (this.type === 'golden_wheel') {
            this.fireGoldenWheel();
        }
    }
    
    fireDagger() {
        this.spawnCastEffect('snake_flash');
        // Golden Snake Sword - Piercing
        // Check for evolution
        const snakeTech = this.game.player.passives ? this.game.player.passives.snakeTech : 0;
        const isEvolved = this.level >= 5 && snakeTech >= 1;

        // Fire towards nearest enemy
        let nearest = null;
        let minDist = Infinity;
        
        this.game.enemies.forEach(e => {
            const dist = Utils.getDistance(this.game.player.x, this.game.player.y, e.x, e.y);
            if (dist < minDist && dist < this.range) {
                minDist = dist;
                nearest = e;
            }
        });
        
        // Determine projectile properties
        let type = 'snake';
        let damage = this.damage;
        let speed = 7;
        let scale = 1.0;
        let behavior = 'wavy';

        if (isEvolved) {
            type = 'snake_giant';
            damage = this.damage * 3;
            speed = 5; // Slower, heavier
        } else if (snakeTech > 0) {
            damage = this.damage * (1 + snakeTech * 0.5); // +50% per tech level
            scale = 1.0 + (snakeTech * 0.3); // Bigger
        }

        if (nearest) {
            const angle = Math.atan2(nearest.y - this.game.player.y, nearest.x - this.game.player.x);
            const p = new Projectile(
                this.game,
                this.game.player.x,
                this.game.player.y,
                angle,
                speed, 
                damage,
                1500,
                type, 
                behavior
            );
            p.scale = scale;
            if (scale > 1.0) p.radius *= scale;
            this.game.projectiles.push(p);
        } else {
            // Fire random direction if no enemy? Or just don't fire.
            // Let's fire in moving direction or random
            const angle = Math.random() * Math.PI * 2;
            const p = new Projectile(
                this.game,
                this.game.player.x,
                this.game.player.y,
                angle,
                speed,
                damage,
                1500,
                type,
                behavior
            );
            p.scale = scale;
            if (scale > 1.0) p.radius *= scale;
            this.game.projectiles.push(p);
        }
    }

    fireTaiji(index) {
        this.spawnCastEffect('taiji_flash');
        // Orbiting Taiji
        const taijiMantra = this.game.player.passives ? this.game.player.passives.taijiMantra : 0;
        const isEvolved = this.level >= 5 && taijiMantra >= 1;
        
        // Determine projectile properties
        let type = 'taiji';
        let damage = this.damage;
        let scale = 1.0;
        let orbitRadius = 100;
        
        if (isEvolved) {
            type = 'bagua';
            damage = this.damage * 2;
            scale = 1.5;
            orbitRadius = 150;
        } else if (taijiMantra > 0) {
            damage = this.damage * (1 + taijiMantra * 0.3);
            scale = 1.0 + (taijiMantra * 0.2);
        }

        const angle = (Math.PI * 2 / this.level) * index;
        
        const p = new Projectile(
            this.game,
            this.game.player.x,
            this.game.player.y,
            angle,
            2, // Orbit speed
            damage,
            5000,
            type,
            'orbit'
        );
        p.scale = scale;
        p.orbitRadius = orbitRadius;
        this.game.projectiles.push(p);
    }

    fireDugu() {
        this.spawnCastEffect('spirit_flash');
        // Dugu Nine Swords - Homing
        const swordIntent = this.game.player.passives ? this.game.player.passives.swordIntent : 0;
        const isEvolved = this.level >= 5 && swordIntent >= 1;

        // Fire multiple based on level
        let count = 1 + Math.floor(this.level / 2);
        
        let type = 'sword';
        let damage = this.damage;
        let speed = 4;
        let duration = 3000;
        
        if (isEvolved) {
            type = 'spirit_sword';
            count += 2; // More swords
            damage = this.damage * 2.5;
            speed = 6;
            duration = 5000;
        } else if (swordIntent > 0) {
            damage = this.damage * (1 + swordIntent * 0.4);
            count += Math.floor(swordIntent / 2); 
        }
        
        for(let i=0; i<count; i++) {
             // Fire in random directions initially
             const angle = Math.random() * Math.PI * 2;
             this.game.projectiles.push(new Projectile(
                this.game,
                this.game.player.x,
                this.game.player.y,
                angle,
                speed,
                damage,
                duration,
                type,
                'homing'
            ));
        }
    }

    fireWand() {
        this.spawnCastEffect('six_pulse_flash');
        // Six Pulse Divine Sword
        const internalForce = this.game.player.passives ? this.game.player.passives.internalForce : 0;
        const isEvolved = this.level >= 5 && internalForce >= 1;
        
        // Find nearest enemy
        let nearest = null;
        let minDist = Infinity;
        
        this.game.enemies.forEach(e => {
            const dist = Utils.getDistance(this.game.player.x, this.game.player.y, e.x, e.y);
            if (dist < minDist && dist < this.range) {
                minDist = dist;
                nearest = e;
            }
        });
        
        const angle = nearest 
            ? Math.atan2(nearest.y - this.game.player.y, nearest.x - this.game.player.x)
            : (this.game.player.lastMoveX !== 0 || this.game.player.lastMoveY !== 0)
                ? Math.atan2(this.game.player.lastMoveY, this.game.player.lastMoveX)
                : Math.random() * Math.PI * 2;

        // Fire multiple if level > 1
        const projectilesCount = this.level; 
        
        let type = 'bullet';
        let speed = 5;
        let damage = this.damage;
        let duration = 2000;
        
        if (isEvolved) {
            type = 'divine';
            speed = 10; // Fast laser
            damage = this.damage * 2;
            duration = 3000;
        } else if (internalForce > 0) {
                damage = this.damage * (1 + internalForce * 0.2);
                speed = 5 + internalForce;
        }

        // Spread projectiles if multiple
        for(let i=0; i<projectilesCount; i++) {
                // Slight spread
                const spread = (i - (projectilesCount-1)/2) * 0.1; 
                this.game.projectiles.push(new Projectile(
                    this.game, 
                    this.game.player.x, 
                    this.game.player.y, 
                    angle + spread, 
                    speed, 
                    damage, 
                    duration,
                    type
                ));
        }
    }
    
    fireAura() {
        this.spawnCastEffect('aura_pulse');
        // Damage all enemies in radius
        const yangEnergy = this.game.player.passives ? this.game.player.passives.yangEnergy : 0;
        const isEvolved = this.level >= 5 && yangEnergy >= 1;

        let damage = this.damage;
        let radius = this.radius * (1 + this.level * 0.2);

        if (isEvolved) {
            damage = this.damage * 3;
            radius *= 1.5;
        } else if (yangEnergy > 0) {
            damage = this.damage * (1 + yangEnergy * 0.5);
            radius *= (1 + yangEnergy * 0.1);
        }

        this.game.enemies.forEach(e => {
            const dist = Utils.getDistance(this.game.player.x, this.game.player.y, e.x, e.y);
            if (dist < radius) {
                e.takeDamage(damage);
            }
        });
        
        // Visual effect is handled in Player.draw
    }

    firePalm() {
        this.spawnCastEffect('palm_flash');
        // Dragon Palm
        const muscleTendon = this.game.player.passives ? this.game.player.passives.muscleTendon : 0;
        const isEvolved = this.level >= 5 && muscleTendon >= 1;

        // Fire towards nearest or random
        let nearest = null;
        let minDist = Infinity;
        
        this.game.enemies.forEach(e => {
            const dist = Utils.getDistance(this.game.player.x, this.game.player.y, e.x, e.y);
            if (dist < minDist && dist < this.range) {
                minDist = dist;
                nearest = e;
            }
        });

        let type = 'dragon';
        
        let damage = this.damage;
        let speed = 6;
        let scale = 0.5; // Small dragon initially
        
        if (isEvolved) {
            damage = this.damage * 4;
            scale = 1.5; // Giant Dragon
            speed = 8;
        } else if (muscleTendon > 0) {
            damage = this.damage * (1 + muscleTendon * 0.2);
            scale = 0.5 + (muscleTendon * 0.1);
        }

        const angle = nearest 
            ? Math.atan2(nearest.y - this.game.player.y, nearest.x - this.game.player.x)
            : (this.game.player.lastMoveX !== 0 || this.game.player.lastMoveY !== 0) 
                ? Math.atan2(this.game.player.lastMoveY, this.game.player.lastMoveX)
                : Math.random() * Math.PI * 2;

        const p = new Projectile(
            this.game,
            this.game.player.x,
            this.game.player.y,
            angle,
            speed,
            damage,
            2000,
            'dragon',
            'straight'
        );
        p.scale = scale;
        p.radius *= scale;
        this.game.projectiles.push(p);
    }

    fireStone() {
        this.spawnCastEffect('stone');
        // Finger Flick
        const qimen = this.game.player.passives ? this.game.player.passives.qimen : 0;
        const isEvolved = this.level >= 5 && qimen >= 1;

        // Fire multiple stones
        let count = 1 + Math.floor(this.level / 3);
        
        let type = 'stone';
        let damage = this.damage;
        let speed = 9;
        
        if (isEvolved) {
            count += 2;
            damage = this.damage * 2;
        } else if (qimen > 0) {
            damage = this.damage * (1 + qimen * 0.2);
        }

        for(let i=0; i<count; i++) {
             // Random spread
             const angle = Math.random() * Math.PI * 2;
             const p = new Projectile(
                this.game,
                this.game.player.x,
                this.game.player.y,
                angle,
                speed,
                damage,
                3000,
                type,
                'ricochet'
            );
            
            if (isEvolved) {
                p.pierce += 5; // More bounces
                p.color = '#2ecc71'; // Jade green
            } else if (qimen > 0) {
                p.pierce += qimen;
            }

            this.game.projectiles.push(p);
        }
    }

    fireStaff() {
        this.spawnCastEffect('spin');
        // Dog Beating Staff
        const beggarHeart = this.game.player.passives ? this.game.player.passives.beggarHeart : 0;
        const isEvolved = this.level >= 5 && beggarHeart >= 1;
        
        let count = 1;
        let damage = this.damage;
        let speed = 5; // Spin speed
        let duration = 1000;
        
        if (isEvolved) {
            count = 3;
            damage = this.damage * 2;
            duration = 2000;
            speed = 8;
        } else if (beggarHeart > 0) {
            damage = this.damage * (1 + beggarHeart * 0.2);
            duration += beggarHeart * 200;
        }

        for (let i = 0; i < count; i++) {
             const angle = (Math.PI * 2 / count) * i;
             const p = new Projectile(
                 this.game,
                 this.game.player.x,
                 this.game.player.y,
                 angle,
                 speed,
                 damage,
                 duration,
                 'staff',
                 'spin_follow'
             );
             this.game.projectiles.push(p);
        }
    }

    fireRoar() {
        this.spawnCastEffect('roar');
        // Lion's Roar
        const zen = this.game.player.passives ? this.game.player.passives.zen : 0;
        const isEvolved = this.level >= 5 && zen >= 1;
        
        let damage = this.damage;
        let speed = 2; // Expansion speed
        
        if (isEvolved) {
            damage = this.damage * 3;
            speed = 4;
        } else if (zen > 0) {
            damage = this.damage * (1 + zen * 0.3);
            speed = 2 + zen * 0.5;
        }

        const p = new Projectile(
            this.game,
            this.game.player.x,
            this.game.player.y,
            0,
            speed,
            damage,
            1000, // Duration
            'roar',
            'expand'
        );
        p.baseRadius = 20;
        this.game.projectiles.push(p);
    }

    fireClaw() {
        this.spawnCastEffect('claw');
        // Nine Yin Bone Claw
        const nineYin = this.game.player.passives ? this.game.player.passives.nineYin : 0;
        const isEvolved = this.level >= 5 && nineYin >= 1;
        
        // Find nearest enemy
        let nearest = null;
        let minDist = Infinity;
        
        this.game.enemies.forEach(e => {
            const dist = Utils.getDistance(this.game.player.x, this.game.player.y, e.x, e.y);
            if (dist < minDist && dist < this.range) {
                minDist = dist;
                nearest = e;
            }
        });

        let targetX, targetY;
        if (nearest) {
            targetX = nearest.x;
            targetY = nearest.y;
        } else {
             // Fallback: In front of player
             const angle = (this.game.player.lastMoveX !== 0 || this.game.player.lastMoveY !== 0)
                ? Math.atan2(this.game.player.lastMoveY, this.game.player.lastMoveX)
                : -Math.PI/2; // Default Up
             targetX = this.game.player.x + Math.cos(angle) * 100;
             targetY = this.game.player.y + Math.sin(angle) * 100;
        }

        const p = new Projectile(
            this.game,
            targetX,
            targetY, // Spawn ON the target
            0,
            0, // Stationary
            this.damage * (isEvolved ? 2 : 1) * (1 + nineYin * 0.2),
            300,
            'claw',
            'straight'
        );
        this.game.projectiles.push(p);

        // If evolved, trigger extra claws nearby
        if (isEvolved) {
             for(let i=0; i<2; i++) {
                 const offsetX = (Math.random() - 0.5) * 60;
                 const offsetY = (Math.random() - 0.5) * 60;
                 const p2 = new Projectile(
                    this.game,
                    targetX + offsetX,
                    targetY + offsetY,
                    0,
                    0,
                    this.damage,
                    300,
                    'claw',
                    'straight'
                );
                this.game.projectiles.push(p2);
             }
        }
    }

    fireSevenStar() {
        this.spawnCastEffect('star');
        // Seven Star Sword
        const quanzhen = this.game.player.passives ? this.game.player.passives.quanzhen : 0;
        const isEvolved = this.level >= 5 && quanzhen >= 1;

        const count = 7;
        let damage = this.damage;
        let speed = 6;
        
        if (isEvolved) {
            damage = this.damage * 2.5;
            speed = 8;
        } else if (quanzhen > 0) {
            damage = this.damage * (1 + quanzhen * 0.2);
        }

        // Fire in a fan or circle? Big Dipper shape is hard to represent with projectiles unless they stay in formation.
        // Let's do a spread fan.
        const baseAngle = this.game.player.lastMoveX !== 0 || this.game.player.lastMoveY !== 0
             ? Math.atan2(this.game.player.lastMoveY, this.game.player.lastMoveX)
             : -Math.PI/2; // Default up

        const spread = Math.PI / 2; // 90 degrees
        const startAngle = baseAngle - spread / 2;
        const step = spread / (count - 1);

        for(let i=0; i<count; i++) {
             const angle = startAngle + step * i;
             this.game.projectiles.push(new Projectile(
                 this.game,
                 this.game.player.x,
                 this.game.player.y,
                 angle,
                 speed,
                 damage,
                 2000,
                 'seven_star',
                 'straight'
             ));
        }
    }

    fireNeedle() {
        this.spawnCastEffect('cold_flash');
        // Ice Soul Silver Needle
        const poison = this.game.player.passives ? this.game.player.passives.poison : 0;
        const isEvolved = this.level >= 5 && poison >= 1;

        // Fire towards nearest enemy
        let nearest = null;
        let minDist = Infinity;
        
        this.game.enemies.forEach(e => {
            const dist = Utils.getDistance(this.game.player.x, this.game.player.y, e.x, e.y);
            if (dist < minDist && dist < this.range) {
                minDist = dist;
                nearest = e;
            }
        });

        const angle = nearest 
            ? Math.atan2(nearest.y - this.game.player.y, nearest.x - this.game.player.x)
            : (this.game.player.lastMoveX !== 0 || this.game.player.lastMoveY !== 0)
                ? Math.atan2(this.game.player.lastMoveY, this.game.player.lastMoveX)
                : Math.random() * Math.PI * 2;
            
        let count = 1 + Math.floor(this.level / 2);
        let type = 'needle';
        let damage = this.damage;
        let speed = 10;
        let spread = 0.1;

        if (isEvolved) {
            type = 'flower';
            count += 5; // Shotgun burst
            damage = this.damage * 2;
            spread = 0.5; // Wider spread
        } else if (poison > 0) {
            damage = this.damage * (1 + poison * 0.2);
        }

        for(let i=0; i<count; i++) {
            const fireAngle = angle + (Math.random() - 0.5) * spread;
            this.game.projectiles.push(new Projectile(
                this.game,
                this.game.player.x,
                this.game.player.y,
                fireAngle,
                speed,
                damage,
                1000,
                type,
                'straight'
            ));
        }
    }

    fireGuqin() {
        this.spawnCastEffect('sound');
        // Seven-String Guqin
        const melody = this.game.player.passives ? this.game.player.passives.melody : 0;
        const isEvolved = this.level >= 5 && melody >= 1;

        let type = 'note';
        let damage = this.damage;
        let speed = 4;
        let scale = 1.0;
        
        if (isEvolved) {
            type = 'sound_wave';
            damage = this.damage * 2.5;
            speed = 6;
            scale = 2.0;
            
            // Fire 360 burst
            const count = 8;
            for(let i=0; i<count; i++) {
                const angle = (Math.PI * 2 / count) * i;
                const p = new Projectile(
                    this.game,
                    this.game.player.x,
                    this.game.player.y,
                    angle,
                    speed,
                    damage,
                    2000,
                    type,
                    'straight'
                );
                p.scale = scale;
                p.pierce = 999; // Sound passes through everything
                this.game.projectiles.push(p);
            }
        } else {
            if (melody > 0) {
                damage = this.damage * (1 + melody * 0.2);
                scale = 1.0 + melody * 0.1;
            }
            
            // Fire towards nearest enemy
            let nearest = null;
            let minDist = Infinity;
            this.game.enemies.forEach(e => {
                const dist = Utils.getDistance(this.game.player.x, this.game.player.y, e.x, e.y);
                if (dist < minDist && dist < this.range) {
                    minDist = dist;
                    nearest = e;
                }
            });

            const angle = nearest 
                ? Math.atan2(nearest.y - this.game.player.y, nearest.x - this.game.player.x)
                : (this.game.player.lastMoveX !== 0 || this.game.player.lastMoveY !== 0)
                    ? Math.atan2(this.game.player.lastMoveY, this.game.player.lastMoveX)
                    : Math.random() * Math.PI * 2;

            const p = new Projectile(
                this.game,
                this.game.player.x,
                this.game.player.y,
                angle,
                speed,
                damage,
                1500,
                type,
                'straight'
            );
            p.scale = scale;
            p.pierce = 2 + Math.floor(this.level / 2);
            this.game.projectiles.push(p);
        }
    }

    fireFlyingDagger() {
        this.spawnCastEffect('dagger_flash');
        // Little Li's Flying Dagger
        const truth = this.game.player.passives ? this.game.player.passives.truth : 0;
        const isEvolved = this.level >= 5 && truth >= 1;
        
        // Find nearest enemy
        let nearest = null;
        let minDist = Infinity;
        
        this.game.enemies.forEach(e => {
            const dist = Utils.getDistance(this.game.player.x, this.game.player.y, e.x, e.y);
            if (dist < minDist && dist < this.range) {
                minDist = dist;
                nearest = e;
            }
        });

        if (nearest) {
            const angle = Math.atan2(nearest.y - this.game.player.y, nearest.x - this.game.player.x);
            
            let type = 'flying_dagger';
            let damage = this.damage;
            let speed = 12; // Very fast
            let pierce = 0;
            let crit = 0;

            if (isEvolved) {
                type = 'desolate_flash';
                damage = this.damage * 3;
                speed = 20; // Instant feel
                pierce = 10; // High pierce
                crit = 1.0; // Guaranteed crit
            } else if (truth > 0) {
                damage = this.damage * (1 + truth * 0.3);
                crit = truth * 0.1; // 10% crit chance per level
            }

            if (Math.random() < crit) {
                damage *= 2;
            }

            const p = new Projectile(
                this.game,
                this.game.player.x,
                this.game.player.y,
                angle,
                speed,
                damage,
                2000,
                type,
                'straight'
            );
            p.pierce = pierce;
            this.game.projectiles.push(p);
        }
    }

    fireHuashan() {
        this.spawnCastEffect('swift_flash');
        // Huashan Sword Art
        const ghost = this.game.player.passives ? this.game.player.passives.ghost : 0;
        const isEvolved = this.level >= 5 && ghost >= 1;

        const count = 3 + Math.floor(this.level / 2); // Fan of swords
        
        let targetAngle = 0;
        let nearest = null;
        let minDist = Infinity;
         this.game.enemies.forEach(e => {
            const dist = Utils.getDistance(this.game.player.x, this.game.player.y, e.x, e.y);
            if (dist < minDist && dist < this.range) {
                minDist = dist;
                nearest = e;
            }
        });
        
        if (nearest) {
            targetAngle = Math.atan2(nearest.y - this.game.player.y, nearest.x - this.game.player.x);
        } else {
             // If no enemy, fire in direction of movement or random
             if (this.game.player.lastMoveX !== 0 || this.game.player.lastMoveY !== 0) {
                 targetAngle = Math.atan2(this.game.player.lastMoveY, this.game.player.lastMoveX);
             } else {
                 targetAngle = Math.random() * Math.PI * 2;
             }
        }

        let type = 'huashan';
        let damage = this.damage;
        let speed = 6;
        let spread = 0.5; // Fan spread
        
        if (isEvolved) {
            type = 'evil_warding';
            damage = this.damage * 1.5;
            speed = 12;
            spread = 1.0; 
        } else if (ghost > 0) {
            speed = 6 + ghost; 
            damage = this.damage * (1 + ghost * 0.2);
        }

        const startAngle = targetAngle - spread / 2;
        const angleStep = spread / (Math.max(1, count - 1));

        for(let i=0; i<count; i++) {
             const angle = startAngle + angleStep * i;
             this.game.projectiles.push(new Projectile(
                this.game,
                this.game.player.x,
                this.game.player.y,
                angle,
                speed,
                damage,
                1000,
                type,
                'straight'
            ));
        }
    }

    fireBloodBlade() {
        this.spawnCastEffect('blood_slash');
        const isEvolved = this.level >= 8;
        let damage = this.damage;
        let speed = 5;
        let count = 1;
        let type = 'blood_blade';
        let size = 1.0;

        if (isEvolved) {
            damage = this.damage * 2.5;
            size = 1.5;
            count = 3;
        } else {
            damage = this.damage * (1 + (this.level-1) * 0.2);
            if (this.level >= 4) count = 2;
        }

        let targetAngle = 0;
        let nearest = null;
        let minDist = Infinity;
        
        this.game.enemies.forEach(e => {
            const dist = Utils.getDistance(this.game.player.x, this.game.player.y, e.x, e.y);
            if (dist < minDist && dist < this.range) {
                minDist = dist;
                nearest = e;
            }
        });

        if (nearest) {
            targetAngle = Math.atan2(nearest.y - this.game.player.y, nearest.x - this.game.player.x);
        } else if (this.game.player.lastMoveX !== 0 || this.game.player.lastMoveY !== 0) {
            targetAngle = Math.atan2(this.game.player.lastMoveY, this.game.player.lastMoveX);
        } else {
            targetAngle = -Math.PI/2;
        }

        for(let i=0; i<count; i++) {
            const angle = targetAngle + (i - (count-1)/2) * 0.3;
            const p = new Projectile(
                this.game,
                this.game.player.x,
                this.game.player.y,
                angle,
                speed,
                damage,
                1000,
                type,
                'straight'
            );
            p.scale = size;
            p.radius = 20 * size;
            this.game.projectiles.push(p);
        }
    }

    fireYangSpear() {
        this.spawnCastEffect('spear_thrust');
        const isEvolved = this.level >= 8;
        let damage = this.damage;
        let speed = 12;
        let type = 'yang_spear';
        let pierce = 3;
        
        if (isEvolved) {
            damage = this.damage * 2;
            pierce = 10;
            type = 'yang_spear_evolved';
        } else {
            damage = this.damage * (1 + (this.level-1) * 0.2);
            pierce = 3 + Math.floor(this.level / 2);
        }

        let nearest = null;
        let minDist = Infinity;
        this.game.enemies.forEach(e => {
            const dist = Utils.getDistance(this.game.player.x, this.game.player.y, e.x, e.y);
            if (dist < minDist && dist < this.range) {
                minDist = dist;
                nearest = e;
            }
        });

        const angle = nearest 
            ? Math.atan2(nearest.y - this.game.player.y, nearest.x - this.game.player.x)
            : (this.game.player.lastMoveX !== 0 || this.game.player.lastMoveY !== 0)
                ? Math.atan2(this.game.player.lastMoveY, this.game.player.lastMoveX)
                : Math.random() * Math.PI * 2;

        const p = new Projectile(
            this.game,
            this.game.player.x,
            this.game.player.y,
            angle,
            speed,
            damage,
            2000,
            type,
            'straight'
        );
        p.pierce = pierce;
        this.game.projectiles.push(p);
    }

    fireGoldenWheel() {
        this.spawnCastEffect('wheel_spin');
        const isEvolved = this.level >= 8;
        let damage = this.damage;
        let speed = 8;
        let count = 1;
        let type = 'golden_wheel';
        let duration = 3000;

        if (isEvolved) {
            damage = this.damage * 2;
            count = 3;
            type = 'golden_wheel_evolved';
        } else {
            damage = this.damage * (1 + (this.level-1) * 0.2);
            if (this.level >= 4) count = 2;
        }

        let nearest = null;
        let minDist = Infinity;
        this.game.enemies.forEach(e => {
            const dist = Utils.getDistance(this.game.player.x, this.game.player.y, e.x, e.y);
            if (dist < minDist && dist < this.range) {
                minDist = dist;
                nearest = e;
            }
        });

        const baseAngle = nearest 
            ? Math.atan2(nearest.y - this.game.player.y, nearest.x - this.game.player.x)
            : (this.game.player.lastMoveX !== 0 || this.game.player.lastMoveY !== 0)
                ? Math.atan2(this.game.player.lastMoveY, this.game.player.lastMoveX)
                : Math.random() * Math.PI * 2;

        for(let i=0; i<count; i++) {
            const angle = baseAngle + (i - (count-1)/2) * 0.5;
            const p = new Projectile(
                this.game,
                this.game.player.x,
                this.game.player.y,
                angle,
                speed,
                damage,
                duration,
                type,
                'boomerang'
            );
            p.pierce = 999;
            this.game.projectiles.push(p);
        }
    }

    spawnCastEffect(type) {
        if (type === 'palm_flash') {
            for(let i=0; i<10; i++) {
                this.game.particles.push(new Particle(this.game, this.game.player.x, this.game.player.y, 'smoke', {
                    color: '#e74c3c',
                    size: 10,
                    life: 40,
                    maxLife: 40,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 0.5) * 4
                }));
            }
        } else if (type === 'aura_pulse') {
             this.game.particles.push(new Particle(this.game, this.game.player.x, this.game.player.y, 'explosion', {
                    color: 'rgba(231, 76, 60, 0.3)',
                    size: 80, // Matches initial aura radius roughly
                    life: 10,
                    maxLife: 10,
                    vx: 0, vy: 0
            }));
        } else if (type === 'taiji_flash') {
             this.game.particles.push(new Particle(this.game, this.game.player.x, this.game.player.y, 'explosion', {
                    color: '#ffffff',
                    size: 15,
                    life: 15,
                    maxLife: 15,
                    vx: 0, vy: 0
            }));
            for(let i=0; i<6; i++) {
                 this.game.particles.push(new Particle(this.game, this.game.player.x, this.game.player.y, 'trail', {
                    color: i % 2 === 0 ? '#000000' : '#ffffff',
                    size: 5,
                    life: 30,
                    maxLife: 30,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 0.5) * 4
                }));
            }
        } else if (type === 'six_pulse_flash') {
             this.game.particles.push(new Particle(this.game, this.game.player.x, this.game.player.y, 'explosion', {
                    color: '#3498db',
                    size: 20,
                    life: 10,
                    maxLife: 10,
                    vx: 0, vy: 0
            }));
             for(let i=0; i<8; i++) {
                 const angle = (Math.PI * 2 / 8) * i;
                 this.game.particles.push(new Particle(this.game, this.game.player.x, this.game.player.y, 'sparkle', {
                    color: '#ecf0f1',
                    size: 3,
                    life: 20,
                    maxLife: 20,
                    vx: Math.cos(angle) * 6,
                    vy: Math.sin(angle) * 6
                }));
             }
        } else if (type === 'spirit_flash') {
             for(let i=0; i<6; i++) {
                this.game.particles.push(new Particle(this.game, this.game.player.x, this.game.player.y, 'trail', {
                    color: '#8e44ad', // Purple
                    size: 4,
                    life: 25,
                    maxLife: 25,
                    vx: (Math.random() - 0.5) * 5,
                    vy: (Math.random() - 0.5) * 5
                }));
            }
        } else if (type === 'dagger_flash') {
             this.game.particles.push(new Particle(this.game, this.game.player.x, this.game.player.y, 'explosion', {
                    color: '#95a5a6',
                    size: 15,
                    life: 10,
                    maxLife: 10,
                    vx: 0, vy: 0
            }));
        } else if (type === 'swift_flash') {
             for(let i=0; i<5; i++) {
                this.game.particles.push(new Particle(this.game, this.game.player.x, this.game.player.y, 'smoke', {
                    color: '#ecf0f1', // White wind
                    size: 5,
                    life: 20,
                    maxLife: 20,
                    vx: (Math.random() - 0.5) * 8, // Fast
                    vy: (Math.random() - 0.5) * 8
                }));
            }
        } else if (type === 'sword') {
             for(let i=0; i<5; i++) {
                this.game.particles.push(new Particle(this.game, this.game.player.x, this.game.player.y, 'trail', {
                    color: '#bdc3c7',
                    size: 4,
                    life: 20,
                    maxLife: 20,
                    vx: (Math.random() - 0.5) * 6,
                    vy: (Math.random() - 0.5) * 6
                }));
            }
        } else if (type === 'flash') {
            // Bright flash
             this.game.particles.push(new Particle(this.game, this.game.player.x, this.game.player.y, 'explosion', {
                    color: '#ffffff',
                    size: 20,
                    life: 10,
                    maxLife: 10,
                    vx: 0, vy: 0
            }));
        } else if (type === 'snake_flash') {
            // Golden/Green flash
             this.game.particles.push(new Particle(this.game, this.game.player.x, this.game.player.y, 'explosion', {
                    color: '#f1c40f',
                    size: 25,
                    life: 15,
                    maxLife: 15,
                    vx: 0, vy: 0
            }));
             for(let i=0; i<5; i++) {
                this.game.particles.push(new Particle(this.game, this.game.player.x, this.game.player.y, 'smoke', {
                    color: '#2ecc71',
                    size: 5,
                    life: 25,
                    maxLife: 25,
                    vx: (Math.random() - 0.5) * 3,
                    vy: (Math.random() - 0.5) * 3
                }));
            }
        } else if (type === 'sound') {
             for(let i=0; i<3; i++) {
                 this.game.particles.push(new Particle(this.game, this.game.player.x, this.game.player.y, 'note', {
                    color: '#2ecc71',
                    size: 8,
                    life: 30,
                    maxLife: 30,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 0.5) * 4
                }));
            }
        } else if (type === 'claw') {
            // Nine Yin Bone Claw cast effect - Ghostly aura
            for(let i=0; i<8; i++) {
                this.game.particles.push(new Particle(this.game, this.game.player.x, this.game.player.y, 'flame', {
                    color: Math.random() > 0.5 ? '#9b59b6' : '#8e44ad', // Purple shades
                    size: 6,
                    life: 30,
                    maxLife: 30,
                    vx: (Math.random() - 0.5) * 5,
                    vy: (Math.random() - 0.5) * 5
                }));
            }
            for(let i=0; i<5; i++) {
                this.game.particles.push(new Particle(this.game, this.game.player.x, this.game.player.y, 'sparkle', {
                    color: '#ecf0f1', // Bone white
                    size: 4,
                    life: 20,
                    maxLife: 20,
                    vx: (Math.random() - 0.5) * 7,
                    vy: (Math.random() - 0.5) * 7
                }));
            }
        } else if (type === 'cold_flash') {
             this.game.particles.push(new Particle(this.game, this.game.player.x, this.game.player.y, 'explosion', {
                    color: '#3498db',
                    size: 20,
                    life: 15,
                    maxLife: 15,
                    vx: 0, vy: 0
            }));
             for(let i=0; i<5; i++) {
                this.game.particles.push(new Particle(this.game, this.game.player.x, this.game.player.y, 'trail', {
                    color: '#ecf0f1',
                    size: 3,
                    life: 20,
                    maxLife: 20,
                    vx: (Math.random() - 0.5) * 8,
                    vy: (Math.random() - 0.5) * 8
                }));
            }
        } else if (type === 'stone') {
             // Finger Flick - concentrated force
             this.game.particles.push(new Particle(this.game, this.game.player.x, this.game.player.y, 'explosion', {
                    color: '#bdc3c7',
                    size: 10,
                    life: 10,
                    maxLife: 10,
                    vx: 0, vy: 0
            }));
             for(let i=0; i<3; i++) {
                this.game.particles.push(new Particle(this.game, this.game.player.x, this.game.player.y, 'trail', {
                    color: '#95a5a6',
                    size: 4,
                    life: 20,
                    maxLife: 20,
                    vx: (Math.random() - 0.5) * 10, // Fast debris
                    vy: (Math.random() - 0.5) * 10
                }));
            }
        } else if (type === 'spin') {
             for(let i=0; i<10; i++) {
                 const angle = (Math.PI * 2 / 10) * i;
                 this.game.particles.push(new Particle(this.game, this.game.player.x, this.game.player.y, 'trail', {
                    color: '#27ae60',
                    size: 4,
                    life: 15,
                    maxLife: 15,
                    vx: Math.cos(angle) * 5,
                    vy: Math.sin(angle) * 5
                }));
             }
        } else if (type === 'roar') {
             // Lion's Roar - expanding shockwave
             this.game.particles.push(new Particle(this.game, this.game.player.x, this.game.player.y, 'shockwave', {
                    color: 'rgba(241, 196, 15, 0.5)',
                    size: 20,
                    life: 20,
                    maxLife: 20,
                    vx: 0, vy: 0
            }));
            for(let i=0; i<8; i++) {
                const angle = (Math.PI * 2 / 8) * i;
                this.game.particles.push(new Particle(this.game, this.game.player.x, this.game.player.y, 'smoke', {
                    color: '#f39c12',
                    size: 8,
                    life: 30,
                    maxLife: 30,
                    vx: Math.cos(angle) * 3,
                    vy: Math.sin(angle) * 3
                }));
            }
        } else if (type === 'star') {
             // Seven Star - constellation flash
             for(let i=0; i<7; i++) {
                 this.game.particles.push(new Particle(this.game, this.game.player.x + (Math.random()-0.5)*40, this.game.player.y + (Math.random()-0.5)*40, 'sparkle', {
                    color: '#f1c40f',
                    size: 8,
                    life: 25,
                    maxLife: 25,
                    vx: 0, vy: 0
                }));
             }
        } else if (type === 'blood_slash') {
            this.game.particles.push(new Particle(this.game, this.game.player.x, this.game.player.y, 'explosion', {
                color: '#c0392b',
                size: 30,
                life: 10,
                maxLife: 10,
                vx: 0, vy: 0
            }));
        } else if (type === 'spear_thrust') {
             // Linear dash effect
             const angle = this.game.player.lastMoveX !== 0 || this.game.player.lastMoveY !== 0
                ? Math.atan2(this.game.player.lastMoveY, this.game.player.lastMoveX)
                : -Math.PI/2;
             for(let i=0; i<5; i++) {
                this.game.particles.push(new Particle(this.game, this.game.player.x, this.game.player.y, 'trail', {
                    color: '#ecf0f1',
                    size: 5,
                    life: 15,
                    maxLife: 15,
                    vx: Math.cos(angle) * 10 + (Math.random()-0.5)*2,
                    vy: Math.sin(angle) * 10 + (Math.random()-0.5)*2
                }));
             }
        } else if (type === 'wheel_spin') {
            for(let i=0; i<8; i++) {
                const a = (Math.PI * 2 / 8) * i;
                this.game.particles.push(new Particle(this.game, this.game.player.x, this.game.player.y, 'sparkle', {
                    color: '#f39c12',
                    size: 5,
                    life: 20,
                    maxLife: 20,
                    vx: Math.cos(a) * 5,
                    vy: Math.sin(a) * 5
                }));
            }
        }
    }
}
