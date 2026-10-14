import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Chẩn đoán học Y học cổ truyền",
      sourceType: "Giáo trình",
      authorOrOrg: "Đại học Y Dược TP. Hồ Chí Minh",
      locator: "321 trang — Chương 4: Chẩn Đoán và Bệnh Án",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;
  const cat = "Tứ chẩn";

  await prisma.theoryTopic.create({
    data: {
      name: "Vận Dụng Tứ Chẩn và Biện Chứng - Biện Chứng Yếu Điểm",
      category: cat,
      summary: "5 yếu điểm khi vận dụng tứ chẩn và biện chứng trên lâm sàng: tứ chẩn phải kỹ càng chuẩn xác, biện chứng xoay quanh chủ chứng, xem bệnh là quá trình động, triệu chứng cá biệt có thể quyết định chẩn đoán, biện chứng phải kết hợp biện bệnh.",
      content: `Khi khám bệnh cần nắm vững nguyên tắc tứ chẩn và tinh thần bát cương biện chứng, vận dụng thích hợp các phương pháp biện chứng mới đạt chẩn đoán chính xác. 5 vấn đề quyết định:

1. TỨ CHẨN KỸ CÀNG VÀ CHUẨN XÁC LÀ CƠ SỞ CHO BIỆN CHỨNG: Theo nguyên tắc tứ chẩn hợp tham, biện chứng không thể chỉ dựa 1 triệu chứng hoặc 1 mạch tượng mà vội vã kết luận — phải kết hợp chứng hầu của vọng-văn-vấn-thiết. Tứ chẩn không đầy đủ dễ đi lệch hướng, thậm chí chẩn đoán lầm. Cần chú ý: mỗi chẩn đã làm kỹ càng chuẩn xác chưa; chứng hầu là chứng cứ quan trọng, càng đầy đủ càng dễ chẩn đoán — phải nắm kỹ triệu chứng, không bỏ sót; nếu nghi ngờ điểm nào phải kiểm tra lại. Bệnh tình có nặng nhẹ, có bệnh chỉ 2-3 triệu chứng, có bệnh rất nhiều; một số bệnh nhân diễn đạt kém, hoặc do tình chí mà kể không rõ/nói dối, hoặc khuếch đại/giấu triệu chứng — nên không chỉ bày triệu chứng ra là đủ mà cần chú ý tính chuẩn xác (không thêm không bớt). Chứng hầu có từ quan sát khám bệnh của thầy thuốc nên cần tiến hành khách quan, không chủ quan ước đoán hoặc ấn tượng mơ hồ.

2. TIẾN HÀNH BIỆN CHỨNG XUNG QUANH TRIỆU CHỨNG CHỦ YẾU (chủ chứng): Chủ chứng có thể là 1 hoặc vài triệu chứng, là biểu hiện chủ yếu (trọng tâm) của bệnh — cần khoanh nó lại, khai thác vấn đề liên quan xung quanh để biện chứng luận trị. Ví dụ chứng nôn ói: bệnh nhân (1) sơ khởi nhức đầu ố hàn sốt nôn ói — ngoại cảm kèm ói (ói thứ yếu); (2) đột ngột đau quặn bụng nôn ói tay chân lạnh có thể nôn ra giun — "Hồi quyết" (ói và đau quặn đều là chủ chứng); (3) uể oải tứ chi vô lực, bệnh lâu ói không ngưng, sau ăn 1-2h ói hết, 7-8 ngày mới đi cầu 1 lần — phản vị (ói là chủ chứng quyết định, không ói thì không chẩn phản vị được). Ví dụ khác: bệnh nhân phù toàn thân mà suyễn — cần hỏi cái nào xuất hiện trước; nếu phù trước suyễn sau thì phù là chủ chứng (quan hệ mật thiết phế-tỳ-thận), quan sát triệu chứng kèm để định vị tạng chính. Ví dụ cụ thể: phù trước suyễn sau, sắc mặt vàng trắng, rêu lưỡi trắng nhuận, tiểu ngắn ít, đại tiện trước táo sau lỏng, bụng trướng không muốn ăn, có lúc ói nước dãi bọt, tứ chi vô lực lười nhác, mạch nhu hoãn (rõ nhất bộ quan phải) — chẩn đoán: tỳ dương bất chấn, vận hóa thất tư, tụ thủy thành thũng, thủy khí thượng phạm gây suyễn (tỳ là chính, phế là thứ).

3. BIỆN CHỨNG TỪ QUÁ TRÌNH PHÁT TRIỂN BỆNH: Bệnh tật là quá trình biến hóa không ngừng — cùng 1 loại bệnh nhưng cá thể/điều kiện khác nhau có biến hóa khác nhau; cùng 1 người bệnh theo thời gian bệnh cơ cũng không ngừng phát triển (hoặc do điều trị gây biến hóa). Ví dụ: bệnh nhân thương hàn hôm nay tại thái dương, ngày mai có thể đã tới thiếu dương/dương minh; hôm qua biểu thực chứng, trị nhầm xuất hiện biểu hư hoặc biến chứng khác. Ôn bệnh tương tự: hôm nay tại khí phần, ngày mai có thể nhập dinh/huyết phần. Trẻ em "thuần dương chi thể", ngũ tạng mềm yếu, dễ biến hư/thực/hàn/nhiệt rất nhanh ("Cưỡi ngựa xem thương hàn, ngoảnh đầu xem đậu chẩn"). Khi biện chứng cần hỏi kỹ nguyên nhân khởi bệnh, đã chữa gì, hiệu quả ra sao, thẩm sát bệnh cơ hiện tại, suy đoán xu hướng — xem bệnh là động chứ không tĩnh thì biện chứng mới linh nghiệm. Áp dụng cả bệnh mãn tính: ví dụ điển hình — bệnh nhân háo suyễn 20 năm, sợ lạnh, thời tiết lạnh phát nặng — biện chứng hàn suyễn, dùng Tiểu thanh long thang (ôn tễ) kết quả tốt. Sau đi xa mệt mỏi, bệnh phát không dứt, dùng lại phương cũ không hiệu quả, suyễn càng nặng. Thầy thuốc khác khám: mặt trắng nhợt, tiếng nói nhỏ vô lực, hơi động là suyễn phát, hơi thở ngắn gấp — biện chứng khí suy, dùng Bổ trung ích khí thang gia giảm (bổ khí) dứt cơn ngay. 2 tháng sau vô tình hít khí than/mùi thuốc cứu, suyễn lại phát, tự dùng lại Bổ trung ích khí không hiệu quả — khám lại: mặt đỏ, miệng khô, đau đầu, đau ngực — biện chứng phong nhiệt, dùng thuốc tân lương dứt suyễn, sau duy trì bổ thận. Bài học: bệnh tật biến hóa vô thường — bệnh chứng chưa biến thì kết quả biện chứng chưa đổi, bệnh chứng đã biến thì biện chứng phải theo đó cải biến.

4. TRIỆU CHỨNG CÁ BIỆT NHIỀU KHI LÀ NHÂN TỐ QUYẾT ĐỊNH CHẨN ĐOÁN: Thông thường triệu chứng cá biệt (rêu, lưỡi, mạch...) là 1 đơn vị trong toàn bộ, các triệu chứng tương đối thống nhất bổ sung cho nhau cho kết quả thống nhất (quy luật thông thường). Nhưng có trường hợp mỗi chẩn mỗi khác — vọng/vấn chẩn là hư chứng, văn/thiết chẩn giống thực chứng, thậm chí thác tạp xen lẫn khó kết luận thống nhất — lúc này căn cứ bát cương biện chứng, dựa vào 1 triệu chứng cá biệt phản ánh toàn bộ bệnh cơ (mạch hoặc lưỡi) để rút ra kết luận. Điểm quyết định: 1 chứng/1 mạch/1 lưỡi không thể tách rời toàn bộ triệu chứng khác để chẩn đoán độc lập, nhưng khi có hiện tượng giả (bệnh chứng không phù hợp — do ngộ trị khiến bệnh phức tạp), cần tìm dấu hiệu chân chính về bản chất bệnh qua 1 chứng/1 mạch/1 lưỡi đặc biệt. Ví dụ kinh điển: thầy thuốc Dụ Gia Ngôn chữa Từ Quốc Trân — bệnh nhân sốt rất cao, mắt đỏ, phiền thao bực bội dị thường, cửa mở tung, nằm dài dưới đất xoay trở chậm, khát nước nhiều, mạch hồng đại (toàn bộ là nhiệt chứng — thầy thuốc trước dùng ngay Thừa khí thang). Nhưng Dụ tiên sinh nhận ra giả tượng: đưa nước tới, bệnh nhân cầm lên rồi đặt xuống không uống dù rất khát; mạch hồng đại nhưng trọng án vô lực. Dựa 2 điểm này: chẩn chân hàn giả nhiệt, dùng đại ôn nhiệt tễ, và vì có 1 loạt triệu chứng giả nên đổi phương pháp uống thuốc lúc lạnh (để tránh cách cự).

5. QUAN HỆ GIỮA BIỆN CHỨNG VÀ BIỆN BỆNH: Chứng và bệnh quan hệ mật thiết (bệnh nào chứng nấy) nhưng bệnh khác nhau có thể có chứng giống nhau — ví dụ thu táo bệnh, bệnh amiđan, viêm họng hạt đều có đau họng nhưng trị pháp khác nhau. Do đó biện chứng xong cũng nên biện bệnh. Biện chứng bao gồm kết quả tứ chẩn + nhân tố gây bệnh nội ngoại + vị trí bệnh, xem xét toàn diện phán đoán tính chất đặc thù và mâu thuẫn chủ thứ. Biện bệnh dựa vào kết quả biện chứng so sánh với bệnh tương tự khác, đối chiếu từng đặc trưng để loại trừ dần, có kết quả cuối cùng — từ đó dự liệu dự hậu (thuận/nghịch/cát/hung) và kết hợp hài hòa nguyên tắc điều trị + phương dược, nâng cao hiệu quả tránh đi đường vòng. Ví dụ: bệnh nhân tiêu ra máu lúc phát lúc ngưng chữa hoài không dứt — nếu biện bệnh rõ là trĩ ngay từ đầu thì không phải chịu đựng lâu vậy. Cách đặt tên bệnh: theo chứng (ho, suyễn, thổ huyết, tiện huyết), theo biểu hiện bệnh lý (đàm ẩm, bạch nội chướng/cườm đá), theo nguyên nhân+vị trí (phế táo), theo bệnh lý+vị trí (trường ung) — bất kể cách đặt tên nào, đều có ý nghĩa chỉ đạo biện chứng và nguyên tắc điều trị. Kết luận: "Bệnh" có được từ biện chứng, mỗi bệnh có quy luật biến hóa riêng lại chỉ đạo ngược biện chứng — quá trình biện chứng → biện bệnh → biện chứng là không ngừng đi sâu, không thể mãn nguyện chỉ dừng ở biện chứng một lần.`,
      keyPoints: "5 yếu điểm: (1) tứ chẩn phải đầy đủ chuẩn xác không thêm bớt; (2) xác định đúng chủ chứng làm trung tâm biện chứng; (3) xem bệnh là quá trình động, bệnh cơ thay đổi theo thời gian/điều trị; (4) triệu chứng cá biệt (1 mạch/1 lưỡi) có thể là chìa khóa phát hiện giả tượng; (5) biện chứng và biện bệnh bổ sung nhau theo chu trình xoáy ốc",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Vận Dụng Bát Cương và Các Phương Pháp Biện Chứng Khác",
      category: cat,
      summary: "Bát cương là tổng cương, hạt nhân của lý luận biện chứng luận trị — nền tảng kim chỉ nam cho tất cả phương pháp biện chứng khác. Phân biệt rõ phương pháp nào dùng cho ngoại cảm bệnh, phương pháp nào dùng cho tạp bệnh.",
      content: `BÁT CƯƠNG LÀ TỔNG CƯƠNG: Bát cương biện chứng quan sát mối quan hệ tương hỗ giữa con người-bệnh tật (sinh lý/bệnh lý), chính khí-tà khí, thăng bằng-mất quân bình để tìm quy luật thông thường, khái quát cao độ cô đặc. Hầu như mọi bệnh tật đều dùng bát cương phân tích quy nạp được. Bát cương là biện chứng tổng cương, hạt nhân của lý luận biện chứng luận trị, hình thành phát triển qua vài ngàn năm. Bát cương vận dụng khoa học vì bản thân hàm chứa tính duy vật biện chứng: biểu-lý, hàn-nhiệt, âm-dương, hư-thực — 4 cặp mâu thuẫn; phương pháp biện chứng hàn nhiệt/biểu lý thác tạp, âm dương chuyển hóa, hàn nhiệt hư thực có thể chỉ đạo tìm mâu thuẫn chủ yếu và chuyển hóa tương hỗ, phân rõ hiện tượng-bản chất. Do đó bát cương và các phương pháp biện chứng khác có quan hệ tầng thứ cao hơn 1 bậc — bát cương là nền tảng kim chỉ nam cho: biện chứng nguyên nhân bệnh, khí huyết tân dịch biện chứng, tạng phủ biện chứng, lục kinh biện chứng, vệ khí dinh huyết biện chứng, tam tiêu biện chứng.

BIỆN CHỨNG NGOẠI CẢM BỆNH VÀ TẠP BỆNH — phân chia phương pháp phù hợp:

**Dùng cho NGOẠI CẢM BIỆN CHỨNG:**
- Lục dâm và dịch lệ biện chứng (trong bệnh nhân biện chứng)
- Lục kinh biện chứng
- Vệ khí dinh huyết biện chứng
- Tam tiêu biện chứng
Trình tự: đầu tiên phân biệt có phải dịch lệ không, tiếp đến phân biện lục dâm tà khí. Lục dâm chia 2 thể lớn hàn-nhiệt: thuộc phong hàn → dùng lục kinh biện chứng; thuộc ôn nhiệt → dùng vệ khí dinh huyết biện chứng hoặc tam tiêu biện chứng. Dịch lệ chi tà có tính thời tiết, liên hệ khí hậu, cũng vận dụng 2 loại hàn-ôn biện chứng trên.

**Dùng cho TẠP BỆNH (nội ngoại phụ nhi khoa):**
- Khí huyết tân dịch biện chứng
- Kinh lạc biện chứng
- Tạng phủ biện chứng
Tạp bệnh biện chứng dùng tạng phủ biện chứng làm trung tâm — nếu triệu chứng khí huyết tân dịch nổi bật thì kết hợp khí huyết tân dịch biện chứng; nếu liên quan vị trí 12 kinh đi qua thì kết hợp kinh lạc biện chứng. Biện chứng cầu nhân là nguyên tắc quan trọng — khi dùng tạng phủ biện chứng cần kết hợp bệnh nhân biện chứng, đặc biệt khi thất tình ảnh hưởng gây bệnh càng cần coi trọng. Tạp bệnh cần kết hợp đặc điểm từng khoa và biện bệnh để biện chứng.`,
      keyPoints: "Bát cương là nền tảng/kim chỉ nam cho MỌI phương pháp biện chứng khác — tầng thứ cao hơn 1 bậc\nNgoại cảm bệnh: Lục dâm/dịch lệ → Lục kinh (phong hàn) hoặc Vệ khí dinh huyết/Tam tiêu (ôn nhiệt)\nTạp bệnh: Tạng phủ biện chứng làm trung tâm, kết hợp Khí huyết tân dịch và Kinh lạc biện chứng khi cần",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Bệnh Án Y Học Cổ Truyền - Nội Dung và Cách Ghi Chép",
      category: cat,
      summary: "Bệnh án YHCT gồm 4 phần chính (tứ chẩn, biện chứng, lập pháp, ra phương) với yêu cầu ghi chép cụ thể; mẫu bệnh án nằm viện đầy đủ gồm hành chính, vấn chẩn, vọng chẩn, văn chẩn, thiết chẩn, biện chứng luận trị, chẩn đoán.",
      content: `4 PHẦN CHÍNH CỦA BỆNH ÁN VÀ YÊU CẦU:

1. **Tứ chẩn**: ghi chép đầy đủ trung thực tư liệu vọng-văn-vấn-thiết. Tư liệu này là căn cứ của biện chứng — nên phân rõ chủ-thứ, có hệ thống, có trọng điểm, tránh liệt kê triệu chứng la liệt không phân chủ thứ, trùng lặp, bỏ sót.

2. **Biện chứng**: dựa vào tứ chẩn đã ghi, dựa chủ chứng/kiêm chứng/bệnh trước bệnh sau và tư liệu liên quan để tổng hợp nghiên cứu tìm nguyên nhân bệnh, bệnh cơ, tạng phủ kinh lạc, âm dương hư thực, khả năng biến hóa. Phải ghi rõ ràng trung thực tường tận, tránh sơ sài bỏ sót hoặc xa rời lý luận biện chứng YHCT, hoặc lý luận rỗng tếch xa rời thực tế. Phương pháp thường dùng: trước tiên khái niệm tổng hợp bệnh chứng, phân biệt ngoại cảm/nội thương. Ngoại cảm → phân biện thương hàn/ôn bệnh, biện biệt tam âm tam dương kinh/vệ khí dinh huyết/tam tiêu. Không ngoại cảm → biện biệt bệnh gì, tạng nào chính tạng nào phụ. Định vị bệnh xong → biện hàn nhiệt hư thực. Phải nắm được cả bệnh và chứng, biện biệt rõ ràng toàn diện.

3. **Lập pháp**: có được từ biện chứng, luôn gắn kết với biện chứng — biện chứng chính xác thì lập pháp chính xác. Ví dụ: chẩn đoán băng lậu + biện là tâm tỳ lưỡng hư → lập pháp bổ ích tâm tỳ, thống huyết chỉ lậu. Ví dụ khác: chẩn thu táo + biện lương táo → lập pháp tuyên phế nhuận táo hóa đàm. Nếu có kiêm chứng ngoài chủ bệnh, càng cần dựa tiêu-bản/trước-sau/hoãn-cấp của biện chứng mà lập pháp, theo sát biện chứng để không mâu thuẫn hoặc bỏ sót.

4. **Ra phương**: căn cứ lập pháp mà định phương (bao gồm cả châm cứu, xoa bóp...), có thể dùng cổ phương gia giảm hoặc tự chế phương mới — bất luận cổ phương/kim phương đều phải chịu sự chỉ đạo của biện chứng, đồng thời chú ý phân lượng nặng nhẹ, sắc trước sắc sau, dặn kỹ cách sắc cách uống. Phần y lệnh cần ghi rõ dặn dò, chế độ dinh dưỡng, hộ lý.

MẪU BỆNH ÁN NẰM VIỆN ĐẦY ĐỦ:
**Phần hành chính**: Họ tên, tuổi, giới tính, đã kết hôn chưa, quốc tịch, dân tộc, nghề nghiệp, đơn vị công tác, địa chỉ, ngày nhập viện, người mô tả bệnh, thời gian làm bệnh án, mùa phát bệnh, họ tên gia thuộc, điện thoại.

**1. Vấn chẩn**: (a) Chủ tố — triệu chứng chủ yếu bệnh nhân kể, ghi ngắn gọn 1 hoặc vài chủ chứng thống khổ nhất, rõ vị trí/tính chất/đặc điểm/thời gian. (b) Tình hình hiện tại — ghi kỹ thời gian phát bệnh, nhân tố kích phát, chứng hầu chủ yếu và kèm theo, đã điều trị gì, kết quả xét nghiệm; hỏi xung quanh chủ chứng dựa "Thập vấn". (c) Bệnh sử — tình hình sức khỏe, bệnh mạn tính. (d) Cá nhân sử — nghiện gì, thích/ghét ăn gì, điều kiện ăn ở sinh hoạt lao động, chích ngừa, (phụ nữ hỏi thêm kinh nguyệt/thai sản). (e) Bệnh sử gia đình — tình trạng sức khỏe thành viên, nguyên nhân tử vong nếu có.

**2. Vọng chẩn**: (a) Toàn thân — Thần (tỉnh táo/an tĩnh/hốt hoảng/cởi mở/trầm uất/si ngai/phiền thao), Sắc (khí sắc bình thường hay bệnh sắc xanh/đỏ/vàng/trắng/đen, tươi/tối/khô), Hình thái (động thái, cao lùn, mập ốm, cột sống thẳng/cong, lưng gù ngực gà, run, liệt, phù thũng, đi đứng nằm ngồi). (b) Bộ phận — Lưỡi (miêu tả kỹ hoặc vẽ hình), đầu mặt tóc mắt mũi tai môi răng lợi hầu họng cổ ngực bụng lưng da móng (trẻ em kiểm tra "Thực chỉ lạc mạch"/chỉ văn), vật bài tiết (màu/lượng/hình dạng phân, màu/lượng nước tiểu, màu/lượng/tính chất chất nôn, đàm dãi).

**3. Văn chẩn**: (a) Nghe — lời nói, hô hấp, ho, nôn, tiếng sôi ruột, trẻ khóc, tiếng ợ, tiếng hen, rên rỉ. (b) Ngửi — mùi từ miệng/mũi/thân thể, mùi phân/nước tiểu/đái hạ.

**4. Thiết chẩn**: (a) Bắt mạch — mạch tượng phải/trái, thốn quan xích, phù trung trầm nếu khác biệt. (b) Án chẩn — vùng đầu mặt/da/tứ chi/ngực bụng/lưng (nhiệt độ, độ ẩm), ấn đau/cự án, u cục vùng bụng, hạch cổ nách bẹn, huyệt vùng tai ấn đau, hư lý đập ra sao, phù thũng ấn lõm.

**5. Khám chuyên khoa** nếu cần.

**6. Biện chứng luận trị**: liệt kê căn cứ biện chứng (hệ thống hóa dữ liệu tứ chẩn liên quan), phân tích bệnh nhân/bệnh cơ (bao gồm thời tiết, ngũ vận, lục khí), đề ra nguyên tắc điều trị + phương dược cơ bản + phương pháp khác (châm cứu, xoa bóp), phương pháp hộ lý chính.

**7. Chẩn đoán**: tên bệnh chứng (và kiêm chứng), xét nghiệm hỗ trợ (nhiệt độ, huyết áp...), ngày tháng năm, ký tên.

**Theo dõi hàng ngày** (sau bệnh án nhập viện): bệnh tiến triển ra sao, triệu chứng hiện tại, lưỡi mạch (chỉ văn ở trẻ nhỏ) ghi vắn tắt nhưng đủ, thêm phần biện chứng luận trị, phương dược và xử lý khác ghi rõ ràng.`,
      keyPoints: "4 phần bệnh án: Tứ chẩn (dữ liệu) → Biện chứng (phân tích) → Lập pháp (nguyên tắc điều trị) → Ra phương (phương dược cụ thể) — phải nhất quán xuyên suốt, không mâu thuẫn\nMẫu bệnh án nằm viện đầy đủ: hành chính, vấn/vọng/văn/thiết chẩn chi tiết theo từng mục, biện chứng luận trị, chẩn đoán cuối, theo dõi hàng ngày",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  console.log("Đã thêm 3 chủ đề Chương 4: Chẩn Đoán và Bệnh Án.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
