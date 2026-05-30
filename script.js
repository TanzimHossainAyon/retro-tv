// Retro CRT TV Simulator
// Author: Tanzim Hossain Ayon | BRAC University | IEEE Researcher

// ===== STATE =====
let currentChannel = 1;
let totalChannels = 7;
let isPowered = true;
let isMuted = false;
let volume = 7;
let osdTimer = null;
let vizAnimId = null;
let clockTimer = null;

// ===== NOISE CANVAS =====
const noiseCanvas = document.getElementById('noise-canvas');
const nCtx = noiseCanvas.getContext('2d');
noiseCanvas.width = 480; noiseCanvas.height = 360;

function drawNoise(opacity = 0.08) {
  const imgData = nCtx.createImageData(480, 360);
  for (let i = 0; i < imgData.data.length; i += 4) {
    const v = Math.random() * 255;
    imgData.data[i] = 0;
    imgData.data[i+1] = v > 200 ? v : 0;
    imgData.data[i+2] = 0;
    imgData.data[i+3] = v * opacity;
  }
  nCtx.putImageData(imgData, 0, 0);
}
setInterval(() => { if (isPowered) drawNoise(); }, 50);

// ===== CHANNEL CONTENT =====
const channels = {
  1: {
    name: 'CH 1 · ABOUT ME',
    render: () => `
      <div class="ch-title">▶ TANZIM TV · PERSONAL INFO</div>
      <div class="ch-line bright">TANZIM HOSSAIN AYON</div>
      <div class="ch-line dim">━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
      <div class="ch-line">🎓 B.Sc. CSE · BRAC University</div>
      <div class="ch-line">📍 Dhaka, Bangladesh</div>
      <div class="ch-line">🎂 24 December 2001</div>
      <div class="ch-line">🇧🇩 Bangladeshi</div>
      <hr class="ch-divider">
      <div class="ch-line amber">IEEE-PUBLISHED RESEARCHER</div>
      <div class="ch-line">Deep Learning · Generative AI</div>
      <div class="ch-line">Knowledge Distillation · CV</div>
      <hr class="ch-divider">
      <div class="ch-line dim">🌐 tanzimhossainayon.vercel.app</div>
      <div class="ch-line blink">█ PRESS CH+ FOR MORE INFO</div>`
  },
  2: {
    name: 'CH 2 · SKILLS',
    render: () => `
      <div class="ch-title">▶ TANZIM TV · TECH SKILLS</div>
      <div class="ch-line amber">PROGRAMMING LANGUAGES</div>
      ${[['Python',90],['C / C++',75],['Java',68],['SQL',65]].map(([n,v])=>`
      <div class="crt-bar-wrap">
        <div class="crt-bar-label">${n}</div>
        <div class="crt-bar"><div class="crt-bar-fill" style="width:${v}%"></div></div>
      </div>`).join('')}
      <hr class="ch-divider">
      <div class="ch-line amber">AI & DEEP LEARNING</div>
      ${[['PyTorch',85],['TensorFlow',80],['Keras',75],['Scikit-learn',70]].map(([n,v])=>`
      <div class="crt-bar-wrap">
        <div class="crt-bar-label">${n}</div>
        <div class="crt-bar"><div class="crt-bar-fill" style="width:${v}%"></div></div>
      </div>`).join('')}`
  },
  3: {
    name: 'CH 3 · RESEARCH',
    render: () => `
      <div class="ch-title">▶ TANZIM TV · IEEE PUBLICATION</div>
      <div class="ch-line bright" style="font-size:0.85rem;line-height:1.4;">An Efficient Deep Learning Framework for Diabetic Retinopathy Classification</div>
      <div class="ch-line dim">━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
      <div class="ch-line">📋 IEEE STI 2025 · Dhaka</div>
      <div class="ch-line">📅 11-12 December 2025</div>
      <div class="ch-line dim">DOI: 10.1109/STI69347.2025.11367503</div>
      <hr class="ch-divider">
      <div class="ch-line amber">KEY RESULTS</div>
      <div class="ch-line">✅ Accuracy: 95.8%</div>
      <div class="ch-line">✅ QWK Score: 0.975</div>
      <div class="ch-line">✅ FID Score: 23.4</div>
      <div class="ch-line">✅ Param Reduction: 96.8%</div>
      <div class="ch-line blink">█ LIVE BROADCAST</div>`
  },
  4: {
    name: 'CH 4 · WEATHER',
    render: () => {
      const weathers = [
        {icon:'⛅',temp:'28°C',desc:'Partly Cloudy',city:'Dhaka'},
        {icon:'🌧️',temp:'22°C',desc:'Rainy',city:'Dhaka'},
        {icon:'☀️',temp:'32°C',desc:'Sunny',city:'Dhaka'}
      ];
      const w = weathers[Math.floor(Math.random()*weathers.length)];
      const now = new Date();
      return `
      <div class="ch-title">▶ TANZIM TV · WEATHER REPORT</div>
      <div class="ch-line dim">━━ LIVE WEATHER UPDATE ━━</div>
      <span class="weather-big">${w.icon}</span>
      <div class="weather-temp">${w.temp}</div>
      <div class="ch-line" style="text-align:center;">${w.desc} · ${w.city}</div>
      <hr class="ch-divider">
      <div class="ch-line">🕐 ${now.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})}</div>
      <div class="ch-line">📅 ${now.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</div>
      <hr class="ch-divider">
      <div class="ch-line">🌡️ Humidity: ${Math.floor(Math.random()*30+50)}%</div>
      <div class="ch-line">💨 Wind: ${Math.floor(Math.random()*20+5)} km/h</div>
      <div class="ch-line blink">█ UPDATING EVERY 30 MIN</div>`;
    }
  },
  5: {
    name: 'CH 5 · MUSIC',
    render: () => `
      <div class="ch-title">▶ TANZIM TV · MUSIC CHANNEL</div>
      <div class="ch-line amber" style="text-align:center;">♫ NOW PLAYING ♫</div>
      <div class="ch-line bright" style="text-align:center;">SYNTHWAVE DREAMS</div>
      <div class="ch-line dim" style="text-align:center;">Artist: RetroWave FM</div>
      <hr class="ch-divider">
      <canvas id="viz-canvas"></canvas>
      <hr class="ch-divider">
      <div class="ch-line" style="text-align:center;">VOL: ${volume * 10}%</div>
      <div class="ch-line blink" style="text-align:center;">♪ ♫ ♪ ♫ ♪ ♫ ♪</div>`
  },
  6: {
    name: 'CH 6 · CONTACT',
    render: () => `
      <div class="ch-title">▶ TANZIM TV · CONTACT INFO</div>
      <div class="ch-line amber">REACH OUT</div>
      <div class="ch-line dim">━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
      <div class="ch-line">📧 tanzimhossainayon90@gmail.com</div>
      <div class="ch-line">🎓 tanzim.hossain.ayon@g.bracu.ac.bd</div>
      <hr class="ch-divider">
      <div class="ch-line amber">ONLINE PROFILES</div>
      <div class="ch-line">🌐 tanzimhossainayon.vercel.app</div>
      <div class="ch-line">💼 LinkedIn: tanzim-hossain-ayon</div>
      <div class="ch-line">🔬 ORCID: 0009-0001-0920-7150</div>
      <div class="ch-line">🎓 Google Scholar: Tanzim Hossain Ayon</div>
      <div class="ch-line">🐙 GitHub: TanzimHossainAyon</div>
      <div class="ch-line blink">█ OPEN TO OPPORTUNITIES</div>`
  },
  7: {
    name: 'CH 7 · NO SIGNAL',
    render: () => `
      <div class="no-signal">
        <div class="test-pattern">
          ${['#fff','#ff0','#0ff','#0f0','#f0f','#f00','#00f'].map(c=>`<div class="test-bar" style="background:${c}"></div>`).join('')}
        </div>
        <div class="no-signal-text">NO SIGNAL</div>
      </div>`
  }
};

