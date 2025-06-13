<canvas id="maskCanvas"></canvas>
<img id="bgImage" src="your-image.jpg" style="display:none;">
<script>
const canvas = document.getElementById('maskCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let x = 150;
let y = 150;
let vx = 2;
let vy = 1.5;
let radius = 100;
let targetRadius = 100;
let mode = 0;
let bounceCount = 0;
let alpha = 1;

function nextMode() {
  mode = Math.floor(Math.random() * 6); // 0～5の6モードをランダムに
  bounceCount = 0;
  alpha = 1;

  switch (mode) {
    case 0:
      // ランダムふらふら
      x = 150;
      y = 150;
      vx = 2;
      vy = 1.5;
      radius = 100;
      targetRadius = 100;
      break;

    case 1:
      // 横一直線
      y = Math.random() * canvas.height;
      x = 0;
      vx = 3;
      vy = 0;
      radius = 100;
      targetRadius = radius * (1.5 + Math.random() * 0.5); // 1.5〜2.0倍
      break;

    case 2:
      // 縦一直線
      x = Math.random() * canvas.width;
      y = 0;
      vx = 0;
      vy = 3;
      radius = 100;
      targetRadius = radius * (1.5 + Math.random() * 0.5);
      break;

    case 3:
      // フェードアウト
      vx = 0;
      vy = 0;
      radius = 100;
      targetRadius = radius * (1.5 + Math.random() * 0.5);
      break;

    case 4:
      // 拡大
      radius = 50;
      targetRadius = 300;
      break;

    case 5:
      // 縮小
      radius = 300;
      targetRadius = 30;
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

    case 1: // 横移動しながら拡大
      x += vx;
      radius += (targetRadius - radius) * 0.02;
      if (x - radius > canvas.width) nextMode();
      break;

    case 2: // 縦移動しながら拡大
      y += vy;
      radius += (targetRadius - radius) * 0.02;
      if (y - radius > canvas.height) nextMode();
      break;

    case 3: // フェードアウト＋拡大
      alpha -= 0.01;
      radius += (targetRadius - radius) * 0.02;
      if (alpha <= 0) {
        alpha = 0;
        nextMode();
      }
      break;

    case 4: // 拡大
      y = canvas.height / 2;
      x += (canvas.width / 2 - x) * 0.05;
      radius += 1;
      if (radius >= targetRadius) nextMode();
      break;

    case 5: // 縮小
      y = canvas.height / 2;
      x += (canvas.width / 2 - x) * 0.05;
      radius -= 1;
      if (radius <= targetRadius) nextMode();
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
</script>
