import { Game } from './Game.js';
import { Assets } from './Assets.js';

window.addEventListener('load', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // Initialize Assets
    Assets.init();

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const game = new Game(canvas.width, canvas.height);
    
    let lastTime = 0;
    
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        
        game.update(deltaTime);
        game.draw(ctx);
        
        requestAnimationFrame(animate);
    }
    
    animate(0);
    
    // Handle resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        game.width = canvas.width;
        game.height = canvas.height;
    });
    
    // Restart button
    document.getElementById('restart-btn').addEventListener('click', () => {
        location.reload();
    });
});
