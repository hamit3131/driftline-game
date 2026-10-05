(() => {
  'use strict';

  const canvas = document.querySelector('#game-canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const SAVE_KEY = 'driftline-save-v1';

  const cars = [
    { name: 'KIRMIZI OK', color: '#db4038', price: 0, desc: 'Hafif gövde, dengeli karakter. Virajlara hazır.', engine: 1, grip: 1, turbo: 1 },
    { name: 'GECE KARTALI', color: '#647cf0', price: 350, desc: 'Keskin direksiyon, güçlü çıkış. Geceye karış.', engine: 2, grip: 2, turbo: 1 },
    { name: 'LİMİT KIRICI', color: '#e5a743', price: 900, desc: 'Uzun driftler ve yüksek hız için tasarlandı.', engine: 3, grip: 2, turbo: 3 },
    { name: 'MINT BULLET', color: '#53cfb3', price: 1800, desc: 'Hafif yarış gövdesi ve yarış pistine özel ayar.', engine: 4, grip: 4, turbo: 3 }
  ];
  const tracks = [
    { name: 'ÇAMLIK GEÇİDİ', short: 'ÇAMLIK', subtitle: 'YEŞİL VADİ', biome: 'forest', grass: '#17371d', grassHi: '#25502a', tree: '#102817', road: '#282d30', edge: '#e6e1d7', lane: '#e5ce69', amp: 112, freq: .0034, phase: .4, second: 67, theme: 'YUMUŞAK VİRAJLAR' },
    { name: 'NEON LİMAN', short: 'NEON', subtitle: 'GECE ŞEHRİ', biome: 'city', grass: '#12353a', grassHi: '#1b4a4e', tree: '#0e292e', road: '#242b32', edge: '#c1d8d5', lane: '#7fe4d4', amp: 152, freq: .0042, phase: 1.8, second: 60, theme: 'DAR VE TEKNİK' },
    { name: 'ALP GEÇİDİ', short: 'ALP', subtitle: 'DAĞ ROTASI', biome: 'mountain', grass: '#293b2d', grassHi: '#3b5436', tree: '#1b3024', road: '#303234', edge: '#e8e1d2', lane: '#f0bc66', amp: 174, freq: .0031, phase: 2.7, second: 84, theme: 'GENİŞ DÖNÜŞLER' },
    { name: 'KIYI YOLU', short: 'KIYI', subtitle: 'SAHİL ROTASI', biome: 'coast', water: '#24758a', sand: '#cdb276', grass: '#a88e5d', grassHi: '#dfc68d', tree: '#735c38', road: '#303234', edge: '#eee3c9', lane: '#f2d581', amp: 134, freq: .0038, phase: 2.2, second: 65, theme: 'DENİZ KENARI' },
    { name: 'KIZIL ÇÖL', short: 'ÇÖL', subtitle: 'KUM DENİZİ', biome: 'desert', grass: '#9f5732', grassHi: '#d58a4b', tree: '#78402a', road: '#38302c', edge: '#e5c9a4', lane: '#f2d46c', amp: 163, freq: .0036, phase: 3.4, second: 73, theme: 'SICAK VE DAR' },
    { name: 'KAR GEÇİDİ', short: 'KAR', subtitle: 'BUZLU DAĞLAR', biome: 'snow', grass: '#b4cbd0', grassHi: '#e0ece9', tree: '#536e75', road: '#30363a', edge: '#f4f4ef', lane: '#d8e5a0', amp: 186, freq: .0032, phase: 1.2, second: 82, theme: 'BUZLU VİRAJLAR' }
  ];
  const modes = [
    { id: 'free', name: 'SERBEST SÜRÜŞ', icon: '↗', duration: null, description: 'Rahatına bak. Puanını ve kombonu istediğin kadar yükselt.' },
    { id: 'time', name: 'ZAMANA KARŞI', icon: '◷', duration: 90, description: '90 saniyede en yüksek puanı topla. Her saniye değerli.' },
    { id: 'coins', name: 'JETON AVI', icon: '₵', duration: 75, description: '75 saniyede mümkün olduğunca çok jeton topla.' }
  ];
  const musicTracks = {
    neon: { name: 'NEON GECE', bass: [110, 0, 130.81, 0, 146.83, 0, 130.81, 0, 98, 0, 130.81, 0, 164.81, 0, 146.83, 0], lead: [440, 523.25, 392, 587.33, 493.88, 659.25], wave: 'triangle', leadWave: 'sine', tempo: 125 },
    sunset: { name: 'GÜN BATIMI', bass: [98, 0, 123.47, 0, 146.83, 0, 123.47, 0, 82.41, 0, 110, 0, 130.81, 0, 110, 0], lead: [392, 493.88, 587.33, 493.88, 349.23, 440], wave: 'sine', leadWave: 'triangle', tempo: 150 },
    arctic: { name: 'BUZ PİSTİ', bass: [82.41, 0, 110, 0, 123.47, 0, 98, 0, 73.42, 0, 98, 0, 110, 0, 123.47, 0], lead: [329.63, 392, 493.88, 587.33, 440, 523.25], wave: 'square', leadWave: 'sine', tempo: 105 }
  };
  const paints = [
    { name: 'KIRMIZI', color: '#db4038', cost: 0 }, { name: 'SAFİR', color: '#647cf0', cost: 65 },
    { name: 'AMBER', color: '#e5a743', cost: 65 }, { name: 'MİNT', color: '#53cfb3', cost: 75 },
    { name: 'MOR', color: '#bc66e9', cost: 90 }, { name: 'BUZ', color: '#e4e8e3', cost: 100 },
    { name: 'LİM', color: '#c5ef58', cost: 120 }
  ];
  const stripes = [
    { name: 'TEK ŞERİT', cost: 55 }, { name: 'ÇİFT YARIŞ', cost: 85 }
  ];
  const wheels = [
    { name: 'SİYAH', color: '#0a0d0d', cost: 0 }, { name: 'ALÜMİNYUM', color: '#c3cbc9', cost: 65 }, { name: 'NEON', color: '#b8f264', cost: 110 }
  ];
  const spoilers = [
    { name: 'STOK', color: '#171b19', cost: 0 }, { name: 'GT KANAT', color: '#cbd2c8', cost: 120 }, { name: 'DRIFT WING', color: '#b8f264', cost: 190 }
  ];
  const neons = [
    { name: 'KAPALI', color: '#000000', cost: 0 }, { name: 'LİM YEŞİLİ', color: '#c7f36b', cost: 90 },
    { name: 'BUZ MAVİSİ', color: '#5fdcf4', cost: 100 }, { name: 'MOR IŞIK', color: '#c16dfa', cost: 110 }
  ];
  const defaults = {
    coins: 450, bestScore: 0, car: 0, owned: [0], upgrades: { engine: 0, grip: 0, turbo: 0 },
    mode: 'free', track: 0, level: 1, unlockedLevels: [1], music: true, musicTrack: 'neon', transmission: 'auto',
    mods: { paint: 0, stripe: 1, wheel: 0, spoiler: 0, neon: 0 }, ownedMods: { paint: [0], stripe: [1], wheel: [0], spoiler: [0], neon: [0] },
    accessories: { magnet: false, nitro: false }
  };
  let profile = loadProfile();
  const controls = { up: false, down: false, left: false, right: false, drift: false, turbo: false };
  const game = {
    driving: false, paused: false, progress: 0, idleProgress: 380, speed: 0, lateral: 0, lateralSpeed: 0, yaw: 0, yawRate: 0, steerAngle: 0, slipAngle: 0,
    score: 0, runCoins: 0, combo: 1, maxCombo: 1, driftTime: 0, driftPopUntil: 0, driftPopValue: 0,
    turbo: 100, elapsed: 0, timeLeft: 0, lives: 3, hitCooldown: 0, wallHitCooldown: 0, spawnIndex: 0,
    gear: 1, magnet: false, jumpTime: 0, jumpHeight: 0,
    entities: [], skidMarks: [], smokeParticles: [], exhaustParticles: [], skidTimer: 0, smokeTimer: 0, exhaustTimer: 0,
    cameraMode: 0, shake: 0, lastFrame: performance.now(), sound: null
  };
  let viewWidth = innerWidth, viewHeight = innerHeight, dpr = 1, baseRoadPixels = 400, roadPixels = 400, scale = 1, playerY = 0, asphaltPattern = null, grassPattern = null, toastTimer = 0;

  function loadProfile() {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
      if (!saved || typeof saved !== 'object') return structuredClone(defaults);
      const merged = {
        ...structuredClone(defaults), ...saved,
        upgrades: { ...defaults.upgrades, ...(saved.upgrades || {}) },
        owned: Array.isArray(saved.owned) ? saved.owned : [0],
        mods: { ...defaults.mods, ...(saved.mods || {}) },
        ownedMods: { ...defaults.ownedMods, ...(saved.ownedMods || {}) },
        accessories: { ...defaults.accessories, ...(saved.accessories || {}) }
      };
      if (!musicTracks[merged.musicTrack]) merged.musicTrack = defaults.musicTrack;
      if (!['auto', 'manual'].includes(merged.transmission)) merged.transmission = 'auto';
      merged.unlockedLevels = [...new Set([1, ...(Array.isArray(saved.unlockedLevels) ? saved.unlockedLevels : [])])].filter((level) => Number.isInteger(level) && level >= 1 && level <= 20).sort((a, b) => a - b);
      if (!merged.unlockedLevels.includes(merged.level)) merged.level = Math.max(...merged.unlockedLevels);
      for (const key of ['paint', 'stripe', 'wheel', 'spoiler', 'neon']) {
        if (!Array.isArray(merged.ownedMods[key])) merged.ownedMods[key] = [...defaults.ownedMods[key]];
        if (!merged.ownedMods[key].includes(merged.mods[key])) merged.mods[key] = merged.ownedMods[key][0];
      }
      return merged;
    } catch { return structuredClone(defaults); }
  }
  function saveProfile() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(profile)); } catch { /* Private browsing can disable local storage. */ }
  }
  function currentTrack() { return tracks[profile.track] || tracks[0]; }
  function currentCar() { return cars[profile.car] || cars[0]; }
  function currentMode() { return modes.find((mode) => mode.id === profile.mode) || modes[0]; }
  function currentPaint() { return paints[profile.mods.paint]?.color || currentCar().color; }
  function chapterDifficulty(level = profile.level) { return (Math.max(1, Math.min(20, level)) - 1) / 19; }
  function chapterCost(level) { const step = level - 2; return level <= 1 ? 0 : Math.round(30 + step * 9 + Math.pow(step, 1.5) * 2.4); }
  function highestUnlockedLevel() { return Math.max(...profile.unlockedLevels); }
  function updateAutomaticGear() {
    if (profile.transmission !== 'auto') return;
    const kph = Math.max(0, game.speed) * .72, shiftAt = [20, 50, 80, 150];
    while (game.gear < 5 && kph > shiftAt[game.gear - 1]) game.gear++;
    while (game.gear > 1 && kph < shiftAt[game.gear - 2] * .82) game.gear--;
  }
  function setManualGear(gear) {
    if (profile.transmission !== 'manual') return;
    game.gear = Math.max(1, Math.min(5, gear)); playSound('buy'); updateHud();
  }
  function chooseTransmission(value) {
    profile.transmission = value === 'manual' ? 'manual' : 'auto';
    if (profile.transmission === 'auto') updateAutomaticGear();
    saveProfile(); syncSoundButtons(); updateHud();
  }
  function chooseMusicTrack(value) {
    if (!musicTracks[value]) return;
    profile.musicTrack = value; saveProfile();
    if (game.sound) {
      clearInterval(game.sound.musicTimer); game.sound.musicTimer = null; game.sound.step = 0;
      if (profile.music && !game.paused) ensureMusic();
    }
    syncSoundButtons();
  }
  function trackCenter(s, track = currentTrack()) {
    const difficulty = chapterDifficulty();
    const angle = s * track.freq * (1 + difficulty * .55) + track.phase;
    const smooth = Math.sin(angle);
    const sharper = Math.tanh((1 + difficulty * 3.2) * smooth) / Math.tanh(1 + difficulty * 3.2);
    const main = smooth * (1 - difficulty) + sharper * difficulty;
    const harmonic = .18 + difficulty * .5;
    return track.amp * (1 + difficulty * .5) * (main + harmonic * Math.sin(angle * 2.08 + .6)) / (1 + harmonic)
      + track.second * (1 + difficulty * .18) * Math.sin(s * track.freq * .47 * (1 + difficulty * .3) + track.phase + 1.3)
      + 21 * Math.sin(s * track.freq * 1.83 * (1 + difficulty * .4) + track.phase + 3.1);
  }

  function createPatterns() {
    const grass = document.createElement('canvas'); grass.width = 128; grass.height = 128;
    const g = grass.getContext('2d'); g.fillStyle = '#ffffff'; g.fillRect(0, 0, 128, 128);
    let seed = 9167;
    const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    for (let i = 0; i < 290; i++) {
      const x = rand() * 128, y = rand() * 128;
      g.fillStyle = `rgba(${rand() > .48 ? '225,241,190' : '0,15,5'},${.06 + rand() * .2})`;
      g.fillRect(x, y, 1 + rand() * 2, 1 + rand() * 2);
    }
    grassPattern = ctx.createPattern(grass, 'repeat');
    const asphalt = document.createElement('canvas'); asphalt.width = 100; asphalt.height = 100;
    const a = asphalt.getContext('2d'); a.clearRect(0, 0, 100, 100); seed = 8129;
    for (let i = 0; i < 210; i++) {
      const x = rand() * 100, y = rand() * 100, alpha = .05 + rand() * .17;
      a.fillStyle = `rgba(${rand() > .5 ? '255,255,255' : '0,0,0'},${alpha})`;
      a.fillRect(x, y, rand() * 2 + .4, rand() * 2 + .4);
    }
    asphaltPattern = ctx.createPattern(asphalt, 'repeat');
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    viewWidth = window.innerWidth; viewHeight = window.innerHeight;
    canvas.width = Math.round(viewWidth * dpr); canvas.height = Math.round(viewHeight * dpr);
    canvas.style.width = `${viewWidth}px`; canvas.style.height = `${viewHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    baseRoadPixels = Math.min(viewWidth * (viewWidth < 640 ? .82 : .49), 500);
    baseRoadPixels = Math.max(220, baseRoadPixels);
    roadPixels = baseRoadPixels * (game.cameraMode ? 1.14 : 1);
    scale = roadPixels / 440;
    playerY = viewHeight * (viewWidth < 640 ? (game.cameraMode ? .69 : .58) : (game.cameraMode ? .78 : .68));
    createPatterns();
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  function drawTree(x, y, radius, palette, kind = 0) {
    ctx.save();
    ctx.globalAlpha = .45;
    ctx.fillStyle = '#061108';
    ctx.beginPath(); ctx.ellipse(x + radius * .25, y + radius * .72, radius * 1.15, radius * .72, -.28, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = palette.tree;
    if (kind === 1) {
      ctx.beginPath(); ctx.arc(x, y, radius * .88, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = palette.grassHi; ctx.beginPath(); ctx.arc(x - radius * .28, y - radius * .26, radius * .48, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = palette.grassHi; ctx.beginPath(); ctx.arc(x - radius * .28, y - radius * .27, radius * .53, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = palette.tree; ctx.beginPath(); ctx.arc(x + radius * .3, y + radius * .25, radius * .58, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  function drawBiomeGround(samples, roadWidth, track) {
    if (track.biome === 'coast') {
      const half = roadWidth / 2, curb = Math.max(8, roadWidth * .036);
      const leftRoad = samples.map((p) => [p.x - half - curb, p.y]);
      const rightRoad = samples.map((p) => [p.x + half + curb, p.y]);
      const waterEdge = samples.map((p) => [p.x - half - curb - 54, p.y]);
      fillRoadPolygon([[0, samples[0].y], ...waterEdge, [0, samples[samples.length - 1].y]], track.water);
      fillRoadPolygon([...waterEdge, ...leftRoad.slice().reverse()], track.sand);
      fillRoadPolygon([...rightRoad, [viewWidth, samples[samples.length - 1].y], [viewWidth, samples[0].y]], track.sand);
      for (let y = 18; y < viewHeight; y += 61) {
        const sample = samples[Math.min(samples.length - 1, Math.floor((y + 24) / 12))];
        const waterLimit = Math.min(viewWidth * .45, Math.max(10, sample.x - half - curb - 62));
        ctx.strokeStyle = 'rgba(184,233,229,.22)'; ctx.lineWidth = 1;
        for (let x = 14 + (Math.floor(y / 61) % 2) * 28; x < waterLimit - 12; x += 54) {
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 9, y + 1); ctx.stroke();
        }
      }
    } else if (track.biome === 'desert') {
      ctx.save(); ctx.strokeStyle = 'rgba(244,183,113,.18)'; ctx.lineWidth = 2;
      for (let row = 0; row < 5; row++) {
        const y = row * viewHeight / 4 + 28;
        ctx.beginPath(); ctx.moveTo(0, y + 16);
        ctx.bezierCurveTo(viewWidth * .22, y - 12, viewWidth * .47, y + 34, viewWidth * .69, y + 8);
        ctx.bezierCurveTo(viewWidth * .82, y - 4, viewWidth * .9, y + 15, viewWidth, y - 7); ctx.stroke();
      }
      ctx.restore();
    } else if (track.biome === 'snow') {
      const gradient = ctx.createLinearGradient(0, 0, viewWidth, viewHeight);
      gradient.addColorStop(0, 'rgba(232,244,245,.11)'); gradient.addColorStop(1, 'rgba(89,132,148,.14)');
      ctx.fillStyle = gradient; ctx.fillRect(0, 0, viewWidth, viewHeight);
    }
  }

  function drawBiomeDecoration(x, y, radius, palette, track, side, kind) {
    if (track.biome === 'coast') {
      if (side < 0) return;
      ctx.save(); ctx.fillStyle = 'rgba(25,21,12,.25)'; ctx.beginPath(); ctx.ellipse(x + radius * .5, y + radius * .7, radius * 1.4, radius * .45, -.18, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#795637'; ctx.lineWidth = Math.max(2, radius * .17); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y + radius); ctx.quadraticCurveTo(x + radius * .12, y, x - radius * .02, y - radius * .68); ctx.stroke();
      ctx.strokeStyle = '#286341'; ctx.lineWidth = Math.max(2, radius * .19);
      for (let i = 0; i < 5; i++) {
        const angle = -2.9 + i * .68, tx = x + Math.cos(angle) * radius * .92, ty = y - radius * .62 + Math.sin(angle) * radius * .48;
        ctx.beginPath(); ctx.moveTo(x - radius * .02, y - radius * .68); ctx.quadraticCurveTo(x + Math.cos(angle) * radius * .5, y - radius * .4, tx, ty); ctx.stroke();
      }
      ctx.restore(); return;
    }
    if (track.biome === 'desert') {
      ctx.save(); ctx.fillStyle = 'rgba(44,21,13,.27)'; ctx.beginPath(); ctx.ellipse(x + radius * .3, y + radius * .63, radius * 1.15, radius * .38, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#397344'; ctx.beginPath(); ctx.roundRect(x - radius * .2, y - radius, radius * .4, radius * 1.75, radius * .18); ctx.fill();
      ctx.beginPath(); ctx.roundRect(x - radius * .74, y - radius * .12, radius * .53, radius * .3, radius * .13); ctx.fill(); ctx.fillRect(x - radius * .74, y - radius * .52, radius * .25, radius * .55);
      ctx.beginPath(); ctx.roundRect(x + radius * .2, y + radius * .02, radius * .52, radius * .28, radius * .12); ctx.fill(); ctx.fillRect(x + radius * .47, y - radius * .4, radius * .25, radius * .48);
      ctx.restore(); return;
    }
    if (track.biome === 'snow') {
      ctx.save(); ctx.fillStyle = 'rgba(26,46,53,.22)'; ctx.beginPath(); ctx.ellipse(x + radius * .25, y + radius * .7, radius * 1.1, radius * .42, -.2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#31515a'; ctx.beginPath(); ctx.moveTo(x, y - radius); ctx.lineTo(x + radius * .78, y + radius * .68); ctx.lineTo(x - radius * .78, y + radius * .68); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#e8f2ef'; ctx.beginPath(); ctx.moveTo(x, y - radius); ctx.lineTo(x + radius * .3, y - radius * .14); ctx.lineTo(x, y - radius * .32); ctx.lineTo(x - radius * .19, y - radius * .04); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x - radius * .49, y + radius * .16); ctx.lineTo(x - radius * .2, y + radius * .35); ctx.lineTo(x - radius * .55, y + radius * .35); ctx.closePath(); ctx.fill();
      ctx.restore(); return;
    }
    drawTree(x, y, radius, palette, kind);
  }

  function fillRoadPolygon(points, color) {
    ctx.fillStyle = color; ctx.beginPath();
    points.forEach((point, i) => i ? ctx.lineTo(point[0], point[1]) : ctx.moveTo(point[0], point[1]));
    ctx.closePath(); ctx.fill();
  }

  function drawWorld(progress, showCar = true) {
    const w = viewWidth, h = viewHeight, track = currentTrack();
    const difficulty = chapterDifficulty();
    const roadWidth = roadPixels * (1 - difficulty * .13);
    const theme = { grass: track.grass, grassHi: track.grassHi, tree: track.tree };
    const cameraCenter = trackCenter(progress);
    ctx.fillStyle = track.grass; ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = .38; ctx.fillStyle = grassPattern; ctx.fillRect(0, 0, w, h); ctx.globalAlpha = 1;
    const samples = [];
    for (let y = -24; y <= h + 24; y += 12) {
      const s = progress + (playerY - y) / scale;
      const x = w / 2 + (trackCenter(s) - cameraCenter) * scale;
      samples.push({ s, y, x });
    }
    drawBiomeGround(samples, roadWidth, track);
    const visibleDistance = h / scale + 300;
    const firstTree = Math.floor((progress - visibleDistance / 2) / 185) - 1;
    const lastTree = Math.ceil((progress + visibleDistance / 2) / 185) + 1;
    for (let i = firstTree; i <= lastTree; i++) {
      if (i < 0) continue;
      const s = i * 185 + 38;
      const hash = Math.abs(Math.sin(i * 127.1 + 311.7) * 43758.5453) % 1;
      const center = trackCenter(s) - cameraCenter;
      const y = playerY - (s - progress) * scale;
      if (y < -85 || y > h + 85) continue;
      const gap = (roadWidth / 2 + 42 + hash * 125) / scale;
      const radius = (13 + hash * 18) * scale;
      for (const side of [-1, 1]) {
        const x = w / 2 + (center + side * gap) * scale;
        if (x > -radius * 2 && x < w + radius * 2) drawBiomeDecoration(x, y, radius, theme, track, side, hash > .79 ? 1 : 0);
      }
    }
    const half = roadWidth / 2, curb = Math.max(8, roadWidth * .036);
    const leftOuter = samples.map((p) => [p.x - half - curb, p.y]);
    const rightOuter = samples.map((p) => [p.x + half + curb, p.y]);
    const leftRoad = samples.map((p) => [p.x - half, p.y]);
    const rightRoad = samples.map((p) => [p.x + half, p.y]);
    fillRoadPolygon([...leftOuter, ...rightOuter.slice().reverse()], '#a9aaa4');
    fillRoadPolygon([...leftRoad, ...rightRoad.slice().reverse()], track.road);
    ctx.save(); ctx.globalAlpha = .3; ctx.fillStyle = asphaltPattern; fillRoadPolygon([...leftRoad, ...rightRoad.slice().reverse()], asphaltPattern); ctx.restore();

    for (let i = 0; i < samples.length - 1; i++) {
      const p = samples[i], q = samples[i + 1], red = Math.floor(p.s / 42) % 2 === 0;
      const curbColor = red ? '#c7403c' : track.edge;
      fillRoadPolygon([[p.x - half, p.y], [q.x - half, q.y], [q.x - half - curb, q.y], [p.x - half - curb, p.y]], curbColor);
      fillRoadPolygon([[p.x + half, p.y], [q.x + half, q.y], [q.x + half + curb, q.y], [p.x + half + curb, p.y]], curbColor);
      ctx.strokeStyle = 'rgba(235,239,232,.52)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(p.x - half + 1, p.y); ctx.lineTo(q.x - half + 1, q.y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(p.x + half - 1, p.y); ctx.lineTo(q.x + half - 1, q.y); ctx.stroke();
    }

    const dashSpace = 105, dashLength = 36;
    const firstDash = Math.floor((progress - visibleDistance * .5) / dashSpace) - 1;
    const lastDash = Math.ceil((progress + visibleDistance * .5) / dashSpace) + 1;
    ctx.lineCap = 'butt'; ctx.strokeStyle = track.lane; ctx.lineWidth = Math.max(2.2, roadWidth * .009); ctx.globalAlpha = .78;
    for (let n = firstDash; n <= lastDash; n++) {
      const s0 = n * dashSpace + 24, s1 = s0 + dashLength;
      for (const lane of [-.21, .21]) {
        const x0 = w / 2 + (trackCenter(s0) - cameraCenter + lane * 440 * (1 - difficulty * .13)) * scale;
        const y0 = playerY - (s0 - progress) * scale;
        const x1 = w / 2 + (trackCenter(s1) - cameraCenter + lane * 440 * (1 - difficulty * .13)) * scale;
        const y1 = playerY - (s1 - progress) * scale;
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
    if (game.driving) drawSlipEffects(progress, cameraCenter);
    drawRoadsideDetails(samples, half, scale, track);
    if (game.driving) drawEntities(progress, cameraCenter);
    if (showCar) {
      const playerX = w / 2 + game.lateral * scale;
      if (game.jumpHeight > 1) {
        ctx.save(); ctx.globalAlpha = Math.max(.12, .38 - game.jumpHeight / 180); ctx.fillStyle = '#050807';
        ctx.beginPath(); ctx.ellipse(playerX, playerY + 14 * scale, 21 * scale, 8 * scale, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
      const drawY = playerY - game.jumpHeight;
      if (game.shake > 0) {
        const intensity = game.shake * 3;
        ctx.save(); ctx.translate((Math.random() - .5) * intensity, (Math.random() - .5) * intensity);
        const angle = game.yaw + Math.atan((trackCenter(progress + 18) - trackCenter(progress - 18)) / 36) * .72;
        drawCar(playerX, drawY, currentPaint(), scale, angle, true, game.slipAngle > .12);
        ctx.restore();
      } else {
        const angle = game.yaw + Math.atan((trackCenter(progress + 18) - trackCenter(progress - 18)) / 36) * .72;
        drawCar(playerX, drawY, currentPaint(), scale, angle, true, game.slipAngle > .12);
      }
    }
  }

  function drawSlipEffects(progress, cameraCenter) {
    for (const mark of game.skidMarks) {
      const life = Math.max(0, 1 - mark.age / mark.life);
      if (life <= 0) continue;
      const x = viewWidth / 2 + (trackCenter(mark.s) - cameraCenter + mark.lane) * scale;
      const y = playerY - (mark.s - progress) * scale;
      if (y < -18 || y > viewHeight + 18) continue;
      ctx.save(); ctx.globalAlpha = life * .42; ctx.fillStyle = '#090b0b';
      ctx.translate(x, y); ctx.rotate(mark.angle);
      ctx.fillRect(-1.6 * scale, -6 * scale, 3.2 * scale, 13 * scale);
      ctx.restore();
    }
    for (const puff of game.smokeParticles) {
      const life = Math.max(0, 1 - puff.age / puff.life);
      if (life <= 0) continue;
      const x = viewWidth / 2 + (trackCenter(puff.s) - cameraCenter + puff.lane) * scale;
      const y = playerY - (puff.s - progress) * scale;
      if (y < -32 || y > viewHeight + 32) continue;
      const radius = (puff.size + puff.age * 10) * scale;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `rgba(225,232,225,${life * .24})`); gradient.addColorStop(1, 'rgba(225,232,225,0)');
      ctx.fillStyle = gradient; ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
    }
    for (const puff of game.exhaustParticles) {
      const life = Math.max(0, 1 - puff.age / puff.life);
      if (life <= 0) continue;
      const x = viewWidth / 2 + (trackCenter(puff.s) - cameraCenter + puff.lane) * scale;
      const y = playerY - (puff.s - progress) * scale;
      if (y < -25 || y > viewHeight + 25) continue;
      const radius = (puff.size + puff.age * 8) * scale;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `rgba(75,82,81,${life * .42})`); gradient.addColorStop(1, 'rgba(75,82,81,0)');
      ctx.fillStyle = gradient; ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
    }
  }

  function drawRoadsideDetails(samples, half, worldScale, track) {
    if (track === tracks[1]) {
      for (let i = 0; i < samples.length - 1; i += 9) {
        const p = samples[i];
        for (const side of [-1, 1]) {
          const x = p.x + side * (half + 26), y = p.y;
          if (x < -30 || x > viewWidth + 30) continue;
          ctx.strokeStyle = 'rgba(132,220,207,.28)'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(x, y - 9); ctx.lineTo(x, y + 6); ctx.stroke();
          ctx.fillStyle = '#8ff3d9'; ctx.shadowColor = '#79e7d4'; ctx.shadowBlur = 7;
          ctx.beginPath(); ctx.arc(x, y - 10, 2.5, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
        }
      }
    } else if (track === tracks[2]) {
      for (let i = 0; i < samples.length; i += 8) {
        const p = samples[i];
        for (const side of [-1, 1]) {
          const x = p.x + side * (half + 21), y = p.y;
          if (x < -30 || x > viewWidth + 30) continue;
          ctx.fillStyle = 'rgba(234,232,215,.54)'; ctx.fillRect(x - 1.5, y - 5, 3, 10);
        }
      }
    }
  }

  function drawCoin(x, y, radius, magnetized = false) {
    ctx.save(); ctx.shadowColor = magnetized ? 'rgba(127,228,212,.72)' : 'rgba(255,202,69,.42)'; ctx.shadowBlur = radius * (magnetized ? 2 : 1.4);
    const gradient = ctx.createRadialGradient(x - radius * .3, y - radius * .38, 1, x, y, radius);
    gradient.addColorStop(0, '#ffe998'); gradient.addColorStop(.54, '#ffc43d'); gradient.addColorStop(1, '#a96b16');
    ctx.fillStyle = gradient; ctx.beginPath(); ctx.ellipse(x, y, radius * .82, radius, 0, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0; ctx.strokeStyle = 'rgba(92,57,10,.72)'; ctx.lineWidth = 1.5; ctx.stroke();
    if (magnetized) { ctx.strokeStyle = 'rgba(127,228,212,.9)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, radius * 1.28, 0, Math.PI * 2); ctx.stroke(); }
    ctx.fillStyle = '#79500f'; ctx.font = `800 ${radius * 1.13}px ${getComputedStyle(document.body).fontFamily}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('₵', x, y + .5);
    ctx.restore();
  }

  function drawCone(x, y, s) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(3, 11, 12, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f07839'; ctx.beginPath(); ctx.moveTo(0, -13); ctx.lineTo(10, 10); ctx.lineTo(-10, 10); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#f5eee0'; ctx.beginPath(); ctx.moveTo(-5, 1); ctx.lineTo(5, 1); ctx.lineTo(7, 6); ctx.lineTo(-7, 6); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#f4ede0'; ctx.fillRect(-13, 9, 26, 4); ctx.restore();
  }

  function drawRamp(x, y, s) {
    const width = Math.max(34, 56 * s), height = Math.max(24, 34 * s);
    ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.ellipse(3, height * .42, width * .68, height * .2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#25292a'; ctx.beginPath(); ctx.moveTo(-width / 2, height * .44); ctx.lineTo(-width * .36, -height * .18); ctx.lineTo(width * .36, -height * .18); ctx.lineTo(width / 2, height * .44); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#e6b844'; ctx.beginPath(); ctx.moveTo(-width * .38, height * .34); ctx.lineTo(-width * .27, -height * .11); ctx.lineTo(width * .28, -height * .11); ctx.lineTo(width * .39, height * .34); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#25292a'; ctx.lineWidth = Math.max(2, 5 * s);
    for (const stripe of [-.23, 0, .23]) { ctx.beginPath(); ctx.moveTo(width * stripe - width * .07, height * .29); ctx.lineTo(width * stripe + width * .03, -height * .09); ctx.stroke(); }
    ctx.restore();
  }

  function drawEntities(progress, cameraCenter) {
    for (const entity of game.entities) {
      const y = playerY - (entity.s - progress) * scale;
      if (y < -55 || y > viewHeight + 55) continue;
      const x = viewWidth / 2 + (trackCenter(entity.s) - cameraCenter + entity.lane) * scale;
      if (entity.type === 'coin') drawCoin(x, y, Math.max(7, 11 * scale), entity.magnetized);
      else if (entity.type === 'ramp') drawRamp(x, y, scale);
      else if (entity.type === 'cone') drawCone(x, y, scale);
      else {
        const roadHeading = Math.atan((trackCenter(entity.s + 18) - trackCenter(entity.s - 18)) / 36) * .72;
        drawCar(x, y, entity.color, scale * .76, roadHeading, false, false);
      }
    }
  }

  function drawCar(x, y, color, worldScale, angle = 0, player = false, skidding = false) {
    const carW = Math.max(22, Math.min(48, 48 * worldScale));
    const carH = carW * 1.76;
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
    if (skidding && player) {
      ctx.globalAlpha = .28; ctx.strokeStyle = '#f5f3de'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-carW * .39, carH * .28); ctx.lineTo(-carW * .5, carH * .58); ctx.moveTo(carW * .39, carH * .28); ctx.lineTo(carW * .5, carH * .58); ctx.stroke(); ctx.globalAlpha = 1;
    }
    ctx.fillStyle = 'rgba(0,0,0,.46)'; ctx.beginPath(); ctx.roundRect(-carW * .49 + 3, -carH * .47 + 6, carW * .98, carH * .96, carW * .25); ctx.fill();
    const wheelColor = player ? (wheels[profile.mods.wheel]?.color || '#0a0d0d') : '#0a0d0d';
    ctx.fillStyle = '#080a0a';
    const tireW = carW * .2, tireH = carH * .24;
    for (const side of [-1, 1]) for (const axle of [-.29, .28]) {
      ctx.beginPath(); ctx.roundRect(side * carW * .42 - tireW / 2, axle * carH - tireH / 2, tireW, tireH, 2); ctx.fill();
      if (player && profile.mods.wheel > 0) { ctx.fillStyle = wheelColor; ctx.beginPath(); ctx.arc(side * carW * .42, axle * carH, carW * .045, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#080a0a'; }
    }
    const body = ctx.createLinearGradient(-carW / 2, 0, carW / 2, 0);
    body.addColorStop(0, shade(color, -.37)); body.addColorStop(.28, color); body.addColorStop(.78, shade(color, .08)); body.addColorStop(1, shade(color, -.3));
    if (player && profile.mods.neon > 0) {
      ctx.save(); ctx.globalAlpha = .68; ctx.fillStyle = neons[profile.mods.neon].color; ctx.shadowColor = neons[profile.mods.neon].color; ctx.shadowBlur = carW * .5;
      ctx.beginPath(); ctx.ellipse(0, carH * .14, carW * .5, carH * .28, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
    ctx.fillStyle = body; ctx.beginPath(); ctx.roundRect(-carW * .43, -carH * .5, carW * .86, carH, carW * .25); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.24)'; ctx.lineWidth = 1; ctx.stroke();
    if (player && profile.mods.spoiler > 0) {
      ctx.fillStyle = '#121714'; ctx.fillRect(-carW * .28, carH * .25, carW * .07, carH * .13); ctx.fillRect(carW * .21, carH * .25, carW * .07, carH * .13);
      ctx.fillStyle = spoilers[profile.mods.spoiler].color; ctx.beginPath(); ctx.roundRect(-carW * .55, carH * .34, carW * 1.1, carH * .075, carW * .035); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.32)'; ctx.stroke();
    }
    ctx.fillStyle = 'rgba(16,31,34,.93)'; ctx.beginPath(); ctx.roundRect(-carW * .31, -carH * .29, carW * .62, carH * .31, carW * .11); ctx.fill();
    ctx.fillStyle = 'rgba(122,154,155,.28)'; ctx.beginPath(); ctx.moveTo(-carW * .27, -carH * .26); ctx.lineTo(carW * .21, -carH * .26); ctx.lineTo(carW * .27, -carH * .1); ctx.lineTo(-carW * .27, -carH * .1); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(16,31,34,.82)'; ctx.beginPath(); ctx.roundRect(-carW * .29, carH * .08, carW * .58, carH * .18, carW * .08); ctx.fill();
    if (player) {
      const exhaustY = carH * .465;
      if (game.driving && controls.turbo && game.turbo > 0 && Math.abs(game.speed) > 30) {
        for (const side of [-1, 1]) {
          const exhaustX = side * carW * .19, flameLength = carW * (.35 + Math.random() * .22) * (profile.accessories.nitro ? 1.35 : 1);
          const flame = ctx.createLinearGradient(exhaustX, exhaustY, exhaustX, exhaustY + flameLength);
          flame.addColorStop(0, '#fff5a1'); flame.addColorStop(.25, '#ffcf45'); flame.addColorStop(.72, '#ff6b29'); flame.addColorStop(1, 'rgba(255,50,20,0)');
          ctx.fillStyle = flame; ctx.beginPath(); ctx.moveTo(exhaustX - carW * .075, exhaustY); ctx.quadraticCurveTo(exhaustX - carW * .04, exhaustY + flameLength * .7, exhaustX, exhaustY + flameLength); ctx.quadraticCurveTo(exhaustX + carW * .05, exhaustY + flameLength * .6, exhaustX + carW * .075, exhaustY); ctx.closePath(); ctx.fill();
          ctx.fillStyle = 'rgba(255,249,203,.92)'; ctx.beginPath(); ctx.moveTo(exhaustX - carW * .025, exhaustY); ctx.lineTo(exhaustX, exhaustY + flameLength * .58); ctx.lineTo(exhaustX + carW * .025, exhaustY); ctx.closePath(); ctx.fill();
        }
      }
      ctx.fillStyle = 'rgba(255,239,214,.78)'; ctx.fillRect(-carW * .26, -carH * .46, carW * .13, carH * .12); ctx.fillRect(carW * .13, -carH * .46, carW * .13, carH * .12);
      ctx.fillStyle = '#ff554a'; ctx.fillRect(-carW * .28, carH * .43, carW * .15, carH * .045); ctx.fillRect(carW * .13, carH * .43, carW * .15, carH * .045);
      ctx.fillStyle = 'rgba(248,238,212,.82)';
      if (profile.mods.stripe === 0) ctx.fillRect(-carW * .055, -carH * .47, carW * .11, carH * .91);
      else { ctx.fillRect(-carW * .08, -carH * .47, carW * .075, carH * .91); ctx.fillRect(carW * .055, -carH * .47, carW * .055, carH * .91); }
      ctx.fillStyle = '#11191a';
      for (const side of [-1, 1]) { ctx.beginPath(); ctx.roundRect(side * carW * .19 - carW * .06, exhaustY - 1, carW * .12, carH * .055, 2); ctx.fill(); ctx.strokeStyle = 'rgba(207,224,222,.62)'; ctx.lineWidth = 1; ctx.stroke(); }
      ctx.fillStyle = 'rgba(9,13,12,.85)'; ctx.beginPath(); ctx.roundRect(-carW * .24, carH * .12, carW * .48, carH * .08, 2); ctx.fill();
    } else {
      ctx.fillStyle = '#f6eecb'; ctx.fillRect(-carW * .27, -carH * .46, carW * .15, carH * .045); ctx.fillRect(carW * .12, -carH * .46, carW * .15, carH * .045);
      ctx.fillStyle = '#ed5448'; ctx.fillRect(-carW * .28, carH * .43, carW * .17, carH * .045); ctx.fillRect(carW * .11, carH * .43, carW * .17, carH * .045);
    }
    ctx.restore();
  }

  function shade(hex, amount) {
    const value = hex.replace('#', '');
    const n = parseInt(value.length === 3 ? value.split('').map((c) => c + c).join('') : value, 16);
    const r = Math.max(0, Math.min(255, (n >> 16) + Math.round(255 * amount)));
    const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + Math.round(255 * amount)));
    const b = Math.max(0, Math.min(255, (n & 255) + Math.round(255 * amount)));
    return `rgb(${r},${g},${b})`;
  }

  function spawnForIndex(index) {
    const difficulty = chapterDifficulty();
    const laneWidth = 1 - difficulty * .13;
    const base = index * 230 + 310;
    const laneSeed = Math.sin(index * 71.31) * 10000;
    const lane = (laneSeed - Math.floor(laneSeed)) * 230 - 115;
    const coinLane = [-118, 0, 118][index % 3] * laneWidth;
    for (let n = 0; n < 3; n++) game.entities.push({ type: 'coin', s: base + n * 34, lane: coinLane });
    if (index % 12 === 9) {
      game.entities.push({ type: 'ramp', s: base + 112, lane: (Math.floor(index / 12) % 2 ? 40 : -40) * laneWidth, used: false });
      return;
    }
    const carInterval = Math.max(2, 3 - Math.floor(difficulty));
    if (index % carInterval === carInterval - 1) {
      game.entities.push({ type: 'car', s: base + 155, lane: Math.max(-145, Math.min(145, Math.round(lane / 105) * 105)) * laneWidth, speed: 105 + difficulty * 50 + (index % 3) * 18, color: ['#4c86e8', '#dda54e', '#55b9a0', '#b45cda'][index % 4], passed: false });
    }
    const obstacleInterval = Math.max(4, 10 - Math.floor(difficulty * 6));
    if (index % obstacleInterval === obstacleInterval - 1) {
      const coneLane = [-135, 135][index % 2] * laneWidth;
      game.entities.push({ type: 'cone', s: base + 95, lane: coneLane });
    }
  }

  function keepEntitiesAhead() {
    while (game.spawnIndex * 230 < game.progress + 1550) {
      spawnForIndex(game.spawnIndex);
      game.spawnIndex++;
    }
    game.entities = game.entities.filter((entity) => entity.s > game.progress - 110);
  }

  function damagePlayer(message) {
    if (currentMode().id !== 'free' || game.hitCooldown > 0) return false;
    game.hitCooldown = 1.05; game.lives = Math.max(0, game.lives - 1); game.shake = .48;
    playSound('crash'); toast(`${message} · CAN ${game.lives}/3`);
    updateHud();
    return game.lives === 0;
  }

  function updateGame(dt) {
    if (!game.driving || game.paused) return;
    game.hitCooldown = Math.max(0, game.hitCooldown - dt);
    game.wallHitCooldown = Math.max(0, game.wallHitCooldown - dt);
    const car = currentCar();
    const engineLevel = car.engine + profile.upgrades.engine;
    const gripLevel = car.grip + profile.upgrades.grip;
    const turboLevel = car.turbo + profile.upgrades.turbo;
    const maxSpeed = 285 + engineLevel * 11;
    updateAutomaticGear();
    const boosting = controls.turbo && game.turbo > 0 && game.speed > 18;
    const acceleration = 205 + engineLevel * 11;
    const turboPower = profile.accessories.nitro ? 2.3 : 1.92;
    const turboTopSpeed = profile.accessories.nitro ? 1.62 : 1.44;
    const gearTorque = [1, .9, .81, .73, .66][game.gear - 1];
    if (controls.up) game.speed += (game.speed < 0 ? acceleration * .8 : acceleration * gearTorque) * (boosting ? turboPower : 1) * dt;
    else if (game.speed > 0) game.speed = Math.max(0, game.speed - 27 * dt);
    else if (game.speed < 0) game.speed = Math.min(0, game.speed + 22 * dt);
    if (controls.down) {
      if (game.speed > 0) game.speed = Math.max(-95, game.speed - 390 * dt);
      else game.speed = Math.max(-95, game.speed - 128 * dt);
    }
    updateAutomaticGear();
    const topSpeed = maxSpeed * (boosting ? turboTopSpeed : 1);
    const gearSpeedKph = [20, 50, 80, 150][game.gear - 1];
    game.speed = Math.min(game.gear === 5 ? topSpeed : Math.min(topSpeed, gearSpeedKph / .72), game.speed);
    if (boosting) game.turbo = Math.max(0, game.turbo - (24 + turboLevel * 1.4) * dt);
    else game.turbo = Math.min(100, game.turbo + (8 + turboLevel * 1.4) * dt);

    const steer = (controls.right ? 1 : 0) - (controls.left ? 1 : 0);
    const difficulty = chapterDifficulty();
    const drifting = controls.drift && Math.abs(game.speed) > 42;
    const steeringResponse = drifting ? 4.2 : 7.3;
    game.steerAngle += (steer * .46 - game.steerAngle) * Math.min(1, dt * steeringResponse);
    const speedFactor = Math.min(1.2, Math.abs(game.speed) / 190);
    const targetYaw = game.steerAngle * speedFactor * (drifting ? 1.55 : .93) + (drifting ? game.lateralSpeed / Math.max(100, Math.abs(game.speed)) * .18 : 0);
    game.yawRate = (targetYaw - game.yaw) * (drifting ? 2.35 : 5.8);
    game.yaw += game.yawRate * dt;
    game.yaw = Math.max(-.9, Math.min(.9, game.yaw));
    const targetLateralSpeed = game.speed * Math.sin(game.yaw);
    const tireGrip = drifting ? .78 : 3.2 + gripLevel * .48;
    game.lateralSpeed += (targetLateralSpeed - game.lateralSpeed) * (1 - Math.exp(-tireGrip * dt));
    const lateralLimit = drifting ? 245 : 170 + gripLevel * 5;
    game.lateralSpeed = Math.max(-lateralLimit, Math.min(lateralLimit, game.lateralSpeed));
    game.lateral += game.lateralSpeed * dt;
    if (drifting && Math.abs(game.speed) > 80) game.speed = Math.max(0, game.speed - 8 * dt);
    game.slipAngle = Math.atan2(game.lateralSpeed, Math.max(45, Math.abs(game.speed)));
    const slip = Math.abs(game.slipAngle);
    const driftQuality = Math.max(0, Math.min(1, (slip - .12) / .31)) * Math.max(0, 1 - Math.max(0, slip - .67) * 2.2);
    setDriftSound(drifting && driftQuality > .12 && Math.abs(game.speed) > 75, driftQuality, game.slipAngle);
    const edge = 220 * (1 - difficulty * .13) - 36;
    let offRoad = Math.abs(game.lateral) > edge;
    if (offRoad) {
      game.speed = Math.max(-45, game.speed - 190 * dt);
      game.lateral = Math.sign(game.lateral) * (edge + (Math.abs(game.lateral) - edge) * .89);
      game.lateralSpeed *= .92;
      if (currentMode().id === 'free' && game.wallHitCooldown <= 0) {
        game.wallHitCooldown = .85;
        if (damagePlayer('YOL KENARINA ÇARPTIN')) { finishRun(); return; }
      }
    } else {
      game.wallHitCooldown = 0;
    }
    game.progress += game.speed * dt;
    game.elapsed += dt;
    game.jumpTime = Math.max(0, game.jumpTime - dt);
    game.jumpHeight = game.jumpTime > 0 ? Math.sin((1 - game.jumpTime / .86) * Math.PI) * 62 : 0;
    game.timeLeft = currentMode().duration == null ? 0 : Math.max(0, currentMode().duration - game.elapsed);

    if (drifting && driftQuality > .06 && Math.abs(game.speed) > 65) {
      game.driftTime += dt;
      game.combo = Math.min(6, 1 + game.driftTime * .38);
      const gain = Math.max(1, Math.abs(game.speed) * .18 * driftQuality * game.combo * dt);
      game.score += gain; game.driftPopValue = Math.floor(gain * 12); game.driftPopUntil = performance.now() + 450;
      game.maxCombo = Math.max(game.maxCombo, game.combo);
    } else {
      game.driftTime = Math.max(0, game.driftTime - dt * 1.8);
      if (game.driftTime === 0) game.combo = Math.max(1, game.combo - dt * .8);
    }

    if (drifting && driftQuality > .16 && Math.abs(game.speed) > 85) {
      game.skidTimer -= dt; game.smokeTimer -= dt;
      if (game.skidTimer <= 0) {
        for (const side of [-1, 1]) game.skidMarks.push({ s: game.progress - 17, lane: game.lateral + side * 12, age: 0, life: 5.5, angle: game.yaw * .4 });
        game.skidTimer = .065;
      }
      if (game.smokeTimer <= 0) {
        for (const side of [-1, 1]) game.smokeParticles.push({ s: game.progress - 25, lane: game.lateral + side * 13 - game.lateralSpeed * .035, age: 0, life: .8 + Math.random() * .45, size: 6 + Math.random() * 4 });
        game.smokeTimer = .11;
      }
    }
    game.exhaustTimer -= dt;
    if (Math.abs(game.speed) > 70 && (controls.up || boosting) && game.exhaustTimer <= 0) {
      for (const side of [-1, 1]) game.exhaustParticles.push({ s: game.progress - 31, lane: game.lateral + side * 8, age: 0, life: boosting ? .72 : .48, size: boosting ? 7 : 4.5 });
      game.exhaustTimer = boosting ? .075 : .17;
    }
    game.skidMarks.forEach((mark) => { mark.age += dt; });
    game.smokeParticles.forEach((puff) => { puff.age += dt; puff.lane += game.lateralSpeed * dt * .012; });
    game.exhaustParticles.forEach((puff) => { puff.age += dt; });
    game.skidMarks = game.skidMarks.filter((mark) => mark.age < mark.life).slice(-300);
    game.smokeParticles = game.smokeParticles.filter((puff) => puff.age < puff.life).slice(-70);
    game.exhaustParticles = game.exhaustParticles.filter((puff) => puff.age < puff.life).slice(-60);

    keepEntitiesAhead();
    for (const entity of game.entities) {
      if (entity.type === 'car') entity.s += entity.speed * dt;
      let longitudinalGap = entity.s - game.progress;
      let lateralGap = Math.abs(entity.lane - game.lateral);
      if (entity.type === 'coin' && game.magnet) {
        if (!entity.magnetized && Math.abs(longitudinalGap) < 190 && lateralGap < 215) entity.magnetized = true;
        if (entity.magnetized) {
          entity.s += Math.max(-460 * dt, Math.min(460 * dt, game.progress - entity.s));
          entity.lane += Math.max(-620 * dt, Math.min(620 * dt, game.lateral - entity.lane));
          longitudinalGap = entity.s - game.progress; lateralGap = Math.abs(entity.lane - game.lateral);
        }
      }
      const coinLongitudinalRange = entity.magnetized ? 36 : 22;
      const coinLateralRange = entity.magnetized ? 70 : 54;
      if (entity.type === 'coin' && Math.abs(longitudinalGap) < coinLongitudinalRange && lateralGap < coinLateralRange) {
        entity.collected = true; game.runCoins++; profile.coins++; saveProfile(); renderWallet();
        game.score += currentMode().id === 'coins' ? 180 : 70; playSound('coin'); toast(entity.magnetized ? 'MIKNATIS JETONU ÇEKTİ  +1' : 'JETON TOPLANDI  +1');
      } else if (entity.type === 'ramp' && !entity.used && Math.abs(longitudinalGap) < 22 && lateralGap < 55) {
        entity.used = true; game.jumpTime = Math.max(game.jumpTime, .86); game.shake = .12;
        game.score += Math.max(40, Math.round(Math.abs(game.speed) * .6));
        toast('RAMPA!'); playSound('pass');
      } else if ((entity.type === 'car' || entity.type === 'cone') && game.jumpHeight < 26 && !entity.hit && Math.abs(longitudinalGap) < (entity.type === 'car' ? 37 : 27)) {
        const collisionWidth = entity.type === 'car' ? 51 : 38;
        if (lateralGap < collisionWidth) {
          entity.hit = true; game.speed *= entity.type === 'car' ? .48 : .62; game.score = Math.max(0, game.score - 175);
          game.combo = 1; game.driftTime = 0; game.shake = .48;
          if (damagePlayer(entity.type === 'car' ? 'ARACA ÇARPTIN' : 'ENGELE ÇARPTIN')) { finishRun(); return; }
          if (currentMode().id !== 'free') { playSound('crash'); toast(entity.type === 'car' ? 'DİKKAT! TRAFİĞE ÇARPTIN' : 'ENGELE ÇARPTIN'); }
        } else if (entity.type === 'car' && !entity.passed && longitudinalGap < -37) {
          entity.passed = true;
          if (lateralGap < 100) { game.score += 250; game.combo = Math.min(6, game.combo + .25); game.maxCombo = Math.max(game.maxCombo, game.combo); toast('YAKIN GEÇİŞ  +250'); playSound('pass'); }
        }
      }
    }
    game.entities = game.entities.filter((entity) => !entity.collected && !entity.hit && entity.s > game.progress - 110);
    game.shake = Math.max(0, game.shake - dt);
    if (!(drifting && driftQuality > .12 && Math.abs(game.speed) > 75)) setDriftSound(false);
    if (currentMode().duration != null && game.timeLeft <= 0) finishRun();
    updateHud();
  }

  function renderWallet() { $('#wallet-value').textContent = profile.coins.toLocaleString('tr-TR'); }
  function updateHud() {
    $('#score-value').textContent = Math.floor(game.score).toLocaleString('tr-TR').padStart(6, '0');
    $('#combo-value').textContent = `x${game.combo.toFixed(1)}`;
    $('#speed-value').textContent = Math.round(Math.abs(game.speed) * .72).toString();
    $('#turbo-value').textContent = Math.round(game.turbo).toString();
    $('#turbo-fill').style.width = `${game.turbo}%`;
    $('#run-coins').textContent = game.runCoins.toString();
    const mode = currentMode();
    if (mode.duration == null) $('#hud-mode').textContent = mode.name;
    else {
      const seconds = Math.ceil(game.timeLeft);
      $('#hud-mode').textContent = `${mode.name} · ${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
    }
    $('#hud-track').textContent = currentTrack().name;
    $('#hud-chapter').textContent = `BÖLÜM ${String(profile.level).padStart(2, '0')} / 20`;
    $('#camera-button').classList.toggle('active', game.cameraMode === 1);
    $('#magnet-badge').classList.toggle('hidden', !game.magnet);
    $('#magnet-badge').classList.toggle('active', game.magnet);
    $('#gear-auto-display').classList.toggle('hidden', profile.transmission !== 'auto');
    $('#manual-gear-shifter').classList.toggle('hidden', profile.transmission !== 'manual');
    $('#auto-gear-number').textContent = game.gear;
    $('#manual-gear-number').textContent = game.gear;
    $('#gear-handle').style.setProperty('--gear-index', game.gear - 1);
    $$('[data-gear]').forEach((button) => button.classList.toggle('active', Number(button.dataset.gear) === game.gear));
    $('#life-display').classList.toggle('hidden', currentMode().id !== 'free');
    if (game.lastHudLives !== game.lives) {
      game.lastHudLives = game.lives;
      $('#lives-icons').innerHTML = [1, 2, 3].map((life) => `<i class="${life <= game.lives ? 'alive' : 'lost'}">♥</i>`).join('');
    }
    const bars = Math.max(0, Math.min(12, Math.ceil(Math.abs(game.speed) / (285 + (currentCar().engine + profile.upgrades.engine) * 11) * 12)));
    $$('.speed-bars i').forEach((bar, i) => bar.classList.toggle('on', i < bars));
    $('#drift-pop').classList.toggle('hidden', !game.driving || performance.now() > game.driftPopUntil || game.paused);
    $('#drift-pop-value').textContent = Math.floor(game.driftPopValue).toString();
  }

  function startRun() {
    playSound('start'); ensureAudio(); ensureMusic(); setDriftSound(false);
    game.cameraMode = 0; resize();
    game.driving = true; game.paused = false; game.progress = 0; game.speed = 0; game.lateral = 0; game.lateralSpeed = 0; game.yaw = 0; game.yawRate = 0; game.steerAngle = 0; game.slipAngle = 0;
    game.score = 0; game.runCoins = 0; game.combo = 1; game.maxCombo = 1; game.driftTime = 0; game.turbo = 100;
    game.elapsed = 0; game.timeLeft = currentMode().duration || 0; game.lives = 3; game.lastHudLives = 0; game.hitCooldown = 0; game.wallHitCooldown = 0;
    game.gear = 1; game.magnet = Boolean(profile.accessories.magnet); game.jumpTime = 0; game.jumpHeight = 0;
    if (game.magnet) { profile.accessories.magnet = false; saveProfile(); renderWallet(); }
    game.spawnIndex = 0; game.entities = []; game.skidMarks = []; game.smokeParticles = []; game.exhaustParticles = []; game.skidTimer = 0; game.smokeTimer = 0; game.exhaustTimer = 0; game.shake = 0;
    clearControls();
    $$('.screen').forEach((el) => el.classList.add('hidden'));
    $('#game-hud').classList.remove('hidden'); $('#pause-overlay').classList.add('hidden'); $('#run-result').classList.add('hidden');
    $('.topbar').classList.add('hidden'); $('#settings-button').classList.add('hidden');
    updateHud();
  }

  function pauseRun() {
    if (!game.driving) return;
    game.paused = true; clearControls(); setDriftSound(false); $('#pause-overlay').classList.remove('hidden');
    if (game.sound?.context?.state === 'running') game.sound.context.suspend();
  }
  function resumeRun() {
    game.paused = false; $('#pause-overlay').classList.add('hidden'); ensureAudio(); ensureMusic();
  }
  function finishRun() {
    if (!game.driving) return;
    game.driving = false; game.paused = false; clearControls(); setDriftSound(false);
    profile.bestScore = Math.max(profile.bestScore, Math.floor(game.score)); saveProfile();
    $('#result-score').textContent = Math.floor(game.score).toLocaleString('tr-TR');
    $('#result-coins').textContent = game.runCoins.toString();
    $('#result-combo').textContent = `x${game.maxCombo.toFixed(1)}`;
    $('#result-kicker').textContent = game.lives === 0 && currentMode().id === 'free' ? 'CANLAR TÜKENDİ' : 'SÜRÜŞ TAMAMLANDI';
    $('#run-result').classList.remove('hidden'); $('#pause-overlay').classList.add('hidden');
    renderHome();
  }
  function leaveRun() {
    game.driving = false; game.paused = false; clearControls(); setDriftSound(false);
    $('#game-hud').classList.add('hidden'); $('#run-result').classList.add('hidden'); $('#pause-overlay').classList.add('hidden');
    $('.topbar').classList.remove('hidden'); $('#settings-button').classList.remove('hidden');
    showScreen('home'); renderHome();
  }
  function clearControls() { Object.keys(controls).forEach((key) => { controls[key] = false; }); $$('.touch-button').forEach((button) => button.classList.remove('active')); }

  function showScreen(name) {
    if (game.driving && !game.paused) pauseRun();
    $$('.screen').forEach((screen) => screen.classList.toggle('hidden', screen.id !== `${name}-screen`));
    $$('.nav-button').forEach((button) => button.classList.toggle('active', button.dataset.screen === name));
    if (name === 'garage') renderGarage();
    if (name === 'modes') renderModes();
    if (name === 'settings') syncSoundButtons();
  }

  function renderHome() {
    $('#home-car-name').textContent = currentCar().name;
    $('#home-best').innerHTML = `${Math.floor(profile.bestScore).toLocaleString('tr-TR')} <span>PUAN</span>`;
    $('#home-track').textContent = `BÖLÜM ${String(profile.level).padStart(2, '0')} · ${currentTrack().short}`;
    renderWallet();
  }

  function renderGarage() {
    renderWallet();
    $('#garage-car-name').textContent = currentCar().name;
    $('#garage-car-desc').textContent = currentCar().desc;
    $('#preview-car').style.setProperty('--car-color', currentPaint());
    $('#preview-car').style.setProperty('--rim-color', wheels[profile.mods.wheel]?.color || '#0a0d0d');
    $('#preview-car').style.setProperty('--neon-color', neons[profile.mods.neon]?.color || '#000000');
    $('#preview-car').style.setProperty('--spoiler-color', spoilers[profile.mods.spoiler]?.color || '#171b19');
    $('#preview-car').classList.toggle('single-stripe', profile.mods.stripe === 0);
    $('#preview-car').classList.toggle('neon-equipped', profile.mods.neon > 0);
    $('#preview-car').classList.toggle('spoiler-equipped', profile.mods.spoiler > 0);
    $('#owned-count').textContent = `${profile.owned.length} / ${cars.length}`;
    $('#car-list').innerHTML = cars.map((car, index) => {
      const owned = profile.owned.includes(index), selected = profile.car === index;
      return `<button class="car-option ${selected ? 'active' : ''}" data-car="${index}" style="--paint:${car.color}"><span class="mini-car"></span><b>${car.name}</b><small>${selected ? 'SEÇİLİ' : owned ? 'SAHİP' : `₵ ${car.price}`}</small></button>`;
    }).join('');
    $$('.car-option').forEach((button) => button.addEventListener('click', () => selectCar(Number(button.dataset.car))));
    const upgrades = [
      { key: 'engine', icon: '↗', name: 'MOTOR', desc: 'Daha yüksek son hız', base: 130 },
      { key: 'grip', icon: '⌁', name: 'YOL TUTUŞU', desc: 'Virajlarda daha iyi kontrol', base: 115 },
      { key: 'turbo', icon: 'ϟ', name: 'TURBO HÜCRESİ', desc: 'Daha uzun turbo kullanımı', base: 145 }
    ];
    $('#upgrade-list').innerHTML = upgrades.map((item) => {
      const level = profile.upgrades[item.key], cost = item.base + level * 115, maxed = level >= 5;
      return `<div class="upgrade-row"><span class="upgrade-icon">${item.icon}</span><div class="upgrade-desc"><b>${item.name} <span style="color:#a2aea4">LVL ${level}/5</span></b><small>${item.desc}</small><span class="upgrade-bars">${[1,2,3,4,5].map((n) => `<i class="${n <= level ? 'on' : ''}"></i>`).join('')}</span></div><button class="upgrade-buy" data-upgrade="${item.key}" ${maxed || profile.coins < cost ? 'disabled' : ''}>${maxed ? 'TAM' : `₵ ${cost}`}</button></div>`;
    }).join('');
    $$('.upgrade-buy').forEach((button) => button.addEventListener('click', () => buyUpgrade(button.dataset.upgrade)));
    renderCustomization();
    renderAccessories();
  }

  function selectCar(index) {
    if (profile.owned.includes(index)) { profile.car = index; saveProfile(); renderGarage(); renderHome(); return; }
    if (profile.coins < cars[index].price) { toast(`BU ARAÇ İÇİN ${cars[index].price - profile.coins} JETON DAHA GEREK`); return; }
    profile.coins -= cars[index].price; profile.owned.push(index); profile.car = index; saveProfile(); renderGarage(); renderHome(); playSound('buy'); toast(`${cars[index].name} GARAJA EKLENDİ`);
  }
  function buyUpgrade(key) {
    const level = profile.upgrades[key], costs = { engine: 130, grip: 115, turbo: 145 }, cost = costs[key] + level * 115;
    if (level >= 5 || profile.coins < cost) return;
    profile.coins -= cost; profile.upgrades[key]++; saveProfile(); renderGarage(); renderHome(); playSound('buy'); toast('GELİŞTİRME TAMAMLANDI');
  }

  function renderCustomization() {
    $('#paint-swatches').innerHTML = paints.map((paint, index) => {
      const owned = profile.ownedMods.paint.includes(index), selected = profile.mods.paint === index;
      return `<button class="paint-swatch ${selected ? 'active' : ''} ${owned ? '' : 'locked'}" data-mod-group="paint" data-mod-index="${index}" style="--paint:${paint.color}" aria-label="${paint.name}, ${owned ? selected ? 'seçili' : 'sahip' : `${paint.cost} jeton`}"><i></i><small>${owned ? selected ? '✓' : '•' : paint.cost}</small></button>`;
    }).join('');
    $('#stripe-options').innerHTML = stripes.map((stripe, index) => {
      const owned = profile.ownedMods.stripe.includes(index), selected = profile.mods.stripe === index;
      return `<button class="mod-choice ${selected ? 'active' : ''}" data-mod-group="stripe" data-mod-index="${index}"><span class="stripe-sample stripe-${index}"></span><b>${stripe.name}</b><small>${owned ? selected ? 'SEÇİLİ' : 'SAHİP' : `₵ ${stripe.cost}`}</small></button>`;
    }).join('');
    $('#wheel-options').innerHTML = wheels.map((wheel, index) => {
      const owned = profile.ownedMods.wheel.includes(index), selected = profile.mods.wheel === index;
      return `<button class="mod-choice ${selected ? 'active' : ''}" data-mod-group="wheel" data-mod-index="${index}"><span class="wheel-sample" style="--rim:${wheel.color}"></span><b>${wheel.name}</b><small>${owned ? selected ? 'SEÇİLİ' : 'SAHİP' : `₵ ${wheel.cost}`}</small></button>`;
    }).join('');
    $('#spoiler-options').innerHTML = spoilers.map((item, index) => {
      const owned = profile.ownedMods.spoiler.includes(index), selected = profile.mods.spoiler === index;
      return `<button class="mod-choice ${selected ? 'active' : ''}" data-mod-group="spoiler" data-mod-index="${index}"><span class="spoiler-sample spoiler-${index}"></span><b>${item.name}</b><small>${owned ? selected ? 'SEÇİLİ' : 'SAHİP' : `₵ ${item.cost}`}</small></button>`;
    }).join('');
    $('#neon-options').innerHTML = neons.map((item, index) => {
      const owned = profile.ownedMods.neon.includes(index), selected = profile.mods.neon === index;
      return `<button class="mod-choice ${selected ? 'active' : ''}" data-mod-group="neon" data-mod-index="${index}"><span class="neon-sample" style="--neon:${item.color}"></span><b>${item.name}</b><small>${owned ? selected ? 'SEÇİLİ' : 'SAHİP' : `₵ ${item.cost}`}</small></button>`;
    }).join('');
    $$('[data-mod-group]').forEach((button) => button.addEventListener('click', () => buyModification(button.dataset.modGroup, Number(button.dataset.modIndex))));
  }

  function buyModification(group, index) {
    const lists = { paint: paints, stripe: stripes, wheel: wheels, spoiler: spoilers, neon: neons };
    const item = lists[group]?.[index]; if (!item) return;
    const owned = profile.ownedMods[group];
    const purchased = !owned.includes(index);
    if (purchased) {
      if (profile.coins < item.cost) { toast(`BU MODİFİKASYON İÇİN ${item.cost - profile.coins} JETON DAHA GEREK`); return; }
      profile.coins -= item.cost; owned.push(index); playSound('buy');
    }
    profile.mods[group] = index; saveProfile(); renderGarage(); renderHome();
    toast(purchased ? 'MODİFİKASYON AÇILDI' : 'MODİFİKASYON UYGULANDI');
  }

  function renderAccessories() {
    const accessories = [
      { key: 'magnet', name: 'JETON MIKNATISI', icon: '⊕', cost: 50, desc: '50 jetonluk tek sürüş eklentisi; her yarış için yeniden alınır.' },
      { key: 'nitro', name: 'NİTRO ENJEKTÖRÜ', icon: 'ϟ', cost: 420, desc: 'Turbo hızını ve egzoz alevini güçlendirir.' }
    ];
    $('#accessory-list').innerHTML = accessories.map((item) => {
      const owned = profile.accessories[item.key];
      return `<div class="accessory-item"><span class="accessory-icon">${item.icon}</span><div><b>${item.name}</b><small>${item.desc}</small></div><button data-accessory="${item.key}" ${owned ? 'disabled' : ''}>${owned ? 'HAZIR' : `₵ ${item.cost}`}</button></div>`;
    }).join('');
    $$('[data-accessory]').forEach((button) => button.addEventListener('click', () => buyAccessory(button.dataset.accessory)));
  }

  function buyAccessory(key) {
    const prices = { magnet: 50, nitro: 420 }, cost = prices[key];
    if (!cost || profile.accessories[key]) return;
    if (profile.coins < cost) { toast(`EKLENTİ İÇİN ${cost - profile.coins} JETON DAHA GEREK`); return; }
    profile.coins -= cost; profile.accessories[key] = true; saveProfile(); renderGarage(); renderHome(); playSound('buy');
    toast(key === 'magnet' ? 'JETON MIKNATISI TAKILDI' : 'NİTRO ENJEKTÖRÜ TAKILDI');
  }

  function renderModes() {
    $('#mode-grid').innerHTML = modes.map((mode) => `<button class="mode-card ${profile.mode === mode.id ? 'active' : ''}" data-mode="${mode.id}"><span class="mode-icon">${mode.icon}</span><span class="mode-duration">${mode.duration ? `${mode.duration} SANİYE` : 'SÜRESİZ'}</span><h3>${mode.name}</h3><p>${mode.description}</p></button>`).join('');
    $$('.mode-card').forEach((button) => button.addEventListener('click', () => { profile.mode = button.dataset.mode; saveProfile(); renderModes(); }));
    $('#track-list').innerHTML = tracks.map((track, index) => `<button class="track-chip ${profile.track === index ? 'active' : ''}" data-track="${index}"><b>${track.name}</b><small>${track.theme}</small></button>`).join('');
    $$('.track-chip').forEach((button) => button.addEventListener('click', () => { profile.track = Number(button.dataset.track); saveProfile(); renderModes(); renderHome(); }));
    renderChapters();
  }

  function renderChapters() {
    const highest = highestUnlockedLevel();
    $('#chapter-progress').textContent = `${String(highest).padStart(2, '0')} / 20 AÇIK`;
    const difficultyName = (level) => level < 6 ? 'ÇAYLAK' : level < 11 ? 'SÜRÜCÜ' : level < 16 ? 'USTA' : 'EFSANE';
    $('#chapter-grid').innerHTML = Array.from({ length: 20 }, (_, index) => {
      const level = index + 1, unlocked = profile.unlockedLevels.includes(level), next = level === highest + 1;
      const active = profile.level === level, cost = chapterCost(level);
      const status = unlocked ? active ? 'SEÇİLİ' : 'AÇIK' : next ? `₵ ${cost}` : '🔒';
      return `<button class="chapter-card ${active ? 'active' : ''} ${unlocked ? 'unlocked' : 'locked'} ${next ? 'next' : ''}" data-level="${level}" ${!unlocked && !next ? 'disabled' : ''}><span class="chapter-number">${String(level).padStart(2, '0')}</span><b>BÖLÜM ${String(level).padStart(2, '0')}</b><small>${difficultyName(level)}</small><i>${status}</i></button>`;
    }).join('');
    $$('.chapter-card').forEach((button) => button.addEventListener('click', () => selectChapter(Number(button.dataset.level))));
    $('#mode-play-button').innerHTML = `<span>▶</span> BÖLÜM ${String(profile.level).padStart(2, '0')} İÇİN SÜR <b>↗</b>`;
  }

  function selectChapter(level) {
    if (profile.unlockedLevels.includes(level)) {
      profile.level = level; saveProfile(); renderModes(); renderHome(); return;
    }
    const next = highestUnlockedLevel() + 1;
    if (level !== next) return;
    const cost = chapterCost(level);
    if (profile.coins < cost) { toast(`BÖLÜMÜ AÇMAK İÇİN ${cost - profile.coins} JETON DAHA GEREK`); return; }
    profile.coins -= cost; profile.unlockedLevels.push(level); profile.level = level; saveProfile(); renderModes(); renderHome(); playSound('buy');
    toast(`BÖLÜM ${String(level).padStart(2, '0')} AÇILDI`);
  }

  function toggleCamera() {
    if (!game.driving) return;
    game.cameraMode = game.cameraMode ? 0 : 1; resize(); updateHud();
    toast(game.cameraMode ? 'YAKIN TAKİP KAMERASI' : 'UZAK TAKİP KAMERASI');
  }

  function toast(message) {
    const node = $('#toast'); node.textContent = message; node.classList.remove('hidden');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => node.classList.add('hidden'), 1500);
  }

  function soundEngine() {
    if (game.sound) return game.sound;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    const audioContext = new AudioContextClass();
    const master = audioContext.createGain(); master.gain.value = profile.music ? .16 : 0; master.connect(audioContext.destination);
    const sfxMaster = audioContext.createGain(); sfxMaster.gain.value = .72; sfxMaster.connect(audioContext.destination);
    game.sound = { context: audioContext, master, sfxMaster, musicTimer: null, step: 0, driftLoop: null, noiseBuffer: null };
    return game.sound;
  }
  function ensureAudio() {
    const audio = soundEngine();
    if (audio?.context.state === 'suspended') audio.context.resume();
    return audio;
  }
  function tone(frequency, type, duration, volume, slide = null, destination = null) {
    const audio = soundEngine(); if (!audio) return;
    const now = audio.context.currentTime;
    const osc = audio.context.createOscillator(), gain = audio.context.createGain();
    osc.type = type; osc.frequency.setValueAtTime(frequency, now);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(1, slide), now + duration);
    gain.gain.setValueAtTime(Math.max(.0001, volume), now); gain.gain.exponentialRampToValueAtTime(.0001, now + duration);
    osc.connect(gain); gain.connect(destination || audio.master); osc.start(now); osc.stop(now + duration + .02);
  }
  function musicStep() {
    const audio = game.sound; if (!audio || !profile.music) return;
    const track = musicTracks[profile.musicTrack] || musicTracks.neon;
    const i = audio.step % 16;
    if (i % 4 === 0) tone(track.bass[i] || track.bass[0], track.wave, .23, .09);
    if ([0, 3, 6, 8, 11, 14].includes(i)) {
      const melody = track.lead[[0, 3, 6, 8, 11, 14].indexOf(i)];
      tone(melody, track.leadWave, .37, .032);
    }
    if (i % 8 === 0) tone(track.bass[0] * 1.14, 'sine', .14, .16, track.bass[0] * .38);
    else if (i % 4 === 2) tone(track.name === 'BUZ PİSTİ' ? 5400 : 7600, track.wave, .035, .013);
    if (i === 4 || i === 12) tone(track.bass[2] * 1.5, track.leadWave, .085, .055);
    audio.step++;
  }
  function ensureMusic() {
    if (!profile.music) return;
    const audio = ensureAudio(); if (!audio) return;
    audio.master.gain.cancelScheduledValues(audio.context.currentTime); audio.master.gain.setTargetAtTime(.16, audio.context.currentTime, .12);
    if (audio.musicTimer == null) { audio.step = 0; musicStep(); audio.musicTimer = setInterval(musicStep, (musicTracks[profile.musicTrack] || musicTracks.neon).tempo); }
  }
  function toggleMusic() {
    profile.music = !profile.music; saveProfile();
    if (profile.music) ensureMusic();
    else if (game.sound) {
      game.sound.master.gain.setTargetAtTime(0, game.sound.context.currentTime, .08);
      clearInterval(game.sound.musicTimer); game.sound.musicTimer = null;
    }
    syncSoundButtons();
  }
  function syncSoundButtons() {
    $('#sound-label').textContent = profile.music ? 'MÜZİK AÇIK' : 'MÜZİK KAPALI';
    $('.sound-icon').textContent = profile.music ? '♫' : '♪';
    $('#settings-sound').classList.toggle('on', profile.music);
    $('#music-track-select').value = profile.musicTrack;
    $('#transmission-select').value = profile.transmission;
  }
  function playSound(kind) {
    const audio = ensureAudio(); if (!audio) return;
    const effects = {
      coin: [880, 'sine', .15, .07, 1320], start: [420, 'triangle', .3, .08, 880],
      crash: [105, 'sawtooth', .22, .14, 44], pass: [610, 'sine', .19, .055, 920], buy: [660, 'triangle', .26, .08, 990]
    };
    const sound = effects[kind]; if (sound) tone(sound[0], sound[1], sound[2], sound[3], sound[4], audio.sfxMaster);
  }
  function setDriftSound(active, quality = 0, slip = 0) {
    const audio = game.sound;
    if (!active || !audio) {
      if (audio?.driftLoop) {
        const loop = audio.driftLoop; audio.driftLoop = null;
        loop.gain.gain.setTargetAtTime(0, audio.context.currentTime, .08);
        try { loop.source.stop(audio.context.currentTime + .3); } catch { /* It may already be fading out. */ }
      }
      return;
    }
    if (!audio.driftLoop) {
      if (!audio.noiseBuffer) {
        const buffer = audio.context.createBuffer(1, audio.context.sampleRate, audio.context.sampleRate);
        const samples = buffer.getChannelData(0);
        for (let i = 0; i < samples.length; i++) samples[i] = (Math.random() * 2 - 1) * .55;
        audio.noiseBuffer = buffer;
      }
      const source = audio.context.createBufferSource(), filter = audio.context.createBiquadFilter(), gain = audio.context.createGain();
      source.buffer = audio.noiseBuffer; source.loop = true; filter.type = 'bandpass'; filter.frequency.value = 850; filter.Q.value = .8; gain.gain.value = 0;
      source.connect(filter); filter.connect(gain); gain.connect(audio.sfxMaster); source.start();
      audio.driftLoop = { source, filter, gain };
    }
    const loop = audio.driftLoop, now = audio.context.currentTime;
    loop.filter.frequency.setTargetAtTime(520 + Math.min(.8, Math.abs(slip)) * 2100, now, .06);
    loop.gain.gain.setTargetAtTime(.035 + quality * .12, now, .07);
  }

  $$('.nav-button').forEach((button) => button.addEventListener('click', () => showScreen(button.dataset.screen)));
  $$('[data-screen="home"]').forEach((button) => button.addEventListener('click', () => showScreen('home')));
  $('#home-button').addEventListener('click', () => { if (game.driving) { pauseRun(); } else showScreen('home'); });
  $('#play-button').addEventListener('click', startRun);
  $('#mode-play-button').addEventListener('click', startRun);
  $('#camera-button').addEventListener('click', toggleCamera);
  $('#settings-button').addEventListener('click', () => showScreen('settings'));
  $('#avatar').addEventListener?.('click', () => showScreen('settings'));
  $('#sound-button').addEventListener('click', toggleMusic);
  $('#settings-sound').addEventListener('click', toggleMusic);
  $('#music-track-select').addEventListener('change', (event) => chooseMusicTrack(event.target.value));
  $('#transmission-select').addEventListener('change', (event) => chooseTransmission(event.target.value));
  $$('[data-gear]').forEach((button) => button.addEventListener('click', () => setManualGear(Number(button.dataset.gear))));
  $('#pause-button').addEventListener('click', pauseRun);
  $('#mobile-pause-button').addEventListener('click', pauseRun);
  $('#resume-button').addEventListener('click', resumeRun);
  $('#finish-button').addEventListener('click', finishRun);
  $('#result-home-button').addEventListener('click', leaveRun);
  $('#retry-button').addEventListener('click', startRun);

  function setControl(key, down) { if (key in controls) controls[key] = down; }
  const keyMap = { w: 'up', arrowup: 'up', s: 'down', arrowdown: 'down', a: 'left', arrowleft: 'left', d: 'right', arrowright: 'right', ' ': 'drift', shift: 'turbo' };
  window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (game.driving && profile.transmission === 'manual' && !event.repeat && (key === 'q' || key === 'e')) {
      event.preventDefault(); setManualGear(game.gear + (key === 'e' ? 1 : -1));
    }
    if (keyMap[key]) { event.preventDefault(); setControl(keyMap[key], true); ensureMusic(); }
    if (key === 'c' && game.driving && !event.repeat) { event.preventDefault(); toggleCamera(); }
    if ((key === 'escape' || key === 'p') && game.driving) { event.preventDefault(); game.paused ? resumeRun() : pauseRun(); }
  });
  window.addEventListener('keyup', (event) => { const key = event.key.toLowerCase(); if (keyMap[key]) { event.preventDefault(); setControl(keyMap[key], false); } });
  window.addEventListener('blur', clearControls);
  $$('.touch-button').forEach((button) => {
    const key = button.dataset.control;
    button.addEventListener('pointerdown', (event) => { event.preventDefault(); button.setPointerCapture?.(event.pointerId); setControl(key, true); button.classList.add('active'); ensureMusic(); });
    const release = (event) => { event.preventDefault(); setControl(key, false); button.classList.remove('active'); };
    button.addEventListener('pointerup', release); button.addEventListener('pointercancel', release); button.addEventListener('lostpointercapture', release);
  });
  window.addEventListener('contextmenu', (event) => { if (game.driving) event.preventDefault(); });

  function frame(now) {
    const dt = Math.min(.04, Math.max(0, (now - game.lastFrame) / 1000)); game.lastFrame = now;
    updateGame(dt);
    if (!game.driving) game.idleProgress += dt * 26;
    const progress = game.driving ? game.progress : game.idleProgress;
    drawWorld(progress, true);
    requestAnimationFrame(frame);
  }

  renderHome(); syncSoundButtons(); requestAnimationFrame(frame);
})();
