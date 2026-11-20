// ===== THÚC LINH THẢO & LUYỆN ĐAN: hiệu ứng, màn hình kết quả, tỉ lệ thành công =====
const HERBN=['Thanh Nguyên Thảo','Tử Tâm Thảo','Hỏa Linh Chi','Băng Phách Liên','Cửu Diệp Linh Chi','Tinh Hà Thảo','Vạn Niên Chi','Hỗn Nguyên Thảo','Thiên Tâm Bảo Dược'];
const QN=['Hạ phẩm','Trung phẩm','Thượng phẩm','Cực phẩm','Biến dị'];
const QC=['154,170,160','90,200,140','90,170,255','255,200,70','230,90,255'];
// Quy luật thời gian thúc linh thảo (giữ nguyên): 1 tuần ở Luyện Khí, gấp đôi mỗi cảnh giới.
const herbAge=()=>9000*Math.pow(2,S.realm);
const plantT=()=>0.25*Math.pow(2,S.realm);
function fmtT(m){if(m<1)return Math.max(1,Math.round(m*4))+' tuần';if(m<12)return (Math.round(m*10)/10)+' tháng';return (Math.round(m/12*10)/10)+' năm'}
// Kho linh thảo: S.herb là số lượng, S.hqs là tổng điểm phẩm chất (0 Hạ ... 4 Biến dị) để tính phẩm chất trung bình.
function addHerb(n,q){S.herb+=n;S.hqs=(S.hqs||0)+n*q}
function avgQ(){return S.herb>0?Math.max(0,Math.min(4,(S.hqs||0)/S.herb)):1}
// Đan dược: g là độ khó (phẩm cấp càng cao càng khó luyện). Công dụng đan không đổi.
const DAN={qi:{n:'Tụ Linh Đan',g:1,rank:'Nhất phẩm'},heal:{n:'Hồi Thương Đan',g:2,rank:'Nhị phẩm'}};
const TQ=['Thường','Thượng phẩm','Cực phẩm','Dị tượng'];
// Đan đột phá (k='bd') là đan cấp cao nhất của cảnh giới nên khó nhất: độ khó tăng gấp đôi theo cảnh giới.
function alchP(k){const G=k==='bd'?2+2*S.realm:DAN[k].g;return Math.max(.15,Math.min(.92,.45+.05*S.alch+.06*(avgQ()-1)-.04*(G-1)-.02*S.realm))}

// ---------- hình vẽ từng giai đoạn ----------
function plantArt(col){return i=>{
  const h=[0,26,58,90,104][i],n=[0,2,4,6,8][i];let lv='';
  for(let k=0;k<n;k++){const y=205-h*(k+1)/(n+1)-8,s=k%2?1:-1,r=26+i*3,x=120+s*r*.6;lv+=`<ellipse cx="${x}" cy="${y}" rx="${r*.55}" ry="${r*.22}" transform="rotate(${-s*28} ${x} ${y})" fill="rgb(${col})" opacity=".9"/>`}
  const stem=i===0?'<ellipse cx="120" cy="204" rx="7" ry="5" fill="#8a6a3a"/>':`<path d="M120 206 L120 ${206-h}" stroke="rgb(${col})" stroke-width="4" stroke-linecap="round"/>`;
  const aura=i>=2?`<circle class="pulse" cx="120" cy="${200-h/2}" r="${40+i*10}" fill="rgba(${col},.18)"/>`:'';
  const pts=[0,1,2,3,4,5,6].map(k=>`<circle class="pt" style="animation-delay:${k*.25}s" cx="${70+k*17}" cy="200" r="2.5" fill="rgb(${col})"/>`).join('');
  return `<svg viewBox="0 0 240 240">${aura}<ellipse cx="120" cy="214" rx="78" ry="12" fill="#2a2418"/>${stem}${lv}${pts}<path d="M32 150 q-14 20 0 44 h40 q14-24 0-44 z" fill="#b08a3c"/><rect x="40" y="140" width="24" height="12" rx="3" fill="#8a6a2c"/><circle class="pulse" cx="52" cy="172" r="${10+i*3}" fill="rgba(${col},.55)"/></svg>`}}
function furnaceArt(i){
  const fl=[1,1.15,1.35,1.5][i];
  const lf=i>=1?[0,1,2].map(k=>`<ellipse class="lf" style="animation-delay:${k*.2}s" cx="${100+k*20}" cy="40" rx="9" ry="4" fill="#6c9"/>`).join(''):'';
  const sm=i>=2?[0,1,2].map(k=>`<circle class="pt" style="animation-delay:${k*.3}s" cx="${105+k*15}" cy="120" r="${8+k*3}" fill="rgba(190,170,230,.5)"/>`).join(''):'';
  return `<svg viewBox="0 0 240 240">${lf}<g class="flame" style="transform-origin:120px 150px;transform:scale(${fl})"><path d="M120 150 C90 120 110 100 118 70 C128 100 150 120 120 150Z" fill="#f80"/><path d="M120 150 C105 130 115 118 120 100 C127 118 136 130 120 150Z" fill="#fd5"/></g>${sm}<path d="M62 150 h116 q4 46 -30 58 h-56 q-34-12 -30-58z" fill="#3d5a52" stroke="#c9a24b" stroke-width="3"/><rect x="56" y="144" width="128" height="10" rx="4" fill="#4d7066" stroke="#c9a24b" stroke-width="2"/><path d="M78 208 l-8 20 M162 208 l8 20" stroke="#c9a24b" stroke-width="5" stroke-linecap="round"/></svg>`}


