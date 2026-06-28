// ===== CLUB RING BOXING — SPRITE EDITION =====
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const W = 800, H = 500, GROUND = 410;

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
document.addEventListener('keydown', e => { if (!keys[e.code]) jp[e.code] = true; keys[e.code] = true; e.preventDefault(); });
document.addEventListener('keyup', e => { keys[e.code] = false; });
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
        const r = { jab: 55, cross: 65, hook: 58, uppercut: 50 }[type] || 55;
        const ox = f === 1 ? 10 : -(10 + r);
        const oy = type === 'uppercut' ? -60 : -50;
        return { x: this.x + ox, y: this.y + oy, w: r, h: 35 };
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

        if (type === 'jab' || type === 'cross') this.setAnim('PunchRight', 3);
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

    jump() {
        if (this.y >= GROUND - 2 && this.state !== 'ko' && this.hurtTimer <= 0 && this.state !== 'attack') {
            this.vy = -14;
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

// ===== ARENA =====
function drawArena(f) {
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#080015');
    bg.addColorStop(0.3, '#0f0525');
    bg.addColorStop(1, '#0d0520');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Spotlights
    ctx.save();
    [200, 600].forEach((cx, i) => {
        const sg = ctx.createRadialGradient(cx, 50, 10, cx, GROUND - 80, 250);
        sg.addColorStop(0, `rgba(255,255,255,${0.05 + Math.sin(f * 0.02 + i) * 0.02})`);
        sg.addColorStop(1, 'transparent');
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.moveTo(cx - 20, 50);
        ctx.lineTo(cx - 120, GROUND - 80);
        ctx.lineTo(cx + 120, GROUND - 80);
        ctx.lineTo(cx + 20, 50);
        ctx.fill();
    });
    ctx.restore();

    // Crowd
    for (let row = 0; row < 3; row++) {
        const yy = GROUND - 130 - row * 22;
        for (let i = 0; i < 24; i++) {
            const ax = 8 + i * 34 + (row % 2) * 17;
            const ay = yy + Math.sin(i * 0.7 + f * 0.025 + row) * 3;
            ctx.fillStyle = `rgba(${20 + row * 8},${20 + row * 8},${30 + row * 8},${0.5 + row * 0.15})`;
            ctx.beginPath(); ctx.arc(ax, ay, 6 - row, 0, Math.PI * 2); ctx.fill();
            ctx.fillRect(ax - 3, ay + 5, 6, 7 - row);
        }
    }

    // Floor
    ctx.fillStyle = '#0a0a18';
    ctx.fillRect(0, GROUND, W, H - GROUND);

    // Mat
    const matG = ctx.createLinearGradient(0, GROUND, 0, GROUND + 40);
    matG.addColorStop(0, '#b81020');
    matG.addColorStop(1, '#8a0a15');
    ctx.fillStyle = matG;
    ctx.fillRect(40, GROUND, W - 80, 40);

    ctx.fillStyle = '#fff';
    ctx.fillRect(40, GROUND + 3, W - 80, 2);
    ctx.fillRect(40, GROUND + 35, W - 80, 2);

    // Ropes
    for (let i = 0; i < 3; i++) {
        const ry = GROUND - 15 - i * 42;
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(50, ry); ctx.lineTo(W - 50, ry); ctx.stroke();
    }

    // Posts
    [45, W - 55].forEach(px => {
        ctx.fillStyle = '#888';
        ctx.fillRect(px, GROUND - 135, 10, 150);
        ctx.fillStyle = '#c8102e';
        ctx.beginPath(); ctx.arc(px + 5, GROUND - 135, 7, 0, Math.PI * 2); ctx.fill();
    });

    // Logo
    ctx.font = '11px "Press Start 2P"';
    ctx.fillStyle = '#c8102e';
    ctx.textAlign = 'center';
    ctx.fillText('CLUB RING', W / 2, GROUND - 140);
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

    // Highlight
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.beginPath();
    ctx.ellipse(-6, -55, 5, 40, 0, 0, Math.PI * 2);
    ctx.fill();

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

        const sz = 20 + e.frame * 2;
        const fg = ctx.createRadialGradient(0, 0, 0, 0, 0, sz);
        fg.addColorStop(0, 'rgba(255,255,255,0.8)');
        fg.addColorStop(0.4, 'rgba(255,150,0,0.4)');
        fg.addColorStop(1, 'transparent');
        ctx.fillStyle = fg;
        ctx.beginPath(); ctx.arc(0, 0, sz, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = '#ffcc00';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(0, 0, sz + e.frame * 3, 0, Math.PI * 2); ctx.stroke();

        e.particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size * a, 0, Math.PI * 2); ctx.fill();
        });

        ctx.restore();
    });
}

