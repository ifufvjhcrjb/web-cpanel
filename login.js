const backend = "/api";

document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("⚠️ Harap isi semua data!");
    return;
  }

  try {
    const res = await fetch(`${backend}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("login", JSON.stringify(data));
      alert("✅ Login berhasil!");
      location.href = "index.html"; // balik ke halaman utama
    } else {
      alert("❌ " + (data.error || "Email atau password salah"));
    }
  } catch (err) {
    alert("⚠️ Gagal menghubungkan ke server backend!");
    console.error(err);
  }
});
