// Three.js loaded via CDN (global THREE object)

// ===========================================
//  1. THREE.JS — WATER WAVE PARTICLES
// ===========================================
const canvas = document.getElementById('galaxy-canvas');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x06060f, 0.0008);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 80, 200);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Grid dimensions
const GRID_W = 120;
const GRID_H = 120;
const N = GRID_W * GRID_H;
const SPACING = 3.2;

// Base positions (flat plane)
const basePos = new Float32Array(N * 3);
const posCurrent = new Float32Array(N * 3);
const colors = new Float32Array(N * 3);
const velocity = new Float32Array(N * 3);
const colorObj = new THREE.Color();

for (let ix = 0; ix < GRID_W; ix++) {
    for (let iz = 0; iz < GRID_H; iz++) {
        const i = ix * GRID_H + iz;
        const i3 = i * 3;
        const x = (ix - GRID_W / 2) * SPACING;
        const z = (iz - GRID_H / 2) * SPACING;
        basePos[i3] = x;
        basePos[i3 + 1] = 0;
        basePos[i3 + 2] = z;
        // Start particles at random scattered positions (explosion on load)
        posCurrent[i3] = x + (Math.random() - 0.5) * 600;
        posCurrent[i3 + 1] = Math.random() * 250 + 50;
        posCurrent[i3 + 2] = z + (Math.random() - 0.5) * 600;

        // Purple-indigo-pink palette based on distance from center
        const distNorm = Math.sqrt(x * x + z * z) / (GRID_W * SPACING * 0.5);
        const hue = 0.72 + distNorm * 0.18 + Math.random() * 0.04;
        const sat = 0.5 + Math.random() * 0.4;
        const light = 0.4 + Math.random() * 0.35;
        colorObj.setHSL(hue, sat, light);
        colors[i3] = colorObj.r;
        colors[i3 + 1] = colorObj.g;
        colors[i3 + 2] = colorObj.b;
    }
}

const geo = new THREE.BufferGeometry();
geo.setAttribute('position', new THREE.BufferAttribute(posCurrent, 3));
geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// Glow sprite texture
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
    size: 2.2, map: sprite, vertexColors: true,
    blending: THREE.AdditiveBlending, depthTest: false, transparent: true, opacity: 0.85
});

const particles = new THREE.Points(geo, mat);
scene.add(particles);

// Track mouse
let mouseX = 0, mouseY = 0;
const mouseNDC = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

// Ripple system — supports multiple concurrent ripples
const ripples = [];
const MAX_RIPPLES = 5;

// Mouse 3D position on the particle plane
let mouse3D = { x: 0, z: 0, active: false };

const heroSection = document.getElementById('hero');
let cursorInHero = true;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;

    const heroRect = heroSection.getBoundingClientRect();
    cursorInHero = e.clientY < heroRect.bottom;

    // Project mouse onto the particle plane (Y=0)
    if (cursorInHero) {
        raycaster.setFromCamera(mouseNDC, camera);
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const hitPoint = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, hitPoint);
        if (hitPoint) {
            mouse3D.x = hitPoint.x;
            mouse3D.z = hitPoint.z;
            mouse3D.active = true;
        }
    } else {
        mouse3D.active = false;
    }
});

// Explosion state — start exploded on load
let isExploding = true;
let explodeTimer = 180;

// Click = ripple wave from cursor
heroSection.addEventListener('click', () => {
    if (!mouse3D.active) return;
    ripples.push({
        x: mouse3D.x,
        z: mouse3D.z,
        radius: 0,
        amplitude: 18,
        speed: 120,
        life: 1.0
    });
    if (ripples.length > MAX_RIPPLES) ripples.shift();
});

