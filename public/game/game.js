// ===== CLUB RING BOXING — SPRITE EDITION =====
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const W = 800, H = 500, GROUND = 460;

// ===== SPRITE LOADER =====
const sprites = {};
const spritesBlue = {};
const ANIMS = ['Idle','Walk','WalkBack','PunchLeft','PunchRight','PunchUp','Blocking','Dizzy','Hurt','KO'];
const spriteScale = 0.45;
const spriteW = Math.floor(499 * spriteScale);
const spriteH = Math.floor(489 * spriteScale);

const ANIM_COUNTS = {Idle:10,Walk:10,WalkBack:10,PunchLeft:6,PunchRight:6,PunchUp:7,Blocking:10,Dizzy:8,Hurt:8,KO:10};
const totalSprites = ANIMS.reduce((sum, a) => sum + ANIM_COUNTS[a], 0) * 2;
let spritesLoaded = 0;

function loadSprites(callback) {
    ANIMS.forEach(anim => {
        sprites[anim] = [];
        spritesBlue[anim] = [];
        const count = ANIM_COUNTS[anim];
        for (let i = 0; i < count; i++) {
            const num = String(i).padStart(3, '0');
            const baseName = `__Boxing04_${anim}_${num}.png`;

            const imgRed = new Image();
            imgRed.onload = ((a, idx, im) => () => {
                sprites[a][idx] = im;
                spritesLoaded++;
                if (spritesLoaded >= totalSprites) callback();
            })(anim, i, imgRed);
            imgRed.src = `sprites/MiniBoxingSpriteLite/${anim}/${baseName}`;

            const imgBlue = new Image();
            imgBlue.onload = ((a, idx, im) => () => {
                spritesBlue[a][idx] = im;
                spritesLoaded++;
                if (spritesLoaded >= totalSprites) callback();
            })(anim, i, imgBlue);
            imgBlue.src = `sprites/Blue/${anim}/${baseName}`;
        }
    });
}

// ===== AUDIO =====
let audioCtx = null;
function initAudio() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }

function snd(type) {
    if (!audioCtx) return;
    const t = audioCtx.currentTime;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);

    if (type === 'hit') {
        o.type='sawtooth'; o.frequency.setValueAtTime(180,t);
        o.frequency.exponentialRampToValueAtTime(40,t+0.08);
        g.gain.setValueAtTime(0.3,t); g.gain.exponentialRampToValueAtTime(0.001,t+0.1);
        o.start(t); o.stop(t+0.1);
    } else if (type === 'block') {
        o.type='square'; o.frequency.setValueAtTime(250,t);
        g.gain.setValueAtTime(0.12,t); g.gain.exponentialRampToValueAtTime(0.001,t+0.05);
        o.start(t); o.stop(t+0.05);
    } else if (type === 'ko') {
        o.type='sawtooth'; o.frequency.setValueAtTime(400,t);
        o.frequency.exponentialRampToValueAtTime(15,t+0.7);
        g.gain.setValueAtTime(0.35,t); g.gain.exponentialRampToValueAtTime(0.001,t+0.8);
        o.start(t); o.stop(t+0.8);
    } else if (type === 'bell') {
        o.type='sine'; o.frequency.setValueAtTime(900,t);
        g.gain.setValueAtTime(0.2,t); g.gain.exponentialRampToValueAtTime(0.001,t+0.4);
        o.start(t); o.stop(t+0.4);
    }
}

// ===== INPUT =====
const keys = {};
const jp = {};
let mouseX = 0, mouseY = 0, btnClick = false;
document.addEventListener('keydown', e => { if (!keys[e.code]) jp[e.code] = true; keys[e.code] = true; e.preventDefault(); });
document.addEventListener('keyup', e => { keys[e.code] = false; });
canvas.addEventListener('mousemove', e => { const r = canvas.getBoundingClientRect(); mouseX = (e.clientX - r.left) * (W / r.width); mouseY = (e.clientY - r.top) * (H / r.height); });
canvas.addEventListener('mousedown', () => { btnClick = true; });
document.addEventListener('mouseup', () => { btnClick = false; });
function pressed(c) { const v = jp[c]; jp[c] = false; return v; }
function clearJP() { Object.keys(jp).forEach(k => jp[k] = false); }

// ===== BOXER =====
class Boxer {
    constructor(x, facing, colorTint, name, useBlue) {
        this.x = x;
        this.y = GROUND;
        this.vx = 0;
        this.facing = facing;
        this.name = name;
        this.tint = colorTint;
        this.useBlue = useBlue || false;
        this.health = 100;
        this.stamina = 100;
        this.anim = 'Idle';
        this.animFrame = 0;
        this.animSpeed = 4;
        this.animTimer = 0;
        this.globalFrame = 0;
        this.state = 'idle';
        this.cooldown = 0;
        this.hurtTimer = 0;
        this.isBlocking = false;
        this.hitConnected = false;
        this.knockbackX = 0;
        this.wins = 0;
    }

    setAnim(name, speed) {
        if (this.anim !== name) {
            this.anim = name;
            this.animFrame = 0;
            this.animTimer = 0;
            this.animSpeed = speed || 4;
        }
    }

