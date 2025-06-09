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

  try {
    const users = await loadUsers();
    const matched = users.find(u => u.id === idHash && u.password === pwHash);

    if (matched) {
      window.location.href = "home.html";
    } else {
      document.getElementById("error-msg").textContent = "IDまたはパスワードが間違っています。";

    }
  } catch (err) {
  document.getElementById("error-msg").textContent = "ログインエラー33：" + err.message;
}
});
