let user = localStorage.getItem("user");

let posts = JSON.parse(localStorage.getItem("posts") || "[]");
let likes = JSON.parse(localStorage.getItem("likes") || "{}");

if (!user) {
  window.location.href = "index.html";
}

/* HERO */
function renderHero() {
  const hero = document.getElementById("hero");

  hero.innerHTML = `
    <div class="heroCard">
      <h2 style="margin:0;">Welcome back, ${user}</h2>
      <p style="opacity:0.9;">Track performance. Dominate matches.</p>

      <div class="heroStats">
        <div><b>${posts.filter(p => p.user === user).length}</b><br>Matches</div>
        <div><b>${Object.values(likes).reduce((a,b)=>a+b,0)}</b><br>Kudos</div>
        <div><b>${new Set(posts.map(p => p.user)).size}</b><br>Athletes</div>
      </div>
    </div>
  `;
}

/* POST MATCH */
function post() {
  const opponent = document.getElementById("opponent").value;
  const score = document.getElementById("score").value;

  if (!opponent || !score) return;

  posts.unshift({
    id: Date.now(),
    user,
    opponent,
    score
  });

  save();
  render();
}

/* FEED */
function renderFeed() {
  const feed = document.getElementById("feed");

  feed.innerHTML = posts.map(p => `
    <div class="card fade">
      <div class="user">${p.user}</div>
      <div class="small">vs ${p.opponent}</div>
      <h2>${p.score}</h2>

      <div class="heart" onclick="like(${p.id})">
        ❤️ ${likes[p.id] || 0} kudos
      </div>

      <div class="map"></div>
    </div>
  `).join("");
}

/* LIKE */
function like(id) {
  likes[id] = (likes[id] || 0) + 1;
  save();
  renderFeed();
}

/* SAVE */
function save() {
  localStorage.setItem("posts", JSON.stringify(posts));
  localStorage.setItem("likes", JSON.stringify(likes));
}

/* MAIN RENDER */
function render() {
  if (document.getElementById("hero")) renderHero();
  renderFeed();
}

/* INIT */
render();
