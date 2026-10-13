# YHCT Tinh Hoa — bản demo kỹ thuật

> **Dữ liệu trong bản demo này là dữ liệu minh họa (DEMO), không dùng để chẩn đoán hoặc điều trị thật.**
> Đây là MVP chứng minh kiến trúc theo "ƯU TIÊN SỐ 1" của tài liệu đặc tả: một luồng dọc hoàn chỉnh
> Bệnh học → Chứng hậu → Pháp trị → Bài thuốc → Vị thuốc → Nguồn, có thể truy vết hai chiều.

## Cài đặt & chạy local

Yêu cầu: Node.js 20+.

```bash
npm install
npx prisma migrate dev   # tạo database SQLite (prisma/dev.db) theo schema
npm run seed              # nạp dữ liệu DEMO (có thể chạy lại, sẽ xoá và tạo lại dữ liệu demo)
npm run dev                # chạy tại http://localhost:3000
```

Không cần tài khoản đăng nhập ở bản demo này (đã chọn phương án "mở, không đăng nhập" cho giai đoạn đầu).

## Cấu hình môi trường

File `.env`:
```
DATABASE_URL="file:./dev.db"
```

### Chuyển sang Supabase (Postgres) khi sẵn sàng triển khai thật
1. Tạo project trên Supabase (bạn tự làm — việc tạo tài khoản ngoài cần bạn thực hiện).
2. Lấy connection string Postgres, đặt vào `DATABASE_URL` trong `.env` (hoặc biến môi trường trên Vercel).
3. Trong `prisma/schema.prisma`, đổi `provider = "sqlite"` thành `provider = "postgresql"`.
4. Chạy lại `npx prisma migrate dev` (hoặc `prisma migrate deploy` trên production) để tạo schema trên Postgres.
5. Deploy phần Next.js lên Vercel (kết nối repo GitHub, Vercel tự build/deploy khi push).

## Trạng thái chức năng (theo mục 13.3 của tài liệu đặc tả)

| Phân hệ | Trạng thái |
|---|---|
| Tổng quan, tìm kiếm toàn cục | Hoàn thành (cơ bản) |
| Bệnh học (CRUD, liên kết chứng hậu) | Hoàn thành (cơ bản) |
| Chứng hậu (CRUD, liên kết bệnh/pháp trị) | Hoàn thành (cơ bản) |
| Pháp trị (CRUD, liên kết chứng hậu/bài thuốc) | Hoàn thành (cơ bản) |
| Bài thuốc (CRUD, quân thần tá sứ) | Hoàn thành (cơ bản) |
| Vị thuốc (CRUD, truy ngược về bài thuốc) | Hoàn thành (cơ bản) |
| Châm cứu / Huyệt vị (CRUD) | Hoàn thành (cơ bản) |
| Xoa bóp – Bấm huyệt / phương pháp khác | Một phần — chỉ có danh sách + thêm mới, chưa có trang chi tiết riêng |
| Thư viện tài liệu / Nguồn | Hoàn thành (cơ bản) |
| Ca lâm sàng & Biện chứng luận trị theo từng bước | Một phần — có nhập tứ chẩn, đối chiếu chứng hậu (so khớp từ khóa, KHÔNG phải suy luận lâm sàng thật), xác nhận kết luận, nối pháp trị/bài thuốc, theo dõi điều trị. Chưa phân quyền, chưa ẩn danh hóa chặt |
| Mạng lưới tri thức (sơ đồ nút–cạnh) | **Chưa làm** — chỉ điều hướng qua liên kết trang chi tiết |
| Trợ lý AI / RAG có trích dẫn | **Chưa làm** |
| Đăng nhập, phân quyền theo vai trò | **Chưa làm** — bản demo mở, ai cũng xem/sửa được |
| Quy trình thẩm định (chuyển trạng thái thực sự, không chỉ đặt lúc tạo) | **Chưa làm** |
| Audit log, sao lưu/khôi phục | **Chưa làm** |

Bảng trạng thái theo từng bản ghi (bản nháp / chờ thẩm định / đã duyệt...) xem tại `/quan-tri` trong app.

## Dữ liệu seed

`prisma/seed.ts` nạp dữ liệu minh họa ban đầu (kiến thức lý luận YHCT kinh điển phổ biến, không trích từ
tài liệu riêng của người dùng) để chứng minh chuỗi liên kết bệnh → chứng hậu → pháp trị → bài thuốc →
vị thuốc → huyệt → nguồn hoạt động đúng.

Phần **Quế chi thang / Ma hoàng thang / chứng Thái dương trúng phong (biểu hư) / Thái dương thương hàn
(biểu thực)** sau đó đã được đối chiếu và sửa lại theo đúng nguyên văn trích từ file thật của người dùng:
`D:\Tài liệu đông y\tài liệu y học\BỆNH HỌC YHCT\LÝ LUẬN YHCT - R\thuong han luan Full (Repaired).pdf`
(điều 12–13, tr.42–44 và điều 35, tr.67) — kể cả phát hiện và sửa một lỗi phân loại chứng hậu trong bản
DEMO ban đầu (Quế chi thang là biểu hư có mồ hôi, không phải biểu thực không mồ hôi như seed cũ ghi nhầm).

Các mục khác (Pháp trị, Vị thuốc còn lại, Huyệt vị) **vẫn là dữ liệu DEMO** chưa đối chiếu nguồn thật —
trước khi dùng cho mục đích thật, toàn bộ nội dung chuyên môn phải được đối chiếu lại với tài liệu chính
thức và được chuyên gia thẩm định.

## Ghi chú kiến trúc

- Next.js 14 (App Router) + Prisma + SQLite (dev) — xem phần "Chuyển sang Supabase" ở trên để đổi sang Postgres.
- Dùng Server Actions cho các thao tác ghi (tạo/liên kết), không có API REST riêng ở bản demo này.
- `npm audit` hiện báo một số lỗ hổng trong Next.js 14.x (đã cập nhật lên bản vá mới nhất trong nhánh 14,
  nhưng nâng cấp triệt để cần lên Next.js 15/16 — là thay đổi lớn, chưa làm ở bản demo). **Cần xử lý trước khi
  đưa ra production thật**, đặc biệt nếu bật tính năng Server Actions công khai trên internet.
