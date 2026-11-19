// ===== THẺ ẢNH CHO BẾ QUAN VÀ THÁM HIỂM =====
// Hành động xảy ra trước, thẻ ảnh chỉ hiện kết quả (không tính lại, nên không nhân đôi phần thưởng).
function bequan(){
  if(S.dead||fxBusy)return;
  const q0=S.qi,m0=S.m,max=need();
  cult(12);
  render();save();
  if(S.dead)return;
  fxCard({img:'bequan',card:true,glow:'120,200,255',lines:['Thời gian bế quan: '+fmtT(S.m-m0),'Tu vi nhận được: +'+Math.floor(S.qi-q0).toLocaleString('vi-VN'),'Tu vi hiện tại: '+Math.floor(S.qi).toLocaleString('vi-VN')+' / '+max.toLocaleString('vi-VN')+(S.qi>=max?' (viên mãn, có thể đột phá)':'')]});
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
