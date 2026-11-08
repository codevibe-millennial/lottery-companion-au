const GAMES={
 "TattsLotto":{kind:"lotto",n:6,max:45,draw:"Saturday",odds:"1 in 8,145,060"},
 "Oz Lotto":{kind:"lotto",n:7,max:47,draw:"Tuesday",odds:"1 in 62,891,499"},
 "Powerball":{kind:"power",n:7,max:35,pn:1,pmax:20,draw:"Thursday",odds:"1 in 134,490,400"},
 "Set for Life":{kind:"lotto",n:7,max:44,draw:"Daily",odds:"1 in 38,320,568"},
 "Weekday Windfall":{kind:"lotto",n:6,max:45,draw:"Monday, Wednesday and Friday",odds:"1 in 8,145,060"},
 "Lucky Super Jackpot":{kind:"raffle",draw:"When tickets sell out",odds:"1 in 18,385,877"},
 "Lucky Mega Jackpot":{kind:"raffle",draw:"When tickets sell out",odds:"1 in 9,483,168"},
 "Super 66":{kind:"digits",n:6,draw:"Saturday",odds:"1 in 1,000,000"}
};
const $=id=>document.getElementById(id);let game="Set for Life",picked=[],power="",deferred=null,lastBatch=[];
function init(){Object.keys(GAMES).forEach(g=>$("game").add(new Option(g,g)));$("game").value=game;renderGame();bind();if("serviceWorker"in navigator)navigator.serviceWorker.register("./sw.js").catch(()=>{});}
function bind(){
$("game").onchange=()=>{game=$("game").value;picked=[];power="";renderGame()};
$("entryType").onchange=()=>{picked=[];renderPicker()};
$("quickBtn").onclick=()=>{const c=GAMES[game];if(c.kind==="digits"){$("super66").value=String(Math.floor(Math.random()*1000000)).padStart(6,"0");updateSummary();return}if(c.kind==="raffle")return;const t=target();picked=shuffle(Array.from({length:c.max},(_,i)=>i+1)).slice(0,t).sort((a,b)=>a-b);renderPicker()};
$("clearBtn").onclick=()=>{picked=[];$("super66").value="";$("raffleTicket").value="";renderPicker()};
$("power").onchange=e=>{power=e.target.value;updateSummary()};
$("super66").oninput=e=>{e.target.value=e.target.value.replace(/\\D/g,"").slice(0,6);updateSummary()};
$("random66").onclick=()=>{$("super66").value=String(Math.floor(Math.random()*1000000)).padStart(6,"0");updateSummary()};
$("saveBtn").onclick=savePick;
$("generateBatch").onclick=generateBatch;
$("saveBatch").onclick=saveBatch;
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tab,.page").forEach(x=>x.classList.remove("active"));b.classList.add("active");$(b.dataset.tab).classList.add("active");if(b.dataset.tab==="saved")renderSaved()});
$("analyseBtn").onclick=analyseCSV;$("exportBtn").onclick=exportCSV;$("deleteBtn").onclick=()=>{if(confirm("Delete all saved picks from this device?")){localStorage.removeItem("lotteryPicks");renderSaved()}};
}
function target(){let c=GAMES[game],v=$("entryType").value;return v==="Standard"?c.n:Number(v.replace("System ",""))}
function renderGame(){let c=GAMES[game];$("gameInfo").textContent=c.kind==="raffle"?"Raffle-style game · Ticket numbers are issued by the lottery operator. This app only tracks a ticket you already hold.":c.kind==="digits"?"Choose a six-digit sequence from 000000 to 999999. Exact order matters; leading zeroes count.":`${c.n} main numbers from 1–${c.max}${c.kind==="power"?" plus one Powerball from 1–"+c.pmax:""} · Draw: ${c.draw} · Division 1 odds: ${c.odds}.`;
$("pickerWrap").classList.toggle("hidden",c.kind==="raffle");$("raffleWrap").classList.toggle("hidden",c.kind!=="raffle");$("super66Wrap").classList.toggle("hidden",c.kind!=="digits");$("powerWrap").classList.toggle("hidden",c.kind!=="power");
$("entryType").innerHTML="";if(c.kind==="lotto"||c.kind==="power"){["Standard",...Array.from({length:Math.min(20,c.max)-c.n},(_,i)=>"System "+(c.n+i+1))].map(x=>$("entryType").add(new Option(x,x)));$("entryHint").textContent="System entries select more main numbers and cover multiple standard combinations. More combinations cost more; confirm current prices with the operator."}else{$("entryType").add(new Option(c.kind==="digits"?"Six-digit entry":"Ticket tracker","Standard"));$("entryHint").textContent=c.kind==="digits"?"No system entry applies to Super 66.":"Lucky Lotteries is not a choose-your-own-number game."}
$("power").innerHTML='<option value="">Select Powerball</option>';if(c.kind==="power")for(let i=1;i<=c.pmax;i++)$("power").add(new Option(i,i));$("power").value="";$("super66").value="";$("raffleTicket").value="";renderPicker();}
function renderPicker(){let c=GAMES[game];$("pickTitle").textContent=c.kind==="digits"?"Six-digit number":"Select your main numbers";$("pickSub").textContent=c.kind==="digits"?"Enter digits in exact order":"Tap numbers to select";$("numberGrid").innerHTML="";if(c.kind==="lotto"||c.kind==="power"){for(let i=1;i<=c.max;i++){let b=document.createElement("button");b.className="ball"+(picked.includes(i)?" selected":"");b.textContent=i;b.disabled=!picked.includes(i)&&picked.length>=target();b.onclick=()=>{picked=picked.includes(i)?picked.filter(x=>x!==i):[...picked,i];picked.sort((a,b)=>a-b);renderPicker()};$("numberGrid").append(b)}}else $("numberGrid").classList.add("hidden");if(c.kind!=="digits")$("numberGrid").classList.remove("hidden");$("counter").textContent=c.kind==="digits"?"6 digits":`${picked.length} / ${target()}`;updateSummary();}
function updateSummary(){let c=GAMES[game],ok=false,txt="",o="";if(c.kind==="lotto"||c.kind==="power"){ok=picked.length===target()&&(c.kind!=="power"||!!$("power").value);txt=picked.length?picked.join(" · "):"No numbers selected";if(c.kind==="power"&&$("power").value)txt+="  |  Powerball "+$("power").value;o="Division 1 odds for one standard game: "+c.odds+(target()>c.n?" · System entry covers "+choose(target(),c.n)+" standard combinations.":"")}else if(c.kind==="digits"){ok=/^\\d{6}$/.test($("super66").value);txt=$("super66").value||"Enter six digits";o="Division 1 odds: "+c.odds+" · Exact order required."}else{ok=$("raffleTicket").value.trim().length>0;txt=$("raffleTicket").value.trim()||"Enter your existing ticket number to save it";o="Jackpot odds: "+c.odds+" · This app does not issue tickets."}
$("validity").textContent=ok?"Ready to save":"Not complete";$("validity").style.background=ok?"#dcf5e8":"#e9edfa";$("summaryText").textContent=game+" · "+txt;$("odds").textContent=o;$("saveBtn").disabled=!ok;$("saveBtn").style.opacity=ok?"1":".55";}
function savePick(){let c=GAMES[game],v={game,system:$("entryType").value,date:new Date().toISOString(),numbers:c.kind==="digits"?$("super66").value:c.kind==="raffle"?$("raffleTicket").value:picked.join(" "),power:c.kind==="power"?$("power").value:""};let a=JSON.parse(localStorage.getItem("lotteryPicks")||"[]");a.unshift(v);localStorage.setItem("lotteryPicks",JSON.stringify(a));alert("Selection saved on this device.");}

