// ===== NHÂN VẬT: cảnh giới, thọ nguyên, linh căn, thể chất, thương thế =====
// Sửa REALMS/LIFE/CHANCE để đổi cảnh giới (mỗi mảng phải cùng thứ tự; CHANCE ít hơn REALMS một phần tử).
// Sửa BODIES (tên, hệ số tốc độ) và rollTraits() để đổi tỉ lệ linh căn, thể chất.
// Tỉ lệ hiện tại: Ngụy 60%, Chân 33%, Biến dị 5%, Thiên 2%; thể chất đặc biệt 15%.
const REALMS=["Luyện Khí","Trúc Cơ","Kết Đan","Nguyên Anh","Hóa Thần","Luyện Hư","Hợp Thể","Đại Thừa","Độ Kiếp","Phi Thăng"];
const TOP=9;
const LIFE=[120,250,500,1000,2000,4000,8000,16000,30000,99999];
const CHANCE=[.7,.6,.5,.45,.4,.35,.3,.25,.2];
const EL=['Kim','Mộc','Thủy','Hỏa','Thổ'];
const MUT=['Lôi','Băng','Ám','Phong'];
const BODIES=[['Tam Dương Chi Thể',1.5],['Cửu Linh Kiếm Thể',1.4],['Đoán Kim Chi Thể',1.2],['Thổ Linh Chi Thể',1.2],['Tự Trị Chi Thể',1],['Bất Diệt Chi Thể',1]];
const NOTE={'Tam Dương Chi Thể':'Tư chất chỉ dưới thiên linh căn.','Cửu Linh Kiếm Thể':'Một trong ba đại kiếm tu linh thể.','Đoán Kim Chi Thể':'Cực hợp công pháp thuộc tính kim.','Thổ Linh Chi Thể':'Giỏi công pháp thổ độn.','Tự Trị Chi Thể':'Thương thế hồi phục nhanh gấp đôi.','Bất Diệt Chi Thể':'Đột phá thất bại chỉ bị thương nhẹ, không bao giờ bị trọng thương.'};
function pickEl(n){const a=EL.slice(),r=[];while(r.length<n)r.push(a.splice(rnd(a.length),1)[0]);return r.join(', ')}
function rollTraits(){
  const x=Math.random();let name,m,tl=false;
  if(x<.60){name='Ngụy linh căn ('+pickEl(4+rnd(2))+')';m=.6}
  else if(x<.93){name='Chân linh căn ('+pickEl(2+rnd(2))+')';m=1.2}
  else if(x<.98){name='Biến dị linh căn ('+MUT[rnd(4)]+')';m=2}
  else{name='Thiên linh căn ('+pickEl(1)+')';m=2.2;tl=true}
  const b=Math.random()<.15?BODIES[rnd(BODIES.length)]:null;
  return {root:name,tname:b?b[0]:'Phàm thể',mult:Math.round(m*(b?b[1]:1)*100)/100,tl:tl};
}
function newLife(legacy,gen){
  const r=rollTraits();
  return {m:16*12,realm:0,qi:0,stone:0,bdp:{},herb:0,pill:0,heal:0,alch:0,boost:0,root:r.root,tname:r.tname,mult:r.mult,tl:r.tl,rolling:true,rolled:false,rolls:1,legacy:legacy,gen:gen,life:LIFE[0],dead:false,log:[]};
}
// Số năm cần để tu hết một cảnh giới với tốc độ x1 (tương ứng thọ nguyên: cảnh giới càng cao càng lâu).
// Linh căn/thể chất tốt (hệ số > 1) rút ngắn thời gian này; càng lên cao thiên phú càng quyết định (số mũ tăng theo cảnh giới).
const NEEDT=[50,120,250,500,1000,2000,4000,8000,14000,1];
const need=()=>24*Math.pow(3,S.realm)*NEEDT[Math.min(S.realm,9)];
const gain=()=>Math.max(.5,2*Math.pow(3,S.realm)*Math.pow(S.mult,1+.12*S.realm)*(1+.05*S.legacy)*[1,.6,.3][S.hurt||0]);
// Mỗi lần tu luyện (nút và tự chạy) trôi bao nhiêu tháng: Luyện Khí 1 tháng, Trúc Cơ 1 năm, Hóa Thần 5 năm, Luyện Hư trở lên 10 năm.
const STEP=()=>S.realm<1?1:S.realm<4?12:S.realm<6?60:120;
const AUTOMS=()=>S.realm<1?300:450;
const age=()=>Math.floor(S.m/12);
function reroll(){const r=rollTraits();S.root=r.root;S.tname=r.tname;S.mult=r.mult;S.tl=r.tl;S.rolls++}
function hurtUp(n){S.hurt=Math.max(S.hurt||0,n);S.hm=0}
// Tâm ma tích lũy: mỗi lần đột phá thất bại tăng S.fails (đủ 3 lần thì tọa hóa).
// Giảm 1 lần khi bế quan tĩnh dưỡng đủ 10 năm (restTrack) hoặc uống Hồi Thương Đan lúc không bị thương.
function calmMind(){
  if(!(S.fails>0))return false;
  S.fails--;
  say('Kinh mạch vững vàng, tâm ma tan đi, giảm 1 lần tích lũy thất bại lôi kiếp.','g');
  return true;
}
function restTrack(months){
  S.restM=(S.restM||0)+months;
  while(S.restM>=120){
    if(S.fails>0){S.restM-=120;calmMind()}
    else{S.restM=120;break}
  }
}
function healPill(){
  if(S.dead||S.heal<1)return;
  if(S.hurt){S.heal--;S.hurt=0;S.hm=0;say('Uống Hồi Thương Đan, thương thế đã khỏi hẳn.','g');return}
  if(S.fails>0){S.heal--;say('Uống Hồi Thương Đan lúc kinh mạch không bị thương, dược lực dưỡng mạch.','g');calmMind()}
}
function healStone(){if(S.dead||!S.hurt||S.stone<2)return;S.stone-=2;S.hurt--;S.hm=0;say('Dùng linh thạch hóa giải ám thương, thương thế giảm một bậc.','g')}