// ===== RENDER CHANNEL =====
function renderChannel(ch) {
  const content = document.getElementById('screen-content');
  const config = channels[ch];
  if (!config) return;
  content.innerHTML = config.render();
  document.getElementById('remote-display').textContent = config.name.split('·')[0].trim();

  // Start music viz if ch 5
  if (ch === 5) startViz();
  else stopViz();

  // Show OSD
  showOSD(config.name);
}

// ===== OSD =====
function showOSD(text) {
  const osd = document.getElementById('channel-osd');
  osd.textContent = text;
  osd.style.opacity = '1';
  if (osdTimer) clearTimeout(osdTimer);
  osdTimer = setTimeout(() => osd.style.opacity = '0', 2500);
}

// ===== CHANNEL CHANGE =====
function changeChannel(dir) {
  if (!isPowered) return;
  currentChannel = ((currentChannel - 1 + dir + totalChannels) % totalChannels) + 1;
  switchToChannel(currentChannel);
}

function gotoChannel(num) {
  if (!isPowered) return;
  if (num < 1) num = totalChannels;
  if (num > totalChannels) num = 1;
  if (num === 0) num = totalChannels;
  currentChannel = num;
  switchToChannel(currentChannel);
}

function switchToChannel(ch) {
  const wrap = document.getElementById('screen-wrap');
  const overlay = document.getElementById('static-overlay');

  // Static flash
  overlay.style.opacity = '1';
  wrap.classList.add('switching');

  setTimeout(() => {
    overlay.style.opacity = '0';
    wrap.classList.remove('switching');
    renderChannel(ch);
    // Rotate knob
    const knob = document.getElementById('ch-knob');
    knob.style.transform = `rotate(${ch * 45}deg)`;
  }, 200);
}