// ===== HUD =====
function drawHUD(p1, p2, timer, round, scores) {
    drawHP(20, 12, p1.health, 100, false, p1.name);
    drawHP(W - 270, 12, p2.health, 100, true, p2.name);

    // Timer
    const cx = W / 2;
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(cx, 33, 30, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#c8102e'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(cx, 33, 30, 0, Math.PI * 2); ctx.stroke();
    ctx.font = '22px "Press Start 2P"';
    ctx.fillStyle = timer <= 10 ? '#e74c3c' : '#fff';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.shadowColor = '#000'; ctx.shadowBlur = 4;
    ctx.fillText(Math.ceil(timer).toString(), cx, 35);
    ctx.shadowBlur = 0;
    ctx.font = '7px "Press Start 2P"';
    ctx.fillStyle = '#888';
    ctx.fillText(`ROUND ${round}`, cx, 57);

    // Score
    ctx.font = '10px "Press Start 2P"';
    ctx.fillStyle = '#c8102e';
    ctx.textAlign = 'center';
    ctx.fillText(`${scores[0]} — ${scores[1]}`, W / 2, 72);

    // Stamina
    [{ p: p1, x: 20 }, { p: p2, x: W - 270 }].forEach(({ p, x: sx }) => {
        ctx.fillStyle = '#111';
        ctx.fillRect(sx, 46, 250, 6);
        ctx.fillStyle = p.stamina > 25 ? '#2980b9' : '#e74c3c';
        if (sx < W / 2) ctx.fillRect(sx, 46, (p.stamina / 100) * 250, 6);
        else ctx.fillRect(sx + (1 - p.stamina / 100) * 250, 46, (p.stamina / 100) * 250, 6);
        ctx.strokeStyle = '#333'; ctx.lineWidth = 1;
        ctx.strokeRect(sx, 46, 250, 6);
    });
}

function drawHP(x, y, hp, max, flip, name) {
    const bw = 250, bh = 28;
    const fill = (hp / max) * bw;
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(x - 3, y - 3, bw + 6, bh + 6);
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(x, y, bw, bh);
    const col = hp > 60 ? '#27ae60' : hp > 30 ? '#e67e22' : '#c0392b';
    ctx.fillStyle = col;
    if (flip) ctx.fillRect(x + bw - fill, y, fill, bh);
    else ctx.fillRect(x, y, fill, bh);
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    if (flip) ctx.fillRect(x + bw - fill, y, fill, bh * 0.4);
    else ctx.fillRect(x, y, fill, bh * 0.4);
    ctx.strokeStyle = '#555'; ctx.lineWidth = 2;
    ctx.strokeRect(x, y, bw, bh);
    ctx.font = '8px "Press Start 2P"';
    ctx.fillStyle = '#ccc';
    ctx.textAlign = flip ? 'right' : 'left';
    ctx.fillText(name, flip ? x + bw - 5 : x + 5, y - 5);
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

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(0, 0, spriteW * 0.35, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Flip for facing
    if (b.facing === -1) ctx.scale(-1, 1);

    // Draw sprite
    if (frame instanceof HTMLCanvasElement) {
        ctx.drawImage(frame, -spriteW / 2, -spriteH, spriteW, spriteH);
    } else {
        ctx.drawImage(frame, -spriteW / 2, -spriteH, spriteW, spriteH);
    }

    // Player indicator above head
    if (b.tint) {
        ctx.fillStyle = b.tint;
        ctx.beginPath();
        ctx.moveTo(0, -spriteH - 12);
        ctx.lineTo(-6, -spriteH - 4);
        ctx.lineTo(6, -spriteH - 4);
        ctx.fill();
    }

    // Hurt flash
    if (b.state === 'hurt' && b.hurtTimer > 10) {
        ctx.fillStyle = 'rgba(255,50,50,0.3)';
        ctx.fillRect(-spriteW / 2, -spriteH, spriteW, spriteH);
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
        this.r = diff === 'easy' ? 30 : diff === 'medium' ? 15 : 6;
        this.a = diff === 'easy' ? 0.3 : diff === 'medium' ? 0.6 : 0.85;
        this.b = diff === 'easy' ? 0.1 : diff === 'medium' ? 0.3 : 0.5;
        this.t = 0; this.d = null;
    }
    update(me, op) {
        this.t--;
        if (this.t > 0) return this.d;
        const d = Math.abs(me.x - op.x), dx = op.x - me.x;
        const a = { move: 0, punch: null, block: false };
        if (d < 70) {
            if (op.state === 'attack' && Math.random() < this.b) a.block = true;
            else if (Math.random() < this.a) {
                const r = Math.random();
                if (r < 0.35) a.punch = 'jab';
                else if (r < 0.55) a.punch = 'cross';
                else if (r < 0.72) a.punch = 'hook';
                else a.punch = 'uppercut';
            } else a.move = dx > 0 ? -1 : 1;
        } else if (d < 140) {
            if (Math.random() < this.a * 0.8) a.move = dx > 0 ? 1 : -1;
        } else a.move = dx > 0 ? 1 : -1;
        this.t = this.r + Math.floor(Math.random() * 7);
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
        new Boxer(200, 1, null, 'PLAYER 1', false),
        new Boxer(600, -1, null, mode === 'ai' ? 'CPU' : 'PLAYER 2', true)
    ];
    G.ai = mode === 'ai' ? new AI(G.difficulty) : null;
    G.timer = 99;
    document.getElementById('mainMenu').classList.add('hidden');
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

    if (G.scores[0] >= 2 || G.scores[1] >= 2 || G.round >= 3) {
        setTimeout(() => {
            G.phase = 'result';
            const ko = G.scores[0] >= 2 || G.scores[1] >= 2;
            const w = G.scores[0] > G.scores[1] ? 'PLAYER 1 WINS!' : G.scores[1] > G.scores[0] ? (G.mode === 'ai' ? 'CPU WINS!' : 'PLAYER 2 WINS!') : 'DRAW!';
            document.getElementById('resultTitle').textContent = ko ? 'K.O.!' : 'TIME UP!';
            document.getElementById('resultWinner').textContent = w;
            document.getElementById('resultScreen').classList.remove('hidden');
        }, 1500);
    } else {
        G.round++;
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
        if (keys['KeyW']) p.jump();
        if (pressed('Space')) p.punch('jab');
        if (pressed('KeyF')) p.punch('cross');
        if (pressed('KeyG')) p.punch('hook');
        if (pressed('KeyE')) p.punch('uppercut');
        p.block(keys['KeyQ']);
        p.update();
        updateBag();

        // Check bag hit
        if (p.state === 'attack' && p.isAttackActive() && !p.hitConnected) {
            const ab = p.getAttackBox(p.anim);
            const bb = { x: bag.x - 25, y: bag.y - 110, w: 50, h: 120 };
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
        ctx.fillText(`HITS: ${G.bagHits}`, 20, 25);

        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(W / 2 - 100, 12, 200, 14);
        ctx.fillStyle = '#c8102e';
        ctx.fillRect(W / 2 - 100, 12, bag.hp * 2, 14);
        ctx.strokeStyle = '#555'; ctx.lineWidth = 1;
        ctx.strokeRect(W / 2 - 100, 12, 200, 14);
        ctx.font = '7px "Press Start 2P"';
        ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
        ctx.fillText('HEAVY BAG', W / 2, 10);

        if (bag.hp <= 0) {
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0, 0, W, H);
            ctx.font = '18px "Press Start 2P"';
            ctx.fillStyle = '#c8102e'; ctx.textAlign = 'center';
            ctx.fillText('TRAINING COMPLETE!', W / 2, H / 2 - 20);
            ctx.font = '10px "Press Start 2P"';
            ctx.fillStyle = '#fff';
            ctx.fillText(`${G.bagHits} HITS`, W / 2, H / 2 + 15);
            ctx.fillText('Press ENTER to fight', W / 2, H / 2 + 40);
            if (pressed('Enter')) startFight('ai');
        }

    } else if (G.phase === 'fight' || G.phase === 'ko') {
        const [p1, p2] = G.fighters;

        if (G.phase === 'fight') {
            if (keys['KeyA']) p1.move(-1); else if (keys['KeyD']) p1.move(1); else p1.move(0);
            if (keys['KeyW']) p1.jump();
            if (pressed('Space')) p1.punch('jab');
            if (pressed('KeyF')) p1.punch('cross');
            if (pressed('KeyG')) p1.punch('hook');
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
            ctx.fillStyle = 'rgba(0,0,0,0.65)';
            ctx.fillRect(0, 0, W, H);
            ctx.font = '32px "Press Start 2P"';
            ctx.fillStyle = '#c8102e'; ctx.textAlign = 'center';
            ctx.shadowColor = '#c8102e'; ctx.shadowBlur = 20;
            ctx.fillText(`ROUND ${G.round}`, W / 2, H / 2 - 15);
            ctx.font = '18px "Press Start 2P"';
            ctx.fillStyle = '#fff';
            ctx.fillText('FIGHT!', W / 2, H / 2 + 25);
            ctx.shadowBlur = 0;
        }
        if (G.phase === 'ko') {
            ctx.fillStyle = 'rgba(0,0,0,0.55)';
            ctx.fillRect(0, 0, W, H);
            ctx.font = '42px "Press Start 2P"';
            ctx.fillStyle = '#c8102e'; ctx.textAlign = 'center';
            ctx.shadowColor = '#ff0000'; ctx.shadowBlur = 30;
            ctx.fillText('K.O.!', W / 2, H / 2);
            ctx.shadowBlur = 0;
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
    setupBtn('btnJump',
        () => { keys['KeyW'] = true; },
        () => { keys['KeyW'] = false; }
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
    tapOnce('btnCross', 'KeyF');
    tapOnce('btnHook', 'KeyG');
    tapOnce('btnUpper', 'KeyE');
}
