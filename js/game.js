// ===== VÒNG LẶP GAME: tu luyện, đột phá, luyện đan, lưu, hiển thị, nút bấm =====
const KEY="tutien_save_v2";
let S,auto=null;
const $=id=>document.getElementById(id);
const rnd=n=>Math.floor(Math.random()*n);
// Nạp tiến trình đã lưu: kiểm tra dữ liệu hợp lệ rồi trộn vào nhân vật mới để thiếu trường nào cũng tự có giá trị mặc định.
function sane(o){return o&&typeof o==='object'&&typeof o.root==='string'&&Number.isFinite(o.m)&&Number.isFinite(o.qi)&&Number.isFinite(o.life)&&Number.isInteger(o.realm)&&o.realm>=0&&o.realm<=TOP&&Array.isArray(o.log)}
function load(){
  try{
    const v=localStorage.getItem(KEY);if(!v)return null;
    const o=JSON.parse(v);if(!sane(o))return null;
    const s=Object.assign(newLife(o.legacy||0,o.gen||1),o);
    if(!s.bdp||typeof s.bdp!=='object')s.bdp={};
    if(s.realm<TOP)s.qi=Math.min(s.qi,24*Math.pow(3,s.realm)*NEEDT[s.realm]);
    if(s.ev!=null&&!(s.ev>=0&&s.ev<EV.length))s.ev=null;
    return s;
  }catch(e){return null}
}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function say(t,c){S.log.unshift({t:t,c:c||""});S.log=S.log.slice(0,40)}
function advance(months){
  S.m+=months;if(S.hurt>0){S.hm=(S.hm||0)+months*(S.tname==='Tự Trị Chi Thể'?2:1);if(S.hm>=(S.hurt==2?60:36)){S.hurt--;S.hm=0;say('Thương thế đã thuyên giảm theo thời gian.','g')}}S.evT=(S.evT===undefined?nextEv():S.evT)-months;S.pT=(S.pT===undefined?nextP():S.pT)-months;if(S.pT<=0&&age()<S.life){S.pT=nextP();passive()}if(age()<S.life&&S.ev==null&&S.evT<=0)raiseEvent();
  if(age()>=S.life)die();
}
function die(msg){S.ev=null;
  stopAuto();
  S.dead=true;
  const pts=S.realm*3+1;
  S.pts=pts;S.dmsg=msg||('Thọ nguyên cạn kiệt, ngươi tọa hóa ở tuổi '+age()+'.');
  say(S.dmsg+' Cảnh giới: '+REALMS[S.realm]+'. Nhận '+pts+' đạo duyên.','b');
  S.legacy+=pts;
  setTimeout(()=>deathCard(),0);
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
  if(S.ev==null&&Math.random()<.5)raiseEvent();else{const s0=S.stone;EVENTS[rnd(EVENTS.length)]();stoneBonus(s0)}
  advance(3);
}
function useStone(){
  const c=ptCost();
  if(S.dead||S.realm>=TOP||S.stone<c||S.boost>=3)return;
  S.stone-=c;S.boost++;
  say("Bày "+PT[Math.min(S.realm,8)]+" (tầng "+S.boost+"/3), tốn "+c+" linh thạch, xác suất đột phá +10%.","g");
}
function breakthrough(){
  if(S.dead||!canBreak())return;
  S.bdp[S.realm]--;
  const p=(S.tl&&S.realm===1)?1:Math.max(.05,Math.min(.95,CHANCE[S.realm]+.1*S.boost+.01*S.legacy-.15*(S.hurt||0)));
  S.boost=0;
  if(Math.random()<p){
    S.realm++;S.qi=0;S.fails=0;
    S.life=Math.max(S.life,LIFE[S.realm]);
    if(S.realm===TOP){
      const pts=TOP*3+1+15;S.legacy+=pts;S.pts=pts;S.dmsg='Ngươi vượt qua thiên kiếp cuối cùng và phi thăng tiên giới!'; // = phần thưởng chết ở cảnh giới cao nhất + 15 thưởng phi thăng
      say("Thiên kiếp giáng xuống, ngươi vượt qua tất cả và phi thăng tiên giới! Nhận "+pts+" đạo duyên. Bắt đầu kiếp mới để tiếp tục.","y");
      S.dead=true;stopAuto();
    }else say("Đột phá thành công! Ngươi đã đạt cảnh giới "+REALMS[S.realm]+".","y");
  }else{
    // Thất bại: cảnh giới càng cao, hậu quả càng nặng.
    // Tổn thọ: 5 + realm*5 năm (Luyện Khí 5, Trúc Cơ 10, Kết Đan 15 ... Độ Kiếp 45).
    // Từ Hóa Thần (realm>=4) có thể sinh tâm ma → chết ngay.
    // Từ Đại Thừa (realm>=7) xác suất tử vong do tâm ma rất cao.
    S.fails=(S.fails||0)+1;
    const lostYears=5+S.realm*5;                       // năm thọ nguyên mất
    const qiLoss=Math.min(.7,.7-.03*S.realm);           // mất 30-57% tu vi
    S.qi=Math.floor(S.qi*qiLoss);
    S.m+=lostYears*12;                                  // cộng thẳng vào tuổi
    hurtUp(S.tname==='Bất Diệt Chi Thể'?1:2);

    // Tâm ma: cảnh giới càng cao, nguy hiểm càng lớn.
    // realm 0-3: không có tâm ma đột tử, chỉ tích lũy fails.
    // realm 4-5 (Hóa Thần, Luyện Hư): 10-15% tâm ma nhập thể → chết ngay.
    // realm 6 (Hợp Thể): 20% tâm ma.
    // realm 7-8 (Đại Thừa, Độ Kiếp): 25-35% tâm ma → chết ngay.
    const tmChance=S.realm<=3?0:S.realm<=5?(.05+S.realm*.025):S.realm===6?.20:(.15+S.realm*.025);
    const tmDeath=tmChance>0&&Math.random()<tmChance;

    if(tmDeath){
      die('💀 Đột phá thất bại! Lôi kiếp phản phệ, tâm ma nhập thể, thần hồn câu diệt! Ngươi tọa hóa tại cảnh giới '+REALMS[S.realm]+'.');
    }else{
      let msg='💥 Đột phá thất bại! Lôi kiếp phản phệ, kinh mạch trọng thương, tổn hao '+lostYears+' năm thọ nguyên!';
      if(S.realm>=4)msg+=' Tâm ma rung động, đạo tâm bất ổn!';
      msg+=' (Thất bại lần '+S.fails+'/3)';
      say(msg,'b');
      if(S.fails>=3)die('Lôi kiếp giáng thế, kinh mạch đan điền vỡ vụn, tâm ma thôn phệ, thân vẫn đạo tiêu!');
      else if(age()>=S.life)die();
    }
  }
}
function eatPill(){
  if(S.dead||S.pill<1||S.realm>=TOP||S.qi>=need())return;
  S.pill--;
  const q=Math.min(Math.floor(need()*0.15),need()-S.qi); // 15% lượng tu vi tối đa của cảnh giới hiện tại
  S.qi+=q;
  say("Uống Tụ Linh Đan, tu vi tăng "+q.toLocaleString('vi-VN')+".","g");
}
let rt=null,resetArm=false;
function stopRoll(){if(rt){clearInterval(rt);rt=null}}
function toggleRoll(){
  if(rt){stopRoll();render();return}if(S.rolled)return;
  S.rolled=true;
  reroll();
  render();save();   // lưu ngay: F5 không thể chọn lại linh căn
}
function startLife(){
  S.name=$("nameIn").value.trim().slice(0,20);if(!S.name)return;stopRoll();S.rolling=false;setTimeout(startAuto,0);
  say(S.name+" là thiếu niên 16 tuổi, sinh ra với "+S.root+", thể chất "+S.tname+" (x"+S.mult+"). Trong tay có chiếc bình nhỏ màu xanh kỳ lạ, có thể thúc linh thảo mau lớn. Hãy sống sót và tu tiên.","y");
  render();save();
}
function stopAuto(){if(auto){clearInterval(auto);auto=null}}
function startAuto(){if(auto||S.dead||S.rolling||S.ev!=null||fxBusy)return;if(S.realm<TOP&&S.qi>=need())return;auto=setInterval(()=>{cult(STEP());render();save()},AUTOMS());render()}
function toggleAuto(){
  if(auto){stopAuto()}else startAuto();
  render();
}
function render(){
  const dead=S.dead,max=S.realm<TOP?need():1;
  const hasEv=S.ev!=null&&!S.dead;
  $("ev").hidden=!hasEv;
  if(hasEv){const e=EV[S.ev];$("evT").textContent=e.t;
    const im=$("evim");im.hidden=!e.img;if(e.img&&im.dataset.k!==e.img){im.src=IMG[e.img];im.dataset.k=e.img}const box=$("evO");box.innerHTML='';e.o.forEach((o,i)=>{const b=document.createElement('button');b.textContent=o.l;b.disabled=!!(o.ok&&!o.ok());b.onclick=()=>pick(i);box.appendChild(b)})}
  $("roll").hidden=!S.rolling;
  $("rCont").hidden=!(SAVED&&S.rolling&&!S.rolled);
  $("rGen").textContent=S.gen;$("rN").textContent=S.rolls;
  $("rRoot").textContent=S.rolled?S.root:"Linh căn chưa xác định";$("rTal").textContent=S.rolled?"Thể chất: "+S.tname:"Thể chất chưa xác định";
  $("rMult").textContent=S.rolled?"Tốc độ tu luyện x"+S.mult+(NOTE[S.tname]?". "+NOTE[S.tname]:"")+(S.tl?" Kết Đan không có bình cảnh.":""):"Hãy chọn linh căn và thể chất của ngươi.";
  $("rAuto").textContent=S.rolled?"Đã chọn":"Chọn linh căn và thể chất";
  $("rAuto").disabled=S.rolled;
  $("rGo").disabled=!S.rolled||!$("nameIn").value.trim();
  $("realm").textContent=REALMS[S.realm];
  $("qi").textContent=S.realm<TOP?"Tu vi "+Math.floor(S.qi).toLocaleString("vi-VN")+" / "+max.toLocaleString("vi-VN"):"Đã phi thăng";
  $("ring").style.setProperty("--p",S.realm<TOP?Math.min(100,S.qi/max*100):100);
  $("pname").textContent=S.name||"";
  $("root").textContent=S.root+", thể chất "+S.tname+" (x"+S.mult+")";
  $("age").textContent=age()+" / "+(S.life>=99999?"∞":S.life);
  $("stone").textContent=S.stone;
  $("legacy").textContent=S.legacy;
  $("gen").textContent=S.gen;
  $("lifebar").style.width=Math.min(100,age()/S.life*100)+"%";
  const warn=!dead&&S.life<99999&&S.life-age()<=5;
  $("lifebar").classList.toggle("warn",warn);$("age").classList.toggle("warn",warn);
  const full=S.qi>=max&&S.realm<TOP;
  $("bCult").disabled=dead||full||S.realm>=TOP;
  $("bYear").disabled=dead||full||S.realm>=TOP;
  $("bCult").textContent="Tu luyện ("+fmtT(STEP())+")";
  $("bYear").textContent="Bế quan ("+(S.realm>=1?"5":"1")+" năm)";
  $("bYear10").hidden=S.realm<1;
  $("bYear10").disabled=dead||full||S.realm>=TOP;
  $("bExp").disabled=dead;
  $("bPlant").disabled=dead;
  $("bAlch").disabled=dead||S.herb<3;
  $("inv").textContent="Linh thảo: "+S.herb+(S.herb?" ("+QN[Math.round(avgQ())]+")":"")+", Tụ Linh Đan: "+S.pill+", Hồi Thương Đan: "+S.heal+", kinh nghiệm luyện đan: "+S.alch+", thương thế: "+["không","nhẹ","nặng"][S.hurt||0];
  $("bAlchH").disabled=dead||S.herb<3;
  $("bAlchB").hidden=S.realm>=TOP;
  $("bAlchB").disabled=dead||S.realm>=TOP||S.herb<bdHerbs();
  if(S.realm<TOP)$("bAlchB").textContent="Luyện "+BDAN[S.realm]+" ("+bdHerbs()+" linh thảo, thành công "+Math.round(alchP("bd")*100)+"%, để đột phá)";
  $("bAlch").textContent="Luyện Tụ Linh Đan (3 linh thảo, thành công "+Math.round(alchP("qi")*100)+"%)";
  $("bAlchH").textContent="Luyện Hồi Thương Đan (3 linh thảo, thành công "+Math.round(alchP("heal")*100)+"%)";
  $("bPlant").textContent="Thúc linh thảo bằng bình ("+fmtT(plantT())+")";
  $("bHealS").disabled=dead||!S.hurt||S.stone<2;
  $("bBag").disabled=S.rolling;
  
  
  
  $("bStone").disabled=dead||S.realm>=TOP||S.stone<ptCost()||S.boost>=3;
  $("bStone").textContent=S.realm>=TOP?"Pháp trận":"Bày "+PT[Math.min(S.realm,8)]+" ("+ptCost()+" linh thạch, tầng "+S.boost+"/3"+(needPT()?", bắt buộc":"")+")";
  const p=S.realm<TOP?(S.tl&&S.realm===1?100:Math.max(5,Math.min(95,Math.round((CHANCE[S.realm]+.1*S.boost+.01*S.legacy-.15*(S.hurt||0))*100)))):0;
  $("bBreak").textContent=dead?"Chuyển thế luân hồi":"Đột phá"+(S.realm<TOP?" ("+p+"%)":"")+(S.fails?" - thất bại "+S.fails+"/3"+(S.fails>=2?", nguy hiểm!":""):"");
  $("bBreak").disabled=!dead&&!canBreak();
  const hint=$("brkHint");
  if(dead||S.realm>=TOP)hint.textContent="";
  else{const okp=bdHave()>=1,okt=!needPT()||S.boost>=1;
    hint.textContent="Điều kiện đột phá: tu vi "+(full?"đủ":"chưa đủ")+"; "+BDAN[S.realm]+" "+bdHave()+"/1"+(needPT()?"; "+PT[S.realm]+" tầng "+S.boost+"/1":"");
    hint.style.color=(full&&okp&&okt)?"var(--jade)":"var(--seal)"}
  $("log").innerHTML=S.log.map(l=>'<p class="'+l.c+'">'+l.t+'</p>').join("");
}
$("bCult").onclick=()=>{cult(STEP());render();save()};
$("bYear").onclick=()=>{
  const go=()=>bequan(S.realm>=1?60:12);
  if(S.life<99999&&S.life-age()<=5)askConfirm('Thọ nguyên sắp cạn kiệt, bế quan có nguy cơ tọa hóa! Bạn có chắc chắn muốn bế quan không?',go,'Vẫn bế quan','Hủy');
  else go();
};
$("bYear10").onclick=()=>{
  const go=()=>bequan(120);
  if(S.life<99999&&S.life-age()<=10)askConfirm('Thọ nguyên còn không quá 10 năm, bế quan 10 năm có nguy cơ tọa hóa! Bạn có chắc chắn muốn bế quan không?',go,'Vẫn bế quan','Hủy');
  else go();
};
$("bExp").onclick=()=>thamhiem();
$("bPlant").onclick=()=>{plant();render();save()};
$("rAuto").onclick=toggleRoll;
$("rGo").onclick=startLife;
$("rCont").onclick=()=>{if(!SAVED)return;S=SAVED;SAVED=null;S.rolling=false;S.deathShown=false;stopRoll();fxBusy=false;render();save();startAuto();if(S.dead)deathCard()};
$("fxok").onclick=fxClose;
$("nameIn").oninput=render;
$("bHealS").onclick=()=>{healStone();render();save()};
$("bAlch").onclick=()=>{alchemy("qi");render();save()};
$("bAlchH").onclick=()=>{alchemy("heal");render();save()};
$("bAlchB").onclick=()=>{alchemy("bd");render();save()};
$("bStone").onclick=()=>{useStone();render();save()};
$("bBreak").onclick=()=>{if(S.dead)reborn();else if(!tribuOn&&canBreak()){tribuOn=true;stopAuto();tribulation()}};
$("bReset").onclick=()=>{if(!resetArm){resetArm=true;$("bReset").textContent="Bấm lần nữa để xác nhận";setTimeout(()=>{resetArm=false;$("bReset").textContent="Chơi lại từ đầu"},3000);return}resetArm=false;$("bReset").textContent="Chơi lại từ đầu";stopAuto();stopRoll();S=newLife(0,1);render();save()};
S=load();
if(!S||!S.root||S.rolls===undefined){S=newLife(0,1)}
// Bản lưu gần nhất (nếu hợp lệ) được đưa ra làm lựa chọn 'Tiếp tục'; mặc định vẫn là bắt đầu đời mới.
let SAVED=(()=>{try{const v=load();return v&&typeof v.m==='number'&&v.root&&v.name&&v.rolls!==undefined&&v.heal!==undefined&&v.pill!==undefined&&v.herb!==undefined&&typeof v.life==='number'&&v.realm>=0&&v.realm<=TOP&&!v.rolling?v:null}catch(e){return null}})();
if(SAVED)$("rCont").textContent='Tiếp tục: '+SAVED.name+' ('+REALMS[SAVED.realm]+', '+Math.floor(SAVED.m/12)+' tuổi'+(SAVED.dead?', đã hết kiếp':'')+')';
if(S.name)$("nameIn").value=S.name;
addEventListener("pagehide",save);document.addEventListener("visibilitychange",()=>{if(document.hidden)save()});
save();
setTimeout(startAuto,0);
render();
