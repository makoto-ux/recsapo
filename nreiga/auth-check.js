<script>
  window.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("loggedIn") !== "true") {
      alert("ログインしてください");
      window.location.href = "login.html";
    }
  });
</script>
