let x = 150, y = 150, vx = 2, vy = 1.5, radius = 100;
let mode = 0, bounceCount = 0, alpha = 1;
let modeQueue = [];
let isPaused = false;
let isRevealed = false;
let nextImageReady = false;

function nextMode() {
  bounceCount = 0;
  alpha = 1;
  isRevealed = false;

  if (modeQueue.length === 0) {
    modeQueue = [0, 1, 2, 3, 4, 5].sort(() => Math.random() - 0.5);
  }

  mode = modeQueue.pop();
  switch (mode) {
    case 0:
      x = 150; y = 150; vx = 2; vy = 1.5; radius = 200; break;
    case 1:
      y = Math.random() * canvas.height; x = 0; vx = 3; vy = 0; radius = 200; break;
    case 2:
      x = Math.random() * canvas.width; y = 0; vx = 0; vy = 3; radius = 200; break;
    case 3:
      vx = 0; vy = 0; radius = 200; break;
    case 4:
      radius = 50; x = Math.random() * canvas.width; y = canvas.height / 2; break;
    case 5:
      radius = 300; x = Math.random() * canvas.width; y = canvas.height / 2; break;
  }
}

// visualEffect.js
// 5種類のねじれ・歪みエフェクト描画処理

const canvas = document.getElementById('maskCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;



function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  switch (currentEffect) {
    case 'sliceRotate':  drawSliceRotate(); break;
    case 'sliceShift':   drawSliceShift(); break;
    case 'scaleCenter':  drawScaleDistort(); break;
    case 'swirl':        drawSwirlEffect(); break;
    case 'wave':         drawWaveEffect(); break;
  }

  requestAnimationFrame(draw);
}

function drawSliceRotate() {
  const sliceCount = 20;
  const sliceHeight = canvas.height / sliceCount;
  for (let i = 0; i < sliceCount; i++) {
    const dy = i * sliceHeight;
    const angle = (1 - effectProgress) * Math.sin(i * 0.3) * 0.5;
    ctx.save();
    ctx.translate(canvas.width / 2, dy + sliceHeight / 2);
    ctx.rotate(angle);
    ctx.drawImage(bgImage, -canvas.width / 2, -sliceHeight / 2, canvas.width, sliceHeight,
                 -canvas.width / 2, -sliceHeight / 2, canvas.width, sliceHeight);
    ctx.restore();
  }
}

function drawSliceShift() {
  const sliceCount = 30;
  const sliceHeight = canvas.height / sliceCount;
  for (let i = 0; i < sliceCount; i++) {
    const dx = (1 - effectProgress) * Math.sin(i * 0.4) * 100;
    const dy = i * sliceHeight;
    ctx.drawImage(bgImage, 0, dy, canvas.width, sliceHeight,
                  dx, dy, canvas.width, sliceHeight);
  }
}

function drawScaleDistort() {
  const scale = 1 + (1 - effectProgress) * 1.5;
  const w = canvas.width / scale;
  const h = canvas.height / scale;
  const x = (canvas.width - w) / 2;
  const y = (canvas.height - h) / 2;
  ctx.drawImage(bgImage, x, y, w, h);
}

function drawSwirlEffect() {
  const step = 5;
  for (let y = 0; y < canvas.height; y += step) {
    const ratio = y / canvas.height;
    const angle = (1 - effectProgress) * (0.5 - ratio) * Math.PI;
    ctx.save();
    ctx.translate(canvas.width / 2, y);
    ctx.rotate(angle);
    ctx.drawImage(bgImage, -canvas.width / 2, -step / 2, canvas.width, step,
                 -canvas.width / 2, -step / 2, canvas.width, step);
    ctx.restore();
  }
}

function drawWaveEffect() {
  const step = 4;
  for (let y = 0; y < canvas.height; y += step) {
    const dx = Math.sin(y * 0.05 + (1 - effectProgress) * 5) * 30 * (1 - effectProgress);
    ctx.drawImage(bgImage, 0, y, canvas.width, step,
                  dx, y, canvas.width, step);
  }
}

draw();
