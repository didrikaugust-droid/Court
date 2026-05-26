let user = JSON.parse(localStorage.getItem("user"));
let posts = JSON.parse(localStorage.getItem("posts")) || [];
let page = "feed";

function save() {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("posts", JSON.stringify(posts));
}

render();

function render() {
  const app = document.getElementById("app");

  if (!user) return login();

  if (page === "feed") return feed();
  if (page === "profile") return profile();
}

/* ---------- LOGIN ---------- */
function login() {
  document.getElementById("app").innerHTML = `
    <div class="card">
      <div class="top">COURT 🎾</div>
      <p style="color:#64748b">Mobile tennis tracker</p>

      <input id="name" placeholder="username"/>
      <button onclick="doLogin()">Continue</button>
    </div>
  `;
}

function doLogin() {
  const name = document.getElementById("name").value;
  if (!name) return;

  user = { name, streak: 1 };
  save();
  render();
}

/* ---------- FEED ---------- */
function feed() {
  document.getElementById("app").innerHTML = `
    <div class="card">
      <div class="top">Hi, ${user.name} 🎾</div>

      <input id="text" placeholder="Log match result"/>
      <button onclick="post()">Post match</button>
    </div>

    ${stats()}

    ${posts.map(p => `
      <div class="card">
        <b>${p.win ? "🔥 WIN" : "🎾 MATCH"}</b><br/>
        ${p.text}<br/>
        <small>${p.time}</small>
      </div>
    `).join("")}

    ${nav()}
  `;
}

/* ---------- PROFILE ---------- */
function profile() {
  const mine = posts.filter(p => p.win);

  document.getElementById("app").innerHTML = `
    <div class="card">
      <div class="top">${user.name}</div>
      <p>🔥 Streak: ${user.streak}</p>
    </div>

    <div class="card">
      <b>Your wins</b>
    </div>

    ${mine.map(p => `
      <div class="card">${p.text}</div>
    `).join("")}

    ${nav()}
  `;
}

/* ---------- POST ---------- */
function post() {
  const text = document.getElementById("text").value;
  if (!text) return;

  posts.unshift({
    text,
    win: text.toLowerCase().includes("won"),
    time: new Date().toLocaleString()
  });

  if (text.toLowerCase().includes("won")) user.streak++;

  save();
  render();
}

/* ---------- STATS ---------- */
function stats() {
  return `
    <div class="card">
      <div class="grid">
        <div class="stat"><b>${posts.length}</b><br/>Matches</div>
        <div class="stat"><b>${user.streak}</b><br/>Streak</div>
        <div class="stat"><b>${posts.filter(p=>p.win).length}</b><br/>Wins</div>
      </div>
    </div>
  `;
}

/* ---------- NAV ---------- */
function nav() {
  return `
    <div class="nav">
      <button onclick="setPage('feed')" class="${page==='feed'?'active':''}">Feed</button>
      <button onclick="setPage('profile')" class="${page==='profile'?'active':''}">Profile</button>
    </div>
  `;
}

function setPage(p) {
  page = p;
  render();
}
