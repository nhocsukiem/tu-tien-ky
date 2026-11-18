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
const NOTE={'Tam Dương Chi Thể':'Tư chất chỉ dưới thiên linh căn.','Cửu Linh Kiếm Thể':'Một trong ba đại kiếm tu linh thể.','Đoán Kim Chi Thể':'Cực hợp công pháp thuộc tính kim.','Thổ Linh Chi Thể':'Giỏi công pháp thổ độn.','Tự Trị Chi Thể':'Thương thế hồi phục nhanh gấp đôi.','Bất Diệt Chi Thể':'Đột phá thất bại không bao giờ bị trọng thương hay hư căn cơ.'};
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
  return {m:16*12,realm:0,qi:0,stone:0,herb:0,pill:0,heal:0,alch:0,boost:0,root:r.root,tname:r.tname,mult:r.mult,tl:r.tl,rolling:true,rolled:false,rolls:1,legacy:legacy,gen:gen,life:LIFE[0],dead:false,log:[]};
}
const need=()=>100*Math.pow(4,S.realm);
const gain=()=>Math.max(1,Math.round(2*Math.pow(3,S.realm)*S.mult*(1+.05*S.legacy)*[1,.6,.3][S.hurt||0]));
const age=()=>Math.floor(S.m/12);
function reroll(){const r=rollTraits();S.root=r.root;S.tname=r.tname;S.mult=r.mult;S.tl=r.tl;S.rolls++}
function hurtUp(n){S.hurt=Math.max(S.hurt||0,n);S.hm=0}
function healPill(){if(S.dead||!S.hurt||S.heal<1)return;S.heal--;S.hurt=0;S.hm=0;say('Uống Hồi Thương Đan, thương thế đã khỏi hẳn.','g')}
function healStone(){if(S.dead||!S.hurt||S.stone<2)return;S.stone-=2;S.hurt--;S.hm=0;say('Dùng linh thạch hóa giải ám thương, thương thế giảm một bậc.','g')}
