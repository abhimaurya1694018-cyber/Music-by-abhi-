const $=s=>document.querySelector(s);

const playlists=[
 {name:"90s Hindi Hits 1",sub:"90s Hindi songs • Playlist 1",img:"images/bg-1.jpg",id:"PLMRKdK25AuPVjHl9Kdb-gkBy0Cm7Zi2xo",url:"https://youtube.com/playlist?list=PLMRKdK25AuPVjHl9Kdb-gkBy0Cm7Zi2xo"},
 {name:"90s Hindi Hits 2",sub:"90s Hindi songs • Playlist 2",img:"images/bg-2.jpg",id:"PLAFjPVdERAkt7jNU1XW7EWXHLyYyf7Sux",url:"https://youtube.com/playlist?list=PLAFjPVdERAkt7jNU1XW7EWXHLyYyf7Sux"},
 {name:"Vevo Playlist 1",sub:"VEVO music selection",img:"images/bg-3.jpg",id:"PLDIoUOhQQPlWt8OpaGG43OjNYuJ2q9jEN",url:"https://youtube.com/playlist?list=PLDIoUOhQQPlWt8OpaGG43OjNYuJ2q9jEN"},
 {name:"Vevo Playlist 2",sub:"More VEVO favourites",img:"images/bg-4.jpg",id:"PLesm76O8GFZMRacpw0JaW8oBq7gzlyS7L",url:"https://youtube.com/playlist?list=PLesm76O8GFZMRacpw0JaW8oBq7gzlyS7L"},
 {name:"Bhojpuri Playlist 1",sub:"Bhojpuri YouTube Mix",img:"images/bg-5.jpg",id:null,url:"https://youtube.com/playlist?list=RDcQM55aOrZCg&playnext=1"},
 {name:"Bhojpuri Playlist 2",sub:"Bhojpuri YouTube Mix",img:"images/bg-1.jpg",id:null,url:"https://youtube.com/playlist?list=RDzmwfd8x0DrM&playnext=1"},
 {name:"Bhojpuri Playlist 3",sub:"Bhojpuri YouTube Mix",img:"images/bg-2.jpg",id:null,url:"https://youtube.com/playlist?list=RDNHps0T2q0bI&playnext=1"},
 {name:"Bhojpuri Playlist 4",sub:"Bhojpuri YouTube Mix",img:"images/bg-3.jpg",id:null,url:"https://youtube.com/playlist?list=RDSwFjNdgISyM&playnext=1"}
];

let current=0, player=null, shuffle=false, repeat=false, userHasStartedPlayback=false;

function setBackground(path){document.querySelector("#background").style.backgroundImage=`url("${path}")`}

function render(){
 const p=playlists[current];
 setBackground(p.img);
 document.querySelector("#featured").style.backgroundImage=`url("${p.img}")`;
 document.querySelector("#featured").innerHTML=`<div class="feature-copy"><div class="eyebrow">FEATURED PLAYLIST</div><h2>${p.name}</h2><p>${p.sub}</p><button class="listen">Listen now ▶</button></div>`;
 document.querySelector(".listen").onclick=()=>selectPlaylist(current,true);

 document.querySelector("#playlistGrid").innerHTML=playlists.map((p,i)=>`
 <button class="playlist-card" data-i="${i}" style="background-image:url('${p.img}')">
  <div><strong>${p.name}</strong><span>${p.sub}</span></div>
 </button>`).join("");
 document.querySelectorAll(".playlist-card").forEach(b=>b.onclick=()=>selectPlaylist(Number(b.dataset.i),false));

 document.querySelector("#drawerList").innerHTML=playlists.map((p,i)=>`
 <button class="drawer-item" data-i="${i}"><strong>${p.name}</strong><span>${p.sub}</span></button>`).join("");
 document.querySelectorAll(".drawer-item").forEach(b=>b.onclick=()=>{selectPlaylist(Number(b.dataset.i),false);document.querySelector("#drawer").classList.remove("open")});
}

function selectPlaylist(index, shouldPlay=false){
 current=index;
 const p=playlists[index];
 setBackground(p.img);
 document.querySelector("#playerArt").src=p.img;
 document.querySelector("#playerTitle").textContent=p.name;
 document.querySelector("#playerPanel").classList.add("open");
 document.querySelector("#youtubeBtn").onclick=()=>window.open(p.url,"_blank","noopener");

 // IMPORTANT:
 // Selecting/swiping a playlist must NEVER start or switch playback by itself.
 // Only an explicit user Play/Listen action may load/play a YouTube playlist.
 if(!shouldPlay) {
   document.querySelector("#playerStatus").textContent =
     p.id ? "Selected — press Play to listen" : "Selected — open on YouTube to listen";
   return;
 }

 if(!player) return;

 if(p.id){
   document.querySelector("#playerStatus").textContent="Loading YouTube playlist…";
   player.loadPlaylist({listType:"playlist",list:p.id,index:0});
   setTimeout(()=>player.playVideo(),250);
 }else{
   document.querySelector("#playerStatus").textContent="This Mix opens on YouTube";
 }
}

