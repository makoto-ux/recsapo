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
      window.location.href = "home.html";
    } else {
      document.getElementById("error-msg").textContent = "IDまたはパスワードが間違っています。";
    }
  } catch (err) {
    document.getElementById("error-msg").textContent = "ログインエラー33：" + err.message;
    console.error("ログイン中の例外:", err);
  }
});
