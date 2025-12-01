import { Player } from './Player.js';
import { InputHandler } from './InputHandler.js';
import { Enemy } from './Enemy.js';
import { Projectile } from './Projectile.js';
import { Item } from './Item.js';
import { Utils } from './Utils.js';
import { Weapon } from './Weapon.js';
import { Assets } from './Assets.js';
import { Particle } from './Particle.js';

export class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.input = new InputHandler();
        this.player = new Player(this);
        
        // Initialize Default Weapon
        this.player.weapons.push(new Weapon(this, 'wand'));

        this.enemies = [];
        this.projectiles = [];
        this.particles = [];
        this.items = [];
        this.enemyTimer = 0;
        this.enemyInterval = 1000;
        this.difficultyMultiplier = 1;
        this.gameTime = 0;
        this.isGameOver = false;
        this.isPaused = false;
        
        this.stats = {
            kills: 0,
            coins: 0
        };

        // Camera offset
        this.camera = { x: 0, y: 0 };
    }

    update(deltaTime) {
        if (this.isGameOver || this.isPaused) return;

        this.gameTime += deltaTime;
        
        // Difficulty scaling
        this.difficultyMultiplier = 1 + Math.floor(this.gameTime / 30000) * 0.2; // Every 30s +20%
        this.enemyInterval = Math.max(200, 1000 - (this.difficultyMultiplier * 100));

        // Update entities
        this.player.update(deltaTime);
        
        // Camera follows player
        this.camera.x = this.player.x - this.width / 2;
        this.camera.y = this.player.y - this.height / 2;

        // Enemies
        this.enemies.forEach(enemy => enemy.update(deltaTime));
        this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
        
        // Projectiles
        this.projectiles.forEach(proj => proj.update(deltaTime));
        this.projectiles = this.projectiles.filter(proj => !proj.markedForDeletion);
        
        // Particles
        this.particles.forEach(p => p.update(deltaTime));
        this.particles = this.particles.filter(p => !p.markedForDeletion);
        
        // Items
        this.items.forEach(item => item.update(deltaTime));
        this.items = this.items.filter(item => !item.markedForDeletion);

        // Spawning
        if (this.enemyTimer > this.enemyInterval) {
            this.spawnEnemy();
            this.enemyTimer = 0;
        } else {
            this.enemyTimer += deltaTime;
        }
        
        // Boss Spawning (Every 60s)
        if (Math.floor(this.gameTime / 1000) % 60 === 0 && Math.floor((this.gameTime - deltaTime) / 1000) % 60 !== 0 && this.gameTime > 1000) {
             this.spawnBoss();
        }

        // Collision Check: Projectiles
        this.projectiles.forEach(projectile => {
            if (projectile.isEnemy) {
                // Enemy Projectile vs Player
                if (!projectile.markedForDeletion && Utils.checkCollision(projectile, this.player)) {
                    this.player.takeDamage(projectile.damage);
                    projectile.markedForDeletion = true;
                }
            } else {
                // Player Projectile vs Enemies
                this.enemies.forEach(enemy => {
                    if (!projectile.markedForDeletion && !enemy.markedForDeletion) {
                        if (Utils.checkCollision(projectile, enemy)) {
                            // Check hit timer
                            if (!projectile.hitTimers.has(enemy)) {
                                enemy.takeDamage(projectile.damage);
                                projectile.pierce--;
                                if (projectile.pierce <= 0) projectile.markedForDeletion = true;
                                
                                // Add hit timer based on type
                                let cooldown = 0;
                                if (projectile.type === 'taiji') cooldown = 500; // Hit every 0.5s
                                else if (projectile.pierce > 0) cooldown = 200; // Prevent shotgunning
                                
                                if (cooldown > 0) projectile.hitTimers.set(enemy, cooldown);

                                // Trigger hit effect (e.g. ricochet)
                                if (projectile.onHit) projectile.onHit(enemy);
                            }
                        }
                    }
                });
            }
        });

        this.updateUI();
    }

    draw(ctx) {
        ctx.clearRect(0, 0, this.width, this.height);
        
        ctx.save();
        // Apply Camera
        ctx.translate(-this.camera.x, -this.camera.y);

        // Draw Grid Background to show movement
        this.drawBackground(ctx);

        this.items.forEach(item => item.draw(ctx));
        this.enemies.forEach(enemy => enemy.draw(ctx));
        this.particles.forEach(p => p.draw(ctx));
        this.projectiles.forEach(proj => proj.draw(ctx));
        this.player.draw(ctx);
        
        ctx.restore();
    }

    drawBackground(ctx) {
        const groundImg = Assets.images.ground;
        
        if (groundImg) {
            const tileSize = 256;
            const xStart = Math.floor(this.camera.x / tileSize) * tileSize;
            const yStart = Math.floor(this.camera.y / tileSize) * tileSize;
            const xEnd = this.camera.x + this.width + tileSize;
            const yEnd = this.camera.y + this.height + tileSize;
            
            for (let x = xStart; x < xEnd; x += tileSize) {
                for (let y = yStart; y < yEnd; y += tileSize) {
                    ctx.drawImage(groundImg, x, y);
                }
            }
        } else {
            const gridSize = 100;
            const xStart = Math.floor(this.camera.x / gridSize) * gridSize;
            const yStart = Math.floor(this.camera.y / gridSize) * gridSize;
            
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;
            ctx.beginPath();
            
            for (let x = xStart; x < this.camera.x + this.width + gridSize; x += gridSize) {
                ctx.moveTo(x, this.camera.y - 100); 
                ctx.lineTo(x, this.camera.y + this.height + 100);
            }
            
            for (let y = yStart; y < this.camera.y + this.height + gridSize; y += gridSize) {
                ctx.moveTo(this.camera.x - 100, y);
                ctx.lineTo(this.camera.x + this.width + 100, y);
            }
            ctx.stroke();
        }
    }

    spawnEnemy() {
        // Spawn at edge of screen + buffer
        const angle = Math.random() * Math.PI * 2;
        // Radius should be enough to be offscreen. 
        // Diagonal of screen is approx sqrt(w^2 + h^2). 
        const spawnRadius = Math.sqrt(this.width*this.width + this.height*this.height) / 2 + 100;
        
        const x = this.player.x + Math.cos(angle) * spawnRadius;
        const y = this.player.y + Math.sin(angle) * spawnRadius;
        
        let type = 'basic';
        const rand = Math.random();
        if (this.gameTime > 30000 && rand < 0.2) type = 'fast';
        if (this.gameTime > 60000 && rand < 0.1) type = 'tank';
        if (this.gameTime > 90000 && rand < 0.15) type = 'shooter';
        if (this.gameTime > 120000 && rand < 0.1) type = 'charger';
        
        const enemy = new Enemy(this, type);
        enemy.x = x;
        enemy.y = y;
        this.enemies.push(enemy);
    }
    
    spawnBoss() {
        const angle = Math.random() * Math.PI * 2;
        const spawnRadius = 600;
        const x = this.player.x + Math.cos(angle) * spawnRadius;
        const y = this.player.y + Math.sin(angle) * spawnRadius;
        
        const boss = new Enemy(this, 'boss');
        boss.x = x;
        boss.y = y;
        this.enemies.push(boss);
    }

    spawnDrop(x, y, xpValue) {
        // Always spawn XP
        this.items.push(new Item(this, x, y, 'xp', xpValue));
        
        // Chance for other items
        const rand = Math.random();
        if (rand < 0.01) this.items.push(new Item(this, x + 10, y, 'health', 20));
        else if (rand < 0.02) this.items.push(new Item(this, x - 10, y, 'magnet', 0));
        else if (rand < 0.025) this.items.push(new Item(this, x, y + 10, 'nuke', 0));
        else if (rand < 0.05) this.items.push(new Item(this, x, y - 10, 'coin', 10));
    }

    triggerLevelUp() {
        this.isPaused = true;
        const modal = document.getElementById('level-up-modal');
        const optionsContainer = document.getElementById('upgrade-options');
        const modalTitle = modal.querySelector('h2'); // Assuming there's an h2
        if (modalTitle) modalTitle.innerText = "Level Up!";
        
        optionsContainer.innerHTML = '';
        
        // Generate 4 random options (Increased from 3)
        const options = this.getUpgradeOptions(4);
        
        this.renderUpgradeOptions(optionsContainer, options, modal);
        
        modal.classList.remove('hidden');
    }

    triggerChestReward() {
        this.isPaused = true;
        const modal = document.getElementById('level-up-modal');
        const optionsContainer = document.getElementById('upgrade-options');
        const modalTitle = modal.querySelector('h2');
        if (modalTitle) modalTitle.innerText = "Boss Reward!";

        optionsContainer.innerHTML = '';
        
        // Generate 5 random options for Boss Chest
        const options = this.getUpgradeOptions(5);
        
        this.renderUpgradeOptions(optionsContainer, options, modal, true);
        
        modal.classList.remove('hidden');
    }

    renderUpgradeOptions(container, options, modal, isBoss = false) {
        const MAX_LEVEL = 8;

        options.forEach(opt => {
            const div = document.createElement('div');
            div.className = isBoss ? 'upgrade-card boss-reward' : 'upgrade-card';
            if (isBoss) div.style.border = '2px solid #f1c40f';

            let titleHTML = `${opt.name} <span class="upgrade-type">${opt.type}</span>`;
            let descHTML = opt.description;
            let levelInfoHTML = '';

            // Check if it's a weapon upgrade
            if (opt.weaponType) {
                const weapon = this.player.weapons.find(w => w.type === opt.weaponType);
                if (weapon) {
                    titleHTML = `<span style="color:#e67e22">升级: ${opt.name}</span> <span class="upgrade-type">${opt.type}</span>`;
                    levelInfoHTML = `<div class="upgrade-level">Lv.${weapon.level} <span style="color:#2ecc71">➜ Lv.${weapon.level + 1}</span></div>`;
                    
                    if (weapon.level + 1 >= MAX_LEVEL) {
                        descHTML += `<br><span style="color:#f1c40f; font-weight:bold;">★ 满级解锁终极特效!</span>`;
                    }
                } else {
                     levelInfoHTML = `<div class="upgrade-level" style="color:#3498db">新武学!</div>`;
                }
            } 
            // Check if it's a passive upgrade
            else if (opt.passiveId) {
                const currentLevel = this.player.passives[opt.passiveId] || 0;
                if (currentLevel > 0) {
                    titleHTML = `<span style="color:#e67e22">升级: ${opt.name}</span> <span class="upgrade-type">${opt.type}</span>`;
                    levelInfoHTML = `<div class="upgrade-level">Lv.${currentLevel} <span style="color:#2ecc71">➜ Lv.${currentLevel + 1}</span></div>`;
                     if (currentLevel + 1 >= 5) { // Assuming max level 5 for passives
                        descHTML += `<br><span style="color:#f1c40f; font-weight:bold;">★ 满级解锁终极特效!</span>`;
                    }
                } else {
                    levelInfoHTML = `<div class="upgrade-level" style="color:#3498db">新心法!</div>`;
                }
            }

            div.innerHTML = `
                <div class="upgrade-title" style="${isBoss ? 'color:#f1c40f' : ''}">${titleHTML}</div>
                ${levelInfoHTML}
                <div class="upgrade-desc">${descHTML}</div>
            `;
            div.onclick = () => {
                this.applyUpgrade(opt);
                modal.classList.add('hidden');
                this.isPaused = false;
            };
            container.appendChild(div);
        });
    }
    
    getUpgradeOptions(count = 3) {
        // Define pool of upgrades
        const upgrades = [
            { id: 'speed', name: '凌波微步', type: '身法', description: '移动速度提升 10%', apply: (g) => g.player.speed *= 1.1 },
            { id: 'maxhp', name: '易筋经', type: '内功', passiveId: 'muscleTendon', description: '气血上限提升 20，配合降龙十八掌可进化', apply: (g) => { g.player.maxHp += 20; g.player.hp += 20; g.player.passives.muscleTendon++; } },
            { id: 'multishot', name: '六脉神剑·精进', type: '剑法', weaponType: 'wand', description: '增加一道六脉剑气', apply: (g) => {} },
            { id: 'new_wand', name: '六脉神剑', type: '绝学', weaponType: 'wand', description: '习得六脉神剑，发射无形剑气', apply: (g) => {} },
            { id: 'aura', name: '九阳神功', type: '绝学', weaponType: 'aura', description: '护体真气对周围敌人造成伤害', apply: (g) => {} },
            { id: 'new_dagger', name: '金蛇剑法', type: '奇门', weaponType: 'dagger', description: '习得金蛇剑法，发射穿透飞剑', apply: (g) => {} },
            { id: 'new_taiji', name: '太极剑法', type: '绝学', weaponType: 'taiji', description: '习得太极剑法，召唤阴阳剑气护体', apply: (g) => {} },
            { id: 'new_dugu', name: '独孤九剑', type: '绝学', weaponType: 'dugu', description: '习得独孤九剑，发射追踪剑气', apply: (g) => {} },
            { id: 'new_palm', name: '降龙十八掌', type: '绝学', weaponType: 'palm', description: '习得降龙十八掌，发射龙形掌力', apply: (g) => {} },
            { id: 'new_stone', name: '弹指神通', type: '奇门', weaponType: 'stone', description: '习得弹指神通，发射弹射石子', apply: (g) => {} },
            { id: 'new_staff', name: '打狗棒法', type: '绝学', weaponType: 'staff', description: '习得打狗棒法，召唤打狗棒护身', apply: (g) => {} },
            { id: 'new_roar', name: '狮子吼', type: '绝学', weaponType: 'roar', description: '习得狮子吼，发出震慑波', apply: (g) => {} },
            { id: 'new_claw', name: '九阴白骨爪', type: '绝学', weaponType: 'claw', description: '习得九阴白骨爪，抓取敌人要害', apply: (g) => {} },
            { id: 'new_seven_star', name: '七星剑', type: '绝学', weaponType: 'seven_star', description: '习得七星剑，布下北斗七星阵', apply: (g) => {} },
            { id: 'new_needle', name: '冰魄银针', type: '暗器', weaponType: 'needle', description: '习得冰魄银针，发射带毒银针', apply: (g) => {} },
            { id: 'new_guqin', name: '七弦琴', type: '音律', weaponType: 'guqin', description: '习得七弦琴，音波攻击穿透敌人', apply: (g) => {} },
            { id: 'new_flying_dagger', name: '小李飞刀', type: '暗器', weaponType: 'flying_dagger', description: '习得小李飞刀，例不虚发', apply: (g) => {} },
            { id: 'new_huashan', name: '华山剑法', type: '剑法', weaponType: 'huashan', description: '习得华山剑法，君子之剑', apply: (g) => {} },
            { id: 'new_blood_blade', name: '血刀大法', type: '绝学', weaponType: 'blood_blade', description: '习得血刀大法，范围斩击', apply: (g) => {} },
            { id: 'new_yang_spear', name: '杨家枪法', type: '绝学', weaponType: 'yang_spear', description: '习得杨家枪法，直线突刺', apply: (g) => {} },
            { id: 'new_golden_wheel', name: '金轮大法', type: '绝学', weaponType: 'golden_wheel', description: '习得金轮大法，回旋飞舞', apply: (g) => {} },
            { id: 'passive_snake_tech', name: '金蛇剑法', type: '心法', passiveId: 'snakeTech', description: '强化金蛇剑气，满级可化为巨蟒', apply: (g) => { g.player.passives.snakeTech++; } },
            { id: 'passive_taiji_mantra', name: '太极心法', type: '心法', passiveId: 'taijiMantra', description: '强化太极剑法，满级可化为八卦阵', apply: (g) => { g.player.passives.taijiMantra++; } },
            { id: 'passive_internal_force', name: '北冥神功', type: '心法', passiveId: 'internalForce', description: '增加内力，强化六脉神剑', apply: (g) => { g.player.passives.internalForce++; } },
            { id: 'passive_sword_intent', name: '独孤剑意', type: '心法', passiveId: 'swordIntent', description: '领悟剑意，强化独孤九剑', apply: (g) => { g.player.passives.swordIntent++; } },
            { id: 'passive_yang_energy', name: '纯阳无极', type: '心法', passiveId: 'yangEnergy', description: '修炼纯阳内力，强化九阳神功', apply: (g) => { g.player.passives.yangEnergy++; } },
            { id: 'passive_muscle_tendon', name: '易筋经', type: '心法', passiveId: 'muscleTendon', description: '易筋洗髓，强化降龙十八掌', apply: (g) => { g.player.passives.muscleTendon++; } },
            { id: 'passive_qimen', name: '奇门遁甲', type: '心法', passiveId: 'qimen', description: '精通奇门，强化弹指神通', apply: (g) => { g.player.passives.qimen++; } },
            { id: 'passive_beggar_heart', name: '叫花心法', type: '心法', passiveId: 'beggarHeart', description: '强化打狗棒法，满级可领悟天下无狗', apply: (g) => { g.player.passives.beggarHeart++; } },
            { id: 'passive_zen', name: '坐禅', type: '心法', passiveId: 'zen', description: '强化狮子吼，满级可领悟佛门金刚吼', apply: (g) => { g.player.passives.zen++; } },
            { id: 'passive_nine_yin', name: '九阴真经', type: '心法', passiveId: 'nineYin', description: '强化九阴白骨爪，满级可领悟九阴极意', apply: (g) => { g.player.passives.nineYin++; } },
            { id: 'passive_quanzhen', name: '全真剑法', type: '心法', passiveId: 'quanzhen', description: '强化七星剑，满级可领悟天罡北斗阵', apply: (g) => { g.player.passives.quanzhen++; } },
            { id: 'passive_poison', name: '五毒秘传', type: '心法', passiveId: 'poison', description: '强化冰魄银针，满级可领悟漫天花雨', apply: (g) => { g.player.passives.poison++; } },
            { id: 'passive_melody', name: '逍遥琴谱', type: '心法', passiveId: 'melody', description: '强化七弦琴，满级可领悟天龙八音', apply: (g) => { g.player.passives.melody++; } },
            { id: 'passive_truth', name: '天眼通', type: '心法', passiveId: 'truth', description: '强化小李飞刀，提高暴击', apply: (g) => { g.player.passives.truth++; } },
            { id: 'passive_ghost', name: '鬼影迷踪', type: '轻功', passiveId: 'ghost', description: '强化华山剑法，提升速度', apply: (g) => { g.player.passives.ghost++; } },
            { id: 'passive_lifesteal', name: '吸星大法', type: '绝学', passiveId: 'lifesteal', description: '攻击附带吸血效果 (每次命中恢复 1 点生命)', apply: (g) => { g.player.passives.lifesteal++; } }
        ];
        
        // Randomly pick count
        const result = [];
        for(let i=0; i<count; i++) {
            result.push(upgrades[Math.floor(Math.random() * upgrades.length)]);
        }
        return result;
    }
    
    spawnChest(x, y) {
        this.items.push(new Item(this, x, y, 'chest', 0));
    }

    applyUpgrade(opt) {
        opt.apply(this);
        
        if (opt.id === 'new_wand') {
            const w = this.player.weapons.find(w => w.type === 'wand');
            if (w) w.level++;
            else this.player.weapons.push(new Weapon(this, 'wand'));
        }
        if (opt.id === 'multishot') {
             const w = this.player.weapons.find(w => w.type === 'wand');
             if (w) w.level++;
        }
        if (opt.id === 'aura') {
             const w = this.player.weapons.find(w => w.type === 'aura');
             if (w) w.level++;
             else this.player.weapons.push(new Weapon(this, 'aura'));
        }
        if (opt.id === 'new_dagger') {
             const w = this.player.weapons.find(w => w.type === 'dagger');
             if (w) w.level++;
             else this.player.weapons.push(new Weapon(this, 'dagger'));
        }
        if (opt.id === 'new_taiji') {
             const w = this.player.weapons.find(w => w.type === 'taiji');
             if (w) w.level++;
             else this.player.weapons.push(new Weapon(this, 'taiji'));
        }
        if (opt.id === 'new_dugu') {
             const w = this.player.weapons.find(w => w.type === 'dugu');
             if (w) w.level++;
             else this.player.weapons.push(new Weapon(this, 'dugu'));
        }
        if (opt.id === 'new_palm') {
             const w = this.player.weapons.find(w => w.type === 'palm');
             if (w) w.level++;
             else this.player.weapons.push(new Weapon(this, 'palm'));
        }
        if (opt.id === 'new_stone') {
             const w = this.player.weapons.find(w => w.type === 'stone');
             if (w) w.level++;
             else this.player.weapons.push(new Weapon(this, 'stone'));
        }
        if (opt.id === 'new_staff') {
             const w = this.player.weapons.find(w => w.type === 'staff');
             if (w) w.level++;
             else this.player.weapons.push(new Weapon(this, 'staff'));
        }
        if (opt.id === 'new_roar') {
             const w = this.player.weapons.find(w => w.type === 'roar');
             if (w) w.level++;
             else this.player.weapons.push(new Weapon(this, 'roar'));
        }
        if (opt.id === 'new_claw') {
             const w = this.player.weapons.find(w => w.type === 'claw');
             if (w) w.level++;
             else this.player.weapons.push(new Weapon(this, 'claw'));
        }
        if (opt.id === 'new_seven_star') {
             const w = this.player.weapons.find(w => w.type === 'seven_star');
             if (w) w.level++;
             else this.player.weapons.push(new Weapon(this, 'seven_star'));
        }
        if (opt.id === 'new_needle') {
             const w = this.player.weapons.find(w => w.type === 'needle');
             if (w) w.level++;
             else this.player.weapons.push(new Weapon(this, 'needle'));
        }
        if (opt.id === 'new_guqin') {
             const w = this.player.weapons.find(w => w.type === 'guqin');
             if (w) w.level++;
             else this.player.weapons.push(new Weapon(this, 'guqin'));
        }
        if (opt.id === 'new_flying_dagger') {
             const w = this.player.weapons.find(w => w.type === 'flying_dagger');
             if (w) w.level++;
             else this.player.weapons.push(new Weapon(this, 'flying_dagger'));
        }
        if (opt.id === 'new_huashan') {
             const w = this.player.weapons.find(w => w.type === 'huashan');
             if (w) w.level++;
             else this.player.weapons.push(new Weapon(this, 'huashan'));
        }
        if (opt.id === 'new_blood_blade') {
             const w = this.player.weapons.find(w => w.type === 'blood_blade');
             if (w) w.level++;
             else this.player.weapons.push(new Weapon(this, 'blood_blade'));
        }
        if (opt.id === 'new_yang_spear') {
             const w = this.player.weapons.find(w => w.type === 'yang_spear');
             if (w) w.level++;
             else this.player.weapons.push(new Weapon(this, 'yang_spear'));
        }
        if (opt.id === 'new_golden_wheel') {
             const w = this.player.weapons.find(w => w.type === 'golden_wheel');
             if (w) w.level++;
             else this.player.weapons.push(new Weapon(this, 'golden_wheel'));
        }
    }

    gameOver() {
        this.isGameOver = true;
        document.getElementById('game-over-modal').classList.remove('hidden');
        document.getElementById('final-time').innerText = document.getElementById('time-text').innerText;
        document.getElementById('final-kills').innerText = this.stats.kills;
    }

    updateUI() {
        const hpBar = document.getElementById('hp-bar');
        const hpText = document.getElementById('hp-text');
        const xpBar = document.getElementById('xp-bar');
        const lvlText = document.getElementById('level-text');
        const timeText = document.getElementById('time-text');
        const killText = document.getElementById('kill-text');
        const coinText = document.getElementById('coin-text');
        
        const hpPercent = (this.player.hp / this.player.maxHp) * 100;
        hpBar.style.width = `${Math.max(0, hpPercent)}%`;
        hpText.innerText = `${Math.ceil(this.player.hp)}/${this.player.maxHp}`;
        
        const xpPercent = (this.player.xp / this.player.xpToNextLevel) * 100;
        xpBar.style.width = `${xpPercent}%`;
        lvlText.innerText = `境界 ${this.player.level}`;
        
        killText.innerText = this.stats.kills;
        coinText.innerText = this.stats.coins;
        
        // Time format MM:SS
        const totalSeconds = Math.floor(this.gameTime / 1000);
        const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        timeText.innerText = `${minutes}:${seconds}`;
    }
}