    updateAnim() {
        this.animTimer++;
        if (this.animTimer >= this.animSpeed) {
            this.animTimer = 0;
            this.animFrame++;
            const frames = sprites[this.anim] ? sprites[this.anim].length : 1;
            if (this.animFrame >= frames) {
                if (this.state === 'attack') {
                    this.state = 'idle';
                    this.setAnim('Idle', 4);
                }
                this.animFrame = 0;
            }
        }
    }

    getAttackBox(type) {
        const f = this.facing;
        const r = { jab: 80, cross: 90, hook: 85, uppercut: 75 }[type] || 80;
        const ox = f === 1 ? 5 : -(5 + r);
        const oy = type === 'uppercut' ? -65 : -55;
        return { x: this.x + ox, y: this.y + oy, w: r, h: 45 };
    }

    isAttackActive() {
        if (this.state !== 'attack') return false;
        const f = this.animFrame;
        if (this.anim === 'PunchRight') return f >= 2 && f <= 4;
        if (this.anim === 'PunchLeft') return f >= 2 && f <= 4;
        if (this.anim === 'PunchUp') return f >= 2 && f <= 5;
        return false;
    }

    punch(type) {
        if (this.cooldown > 0 || this.hurtTimer > 0 || this.state === 'ko') return;
        const cost = { jab: 5, cross: 10, hook: 12, uppercut: 18 }[type] || 8;
        if (this.stamina < cost) return;
        this.stamina -= cost;
        this.state = 'attack';
        this.hitConnected = false;
        this.cooldown = { jab: 14, cross: 20, hook: 24, uppercut: 30 }[type] || 18;

        if (type === 'jab') this.setAnim('PunchRight', 3);
        else if (type === 'cross') this.setAnim('PunchLeft', 3);
        else if (type === 'hook') this.setAnim('PunchLeft', 3);
        else if (type === 'uppercut') this.setAnim('PunchUp', 3);

        snd('hit');
    }

    block(active) {
        if (this.hurtTimer > 0 || this.state === 'ko') return;
        this.isBlocking = active && this.cooldown <= 0;
        if (active && this.state !== 'attack') {
            this.state = 'block';
            this.setAnim('Blocking', 5);
        } else if (!active && this.state === 'block') {
            this.state = 'idle';
            this.setAnim('Idle', 4);
        }
    }

    move(dx) {
        if (this.hurtTimer > 0 || this.state === 'ko') return;
        const spd = this.state === 'block' ? 1.5 : 4.5;
        this.vx = dx * spd;
        if (this.state !== 'attack' && this.state !== 'block') {
            if (dx !== 0) {
                this.state = 'walk';
                this.setAnim('Walk', 4);
            } else {
                this.state = 'idle';
                this.setAnim('Idle', 4);
            }
        }
    }

    takeDamage(dmg, attacker) {
        if (this.state === 'ko') return;
        if (this.isBlocking) {
            dmg = Math.floor(dmg * 0.1);
            snd('block');
            this.knockbackX = attacker.facing * 2;
        } else {
            this.state = 'hurt';
            this.hurtTimer = 18;
            this.setAnim('Hurt', 3);
            this.knockbackX = attacker.facing * (attacker.anim === 'PunchUp' ? 7 : 4);
            this.isBlocking = false;
        }
        this.health = Math.max(0, this.health - dmg);
        if (this.health <= 0) {
            this.state = 'ko';
            this.setAnim('KO', 4);
            snd('ko');
        }
    }

    update() {
        this.globalFrame++;
        this.vx += this.knockbackX;
        this.x += this.vx;
        this.vx *= 0.8;
        this.knockbackX *= 0.82;
        this.x = Math.max(70, Math.min(W - 70, this.x));
        if (this.cooldown > 0) this.cooldown--;
        if (this.hurtTimer > 0) {
            this.hurtTimer--;
            if (this.hurtTimer <= 0 && this.state === 'hurt') {
                this.state = 'idle';
                this.setAnim('Idle', 4);
            }
        }
        if (this.stamina < 100) this.stamina += 0.4;
        this.updateAnim();
    }
}

