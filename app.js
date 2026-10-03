const DAYS=["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
const DEFAULT_PLAN=["Handles / Dribble","Tir","Finition","Physique","Tir","Game moves","Session libre"];
// Le rang maximal est atteint exactement à 365 séances.
const RANKS=[
 ["Rookie IV",0],["Rookie III",7],["Rookie II",14],["Rookie I",21],
 ["Bronze IV",28],["Bronze III",42],["Bronze II",56],["Bronze I",70],
 ["Silver IV",84],["Silver III",98],["Silver II",112],["Silver I",126],
 ["Gold IV",140],["Gold III",154],["Gold II",168],["Gold I",182],
 ["Diamond IV",196],["Diamond III",210],["Diamond II",224],["Diamond I",238],
 ["Elite IV",252],["Elite III",266],["Elite II",280],["Elite I",294],
 ["All-Star IV",308],["All-Star III",322],["All-Star II",336],["All-Star I",350],
 ["Immortal",365]
];
const KEY="basketTrainingV1";
const weekId=()=>{const d=new Date(),u=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));const day=u.getUTCDay()||7;u.setUTCDate(u.getUTCDate()+4-day);const y=new Date(Date.UTC(u.getUTCFullYear(),0,1));return `${u.getUTCFullYear()}-${Math.ceil((((u-y)/86400000)+1)/7)}`};
let data=JSON.parse(localStorage.getItem(KEY)||"null")||{total:0,done:Array(7).fill(false),plan:DEFAULT_PLAN,rewards:{},perfectWeeks:0,week:weekId(),weekAwarded:false};
if(data.week!==weekId()){data.done=Array(7).fill(false);data.week=weekId();data.weekAwarded=false;save();}
function save(){localStorage.setItem(KEY,JSON.stringify(data))}
function currentRank(){
 let i=0; RANKS.forEach((r,n)=>{if(data.total>=r[1])i=n}); return i;
}
function render(){
 const count=data.done.filter(Boolean).length,ri=currentRank(),cur=RANKS[ri],next=RANKS[Math.min(ri+1,RANKS.length-1)];
 document.querySelector("#weekCount").textContent=`${count}/7`;
 document.querySelector("#totalCount").textContent=data.total;
 document.querySelector("#weekBar").style.width=`${count/7*100}%`;
 document.querySelector("#weekMessage").textContent=count===7?"Semaine validée. 7/7 🔥":`${7-count} séance${7-count>1?"s":""} avant le 7/7.`;
 document.querySelector("#rankName").textContent=cur[0];
 document.querySelector("#goalLeft").textContent=Math.max(0,365-data.total);
 document.querySelector("#perfectWeeks").textContent=data.perfectWeeks||0;
 const atMax=ri===RANKS.length-1;
 const start=cur[1],end=next[1],pct=atMax?100:Math.max(0,Math.min(100,(data.total-start)/(end-start)*100));
 document.querySelector("#rankBar").style.width=pct+"%";
 document.querySelector("#nextBadge").textContent=atMax?"IMMORTAL 🏆":next[0];
 document.querySelector("#rankProgress").textContent=atMax?`${data.total} séances — rang maximal`:`${data.total} / ${next[1]} séances`;
 document.querySelector("#nextText").textContent=atMax?"Objectif ultime atteint.":`${next[1]-data.total} séance${next[1]-data.total>1?"s":""} avant ${next[0]}.`;
 const rewardKey=String(next[1]); document.querySelector("#rewardInput").value=data.rewards[rewardKey]||"";
 document.querySelector("#sessions").innerHTML=DAYS.map((day,i)=>`<div class="session ${data.done[i]?"done":""}" data-i="${i}"><div class="session-left"><div class="check">${data.done[i]?"✓":""}</div><div><div class="day">${day}</div><div class="workout">${escapeHtml(data.plan[i])}</div></div></div><span>${data.done[i]?"Fait":"À faire"}</span></div>`).join("");
 document.querySelectorAll(".session").forEach(el=>el.onclick=()=>toggle(+el.dataset.i));
 document.querySelector("#rankList").innerHTML=RANKS.map((r,i)=>`<div class="rank-item ${i===ri?"current":data.total>=r[1]?"unlocked":""}"><span>${r[0]}</span><span>${r[1]} séances</span></div>`).join("");
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function toggle(i){
 if(data.done[i]){data.done[i]=false;data.total=Math.max(0,data.total-1)}
 else{data.done[i]=true;data.total++}
 const count=data.done.filter(Boolean).length;
 if(count===7&&!data.weekAwarded){data.perfectWeeks=(data.perfectWeeks||0)+1;data.weekAwarded=true}
 if(count<7&&data.weekAwarded){data.perfectWeeks=Math.max(0,(data.perfectWeeks||0)-1);data.weekAwarded=false}
 save();render();
}
document.querySelector("#saveReward").onclick=()=>{
 const ri=currentRank(),next=RANKS[Math.min(ri+1,RANKS.length-1)],v=document.querySelector("#rewardInput").value.trim();
 data.rewards[String(next[1])]=v;save();document.querySelector("#rewardSaved").textContent="Récompense enregistrée ✓";
 setTimeout(()=>document.querySelector("#rewardSaved").textContent="",1800);
};
const dialog=document.querySelector("#editDialog");
document.querySelector("#editBtn").onclick=()=>{
 document.querySelector("#editFields").innerHTML=DAYS.map((d,i)=>`<div class="edit-row"><label>${d}</label><input data-plan="${i}" value="${escapeHtml(data.plan[i])}"></div>`).join("");dialog.showModal();
};
document.querySelector("#savePlan").onclick=(e)=>{e.preventDefault();document.querySelectorAll("[data-plan]").forEach(x=>data.plan[+x.dataset.plan]=x.value.trim()||DEFAULT_PLAN[+x.dataset.plan]);save();dialog.close();render()};
document.querySelector("#resetWeek").onclick=()=>{if(confirm("Réinitialiser uniquement les cases de cette semaine ? Le total sera ajusté.")){const n=data.done.filter(Boolean).length;data.total=Math.max(0,data.total-n);if(data.weekAwarded)data.perfectWeeks=Math.max(0,data.perfectWeeks-1);data.done=Array(7).fill(false);data.weekAwarded=false;save();render()}};
if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js");
render();