// ===== TÚI ĐỒ =====
// Mở túi để xem linh thảo, linh thạch, đan dược và dùng đan từ đây. Trong lúc mở túi game tạm dừng tự chạy.
// Thêm vật phẩm mới: thêm một mục vào mảng rows trong bagRows() (n tên, c số lượng, d mô tả, use nếu có nút Dùng).
let bagOpen=false;
function bagRows(){
  const full=S.realm>=TOP||S.qi>=need();
  const gain15=S.realm>=TOP?0:Math.min(Math.floor(need()*0.15),Math.max(0,need()-S.qi));
  const heal=S.hurt?'Đang bị thương: chữa khỏi hẳn.':(S.fails>0?'Xua tan tâm ma, giảm 1 lần thất bại lôi kiếp ('+S.fails+'/3).':'Chưa cần dùng (không bị thương, không có tâm ma).');
  const rows=[
    {n:'Tụ Linh Đan',c:S.pill,d:'Tăng 15% thanh tu vi'+(gain15?' (+'+gain15.toLocaleString('vi-VN')+' tu vi)':'')+(full?'. Tu vi đã đầy.':'.'),use:{ok:S.pill>0&&!full,f:eatPill}},
    {n:'Hồi Thương Đan',c:S.heal,d:heal,use:{ok:S.heal>0&&(S.hurt||S.fails>0),f:healPill}},
    {n:'Linh thảo',c:S.herb,d:S.herb?'Phẩm chất trung bình: '+QN[Math.round(avgQ())]+'.':'Thúc bằng bình nhỏ để có thêm.'},
    {n:'Linh thạch',c:S.stone,d:'Bày pháp trận ('+ptCost()+' mỗi tầng), chữa thương, mua bán.'}
  ];
  if(S.realm<TOP)rows.splice(2,0,{n:BDAN[S.realm],c:bdHave(),d:'Đan đột phá, tự dùng khi bấm Đột phá lên '+REALMS[S.realm+1]+'.'});
  return rows;
}
function renderBag(){
  const box=$('bagl');box.innerHTML='';
  const st=document.createElement('div');st.className='bags';
  st.textContent='Thương thế: '+['không','nhẹ','nặng'][S.hurt||0]+'. Tâm ma tích lũy: '+(S.fails||0)+'/3.';
  box.appendChild(st);
  bagRows().forEach(r=>{
    const row=document.createElement('div');row.className='bagr';
    const n=document.createElement('b');n.textContent=r.n;
    const c=document.createElement('span');c.className='c';c.textContent='x'+r.c.toLocaleString('vi-VN');
    const d=document.createElement('span');d.className='d';d.textContent=r.d;
    row.appendChild(n);row.appendChild(c);row.appendChild(d);
    if(r.use){
      const b=document.createElement('button');b.textContent='Dùng';b.disabled=!r.use.ok;
      b.onclick=()=>{r.use.f();render();save();renderBag()};
      row.appendChild(b);
    }
    box.appendChild(row);
  });
}
function openBag(){if(S.dead||fxBusy||bagOpen)return;stopAuto();bagOpen=true;renderBag();$('bag').hidden=false}
function closeBag(){$('bag').hidden=true;bagOpen=false;render();save();startAuto()}