function generateBatch(){
 const c=GAMES[game],count=Number($("batchCount").value),style=$("spreadRule").value;
 if(!["lotto","power"].includes(c.kind)){
   $("batchOutput").textContent=c.kind==="digits"?"For Super 66, use the six-digit random generator. Lucky Lotteries ticket numbers are assigned by the operator.":"This game does not support number combinations.";
   lastBatch=[];$("saveBatch").disabled=true;return;
 }
 const n=target(),seen=new Set(),batch=[];let tries=0;
 while(batch.length<count&&tries<50000){
   tries++;
   const candidate=shuffle(Array.from({length:c.max},(_,i)=>i+1)).slice(0,n).sort((a,b)=>a-b);
   const odd=candidate.filter(x=>x%2).length,low=candidate.filter(x=>x<=Math.floor(c.max/2)).length,high=candidate.filter(x=>x>31).length;
   if(style==="balanced"&&(odd<Math.floor(n/2)-1||odd>Math.ceil(n/2)+1||low<Math.floor(n/2)-1||low>Math.ceil(n/2)+1))continue;
   if(style==="high"&&high<Math.min(3,n))continue;
   const key=candidate.join("-");
   if(!seen.has(key)){seen.add(key);batch.push({numbers:candidate,power:c.kind==="power"?String(1+Math.floor(Math.random()*c.pmax)):""});}
 }
 lastBatch=batch;
 $("batchOutput").innerHTML=batch.length?batch.map((v,i)=>`<div class="statrow"><span>Combination ${i+1}</span><b>${v.numbers.join(" · ")}${v.power?" + PB "+v.power:""}</b></div>`).join(""):"Could not generate combinations with these filters. Try unrestricted random.";
 $("saveBatch").disabled=!batch.length;
}
function saveBatch(){
 if(!lastBatch.length)return;
 let a=JSON.parse(localStorage.getItem("lotteryPicks")||"[]");
 lastBatch.forEach(v=>a.unshift({game,system:$("entryType").value,date:new Date().toISOString(),numbers:v.numbers.join(" "),power:v.power}));
 localStorage.setItem("lotteryPicks",JSON.stringify(a));alert(lastBatch.length+" combinations saved on this device.");renderSaved();
}

