// ===== HỘP XÁC NHẬN (thay cho confirm() mặc định của trình duyệt) =====
// askConfirm('nội dung',hàmKhiĐồngÝ,'chữ nút đồng ý','chữ nút hủy'). Game tạm dừng tự chạy trong lúc chờ.
function askConfirm(text,onYes,yesLabel,noLabel){
  stopAuto();
  $('cft').textContent=text;$('cfy').textContent=yesLabel||'Đồng ý';$('cfn').textContent=noLabel||'Hủy';
  $('cf').hidden=false;
  $('cfy').onclick=()=>{$('cf').hidden=true;onYes();startAuto()};
  $('cfn').onclick=()=>{$('cf').hidden=true;startAuto()};
}