// ===== ARENA — EXACT COPY FROM REFERENCE IMAGE =====
function drawArena(f) {
    // Vanishing point (where ropes converge)
    const VPX = W / 2;
    const VPY = GROUND - 190;

    // Ring corners — ONE set of coordinates for everything
    const FL = { x: W * 0.08, y: GROUND };       // Front Left
    const FR = { x: W * 0.92, y: GROUND };       // Front Right
    const BL = { x: W * 0.23, y: VPY + 60 };    // Back Left
    const BR = { x: W * 0.77, y: VPY + 60 };    // Back Right

    // === DARK BACKGROUND ===
    ctx.fillStyle = '#020208';
    ctx.fillRect(0, 0, W, H);

    // === CROWD ===
    for (let row = 0; row < 8; row++) {
        const rowY = VPY - 10 - row * 18;
        const count = 25 + row * 5;
        for (let i = 0; i < count; i++) {
            const cx = 15 + i * ((W - 30) / count);
            const bob = Math.sin(i * 0.9 + f * 0.02 + row) * 2;
            const sz = 3.5 - row * 0.3;
            ctx.fillStyle = `rgba(${10 + row * 6},${10 + row * 6},${15 + row * 6},${0.3 + row * 0.05})`;
            ctx.beginPath(); ctx.arc(cx, rowY + bob, sz, 0, Math.PI * 2); ctx.fill();
        }
    }

    // Camera flashes
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 50; i++) {
        const sx = (Math.sin(i * 127.1) * 0.5 + 0.5) * W;
        const sy = VPY - 20 - (i % 8) * 18 + (Math.cos(i * 311.7) * 0.5 + 0.5) * 30;
        if (Math.sin(f * 0.08 + i * 5.7) > 0.75) {
            ctx.globalAlpha = 0.5 + Math.sin(f * 0.12 + i) * 0.3;
            ctx.beginPath(); ctx.arc(sx, sy, 1 + Math.sin(i) * 0.5, 0, Math.PI * 2); ctx.fill();
        }
    }
    ctx.globalAlpha = 1;

    // === SPOTLIGHTS ===
    [W * 0.18, W * 0.38, W * 0.5, W * 0.62, W * 0.82].forEach((sx, i) => {
        // Light source
        const ig = ctx.createRadialGradient(sx, 15, 2, sx, 15, 18);
        ig.addColorStop(0, `rgba(200,220,255,${0.6 + Math.sin(f * 0.02 + i) * 0.15})`);
        ig.addColorStop(1, 'transparent');
        ctx.fillStyle = ig;
        ctx.beginPath(); ctx.arc(sx, 15, 18, 0, Math.PI * 2); ctx.fill();

        // Beam
        ctx.fillStyle = `rgba(150,180,255,${0.025 + Math.sin(f * 0.01 + i) * 0.01})`;
        ctx.beginPath();
        ctx.moveTo(sx - 6, 30);
        ctx.lineTo(sx - 50, GROUND - 40);
        ctx.lineTo(sx + 50, GROUND - 40);
        ctx.lineTo(sx + 6, 30);
        ctx.fill();
    });

    // === BLUE CANVAS FLOOR ===
    const canvasG = ctx.createLinearGradient(0, FL.y, 0, FL.y + 50);
    canvasG.addColorStop(0, '#1a4080');
    canvasG.addColorStop(0.5, '#2055a0');
    canvasG.addColorStop(1, '#153060');
    ctx.fillStyle = canvasG;
    ctx.beginPath();
    ctx.moveTo(FL.x, FL.y);
    ctx.lineTo(FR.x, FR.y);
    ctx.lineTo(BR.x, BR.y);
    ctx.lineTo(BL.x, BL.y);
    ctx.closePath();
    ctx.fill();

    // Canvas light reflection
    const reflG = ctx.createRadialGradient(W / 2, FL.y + 25, 10, W / 2, FL.y + 25, 200);
    reflG.addColorStop(0, 'rgba(100,160,240,0.12)');
    reflG.addColorStop(1, 'transparent');
    ctx.fillStyle = reflG;
    ctx.fillRect(FL.x, FL.y, FR.x - FL.x, 60);

    // "CLUB RING" on canvas — Club Ring style
    ctx.save();
    ctx.translate(W / 2, FL.y + 25);
    ctx.transform(1, 0, 0, 0.35, 0, 0);
    ctx.font = 'bold 56px "Bebas Neue"';
    ctx.textAlign = 'center';
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillText('CLUB RING', 2, 2);
    // Bronze text
    const textGrad = ctx.createLinearGradient(-80, 0, 80, 0);
    textGrad.addColorStop(0, '#8B6914');
    textGrad.addColorStop(0.5, '#D4A843');
    textGrad.addColorStop(1, '#8B6914');
    ctx.fillStyle = textGrad;
    ctx.fillText('CLUB RING', 0, 0);
    ctx.restore();

    // === CORNER POSTS — at ring corners ===
    const postH = 70; // front posts
    const bPostH = 50; // back posts

    // Front Left — WHITE
    ctx.fillStyle = '#ddd';
    ctx.fillRect(FL.x - 4, FL.y - postH, 8, postH);
    ctx.fillStyle = '#eee';
    ctx.beginPath(); ctx.arc(FL.x, FL.y - postH, 5, 0, Math.PI * 2); ctx.fill();

    // Front Right — WHITE
    ctx.fillStyle = '#ddd';
    ctx.fillRect(FR.x - 4, FR.y - postH, 8, postH);
    ctx.fillStyle = '#eee';
    ctx.beginPath(); ctx.arc(FR.x, FR.y - postH, 5, 0, Math.PI * 2); ctx.fill();

    // Back Left — WHITE
    ctx.fillStyle = '#ccc';
    ctx.fillRect(BL.x - 2, BL.y - bPostH, 5, bPostH);
    ctx.fillStyle = '#ddd';
    ctx.beginPath(); ctx.arc(BL.x, BL.y - bPostH, 3, 0, Math.PI * 2); ctx.fill();

    // Back Right — WHITE
    ctx.fillStyle = '#ccc';
    ctx.fillRect(BR.x - 2, BR.y - bPostH, 5, bPostH);
    ctx.fillStyle = '#ddd';
    ctx.beginPath(); ctx.arc(BR.x, BR.y - bPostH, 3, 0, Math.PI * 2); ctx.fill();

    // === ROPES — connect posts ===
    const ropeC = ['#cc2222', '#ffffff', '#cc2222'];
    const ropeH = [0, 20, 40];

    for (let r = 0; r < 3; r++) {
        const h = ropeH[r];
        const c = ropeC[r];

        // Left: FL → BL
        ctx.strokeStyle = c;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(FL.x, FL.y - postH + h);
        ctx.lineTo(BL.x, BL.y - bPostH + h);
        ctx.stroke();

        // Right: FR → BR
        ctx.beginPath();
        ctx.moveTo(FR.x, FR.y - postH + h);
        ctx.lineTo(BR.x, BR.y - bPostH + h);
        ctx.stroke();

        // Back: BL → BR
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(BL.x, BL.y - bPostH + h);
        ctx.lineTo(BR.x, BR.y - bPostH + h);
        ctx.stroke();
    }
}

