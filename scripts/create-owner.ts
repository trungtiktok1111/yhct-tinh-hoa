// Tạo tài khoản Chủ đầu tiên (chạy một lần, từ máy có DATABASE_URL trong .env).
//   npx tsx scripts/create-owner.ts <tên-đăng-nhập> <mật-khẩu> "<Họ tên>"
// Hoặc đặt mật khẩu qua biến môi trường OWNER_PASSWORD:
//   npx tsx scripts/create-owner.ts <tên-đăng-nhập> "<Họ tên>"
import { existsSync, readFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

// Tự đọc .env (Prisma Client không tự đọc khi chạy qua tsx).
function loadDotEnv() {
  if (!existsSync(".env")) return;
  for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m || line.trim().startsWith("#")) continue;
    let v = m[2];
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (process.env[m[1]] === undefined) process.env[m[1]] = v;
  }
}

async function main() {
  loadDotEnv();
  const args = process.argv.slice(2);
  const fromEnv = process.env.OWNER_PASSWORD;
  const [username, password, fullName] = fromEnv ? [args[0], fromEnv, args[1]] : args;
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
