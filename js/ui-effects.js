// ===== HIỆU ỨNG KHI NHẤN NÚT =====
// Gợn sóng ánh sáng tại điểm chạm. Phần giao diện (nút Đột phá phát sáng, nhấn xuống) nằm ở css/effects.css.
document.addEventListener('pointerdown',e=>{
  const b=e.target.closest&&e.target.closest('button');
  if(!b||b.disabled)return;
  const r=b.getBoundingClientRect(),d=Math.max(r.width,r.height),s=document.createElement('span');
  s.className='rip';
  s.style.cssText='width:'+d+'px;height:'+d+'px;left:'+(e.clientX-r.left-d/2)+'px;top:'+(e.clientY-r.top-d/2)+'px';
  b.appendChild(s);
  setTimeout(()=>s.remove(),650);
});
