// Three.js loaded via CDN (global THREE object)

// ===========================================
//  1. THREE.JS — MORPHING GALAXY PARTICLES
// ===========================================
const canvas = document.getElementById('galaxy-canvas');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x06060f, 0.0015);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.z = 200;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const N = 15000;

// Shape generators
function makeGalaxy(arr) {
    for (let i = 0; i < N; i++) {
        const i3 = i * 3;
        const arm = Math.floor(Math.random() * 5);
        const armAngle = (arm / 5) * Math.PI * 2;
        const dist = 5 + Math.random() * 180;
        const spiral = dist * 0.04;
        const angle = armAngle + spiral + (Math.random() - 0.5) * 0.5;
        const scatter = (1 - dist / 200) * 18 + 2;
        arr[i3] = Math.cos(angle) * dist + (Math.random() - 0.5) * scatter;
        arr[i3 + 1] = (Math.random() - 0.5) * scatter * 0.4;
        arr[i3 + 2] = Math.sin(angle) * dist + (Math.random() - 0.5) * scatter;
    }
}
function makeVortex(arr) {
    for (let i = 0; i < N; i++) {
        const i3 = i * 3;
        const a = i * 0.12;
        const r = 10 + (i / N) * 120;
        arr[i3] = Math.cos(a) * r;
        arr[i3 + 1] = (Math.random() - 0.5) * 12;
        arr[i3 + 2] = Math.sin(a) * r;
    }
}
function makeSphere(arr) {
    for (let i = 0; i < N; i++) {
        const i3 = i * 3;
        const r = 60;
        const phi = Math.acos(-1 + (2 * i) / N);
        const theta = Math.sqrt(N * Math.PI) * phi;
        arr[i3] = r * Math.cos(theta) * Math.sin(phi) * (1 + Math.random() * 0.08);
        arr[i3 + 1] = r * Math.sin(theta) * Math.sin(phi) * (1 + Math.random() * 0.08);
        arr[i3 + 2] = r * Math.cos(phi) * (1 + Math.random() * 0.08);
    }
}
function makeHelix(arr) {
    for (let i = 0; i < N; i++) {
        const i3 = i * 3;
        const t = (i / N) * 28 * Math.PI;
        const off = (i % 2 === 0) ? 0 : Math.PI;
        arr[i3] = 28 * Math.cos(t + off);
        arr[i3 + 1] = (i / N) * 250 - 125;
        arr[i3 + 2] = 28 * Math.sin(t + off);
    }
}

const shapes = [];
for (let s = 0; s < 4; s++) shapes.push(new Float32Array(N * 3));
makeGalaxy(shapes[0]);
makeVortex(shapes[1]);
makeSphere(shapes[2]);
makeHelix(shapes[3]);

const posCurrent = new Float32Array(N * 3);
const colors = new Float32Array(N * 3);
const colorObj = new THREE.Color();

for (let i = 0; i < N; i++) {
    const i3 = i * 3;
    // Start scattered
    posCurrent[i3] = (Math.random() - 0.5) * 800;
    posCurrent[i3 + 1] = (Math.random() - 0.5) * 800;
    posCurrent[i3 + 2] = (Math.random() - 0.5) * 800;
    // Purple-indigo-pink palette
    const t = i / N;
    colorObj.setHSL(0.72 + t * 0.15 + Math.random() * 0.05, 0.6 + Math.random() * 0.4, 0.5 + Math.random() * 0.4);
    colors[i3] = colorObj.r;
    colors[i3 + 1] = colorObj.g;
    colors[i3 + 2] = colorObj.b;
}

const geo = new THREE.BufferGeometry();
geo.setAttribute('position', new THREE.BufferAttribute(posCurrent, 3));
geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// Glow sprite
const sc = document.createElement('canvas'); sc.width = 64; sc.height = 64;
const sctx = sc.getContext('2d');
const sg = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
sg.addColorStop(0, 'rgba(255,255,255,1)');
sg.addColorStop(0.1, 'rgba(200,180,255,0.9)');
sg.addColorStop(0.4, 'rgba(120,100,255,0.3)');
sg.addColorStop(1, 'rgba(0,0,0,0)');
sctx.fillStyle = sg; sctx.fillRect(0, 0, 64, 64);
const sprite = new THREE.Texture(sc); sprite.needsUpdate = true;

