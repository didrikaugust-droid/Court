let user = localStorage.getItem("user");
let viewing = null;

let posts = JSON.parse(localStorage.getItem("posts") || "[]");
let likes = JSON.parse(localStorage.getItem("likes") || "{}");
let follows = JSON.parse(localStorage.getItem("follows") || "{}");
let notifications = JSON.parse(localStorage.getItem("notif") || "[]");

/* NAV */
function show(view){
  feedView.style.display="none";
  profileView.style.display="none";
  leaderboardView.style.display="none";

  if(view==="feed") renderFeed(), feedView.style.display="block";
  if(view==="profile") renderProfile(viewing||user), profileView.style.display="block";
  if(view==="leaderboard") renderBoard(), leaderboardView.style.display="block";
}

/* POST */
function post(){
  posts.unshift({
    id:Date.now(),
    user,
    opponent:opponent.value,
    score:score.value
  });

  save();
  notify("New match posted by " + user);
  renderFeed();
}

/* FEED */
function renderFeed(){
  document.getElementById("welcome").innerText="Welcome, "+user;

  feed.innerHTML = posts.map(p=>`
    <div class="card fade">
      <div class="user" onclick="openProfile('${p.user}')">${p.user}</div>
      <div class="small">vs ${p.opponent}</div>
      <h2>${p.score}</h2>

      <div class="heart" onclick="like(${p.id})">
        ❤️ ${likes[p.id]||0}
      </div>

      <div class="map"></div>
    </div>
  `).join("");
}

/* LIKE */
function like(id){
  likes[id]=(likes[id]||0)+1;
  save();
  renderFeed();
}

/* PROFILE */
function openProfile(u){
  viewing=u;
  show("profile");
}

/* FOLLOW */
function toggleFollow(){
  if(!follows[user]) follows[user]=[];

  if(follows[user].includes(viewing)){
    follows[user]=follows[user].filter(x=>x!==viewing);
  } else {
    follows[user].push(viewing);
    notify(user+" followed "+viewing);
  }

  save();
  renderProfile(viewing);
}

/* PROFILE RENDER */
function renderProfile(u){
  profileName.innerText=u;

  let userPosts=posts.filter(p=>p.user===u);

  let followers=Object.keys(follows).filter(k=>follows[k].includes(u)).length;

  stats.innerText=`Matches: ${userPosts.length} | Followers: ${followers}`;

  profileFeed.innerHTML=userPosts.map(p=>`
    <div class="card">
      <div class="small">vs ${p.opponent}</div>
      <h2>${p.score}</h2>
    </div>
  `).join("");
}

/* LEADERBOARD */
function renderBoard(){
  let scores={};

  posts.forEach(p=>{
    scores[p.user]=(scores[p.user]||0)+1;
  });

  board.innerHTML=Object.entries(scores)
  .sort((a,b)=>b[1]-a[1])
  .map(([u,s])=>`
    <div class="card">
      <b>${u}</b>
      <p>${s} matches</p>
    </div>
  `).join("");
}

/* NOTIFICATIONS */
function notify(text){
  notifications.unshift(text);
  localStorage.setItem("notif",JSON.stringify(notifications));
}

/* SAVE */
function save(){
  localStorage.setItem("posts",JSON.stringify(posts));
  localStorage.setItem("likes",JSON.stringify(likes));
  localStorage.setItem("follows",JSON.stringify(follows));
}

/* INIT */
if(user){
  show("feed");
}
