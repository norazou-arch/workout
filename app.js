const D=["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"],P=["Entraînement de club","Shoot","Entraînement de club","Actions de match","Main faible","Dribble","Défense"],E={0:[],1:["50 tirs mi-distance","50 tirs à 3 points","20 lancers francs","20 tirs après dribble"],2:[],3:["5 finitions main droite","5 finitions main gauche","10 actions à vitesse match"],4:["100 dribbles main faible","20 finitions main faible"],5:["Crossovers","Between the legs","Behind the back","Changements de rythme"],6:["Slides défensifs","Closeouts","Travail des appuis"]},R=[
["Rookie",0,[["IV",0,15],["III",15,16],["II",31,15],["I",46,15]],61],
["Pôle Espoir",61,[["IV",61,15],["III",76,15],["II",91,16],["I",107,15]],122],
["Pro",122,[["IV",122,15],["III",137,15],["II",152,15],["I",167,15]],182],
["EuroLeague",182,[["IV",182,15],["III",197,16],["II",213,15],["I",228,15]],243],
["NBA",243,[["IV",243,15],["III",258,15],["II",273,16],["I",289,15]],304],
["All-Star",304,[["IV",304,15],["III",319,15],["II",334,15],["I",349,15]],364],
["MVP",365,[],365]
],K="basketTrainingV2";let x=JSON.parse(localStorage.getItem(K)||"null")||{plan:[...P],ex:JSON.parse(JSON.stringify(E)),weeks:{},total:0},off=0,active=0;const save=()=>localStorage.setItem(K,JSON.stringify(x)),esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));function mon(){let d=new Date();d.setHours(12,0,0,0);let q=d.getDay()||7;d.setDate(d.getDate()-q+1+off*7);return d}function key(){let d=mon();return d.toISOString().slice(0,10)}function week(){return x.weeks[key()]||(x.weeks[key()]={done:Array(7).fill(false),checks:{}})}function ri(){
let t=x.total;
if(t>=365)return{i:6,n:"MVP",div:"",pct:100,next:"MVP"};
let i=0;
for(let j=0;j<6;j++){if(t>=R[j][1])i=j}
let rank=R[i], div=" IV";
for(let d of rank[2])if(t>=d[1])div=" "+d[0];
let pct=Math.floor((t-rank[1])/(rank[3]-rank[1])*100);
if(i===5&&t>=364)pct=100;
return{i,n:rank[0],div,pct,next:i===5?"MVP":R[i+1][0]}
}
function render(){let w=week(),r=ri(),m=mon(),s=new Date(m);s.setDate(m.getDate()+6);rank.textContent=r.n+r.div;pct.textContent=r.pct+"%";bar.style.width=r.pct+"%";sessions.textContent=x.total+" séances";toward.textContent=r.i===6?"Objectif atteint":"vers "+r.next;total.textContent=x.total;left.textContent=Math.max(0,365-x.total);career.innerHTML=R.map((q,i)=>`<button class="c ${i===r.i?"on":""}" data-r="${i}"><div class="dot">${i+1}</div>${q[0]}</button>`).join("");
document.querySelectorAll("[data-r]").forEach(a=>a.onclick=()=>openRank(+a.dataset.r));let f=d=>d.toLocaleDateString("fr-FR",{day:"numeric",month:"short"});weekTitle.textContent=`Semaine du ${f(m)} au ${f(s)}`;weekScore.textContent=`${w.done.filter(Boolean).length} / 7 séances terminées`;days.innerHTML=D.map((d,i)=>{let dt=new Date(m);dt.setDate(m.getDate()+i);let ex=x.ex[i]||[],ch=w.checks[i]||[],sub=ex.length?`${ch.filter(Boolean).length} / ${ex.length} exercices`:(w.done[i]?"Séance effectuée":"À valider");return `<div class="day ${w.done[i]?"done":""}" data-i="${i}"><div class="date">${d.slice(0,3)}<strong>${dt.getDate()}</strong></div><div class="main"><strong>${esc(x.plan[i])}</strong><span>${sub}</span></div><div class="action">${w.done[i]?"✓":"›"}</div></div>`}).join("");document.querySelectorAll(".day").forEach(e=>e.onclick=()=>openS(+e.dataset.i));save()}function openS(i){active=i;let w=week();sday.textContent=D[i];sname.textContent=x.plan[i];if(!w.checks[i])w.checks[i]=Array((x.ex[i]||[]).length).fill(false);drawEx();session.showModal()}function drawEx(){let w=week(),e=x.ex[active]||[],c=w.checks[active]||[];exercises.innerHTML=e.length?e.map((v,j)=>`<div class="exercise"><label><input type="checkbox" data-c="${j}" ${c[j]?"checked":""}><span>${esc(v)}</span></label><button class="delete" data-d="${j}">×</button></div>`).join(""):`<p id="hint">Pas d'exercices détaillés. Tu peux valider directement ou en ajouter.</p>`;document.querySelectorAll("[data-c]").forEach(a=>a.onchange=()=>{c[+a.dataset.c]=a.checked;w.checks[active]=c;save();state()});document.querySelectorAll("[data-d]").forEach(a=>a.onclick=()=>{let j=+a.dataset.d;x.ex[active].splice(j,1);c.splice(j,1);w.checks[active]=c;save();drawEx()});state()}function state(){let w=week(),e=x.ex[active]||[],c=w.checks[active]||[],ok=!e.length||(c.length===e.length&&c.every(Boolean));validate.disabled=!ok;validate.textContent=w.done[active]?"Séance validée ✓":"Valider la séance";hint.textContent=ok?"La séance peut être validée.":"Coche tous les exercices pour valider la séance."}validate.onclick=()=>{let w=week();if(!w.done[active]){w.done[active]=true;x.total++;save()}session.close();render()};add.onclick=()=>{let v=prompt("Nom de l'exercice :");if(v&&v.trim()){x.ex[active]=x.ex[active]||[];x.ex[active].push(v.trim());let w=week();w.checks[active]=w.checks[active]||[];w.checks[active].push(false);save();drawEx()}};document.querySelector("[data-close]").onclick=()=>session.close();prev.onclick=()=>{off--;render()};next.onclick=()=>{off++;render()};edit.onclick=()=>{fields.innerHTML=D.map((d,i)=>`<div class="prow"><b>${d}</b><input data-p="${i}" value="${esc(x.plan[i])}"></div>`).join("");planner.showModal()};savePlan.onclick=()=>{document.querySelectorAll("[data-p]").forEach(a=>x.plan[+a.dataset.p]=a.value.trim()||P[+a.dataset.p]);save();planner.close();render()};document.querySelector("[data-pclose]").onclick=()=>planner.close();
function openRank(i){
 let q=R[i], body=document.querySelector("#rankBody"), title=document.querySelector("#rankTitle");
 title.textContent=q[0];
 if(i===6){
   body.innerHTML=`<div class="rankline current"><b>🏆 MVP</b><span>365 séances</span></div>`;
 }else{
   body.innerHTML=q[2].map(d=>{
     let current=x.total>=d[1] && (d===q[2][q[2].length-1] ? x.total<q[3] : x.total<q[2][q[2].indexOf(d)+1][1]);
     return `<div class="rankline ${current?"current":""}"><b>${q[0]} ${d[0]}</b><span>${d[1]} séances · ${d[2]} à faire</span></div>`
   }).join("") + (i===5
      ? `<div class="rankline goal"><b>🏆 MVP</b><span>365 séances</span></div>`
      : `<div class="rankline goal"><b>→ ${R[i+1][0]} IV</b><span>${q[3]} séances</span></div>`);
 }
 document.querySelector("#rankDialog").showModal();
}
document.querySelector("[data-rclose]").onclick=()=>document.querySelector("#rankDialog").close();

function exportBackup(){
 const payload={app:"Basket Training",version:"2.3",exportedAt:new Date().toISOString(),storageKey:K,data:x};
 const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
 const url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download="basket-training-sauvegarde.json";document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
exportData.onclick=exportBackup;
importData.onclick=()=>importFile.click();
importFile.onchange=async()=>{
 const f=importFile.files&&importFile.files[0]; if(!f)return;
 try{
   const raw=JSON.parse(await f.text());
   const incoming=raw&&raw.data?raw.data:raw;
   if(!incoming||!Array.isArray(incoming.plan)||!incoming.weeks||typeof incoming.total!=="number")throw new Error();
   if(!confirm(`Importer cette sauvegarde (${incoming.total} séances) ?`))return;
   x=incoming;save();alert("Sauvegarde importée. Tes données sont restaurées.");location.reload();
 }catch(e){alert("Ce fichier n'est pas une sauvegarde Basket Training valide.");}
 finally{importFile.value="";}
};

if("serviceWorker"in navigator)navigator.serviceWorker.register("./sw.js");render();