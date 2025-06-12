const canvas = document.getElementById('maskCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let x = 100;
let y = 100;
let vx = 1.2;
let vy = 0.8;
const radius = 100;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 穴部分だけ透明にくり抜く
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // のぞき穴の移動
  x += vx;
  y += vy;

  if (x + radius > canvas.width || x - radius < 0) vx *= -1;
  if (y + radius > canvas.height || y - radius < 0) vy *= -1;

  requestAnimationFrame(draw);
}

const bgImage = document.getElementById('bgImage');
if (bgImage.complete) {
  draw();
} else {
  bgImage.onload = () => {
    draw();
  };
}