const mat = new THREE.PointsMaterial({
    size: 2.5, map: sprite, vertexColors: true,
    blending: THREE.AdditiveBlending, depthTest: false, transparent: true, opacity: 0.9
});

const particles = new THREE.Points(geo, mat);
scene.add(particles);

// Shape morphing based on scroll
let currentShape = 0;
let targetShape = shapes[0];
let lerpSpeed = 0.025;
let mouseX = 0, mouseY = 0;

// Velocity array for physics-based explosion
const velocity = new Float32Array(N * 3);

// Raycaster for cursor → 3D world position
const raycaster = new THREE.Raycaster();
const mouseNDC = new THREE.Vector2();
const invMatrix = new THREE.Matrix4();

// Explosion state
let isExploding = false;
let explodeTimer = 0;
const EXPLODE_RADIUS = 60;       // Radius of hover repulsion
const EXPLODE_FORCE = 1.5;       // Hover push strength (subtle)
const CLICK_FORCE = 20;          // Click explosion strength
const CLICK_RADIUS = 250;        // Click explosion reach
const VELOCITY_DECAY = 0.95;     // How fast velocity dies down

// Track if cursor is in hero section
let cursorInHero = true;
const heroSection = document.getElementById('hero');

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;

    // Check if cursor is over hero section
    const heroRect = heroSection.getBoundingClientRect();
    cursorInHero = e.clientY < heroRect.bottom;
});

// Convert mouse to particle LOCAL space (accounts for rotation!)
function getMouseLocal3D() {
    raycaster.setFromCamera(mouseNDC, camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const worldPoint = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, worldPoint);
    if (!worldPoint) return null;
    // Transform world → particle local space
    particles.updateMatrixWorld();
    invMatrix.copy(particles.matrixWorld).invert();
    return worldPoint.applyMatrix4(invMatrix);
}

// CLICK = BIG BANG EXPLOSION from cursor direction!
heroSection.addEventListener('click', () => {
    isExploding = true;
    explodeTimer = 120;
    const local = getMouseLocal3D();
    if (!local) return;
    const pos = particles.geometry.attributes.position.array;

    for (let i = 0; i < N; i++) {
        const i3 = i * 3;
        const dx = pos[i3] - local.x;
        const dy = pos[i3 + 1] - local.y;
        const dz = pos[i3 + 2] - local.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.1;

        if (dist < CLICK_RADIUS) {
            const force = CLICK_FORCE * (1 - dist / CLICK_RADIUS);
            const scatter = 0.3 + Math.random() * 0.7;
            velocity[i3] += (dx / dist) * force * scatter;
            velocity[i3 + 1] += (dy / dist) * force * scatter;
            velocity[i3 + 2] += (dz / dist) * force * scatter;
        }
    }
});

// Double-click = MEGA EXPLOSION (all particles scatter)
heroSection.addEventListener('dblclick', () => {
    isExploding = true;
    explodeTimer = 180;
    for (let i = 0; i < N; i++) {
        const i3 = i * 3;
        const dx = Math.random() - 0.5;
        const dy = Math.random() - 0.5;
        const dz = Math.random() - 0.5;
        const len = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.01;
        const force = 12 + Math.random() * 18;
        velocity[i3] += (dx / len) * force;
        velocity[i3 + 1] += (dy / len) * force;
        velocity[i3 + 2] += (dz / len) * force;
    }
});

// Change shape based on scroll position
function updateShapeFromScroll() {
    const scrollFrac = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    let idx;
    if (scrollFrac < 0.25) idx = 0;
    else if (scrollFrac < 0.5) idx = 1;
    else if (scrollFrac < 0.75) idx = 2;
    else idx = 3;

    if (idx !== currentShape) {
        currentShape = idx;
        targetShape = shapes[idx];
        lerpSpeed = 0.03;
    }
}
window.addEventListener('scroll', updateShapeFromScroll);

