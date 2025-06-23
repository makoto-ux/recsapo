// ✅ gameControl.js（クイズ進行ロジックのみ）

const canvas = document.getElementById('maskCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const bgImage = document.getElementById('bgImage');
const imagePaths = [];
let availableImages = [];
let usedImages = [];
let currentImageIndex = 0;

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
  console.log(`loadNextImage called - availableImages.length=${availableImages.length}`);
  if (availableImages.length === 0) {
    console.log("✅ すべての画像を出題し終えました！");
    const endOverlay = document.getElementById('endOverlay');
    if (endOverlay) {
      console.log("✅ テスト");
      endOverlay.style.display = 'flex';
    } else {
      alert("すべての画像を出題し終えました！（endOverlayが見つかりません）");
    }
    return;
  }

  const nextImg = availableImages.pop();
  usedImages.push(nextImg);
  bgImage.src = nextImg;
  console.log("✅ テスト3");
}

let isPaused = false;
let isRevealed = false;
let nextImageReady = false;

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

// 初期処理
preloadImages(() => {
  loadNextImage();
  draw();
});
