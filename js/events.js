// ==============================
// EVENT DATA
// ==============================
let currentLocation = "";

const events = [
{
title: "AI Workshop",
start: "10:00",
end: "11:00",
loc: "AI Campus",
desc: "Hands-on workshop on AI and machine learning.",
detail: "Exploring transformer architectures and local LLM deployment."
},

{
title: "Drama Performance",
start: "11:15",
end: "13:00",
loc: "DT Playhouse",
desc: "Live theatre performance by the drama club.",
detail: "A modern retelling of classics. Limited seating available."
},

{
title: "Robotics Demo",
start: "13:00",
end: "14:30",
loc: "D Block",
desc: "Robotics and automation demonstration.",
detail: "Autonomous drone racing and robot arm precision tasks."
},

{
title: "Food Festival",
start: "14:30",
end: "17:00",
loc: "Food Court",
desc: "Multi-cuisine food stalls.",
detail: "Local and international vendors showcasing specialties."
}
];


// ==============================
// EVENT STATUS
// ==============================

function getLiveStatus(startStr, endStr){

const now = new Date();
const currentTime = now.getHours() * 60 + now.getMinutes();

const [sH, sM] = startStr.split(':').map(Number);
const [eH, eM] = endStr.split(':').map(Number);

const start = sH * 60 + sM;
const end = eH * 60 + eM;

if(currentTime < start) return "upcoming";
if(currentTime >= start && currentTime <= end) return "live";

return "ended";
}


// ==============================
// STATUS BADGE
// ==============================

function getBadge(status){

if(status === "live")
return `<span class="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100">
<span class="w-1.5 h-1.5 bg-red-600 rounded-full dot-pulse"></span> Live</span>`;

if(status === "ended")
return `<span class="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-400 rounded-full text-[10px] font-black uppercase tracking-widest">
Ended</span>`;

return `<span class="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
Upcoming</span>`;
}


// ==============================
// RENDER EVENT CARDS
// ==============================

function renderCards(data){

const grid = document.getElementById("event-grid");

grid.innerHTML = data.map(ev => {

const status = getLiveStatus(ev.start, ev.end);

const t = ev.start.split(":");
const hour12 = (t[0] % 12 || 12) + ":" + t[1] + (t[0] >= 12 ? " PM" : " AM");

return `
<div onclick="openModalByTitle('${ev.title}')"
class="event-card group border border-gray-300 rounded-lg p-8 flex flex-col justify-between min-h-[300px] bg-white cursor-pointer relative overflow-hidden">

<div class="bg-fill absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 z-0"></div>

<div class="relative z-10">

<div class="mb-8">
${getBadge(status)}
</div>

<h3 class="text-3xl font-[800] tracking-tighter mb-4 transition-colors duration-500 group-hover:text-white">
${ev.title}
</h3>

<div class="flex gap-6 text-gray-500 text-sm font-bold mb-6 transition-colors duration-500 group-hover:text-gray-400">

<span class="flex items-center gap-2">
<i data-lucide="clock" class="w-4 h-4"></i>
${hour12}
</span>

<span class="flex items-center gap-2">
<i data-lucide="map-pin" class="w-4 h-4"></i>
${ev.loc}
</span>

</div>

<p class="text-gray-500 font-medium leading-relaxed transition-colors duration-500 group-hover:text-gray-400">
${ev.desc}
</p>

</div>

<div class="flex justify-end pt-4 relative z-10">

<div class="w-10 h-10 border border-black flex items-center justify-center transition-all duration-500 group-hover:border-white group-hover:bg-white group-hover:text-black">
<i data-lucide="arrow-up-right" class="w-5 h-5"></i>
</div>

</div>

</div>
`;

}).join("");

lucide.createIcons();
}


// ==============================
// SEARCH FUNCTIONS
// ==============================

function enterSearchMode(){
document.body.classList.add("searching");
document.getElementById("eventSearch").focus();
}

function exitSearchMode(){
document.body.classList.remove("searching");
document.getElementById("eventSearch").value="";
renderCards(events);
}

function filterEvents(){

const q = document.getElementById("eventSearch").value.toLowerCase();

const filtered = events.filter(ev =>
ev.title.toLowerCase().includes(q)
);

renderCards(filtered);
}


// ==============================
// MODAL
// ==============================

function openModalByTitle(title){

const ev = events.find(e => e.title === title);

const t = ev.start.split(":");
const hour12 = (t[0] % 12 || 12) + ":" + t[1] + (t[0] >= 12 ? " PM" : " AM");

document.getElementById("modal-title").innerText = ev.title;
document.getElementById("modal-time").innerText = hour12;
document.getElementById("modal-location").innerText = ev.loc;
currentLocation = ev.loc;
document.getElementById("modal-long-desc").innerText = ev.detail;

document.getElementById("modal-badge-container").innerHTML =
getBadge(getLiveStatus(ev.start, ev.end));

document.getElementById("modal").classList.remove("hidden");

document.body.classList.add("modal-active");
document.body.style.overflow="hidden";
}

function closeModal(){

document.getElementById("modal").classList.add("hidden");

document.body.classList.remove("modal-active");
document.body.style.overflow="auto";
}


// ==============================
// MAP REDIRECT
// ==============================

function goToMap(){
  window.location.href =
  "https://dancing-cucurucho-070428.netlify.app/?loc="
  + encodeURIComponent(currentLocation);
}

// ==============================
// INITIAL LOAD
// ==============================

renderCards(events);

setInterval(() => {
renderCards(events);
}, 60000);