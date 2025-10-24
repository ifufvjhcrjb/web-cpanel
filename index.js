const backend = "http://157.245.145.229:2004";
const panelURL = "https://panelix.resellergaming-official.my.id";
const loginData = JSON.parse(localStorage.getItem("login"));

/* Menu */
const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");
menuBtn.addEventListener("click", () => {
  menu.style.display = menu.style.display === "flex" ? "none" : "flex";
});

/* Tombol menu */
document.getElementById("btnProfile").addEventListener("click", showProfile);
document.getElementById("btnDashboard").addEventListener("click", showDashboard);
document.getElementById("backToDashboard").addEventListener("click", showDashboard);

function showProfile() {
  document.getElementById("cardContent").classList.add("hidden");
  document.getElementById("profileCard").classList.remove("hidden");
  menu.style.display = "none";
  loadProfile();
}
function showDashboard() {
  document.getElementById("cardContent").classList.remove("hidden");
  document.getElementById("profileCard").classList.add("hidden");
  menu.style.display = "none";
}

/* Load profil user */
async function loadProfile() {
  const profileDiv = document.getElementById("profileData");
  if (!loginData || !loginData.user) {
    profileDiv.innerHTML = "⚠️ Tidak ada data login.";
    return;
  }

  const user = loginData.user;
  const exp = user.expiresAt
    ? new Date(user.expiresAt).toLocaleString()
    : "Tidak diketahui";

  profileDiv.innerHTML = `
    <div>👤 <b>Username:</b> ${user.username}</div>
    <div>📧 <b>Email:</b> ${user.email}</div>
    <div>🔐 <b>Password:</b> <span id="passwordText">•••••••</span> 
      <span class="toggle-pass" id="togglePass">👁️</span></div>
    <div>🆔 <b>ID:</b> ${user.id || "-"}</div>
    <div>⏰ <b>Expired:</b> ${exp}</div>
  `;

  // 👁️ toggle password
  const togglePass = document.getElementById("togglePass");
  const passText = document.getElementById("passwordText");
  let show = false;
  togglePass.addEventListener("click", () => {
    show = !show;
    passText.textContent = show ? user.password : "•••••••";
    togglePass.textContent = show ? "🙈" : "👁️";
  });
}

/* Cek akun valid */
async function checkAccount() {
  if (!loginData || !loginData.user?.email) {
    alert("⚠️ Harap login terlebih dahulu!");
    location.href = "login.html";
    return;
  }

  try {
    const res = await fetch(`${backend}/api/checkUser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginData.user.email }),
    });
    const data = await res.json();
    if (!data.valid) {
      alert("🚫 Akun kamu sudah dihapus dari sistem, silakan login ulang!");
      localStorage.removeItem("login");
      location.href = "login.html";
    }
  } catch (err) {
    console.error("⚠️ Gagal memeriksa status akun:", err);
  }
}
setInterval(checkAccount, 30000);
checkAccount();

/* Tombol salin dan pembuatan server */
function salin(teks) {
  navigator.clipboard.writeText(teks);
  alert(`📋 Disalin: ${teks}`);
}

// (lanjutan fungsi form create server tetap sama seperti file kamu)
document.getElementById("form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value.trim();
        const kapasitas = document.getElementById("kapasitas").value;
        const result = document.getElementById("result");

        if (!username || !kapasitas) {
          result.innerHTML = "⚠️ Harap isi semua data.";
          return;
        }

        // Email & password otomatis
        const email = `${username}@gmail.com`;
        const password = `${username}123`;

        result.innerHTML = "⏳ Membuat user...";

        try {
          // 1️⃣ Buat user baru
          const userRes = await fetch(`${backend}/api/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
          });
          const userData = await userRes.json();
          if (!userRes.ok) throw userData;

          const userId =
            userData?.attributes?.id ||
            userData?.data?.id ||
            userData?.id ||
            userData?.data?.attributes?.id;
          if (!userId) throw { error: "Gagal mendapatkan ID user." };

          console.log("✅ User berhasil dibuat:", userData);

          result.innerHTML = "✅ User berhasil dibuat. Membuat server...";

          // 2️⃣ Buat server otomatis
          const serverRes = await fetch(`${backend}/api/servers`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user: userId,
              name: `Server-${username}`,
              kapasitas,
            }),
          });

          const serverData = await serverRes.json();
          if (!serverRes.ok) throw serverData;

          const serverId =
            serverData?.server?.attributes?.id ||
            serverData?.server?.id ||
            serverData?.id ||
            serverData?.server?.data?.attributes?.id;

          console.log("✅ Server berhasil dibuat:", serverData);

          // 🎉 Hasil
          result.innerHTML = `
            <div class="success">
              <b>✅ Server berhasil dibuat!</b><br><br>
              <div class="row">
                <span>👤 <b>Username:</b> ${username}</span>
                <button class="copy-btn" onclick="salin('${username}')">📋</button>
              </div>
              <div class="row">
                <span>📧 <b>Email:</b> ${email}</span>
                <button class="copy-btn" onclick="salin('${email}')">📋</button>
              </div>
              <div class="row">
                <span>🔐 <b>Password:</b> ${password}</span>
                <button class="copy-btn" onclick="salin('${password}')">📋</button>
              </div>
              <div class="row">
                <span>🆔 <b>User ID:</b> ${userId}</span>
                <button class="copy-btn" onclick="salin('${userId}')">📋</button>
              </div>
              <div class="row">
                <span>💾 <b>Kapasitas:</b> ${kapasitas === "unlimited" ? "Unlimited 🚀" : kapasitas + " GB"}</span>
                <button class="copy-btn" onclick="salin('${kapasitas}')">📋</button>
              </div>
              <div class="row">
                <span>🖥️ <b>Server ID:</b> ${serverId}</span>
                <button class="copy-btn" onclick="salin('${serverId}')">📋</button>
              </div>
              <a href="${panelURL}" class="login-btn" target="_blank">🔗 Login ke Panel</a>
            </div>
          `;
        } catch (err) {
          console.error("❌ Error:", err);
          result.innerHTML = `
            <div class="error">
              ❌ Gagal membuat server:<br>${JSON.stringify(err, null, 2)}
            </div>
          `;
        }
      });