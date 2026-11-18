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
function plant(){
  if(S.dead)return;
  S.herb+=2;
  say("Nhỏ vài giọt dịch từ chiếc bình nhỏ, sáu tháng sau thu được 2 gốc linh thảo.","g");
  advance(6);
}
function alchemy(){
  if(S.dead||S.herb<3)return;
  S.herb-=3;
  const p=Math.min(.9,.5+.05*S.alch);
  if(Math.random()<p){S.pill++;S.alch++;say("Luyện đan thành công, được 1 viên đan dược (xác suất "+Math.round(p*100)+"%).","g")}
  else say("Lò đan nổ tung, mất 3 gốc linh thảo (xác suất "+Math.round(p*100)+"%).","b");
  advance(2);
}
function eatPill(){
  if(S.dead||S.pill<1||S.realm>=TOP||S.qi>=need())return;
  S.pill--;
  const q=gain()*15;
  S.qi=Math.min(need(),S.qi+q);
  say("Uống đan dược, tu vi tăng "+q+".","g");
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
  S.name=($("nameIn").value.trim()||"Vô Danh").slice(0,20);stopRoll();S.rolling=false;setTimeout(startAuto,0);
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
  $("rGo").disabled=!S.rolled;
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
  $("inv").textContent="Linh thảo: "+S.herb+", đan dược: "+S.pill+", kinh nghiệm luyện đan: "+S.alch+", thương thế: "+["không","nhẹ","nặng"][S.hurt||0];
  $("bHealP").disabled=dead||!S.hurt||S.pill<1;
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
$("bHealP").onclick=()=>{healPill();render();save()};
$("bHealS").onclick=()=>{healStone();render();save()};
$("bAlch").onclick=()=>{alchemy();render();save()};
$("bPill").onclick=()=>{eatPill();render();save()};
$("bStone").onclick=()=>{useStone();render();save()};
$("bBreak").onclick=()=>{if(S.dead)reborn();else{breakthrough();render();save();startAuto()}};
$("bReset").onclick=()=>{if(!resetArm){resetArm=true;$("bReset").textContent="Bấm lần nữa để xác nhận";setTimeout(()=>{resetArm=false;$("bReset").textContent="Chơi lại từ đầu"},3000);return}resetArm=false;$("bReset").textContent="Chơi lại từ đầu";stopAuto();stopRoll();S=newLife(0,1);render();save()};
S=null;
if(!S||!S.root||S.rolls===undefined){S=newLife(0,1)}
setTimeout(startAuto,0);
render();
