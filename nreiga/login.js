async function sha256(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
              .map(b => b.toString(16).padStart(2, "0"))
              .join("");
}

async function loadUsers() {
  const res = await fetch("users.json");
  if (!res.ok) throw new Error("ユーザー情報の読み込みに失敗しました");
  return await res.json();
}

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("userid").value;
  const pw = document.getElementById("password").value;
  const idHash = await sha256(id);
  const pwHash = await sha256(pw);

  console.log("入力ID:", id);
  console.log("入力PW:", pw);
  console.log("ハッシュID:", idHash);
  console.log("ハッシュPW:", pwHash);

  try {
    const users = await loadUsers();
    console.log("読み込んだユーザー一覧:", users);
    users.forEach((user, index) => {
  console.log(`ユーザー${index + 1}のID:`, user.id);
  console.log(`ユーザー${index + 1}のパスワード:`, user.password);
});

    const matched = users.find(u => u.id === idHash && u.password === pwHash);
    console.log("マッチしたユーザー:", matched);

    if (matched) {
  await sendLoginLog({ userId: matched.id, username: matched.name || id, result: "成功" });
      
// ログイン成功時
const loginTime = new Date().getTime(); // 現在のタイムスタンプ（ミリ秒）
localStorage.setItem("loggedIn", "true");
localStorage.setItem("loginTime", loginTime.toString());

  window.location.href = "home.html";
} else {
  await sendLoginLog({ userId: "", username: id, result: "失敗" });
      localStorage.removeItem("loggedIn");
    localStorage.removeItem("loginTime");
  document.getElementById("error-msg").textContent = "IDまたはパスワードが間違っています";
}

  } catch (err) {
    document.getElementById("error-msg").textContent = "ログインエラー33：" + err.message;
    console.error("ログイン中の例外:", err);
  }
});


  async function sendLoginLog({ userId, username, result }) {
  try {
    // 外部APIでIPアドレスを取得
    const ipRes = await fetch("https://api.ipify.org?format=json");
    if (!ipRes.ok) {
      throw new Error(`IP取得失敗: ${ipRes.status}`);
    }
    const ipData = await ipRes.json();

    // ログ用データ作成
    const logData = {
      userId: userId || "",
      username: username || "",
      ip: ipData.ip,
      userAgent: navigator.userAgent,
      result: result || "成功",
    };

    // Google Apps Script のWebアプリURLへPOST
    const res = await fetch("https://script.google.com/macros/s/AKfycbwAz43-e4y9rva0UNuEVcMIAql3dvXJyo8mQ_X7ukdfLXPS3rmV0Wx2HwytNvMj0_zo/exec", {
      method: "POST",
      body: JSON.stringify(logData),
      headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error("ログ送信失敗: " + res.status + " " + text);
    }

  } catch (err) {
    console.error("ログ送信エラー:", err);
  }
}


