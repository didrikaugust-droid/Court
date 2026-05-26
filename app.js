// ===== STORAGE =====
let user = JSON.parse(localStorage.getItem("user"));
let posts = JSON.parse(localStorage.getItem("posts")) || [];

// ===== SAVE =====
function save() {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("posts", JSON.stringify(posts));
}

// ===== INIT =====
render();

// ===== LOGIN =====
function loginPage() {
  document.getElementById("app").innerHTML = `
    <div class="card">
      <h1>COURT 🎾</h1>
      <p>Sign in to join the tennis network</p>

      <input id="name" placeholder="username"/>
      <button onclick="login()">Continue</button>
    </div>
  `;
}

function login() {
  const name = document.getElementById("name").value;
  if (!name) return;

  user = {
    name,
    avatar: "",
    streak: 1
  };

  save();
  render();
}

// ===== FEED =====
function feedPage() {
  document.getElementById("app").innerHTML = `
    <div class="card">
      <h2>🔥 Court Feed</h2>

      <input id="postText" placeholder="Log match (6-3 4-6 6-2)"/>
      <button onclick="addPost()">Post Match</button>

      <div style="margin-top:10px">
        <button onclick="goProfile()">Profile</button>
        <button onclick="leaderboard()">Leaderboard 🏆</button>
        <button onclick="logout()">Logout</button>
      </div>
    </div>

    <div id="feed"></div>
  `;

  renderPosts();
}

// ===== ADD POST =====
function addPost() {
  const text = document.getElementById("postText").value;
  if (!text) return;

  const win = text.toLowerCase().includes("won");

  posts.unshift({
    id: Date.now(),
    user: user.name,
    text,
    win,
    likes: 0,
    comments: [],
    time: new Date().toLocaleString()
  });

  // streak system
  if (win) user.streak++;

  save();
  render();
}

// ===== LIKE =====
function likePost(id) {
  posts = posts.map(p => {
    if (p.id === id) p.likes++;
    return p;
  });

  save();
  render();
}

// ===== COMMENT =====
function commentPost(id) {
  const msg = prompt("Comment:");
  if (!msg) return;

  posts = posts.map(p => {
    if (p.id === id) {
      p.comments.push(msg);
    }
    return p;
  });

  save();
  render();
}

// ===== POSTS =====
function renderPosts() {
  const feed = document.getElementById("feed");
  if (!feed) return;

  feed.innerHTML = "";

  posts.forEach(p => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <b>${p.user}</b> ${p.win ? "🔥 WIN" : "🎾 MATCH"}<br/><br/>
      ${p.text}<br/>
      <small>${p.time}</small>

      <div style="margin-top:10px">
        ❤️ ${p.likes}
        💬 ${p.comments.length}
      </div>

      <button onclick="likePost(${p.id})">Like</button>
      <button onclick="commentPost(${p.id})">Comment</button>
    `;

    feed.appendChild(div);
  });
}

// ===== PROFILE =====
function goProfile() {
  const myPosts = posts.filter(p => p.user === user.name);

  document.getElementById("app").innerHTML = `
    <div class="card">
      <h2>${user.name} 👤</h2>
      <p>🔥 Streak: ${user.streak}</p>

      <button onclick="render()">Back</button>
    </div>

    ${myPosts.map(p => `
      <div class="card">
        ${p.win ? "🔥 WIN" : "🎾"} ${p.text}
      </div>
    `).join("")}
  `;
}

// ===== LEADERBOARD =====
function leaderboard() {
  let users = {};

  posts.forEach(p => {
    if (!users[p.user]) users[p.user] = 0;
    if (p.win) users[p.user]++;
  });

  const sorted = Object.entries(users)
    .sort((a,b) => b[1]-a[1]);

  document.getElementById("app").innerHTML = `
    <div class="card">
      <h2>🏆 Leaderboard</h2>
      <button onclick="render()">Back</button>
    </div>

    ${sorted.map(u => `
      <div class="card">
        ${u[0]} — ${u[1]} wins
      </div>
    `).join("")}
  `;
}

// ===== LOGOUT =====
function logout() {
  user = null;
  save();
  render();
}

// ===== POSTS RENDER =====
function render() {
  if (!user) return loginPage();
  return feedPage();
}
