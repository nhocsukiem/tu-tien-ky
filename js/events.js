// ===== SỰ KIỆN =====
// EVENTS: sự kiện đơn giản khi bấm Thám hiểm (chỉ ra kết quả, không cho chọn).
// EV: sự kiện cho người chơi chọn. Mỗi sự kiện có dạng:
//   {c:()=>điều kiện (không bắt buộc), t:'nội dung', o:[ {l:'tên nút', ok:()=>điều kiện được bấm (không bắt buộc), f:()=>{kết quả}} ]}
//   Trong kết quả dùng say('chữ','g|b|y') để ghi nhật ký (g xanh, b đỏ, y vàng).
// PASS: biến cố nhỏ tự xảy ra, không cần chọn.
// nextEv/nextP: thời gian chờ ngẫu nhiên giữa các sự kiện (tính theo tháng).
const EVENTS=[
 ()=>{const q=gain()*6;S.qi=Math.min(need(),S.qi+q);say("Hái được một gốc linh thảo trăm năm, tu vi tăng "+q+".","g")},
 ()=>{const n=1+rnd(3);S.stone+=n;say("Nhặt được "+n+" khối linh thạch bên khe suối.","g")},
 ()=>{if(Math.random()<.5+S.realm*.05){S.stone+=2;say("Chém giết yêu thú, thu được 2 linh thạch.","g")}else{S.qi=Math.floor(S.qi*.8);hurtUp(1);say("Bị yêu thú đánh trọng thương, hao tổn 20% tu vi và bị thương nhẹ.","b")}},
 ()=>{S.life+=10;say("Gặp một vị cao nhân chỉ điểm, thọ nguyên tăng thêm 10 năm.","y")},
 ()=>{const q=gain()*20;S.qi=Math.min(need(),S.qi+q);say("Tình cờ phát hiện một bí cảnh, thu hoạch rất lớn: tu vi tăng "+q+".","y")},
 ()=>{if(S.stone>0){S.stone--;say("Bị tu sĩ cướp đường, mất 1 linh thạch.","b")}else{S.m+=12;say("Bị truy sát, phải ẩn náu suốt một năm.","b")}},
 ()=>say("Đi cả tháng trời, chỉ thấy núi non trùng điệp."),
 ()=>{const n=1+rnd(2);S.herb+=n;say("Phát hiện linh thảo mọc trên vách núi, hái được "+n+" gốc.","g")},
 ()=>{if(Math.random()<.75){S.stone+=3;S.pill++;say("Bắt gặp một tu sĩ lạc đơn, ra tay đoạt túi trữ vật: 3 linh thạch và 1 viên đan dược.","y")}else{S.qi=Math.floor(S.qi*.7);S.m+=12;say("Tưởng là con mồi, hóa ra là kẻ có chống lưng. Ngươi trốn chạy suốt một năm, mất 30% tu vi.","b")}}
];
const EV=[
 {t:'Ngươi phát hiện một gốc linh dược trăm năm mọc bên vách đá, nhưng có yêu thú canh giữ gần đó.',o:[
  {l:'Liều mạng đoạt lấy',f:()=>{if(Math.random()<.55){S.herb+=4;say('Ngươi liều mạng hạ yêu thú, hái được 4 gốc linh thảo quý.','g')}else{S.qi=Math.floor(S.qi*.6);S.m+=12;hurtUp(2);say('Yêu thú quá mạnh, ngươi trọng thương, mất 40% tu vi và nằm dưỡng thương một năm.','b')}}},
  {l:'Dùng 1 linh thạch bày trận dụ yêu thú đi (thành công 85%)',ok:()=>S.stone>=1,f:()=>{S.stone--;if(Math.random()<.85){S.herb+=4;say('Trận pháp dụ được yêu thú đi, ngươi hái được 4 gốc linh thảo quý.','g')}else say('Kế hoạch bại lộ, ngươi bỏ chạy và mất trắng 1 linh thạch.','b')}},
  {l:'Bỏ qua, giữ mạng quan trọng hơn',f:()=>say('Ngươi lặng lẽ rời đi. Sống sót mới là trên hết.')}]},
 {t:'Một tu sĩ lạc đơn đi ngang qua, túi trữ vật căng phồng, hắn chưa phát hiện ra ngươi.',o:[
  {l:'Ra tay giết người đoạt bảo',f:()=>{if(Math.random()<.75){S.stone+=3;S.pill++;say('Ngươi ra tay dứt khoát, thu được 3 linh thạch và 1 viên đan dược.','y')}else{S.qi=Math.floor(S.qi*.7);S.m+=12;hurtUp(1);say('Hắn có chống lưng, ngươi trốn chạy một năm, mất 30% tu vi và bị thương nhẹ.','b')}}},
  {l:'Kết giao làm quen',f:()=>{if(Math.random()<.5){S.stone+=2;say('Hắn dễ gần, tặng ngươi 2 linh thạch làm quà gặp mặt.','g')}else say('Hắn lạnh nhạt bỏ đi, ngươi chẳng được gì.')}},
  {l:'Lẳng lặng tránh đi',f:()=>say('Ngươi tránh mặt hắn, không rước họa vào thân.')}]},
 {t:'Một bí cảnh cổ xưa hé mở, linh khí cuồn cuộn, nhưng nghe nói nhiều người vào không có ra.',o:[
  {l:'Tiến vào thám hiểm',f:()=>{const x=Math.random();if(x<.5){const q=gain()*30;S.qi=Math.min(need(),S.qi+q);say('Ngươi thu hoạch lớn trong bí cảnh, tu vi tăng '+q+'.','y')}else if(x<.7){S.life+=10;say('Trong bí cảnh có di tích cổ, thọ nguyên của ngươi tăng thêm 10 năm.','y')}else{S.qi=Math.floor(S.qi*.75);S.m+=36;say('Ngươi lạc trong bí cảnh ba năm, thoát ra được nhưng mất 25% tu vi.','b')}}},
  {l:'Không vào, ở lại tĩnh tu',f:()=>{S.qi=Math.min(need(),S.qi+gain()*2);say('Ngươi từ bỏ cơ duyên, ở lại tĩnh tu, tu vi tăng nhẹ.')}}]},
 {t:'Một lão giả bày quán ven đường, rao bán một bộ công pháp cổ.',o:[
  {l:'Bỏ 2 linh thạch mua công pháp (thật 70%)',ok:()=>S.stone>=2,f:()=>{S.stone-=2;if(Math.random()<.7){S.mult=Math.round(S.mult*115)/100;say('Công pháp là thật, tốc độ tu luyện vĩnh viễn tăng 15% (x'+S.mult+').','y')}else say('Công pháp là đồ giả, ngươi mất 2 linh thạch.','b')}},
  {l:'Không mua',f:()=>say('Ngươi lắc đầu bỏ đi.')}]},
 {t:'Ngươi ghé phường thị, có người rao mua bán đan dược.',o:[
  {l:'Mua 1 đan dược (2 linh thạch)',ok:()=>S.stone>=2,f:()=>{S.stone-=2;S.pill++;say('Ngươi mua được 1 viên đan dược.','g')}},
  {l:'Bán 1 đan dược (được 2 linh thạch)',ok:()=>S.pill>=1,f:()=>{S.pill--;S.stone+=2;say('Ngươi bán đan dược, được 2 linh thạch.','g')}},
  {l:'Chỉ xem rồi đi',f:()=>say('Ngươi dạo một vòng rồi rời phường thị.')}]},
 {t:'Ngươi gặp một lão giả bị thương nặng bên đường, thều thào xin một viên đan dược.',o:[
  {l:'Cho ông ta 1 đan dược',ok:()=>S.pill>=1,f:()=>{S.pill--;if(Math.random()<.5){S.life+=15;say('Lão giả hóa ra là cao nhân ẩn mình, chỉ điểm giúp thọ nguyên của ngươi tăng thêm 15 năm.','y')}else say('Ông ta uống đan rồi lặng lẽ đi mất, ngươi chẳng nhận được gì.')}},
  {l:'Làm ngơ',f:()=>say('Ngươi bước qua, không ngoảnh lại.')}]},
 {t:'Ngươi tình cờ phát hiện một hang động bí ẩn, từ bên trong tỏa ra linh khí nhàn nhạt. Có vào khám phá hay không?',o:[
  {l:'Vào khám phá',f:()=>{const x=Math.random();if(x<.4){const q=gain()*12;S.qi=Math.min(need(),S.qi+q);S.stone+=2;say('Trong hang có di vật của một vị tiền bối, ngươi thu được '+q+' tu vi và 2 linh thạch.','y')}else if(x<.7){S.herb+=3;say('Cuối hang mọc đầy linh thảo, ngươi hái được 3 gốc.','g')}else{S.qi=Math.floor(S.qi*.7);S.m+=24;say('Hang động có độc trùng và cấm chế, ngươi thoát ra sau hai năm, mất 30% tu vi.','b')}}},
  {l:'Không vào',f:()=>say('Ngươi nhìn hang động một lúc rồi quay đi. Cẩn thận mới sống lâu.')}]},
 {t:'Ngươi thấy một ngôi miếu cổ đổ nát, bên trong có bức tượng đá tỏa ánh sáng lạ. Có vào bái lạy không?',o:[
  {l:'Vào bái lạy',f:()=>{const x=Math.random();if(x<.5){S.life+=8;say('Tuợng đá phát sáng, ban cho ngươi thọ nguyên tăng thêm 8 năm.','y')}else if(x<.8){S.stone+=1;say('Ngươi nhặt được 1 linh thạch dưới chân tượng.','g')}else{S.qi=Math.floor(S.qi*.85);S.m+=12;say('Miếu có tà khí, ngươi bị ám và phải dưỡng thương một năm, mất 15% tu vi.','b')}}},
  {l:'Không vào',f:()=>say('Ngươi chắp tay vái một cái rồi đi tiếp.')}]},
 {t:'Một đoàn thương nhân mời ngươi đi cùng một chuyến buôn đường xa, hứa chia lợi. Có tham gia không?',o:[
  {l:'Tham gia',f:()=>{if(Math.random()<.6){S.stone+=4;say('Chuyến đi suôn sẻ, ngươi chia được 4 linh thạch.','g')}else{S.stone=Math.max(0,S.stone-1);S.m+=12;say('Đoàn bị cướp giữa đường, ngươi mất 1 linh thạch và mất một năm.','b')}}},
  {l:'Không tham gia',f:()=>say('Ngươi từ chối, ở lại tu luyện.')}]},
 {c:()=>S.realm>=1,t:'Một tu sĩ có cảnh giới cao hơn chặn đường, đòi ngươi nộp linh thạch mua mạng.',o:[
  {l:'Nộp 2 linh thạch',ok:()=>S.stone>=2,f:()=>{S.stone-=2;say('Ngươi nuốt giận nộp 2 linh thạch, hắn bỏ đi.','b')}},
  {l:'Liều chiến (thắng 40%)',f:()=>{if(Math.random()<.4){S.stone+=4;S.pill++;say('Ngươi liều mạng phản kích, hạ được hắn và thu 4 linh thạch cùng 1 viên đan dược.','y')}else{S.qi=Math.floor(S.qi*.5);hurtUp(2);say('Ngươi bại trận, mất 50% tu vi và bị trọng thương.','b')}}},
  {l:'Bỏ chạy (thoát 60%)',f:()=>{if(Math.random()<.6)say('Ngươi dùng thân pháp thoát được.');else{S.qi=Math.floor(S.qi*.8);hurtUp(1);say('Ngươi bị đuổi kịp, bị thương nhẹ và mất 20% tu vi.','b')}}}]},
 {c:()=>S.realm>=1,t:'Một tông môn nhỏ mời ngươi làm khách khanh, bù lại ngươi phải làm việc cho họ hai năm.',o:[
  {l:'Nhận lời',f:()=>{S.stone+=3;S.pill++;S.m+=24;say('Ngươi làm việc cho tông môn hai năm, nhận 3 linh thạch và 1 viên đan dược.','g')}},
  {l:'Từ chối',f:()=>say('Ngươi khéo léo từ chối, vẫn một mình tu hành.')}]}
];
function raiseEvent(){const ok=[];EV.forEach((e,i)=>{if(!e.c||e.c())ok.push(i)});S.ev=ok[rnd(ok.length)];S.evT=nextEv();stopAuto()}
function pick(i){const o=EV[S.ev].o[i];if(o.ok&&!o.ok())return;S.ev=null;o.f();if(!S.dead&&age()>=S.life)die();render();save();startAuto()}
const nextEv=()=>Math.max(6,Math.round(-Math.log(1-Math.random())*72));
const nextP=()=>Math.max(2,Math.round(-Math.log(1-Math.random())*30));
const PASS=[
 ()=>{const q=gain()*3;S.qi=Math.min(need(),S.qi+q);say('Linh khí quanh núi bất chợt dồi dào, tu vi tăng '+q+'.','g')},
 ()=>{S.qi=Math.floor(S.qi*.97);say('Năm nay đại hạn, linh khí loãng đi, tu vi hao nhẹ.','b')},
 ()=>{S.stone++;say('Ngươi nhặt được 1 linh thạch bên đường.','g')},
 ()=>say('Nghe tin một tông môn nhỏ bị diệt môn, ngươi càng thêm cẩn trọng.'),
 ()=>{if(!S.hurt){hurtUp(1);say('Trúng phải độc khí nơi đầm lầy, ngươi bị thương nhẹ.','b')}else say('Trời đổ mưa suốt nửa tháng, thương thế của ngươi nhức nhối.')},
 ()=>{const q=gain()*2;S.qi=Math.min(need(),S.qi+q);say('Nhìn sao băng vụt qua, tâm cảnh thông suốt, tu vi tăng '+q+'.','g')},
 ()=>say('Một đạo hữu quen biết năm xưa đã qua đời, ngươi lặng người nhìn trời.')
];
function passive(){PASS[rnd(PASS.length)]()}