const clock = new THREE.Clock();
function animateParticles() {
    requestAnimationFrame(animateParticles);
    const t = clock.getElapsedTime();
    const pos = particles.geometry.attributes.position.array;

    // Hover repulsion: only when cursor is over hero section
    if (cursorInHero) {
        const local = getMouseLocal3D();
        if (local) {
            for (let i = 0; i < N; i++) {
                const i3 = i * 3;
                const dx = pos[i3] - local.x;
                const dy = pos[i3 + 1] - local.y;
                const dz = pos[i3 + 2] - local.z;
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.1;

                if (dist < EXPLODE_RADIUS) {
                    const force = EXPLODE_FORCE * (1 - dist / EXPLODE_RADIUS);
                    velocity[i3] += (dx / dist) * force;
                    velocity[i3 + 1] += (dy / dist) * force;
                    velocity[i3 + 2] += (dz / dist) * force;
                }
            }
        }
    }

    // Apply velocity + decay + spring back to target shape
    for (let i = 0; i < N * 3; i++) {
        pos[i] += velocity[i];
        velocity[i] *= VELOCITY_DECAY;
        const spring = isExploding ? 0.006 : lerpSpeed;
        pos[i] += (targetShape[i] - pos[i]) * spring;
    }

    // Explosion timer
    if (isExploding) {
        explodeTimer--;
        if (explodeTimer <= 0) isExploding = false;
    }

    particles.geometry.attributes.position.needsUpdate = true;

    particles.rotation.y = t * 0.04 + mouseX * 0.25;
    particles.rotation.x = -0.25 + mouseY * 0.12;
    particles.rotation.z += 0.001;

    const breath = 1 + Math.sin(t * 0.6) * 0.03;
    particles.scale.set(breath, breath, breath);

    renderer.render(scene, camera);
}
animateParticles();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ===========================================
//  2. CUSTOM CURSOR + TRAIL
// ===========================================
const dot = document.createElement('div'); dot.className = 'cursor-dot'; document.body.appendChild(dot);
const ring = document.createElement('div'); ring.className = 'cursor-ring'; document.body.appendChild(ring);

// Trail particles
const TRAIL_COUNT = 12;
const trails = [];
for (let i = 0; i < TRAIL_COUNT; i++) {
    const d = document.createElement('div');
    d.className = 'trail-dot';
    d.style.width = (5 - i * 0.3) + 'px';
    d.style.height = d.style.width;
    document.body.appendChild(d);
    trails.push({ el: d, x: 0, y: 0 });
}

let mx = 0, my = 0;
document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
});

function animateCursor() {
    requestAnimationFrame(animateCursor);
    const ringX = parseFloat(ring.style.left) || mx;
    const ringY = parseFloat(ring.style.top) || my;
    ring.style.left = (ringX + (mx - 20 - ringX) * 0.15) + 'px';
    ring.style.top = (ringY + (my - 20 - ringY) * 0.15) + 'px';

    let px = mx, py = my;
    for (let i = 0; i < TRAIL_COUNT; i++) {
        const t = trails[i];
        t.x += (px - t.x) * (0.35 - i * 0.02);
        t.y += (py - t.y) * (0.35 - i * 0.02);
        t.el.style.transform = `translate(${t.x - 2.5}px, ${t.y - 2.5}px)`;
        t.el.style.opacity = 0.4 - i * 0.03;
        px = t.x; py = t.y;
    }
}
animateCursor();

// Cursor hover effect on links/buttons
document.querySelectorAll('a, button, .feature-card, .showcase-card, .social-link, .bento-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
});

// ===========================================
//  3. BACKGROUND BLOBS
// ===========================================
for (let i = 1; i <= 3; i++) {
    const b = document.createElement('div');
    b.className = `bg-blob blob-${i}`;
    document.body.appendChild(b);
}