// ===== POWER =====
function togglePower() {
  const wrap = document.getElementById('screen-wrap');
  const led = document.getElementById('tv-led');

  if (isPowered) {
    isPowered = false;
    wrap.classList.add('powering-off');
    led.classList.remove('on');
    stopViz();
    setTimeout(() => {
      document.getElementById('screen-content').innerHTML = '';
      wrap.classList.remove('powering-off');
    }, 400);
  } else {
    isPowered = true;
    wrap.classList.add('powering-on');
    led.classList.add('on');
    setTimeout(() => {
      wrap.classList.remove('powering-on');
      renderChannel(currentChannel);
    }, 600);
  }
}

// ===== VOLUME =====
function changeVolume(dir) {
  volume = Math.max(0, Math.min(10, volume + dir));
  showOSD(`VOL: ${volume * 10}%`);
  const knob = document.getElementById('vol-knob');
  knob.style.transform = `rotate(${volume * 18}deg)`;
  if (ch === 5) renderChannel(5);
}

// ===== MUTE =====
function toggleMute() {
  isMuted = !isMuted;
  showOSD(isMuted ? '🔇 MUTED' : `🔊 VOL: ${volume * 10}%`);
}

// ===== INFO =====
function showInfo() {
  showOSD(`CH ${currentChannel} · VOL ${volume * 10}%`);
}

// ===== MUSIC VISUALIZER =====
function startViz() {
  startSynthwave();
  const vizCanvas = document.getElementById('viz-canvas');
  if (!vizCanvas) return;
  const vCtx = vizCanvas.getContext('2d');
  vizCanvas.width = 448; vizCanvas.height = 120;
  const bars = 40;
  let heights = Array(bars).fill(0);

  function drawViz() {
    vCtx.clearRect(0, 0, vizCanvas.width, vizCanvas.height);
    vCtx.fillStyle = '#001500';
    vCtx.fillRect(0, 0, vizCanvas.width, vizCanvas.height);

    const bw = vizCanvas.width / bars;
    heights = heights.map((h, i) => {
      const target = Math.random() * vizCanvas.height * 0.8;
      return h + (target - h) * 0.3;
    });

    heights.forEach((h, i) => {
      const x = i * bw + 1;
      const grad = vCtx.createLinearGradient(0, vizCanvas.height, 0, vizCanvas.height - h);
      grad.addColorStop(0, '#00ff41');
      grad.addColorStop(0.5, '#00cc33');
      grad.addColorStop(1, '#ffb000');
      vCtx.fillStyle = grad;
      vCtx.fillRect(x, vizCanvas.height - h, bw - 2, h);

      // Glow
      vCtx.shadowColor = '#00ff41';
      vCtx.shadowBlur = 4;
      vCtx.fillRect(x, vizCanvas.height - h, bw - 2, 2);
      vCtx.shadowBlur = 0;
    });
    vizAnimId = requestAnimationFrame(drawViz);
  }
  stopViz();
  drawViz();
}