// ===== ĐAN ĐỘT PHÁ + PHÁP TRẬN =====
// Muốn lên cảnh giới kế tiếp phải có đúng đan đột phá của cảnh giới đó (tự luyện, mỗi viên tốn linh thảo).
// Từ Trúc Cơ trở đi còn bắt buộc bày pháp trận (ít nhất 1 tầng) bằng linh thạch; cảnh giới càng cao pháp trận càng cao cấp và càng tốn nhiều linh thạch.
// Mỗi tầng pháp trận cộng thêm 10% xác suất đột phá (tối đa 3 tầng). Pháp trận tiêu hao sau mỗi lần đột phá.
const BDAN=['Trúc Cơ Đan','Kết Kim Đan','Ngưng Anh Đan','Hóa Thần Đan','Luyện Hư Đan','Hợp Thể Đan','Đại Thừa Đan','Độ Kiếp Đan','Phi Thăng Đan'];
const PT=['Hộ Pháp Trận','Tụ Linh Trận','Thanh Liên Trận','Ngũ Hành Đại Trận','Lục Hợp Thiên Trận','Bát Quái Thần Trận','Cửu Cung Linh Trận','Chu Thiên Tinh Đấu Trận','Thiên Cương Đại Trận'];
const PTCOST=[1,4,6,9,13,18,25,34,45];            // linh thạch cho mỗi tầng pháp trận
const ptCost=()=>PTCOST[Math.min(S.realm,8)];
const needPT=()=>S.realm>=1;                       // từ Trúc Cơ pháp trận là bắt buộc
const bdHerbs=()=>3+2*S.realm;                     // linh thảo cho mỗi lần luyện đan đột phá
const bdHave=()=>(S.bdp&&S.bdp[S.realm])||0;       // số đan đột phá đang có cho cảnh giới kế tiếp
function canBreak(){return S.realm<TOP&&S.qi>=need()&&bdHave()>=1&&(!needPT()||S.boost>=1)}
