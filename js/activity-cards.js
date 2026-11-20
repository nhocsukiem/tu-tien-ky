// ===== THẺ ẢNH CHO BẾ QUAN VÀ THÁM HIỂM =====
// Hành động xảy ra trước, thẻ ảnh chỉ hiện kết quả (không tính lại, nên không nhân đôi phần thưởng).
function bequan(months){
  months=months||12;
  if(S.dead||fxBusy)return;
  const q0=S.qi,m0=S.m,max=need(),f0=S.fails||0;
  const left=Math.ceil((max-S.qi)/gain());   // dừng khi tu vi viên mãn, không phí thọ nguyên
  cult(Math.max(1,Math.min(months,left)));
  const spent=S.m-m0;
  if(!S.dead)restTrack(spent);
  render();save();
  if(S.dead)return;
  const lines=['Thời gian bế quan: '+fmtT(spent),'Tu vi nhận được: +'+Math.floor(S.qi-q0).toLocaleString('vi-VN'),'Tu vi hiện tại: '+Math.floor(S.qi).toLocaleString('vi-VN')+' / '+max.toLocaleString('vi-VN')+(S.qi>=max?' (viên mãn, có thể đột phá)':'')];
  if(f0>(S.fails||0))lines.push('Kinh mạch vững vàng, tâm ma tan đi (thất bại lôi kiếp còn '+(S.fails||0)+'/3).');
  else if(S.fails>0)lines.push('Tĩnh dưỡng tâm ma: '+(Math.round((S.restM||0)/12*10)/10)+'/10 năm (đủ 10 năm giảm 1 lần thất bại).');
  fxCard({img:'bequan',card:true,glow:'120,200,255',lines:lines});
}
function thamhiem(){
  if(S.dead||fxBusy)return;
  const first=S.log[0],m0=S.m;
  explore();
  render();save();
  if(S.dead)return;
  const lines=[];
  for(const l of S.log){if(l===first)break;lines.push(l.t)}
  lines.reverse();
  if(S.ev!=null)lines.unshift('Ngươi đi tới một nơi lạ, có chuyện sắp xảy ra...');
  lines.push('Thời gian: '+fmtT(S.m-m0));
  fxCard({img:'thamhiem',card:true,glow:'120,230,170',lines:lines});
}
