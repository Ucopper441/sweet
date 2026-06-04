// ========================================
// SPOTIFY SETUP - IMPORTANT!
// ========================================
// 1. Go to https://developer.spotify.com/dashboard
// 2. Create an app and get your Client ID
// 3. Replace 'YOUR_CLIENT_ID_HERE' with your actual Client ID
// 4. In the Redirect URI field in Spotify Dashboard, add your website URL
// 5. Replace 'YOUR_PLAYLIST_URI_HERE' with your playlist URI
//    (Right-click playlist in Spotify app > Share > Copy Spotify URI)
// ========================================

const CLIENT_ID = 'YOUR_CLIENT_ID_HERE'; // Replace with your Client ID
const REDIRECT_URI = 'http://localhost:3000'; // Replace with your website URL
const SCOPES = 'streaming user-read-email user-read-private';
const PLAYLIST_URI = 'spotify:playlist:YOUR_PLAYLIST_URI_HERE'; // Replace with your playlist URI

let player;
let deviceId;
let isPlaying = false;

// Get access token from URL
function getAccessToken() {
  const params = new URLSearchParams(window.location.search);
  return params.get('access_token');
}

// Redirect to Spotify for authentication
function spotifyLogin() {
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;
  window.location.href = authUrl;
}

// Initialize Spotify Player
function initSpotifyPlayer() {
  const token = getAccessToken();
  
  if (!token) {
    console.log('No Spotify token found. Click music button to login.');
    document.getElementById('musicToggle').onclick = () => spotifyLogin();
    return;
  }

  window.onSpotifyWebPlaybackSDKReady = () => {
    player = new Spotify.Player({
      name: 'Sweet Website Player',
      getOAuthToken: cb => { cb(token); },
      volume: 0.5
    });

    // Playback status updates
    player.addListener('player_state_changed', state => {
      if (!state) return;
      isPlaying = !state.paused;
      updatePlayerButton();
    });

    // Ready
    player.addListener('ready', ({ device_id }) => {
      console.log('Spotify player ready with Device ID', device_id);
      deviceId = device_id;
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });

    player.connect();
  };
}

// Toggle music play/pause
function toggleMusic() {
  const token = getAccessToken();
  
  if (!token) {
    spotifyLogin();
    return;
  }

  if (!player) {
    console.log('Player not initialized yet');
    return;
  }

  player.togglePlay().then(() => {
    console.log('Toggled playback!');
  }).catch(err => {
    console.error('Error toggling playback:', err);
  });
}

// Update button appearance
function updatePlayerButton() {
  const btn = document.getElementById('musicToggle');
  if (isPlaying) {
    btn.classList.add('playing');
  } else {
    btn.classList.remove('playing');
  }
}

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

// Music player button
const musicToggle = document.getElementById('musicToggle');
musicToggle.addEventListener('click', toggleMusic);

// Initialize Spotify on page load
window.addEventListener('load', () => {
  initSpotifyPlayer();
});