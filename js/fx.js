// ===== KHUNG HIỆU ỨNG + MÀN HÌNH KẾT QUẢ DÙNG CHUNG =====
// fxShow(art,caps,res): chạy hiệu ứng nhiều giai đoạn rồi hiện kết quả (thúc linh thảo, luyện đan).
// fxCard(res): hiện thẳng một thẻ kết quả (đột phá, bí cảnh...).
// res = {img:'khóa trong IMG', card:true nếu ảnh đã có chữ, glow:'r,g,b', filter, title, lines:[...], bad, boom}
let fxBusy=false,fxOnClose=null;
function fxShow(art,caps,res){
  const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  fxBusy=true;stopAuto();
  $('fx').hidden=false;$('fx').className='';$('fxres').hidden=true;$('fxcap').hidden=false;
  $('fxart').innerHTML=art(0);$('fxcap').textContent=caps[0];
  let i=0;
  const t=setInterval(()=>{
    i++;
    if(i<caps.length){$('fxart').innerHTML=art(i);$('fxcap').textContent=caps[i]}
    else{clearInterval(t);fxResult(res)}
  },reduce?500:750);
}
function fxCard(res){
  fxBusy=true;stopAuto();
  $('fx').hidden=false;$('fx').className='';$('fxart').innerHTML='';$('fxcap').hidden=true;
  fxResult(res);
}
function fxResult(r){
  $('fxcap').hidden=true;$('fxart').innerHTML='';$('fxres').hidden=false;
  const im=$('fxim');im.src=IMG[r.img];im.className=r.card?'card':'';im.style.filter=r.filter||'';im.style.setProperty('--g',r.glow||'255,200,70');
  $('fxt').hidden=!!r.card;$('fxt').textContent=r.title||'';$('fxt').className=r.bad?'bad':'';
  $('fxl').textContent=(r.lines||[]).join('\n');
  $('fxok').textContent=r.okText||'Thu nhận';fxOnClose=r.onClose||null;
  if(r.boom)$('fx').classList.add('shake');
}
function fxClose(){
  const cb=fxOnClose;fxOnClose=null;
  $('fx').hidden=true;$('fx').className='';fxBusy=false;
  if(cb)cb();
  render();save();startAuto();
  if(S.dead)deathCard();
}
// Màn hình Luân Hồi: hiện khi nhân vật chết (tọa hóa, hết thọ nguyên) hoặc phi thăng. Đóng thẻ = chuyển thế sang kiếp sau.
function deathCard(){
  if(!S.dead||S.deathShown||fxBusy||(typeof tribuOn!=='undefined'&&tribuOn))return;
  S.deathShown=true;
  const asc=S.realm>=TOP;
  fxCard({img:asc?'dpOk':(S.dmsg&&S.dmsg.indexOf('tâm ma')>=0?'dpFail':'dpOk'),card:true,bad:!asc,glow:asc?'255,215,120':'255,70,60',okText:'Chuyển thế luân hồi',onClose:reborn,
    lines:[S.dmsg||'',asc?'':'Cảnh giới đạt được: '+REALMS[S.realm],'Tuổi: '+age(),'Đạo Duyên nhận được: +'+(S.pts||0)+' (tổng: '+S.legacy+')','Mỗi điểm Đạo Duyên tăng 5% tốc độ tu luyện ở kiếp sau.'].filter(Boolean)});
}