// ===========================================
//  4. TYPING EFFECT
// ===========================================
const phrases = ['Full-Stack Developer', 'Creative Coder', 'UI/UX Enthusiast', 'Problem Solver', 'Tech Explorer'];
const typedEl = document.getElementById('typed-text');
let pIdx = 0, cIdx = 0, isDel = false;

function typeLoop() {
    const cur = phrases[pIdx];
    typedEl.textContent = cur.substring(0, cIdx);
    if (!isDel) {
        cIdx++;
        if (cIdx > cur.length) { isDel = true; setTimeout(typeLoop, 2000); return; }
    } else {
        cIdx--;
        if (cIdx < 0) { isDel = false; pIdx = (pIdx + 1) % phrases.length; setTimeout(typeLoop, 400); return; }
    }
    setTimeout(typeLoop, isDel ? 35 : 70);
}
typeLoop();

// ===========================================
//  5. NAVBAR
// ===========================================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 50));
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// Active nav link
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const y = window.scrollY + 200;
    sections.forEach(sec => {
        const link = navLinks.querySelector(`a[href="#${sec.id}"]`);
        if (link) link.classList.toggle('active', y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight);
    });
});

// ===========================================
//  6. SCROLL REVEAL + FEATURE BARS + STATS
// ===========================================
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            // Animate feature bars
            e.target.querySelectorAll('.feature-fill').forEach(bar => {
                bar.style.setProperty('--w', bar.dataset.width + '%');
                bar.classList.add('animate');
            });
            // Animate stat counters
            const statNum = e.target.querySelector('.stat-number');
            if (statNum && statNum.dataset.target) {
                const target = parseInt(statNum.dataset.target);
                let current = 0;
                const increment = target / 35;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        statNum.textContent = target + '+';
                        clearInterval(timer);
                    } else {
                        statNum.textContent = Math.floor(current);
                    }
                }, 35);
            }
        }
    });
}, { threshold: 0.12 });

// Observe all reveal variants
document.querySelectorAll('.reveal, .reveal-left, .reveal-scale').forEach(el => revealObs.observe(el));

// Parallax floating tags
window.addEventListener('scroll', () => {
    document.querySelectorAll('.float-tag').forEach((tag, i) => {
        const speed = 0.03 + i * 0.01;
        tag.style.transform = `translateY(${Math.sin(window.scrollY * speed) * 15}px)`;
    });
});

// ===========================================
//  7. CONTACT FORM
// ===========================================
document.getElementById('contact-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.textContent = 'Sent! ✅';
    btn.style.background = 'linear-gradient(135deg, #00c853, #00e676)';
    setTimeout(() => { btn.textContent = 'Send Message ✉️'; btn.style.background = ''; e.target.reset(); }, 2500);
});