// Double-click = MEGA EXPLOSION
heroSection.addEventListener('dblclick', () => {
    isExploding = true;
    explodeTimer = 180;
    const cx = mouse3D.active ? mouse3D.x : 0;
    const cz = mouse3D.active ? mouse3D.z : 0;

    for (let i = 0; i < N; i++) {
        const i3 = i * 3;
        const dx = posCurrent[i3] - cx;
        const dy = posCurrent[i3 + 1];
        const dz = posCurrent[i3 + 2] - cz;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.1;
        const force = (8 + Math.random() * 14) * Math.max(0.2, 1 - dist / 300);
        velocity[i3] += (dx / dist) * force * 0.6;
        velocity[i3 + 1] += (Math.random() * 0.5 + 0.5) * force * 1.2;
        velocity[i3 + 2] += (dz / dist) * force * 0.6;
    }
});

const VELOCITY_DECAY = 0.96;
const CURSOR_RADIUS = 50;
const CURSOR_WAVE_HEIGHT = 14;

const clock = new THREE.Clock();

function animateParticles() {
    requestAnimationFrame(animateParticles);
    const t = clock.getElapsedTime();
    const pos = particles.geometry.attributes.position.array;

    // Calculate target Y for each particle
    for (let i = 0; i < N; i++) {
        const i3 = i * 3;
        const bx = basePos[i3];
        const bz = basePos[i3 + 2];

        // Ambient ocean waves — multiple overlapping sine waves
        let targetY = 0;
        targetY += Math.sin(bx * 0.025 + t * 0.8) * 4;
        targetY += Math.sin(bz * 0.03 + t * 0.6) * 3;
        targetY += Math.sin((bx + bz) * 0.018 + t * 1.2) * 2.5;
        targetY += Math.sin(bx * 0.05 - t * 0.4) * 1.5;

        // Cursor proximity wave — smooth radial sine displacement
        if (mouse3D.active && cursorInHero) {
            const dx = bx - mouse3D.x;
            const dz = bz - mouse3D.z;
            const dist = Math.sqrt(dx * dx + dz * dz);
            if (dist < CURSOR_RADIUS) {
                const influence = 1 - dist / CURSOR_RADIUS;
                const smoothInfluence = influence * influence * (3 - 2 * influence); // smoothstep
                targetY += Math.sin(dist * 0.15 - t * 3) * CURSOR_WAVE_HEIGHT * smoothInfluence;
            }
        }

        // Active ripples
        for (let r = ripples.length - 1; r >= 0; r--) {
            const rip = ripples[r];
            const dx = bx - rip.x;
            const dz = bz - rip.z;
            const dist = Math.sqrt(dx * dx + dz * dz);
            const waveFront = rip.radius;
            const waveWidth = 40;
            const distToFront = Math.abs(dist - waveFront);
            if (distToFront < waveWidth) {
                const envelope = (1 - distToFront / waveWidth) * rip.life;
                targetY += Math.sin(dist * 0.12 - t * 5) * rip.amplitude * envelope;
            }
        }

        // Apply velocity + spring back
        if (isExploding) {
            pos[i3] += velocity[i3];
            pos[i3 + 1] += velocity[i3 + 1];
            pos[i3 + 2] += velocity[i3 + 2];
            velocity[i3] *= VELOCITY_DECAY;
            velocity[i3 + 1] *= VELOCITY_DECAY;
            velocity[i3 + 2] *= VELOCITY_DECAY;
            // Gentle spring back to base
            pos[i3] += (bx - pos[i3]) * 0.008;
            pos[i3 + 1] += (targetY - pos[i3 + 1]) * 0.008;
            pos[i3 + 2] += (bz - pos[i3 + 2]) * 0.008;
        } else {
            // Smooth spring to target
            pos[i3] += (bx - pos[i3]) * 0.05;
            pos[i3 + 1] += (targetY - pos[i3 + 1]) * 0.08;
            pos[i3 + 2] += (bz - pos[i3 + 2]) * 0.05;
            // Apply remaining velocity
            pos[i3] += velocity[i3];
            pos[i3 + 1] += velocity[i3 + 1];
            pos[i3 + 2] += velocity[i3 + 2];
            velocity[i3] *= 0.92;
            velocity[i3 + 1] *= 0.92;
            velocity[i3 + 2] *= 0.92;
        }
    }

    // Update ripples
    const dt = clock.getDelta() || 0.016;
    for (let r = ripples.length - 1; r >= 0; r--) {
        ripples[r].radius += ripples[r].speed * dt;
        ripples[r].life -= dt * 0.4;
        if (ripples[r].life <= 0) ripples.splice(r, 1);
    }

    // Explosion timer
    if (isExploding) {
        explodeTimer--;
        if (explodeTimer <= 0) isExploding = false;
    }

    particles.geometry.attributes.position.needsUpdate = true;

    // Gentle camera sway based on mouse
    camera.position.x += (mouseX * 30 - camera.position.x) * 0.02;
    camera.position.y += (80 + mouseY * -15 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);

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

document.querySelectorAll('a, button, .feature-card, .showcase-card, .social-link, .bento-card, .wib-cat-card, .trait-card').forEach(el => {
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
const phrases = ['Full-Stack Developer', 'Laravel & React Developer', 'AI-Powered Solutions', 'System Analyst', 'Team Leader'];
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
            e.target.querySelectorAll('.feature-fill').forEach(bar => {
                bar.style.setProperty('--w', bar.dataset.width + '%');
                bar.classList.add('animate');
            });
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

document.querySelectorAll('.reveal, .reveal-left, .reveal-scale').forEach(el => revealObs.observe(el));

window.addEventListener('scroll', () => {
    document.querySelectorAll('.float-tag').forEach((tag, i) => {
        const speed = 0.03 + i * 0.01;
        tag.style.transform = `translateY(${Math.sin(window.scrollY * speed) * 15}px)`;
    });
});

// ===========================================
//  7. WHAT I BRING — Category Tab Switching
// ===========================================
(() => {
    const catCards = document.querySelectorAll('.wib-cat-card');
    const panels = document.querySelectorAll('.wib-skills-panel');
    if (!catCards.length) return;

    function reAnimateTags(panel) {
        const tags = panel.querySelectorAll('.wib-tag-card');
        tags.forEach(tag => {
            tag.style.animation = 'none';
            tag.offsetHeight; // force reflow
        });
        requestAnimationFrame(() => {
            tags.forEach((tag, i) => {
                tag.style.animation = `tagFadeIn .5s cubic-bezier(.25,.8,.25,1) ${i * 0.05}s forwards`;
            });
        });
    }

    catCards.forEach(card => {
        card.addEventListener('click', () => {
            const cat = card.dataset.category;
            catCards.forEach(c => c.classList.toggle('active', c === card));
            panels.forEach(p => {
                const isActive = p.dataset.category === cat;
                p.classList.toggle('active', isActive);
                if (isActive) reAnimateTags(p);
            });
        });
    });
})();

// ===========================================
//  8. TILT EFFECT — Category Cards
// ===========================================
(() => {
    const cards = document.querySelectorAll('.feature-card.wib-cat-card');
    if (!cards.length) return;

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotateX = ((y - cy) / cy) * -8;
            const rotateY = ((x - cx) / cx) * 8;
            const isActive = card.classList.contains('active');
            const ty = isActive ? -4 : 0;
            card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${ty}px)`;
        });

        card.addEventListener('mouseleave', () => {
            const isActive = card.classList.contains('active');
            card.style.transform = isActive ? 'translateY(-4px)' : 'translateY(0)';
        });
    });
})();

// ===========================================
//  8. CONTACT FORM
// ===========================================
document.getElementById('contact-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button');
    
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    
    fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            btn.textContent = 'Sent! ✅';
            btn.style.background = 'linear-gradient(135deg, #00c853, #00e676)';
            setTimeout(() => { btn.textContent = originalText; btn.style.background = ''; form.reset(); }, 2500);
        } else {
            throw new Error('Network response was not ok');
        }
    }).catch(error => {
        btn.textContent = 'Error! ❌';
        btn.style.background = 'linear-gradient(135deg, #ff1744, #d50000)';
        setTimeout(() => { btn.textContent = originalText; btn.style.background = ''; }, 2500);
    });
});

// ===========================================
//  9. MINI GAME — Catch the Coffee ☕
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
        { emoji: '❤️‍🔥', points: 0, weight: 4, cls: 'heal', isHeal: true },
        { emoji: '🐛', points: -1, weight: 24, cls: 'bad', isBug: true },
        { emoji: '🪲', points: -1, weight: 15, cls: 'bad', isBug: true },
        { emoji: '🕷️', points: -1, weight: 8, cls: 'bad', isBug: true },
    ];
    const TOTAL_WEIGHT = ITEMS.reduce((s, i) => s + i.weight, 0);

    let arenaW = 0, arenaH = 0;
    function cacheSize() { arenaW = arena.offsetWidth; arenaH = arena.offsetHeight; }
    const ro = new ResizeObserver(cacheSize);
    ro.observe(arena);
    cacheSize();

    let gs = {
        running: false, score: 0, lives: 3, level: 1,
        playerX: 0, items: [], spawnTimer: 0, lastTime: 0, animId: null,
        best: parseInt(localStorage.getItem('nabila_game_best') || '0'),
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
        el.style.transform = `translate3d(${xPx}px, -30px, 0)`;
        gs.items.push({ el, x: xPx, y: -30, speed: 120 + (gs.level - 1) * 40 + Math.random() * 60, data });
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

        gs.spawnTimer -= dt;
        if (gs.spawnTimer <= 0) {
            spawnItem();
            gs.spawnTimer = Math.max(0.25, 0.85 - (gs.level - 1) * 0.1) + Math.random() * 0.25;
        }

        const playerY = arenaH - 45;
        const catchR = 32;
        let hudDirty = false;

        for (let i = gs.items.length - 1; i >= 0; i--) {
            const it = gs.items[i];
            it.y += it.speed * dt;
            it.el.style.transform = `translate3d(${it.x}px, ${it.y}px, 0)`;

            if (it.y > playerY - 18 && it.y < playerY + 18 && Math.abs(it.x - gs.playerX) < catchR) {
                if (it.data.isBug) {
                    gs.lives--;
                    shake();
                    popup(it.x, it.y, '-1 ❤️', 'bad');
                } else if (it.data.isHeal) {
                    gs.lives = Math.min(gs.lives + 1, 5);
                    flash(it.x, it.y);
                    popup(it.x, it.y, '+1 ❤️', 'heal');
                } else {
                    gs.score += it.data.points;
                    gs.caught++;
                    flash(it.x, it.y);
                    let t = '+' + it.data.points;
                    if (it.data.points >= 10) t += ' 🔥';
                    else if (it.data.points >= 5) t += ' ⭐';
                    popup(it.x, it.y, t, it.data.cls);
                    if (gs.caught % 10 === 0) { gs.level++; confetti(20); }
                }
                it.el.remove();
                gs.items.splice(i, 1);
                hudDirty = true;
                continue;
            }

            // Missed food or good items = lose a life
            if (it.y > arenaH + 30) {
                if (!it.data.isBug && !it.data.isHeal) {
                    gs.lives--;
                    shake();
                    popup(it.x, arenaH - 20, 'Miss! -1 ❤️', 'bad');
                    hudDirty = true;
                }
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
            localStorage.setItem('nabila_game_best', gs.best);
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

    arena.addEventListener('mousemove', (e) => {
        if (!gs.running) return;
        const rect = arena.getBoundingClientRect();
        gs.playerX = Math.max(20, Math.min(arenaW - 20, e.clientX - rect.left));
        player.style.transform = `translate3d(${gs.playerX - 18}px, 0, 0)`;
    });

    arena.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!gs.running) return;
        const rect = arena.getBoundingClientRect();
        gs.playerX = Math.max(20, Math.min(arenaW - 20, e.touches[0].clientX - rect.left));
        player.style.transform = `translate3d(${gs.playerX - 18}px, 0, 0)`;
    }, { passive: false });

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
