// Music Player
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');

musicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play();
        musicToggle.classList.add('playing');
    } else {
        bgMusic.pause();
        musicToggle.classList.remove('playing');
    }
});

// Scroll to Letter Function
function scrollToLetter() {
    const letterSection = document.querySelector('.letter-section');
    letterSection.scrollIntoView({ behavior: 'smooth' });
}

// Message Card Animation
function showMessage(element) {
    element.style.animation = 'none';
    setTimeout(() => {
        element.style.animation = 'messageClick 0.6s ease';
    }, 10);
}

// Add CSS animation for message cards
const style = document.createElement('style');
style.textContent = `
    @keyframes messageClick {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Floating Hearts Canvas
const canvas = document.getElementById('heartsCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let hearts = [];

class Heart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 20 + 10;
        this.speedY = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 2;
        this.opacity = 1;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.05;
    }

    update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.opacity -= 0.01;
        this.rotation += this.rotationSpeed;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        drawHeart(0, 0, this.size);
        ctx.restore();
    }
}

function drawHeart(cx, cy, size) {
    ctx.fillStyle = '#f093fb';
    ctx.beginPath();
    ctx.moveTo(cx, cy + size);
    ctx.bezierCurveTo(
        cx - size, cy + size,
        cx - size * 1.5, cy + size * 0.5,
        cx, cy - size * 0.5
    );
    ctx.bezierCurveTo(
        cx + size * 1.5, cy + size * 0.5,
        cx + size, cy + size,
        cx, cy + size
    );
    ctx.fill();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = hearts.length - 1; i >= 0; i--) {
        hearts[i].update();
        hearts[i].draw();
        
        if (hearts[i].opacity <= 0) {
            hearts.splice(i, 1);
        }
    }
    
    requestAnimationFrame(animate);
}

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    for (let i = 0; i < 5; i++) {
        hearts.push(new Heart(x, y));
    }
});

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    for (let i = 0; i < 5; i++) {
        hearts.push(new Heart(x, y));
    }
});

animate();

// Create animated stars in background
function createStars() {
    const starsContainer = document.querySelector('.stars');
    const starCount = 50;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        starsContainer.appendChild(star);
    }
}

createStars();

// Add smooth scroll behavior for all internal links
document.addEventListener('DOMContentLoaded', () => {
    // Auto-play music on first interaction
    document.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play().catch(e => console.log('Autoplay prevented'));
        }
    }, { once: true });
});