const canvas = document.getElementById('maskCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let x = 150;
let y = 150;
let vx = 2;
let vy = 1.5;
let radius = 100;
let mode = 0;
let bounceCount = 0;
let alpha = 1;
let modeQueue = [];
let isPaused = false;

canvas.addEventListener('click', () => {
  isPaused = !isPaused;
  console.log(isPaused ? '⏸ 停止中' : '▶️ 再開');
  if (!isPaused) {
    draw(); // 再開時のみ再実行
  }
});

function nextMode() {
  bounceCount = 0;
  alpha = 1;

  if (modeQueue.length === 0) {
    modeQueue = [0, 1, 2, 3, 4, 5].sort(() => Math.random() - 0.5);
  }

  mode = modeQueue.pop();
  console.log('mode:', mode, 'bounceCount:', bounceCount);

  switch (mode) {
    case 0:
      x = 150;
      y = 150;
      vx = 2;
      vy = 1.5;
      radius = 200;
      break;
    case 1:
      y = Math.random() * canvas.height;
      x = 0;
      vx = 3;
      vy = 0;
      radius = 200;
      break;
    case 2:
      x = Math.random() * canvas.width;
      y = 0;
      vx = 0;
      vy = 3;
      radius = 200;
      break;
    case 3:
      vx = 0;
      vy = 0;
      radius = 200;
      break;
    case 4:
      radius = 50;
      x = Math.random() * canvas.width;
      y = canvas.height / 2;
      break;
    case 5:
      radius = 300;
      x = Math.random() * canvas.width;
      y = canvas.height / 2;
      break;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  if (isPaused) {
    // 停止中表示（黒縁付き白文字）
    ctx.save();
    ctx.font = 'bold 160px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 8;
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'white';
    const text = '一時停止中';
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    ctx.strokeText(text, cx, cy);
    ctx.fillText(text, cx, cy);
    ctx.restore();
    return; // ここでアニメーション停止
  }

  switch (mode) {
    case 0:
      vx += (Math.random() - 0.5) * 0.3;
      vy += (Math.random() - 0.5) * 0.3;
      x += vx;
      y += vy;

      if (x + radius > canvas.width) {
        x = canvas.width - radius;
        vx *= -1;
        bounceCount++;
      }
      if (x - radius < 0) {
        x = radius;
        vx *= -1;
        bounceCount++;
      }
      if (y + radius > canvas.height) {
        y = canvas.height - radius;
        vy *= -1;
        bounceCount++;
      }
      if (y - radius < 0) {
        y = radius;
        vy *= -1;
        bounceCount++;
      }
      if (bounceCount >= 6) nextMode();
      break;

    case 1:
      x += vx;
      if (x - radius > canvas.width) nextMode();
      break;

    case 2:
      y += vy;
      if (y - radius > canvas.height) nextMode();
      break;

    case 3:
      alpha -= 0.01;
      if (alpha <= 0) {
        alpha = 0;
        nextMode();
      }
      break;

    case 4:
      radius += 1;
      y = canvas.height / 2;
      x += (canvas.width / 2 - x) * 0.05;
      if (radius >= 300) nextMode();
      break;

    case 5:
      radius -= 1;
      y = canvas.height / 2;
      x += (canvas.width / 2 - x) * 0.05;
      if (radius <= 30) nextMode();
      break;
  }

  requestAnimationFrame(draw);
}

const bgImage = document.getElementById('bgImage');
if (bgImage.complete) {
  draw();
} else {
  bgImage.onload = () => draw();
}
