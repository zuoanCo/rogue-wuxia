export const Assets = {
    images: {},

    init() {
        this.images.player = this.createPlayerSprite();
        this.images.enemy_basic = this.createEnemyBasicSprite();
        this.images.enemy_fast = this.createEnemyFastSprite();
        this.images.enemy_tank = this.createEnemyTankSprite();
        this.images.enemy_boss = this.createEnemyBossSprite();
        this.images.item_xp = this.createXpSprite();
        this.images.item_health = this.createHealthSprite();
        this.images.item_coin = this.createCoinSprite();
        this.images.item_magnet = this.createMagnetSprite();
        this.images.item_nuke = this.createNukeSprite();
        this.images.item_chest = this.createChestSprite();
        
        // Projectiles
        this.images.projectile = this.createProjectileSprite();
        this.images.projectile_piercing = this.createPiercingProjectileSprite();
        this.images.projectile_taiji = this.createTaijiSprite();
        this.images.projectile_bagua = this.createBaguaSprite();
        this.images.projectile_sword = this.createSwordSprite();
        this.images.projectile_divine = this.createDivineSwordSprite();
        this.images.projectile_snake = this.createSnakeSprite();
        this.images.projectile_snake_giant = this.createGiantSnakeSprite();
        this.images.projectile_spirit_sword = this.createSpiritSwordSprite();
        this.images.projectile_dragon = this.createDragonSprite();
        this.images.projectile_stone = this.createStoneSprite();
        this.images.projectile_staff = this.createStaffSprite();
        this.images.projectile_roar = this.createRoarSprite();
        this.images.projectile_claw = this.createClawSprite();
        this.images.projectile_seven_star = this.createSevenStarSprite();
        this.images.projectile_needle = this.createNeedleSprite();
        this.images.projectile_flower = this.createFlowerNeedleSprite();
        this.images.projectile_note = this.createNoteSprite();
        this.images.projectile_sound_wave = this.createSoundWaveSprite();
        this.images.projectile_flying_dagger = this.createFlyingDaggerSprite();
        this.images.projectile_desolate_flash = this.createDesolateFlashSprite();
        this.images.projectile_huashan = this.createHuashanSprite();
        this.images.projectile_evil_warding = this.createEvilWardingSprite();
        this.images.projectile_blood_blade = this.createBloodBladeSprite();
        this.images.projectile_yang_spear = this.createYangSpearSprite();
        this.images.projectile_yang_spear_evolved = this.createYangSpearEvolvedSprite();
        this.images.projectile_golden_wheel = this.createGoldenWheelSprite();
        this.images.projectile_golden_wheel_evolved = this.createGoldenWheelEvolvedSprite();
        this.images.enemy_bullet = this.createEnemyBulletSprite();
        
        this.images.ground = this.createGroundTile();
    },

    createBloodBladeSprite() {
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
            <path d="M10,32 Q32,10 54,32 Q32,20 10,32 Z" fill="#c0392b" stroke="#e74c3c" stroke-width="2" />
            <path d="M12,32 Q32,22 52,32" fill="none" stroke="#e74c3c" stroke-width="1" />
        </svg>
        `;
        return this.svgToImage(svg, 64, 64);
    },

    createYangSpearSprite() {
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="16" viewBox="0 0 48 16">
            <rect x="0" y="7" width="36" height="2" fill="#7f8c8d" />
            <path d="M36,8 L48,8 L44,4 L36,8 Z" fill="#bdc3c7" /> <!-- Tip top -->
            <path d="M36,8 L48,8 L44,12 L36,8 Z" fill="#95a5a6" /> <!-- Tip bottom -->
            <circle cx="36" cy="8" r="3" fill="#c0392b" /> <!-- Tassel -->
        </svg>
        `;
        return this.svgToImage(svg, 48, 16);
    },

    createYangSpearEvolvedSprite() {
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="20" viewBox="0 0 64 20">
            <rect x="0" y="8" width="48" height="4" fill="#f1c40f" stroke="#e67e22" />
            <path d="M48,10 L64,10 L56,2 L48,10 Z" fill="#f39c12" />
            <path d="M48,10 L64,10 L56,18 L48,10 Z" fill="#d35400" />
            <circle cx="48" cy="10" r="5" fill="#e74c3c" />
            <path d="M40,10 Q30,0 20,10" stroke="#e74c3c" stroke-width="2" fill="none" />
        </svg>
        `;
        return this.svgToImage(svg, 64, 20);
    },

    createGoldenWheelSprite() {
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="16" fill="none" stroke="#f1c40f" stroke-width="4" />
            <path d="M24 8 L24 0 M24 40 L24 48 M8 24 L0 24 M40 24 L48 24" stroke="#f1c40f" stroke-width="4" />
            <path d="M12 12 L6 6 M36 36 L42 42 M12 36 L6 42 M36 12 L42 6" stroke="#f1c40f" stroke-width="4" />
            <circle cx="24" cy="24" r="8" fill="#f39c12" />
        </svg>
        `;
        return this.svgToImage(svg, 48, 48);
    },

    createGoldenWheelEvolvedSprite() {
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
            <defs>
                <radialGradient id="goldGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style="stop-color:#f1c40f;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#d35400;stop-opacity:1" />
                </radialGradient>
            </defs>
            <circle cx="32" cy="32" r="20" fill="none" stroke="url(#goldGrad)" stroke-width="6" />
            <path d="M32 6 L32 0 M32 58 L32 64 M6 32 L0 32 M58 32 L64 32" stroke="#e67e22" stroke-width="6" />
            <path d="M14 14 L4 4 M50 50 L60 60 M14 50 L4 60 M50 14 L60 4" stroke="#e67e22" stroke-width="6" />
            <circle cx="32" cy="32" r="12" fill="url(#goldGrad)" />
            <circle cx="32" cy="32" r="4" fill="#c0392b" />
        </svg>
        `;
        return this.svgToImage(svg, 64, 64);
    },

    createEnemyBulletSprite() {
        const canvas = this.createCanvas(16, 16);
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(8, 8, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#e74c3c';
        ctx.fill();
        ctx.strokeStyle = '#c0392b';
        ctx.lineWidth = 1;
        ctx.stroke();
        return canvas;
    },

    createCanvas(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    },

    svgToImage(svgString, width, height) {
        const img = new Image();
        img.width = width;
        img.height = height;
        const blob = new Blob([svgString], {type: 'image/svg+xml'});
        const url = URL.createObjectURL(blob);
        img.src = url;
        return img;
    },

    createPlayerSprite() {
        // New animated player sprite
        const svg = `
        <svg width="64" height="64" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="none"> 
           <style> 
             @keyframes breathe { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1px); } } 
             @keyframes flutter-hair { 0%, 100% { transform: rotate(0deg) skewX(0deg); } 25% { transform: rotate(5deg) skewX(-5deg); } 75% { transform: rotate(-2deg) skewX(2deg); } } 
             @keyframes flutter-sash { 0%, 100% { transform: rotate(0deg) scaleX(1); } 50% { transform: rotate(-5deg) scaleX(0.95); } } 
             @keyframes arm-sway { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(0.5px); } } 
             .anim-body { animation: breathe 2s ease-in-out infinite; } 
             .anim-ribbon-top { transform-origin: 16px 6px; animation: flutter-hair 1.5s ease-in-out infinite; } 
             .anim-sash { transform-origin: 16px 19px; animation: flutter-sash 2s ease-in-out infinite reverse; } 
             .anim-arm-front { animation: arm-sway 2s ease-in-out infinite 0.5s; } 
             .anim-arm-back { animation: arm-sway 2s ease-in-out infinite; } 
           </style> 
           <g transform="translate(0, 1)"> 
             <g class="anim-ribbon-top"> 
               <path d="M18 6 H22 V7 H23 V8 H22 V9 H21 V8 H19 V7 H18 Z" fill="#D32F2F"/>  
             </g> 
             <g class="anim-body"> 
               <rect x="11" y="21" width="4" height="6" fill="#212121"/> 
               <rect x="10" y="26" width="3" height="2" fill="#111"/> 
               <g class="anim-arm-back"> 
                 <rect x="9" y="14" width="3" height="4" fill="#212121"/> 
                 <rect x="8" y="16" width="2" height="2" fill="#FFCCB0"/> 
               </g> 
               <rect x="12" y="13" width="8" height="9" fill="#263238"/> 
               <path d="M14 13 L16 16 L18 13" stroke="#D32F2F" stroke-width="1"/> 
               <rect x="15" y="14" width="2" height="2" fill="#FFCCB0"/> 
               <rect x="12" y="19" width="8" height="2" fill="#D32F2F"/> 
               <rect x="13" y="19" width="2" height="2" fill="#B71C1C"/> 
               <g class="anim-sash"> 
                 <path d="M15 20 H18 V22 H19 V25 H18 V27 H16 V24 H15 Z" fill="#D32F2F"/> 
               </g> 
               <path d="M17 21 H21 V24 H22 V27 H19 V24 H17 Z" fill="#111"/>  
               <rect x="20" y="27" width="4" height="2" fill="#000"/> 
               <g class="anim-arm-front"> 
                 <path d="M19 14 H23 V16 H24 V17 H22 V16 H19 Z" fill="#263238"/> 
                 <rect x="24" y="16" width="2" height="2" fill="#FFCCB0"/> 
               </g> 
               <rect x="13" y="8" width="6" height="5" fill="#FFCCB0"/> 
               <path d="M13 7 H19 V8 H20 V11 H19 V12 H18 V13 H14 V12 H13 V11 H12 V8 H13 Z" fill="#1A1A1A"/> 
               <rect x="13" y="7" width="6" height="2" fill="#1A1A1A"/> 
               <rect x="14" y="5" width="4" height="2" fill="#1A1A1A"/> 
               <rect x="15" y="6" width="2" height="1" fill="#D32F2F"/> 
               <rect x="17" y="9" width="1" height="1" fill="#000" opacity="0.6"/> 
             </g> 
           </g> 
         </svg>
        `;
        return this.svgToImage(svg, 64, 64);
    },

    createEnemyBasicSprite() {
        // Jin Soldier
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
            <defs>
                <radialGradient id="metalGrad" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" style="stop-color:#bdc3c7;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#7f8c8d;stop-opacity:1" />
                </radialGradient>
            </defs>
            <g>
                <!-- Armor Body -->
                <circle cx="24" cy="30" r="12" fill="#7f8c8d" stroke="#2c3e50" stroke-width="1"/>
                <path d="M16 30 Q 24 38 32 30" stroke="#2c3e50" stroke-width="1" fill="none"/>
                <!-- Head -->
                <circle cx="24" cy="18" r="8" fill="#eebb99"/>
                <!-- Helmet -->
                <path d="M15 16 Q 24 8 33 16 L 33 18 L 15 18 Z" fill="url(#metalGrad)"/>
                <circle cx="24" cy="10" r="3" fill="#c0392b"/> <!-- Red Tassle -->
                <!-- Spear -->
                <line x1="34" y1="35" x2="44" y2="15" stroke="#8e44ad" stroke-width="2"/>
                <path d="M44 15 L 42 11 L 46 11 Z" fill="#bdc3c7"/>
            </g>
        </svg>
        `;
        return this.svgToImage(svg, 48, 48);
    },

    createEnemyFastSprite() {
        // Assassin
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
            <g>
                <!-- Cloak -->
                <path d="M16 16 Q 24 10 32 16 L 36 40 L 12 40 Z" fill="#2c3e50"/>
                <!-- Head -->
                <circle cx="24" cy="14" r="7" fill="#2c3e50"/>
                <rect x="20" y="12" width="8" height="3" fill="#f1c40f"/> <!-- Eyes -->
                <!-- Scarf -->
                <path d="M18 18 Q 24 22 30 18" stroke="#c0392b" stroke-width="2" fill="none"/>
                <!-- Daggers -->
                <path d="M34 26 L 42 22" stroke="#bdc3c7" stroke-width="2"/>
                <path d="M14 26 L 6 22" stroke="#bdc3c7" stroke-width="2"/>
            </g>
        </svg>
        `;
        return this.svgToImage(svg, 48, 48);
    },

    createEnemyTankSprite() {
        // Shaolin Monk
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
            <g>
                <!-- Robe -->
                <circle cx="32" cy="34" r="20" fill="#d35400" stroke="#a04000" stroke-width="2"/>
                <!-- Head -->
                <circle cx="32" cy="20" r="10" fill="#eebb99"/>
                <!-- Dots on head -->
                <circle cx="30" cy="15" r="1" fill="#bdc3c7"/>
                <circle cx="32" cy="14" r="1" fill="#bdc3c7"/>
                <circle cx="34" cy="15" r="1" fill="#bdc3c7"/>
                <!-- Beads -->
                <circle cx="32" cy="34" r="22" stroke="#8e44ad" stroke-width="3" stroke-dasharray="4 4" fill="none"/>
            </g>
        </svg>
        `;
        return this.svgToImage(svg, 64, 64);
    },
    
    createEnemyBossSprite() {
        // Golden Wheel King
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
            <defs>
                <radialGradient id="goldGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style="stop-color:#f1c40f;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#d35400;stop-opacity:1" />
                </radialGradient>
            </defs>
            <g>
                <!-- Robe -->
                <path d="M40 100 L 64 30 L 88 100 Z" fill="#f39c12" stroke="#d35400" stroke-width="2"/>
                <!-- Cape -->
                <path d="M40 40 Q 64 20 88 40 L 100 90 L 28 90 Z" fill="#c0392b" opacity="0.8"/>
                <!-- Head -->
                <circle cx="64" cy="30" r="14" fill="#eebb99"/>
                <path d="M50 24 L 78 24 L 64 6 Z" fill="#c0392b"/> <!-- Hat -->
                <!-- Beard -->
                <path d="M60 40 L 64 50 L 68 40" fill="#34495e"/>
                <!-- Wheels -->
                <g transform="translate(94, 60)">
                    <circle r="20" fill="none" stroke="url(#goldGrad)" stroke-width="4"/>
                    <line x1="0" y1="-20" x2="0" y2="20" stroke="#f1c40f" stroke-width="2"/>
                    <line x1="-20" y1="0" x2="20" y2="0" stroke="#f1c40f" stroke-width="2"/>
                </g>
                <g transform="translate(34, 60)">
                    <circle r="15" fill="none" stroke="#bdc3c7" stroke-width="3"/>
                </g>
            </g>
        </svg>
        `;
        return this.svgToImage(svg, 128, 128);
    },

    createXpSprite() {
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
            <rect x="6" y="4" width="20" height="24" fill="#2980b9" stroke="#ecf0f1" stroke-width="1"/>
            <rect x="8" y="4" width="4" height="24" fill="#ecf0f1"/>
            <text x="20" y="20" font-size="12" fill="white" text-anchor="middle">秘</text>
        </svg>
        `;
        return this.svgToImage(svg, 32, 32);
    },
    
    createHealthSprite() {
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
            <defs>
                <linearGradient id="gourdGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#e74c3c;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#c0392b;stop-opacity:1" />
                </linearGradient>
            </defs>
            <circle cx="16" cy="22" r="8" fill="url(#gourdGrad)"/>
            <circle cx="16" cy="12" r="5" fill="url(#gourdGrad)"/>
            <rect x="14" y="5" width="4" height="4" fill="#8e44ad"/>
            <circle cx="14" cy="20" r="2" fill="white" opacity="0.4"/>
        </svg>
        `;
        return this.svgToImage(svg, 32, 32);
    },
    
    createCoinSprite() {
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
            <ellipse cx="16" cy="20" rx="12" ry="6" fill="#bdc3c7"/>
            <ellipse cx="16" cy="18" rx="8" ry="4" fill="#ecf0f1"/>
            <text x="16" y="22" font-size="8" fill="#7f8c8d" text-anchor="middle" font-weight="bold">银</text>
        </svg>
        `;
        return this.svgToImage(svg, 32, 32);
    },

    createMagnetSprite() {
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
            <rect x="8" y="6" width="16" height="20" fill="#27ae60"/>
            <rect x="10" y="8" width="12" height="16" fill="none" stroke="#2ecc71" stroke-width="2"/>
            <line x1="16" y1="6" x2="16" y2="2" stroke="#c0392b" stroke-width="1"/>
        </svg>
        `;
        return this.svgToImage(svg, 32, 32);
    },

    createNukeSprite() {
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
            <circle cx="16" cy="18" r="10" fill="#2c3e50"/>
            <path d="M16 10 Q 16 6 22 4" stroke="#e67e22" stroke-width="2" fill="none"/>
            <circle cx="22" cy="4" r="2" fill="#f1c40f"/>
        </svg>
        `;
        return this.svgToImage(svg, 32, 32);
    },

    createChestSprite() {
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
            <rect x="4" y="10" width="24" height="16" fill="#8e44ad" stroke="#f1c40f" stroke-width="2"/>
            <rect x="2" y="8" width="28" height="6" fill="#9b59b6" stroke="#f1c40f" stroke-width="1"/>
            <circle cx="16" cy="11" r="3" fill="#f1c40f"/>
        </svg>
        `;
        return this.svgToImage(svg, 32, 32);
    },

    createProjectileSprite() {
        const svg = `
        <svg width="32" height="16" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="projGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:rgba(52, 152, 219, 0)" />
              <stop offset="100%" style="stop-color:#3498db" />
            </linearGradient>
          </defs>
          <ellipse cx="16" cy="8" rx="14" ry="6" fill="url(#projGrad)" opacity="0.4"/>
          <path d="M4,8 L28,8" stroke="#ecf0f1" stroke-width="2" stroke-linecap="round"/>
        </svg>
        `;
        return this.svgToImage(svg, 32, 16);
    },

    createPiercingProjectileSprite() {
        const svg = `
        <svg width="32" height="8" xmlns="http://www.w3.org/2000/svg">
          <path d="M2,4 L30,4" stroke="#f1c40f" stroke-width="2" stroke-linecap="round"/>
          <rect x="28" y="3" width="2" height="2" fill="white"/>
          <path d="M10,4 L20,4" stroke="white" stroke-width="1" opacity="0.8"/>
        </svg>
        `;
        return this.svgToImage(svg, 32, 8);
    },
    
    createTaijiSprite() {
        const svg = `
        <svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <g filter="url(#glow)">
            <path d="M24,44 A20,20 0 0,1 24,4 A10,10 0 0,1 24,24 A10,10 0 0,0 24,44" fill="#ecf0f1"/>
            <path d="M24,4 A20,20 0 0,0 24,44 A10,10 0 0,0 24,24 A10,10 0 0,1 24,4" fill="#2c3e50"/>
            <circle cx="24" cy="14" r="3" fill="#2c3e50"/>
            <circle cx="24" cy="34" r="3" fill="#ecf0f1"/>
          </g>
        </svg>
        `;
        return this.svgToImage(svg, 48, 48);
    },

    createBaguaSprite() {
        const svg = `
        <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="blueGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <g transform="translate(64,64)" stroke="#3498db" stroke-width="2" fill="none" filter="url(#blueGlow)">
            <polygon points="50,0 35,35 0,50 -35,35 -50,0 -35,-35 0,-50 35,-35" />
            <circle r="40" stroke-dasharray="4 4"/>
          </g>
          <circle cx="64" cy="64" r="15" fill="rgba(255,255,255,0.8)" />
        </svg>
        `;
        return this.svgToImage(svg, 128, 128);
    },

    createDivineSwordSprite() {
        const svg = `
        <svg width="64" height="16" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="divineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#e74c3c" />
              <stop offset="100%" style="stop-color:#c0392b" />
            </linearGradient>
            <filter id="redGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <path d="M0,8 L50,2 L64,8 L50,14 Z" fill="url(#divineGrad)" filter="url(#redGlow)"/>
          <path d="M5,8 L45,6 L55,8 L45,10 Z" fill="white" opacity="0.8"/>
        </svg>
        `;
        return this.svgToImage(svg, 64, 16);
    },

    createSwordSprite() {
        const svg = `
        <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="swordGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#ecf0f1" />
                <stop offset="100%" style="stop-color:#95a5a6" />
            </linearGradient>
          </defs>
          <g transform="rotate(45, 16, 16)">
            <path d="M16,2 L19,20 L16,24 L13,20 Z" fill="url(#swordGrad)"/>
            <rect x="12" y="24" width="8" height="2" fill="#c0392b"/>
            <rect x="15" y="26" width="2" height="4" fill="#2c3e50"/>
          </g>
        </svg>
        `;
        return this.svgToImage(svg, 32, 32);
    },

    createSnakeSprite() {
        const svg = `
        <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
          <g transform="rotate(45, 16, 16)">
            <path d="M16,28 C22,22 10,16 16,4" stroke="#f1c40f" stroke-width="4" fill="none" stroke-linecap="round"/>
            <rect x="12" y="26" width="8" height="3" fill="#e67e22"/>
            <rect x="15" y="29" width="2" height="3" fill="#e67e22"/>
          </g>
        </svg>
        `;
        return this.svgToImage(svg, 32, 32);
    },

    createGiantSnakeSprite() {
        const svg = `
        <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="goldGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <g transform="rotate(45, 32, 32)" filter="url(#goldGlow)">
            <path d="M32,52 C47,42 17,22 32,12" stroke="#f1c40f" stroke-width="8" fill="none" stroke-linecap="round"/>
            <circle cx="29" cy="14" r="2" fill="#c0392b"/>
            <circle cx="35" cy="14" r="2" fill="#c0392b"/>
          </g>
        </svg>
        `;
        return this.svgToImage(svg, 64, 64);
    },

    createSpiritSwordSprite() {
        const svg = `
        <svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="cyanGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <g transform="rotate(45, 24, 24)" filter="url(#cyanGlow)">
            <path d="M24,4 L30,34 L24,40 L18,34 Z" fill="#81ecec"/>
            <rect x="23" y="9" width="2" height="25" fill="white"/>
          </g>
        </svg>
        `;
        return this.svgToImage(svg, 48, 48);
    },

    createDragonSprite() {
        const svg = `
        <svg width="64" height="32" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="fireGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <g filter="url(#fireGlow)">
            <path d="M60,10 L64,16 L60,22 L48,20 L40,28 L30,16 L40,4 L48,12 Z" fill="#f1c40f"/>
            <circle cx="52" cy="14" r="2" fill="red"/>
            <path d="M30,16 Q20,10 10,16 T-10,16" stroke="rgba(243, 156, 18, 0.6)" stroke-width="4" fill="none"/>
          </g>
        </svg>
        `;
        return this.svgToImage(svg, 64, 32);
    },

    createStoneSprite() {
        const svg = `
        <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="stoneGrad" cx="30%" cy="30%" r="70%">
                <stop offset="0%" style="stop-color:#ecf0f1" />
                <stop offset="100%" style="stop-color:#7f8c8d" />
            </radialGradient>
          </defs>
          <circle cx="8" cy="8" r="6" fill="url(#stoneGrad)"/>
        </svg>
        `;
        return this.svgToImage(svg, 16, 16);
    },

    createStaffSprite() {
        const svg = `
        <svg width="64" height="16" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bambooGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#2ecc71;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#27ae60;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#1e8449;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect x="0" y="4" width="64" height="8" rx="2" fill="url(#bambooGrad)" stroke="#1e8449" stroke-width="1"/>
          <rect x="12" y="3" width="4" height="10" rx="1" fill="#a3e4d7" opacity="0.6"/>
          <rect x="30" y="3" width="4" height="10" rx="1" fill="#a3e4d7" opacity="0.6"/>
          <rect x="48" y="3" width="4" height="10" rx="1" fill="#a3e4d7" opacity="0.6"/>
        </svg>
        `;
        return this.svgToImage(svg, 64, 16);
    },

    createRoarSprite() {
        const svg = `
        <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="roarGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" style="stop-color:#f1c40f;stop-opacity:0" />
              <stop offset="40%" style="stop-color:#f1c40f;stop-opacity:0.2" />
              <stop offset="80%" style="stop-color:#f39c12;stop-opacity:0.6" />
              <stop offset="100%" style="stop-color:#d35400;stop-opacity:0.8" />
            </radialGradient>
          </defs>
          <circle cx="64" cy="64" r="60" fill="url(#roarGrad)"/>
          <circle cx="64" cy="64" r="50" stroke="#f1c40f" stroke-width="2" fill="none" opacity="0.5"/>
          <circle cx="64" cy="64" r="40" stroke="#f39c12" stroke-width="3" fill="none" opacity="0.7"/>
          <circle cx="64" cy="64" r="30" stroke="#d35400" stroke-width="4" fill="none" opacity="0.9"/>
        </svg>
        `;
        return this.svgToImage(svg, 128, 128);
    },

    createClawSprite() {
        const svg = `
        <svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="clawGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#e74c3c;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#c0392b;stop-opacity:1" />
            </linearGradient>
          </defs>
          <path d="M10,10 Q20,20 30,40" stroke="url(#clawGrad)" stroke-width="4" fill="none" stroke-linecap="round"/>
          <path d="M24,5 Q34,20 44,35" stroke="url(#clawGrad)" stroke-width="4" fill="none" stroke-linecap="round"/>
          <path d="M38,10 Q43,25 48,40" stroke="url(#clawGrad)" stroke-width="4" fill="none" stroke-linecap="round"/>
        </svg>
        `;
        return this.svgToImage(svg, 48, 48);
    },

    createSevenStarSprite() {
        const svg = `
        <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="sevenStarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#3498db" />
                <stop offset="100%" style="stop-color:#2980b9" />
            </linearGradient>
            <filter id="starGlow">
              <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <g transform="rotate(45, 16, 16)" filter="url(#starGlow)">
            <path d="M14,0 L18,0 L18,24 L14,24 Z" fill="url(#sevenStarGrad)"/>
            <path d="M14,0 L16,-4 L18,0" fill="#3498db"/>
            <circle cx="16" cy="4" r="1.5" fill="white"/>
            <circle cx="16" cy="7" r="1.5" fill="white"/>
            <circle cx="16" cy="10" r="1.5" fill="white"/>
            <circle cx="16" cy="13" r="1.5" fill="white"/>
            <circle cx="16" cy="16" r="1.5" fill="white"/>
            <circle cx="16" cy="19" r="1.5" fill="white"/>
            <circle cx="16" cy="22" r="1.5" fill="white"/>
            <rect x="12" y="24" width="8" height="2" fill="#f1c40f"/>
            <rect x="14" y="26" width="4" height="6" fill="#2c3e50"/>
          </g>
        </svg>
        `;
        return this.svgToImage(svg, 32, 32);
    },

    createNeedleSprite() {
        const svg = `
        <svg width="16" height="4" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="needleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#bdc3c7" />
                <stop offset="100%" style="stop-color:#ecf0f1" />
            </linearGradient>
            <filter id="needleGlow">
              <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <rect x="0" y="1" width="16" height="2" fill="url(#needleGrad)" filter="url(#needleGlow)"/>
          <circle cx="15" cy="2" r="1" fill="#ffffff"/>
        </svg>
        `;
        return this.svgToImage(svg, 16, 4);
    },

    createFlowerNeedleSprite() {
        const svg = `
        <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="flowerGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" style="stop-color:#e84393;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#8e44ad;stop-opacity:1" />
            </radialGradient>
            <filter id="flowerGlow">
              <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <g transform="translate(16,16)" filter="url(#flowerGlow)">
            <ellipse cx="0" cy="0" rx="10" ry="2" fill="url(#flowerGrad)" transform="rotate(0)"/>
            <ellipse cx="0" cy="0" rx="10" ry="2" fill="url(#flowerGrad)" transform="rotate(45)"/>
            <ellipse cx="0" cy="0" rx="10" ry="2" fill="url(#flowerGrad)" transform="rotate(90)"/>
            <ellipse cx="0" cy="0" rx="10" ry="2" fill="url(#flowerGrad)" transform="rotate(135)"/>
            <circle cx="0" cy="0" r="2" fill="#f1c40f"/>
          </g>
        </svg>
        `;
        return this.svgToImage(svg, 32, 32);
    },

    createNoteSprite() {
        const svg = `
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="noteGlow">
              <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <g filter="url(#noteGlow)">
             <path d="M8,18 L8,6 L16,6 L16,16" stroke="#2ecc71" stroke-width="2" fill="none"/>
             <circle cx="6" cy="18" r="3" fill="#2ecc71"/>
             <circle cx="14" cy="16" r="3" fill="#2ecc71"/>
          </g>
        </svg>
        `;
        return this.svgToImage(svg, 24, 24);
    },

    createSoundWaveSprite() {
        const svg = `
        <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="10" stroke="#2ecc71" stroke-width="2" fill="none" opacity="0.8"/>
          <circle cx="32" cy="32" r="20" stroke="#2ecc71" stroke-width="2" fill="none" opacity="0.6"/>
          <circle cx="32" cy="32" r="30" stroke="#2ecc71" stroke-width="2" fill="none" opacity="0.4"/>
        </svg>
        `;
        return this.svgToImage(svg, 64, 64);
    },

    createFlyingDaggerSprite() {
        const svg = `
        <svg width="32" height="12" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="daggerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#bdc3c7" />
                <stop offset="50%" style="stop-color:#ffffff" />
                <stop offset="100%" style="stop-color:#bdc3c7" />
            </linearGradient>
            <filter id="daggerGlow">
              <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <g filter="url(#daggerGlow)">
            <path d="M2,6 L26,2 L30,6 L26,10 Z" fill="url(#daggerGrad)"/>
            <circle cx="28" cy="6" r="1.5" fill="#e74c3c"/>
            <rect x="0" y="5" width="6" height="2" fill="#c0392b"/>
          </g>
        </svg>
        `;
        return this.svgToImage(svg, 32, 12);
    },

    createDesolateFlashSprite() {
        const svg = `
        <svg width="64" height="16" xmlns="http://www.w3.org/2000/svg">
          <defs>
             <filter id="flashGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <g filter="url(#flashGlow)">
            <path d="M0,8 L60,2 L64,8 L60,14 Z" fill="#ecf0f1"/>
            <path d="M10,8 L50,6 L55,8 L50,10 Z" fill="#f39c12"/>
          </g>
        </svg>
        `;
        return this.svgToImage(svg, 64, 16);
    },

    createHuashanSprite() {
        const svg = `
        <svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="huashanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#ecf0f1" />
                <stop offset="100%" style="stop-color:#3498db" />
            </linearGradient>
            <filter id="huashanGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <g transform="rotate(45, 24, 24)" filter="url(#huashanGlow)">
             <path d="M22,4 L26,4 L26,36 L22,36 Z" fill="url(#huashanGrad)"/>
             <path d="M24,0 L28,6 L20,6 Z" fill="#ecf0f1"/>
             <rect x="18" y="36" width="12" height="4" fill="#2980b9"/>
             <rect x="22" y="40" width="4" height="8" fill="#2c3e50"/>
          </g>
        </svg>
        `;
        return this.svgToImage(svg, 48, 48);
    },

    createEvilWardingSprite() {
        const svg = `
        <svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="evilGlow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <g transform="rotate(45, 24, 24)" filter="url(#evilGlow)">
             <path d="M23,2 L25,2 L25,40 L23,40 Z" fill="#8e44ad"/>
             <path d="M24,0 L26,4 L22,4 Z" fill="#9b59b6"/>
             <circle cx="24" cy="40" r="3" fill="#8e44ad"/>
          </g>
        </svg>
        `;
        return this.svgToImage(svg, 48, 48);
    },

    createGroundTile() {
        // High Quality Ink Wash Texture (SVG)
        const svg = `
        <svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="noiseFilter">
              <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch"/>
            </filter>
            <pattern id="inkPattern" patternUnits="userSpaceOnUse" width="128" height="128">
              <rect width="128" height="128" fill="#fdfbf0"/>
              <rect width="128" height="128" filter="url(#noiseFilter)" opacity="0.1"/>
              <!-- Ink Splashes -->
              <circle cx="20" cy="20" r="15" fill="#2c3e50" opacity="0.05"/>
              <circle cx="80" cy="60" r="20" fill="#2c3e50" opacity="0.05"/>
              <path d="M40,90 Q60,80 50,110" stroke="#27ae60" stroke-width="2" opacity="0.2" fill="none"/>
            </pattern>
          </defs>
          <rect width="256" height="256" fill="url(#inkPattern)"/>
        </svg>
        `;
        return this.svgToImage(svg, 256, 256);
    }
};
