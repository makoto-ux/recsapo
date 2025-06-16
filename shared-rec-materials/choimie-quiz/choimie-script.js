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

function nextMode() {
  if (modeQueue.length === 0) {
    modeQueue = [0, 1, 2, 3, 4, 5].sort(() => Math.random() - 0.5);
  }

  mode = modeQueue.pop(); // または shift()
  bounceCount = 0;
  alpha = 1;

  console.log("選ばれたモード:", mode);
  
  switch (mode) {
    case 0: // ランダムふらふら
      x = 150;
      y = 150;
      vx = 2;
      vy = 1.5;
      radius = 200;
      break;
    case 1: // 横一直線
      y = Math.random() * canvas.height;
      x = 0;
      vx = 3;
      vy = 0;
      radius = 200;
      break;
    case 2: // 縦一直線
      x = Math.random() * canvas.width;
      y = 0;
      vx = 0;
      vy = 3;
      radius = 200;
      break;
    case 3: // フェードアウト
      vx = 0;
      vy = 0;
      radius = 200;
      break;
    case 4: // 拡大準備
      radius = 50;
      x = Math.random() * canvas.width;
      y = canvas.height / 2;
      break;
    case 5: // 縮小準備
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

  switch (mode) {
    case 0: // ランダム移動
      vx += (Math.random() - 0.5) * 0.3;
      vy += (Math.random() - 0.5) * 0.3;
      x += vx;
      y += vy;
      if (x + radius > canvas.width || x - radius < 0) {
        vx *= -1;
        bounceCount++;
      }
      if (y + radius > canvas.height || y - radius < 0) {
        vy *= -1;
        bounceCount++;
      }
      if (bounceCount >= 6) nextMode();
      break;

    case 1: // 横移動
      x += vx;
      if (x - radius > canvas.width) nextMode();
      break;

    case 2: // 縦移動
      y += vy;
      if (y - radius > canvas.height) nextMode();
      break;

    case 3: // フェードアウト
      alpha -= 0.01;
      if (alpha <= 0) {
        alpha = 0;
        nextMode();
      }
      break;

    case 4: // 拡大
      radius += 1;
      y = canvas.height / 2;
      x += (canvas.width / 2 - x) * 0.05;
      if (radius >= 300) nextMode();
      break;

    case 5: // 縮小
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
