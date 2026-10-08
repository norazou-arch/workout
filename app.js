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
function sessionData(i){
 const w=week();w.sessions=w.sessions||{};
 if(!w.sessions[i]){
   const type=Number.isInteger(w.types?.[i])?w.types[i]:i;
   w.sessions[i]={type,title:(w.titles&&w.titles[i])||x.plan[i],ex:[...(x.ex[type]||[])],checks:[...(w.checks[i]||[])]};
 }
 const z=w.sessions[i];z.ex=Array.isArray(z.ex)?z.ex:[];z.checks=Array.isArray(z.checks)?z.checks:[];
 while(z.checks.length<z.ex.length)z.checks.push(false);
 z.checks.length=z.ex.length;
 return z;
}
function render(){
 const w=week(),r=ri(),m=mon(),s=new Date(m);s.setDate(m.getDate()+6);
 rank.textContent=r.n+r.div;pct.textContent=r.pct+"%";bar.style.width=r.pct+"%";
 sessions.textContent=x.total+" séances";toward.textContent=r.i===6?"Objectif atteint":"vers "+r.next;
 total.textContent=x.total;left.textContent=Math.max(0,365-x.total);
 career.innerHTML=R.map((q,i)=>`<button class="c ${i===r.i?"on":""}" data-r="${i}"><div class="dot">${i+1}</div>${q[0]}</button>`).join("");
 document.querySelectorAll("[data-r]").forEach(a=>a.onclick=()=>openRank(+a.dataset.r));
 const f=d=>d.toLocaleDateString("fr-FR",{day:"numeric",month:"short"});
 weekTitle.textContent=`Semaine du ${f(m)} au ${f(s)}`;
 weekScore.textContent=`${w.done.filter(Boolean).length} / 7 séances terminées`;
 days.innerHTML=D.map((d,i)=>{
   const dt=new Date(m);dt.setDate(m.getDate()+i);
   const z=w.sessions?.[i],ex=z?.ex||x.ex[i]||[],ch=z?.checks||w.checks[i]||[];
   const sub=ex.length?`${ch.filter(Boolean).length} / ${ex.length} exercices`:(w.done[i]?"Séance effectuée":"À valider");
   return `<div class="day ${w.done[i]?"done":""}" data-i="${i}"><div class="date">${d.slice(0,3)}<strong>${dt.getDate()}</strong></div><div class="main"><strong>${esc(z?.title||x.plan[i])}</strong><span>${sub}</span></div><div class="action">${w.done[i]?"✓":"›"}</div></div>`;
 }).join("");
 document.querySelectorAll(".day").forEach(e=>e.onclick=()=>openS(+e.dataset.i));save();
}
function openS(i){
 active=i;const z=sessionData(i);sday.textContent=D[i];sname.textContent=z.title;
 document.getElementById("changeSession").disabled=!!week().done[i];
 drawEx();session.showModal();
}
function drawEx(){
 const z=sessionData(active),done=!!week().done[active];
 exercises.innerHTML=z.ex.length?z.ex.map((v,j)=>`<div class="exercise" data-ex="${j}" draggable="${!done}"><span class="handle" aria-label="Réorganiser" title="Maintenir pour déplacer">⠿</span><label><input type="checkbox" data-c="${j}" ${z.checks[j]?"checked":""} ${done?"disabled":""}><span>${esc(v)}</span></label><button class="edit-ex" data-e="${j}" ${done?"disabled":""} aria-label="Modifier">✎</button><button class="delete" data-d="${j}" ${done?"disabled":""} aria-label="Supprimer">×</button></div>`).join(""):`<p>Pas d'exercices détaillés. Tu peux valider directement ou en ajouter.</p>`;
 document.querySelectorAll("[data-c]").forEach(a=>a.onchange=()=>{z.checks[+a.dataset.c]=a.checked;save();state()});
 document.querySelectorAll("[data-e]").forEach(a=>a.onclick=()=>{const j=+a.dataset.e,v=prompt("Modifier l'exercice :",z.ex[j]);if(v?.trim()){z.ex[j]=v.trim();save();drawEx()}});
 document.querySelectorAll("[data-d]").forEach(a=>a.onclick=()=>{const j=+a.dataset.d;if(confirm("Supprimer cet exercice ?")){z.ex.splice(j,1);z.checks.splice(j,1);save();drawEx()}});
 let from=null,touchFrom=null,touchY=0;
 const move=(i,j)=>{if(i===j||i<0||j<0)return;for(const arr of [z.ex,z.checks])arr.splice(j,0,arr.splice(i,1)[0]);save();drawEx()};
 document.querySelectorAll("[data-ex]").forEach(el=>{
   el.addEventListener("dragstart",e=>{if(done){e.preventDefault();return}from=+el.dataset.ex;e.dataTransfer.effectAllowed="move"});
   el.addEventListener("dragover",e=>e.preventDefault());
   el.addEventListener("drop",e=>{e.preventDefault();if(from!==null)move(from,+el.dataset.ex);from=null});
   const h=el.querySelector(".handle");
   h.addEventListener("touchstart",e=>{if(done)return;touchFrom=+el.dataset.ex;touchY=e.touches[0].clientY;h.classList.add("holding")},{passive:true});
   h.addEventListener("touchmove",e=>{if(touchFrom===null)return;e.preventDefault();touchY=e.touches[0].clientY},{passive:false});
   h.addEventListener("touchend",e=>{h.classList.remove("holding");if(touchFrom===null)return;const target=document.elementFromPoint(e.changedTouches[0].clientX,e.changedTouches[0].clientY)?.closest("[data-ex]");if(target)move(touchFrom,+target.dataset.ex);touchFrom=null});
 });
 document.getElementById("add").disabled=done;
 state();
}
function state(){
 const w=week(),z=sessionData(active),ok=!z.ex.length||z.checks.every(Boolean);
 validate.disabled=!!w.done[active]||!ok;
 validate.textContent=w.done[active]?"Séance validée ✓":"Valider la séance";
 hint.textContent=w.done[active]?"Cette séance est enregistrée.":ok?"La séance peut être validée.":"Coche tous les exercices pour valider la séance.";
}
validate.onclick=()=>{const w=week();if(!w.done[active]){w.done[active]=true;x.total++;save()}session.close();render()};
add.onclick=()=>{const v=prompt("Nom de l'exercice :");if(v?.trim()){const z=sessionData(active);z.ex.push(v.trim());z.checks.push(false);save();drawEx()}};
document.querySelector("[data-close]").onclick=()=>{session.close();render()};
document.getElementById("changeSession").onclick=()=>{
 const w=week();if(w.done[active])return;
 const z=sessionData(active);
 const options=P.map((name,i)=>`${i+1}. ${name}`).join("\n");
 const answer=prompt("Choisis la séance pour CE jour uniquement (numéro 1 à 7) :\n"+options,z.type+1);
 if(answer===null)return;
 const type=Number(answer)-1;if(!Number.isInteger(type)||type<0||type>6){alert("Choisis un numéro entre 1 et 7.");return}
 if(type!==z.type&&z.ex.length&&!confirm("Remplacer les exercices de ce jour par ceux de "+P[type]+" ? Les autres semaines ne changent pas."))return;
 z.type=type;z.title=P[type];z.ex=[...(x.ex[type]||[])];z.checks=z.ex.map(()=>false);
 sname.textContent=z.title;save();drawEx();render();
};
prev.onclick=()=>{off--;render()};next.onclick=()=>{off++;render()};
edit.onclick=()=>{fields.innerHTML=D.map((d,i)=>`<div class="prow"><b>${d}</b><input data-p="${i}" value="${esc(x.plan[i])}"></div>`).join("");planner.showModal()};
savePlan.onclick=()=>{document.querySelectorAll("[data-p]").forEach(a=>x.plan[+a.dataset.p]=a.value.trim()||P[+a.dataset.p]);save();planner.close();render()};
document.querySelector("[data-pclose]").onclick=()=>planner.close();
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