function stopViz() {
  if (vizAnimId) cancelAnimationFrame(vizAnimId);
  vizAnimId = null;
  stopSynth();
}

// ===== KEYBOARD CONTROLS =====
document.addEventListener('keydown', e => {
  switch(e.key) {
    case 'ArrowUp': changeChannel(1); break;
    case 'ArrowDown': changeChannel(-1); break;
    case 'ArrowRight': changeVolume(1); break;
    case 'ArrowLeft': changeVolume(-1); break;
    case 'p': case 'P': togglePower(); break;
    case 'm': case 'M': toggleMute(); break;
    default:
      const n = parseInt(e.key);
      if (!isNaN(n) && n >= 0 && n <= 9) gotoChannel(n === 0 ? totalChannels : n);
  }
});

// ===== INIT =====
document.getElementById('tv-led').classList.add('on');
renderChannel(1);

// Save last channel
window.addEventListener('beforeunload', () => {
  localStorage.setItem('retrotv_ch', currentChannel);
  localStorage.setItem('retrotv_vol', volume);
});
const savedCh = parseInt(localStorage.getItem('retrotv_ch') || '1');
const savedVol = parseInt(localStorage.getItem('retrotv_vol') || '7');
volume = savedVol;
if (savedCh !== 1) setTimeout(() => gotoChannel(savedCh), 100);

// ===== WEB AUDIO SYNTHESIZER =====
let audioCtx = null;
let masterGain = null;
let oscillators = [];
let isPlaying = false;
let noteInterval = null;

function initAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.12;
  masterGain.connect(audioCtx.destination);
}

function startSynthwave() {
  initAudio();
  if (isPlaying) return;
  isPlaying = true;

  // Bass
  const bass = audioCtx.createOscillator();
  bass.type = 'sawtooth';
  bass.frequency.value = 55;
  const bassGain = audioCtx.createGain();
  bassGain.gain.value = 0.3;
  bass.connect(bassGain);
  bassGain.connect(masterGain);
  bass.start();

  // Melody
  const melody = audioCtx.createOscillator();
  melody.type = 'square';
  melody.frequency.value = 220;
  const melGain = audioCtx.createGain();
  melGain.gain.value = 0.1;
  melody.connect(melGain);
  melGain.connect(masterGain);
  melody.start();

  // Pad
  const pad = audioCtx.createOscillator();
  pad.type = 'sine';
  pad.frequency.value = 110;
  const padGain = audioCtx.createGain();
  padGain.gain.value = 0.06;
  pad.connect(padGain);
  padGain.connect(masterGain);
  pad.start();

  oscillators = [
    {osc: bass, gain: bassGain},
    {osc: melody, gain: melGain},
    {osc: pad, gain: padGain}
  ];

  // Animate melody notes
  const notes = [220, 262, 294, 330, 262, 220, 196, 220, 247, 294];
  let noteIdx = 0;
  noteInterval = setInterval(() => {
    if (!isPlaying) { clearInterval(noteInterval); return; }
    melody.frequency.setTargetAtTime(notes[noteIdx % notes.length], audioCtx.currentTime, 0.05);
    noteIdx++;
  }, 500);
}

function stopSynth() {
  if (!isPlaying) return;
  isPlaying = false;
  if (noteInterval) clearInterval(noteInterval);
  oscillators.forEach(function(item) {
    item.gain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.1);
    setTimeout(function() { try { item.osc.stop(); } catch(e){} }, 300);
  });
  oscillators = [];
}
