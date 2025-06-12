const canvas = document.getElementById('maskCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let x = 150;
let y = 150;
let vx = 1.5;
let vy = 1.2;
const radius = 100;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 黒で塗る
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // のぞき穴を切り抜く
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.restore();

  // 移動
  x += vx;
  y += vy;

  if (x + radius > canvas.width || x - radius < 0) vx *= -1;
  if (y + radius > canvas.height || y - radius < 0) vy *= -1;

  requestAnimationFrame(draw);
}

// 画像が読み込まれてから開始
const bgImage = document.getElementById('bgImage');
if (bgImage.complete) {
  draw();
} else {
  bgImage.onload = () => draw();
}
