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

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

  if (!isRevealed) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  if (isPaused) {
    ctx.save();
    ctx.font = 'bold 160px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 8;
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'white';
    const text = '答えをどうぞ！！';
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    ctx.strokeText(text, cx, cy);
    ctx.fillText(text, cx, cy);
    ctx.restore();
  }

  if (!isPaused && !isRevealed) {
    switch (mode) {
      case 0:
        vx += (Math.random() - 0.5) * 0.3;
        vy += (Math.random() - 0.5) * 0.3;
        x += vx; y += vy;
        if (x + radius > canvas.width || x - radius < 0) { vx *= -1; bounceCount++; }
        if (y + radius > canvas.height || y - radius < 0) { vy *= -1; bounceCount++; }
        if (bounceCount >= 6) nextMode();
        break;
      case 1:
        x += vx; if (x - radius > canvas.width) nextMode(); break;
      case 2:
        y += vy; if (y - radius > canvas.height) nextMode(); break;
      case 3:
        alpha -= 0.01; if (alpha <= 0) { alpha = 0; nextMode(); } break;
      case 4:
        radius += 1; y = canvas.height / 2;
        x += (canvas.width / 2 - x) * 0.05;
        if (radius >= 300) nextMode(); break;
      case 5:
        radius -= 1; y = canvas.height / 2;
        x += (canvas.width / 2 - x) * 0.05;
        if (radius <= 30) nextMode(); break;
    }
  }

  requestAnimationFrame(draw);
}