// ===== HEAVY BAG =====
const bag = { x: 480, y: GROUND - 40, angle: 0, vel: 0, hp: 100 };

function drawBag() {
    ctx.save();
    ctx.translate(bag.x, bag.y);
    ctx.rotate(bag.angle);

    // Chain
    ctx.strokeStyle = '#777';
    ctx.lineWidth = 3;
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(0, -120 + i * 10, 4, 0, Math.PI * 2);
        ctx.stroke();
    }

    // Bag
    const bg = ctx.createLinearGradient(-28, -110, 28, -110);
    bg.addColorStop(0, '#2a0808');
    bg.addColorStop(0.3, '#7b2020');
    bg.addColorStop(0.7, '#7b2020');
    bg.addColorStop(1, '#2a0808');
    ctx.fillStyle = bg;

    ctx.beginPath();
    ctx.moveTo(-24, -105);
    ctx.bezierCurveTo(-28, -70, -26, -20, -22, 0);
    ctx.quadraticCurveTo(0, 15, 22, 0);
    ctx.bezierCurveTo(26, -20, 28, -70, 24, -105);
    ctx.quadraticCurveTo(0, -115, -24, -105);
    ctx.fill();

    // Texture
    ctx.strokeStyle = 'rgba(0,0,0,0.12)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(-20, -90 + i * 25);
        ctx.quadraticCurveTo(0, -87 + i * 25, 20, -90 + i * 25);
        ctx.stroke();
    }

    // Highlight — появляется при ударе
    if (Math.abs(bag.vel) > 0.005) {
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.beginPath();
        ctx.ellipse(-6, -55, 5, 40, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}

function updateBag() {
    bag.vel += -bag.angle * 0.004;
    bag.vel *= 0.95;
    bag.angle += bag.vel;
}

function hitBag(type) {
    const force = { jab: 0.025, cross: 0.05, hook: 0.06, uppercut: 0.035 }[type] || 0.04;
    bag.vel += force;
    bag.hp = Math.max(0, bag.hp - { jab: 4, cross: 7, hook: 9, uppercut: 14 }[type] || 6);
}

// ===== EFFECTS =====
let effects = [];
function addEffect(x, y, type) {
    const colors = { PunchRight: ['#fff','#ffcc00'], PunchLeft: ['#ff4400','#ff0000'], PunchUp: ['#ff0000','#ff6600'] };
    const c = colors[type] || ['#fff','#ffcc00'];
    effects.push({
        x, y, frame: 0, max: 15,
        particles: Array.from({length: 10}, () => ({
            x: 0, y: 0,
            vx: (Math.random() - 0.5) * 7,
            vy: (Math.random() - 0.5) * 7 - 2,
            size: 1.5 + Math.random() * 3,
            color: c[Math.floor(Math.random() * 2)]
        }))
    });
}

function updateEffects() {
    effects = effects.filter(e => {
        e.frame++;
        e.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.12; });
        return e.frame < e.max;
    });
}

function drawEffects() {
    effects.forEach(e => {
        const a = 1 - e.frame / e.max;
        ctx.save();
        ctx.translate(e.x, e.y);
        ctx.globalAlpha = a;

        e.particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size * a, 0, Math.PI * 2); ctx.fill();
        });

        ctx.restore();
    });
}

