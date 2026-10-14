// Nguồn: "Bệnh lý gân và bao hoạt dịch - Ts.Bs Lê Văn Thọ" (14 trang). Tài liệu thuần YHHĐ (giải phẫu bệnh,
// chẩn đoán hình ảnh, điều trị ngoại khoa/nội khoa các bệnh lý gân - bao gân - túi hoạt dịch - màng hoạt
// dịch), không có nội dung biện chứng luận trị YHCT. Theo đúng tiền lệ đã làm với "Hội chứng ống cổ chân"
// (nguồn chuyên khoa YHHĐ khác), các bệnh lý này được đưa vào làm Disease với nameModern, không gán Pattern
// (vì nguồn không cung cấp cơ sở biện chứng YHCT) — tránh suy diễn/bịa thêm lý luận YHCT không có trong bài.
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  let source = await prisma.source.findFirst({
    where: { title: { equals: "Bệnh lý gân và bao hoạt dịch", mode: "insensitive" } },
  });
  if (!source) {
    source = await prisma.source.create({
      data: {
        title: "Bệnh lý gân và bao hoạt dịch",
        authorOrOrg: "Ts.Bs. Lê Văn Thọ",
        sourceType: "Tài liệu giảng dạy chuyên khoa",
        locator: "14 trang",
      },
    });
  }

  const diseases: {
    name: string;
    nameModern: string;
    definition: string;
    cause: string;
    mechanism?: string;
    symptoms: string;
    differential?: string;
  }[] = [
    {
      name: "Viêm bao gân",
      nameModern: "Tendon Sheath Inflammation; Tenosynovitis",
      definition:
        "Gân là mô sợi kết nối cơ vào xương, giúp kiểm soát các hoạt động như chạy, nhảy, cầm nắm và nâng. Một lớp vỏ bảo vệ gọi là màng hoạt dịch bao phủ các gân, tạo ra chất lỏng hoạt dịch giữ cho gân được bôi trơn. Viêm bao gân là tình trạng viêm hoặc sưng của bao gân, xảy ra khi tổn thương gân dẫn đến tổn thương bao gân, khiến bao gân không tạo ra hoặc không tạo đủ chất lỏng hoạt dịch.",
      cause:
        "(1) Chấn thương gân-cơ-xương vùng tổn thương: thường xảy ra ở vận động viên và người thực hiện nhiều hoạt động lặp đi lặp lại (công việc dây chuyền lắp ráp, đánh máy, thợ mộc, nhạc công, nhân viên văn phòng), phổ biến nhất ở gân cổ tay, bàn tay và bàn chân. (2) Bệnh lý nền: dễ xảy ra ở bệnh nhân có bệnh lý mạn tính như viêm khớp dạng thấp, xơ cứng bì, bệnh gout, bệnh tiểu đường, viêm khớp phản ứng (hội chứng Reiter), bệnh da liễu. (3) Không xác định được nguyên nhân ở một số bệnh nhân. (4) Hiếm gặp: do nhiễm trùng từ vết cắt hoặc vết đâm vào gân.",
      symptoms:
        "Viêm bao gân do chấn thương thường xảy ra ở bàn tay, cổ tay, bàn chân; cũng có thể gặp ở vai, cổ tay, vùng gối. Triệu chứng thường gặp: cứng khớp, hạn chế vận động khớp, sưng đau khớp, có thể sưng đỏ kèm sốt nếu kèm nhiễm trùng. Cận lâm sàng: siêu âm, MRI để xác định chẩn đoán hoặc loại trừ nguyên nhân khác như viêm khớp. Điều trị: nẹp bất động, chườm nóng/lạnh, mát xa, kéo dãn gân, kích thích điện thần kinh qua da (TENS), siêu âm trị liệu; NSAID hoặc tiêm corticosteroid vào bao gân (thường thành công nếu không nhiễm trùng); phẫu thuật giải phóng bao gân trong một số trường hợp; kháng sinh nếu có nhiễm trùng; điều trị bệnh lý nền đi kèm. Vật lý trị liệu tăng cường sức cơ sau khi lành để phòng ngừa tái phát. Một số bệnh lý viêm gân-viêm bao gân thường gặp: viêm gân De Quervain (De Quervain's tenosynovitis), ngón tay bật (trigger finger/A1 pulley), viêm gân cơ chóp xoay, viêm gân cơ nhị đầu, viêm gân cơ tứ đầu đùi, viêm gân bánh chè, viêm gân cơ chân ngỗng, viêm nơi bám gân duỗi cổ tay trụ, viêm nơi bám gân lồi cầu ngoài/trong (tennis elbow, golf's elbow), viêm nơi bám gân Achilles, viêm cân gan chân.",
    },
    {
      name: "Viêm gân cổ tay",
      nameModern: "Tendonitis of wrist",
      definition:
        "Viêm gân cổ tay xảy ra khi một chấn thương đột ngột gây bong gân, hoặc các hoạt động lặp đi lặp lại khiến gân cọ xát với xương, dẫn đến viêm nơi bám của gân. Không nhất thiết chỉ giới hạn ở một gân hoặc một phần của cổ tay — có nhiều gân bao quanh khớp cổ tay chịu trách nhiệm các vận động phức tạp, tinh tế ở cổ tay, bàn tay và ngón tay có thể bị tổn thương và viêm.",
      cause:
        "Khi các gân cổ tay, bàn tay hoạt động bình thường, chúng trượt trong một lớp bao gân có chất lỏng hoạt dịch để tạo chuyển động không ma sát. Tổn thương hoặc viêm của gân khiến bao gân dày lên, gân phì đại hình thành cục xơ gân và hạn chế khả năng vận động. Nguyên nhân phổ biến nhất là những chuyển động dù đơn giản nhưng lặp đi lặp lại gây cọ sát lên gân theo thời gian.",
      symptoms:
        "Đau và hạn chế vận động cổ tay, bàn tay, ngón tay, nhất là vào buổi sáng, kèm sưng nhẹ. Ấn vào gân viêm gây đau, có thể nghe tiếng 'lụp cụp' khi vận động. Cơn đau thường âm ỉ, thụ động hơn là dữ dội, có thể hạn chế hoạt động thường ngày. Điều trị: nẹp bất động vùng gân viêm, tập kéo dãn gân, liệu pháp nóng/lạnh, acetaminophen và NSAID, tiêm corticosteroid, vật lý trị liệu; phẫu thuật trong trường hợp nghiêm trọng (hiếm cần). Giảm/cải thiện hoạt động lặp lại hằng ngày giúp giảm stress cho gân.",
      differential:
        "Cần chẩn đoán phân biệt với viêm khớp cổ tay và hội chứng ống cổ tay.",
    },
    {
      name: "Viêm túi hoạt dịch",
      nameModern: "Bursitis",
      definition:
        "Viêm túi hoạt dịch là bệnh lý viêm của túi hoạt dịch — một túi nhỏ chứa chất lỏng hoạt dịch, đóng vai trò như tấm đệm giữa xương và mô mềm (cơ, gân, da), làm giảm ma sát và hỗ trợ vận động khớp. Khi sử dụng quá mức hoặc do chấn thương, túi hoạt dịch có thể bị kích thích gây viêm, chứa đầy chất hoạt dịch viêm dư thừa, gây đau đáng kể và hạn chế cử động.",
      cause:
        "Chấn thương, áp lực lặp đi lặp lại và sử dụng quá mức là nguyên nhân phổ biến (đóng gói dây chuyền sản xuất, đánh máy, chạy bộ, tennis...). Một số bệnh lý đi kèm như viêm khớp dạng thấp, bệnh gút, bệnh tiểu đường cũng góp phần. Thừa cân làm tăng nguy cơ viêm túi hoạt dịch khớp háng và khớp gối. Cũng có thể do nhiễm trùng.",
      symptoms:
        "Đau, sưng cục bộ vùng viêm, sờ ấm kèm đỏ da bề mặt, đau nhiều về đêm và tăng khi vận động. Vai, khuỷu tay, hông, gối và gót chân là vị trí phổ biến nhất. Chẩn đoán: khối sưng đỏ mềm hoặc căng chứa dịch, sờ ấm; X-quang, siêu âm, chọc hút dịch để xác nhận hoặc loại trừ. Điều trị: thuốc giảm đau, chườm lạnh, bài tập vận động nhẹ nhàng, nghỉ ngơi; thuốc chống viêm hoặc tiêm corticosteroid nếu đau nhiều; kháng sinh nếu nhiễm trùng; phẫu thuật cắt túi hoạt mạc viêm nếu điều trị bảo tồn thất bại. Theo dõi lâu dài: chuyên khoa CTCH, vật lý trị liệu, bệnh nghề nghiệp giúp giảm nguy cơ tái phát. Các vị trí viêm túi hoạt dịch thường gặp: dưới cơ dưới vai/dưới mỏm cùng, vùng khuỷu, vùng mấu chuyển lớn, vùng ụ ngồi, vùng gối, vùng gân gót.",
    },
    {
      name: "Bọc hoạt dịch",
      nameModern: "Ganglion; ganglion cyst",
      definition:
        "Bọc hoạt dịch là tổn thương thường gặp trong thực tế lâm sàng, chứa dịch nhầy như dầu máy dùng để bôi trơn. Là một tổn thương giả bướu, chứa dịch nhầy mucopolysaccharide, không có sự tăng sinh của tế bào — khác biệt với bướu nhầy (tổn thương có tế bào nhầy tăng sinh và xâm nhập, rất hiếm tạo bọc). Bọc hoạt dịch được hình thành do sự thoái hóa nhầy của mô liên kết: chất nhầy được tạo ra nhiều bởi các nguyên bào sợi, tập hợp lại hình thành bọc có 1 hoặc nhiều ngăn; vách bọc không được lót bởi màng khớp mà bằng mô sợi, và tổn thương không thông với ổ khớp (trừ khi phẫu thuật viên cố ý cắt hết tổn thương làm lộ khớp).",
      cause:
        "Tổn thương thường dính vào màng bao khớp, màng gân, đôi khi nằm trong gân cơ, cơ trên sụn bán nguyệt. Thường gặp nhất ở người trẻ tuổi, nhất là phụ nữ, 25-45 tuổi; tiền sử chấn thương gặp trong 50% trường hợp.",
      symptoms:
        "Tổn thương thường gặp nhất ở lưng cổ tay, sát phía ngoài các gân duỗi chung ngón tay; vị trí hay gặp thứ nhì là mặt lòng cổ tay giữa gân cơ gập cổ tay quay và dang ngón tay cái dài (cần bảo vệ động mạch quay khi cắt bọc). Cũng có thể thấy ở lòng ngón tay, bàn tay, mặt lưng bàn chân, mô dưới da đầu ngón tay, vùng gối. 50-70% xảy ra ở cổ và bàn tay. Phân nửa trường hợp kèm đau, nhức nhẹ, ảnh hưởng chức năng. Kích thước thường 1,5-2,5cm đường kính, chứa dịch nhầy trong. Hình ảnh y học: siêu âm, CT, MRI phát hiện dễ dàng tổn thương dạng bọc có vách chứa dịch (MRI: tín hiệu thấp trên T1, rất cao trên T2; siêu âm: khối mất âm với tăng âm phía sau). Vị trí là đặc tính quan trọng giúp nghĩ đến bọc hoạt dịch. Xử trí: không cần sinh thiết để chẩn đoán; hầu hết điều trị bằng phương pháp không phẫu thuật hoặc cắt bỏ tổn thương, đôi khi tự biến mất, đôi khi tái phát sau bóp bể hoặc chọc hút dịch. Điều trị ưa chuộng là cắt trọn tổn thương với viền mô màng khớp/màng gân ở dưới đáy (tỷ lệ tái phát thấp). Theo Nelson và cs, tỷ lệ trị khỏi 94% sau mổ với gây mê hoặc tê từng nách, 84% với gây tê tại chỗ có ga-rô, 65% bằng bóp bể hay chích bể bọc sau chích cortisone.",
    },
    {
      name: "Bọc màng hoạt dịch",
      nameModern: "Synovial cyst; Baker's cyst",
      definition:
        "Bọc màng hoạt dịch hầu hết gặp ở khoeo chân, còn gọi là Bọc Baker từ khi Baker mô tả bệnh năm 1887 (trước đó Adams đã mô tả tổn thương này năm 1840). Hầu hết bọc Baker là do túi hoạt dịch giãn rộng (có thể gọi là bọc túi hoạt dịch). Rất nhiều túi hoạt dịch hiện diện ở vùng khoeo giữa các gân chân ngỗng và dây chằng bên hay mâm chày, và rất sâu ở mỗi đầu cơ sinh đôi (gastrocnemius). Triệu chứng thường xảy ra nhất ở túi hoạt dịch nằm dưới đầu trong cơ sinh đôi hoặc túi hoạt dịch cơ bán màng.",
      cause:
        "Theo Meyerdin & Van Demark, bọc Baker có thể do: (1) thoát vị của màng khớp qua phần sau bao khớp gối, hoặc (2) dịch từ khớp gối thoát qua đường thông nối bình thường vào túi hoạt dịch. Burleson, Bickel & Dahlin ghi nhận trong 83 trường hợp bọc Baker: 46 xuất phát từ túi hoạt dịch, 26 do thoát vị qua phần sau bao khớp, 11 từ vị trí không xác định; có sự thông thương rõ rệt giữa bọc màng hoạt dịch và khớp gối trong 54 trường hợp. Bọc màng hoạt dịch lót bởi màng trung biểu mô (màng khớp, màng túi hoạt dịch) trụ cao hoặc dẹt tùy tế bào có hoạt động hay không.",
      symptoms:
        "Tổn thương ở khoeo chân, giới hạn rõ, sờ có cảm giác căng chứa dịch, lộ rõ khi duỗi gối và 'chui' vào khớp khi gập gối (đặc điểm quan trọng để chẩn đoán phân biệt với các khối u phần mềm khác). Bọc có thể gây cảm giác căng, tức, khó chịu hoặc mỏi; có thể rất lớn lan xuống bắp chân gây căng tức, đau nhất, có thể nhầm với viêm kèm huyết khối tĩnh mạch. Hình ảnh y học giống bọc hoạt dịch nhưng thấy được thông nối với ổ khớp. Xử trí gồm điều trị (1) bệnh lý trong khớp đi kèm (thấp khớp, lao khớp, nhuyễn sụn khớp chè-đùi, rách sừng sau sụn chêm trong...) bằng lâm sàng, hình ảnh y học, xét nghiệm máu và dịch chọc hút, điều trị chuyên biệt nội khoa và/hoặc phẫu thuật; và (2) bọc màng hoạt dịch bằng chọc hút dịch + tiêm corticoid (sau khi loại trừ nhiễm trùng) hoặc cắt bỏ tổn thương. Ở trẻ em (33-50% trường hợp), hiếm có thông thương với ổ khớp và hiếm bệnh lý trong khớp đi kèm — cắt bỏ bọc cho kết quả rất tốt, hầu như không tái phát (Touloukian & Malloch); bọc hiếm gặp sau 7 tuổi và có thể tự biến mất (Gristina & Wilson). Ở người trưởng thành, 50% bọc liên quan bệnh lý trong khớp nên nếu không giải quyết tốt bệnh lý này thì bọc có thể tái phát. Trong viêm khớp dạng thấp, bọc Baker có thể rất lớn, lan xuống bắp chân, khởi phát từ màng khớp và thông với ổ khớp gối — sau cắt bỏ bọc cần cắt bỏ màng khớp để tránh tái phát. Sau cắt bọc, cần cắt bỏ hết túi hoạt dịch, đóng lỗ thông với ổ khớp bằng xơ hóa/khâu chỉ/khâu che bằng gân cơ hoặc để trống; sau mổ bất động khớp gối bằng nẹp, băng thun, cho đi chịu sức nặng; ngày đầu sau mổ tập đưa thẳng cẳng chân lên cao và tập cơ tứ đầu đùi; khi hết viêm cấp, tháo dụng cụ bất động và tập gập duỗi gối chủ động.",
    },
    {
      name: "Bướu đại bào màng gân",
      nameModern: "Giant cell tumor of tendon sheath; Tenosynovial giant cell tumor",
      definition:
        "Bướu đại bào màng gân (BĐBMG) là một tổn thương phản ứng lành tính tương tự PVNS, có thể xuất phát từ bao gân (tendon sheath) hoặc từ màng hoạt dịch (synovium). Thường gặp nhất ở bệnh nhân 30-50 tuổi, là loại u lành tính phổ biến thứ hai sau bọc hoạt dịch ở bàn tay. BĐBMG biểu hiện sự tăng sinh khu trú hoặc lan tỏa của các tế bào giống hoạt mạc, đại bào, tế bào viêm và tế bào xanthoma dọc theo bao gân. Bướu tiến triển chậm, không di căn nhưng tái phát tại chỗ sau cắt bỏ thay đổi từ 4% đến 44%.",
      cause:
        "Tần xuất khá thường gặp, nữ nhiều hơn nam, tuổi 30-50. Vị trí thường gặp ở bàn tay và cổ tay, các khớp liên đốt ngón tay (65-89%), bàn chân và mắt cá chân (5-15%).",
      mechanism:
        "Đại thể: bướu kích thước thường dưới 4cm, nhiều thùy, màu trắng xám hoặc vàng nâu do có tế bào xanthoma và tinh thể hemosiderin. Vi thể: tế bào đơn nhân có hạt nhân nhỏ, tròn hoặc thuôn dài, ít phân bào, các đại bào đa nhân và tế bào Xanthoma, rất hiếm thấy hoại tử. Tiên lượng: bướu lành tính, rất hiếm chuyển hóa ác tính; có thể ăn mòn gây khuyết xương hoặc tiến triển ra sát da. Tỷ lệ tái phát 4-44%, thường gặp ở tổn thương lan tỏa hoặc vị trí đầu ngón, hoặc tổn thương bao bọc cả gân gập và gân duỗi hoặc chui vào khớp, tuy nhiên không bao giờ di căn.",
      symptoms:
        "Khối tổn thương tiến triển chậm ở bàn tay, thường không triệu chứng, hay xảy ra trong phần mềm bao quanh gân; một số trường hợp gây đau và hạn chế vận động khớp. Hình ảnh y học: Xquang thấy bóng mờ trong phần mềm vùng bướu, có thể gây khuyết xương/ăn mòn xương vùng liên quan, có thể có nốt ngấm calci. MRI: mô bướu tín hiệu tương đồng mô cơ trên T1, tín hiệu thấp đến trung bình trên T2, có hình ảnh lắng đọng tinh thể hemosiderin, bắt thuốc mạnh sau tiêm thuốc cản quang. Điều trị: phẫu thuật cắt trọn bướu là cần thiết; trường hợp tái phát có thể phẫu thuật cắt bướu tái phát.",
      differential:
        "Sarcoma tế bào sáng (Clear cell sarcoma); Bướu sợi của bao gân (Fibroma of tendon sheath); Bướu sợi bì (Dermatofibroma); Sarcoma biểu mô (Epithelial sarcoma).",
    },
    {
      name: "Viêm hoạt mạc mao trạng dạng nốt nhiễm sắc tố",
      nameModern: "Pigmented villonodular synovitis (PVNS); viêm màng hoạt dịch nhung mao sắc tố",
      definition:
        "PVNS là hiện tượng tăng sinh mô bào sợi, phá hủy với sự sản sinh ra các nốt lồi dạng nhung mao của màng hoạt dịch khớp và ngoài khớp. Về vi thể, tổn thương gồm các nguyên bào sợi, mô bào và thâm nhiễm tế bào viêm, có lắng đọng tinh thể hemosiderin (nguyên nhân tạo màu nâu). Tổn thương PVNS có thể liên quan đến khớp, túi hoạt dịch, bao gân, mô cân và dây chằng lân cận. Năm 1941, Jaffe và cs phân chia PVNS thành các dạng theo vị trí và mức độ: (1) trong khớp — dạng lan tỏa (diffuse involvement of joint synovium) hoặc khu trú (localized/polypoid or nodular joint synovial lesion); (2) ngoài khớp — dạng lan tỏa (diffuse multifocal involvement of extraarticular synovial membrane/tendons) hoặc dạng nốt (localized extraarticular nodular lesion, cũng gọi là giant cell tumor of the tendon sheath). Thực tế lâm sàng thường có sự tồn tại của cả 2 dạng nốt và lan tỏa trong cùng một tổn thương PVNS. Trước đây cho rằng PVNS là tình trạng viêm phản ứng; tuy nhiên trong một số rất ít trường hợp, PVNS tiến triển có đặc tính tấn công, gây hủy xương và dễ tái phát, làm tăng nghi ngờ khả năng chuyển hóa ác tính độ ác thấp, có tính tấn công tại chỗ.",
      cause:
        "Bệnh khá hiếm gặp, chiếm 5% tổn thương bướu phần mềm nguyên phát. Tuổi thường gặp 25-45. Thể trong khớp (2 thể lan tỏa và khu trú) thường gặp ở khớp lớn chịu lực: gối 80%, háng 15%, hiếm gặp vị trí khác. Thể ngoài khớp thường gặp vùng cổ bàn ngón tay, mô mềm xương cùng.",
      symptoms:
        "Đau, sưng khớp và hạn chế cử động. Tràn dịch khớp thường xuyên, dịch chọc hút thường màu nâu đỏ, giống xuất huyết. Bệnh nhân thường có tiền sử tương đối lâu, triệu chứng kéo dài 2-3 năm; triệu chứng có thể không liên tục hoặc tiến triển đều đặn. Hình ảnh y học: X-quang thể ngoài khớp thấy khối bóng mờ trong phần mềm gần khớp giới hạn không rõ, đôi khi mòn xương/khuyết xương (nhất là tổn thương ở bàn ngón tay); thể trong khớp thường đi kèm thoái hóa khớp và nhiều bọc xương dưới sụn ở cả 2 mặt khớp, rõ nhất ở khớp gối. CT Scan và MRI cho thấy mức độ tổn thương, hữu ích đánh giá tổn thương khu trú trong khớp lớn; MRI cho thấy khối không đồng nhất tín hiệu thấp trên T1, khoảng trống tín hiệu liên quan lắng đọng hemosiderin; khuyết/ăn mòn xương do chèn ép hay gặp. Đại thể: chẩn đoán kết hợp lâm sàng - đại thể - vi thể, đánh giá đại thể khối tổn thương trong mổ rất quan trọng. Thể trong khớp dạng lan tỏa: hầu hết hoạt mạc bị tổn thương, nốt nhú màu nâu vàng lớn nhỏ không đều, bao khớp dày, giới hạn không rõ với mô mềm quanh khớp và xương-sụn kế cận, sụn khớp và xương dưới sụn thường bị bào mòn. Thể trong khớp dạng khu trú: một nốt rời rạc hoặc nhiều nốt có cuống nhô vào trong khớp. Thể ngoài khớp: đại thể tương tự thể trong khớp. Điều trị: đặc điểm PVNS là xâm lấn tại chỗ, tái phát nhiều lần, bào mòn xương và sụn khớp, suy giảm chức năng khớp — cần phẫu thuật triệt để, cắt bỏ bao hoạt dịch bị tổn thương; một số trường hợp nặng có thể xạ trị liều thấp để kiểm soát bệnh và ngăn tái phát. Chuyển hóa ác tính rất hiếm gặp, nếu có thường là bướu đại bào ác tính của màng hoạt dịch (malignant giant cell tumor of synovium).",
      differential:
        "Viêm khớp dạng thấp; thoái hóa khớp; viêm màng hoạt dịch phản ứng sau chấn thương.",
    },
    {
      name: "Chuyển sản sụn của màng khớp",
      nameModern: "Synovial chondrometaplasia; Synovial chondromatosis",
      definition:
        "Chuyển sản sụn của màng khớp là tình trạng chuyển sản liên quan đến màng hoạt dịch của khớp hoặc bao gân, trong đó nhiều nốt sụn được tạo ra; các nốt sụn sau đó tách ra khỏi màng hoạt dịch và rơi vào trong khớp. Quá trình này thường lan rộng ở màng hoạt dịch, có xu hướng tái phát cao và có thể ảnh hưởng nghiêm trọng đến chức năng khớp. Cơ chế bệnh sinh chính xác chưa rõ, nhưng có liên quan đến các tế bào gốc tạo sụn (chondroprogenitor cells) với sự rối loạn điều hòa đường truyền tín hiệu và biểu hiện quá mức của BMP2 và BMP4; biểu hiện quá mức của FGFR3 (điều hòa hoạt động tế bào gốc tạo sụn) và FGF9 đã được xác định trong các tế bào tăng sinh ở ngoại vi các nốt sụn.",
      cause:
        "Bệnh tương đối ít gặp, dữ liệu về tỷ lệ mắc bệnh thực sự không có sẵn. Tuổi mắc bệnh thường 40-60, nam gặp nhiều hơn nữ (tỉ lệ 2:1). Bệnh thường liên quan đến các khớp chịu trọng lượng lớn, nhiều nhất khớp gối (70%), kế đến khớp háng, khuỷu, vai, cổ chân. Khoảng 10% trường hợp bệnh xuất hiện 2 bên.",
      symptoms:
        "Đau, sưng và giới hạn vận động khớp là triệu chứng thường gặp. Bệnh nhân thường có triệu chứng kéo dài từ vài tháng đến nhiều năm (trung bình 2-5 năm). Hình ảnh y học: X-quang nếu khoáng hóa chất nền sụn đầy đủ cho hình ảnh đặc trưng nhiều 'loose bodies', chẩn đoán dễ dàng trước phẫu thuật; khoảng 10% trường hợp không ghi nhận vôi hóa nào. Trong trường hợp điển hình ở khớp lớn, bệnh biểu hiện dạng nốt sụn trong khớp hoặc quanh khớp với nốt vôi hóa hình vòng/hình nhẫn; mức độ khoáng hóa tăng dần nếu không điều trị; tổn thương cũ vôi hóa nhiều, dễ nhận biết trên X-quang. Bào mòn xương có thể xuất hiện nhưng không phải dấu hiệu tấn công của bệnh. CT scan và MRI hữu ích xác định tổn thương giai đoạn đầu khi chưa đủ ngấm khoáng để thấy trên X-quang; giai đoạn sau giúp đánh giá mức độ tổn thương trong khớp và cấu trúc lân cận. Đại thể: giai đoạn tiến triển có nhiều nốt sụn liên quan màng hoạt dịch, kích thước từ rất nhỏ (<1mm) đến lớn hơn 1-2cm; tổn thương lan tỏa giai đoạn muộn có nhiều nốt sụn tự do hoặc liên kết lấp đầy khoang khớp; trường hợp kéo dài, túi hoạt dịch hoặc gân kế cận cũng có thể bị tổn thương. Tổn thương chuyển sản sụn ngoài khớp rất hiếm gặp. Điều trị: phẫu thuật lấy bỏ các 'loose bodies' và cắt màng hoạt dịch là cần thiết; theo dõi sau mổ quan trọng. Nhiều trường hợp bệnh tự giới hạn, sau nhiều năm tổn thương đạt giai đoạn yên tĩnh, không còn hoạt động trong bao khớp. Cắt bỏ 'loose bodies' và màng hoạt dịch liên quan thường đủ kiểm soát bệnh trong phần lớn trường hợp; tái phát nhiều lần trong khoảng thời gian ngắn làm tăng nghi ngờ chuyển hóa ác tính thành sacôm màng khớp, nhưng rất hiếm.",
    },
  ];

  for (const d of diseases) {
    const existing = await prisma.disease.findFirst({
      where: { name: { equals: d.name, mode: "insensitive" } },
    });
    if (existing) {
      console.log(`ĐÃ TỒN TẠI, bỏ qua: ${d.name}`);
      continue;
    }
    await prisma.disease.create({
      data: {
        name: d.name,
        nameModern: d.nameModern,
        definition: d.definition,
        cause: d.cause,
        mechanism: d.mechanism,
        symptoms: d.symptoms,
        differential: d.differential,
        sourceId: source.id,
      },
    });
    console.log(`Đã tạo Disease: ${d.name}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
