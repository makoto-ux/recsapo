window.addEventListener("DOMContentLoaded", () => {
  const loggedIn = localStorage.getItem("loggedIn");
  const loginTime = parseInt(localStorage.getItem("loginTime"), 10);
  const now = new Date().getTime();

  // 有効期限（3時間 = 3 × 60分 × 60秒 × 1000ミリ秒）
  const EXPIRATION_TIME = 3 * 60 * 60 * 1000;

  if (
    loggedIn !== "true" ||
    !loginTime ||
    now - loginTime > EXPIRATION_TIME
  ) {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("loginTime");
    alert("ログインの有効期限が切れました。再度ログインしてください。");
    window.location.href = "truinbi.html";
  }
});