function onYouTubeIframeAPIReady(){
 player=new YT.Player("youtubeHost",{
  width:"200",height:"200",
  playerVars:{autoplay:0,controls:0,playsinline:1,rel:0,iv_load_policy:3},
  events:{
   onReady:()=>{
   // Never autoplay on page load.
   try{ player.pauseVideo(); }catch(e){}
 },
   onStateChange:e=>{
    if(e.data===YT.PlayerState.PLAYING){
      document.querySelector("#playBtn").textContent="❚❚";
      document.querySelector("#playerStatus").textContent="Playing on YouTube";
    }else if(e.data===YT.PlayerState.PAUSED){
      document.querySelector("#playBtn").textContent="▶";
      document.querySelector("#playerStatus").textContent="Paused";
    }else if(e.data===YT.PlayerState.ENDED && repeat){
      player.playVideoAt(0);
    }
   },
   onAutoplayBlocked:()=>{
    document.querySelector("#playerStatus").textContent="Tap Play once to start playback";
   },
   onError:e=>{
    document.querySelector("#playerStatus").textContent="This video/playlist cannot be embedded";
   }
  }
 });
}

document.querySelector("#startListening").onclick=()=>{
 document.querySelector("#startScreen").style.display="none";
 selectPlaylist(current,true);
};

document.querySelector("#playBtn").onclick=()=>{
 const p=playlists[current];
 if(!player){
   if(!p.id) window.open(p.url,"_blank","noopener");
   return;
 }
 if(!p.id){
   window.open(p.url,"_blank","noopener");
   return;
 }
 const state=player.getPlayerState();
 if(state===YT.PlayerState.PLAYING){
   player.pauseVideo();
 }else if(state===YT.PlayerState.PAUSED || state===YT.PlayerState.CUED){
   player.playVideo();
 }else{
   // ONLY an explicit Play click can load a new playlist.
   player.loadPlaylist({listType:"playlist",list:p.id,index:0});
   setTimeout(()=>player.playVideo(),250);
 }
 userHasStartedPlayback=true;
};
document.querySelector("#nextBtn").onclick=()=>player&&player.nextVideo();
document.querySelector("#prevBtn").onclick=()=>player&&player.previousVideo();

document.querySelector("#shuffleBtn").onclick=()=>{
 shuffle=!shuffle;
 if(player) player.setShuffle(shuffle);
 document.querySelector("#shuffleBtn").style.opacity=shuffle?"1":".6";
};
document.querySelector("#repeatBtn").onclick=()=>{
 repeat=!repeat;
 if(player) player.setLoop(repeat);
 document.querySelector("#repeatBtn").style.opacity=repeat?"1":".6";
};

document.querySelector("#menuBtn").onclick=()=>document.querySelector("#drawer").classList.add("open");
document.querySelector("#closeDrawer").onclick=()=>document.querySelector("#drawer").classList.remove("open");
document.querySelector("#seeAll").onclick=()=>document.querySelector("#drawer").classList.add("open");
document.querySelector("#closePlayer").onclick=()=>document.querySelector("#playerPanel").classList.remove("open");
document.querySelector("#homeBtn").onclick=()=>window.scrollTo({top:0,behavior:"smooth"});

setInterval(()=>{
 if(player&&typeof player.getCurrentTime==="function"){
   const d=player.getDuration()||0,c=player.getCurrentTime()||0;
   document.querySelector("#trackProgress").style.width=d?`${c/d*100}%`:"0%";
 }
},500);

window.addEventListener("pointerdown",e=>{
 const r=document.createElement("div");r.className="ripple";
 r.style.left=e.clientX+"px";r.style.top=e.clientY+"px";
 document.querySelector("#touchFx").appendChild(r);setTimeout(()=>r.remove(),650);
},{passive:true});

let touchStartY=0;
window.addEventListener("touchstart",e=>touchStartY=e.touches[0].clientY,{passive:true});
window.addEventListener("touchend",e=>{
 const dy=e.changedTouches[0].clientY-touchStartY;
 if(Math.abs(dy)>100){
   current=dy<0 ? (current+1)%playlists.length : (current-1+playlists.length)%playlists.length;
   // Swipe = navigation only. Never load or play YouTube.
   selectPlaylist(current,false);
 }
},{passive:true});

render();