// ===== HUD =====
function drawHUD(p1, p2, timer, round, scores) {
    // Top bar background
    ctx.fillStyle = 'rgba(10,10,11,0.85)';
    ctx.fillRect(0, 0, W, 60);

    // Bronze divider
    const divG = ctx.createLinearGradient(0, 59, W, 59);
    divG.addColorStop(0, 'transparent');
    divG.addColorStop(0.5, '#C9A227');
    divG.addColorStop(1, 'transparent');
    ctx.fillStyle = divG;
    ctx.fillRect(0, 59, W, 1);

    drawHP(20, 12, p1.health, 100, false, p1.name);
    drawHP(W - 270, 12, p2.health, 100, true, p2.name);

    // Timer
    const cx = W / 2;
    ctx.font = '12px "Bebas Neue"';
    ctx.fillStyle = '#C9A227';
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText(`РАУНД ${round}`, cx, 6);
    ctx.fillStyle = '#0A0A0B';
    ctx.beginPath(); ctx.arc(cx, 40, 22, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#C9A227'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, 40, 22, 0, Math.PI * 2); ctx.stroke();
    ctx.font = '20px "Bebas Neue"';
    ctx.fillStyle = timer <= 10 ? '#ef5350' : '#F0F0F4';
    ctx.textBaseline = 'middle';
    ctx.fillText(Math.ceil(timer).toString(), cx, 40);

    // Score
    ctx.font = '10px "Montserrat"';
    ctx.fillStyle = '#C9A227';
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText(`${scores[0]} — ${scores[1]}`, W / 2, 72);

    // Stamina
    [{ p: p1, x: 20 }, { p: p2, x: W - 270 }].forEach(({ p, x: sx }) => {
        ctx.fillStyle = '#1A1A1F';
        ctx.fillRect(sx, 46, 250, 6);
        ctx.fillStyle = p.stamina > 25 ? '#C9A227' : '#ef5350';
        if (sx < W / 2) ctx.fillRect(sx, 46, (p.stamina / 100) * 250, 6);
        else ctx.fillRect(sx + (1 - p.stamina / 100) * 250, 46, (p.stamina / 100) * 250, 6);
        ctx.strokeStyle = '#2A2A35'; ctx.lineWidth = 1;
        ctx.strokeRect(sx, 46, 250, 6);
    });

    // Кнопки соцсетей — те же позиции что и на тренировке
    const socialY = 82;
    const socialW = 130, socialH = 30;

    // Club Ring YouTube — слева
    const ytX = W / 2 - 170;
    const ytHover = mouseX > ytX && mouseX < ytX + socialW && mouseY > socialY && mouseY < socialY + socialH;
    ctx.fillStyle = ytHover ? 'rgba(201,162,39,0.2)' : 'rgba(10,10,11,0.85)';
    ctx.fillRect(ytX, socialY, socialW, socialH);
    ctx.strokeStyle = '#C9A227'; ctx.lineWidth = 1;
    ctx.strokeRect(ytX, socialY, socialW, socialH);
    ctx.font = '14px "Bebas Neue"';
    ctx.fillStyle = '#C9A227';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('Club Ring YouTube', ytX + socialW / 2, socialY + socialH / 2);

    // Club Ring Telegram — справа
    const tgX = W / 2 + 40;
    const tgHover = mouseX > tgX && mouseX < tgX + socialW && mouseY > socialY && mouseY < socialY + socialH;
    ctx.fillStyle = tgHover ? 'rgba(201,162,39,0.2)' : 'rgba(10,10,11,0.85)';
    ctx.fillRect(tgX, socialY, socialW, socialH);
    ctx.strokeStyle = '#C9A227'; ctx.lineWidth = 1;
    ctx.strokeRect(tgX, socialY, socialW, socialH);
    ctx.fillStyle = '#C9A227';
    ctx.textBaseline = 'middle';
    ctx.fillText('Club Ring Telegram', tgX + socialW / 2, socialY + socialH / 2);
    ctx.textBaseline = 'alphabetic';
}

function drawHP(x, y, hp, max, flip, name) {
    const bw = 250, bh = 28;
    const fill = (hp / max) * bw;
    ctx.fillStyle = '#1A1A1F';
    ctx.fillRect(x - 3, y - 3, bw + 6, bh + 6);
    ctx.fillStyle = '#111114';
    ctx.fillRect(x, y, bw, bh);
    const col = hp > 60 ? '#2D6A4F' : hp > 30 ? '#C9A227' : '#7B2D2D';
    ctx.fillStyle = col;
    if (flip) ctx.fillRect(x + bw - fill, y, fill, bh);
    else ctx.fillRect(x, y, fill, bh);
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    if (flip) ctx.fillRect(x + bw - fill, y, fill, bh * 0.4);
    else ctx.fillRect(x, y, fill, bh * 0.4);
    ctx.strokeStyle = '#2A2A35'; ctx.lineWidth = 1;
    ctx.strokeRect(x, y, bw, bh);
    ctx.font = '9px "Montserrat"';
    ctx.fillStyle = '#B0B1B8';
    ctx.textAlign = flip ? 'right' : 'left';
    ctx.fillText(name, flip ? x + bw - 5 : x + 5, y - 6);
}

// ===== DRAW BOXER (real sprites) =====
function drawBoxer(b) {
    const spriteSet = b.useBlue ? spritesBlue : sprites;
    const anim = spriteSet[b.anim];
    if (!anim || anim.length === 0) return;
    const frame = anim[b.animFrame % anim.length];
    if (!frame) return;

    ctx.save();
    ctx.translate(b.x, b.y);

    // Shadow — larger, softer, on canvas floor
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 5, spriteW * 0.4, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    // Inner shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(0, 3, spriteW * 0.25, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Flip for facing
    if (b.facing === -1) ctx.scale(-1, 1);

    // Glow on attack
    if (b.state === 'attack') {
        ctx.shadowColor = b.useBlue ? '#4488ff' : '#ff4444';
        ctx.shadowBlur = 15;
    }

    // Draw sprite
    ctx.drawImage(frame, -spriteW / 2, -spriteH, spriteW, spriteH);

    ctx.shadowBlur = 0;

    // Block shimmer
    if (b.state === 'block') {
        ctx.strokeStyle = 'rgba(100,200,255,0.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.ellipse(0, -spriteH / 2, spriteW * 0.5, spriteH * 0.45, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    ctx.restore();
}

// ===== GAME STATE =====
const G = {
    phase: 'menu', mode: null, difficulty: 'easy',
    round: 1, timer: 99, scores: [0, 0],
    frame: 0, shake: 0,
    fighters: [], ai: null,
    bagHits: 0
};

// ===== AI =====
class AI {
    constructor(diff) {
        this.r = diff === 'easy' ? 20 : diff === 'medium' ? 10 : 4;
        this.a = diff === 'easy' ? 0.5 : diff === 'medium' ? 0.7 : 0.9;
        this.b = diff === 'easy' ? 0.15 : diff === 'medium' ? 0.35 : 0.55;
        this.t = 0; this.d = null;
    }
    update(me, op) {
        this.t--;
        if (this.t > 0) return this.d;
        const d = Math.abs(me.x - op.x), dx = op.x - me.x;
        const a = { move: 0, punch: null, block: false };

        if (d < 150) {
            if (op.state === 'attack' && Math.random() < this.b) {
                a.block = true;
            } else if (Math.random() < this.a) {
                const r = Math.random();
                if (r < 0.3) a.punch = 'jab';
                else if (r < 0.55) a.punch = 'cross';
                else if (r < 0.75) a.punch = 'hook';
                else a.punch = 'uppercut';
            } else {
                a.move = dx > 0 ? -1 : 1;
            }
        } else {
            a.move = dx > 0 ? 1 : -1;
        }

        this.t = this.r + Math.floor(Math.random() * 5);
        this.d = a; return a;
    }
}

// ===== GAME FLOW =====
function startTraining() {
    initAudio();
    G.phase = 'training';
    G.fighters = [new Boxer(300, 1, null, 'YOU')];
    G.bagHits = 0;
    bag.hp = 100; bag.angle = 0; bag.vel = 0;
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('controlsDisplay').classList.remove('hidden');
}

function startFight(mode) {
    initAudio();
    G.mode = mode;
    G.phase = 'intro';
    G.round = 1;
    G.scores = [0, 0];
    G.fighters = [
        new Boxer(200, 1, null, 'ИГРОК 1', false),
        new Boxer(600, -1, null, mode === 'ai' ? 'КОМПЬЮТЕР' : 'ИГРОК 2', true)
    ];
    G.ai = mode === 'ai' ? new AI(G.difficulty) : null;
    G.timer = 99;
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('resultScreen').classList.add('hidden');
    document.getElementById('controlsDisplay').classList.add('hidden');
    snd('bell');
    setTimeout(() => G.phase = 'fight', 1500);
}

function endRound(winner) {
    G.phase = 'roundEnd';
    if (winner === 0) {
        if (G.fighters[0].health > G.fighters[1].health) G.scores[0]++;
        else if (G.fighters[1].health > G.fighters[0].health) G.scores[1]++;
    } else G.scores[winner - 1]++;
    snd('bell');

    G.round++;
    if (G.round > 3) {
        setTimeout(() => {
            G.phase = 'result';
            const ko = G.scores[0] >= 2 || G.scores[1] >= 2;
            const w = G.scores[0] > G.scores[1] ? 'ИГРОК 1 ПОБЕДИЛ!' : G.scores[1] > G.scores[0] ? (G.mode === 'ai' ? 'КОМПЬЮТЕР ПОБЕДИЛ!' : 'ИГРОК 2 ПОБЕДИЛ!') : 'НИЧЬЯ!';
            document.getElementById('resultTitle').textContent = ko ? 'НОКАУТ!' : 'ВРЕМЯ ВЫШЛО!';
            document.getElementById('resultWinner').textContent = w;
            document.getElementById('resultScreen').classList.remove('hidden');
        }, 1500);
    } else {
        setTimeout(() => {
            G.fighters.forEach((p, i) => { p.x = i === 0 ? 200 : 600; p.health = 100; p.stamina = 100; p.state = 'idle'; p.setAnim('Idle', 4); p.cooldown = 0; p.hurtTimer = 0; });
            G.timer = 99; G.phase = 'intro'; snd('bell');
            setTimeout(() => G.phase = 'fight', 1500);
        }, 1500);
    }
}

function showMenu() {
    G.phase = 'menu';
    document.getElementById('mainMenu').classList.remove('hidden');
    document.getElementById('resultScreen').classList.add('hidden');
    document.getElementById('controlsDisplay').classList.add('hidden');
}

function checkHit(atk, def) {
    if (!atk.isAttackActive() || atk.hitConnected) return false;
    const a = atk.getAttackBox(atk.anim);
    const d = { x: def.x - spriteW * 0.3, y: def.y - spriteH, w: spriteW * 0.6, h: spriteH };
    if (a.x < d.x + d.w && a.x + a.w > d.x && a.y < d.y + d.h && a.y + a.h > d.y) {
        atk.hitConnected = true; return true;
    }
    return false;
}

// ===== MAIN LOOP =====
function loop() {
    G.frame++;
    const f = G.frame;

    if (G.phase === 'training') {
        const p = G.fighters[0];
        if (keys['KeyA']) p.move(-1); else if (keys['KeyD']) p.move(1); else p.move(0);
        if (pressed('Space')) p.punch('jab');
        if (pressed('KeyG')) p.punch('cross');
        if (pressed('KeyE')) p.punch('uppercut');
        p.block(keys['KeyQ']);
        p.update();
        updateBag();

        // Check bag hit
        if (p.state === 'attack' && p.isAttackActive() && !p.hitConnected) {
            const ab = p.getAttackBox(p.anim);
            const bb = { x: bag.x - 40, y: bag.y - 120, w: 80, h: 130 };
            if (ab.x < bb.x + bb.w && ab.x + ab.w > bb.x && ab.y < bb.y + bb.h && ab.y + ab.h > bb.y) {
                hitBag(p.anim === 'PunchUp' ? 'uppercut' : p.anim === 'PunchLeft' ? 'hook' : 'cross');
                addEffect(bag.x, bag.y - 50, p.anim);
                p.hitConnected = true;
                G.bagHits++;
                G.shake = 5;
            }
        }

        drawArena(f);
        drawBag();
        drawBoxer(p);
        drawEffects();

        // HUD
        ctx.font = '10px "Press Start 2P"';
        ctx.fillStyle = '#fff'; ctx.textAlign = 'left';
        ctx.fillText(`УДАРЫ: ${G.bagHits}`, 20, 25);

        // HUD тренировки
        ctx.fillStyle = 'rgba(10,10,11,0.85)';
        ctx.fillRect(0, 0, W, 38);
        const divG = ctx.createLinearGradient(0, 37, W, 37);
        divG.addColorStop(0, 'transparent');
        divG.addColorStop(0.5, '#C9A227');
        divG.addColorStop(1, 'transparent');
        ctx.fillStyle = divG;
        ctx.fillRect(0, 37, W, 1);

        ctx.fillStyle = '#1A1A1F';
        ctx.fillRect(W / 2 - 100, 10, 200, 14);
        ctx.fillStyle = '#C9A227';
        ctx.fillRect(W / 2 - 100, 10, bag.hp * 2, 14);
        ctx.strokeStyle = '#2A2A35'; ctx.lineWidth = 1;
        ctx.strokeRect(W / 2 - 100, 10, 200, 14);

        // Reset bag when HP reaches 0
        if (bag.hp <= 0) {
            bag.hp = 100;
            bag.angle = 0;
            bag.vel = 0;
        }

        // Кнопка "В БОЙ" — по центру
        const btnX = W / 2 - 65, btnY = 85, btnW = 130, btnH = 25;
        const btnHover = mouseX > btnX && mouseX < btnX + btnW && mouseY > btnY && mouseY < btnY + btnH;
        ctx.fillStyle = btnHover ? 'rgba(201,162,39,0.2)' : 'rgba(10,10,11,0.85)';
        ctx.fillRect(btnX, btnY, btnW, btnH);
        ctx.strokeStyle = '#C9A227';
        ctx.lineWidth = 1;
        ctx.strokeRect(btnX, btnY, btnW, btnH);
        ctx.font = '10px "Montserrat"';
        ctx.fillStyle = '#C9A227';
        ctx.textAlign = 'center';
        ctx.fillText('В БОЙ', btnX + btnW / 2, btnY + 16);

        // Club Ring YouTube — слева от "В БОЙ"
        const ytX = W / 2 - 300, ytY = 82, ytW = 130, ytH = 30;
        const ytHover = mouseX > ytX && mouseX < ytX + ytW && mouseY > ytY && mouseY < ytY + ytH;
        ctx.fillStyle = ytHover ? 'rgba(201,162,39,0.2)' : 'rgba(10,10,11,0.85)';
        ctx.fillRect(ytX, ytY, ytW, ytH);
        ctx.strokeStyle = '#C9A227';
        ctx.lineWidth = 1;
        ctx.strokeRect(ytX, ytY, ytW, ytH);
        ctx.font = '14px "Bebas Neue"';
        ctx.fillStyle = '#C9A227';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('Club Ring YouTube', ytX + ytW / 2, ytY + ytH / 2);

        // Club Ring Telegram — справа от "В БОЙ"
        const tgX = W / 2 + 170, tgY = 82, tgW = 130, tgH = 30;
        const tgHover = mouseX > tgX && mouseX < tgX + tgW && mouseY > tgY && mouseY < tgY + tgH;
        ctx.fillStyle = tgHover ? 'rgba(201,162,39,0.2)' : 'rgba(10,10,11,0.85)';
        ctx.fillRect(tgX, tgY, tgW, tgH);
        ctx.strokeStyle = '#C9A227';
        ctx.lineWidth = 1;
        ctx.strokeRect(tgX, tgY, tgW, tgH);
        ctx.fillStyle = '#C9A227';
        ctx.fillText('Club Ring Telegram', tgX + tgW / 2, tgY + tgH / 2);
        ctx.textBaseline = 'alphabetic';

        if (btnClick && btnHover) startFight('ai');

    } else if (G.phase === 'fight' || G.phase === 'ko') {
        document.getElementById('controlsDisplay').classList.add('hidden');
        const [p1, p2] = G.fighters;

        if (G.phase === 'fight') {
            if (keys['KeyA']) p1.move(-1); else if (keys['KeyD']) p1.move(1); else p1.move(0);
            if (pressed('Space')) p1.punch('jab');
            if (pressed('KeyG')) p1.punch('cross');
            if (pressed('KeyE')) p1.punch('uppercut');
            p1.block(keys['KeyQ']);

            if (G.ai) {
                const a = G.ai.update(p2, p1);
                p2.move(a.move);
                if (a.punch) p2.punch(a.punch);
                p2.block(a.block);
            } else {
                if (keys['ArrowLeft']) p2.move(-1); else if (keys['ArrowRight']) p2.move(1); else p2.move(0);
                if (pressed('Numpad0') || pressed('Enter')) p2.punch('jab');
                if (pressed('Numpad1')) p2.punch('cross');
                if (pressed('Numpad2')) p2.punch('hook');
                if (pressed('Numpad3')) p2.punch('uppercut');
                p2.block(keys['ShiftLeft'] || keys['ShiftRight']);
            }

            if (checkHit(p1, p2)) {
                const dmg = { PunchRight: 10, PunchLeft: 14, PunchUp: 18 }[p1.anim] || 10;
                p2.takeDamage(dmg, p1);
                addEffect(p2.x, p2.y - spriteH / 2, p1.anim);
                G.shake = p1.anim === 'PunchUp' ? 12 : 6;
            }
            if (checkHit(p2, p1)) {
                const dmg = { PunchRight: 10, PunchLeft: 14, PunchUp: 18 }[p2.anim] || 10;
                p1.takeDamage(dmg, p2);
                addEffect(p1.x, p1.y - spriteH / 2, p2.anim);
                G.shake = p2.anim === 'PunchUp' ? 12 : 6;
            }

            if (p1.health <= 0 || p2.health <= 0) {
                setTimeout(() => endRound(p1.health <= 0 ? 2 : 1), 1200);
                G.phase = 'ko';
            }

            G.timer -= 1 / 60;
            if (G.timer <= 0) { G.timer = 0; endRound(0); }
        }

        p1.update(); p2.update();

        // Boxer collision — sprites are 224px wide, need enough space
        const minDist = spriteW * 0.6;
        const dx = p2.x - p1.x;
        const dist = Math.abs(dx);
        if (dist < minDist) {
            const push = (minDist - dist) / 2 + 1;
            if (dx > 0) { p1.x -= push; p2.x += push; }
            else { p1.x += push; p2.x -= push; }
            // Stop movement
            p1.vx = 0;
            p2.vx = 0;
        }

        // Keep boxers inside ring (between front posts)
        const ringLeft = W * 0.08 + 20;
        const ringRight = W * 0.92 - 20;
        p1.x = Math.max(ringLeft, Math.min(ringRight, p1.x));
        p2.x = Math.max(ringLeft, Math.min(ringRight, p2.x));

        p1.facing = p1.x < p2.x ? 1 : -1;
        p2.facing = p2.x < p1.x ? 1 : -1;
        updateEffects();
        if (G.shake > 0) G.shake -= 0.5;

        ctx.save();
        if (G.shake > 0) ctx.translate((Math.random() - 0.5) * G.shake * 2, (Math.random() - 0.5) * G.shake * 2);
        drawArena(f);
        drawBoxer(p1);
        drawBoxer(p2);
        drawHUD(p1, p2, G.timer, G.round, G.scores);
        drawEffects();

        if (G.phase === 'intro') {
            ctx.fillStyle = 'rgba(10,10,11,0.7)';
            ctx.fillRect(0, 0, W, H);
            ctx.font = '48px "Bebas Neue"';
            ctx.fillStyle = '#C9A227'; ctx.textAlign = 'center';
            ctx.fillText(`РАУНД ${G.round}`, W / 2, H / 2 - 20);
            ctx.font = '24px "Montserrat"';
            ctx.fillStyle = '#F0F0F4';
            ctx.fillText('БОЙ!', W / 2, H / 2 + 20);
        }
        if (G.phase === 'ko') {
            ctx.fillStyle = 'rgba(10,10,11,0.65)';
            ctx.fillRect(0, 0, W, H);
            ctx.font = '64px "Bebas Neue"';
            ctx.fillStyle = '#C9A227'; ctx.textAlign = 'center';
            ctx.fillText('НОКАУТ!', W / 2, H / 2);
        }
        ctx.restore();
    }

    clearJP();
    requestAnimationFrame(loop);
}

// ===== INIT =====
document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        G.difficulty = btn.dataset.diff;
    });
});

