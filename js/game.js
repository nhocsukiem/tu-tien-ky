// ===== VÒNG LẶP GAME: tu luyện, đột phá, luyện đan, lưu, hiển thị, nút bấm =====
const KEY="tutien_save_v1";
let S,auto=null;
const $=id=>document.getElementById(id);
const rnd=n=>Math.floor(Math.random()*n);
function load(){try{const v=localStorage.getItem(KEY);if(v)return JSON.parse(v)}catch(e){}return null}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function say(t,c){S.log.unshift({t:t,c:c||""});S.log=S.log.slice(0,40)}
function advance(months){
  S.m+=months;if(S.hurt>0){S.hm=(S.hm||0)+months*(S.tname==='Tự Trị Chi Thể'?2:1);if(S.hm>=(S.hurt==2?60:36)){S.hurt--;S.hm=0;say('Thương thế đã thuyên giảm theo thời gian.','g')}}S.evT=(S.evT===undefined?nextEv():S.evT)-months;S.pT=(S.pT===undefined?nextP():S.pT)-months;if(S.pT<=0&&age()<S.life){S.pT=nextP();passive()}if(age()<S.life&&S.ev==null&&S.evT<=0)raiseEvent();
  if(age()>=S.life)die();
}
function die(){S.ev=null;
  stopAuto();
  S.dead=true;
  const pts=S.realm*3+1;
  say("Thọ nguyên cạn kiệt, ngươi tọa hóa ở tuổi "+age()+" với cảnh giới "+REALMS[S.realm]+". Nhận "+pts+" đạo duyên.","b");
  S.legacy+=pts;
}
function reborn(){
  const L=S.legacy,G=S.gen+1;
  const nm=S.name;S=newLife(L,G);S.name=nm;
  say("Chuyển thế luân hồi, kiếp thứ "+G+".","y");
  render();save();
}
function cult(months){
  if(S.dead)return;
  const max=need();
  if(S.realm>=TOP)return;
  if(S.qi>=max){say("Tu vi đã viên mãn, hãy thử đột phá.","y");stopAuto();return}
  S.qi=Math.min(max,S.qi+gain()*months);
  advance(months);
  if(!S.dead&&S.qi>=max){say("Linh khí đã đầy, có thể đột phá "+REALMS[S.realm+1]+".","g");stopAuto()}
}
function explore(){
  if(S.dead)return;
  if(S.ev==null&&Math.random()<.5)raiseEvent();else EVENTS[rnd(EVENTS.length)]();
  advance(3);
}
function useStone(){
  if(S.dead||S.stone<1||S.boost>=3)return;
  S.stone--;S.boost++;
  say("Bày linh thạch hộ pháp, xác suất đột phá +10%.","g");
}
function breakthrough(){
  if(S.dead||S.qi<need())return;
  const p=(S.tl&&S.realm===1)?1:Math.max(.05,Math.min(.95,CHANCE[S.realm]+.1*S.boost+.01*S.legacy-.15*(S.hurt||0)));
  S.boost=0;
  if(Math.random()<p){
    S.realm++;S.qi=0;
    S.life=Math.max(S.life,LIFE[S.realm]);
    if(S.realm===TOP){
      const pts=15;S.legacy+=pts;
      say("Thiên kiếp giáng xuống, ngươi vượt qua tất cả và phi thăng tiên giới! Nhận "+pts+" đạo duyên. Bắt đầu kiếp mới để tiếp tục.","y");
      S.dead=true;stopAuto();
    }else say("Đột phá thành công! Ngươi đã đạt cảnh giới "+REALMS[S.realm]+".","y");
  }else{
    const x=S.tname==='Bất Diệt Chi Thể'?Math.random()*.5:Math.random();S.m+=24;if(x<.5){S.qi=Math.floor(S.qi*.6);hurtUp(1)}else if(x<.85){S.qi=Math.floor(S.qi*.4);hurtUp(2)}else{S.qi=Math.floor(S.qi*.4);hurtUp(2);S.mult=Math.round(S.mult*90)/100}
    say("Đột phá thất bại (xác suất "+Math.round(p*100)+"%). "+(x<.5?"Tâm ma xâm nhập, mất 40% tu vi, bị thương nhẹ.":x<.85?"Kinh mạch tổn thương, mất 60% tu vi, bị trọng thương.":"Căn cơ bị hư hỏng, mất 60% tu vi, trọng thương và tốc độ tu luyện vĩnh viễn giảm 10%.")+" Hao tổn 2 năm thọ nguyên.","b");
    if(age()>=S.life)die();
  }
}
function eatPill(){
  if(S.dead||S.pill<1||S.realm>=TOP||S.qi>=need())return;
  S.pill--;
  const q=gain()*15;
  S.qi=Math.min(need(),S.qi+q);
  say("Uống Tụ Linh Đan, tu vi tăng "+q+".","g");
}
let tribuOn=false;
function tribulation(){
  const ov=$('tribu'),cv=$('tcv'),tx=$('ttxt'),g=cv.getContext('2d');
  const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  const W=cv.width=innerWidth,H=cv.height=innerHeight;
  const n=Math.min(10,2+S.realm);
  let flash=0,i=0,col='150,200,255',run=true;
  ov.hidden=false;ov.className=reduce?'':'shake';
  tx.textContent='Mây kiếp tụ lại trên đầu ngươi...';
  function glow(p,w){g.save();g.lineJoin='round';g.shadowColor='rgb('+col+')';g.shadowBlur=24;g.strokeStyle='#fff';g.lineWidth=w;g.beginPath();g.moveTo(p[0][0],p[0][1]);p.slice(1).forEach(q=>g.lineTo(q[0],q[1]));g.stroke();g.restore()}
  function strike(){
    const pts=[[W*(.15+Math.random()*.7),0]];let y=0,x=pts[0][0];
    while(y<H*.9){y+=H*(.04+Math.random()*.06);x+=(Math.random()-.5)*W*.12;pts.push([x,y])}
    glow(pts,3.5);
    for(let b=0;b<3;b++){const s=pts[1+rnd(pts.length-2)],br=[s];let bx=s[0],by=s[1];for(let k=0;k<4;k++){bx+=(Math.random()-.5)*W*.14;by+=H*.05;br.push([bx,by])}glow(br,1.6)}
    flash=reduce?.2:.7;
  }
  function frame(){
    g.fillStyle='rgba(5,8,14,.18)';g.fillRect(0,0,W,H);
    for(let c=0;c<5;c++){const cx=W*(c/4),r=Math.max(W,H)*.35,gr=g.createRadialGradient(cx,0,0,cx,0,r);gr.addColorStop(0,'rgba(60,70,95,.12)');gr.addColorStop(1,'rgba(60,70,95,0)');g.fillStyle=gr;g.fillRect(0,0,W,H)}
    if(flash>0){g.fillStyle='rgba('+col+','+flash+')';g.fillRect(0,0,W,H);flash*=.85;if(flash<.02)flash=0}
    if(run)requestAnimationFrame(frame);
  }
  g.fillStyle='#05080e';g.fillRect(0,0,W,H);frame();
  const t=setInterval(()=>{
    if(i<n){i++;tx.textContent='Lôi kiếp giáng xuống! Đạo '+i+'/'+n;strike()}
    else{clearInterval(t);setTimeout(finish,500)}
  },reduce?450:650);
  function finish(){
    const before=S.realm;breakthrough();const ok=S.realm>before;
    col=ok?'255,215,120':'255,70,60';flash=ok?.9:.8;
    tx.textContent=ok?'Đột phá thành công: '+REALMS[S.realm]+'!':'Đột phá thất bại...';
    setTimeout(()=>{run=false;ov.hidden=true;tribuOn=false;render();save();startAuto()},reduce?900:1700);
  }
}
let rt=null,resetArm=false;
function stopRoll(){if(rt){clearInterval(rt);rt=null}}
function toggleRoll(){
  if(rt){stopRoll();render();return}if(S.rolled)return;
  S.rolled=true;
  reroll();
  render();
}
function startLife(){
  S.name=$("nameIn").value.trim().slice(0,20);if(!S.name)return;stopRoll();S.rolling=false;setTimeout(startAuto,0);
  say(S.name+" là thiếu niên 16 tuổi, sinh ra với "+S.root+", thể chất "+S.tname+" (x"+S.mult+"). Trong tay có chiếc bình nhỏ màu xanh kỳ lạ, có thể thúc linh thảo mau lớn. Hãy sống sót và tu tiên.","y");
  render();save();
}
function stopAuto(){if(auto){clearInterval(auto);auto=null}}
function startAuto(){if(auto||S.dead||S.rolling||S.ev!=null)return;if(S.realm<TOP&&S.qi>=need())return;auto=setInterval(()=>{cult(1);render();save()},600);render()}
function toggleAuto(){
  if(auto){stopAuto()}else startAuto();
  render();
}
function render(){
  const dead=S.dead,max=S.realm<TOP?need():1;
  const hasEv=S.ev!=null&&!S.dead;
  $("ev").hidden=!hasEv;
  if(hasEv){const e=EV[S.ev];$("evT").textContent=e.t;const box=$("evO");box.innerHTML='';e.o.forEach((o,i)=>{const b=document.createElement('button');b.textContent=o.l;b.disabled=!!(o.ok&&!o.ok());b.onclick=()=>pick(i);box.appendChild(b)})}
  $("roll").hidden=!S.rolling;
  $("rGen").textContent=S.gen;$("rN").textContent=S.rolls;
  $("rRoot").textContent=S.rolled?S.root:"Linh căn chưa xác định";$("rTal").textContent=S.rolled?"Thể chất: "+S.tname:"Thể chất chưa xác định";
  $("rMult").textContent=S.rolled?"Tốc độ tu luyện x"+S.mult+(NOTE[S.tname]?". "+NOTE[S.tname]:"")+(S.tl?" Kết Đan không có bình cảnh.":""):"Hãy chọn linh căn và thể chất của ngươi.";
  $("rAuto").textContent=S.rolled?"Đã chọn":"Chọn linh căn và thể chất";
  $("rAuto").disabled=S.rolled;
  $("rGo").disabled=!S.rolled||!$("nameIn").value.trim();
  $("realm").textContent=REALMS[S.realm];
  $("qi").textContent=S.realm<TOP?"Tu vi "+Math.floor(S.qi)+" / "+max:"Đã phi thăng";
  $("ring").style.setProperty("--p",S.realm<TOP?Math.min(100,S.qi/max*100):100);
  $("pname").textContent=S.name||"";
  $("root").textContent=S.root+", thể chất "+S.tname+" (x"+S.mult+")";
  $("age").textContent=age()+" / "+(S.life>=99999?"∞":S.life);
  $("stone").textContent=S.stone;
  $("legacy").textContent=S.legacy;
  $("gen").textContent=S.gen;
  $("lifebar").style.width=Math.min(100,age()/S.life*100)+"%";
  const full=S.qi>=max&&S.realm<TOP;
  $("bCult").disabled=dead||full||S.realm>=TOP;
  $("bYear").disabled=dead||full||S.realm>=TOP;
  $("bExp").disabled=dead;
  $("bPlant").disabled=dead;
  $("bAlch").disabled=dead||S.herb<3;
  $("bPill").disabled=dead||S.pill<1||full||S.realm>=TOP;
  $("inv").textContent="Linh thảo: "+S.herb+(S.herb?" ("+QN[Math.round(avgQ())]+")":"")+", Tụ Linh Đan: "+S.pill+", Hồi Thương Đan: "+S.heal+", kinh nghiệm luyện đan: "+S.alch+", thương thế: "+["không","nhẹ","nặng"][S.hurt||0];
  $("bHealP").disabled=dead||!S.hurt||S.heal<1;
  $("bAlchH").disabled=dead||S.herb<3;
  $("bAlch").textContent="Luyện Tụ Linh Đan (3 linh thảo, thành công "+Math.round(alchP("qi")*100)+"%)";
  $("bAlchH").textContent="Luyện Hồi Thương Đan (3 linh thảo, thành công "+Math.round(alchP("heal")*100)+"%)";
  $("bPlant").textContent="Thúc linh thảo bằng bình ("+fmtT(plantT())+")";
  $("bPill").textContent="Uống Tụ Linh Đan, tăng tu vi tức thì (có "+S.pill+")";
  $("bHealP").textContent="Uống Hồi Thương Đan, chữa khỏi hẳn (có "+S.heal+")";
  $("bHealS").disabled=dead||!S.hurt||S.stone<2;
  
  
  
  $("bStone").disabled=dead||S.stone<1||S.boost>=3;
  $("bStone").textContent="Linh thạch hộ pháp ("+S.boost+"/3)";
  const p=S.realm<TOP?(S.tl&&S.realm===1?100:Math.max(5,Math.min(95,Math.round((CHANCE[S.realm]+.1*S.boost+.01*S.legacy-.15*(S.hurt||0))*100)))):0;
  $("bBreak").textContent=dead?"Chuyển thế luân hồi":"Đột phá"+(S.realm<TOP?" ("+p+"%)":"");
  $("bBreak").disabled=!dead&&!full;
  $("log").innerHTML=S.log.map(l=>'<p class="'+l.c+'">'+l.t+'</p>').join("");
}
$("bCult").onclick=()=>{cult(1);render();save()};
$("bYear").onclick=()=>{cult(12);render();save()};
$("bExp").onclick=()=>{explore();render();save()};
$("bPlant").onclick=()=>{plant();render();save()};
$("rAuto").onclick=toggleRoll;
$("rGo").onclick=startLife;
$("fxok").onclick=fxClose;
$("nameIn").oninput=render;
$("bHealP").onclick=()=>{healPill();render();save()};
$("bHealS").onclick=()=>{healStone();render();save()};
$("bAlch").onclick=()=>{alchemy("qi");render();save()};
$("bAlchH").onclick=()=>{alchemy("heal");render();save()};
$("bPill").onclick=()=>{eatPill();render();save()};
$("bStone").onclick=()=>{useStone();render();save()};
$("bBreak").onclick=()=>{if(S.dead)reborn();else if(!tribuOn){tribuOn=true;stopAuto();tribulation()}};
$("bReset").onclick=()=>{if(!resetArm){resetArm=true;$("bReset").textContent="Bấm lần nữa để xác nhận";setTimeout(()=>{resetArm=false;$("bReset").textContent="Chơi lại từ đầu"},3000);return}resetArm=false;$("bReset").textContent="Chơi lại từ đầu";stopAuto();stopRoll();S=newLife(0,1);render();save()};
S=null;
if(!S||!S.root||S.rolls===undefined){S=newLife(0,1)}
setTimeout(startAuto,0);
render();
