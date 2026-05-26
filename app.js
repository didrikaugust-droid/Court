let user = JSON.parse(localStorage.getItem("user"));
let posts = JSON.parse(localStorage.getItem("posts")) || [];

function save() {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("posts", JSON.stringify(posts));
}

render();

function render() {
  if (!user) return login();
  return feed();
}

/* ---------- LOGIN ---------- */
function login() {
  document.getElementById("app").innerHTML = `
    <div class="card">
      <div class="top">Court 🎾</div>
      <div style="color:#64748b;font-size:13px">
        Tennis performance tracker
      </div>

      <input id="name" placeholder="username"/>
      <button onclick="doLogin()">Continue</button>
    </div>
  `;
}

function doLogin() {
  const name = document.getElementById("name").value;
  if (!name) return;

  user = {
    name,
    streak: 1
  };

  save();
  render();
}

/* ---------- FEED ---------- */
function feed() {
  document.getElementById("app").innerHTML = `
    <div class="card">
      <div class="top">Hello, ${user.name}</div>

      <input id="text" placeholder="Log match result (6-3 4-6 6-2)"/>
      <button onclick="post()">Log match</button>
    </div>

    <div class="card">
      <div class="grid">
        <div class="stat">
          <h2>${posts.length}</h2>
          <p>Matches</p>
        </div>
        <div class="stat">
          <h2>${user.streak}</h2>
          <p>Streak</p>
        </div>
        <div class="stat">
          <h2>${wins()}</h2>
          <p>Wins</p>
        </div>
      </div>
    </div>

    ${renderPosts()}
  `;
}

function post() {
  const text = document.getElementById("text").value;
  if (!text) return;

  const win = text.toLowerCase().includes("won");

  posts.unshift({
    text,
    win,
    time: new Date().toLocaleString()
  });

  if (win) user.streak++;

  save();
  render();
}

function wins() {
  return posts.filter(p => p.win).length;
}

function renderPosts() {
  return posts.map(p => `
    <div class="card">
      <div class="post-title">
        ${p.win ? "🔥 WIN" : "🎾 MATCH"} — ${p.text}
      </div>

      <div class="post-meta">${p.time}</div>

      ${p.win ? `<div class="badge">Performance +1</div>` : ""}
    </div>
  `).join("");
}