loadSprites(() => {
    console.log('Sprites loaded:', spritesLoaded);
    loop();
    initTouchControls();
});

// ===== MOBILE TOUCH CONTROLS =====
function initTouchControls() {
    const touch = { left: false, right: false, jump: false, block: false };

    function setupBtn(id, onDown, onUp) {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('touchstart', e => { e.preventDefault(); onDown(); el.classList.add('active'); });
        el.addEventListener('touchend', e => { e.preventDefault(); onUp(); el.classList.remove('active'); });
        el.addEventListener('touchcancel', e => { e.preventDefault(); onUp(); el.classList.remove('active'); });
    }

    setupBtn('btnLeft',
        () => { touch.left = true; keys['KeyA'] = true; },
        () => { touch.left = false; keys['KeyA'] = false; }
    );
    setupBtn('btnRight',
        () => { touch.right = true; keys['KeyD'] = true; },
        () => { touch.right = false; keys['KeyD'] = false; }
    );
    setupBtn('btnBlock',
        () => { touch.block = true; keys['KeyQ'] = true; },
        () => { touch.block = false; keys['KeyQ'] = false; }
    );

    function tapOnce(id, keyCode) {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('touchstart', e => {
            e.preventDefault();
            jp[keyCode] = true;
            keys[keyCode] = true;
            el.classList.add('active');
        });
        el.addEventListener('touchend', e => {
            e.preventDefault();
            keys[keyCode] = false;
            el.classList.remove('active');
        });
    }

    tapOnce('btnJab', 'Space');
    tapOnce('btnCross', 'KeyG');
    tapOnce('btnUpper', 'KeyE');
}
