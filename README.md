# Tu Tiên Ký

Game mô phỏng tu tiên chạy trên trình duyệt. Bấm đúp `index.html` để chơi (không cần cài gì).

## Cấu trúc (mỗi tính năng một file để dễ sửa)
- `index.html`: khung trang
- `css/style.css`: giao diện chính
- `css/effects.css`: hiệu ứng nút bấm, ảnh thẻ kết quả
- `js/character.js`: cảnh giới, thọ nguyên, linh căn, thể chất, thương thế
- `js/events.js`: sự kiện (chọn lựa, ngẫu nhiên, thám hiểm)
- `js/assets.js`: danh sách ảnh (đổi ảnh ở đây)
- `js/fx.js`: khung hiệu ứng và màn hình kết quả dùng chung
- `js/alchemy.js`: thúc linh thảo, luyện đan
- `js/tribulation.js`: lôi kiếp khi đột phá (theo cảnh giới)
- `js/ui-effects.js`: hiệu ứng khi nhấn nút
- `js/activity-cards.js`: thẻ ảnh khi bế quan và thám hiểm
- `js/confirm.js`: hộp xác nhận của game (dùng khi bế quan lúc sắp hết thọ nguyên)
- `js/game.js`: vòng lặp tu luyện, đột phá, hiển thị, nút bấm
- `img/`: ảnh

Thêm tính năng mới: tạo một file `.js` mới trong `js/` rồi thêm một dòng `<script src="js/ten-file.js"></script>` vào `index.html`, trước dòng `game.js`.
