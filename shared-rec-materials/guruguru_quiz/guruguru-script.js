const canvas = document.getElementById('maskCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const bgImage = document.getElementById('bgImage');
const imagePaths = [];
let availableImages = [];
let usedImages = [];
let currentImageIndex = 0;

let effectProgress = 0;
let currentEffect = 'sliceRotate'; // 初期値
let x = 150, y = 150, vx = 2, vy = 1.5, radius = 100;
let mode = 0, bounceCount = 0, alpha = 1;
let modeQueue = [];
let isPaused = false;
let isRevealed = false;
let nextImageReady = false;

function preloadImages(callback) {
  let index = 0;

  function tryLoadNext() {
    const img = new Image();
    const path = `img/img${index}.png`;
    img.src = path;
    img.onload = () => {
      imagePaths.push(path);
      index++;
      tryLoadNext();
    };
    img.onerror = () => {
      console.log(`📦 全${imagePaths.length}問の画像を検出しました`);
      availableImages = [...imagePaths];
      shuffleArray(availableImages);
      callback();
    };
  }

  tryLoadNext();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function loadNextImage() {
  if (availableImages.length === 0) {
    console.log("✅ すべての画像を出題し終えました！");
    const endOverlay = document.getElementById('endOverlay');
    if (endOverlay) {
      endOverlay.style.display = 'flex';
    } else {
      alert("すべての画像を出題し終えました！（endOverlayが見つかりません）");
    }
    return;
  }

 //  const effectList = ['sliceRotate', 'sliceShift', 'scaleCenter', 'swirl', 'wave'];
  // currentEffect = effectList[Math.floor(Math.random() * effectList.length)];
  effectProgress = 0;

  const nextImg = availableImages.pop();
  usedImages.push(nextImg);

  bgImage.onload = () => {
    effectProgress = 0;
    draw();
  };
  bgImage.src = nextImg;

  console.log("✅ 新しい画像とエフェクトを読み込みました");
}

canvas.addEventListener('click', () => {
  if (!isRevealed) {
    isPaused = !isPaused;
    console.log(isPaused ? '⏸ 停止中 (Click)' : '▶️ 再開 (Click)');
  } else if (nextImageReady) {
    nextImageReady = false;
    isRevealed = false;
    if (typeof showQuestionOverlay === 'function') showQuestionOverlay();
    loadNextImage();
    nextMode();
  }
});

canvas.addEventListener('dblclick', () => {
  if (!isRevealed) {
    isRevealed = true;
    isPaused = false;
    console.log('✅ 正解！（ダブルクリック）背景をフル表示');
    nextImageReady = true;
  }
});

document.addEventListener('keydown', (e) => {
  if (!isRevealed) {
    if (e.key === 'Enter') {
      isPaused = !isPaused;
      console.log(isPaused ? '⏸ 停止中 (Enter)' : '▶️ 再開 (Enter)');
    }
    if (e.key === 'ArrowUp') {
      isRevealed = true;
      isPaused = false;
      console.log('✅ 正解！（ArrowUpキー）背景をフル表示');
      nextImageReady = true;
    }
  } else {
    if ((e.key === 'Enter' || e.key === 'ArrowUp') && nextImageReady) {
      nextImageReady = false;
      isRevealed = false;
      if (typeof showQuestionOverlay === 'function') showQuestionOverlay();
      loadNextImage();
      nextMode();
    }
  }
});

function nextMode() {
  bounceCount = 0;
  alpha = 1;
  isRevealed = false;

  if (modeQueue.length === 0) {
    modeQueue = [0, 1, 2, 3, 4, 5].sort(() => Math.random() - 0.5);
  }

  mode = modeQueue.pop();
  switch (mode) {
    case 0: x = 150; y = 150; vx = 2; vy = 1.5; radius = 200; break;
    case 1: y = Math.random() * canvas.height; x = 0; vx = 3; vy = 0; radius = 200; break;
    case 2: x = Math.random() * canvas.width; y = 0; vx = 0; vy = 3; radius = 200; break;
    case 3: vx = 0; vy = 0; radius = 200; break;
    case 4: radius = 50; x = Math.random() * canvas.width; y = canvas.height / 2; break;
    case 5: radius = 300; x = Math.random() * canvas.width; y = canvas.height / 2; break;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
 

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
  effectProgress += 0.01;
  if (effectProgress > 1) effectProgress = 1;

  if (!isPaused && !isRevealed) {
  switch (currentEffect) {
    case 'sliceRotate':  drawSliceRotate(); break;
    case 'sliceShift':   drawSliceShift(); break;
    case 'scaleCenter':  drawScaleDistort(); break;
    case 'swirl':        drawSwirlEffect(); break;
    case 'wave':         drawWaveEffect(); break;
  }
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

// 初期処理
preloadImages(() => {
  loadNextImage(); // 最初の画像を表示
});
