// ===== LÔI KIẾP KHI ĐỘT PHÁ =====
// Mỗi cảnh giới một loại kiếp: n = tên kiếp, d = số đạo, c = màu sét (r,g,b).
// Cảnh giới càng cao: càng nhiều đạo, sét càng dày, mỗi lần giáng xuống có nhiều tia cùng lúc.
const KIEP=[
 {n:'Tâm Ma Kiếp',d:2,c:'150,200,255'},{n:'Tiểu Lôi Kiếp',d:3,c:'120,190,255'},
 {n:'Lôi Kiếp',d:4,c:'110,170,255'},{n:'Lôi Kiếp',d:5,c:'150,140,255'},
 {n:'Đại Lôi Kiếp',d:6,c:'190,120,255'},{n:'Đại Lôi Kiếp',d:6,c:'220,110,255'},
 {n:'Thiên Lôi Kiếp',d:7,c:'255,120,200'},{n:'Thiên Lôi Kiếp',d:8,c:'255,170,120'},
 {n:'Cửu Thiên Lôi Kiếp',d:9,c:'255,230,140'}
];
let tribuOn=false;
function tribulation(){
  const ov=$('tribu'),cv=$('tcv'),tx=$('ttxt'),g=cv.getContext('2d');
  const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  const W=cv.width=innerWidth,H=cv.height=innerHeight;
  const r=S.realm,K=KIEP[Math.min(r,KIEP.length-1)],n=K.d,multi=1+Math.floor(r/3),thick=2.5+r*.5;
  let flash=0,i=0,col=K.c,run=true;const live=[];
  ov.hidden=false;ov.className=reduce?'':'shake';
  tx.textContent=K.n+': mây kiếp tụ lại trên đầu ngươi...';
  const bolts=[];
  function glow(p,w){g.save();g.lineJoin='round';g.shadowColor='rgb('+col+')';g.shadowBlur=18+r*3;g.strokeStyle='#fff';g.lineWidth=w;g.beginPath();g.moveTo(p[0][0],p[0][1]);p.slice(1).forEach(q=>g.lineTo(q[0],q[1]));g.stroke();g.restore()}
  function bolt(){
    const pts=[[W*(.1+Math.random()*.8),0]];let y=0,x=pts[0][0];
    while(y<H*.9){y+=H*(.04+Math.random()*.06);x+=(Math.random()-.5)*W*.12;pts.push([x,y])}
    const o={l:[[pts,thick]],life:1};
    for(let b=0;b<3;b++){const s=pts[1+rnd(pts.length-2)],br=[s];let bx=s[0],by=s[1];for(let k=0;k<4;k++){bx+=(Math.random()-.5)*W*.14;by+=H*.05;br.push([bx,by])}o.l.push([br,thick*.45])}
    bolts.push(o);
  }
  function strike(){for(let k=0;k<multi;k++)bolt();flash=Math.min(.7,(reduce?.3:.4)+r*.03)}
  // Mỗi khung hình: nền tối, mây, ánh chớp, rồi mới vẽ tia sét lên trên (sét mờ dần theo thời gian).
  function frame(){
    g.fillStyle='#05080e';g.fillRect(0,0,W,H);
    for(let c=0;c<5;c++){const cx=W*(c/4),rad=Math.max(W,H)*.4,gr=g.createRadialGradient(cx,0,0,cx,0,rad);gr.addColorStop(0,'rgba(60,70,95,.55)');gr.addColorStop(1,'rgba(60,70,95,0)');g.fillStyle=gr;g.fillRect(0,0,W,H)}
    if(flash>0){g.fillStyle='rgba('+col+','+flash+')';g.fillRect(0,0,W,H);flash*=.88;if(flash<.02)flash=0}
    for(let k=bolts.length-1;k>=0;k--){const o=bolts[k];g.globalAlpha=Math.min(1,o.life*1.6);o.l.forEach(q=>glow(q[0],q[1]));g.globalAlpha=1;o.life-=.06;if(o.life<=0)bolts.splice(k,1)}
    if(run)requestAnimationFrame(frame);
  }
  g.fillStyle='#05080e';g.fillRect(0,0,W,H);frame();
  const t=setInterval(()=>{
    if(i<n){i++;tx.textContent=K.n+' giáng xuống! Đạo '+i+'/'+n;strike()}
    else{clearInterval(t);setTimeout(finish,500)}
  },Math.max(380,650-r*30));
  function finish(){
    const before=S.realm;breakthrough();const ok=S.realm>before;
    // Ghi kết quả ngay (tuổi, tu vi, số lần thất bại) để màn hình và dữ liệu luôn khớp, kể cả khi tải lại trang lúc thẻ đang mở.
    render();save();
    col=ok?'255,215,120':'255,70,60';flash=ok?.5:.45;
    tx.textContent=ok?'Vượt qua '+K.n+'!':'Không vượt qua được '+K.n+'...';
    setTimeout(()=>{
      run=false;ov.hidden=true;tribuOn=false;
      const lines=S.log.slice(0,S.dead&&!ok?2:1).map(l=>l.t).reverse();
      if(S.dead)deathCard();
      else if(ok)fxCard({img:'dpOk',card:true,glow:'255,215,120',lines:[S.realm>=TOP?'Ngươi đã phi thăng tiên giới!':'Cảnh giới mới: '+REALMS[S.realm],'Thọ nguyên: '+(S.life>=99999?'vô hạn':S.life+' năm'),K.n+': vượt qua '+n+' đạo kiếp']});
      else fxCard({img:'dpFail',card:true,bad:true,glow:'255,70,60',lines:lines});
    },1500);
  }
}