// ===========================================
//  8. MINI GAME — Catch the Coffee ☕ (GPU-optimized)
// ===========================================
(() => {
    const arena = document.getElementById('game-arena');
    const player = document.getElementById('game-player');
    const startOverlay = document.getElementById('game-start-overlay');
    const overOverlay = document.getElementById('game-over-overlay');
    const scoreEl = document.getElementById('game-score');
    const levelEl = document.getElementById('game-level');
    const livesEl = document.getElementById('game-lives');
    const bestEl = document.getElementById('game-best');
    const finalScoreEl = document.getElementById('game-final-score');
    const overMsgEl = document.getElementById('game-over-msg');
    const overEmojiEl = document.getElementById('game-over-emoji');

    if (!arena) return;

    const ITEMS = [
        { emoji: '☕', points: 1, weight: 30, cls: 'good' },
        { emoji: '🍕', points: 2, weight: 18, cls: 'good' },
        { emoji: '🍩', points: 2, weight: 12, cls: 'good' },
        { emoji: '⭐', points: 5, weight: 5, cls: 'great' },
        { emoji: '💎', points: 10, weight: 2, cls: 'epic' },
        { emoji: '🐛', points: -1, weight: 28, cls: 'bad', isBug: true },
        { emoji: '🪲', points: -1, weight: 18, cls: 'bad', isBug: true },
        { emoji: '🕷️', points: -1, weight: 10, cls: 'bad', isBug: true },
    ];
    const TOTAL_WEIGHT = ITEMS.reduce((s, i) => s + i.weight, 0);

    // Cache arena dimensions — never read per-frame
    let arenaW = 0, arenaH = 0;
    function cacheSize() {
        arenaW = arena.offsetWidth;
        arenaH = arena.offsetHeight;
    }
    const ro = new ResizeObserver(cacheSize);
    ro.observe(arena);
    cacheSize();

    let gs = {
        running: false, score: 0, lives: 3, level: 1,
        playerX: 0, // px from left
        items: [], spawnTimer: 0, lastTime: 0, animId: null,
        best: parseInt(localStorage.getItem('nabil_game_best') || '0'),
        caught: 0,
    };
    bestEl.textContent = gs.best;

    function pickItem() {
        let r = Math.random() * TOTAL_WEIGHT;
        for (const it of ITEMS) { r -= it.weight; if (r <= 0) return it; }
        return ITEMS[0];
    }

    function spawnItem() {
        const data = pickItem();
        const el = document.createElement('div');
        el.className = 'game-item';
        el.textContent = data.emoji;
        arena.appendChild(el);
        const xPx = 20 + Math.random() * (arenaW - 40);
        // Use transform for positioning
        el.style.transform = `translate3d(${xPx}px, -30px, 0)`;
        gs.items.push({ el, x: xPx, y: -30, speed: 140 + (gs.level - 1) * 30 + Math.random() * 60, data });
    }

    function updateHud() {
        scoreEl.textContent = gs.score;
        levelEl.textContent = gs.level;
        livesEl.textContent = gs.lives > 0 ? '❤️'.repeat(gs.lives) : '💀';
    }

    function popup(x, y, text, cls) {
        const el = document.createElement('div');
        el.className = `game-score-popup ${cls}`;
        el.textContent = text;
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        arena.appendChild(el);
        setTimeout(() => el.remove(), 800);
    }

    function flash(x, y) {
        const el = document.createElement('div');
        el.className = 'game-catch-flash';
        el.style.left = (x - 20) + 'px';
        el.style.top = (y - 20) + 'px';
        arena.appendChild(el);
        setTimeout(() => el.remove(), 400);
    }

    function shake() {
        arena.classList.add('shake');
        setTimeout(() => arena.classList.remove('shake'), 300);
    }

    function confetti(n) {
        const colors = ['#9b7dff', '#f093fb', '#4facfe', '#69f0ae', '#fee140', '#f5576c'];
        for (let i = 0; i < n; i++) {
            const el = document.createElement('div');
            el.className = 'confetti-piece';
            el.style.left = Math.random() * 100 + 'vw';
            el.style.background = colors[(Math.random() * colors.length) | 0];
            el.style.animationDuration = (2 + Math.random() * 2) + 's';
            el.style.animationDelay = (Math.random() * .5) + 's';
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 4000);
        }
    }

    function gameLoop(ts) {
        if (!gs.running) return;
        const dt = Math.min((ts - gs.lastTime) * 0.001, 0.1);
        gs.lastTime = ts;

        // Spawn
        gs.spawnTimer -= dt;
        if (gs.spawnTimer <= 0) {
            spawnItem();
            gs.spawnTimer = Math.max(0.3, 0.9 - (gs.level - 1) * 0.08) + Math.random() * 0.3;
        }

        const playerY = arenaH - 45;
        const catchR = 32;
        let hudDirty = false;

        // Update & collide
        for (let i = gs.items.length - 1; i >= 0; i--) {
            const it = gs.items[i];
            it.y += it.speed * dt;
            // GPU transform — no layout reflow
            it.el.style.transform = `translate3d(${it.x}px, ${it.y}px, 0)`;

            // Collision check (pure math, no DOM reads)
            if (it.y > playerY - 18 && it.y < playerY + 18 && Math.abs(it.x - gs.playerX) < catchR) {
                if (it.data.isBug) {
                    gs.lives--;
                    shake();
                    popup(it.x, it.y, '-1 ❤️', 'bad');
                } else {
                    gs.score += it.data.points;
                    gs.caught++;
                    flash(it.x, it.y);
                    let t = '+' + it.data.points;
                    if (it.data.points >= 10) t += ' 🔥';
                    else if (it.data.points >= 5) t += ' ⭐';
                    popup(it.x, it.y, t, it.data.cls);
                    if (gs.caught % 15 === 0) { gs.level++; confetti(20); }
                }
                it.el.remove();
                gs.items.splice(i, 1);
                hudDirty = true;
                continue;
            }

            if (it.y > arenaH + 30) {
                it.el.remove();
                gs.items.splice(i, 1);
            }
        }

        if (hudDirty) updateHud();

        if (gs.lives <= 0) { endGame(); return; }
        gs.animId = requestAnimationFrame(gameLoop);
    }

    function startGame() {
        arena.querySelectorAll('.game-item, .game-score-popup, .game-catch-flash').forEach(e => e.remove());
        cacheSize();
        gs.running = true;
        gs.score = 0; gs.lives = 3; gs.level = 1;
        gs.items = []; gs.spawnTimer = 0.5; gs.caught = 0;
        gs.playerX = arenaW * 0.5;
        updateHud();
        player.style.transform = `translate3d(${gs.playerX - 18}px, 0, 0)`;
        startOverlay.style.display = 'none';
        overOverlay.style.display = 'none';
        gs.lastTime = performance.now();
        gs.animId = requestAnimationFrame(gameLoop);
    }

    function endGame() {
        gs.running = false;
        if (gs.animId) cancelAnimationFrame(gs.animId);
        arena.querySelectorAll('.game-item').forEach(e => e.remove());
        gs.items = [];
        if (gs.score > gs.best) {
            gs.best = gs.score;
            localStorage.setItem('nabil_game_best', gs.best);
            bestEl.textContent = gs.best;
        }
        finalScoreEl.textContent = gs.score;
        let emoji, msg;
        if (gs.score >= 100) { emoji = '🏆'; msg = 'Legend! Kamu pro banget! 🔥'; }
        else if (gs.score >= 50) { emoji = '🌟'; msg = 'Hebat! Refleks yang cepat! ⚡'; }
        else if (gs.score >= 20) { emoji = '😊'; msg = 'Lumayan! Coba lagi buat score lebih tinggi!'; }
        else { emoji = '😵'; msg = 'Jangan tangkap yang 🐛 ya! Coba lagi!'; }
        overEmojiEl.textContent = emoji;
        overMsgEl.textContent = msg;
        overOverlay.style.display = 'flex';
        if (gs.score >= 50) confetti(25);
    }

    // Mouse — use transform
    arena.addEventListener('mousemove', (e) => {
        if (!gs.running) return;
        const rect = arena.getBoundingClientRect();
        gs.playerX = Math.max(20, Math.min(arenaW - 20, e.clientX - rect.left));
        player.style.transform = `translate3d(${gs.playerX - 18}px, 0, 0)`;
    });

    // Touch
    arena.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!gs.running) return;
        const rect = arena.getBoundingClientRect();
        gs.playerX = Math.max(20, Math.min(arenaW - 20, e.touches[0].clientX - rect.left));
        player.style.transform = `translate3d(${gs.playerX - 18}px, 0, 0)`;
    }, { passive: false });

    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (!gs.running) return;
        const step = 18;
        if (e.key === 'ArrowLeft') gs.playerX = Math.max(20, gs.playerX - step);
        else if (e.key === 'ArrowRight') gs.playerX = Math.min(arenaW - 20, gs.playerX + step);
        else return;
        player.style.transform = `translate3d(${gs.playerX - 18}px, 0, 0)`;
    });

    document.getElementById('game-play-btn')?.addEventListener('click', startGame);
    document.getElementById('game-retry-btn')?.addEventListener('click', startGame);
})();
