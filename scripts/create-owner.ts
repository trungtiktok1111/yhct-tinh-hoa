// Tạo tài khoản Chủ đầu tiên (chạy một lần, từ máy có DATABASE_URL trong .env).
//   npx tsx scripts/create-owner.ts <tên-đăng-nhập> <mật-khẩu> "<Họ tên>"
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

async function main() {
  const [username, password, fullName] = process.argv.slice(2);
  if (!username || !password || !fullName) {
    console.error('Cách dùng: npx tsx scripts/create-owner.ts <tên-đăng-nhập> <mật-khẩu> "<Họ tên>"');
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("Mật khẩu tối thiểu 8 ký tự.");
    process.exit(1);
  }
  const prisma = new PrismaClient();
  try {
    const exists = await prisma.staff.findUnique({ where: { username: username.toLowerCase() } });
    if (exists) {
      console.error("Tên đăng nhập đã tồn tại.");
      process.exit(1);
    }
    const s = await prisma.staff.create({
      data: {
        username: username.toLowerCase(),
        fullName,
        role: "OWNER",
        passwordHash: await hashPassword(password),
      },
    });
    await prisma.auditLog.create({
      data: { action: "CREATE", entity: "Staff", entityId: s.id, detail: `${s.username} · OWNER (script)` },
    });
    console.log(`Đã tạo tài khoản Chủ: ${s.username}`);
  } finally {
    await prisma.$disconnect();
  }
}

main();
