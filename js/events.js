// ==============================
// EVENT DATES
// ==============================

const day1Date = "2026-03-12";
const day2Date = "2026-03-13";


// ==============================
// EVENTS DATABASE
// ==============================

const events = [

{ date: day1Date, title: "AI Workshop", start: "10:00", end: "12:30", loc: "AI Campus", desc: "Hands-on AI workshop.", detail: "Exploring transformers and local LLMs.", link: "main.html?loc=AI Campus" },

{ date: day1Date, title: "Drama Performance", start: "11:30", end: "13:00", loc: "DT Playhouse", desc: "Live theatre production.", detail: "Shakespeare modernized.", link: "main.html?loc=DT Playhouse" },

{ date: day1Date, title: "Robotics Demo", start: "13:00", end: "14:30", loc: "D Block", desc: "Autonomous bot races.", detail: "Featuring computer vision tech.", link: "main.html?loc=D Block" },

{ date: day2Date, title: "Hackathon Start", start: "09:00", end: "11:00", loc: "Main Hall", desc: "24-hour coding sprint.", detail: "Prizes for best innovation.", link: "main.html?loc=Main Hall" },

{ date: day2Date, title: "UX Design Talk", start: "12:00", end: "14:00", loc: "B Block", desc: "Clean UI principles.", detail: "Minimalism workshop.", link: "main.html?loc=B Block" }

];


// ==============================
// GET TODAY DATE
// ==============================

function getTodayStr(){

const now = new Date();
const offset = now.getTimezoneOffset() * 60000;

return (new Date(now - offset)).toISOString().slice(0,10);

}


// ==============================
// EVENT STATUS
// ==============================

function getStatus(eventDate,startStr,endStr){

const todayStr = getTodayStr();
const now = new Date();

if(eventDate < todayStr) return {type:'ended',weight:3};
if(eventDate > todayStr) return {type:'upcoming',weight:2};

const currentTime = now.getHours()*60 + now.getMinutes();

const [sH,sM] = startStr.split(':').map(Number);
const [eH,eM] = endStr.split(':').map(Number);

const start = sH*60+sM;
const end = eH*60+eM;

if(currentTime < start) return {type:'upcoming',weight:2};
if(currentTime >= start && currentTime <= end) return {type:'live',weight:1};

return {type:'ended',weight:3};

}


// ==============================
// BADGE HTML
// ==============================

function getBadge(status){

if(status === 'live')
return `<span class="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100"><span class="w-1.5 h-1.5 bg-red-600 rounded-full dot-pulse"></span> Live</span>`;

if(status === 'ended')
return `<span class="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-400 rounded-full text-[10px] font-black uppercase tracking-widest">Ended</span>`;

return `<span class="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">Upcoming</span>`;

}


// ==============================
// RENDER EVENT CARDS
// ==============================

function renderCards(){

const todayStr = getTodayStr();

const targetDate = todayStr >= day2Date ? day2Date : day1Date;

const dayLabel = targetDate === day1Date ? "Day 1 (March 12)" : "Day 2 (March 13)";

const titleEl = document.getElementById("schedule-title");

if(titleEl) titleEl.innerText = `${dayLabel} Schedule`;

const query = document.getElementById("eventSearch").value.toLowerCase();

const filtered = events.filter(ev => ev.date === targetDate && ev.title.toLowerCase().includes(query));

filtered.sort((a,b)=> getStatus(a.date,a.start,a.end).weight - getStatus(b.date,b.start,b.end).weight);

const grid = document.getElementById("event-grid");

grid.innerHTML = filtered.map(ev => {

const status = getStatus(ev.date,ev.start,ev.end);

const t = ev.start.split(':');

const h12 = (t[0]%12||12)+":"+t[1]+(t[0]>=12?" PM":" AM");

return `

<div onclick="openModalByTitle('${ev.title}')" class="event-card group border border-gray-300 rounded-lg p-8 flex flex-col justify-between min-h-[300px] bg-white cursor-pointer relative overflow-hidden">

<div class="bg-fill absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 z-0"></div>

<div class="relative z-10">

<div class="mb-8">${getBadge(status.type)}</div>

<h3 class="text-3xl font-[800] tracking-tighter mb-4 transition-colors duration-500 group-hover:text-white">${ev.title}</h3>

<div class="flex gap-6 text-gray-500 text-sm font-bold mb-6 transition-colors duration-500 group-hover:text-gray-400">

<span class="flex items-center gap-2"><i data-lucide="clock" class="w-4 h-4"></i>${h12}</span>

<span class="flex items-center gap-2"><i data-lucide="map-pin" class="w-4 h-4"></i>${ev.loc}</span>

</div>

</div>

<div class="flex justify-end pt-4 relative z-10">

<div class="w-10 h-10 border border-black flex items-center justify-center transition-all duration-500 group-hover:border-white group-hover:bg-white group-hover:text-black">

<i data-lucide="arrow-up-right" class="w-5 h-5"></i>

</div>

</div>

</div>

`;

}).join('');

lucide.createIcons();

}


// ==============================
// SEARCH
// ==============================

function enterSearchMode(){

document.body.classList.add("searching");

document.getElementById("eventSearch").focus();

}

function exitSearchMode(){

document.body.classList.remove("searching");

document.getElementById("eventSearch").value="";

renderCards();

}

function filterEvents(){

renderCards();

}


// ==============================
// MODAL
// ==============================

function openModalByTitle(title){

const ev = events.find(e=>e.title===title);

const status = getStatus(ev.date,ev.start,ev.end);

const t = ev.start.split(':');

const h12 = (t[0]%12||12)+":"+t[1]+(t[0]>=12?" PM":" AM");

document.getElementById("modal-title").innerText = ev.title;

document.getElementById("modal-time").innerText = h12;

document.getElementById("modal-location").innerText = ev.loc;

document.getElementById("modal-long-desc").innerText = ev.detail;

document.getElementById("modal-badge-container").innerHTML = getBadge(status.type);

const btn = document.querySelector(".group.relative.w-full");

if(btn) btn.onclick = ()=> window.location.href = ev.link;

document.getElementById("modal").classList.remove("hidden");

document.body.classList.add("modal-active");

}


// ==============================
// CLOSE MODAL
// ==============================

function closeModal(){

document.getElementById("modal").classList.add("hidden");

document.body.classList.remove("modal-active");

}


// ==============================
// START
// ==============================

renderCards();

setInterval(renderCards,60000);