// ---------- thúc linh thảo bằng bình nhỏ ----------
function plant(){
  if(S.dead||fxBusy)return;
  const t=plantT(),yrs=herbAge(),name=HERBN[Math.min(S.realm,HERBN.length-1)];
  const rq=()=>{const r=Math.random();return r<.03?4:r<.10?3:r<.30?2:r<.65?1:0};
  const q=[rq(),rq()],best=Math.max(q[0],q[1]);
  S.herb+=2;S.hqs=(S.hqs||0)+q[0]+q[1];
  say('Thu hoạch '+name+' ('+QN[q[0]]+', '+QN[q[1]]+'), '+yrs.toLocaleString('vi-VN')+' năm tuổi, sau '+fmtT(t)+' thúc bằng bình nhỏ.',best>=3?'y':'g');
  advance(t);
  fxShow(plantArt(QC[best]),['Gieo hạt xuống đất...','Dịch trong bình nhỏ thấm xuống, hạt nảy mầm...','Cây vươn lên, linh khí cuồn cuộn quanh bình...','Linh thảo trưởng thành, ánh sáng lan tỏa...','Thu hoạch linh thảo!'],
    {img:best>=3?'herb':'ltTruong',card:best<3,glow:QC[best],filter:'hue-rotate('+(S.realm*35)+'deg) saturate('+(1+best*.12)+')',title:best===4?'Linh thảo biến dị xuất hiện!':'Thu hoạch thành công!',
     lines:['Linh thảo: '+name,'Tuổi cây: '+yrs.toLocaleString('vi-VN')+' năm','Phẩm chất: '+QN[q[0]]+' và '+QN[q[1]],'Số lượng nhận được: 2 gốc','Thời gian thúc: '+fmtT(t)].concat(best===4?['Dị biến: linh thảo tỏa ánh bảy sắc, dược lực khác thường.']:[])});
}

// ---------- luyện đan ----------
function alchemy(kind){
  kind=kind||'qi';
  const H=kind==='bd'?bdHerbs():3;
  if(S.dead||fxBusy||S.herb<H||(kind==='bd'&&S.realm>=TOP))return;
  const D=kind==='bd'?{n:BDAN[S.realm],g:2+2*S.realm,rank:'Đan đột phá'}:DAN[kind],p=alchP(kind),aq=avgQ();
  S.hqs=Math.max(0,(S.hqs||0)-H*aq);S.herb-=H;
  const ok=Math.random()<p,use='Tiêu hao: '+H+' linh thảo (phẩm chất trung bình: '+QN[Math.round(aq)]+')',rate='Tỉ lệ thành công: '+Math.round(p*100)+'%';
  const caps=['Nhóm linh hỏa dưới lò đan...','Đưa linh thảo vào lò...','Dược lực ngưng tụ, đan khí cuồn cuộn...','Mở lò!'];
  let res;
  if(ok){
    const x=Math.random(),tier=x<.02?3:x<.08?2:x<.30?1:0,n=1+[0,0,1,2][tier];
    if(kind==='heal')S.heal+=n;else if(kind==='bd'){S.bdp=S.bdp||{};S.bdp[S.realm]=(S.bdp[S.realm]||0)+n}else S.pill+=n;S.alch++;
    say('Luyện thành công '+n+' viên '+D.n+' ('+TQ[tier]+').',tier>=2?'y':'g');
    res={img:tier>=2?'ok':'ldOk',card:tier<2,glow:QC[tier+1],filter:'',title:tier===3?'Dị tượng xuất hiện! Đan thành cực phẩm!':tier===2?'Đan thành cực phẩm!':'Luyện đan thành công!',
      lines:['Đan dược: '+D.n,'Phẩm cấp: '+D.rank,'Phẩm chất: '+TQ[tier],'Số lượng: +'+n+' viên',use,rate,'Kinh nghiệm luyện đan: +1']};
  }else{
    const boom=Math.random()<.25;
    if(boom)hurtUp(1);
    say(boom?'Lò đan nổ tung, mất '+H+' linh thảo và bị thương nhẹ.':'Lửa tắt, đan không thành, mất '+H+' linh thảo.','b');
    res={img:boom?'ldFail':'fail',card:boom,glow:boom?'255,70,60':'150,110,200',filter:boom?'saturate(1.4) hue-rotate(-15deg)':'',bad:true,boom:boom,title:boom?'Lò đan nổ tung!':'Lửa tắt, đan không thành',
      lines:['Đan dược: '+D.n,'Phẩm cấp: '+D.rank,use+' (mất trắng)',rate].concat(boom?['Hậu quả: bị thương nhẹ.']:['Linh thảo đã bị cháy hỏng.'])};
  }
  advance(2);
  fxShow(furnaceArt,caps,res);
}