function renderSaved(){let a=JSON.parse(localStorage.getItem("lotteryPicks")||"[]");$("savedList").innerHTML=a.length?"":"<p class='hint'>No saved selections yet.</p>";a.forEach((v,i)=>{let d=document.createElement("div");d.className="saveditem";d.innerHTML=`<b>${esc(v.game)} · ${esc(v.system)}</b><div class="savednums">${esc(v.numbers)}${v.power?" · Powerball "+esc(v.power):""}</div><small>${new Date(v.date).toLocaleString()}</small>`;$("savedList").append(d)})}
function analyseCSV(){let f=$("csvFile").files[0];if(!f){$("statsOutput").textContent="Choose a CSV file first.";return}let c=GAMES[game];if(!["lotto","power"].includes(c.kind)){$("statsOutput").textContent="Frequency analysis is designed for main-number draw CSVs. Super 66 digit-position analysis can be added using a six-digit results file.";return}let r=new FileReader();r.onload=()=>{let rows=r.result.split(/\r?\n/).filter(Boolean),counts=Array(c.max+1).fill(0),draws=0;rows.forEach(line=>{let vals=line.split(/[;,\t]/).map(x=>x.trim()).filter(x=>/^\d+$/.test(x)).map(Number).filter(n=>n>=1&&n<=c.max);if(vals.length>=c.n){draws++;vals.slice(0,c.n).forEach(n=>counts[n]++)}});let sorted=Array.from({length:c.max},(_,i)=>i+1).sort((a,b)=>counts[b]-counts[a]);$("statsOutput").innerHTML=`<b>${draws} rows analysed</b><br>`+sorted.slice(0,10).map(n=>`<div class="statrow"><span>Number ${n}</span><b>${counts[n]} appearances</b></div>`).join("")+"<p>CSV is treated as one draw per row. Verify column order and remove date/draw-number columns before importing. Frequency does not predict future results.</p>"};r.readAsText(f)}
function exportCSV(){let a=JSON.parse(localStorage.getItem("lotteryPicks")||"[]");let rows=[["game","system","numbers","powerball","saved_at"],...a.map(v=>[v.game,v.system,v.numbers,v.power,v.date])];download("my-lottery-picks.csv",rows.map(r=>r.map(x=>'"'+String(x).replaceAll('"','""')+'"').join(",")).join("\n"))}
function download(name,content){let a=document.createElement("a");a.href=URL.createObjectURL(new Blob([content],{type:"text/csv"}));a.download=name;a.click();URL.revokeObjectURL(a.href)}
function choose(n,r){let x=1;for(let i=1;i<=r;i++)x=x*(n-r+i)/i;return Math.round(x)}
function shuffle(a){for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferred=e;$("installBtn").classList.remove("hidden")});$("installBtn").onclick=async()=>{if(deferred){deferred.prompt();await deferred.userChoice;deferred=null;$("installBtn").classList.add("hidden")}};
init();