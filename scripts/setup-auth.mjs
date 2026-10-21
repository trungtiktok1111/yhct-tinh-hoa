// Thiết lập một lần cho đăng nhập: AUTH_SECRET -> migration -> tài khoản Chủ -> deploy.
//   npm run setup-auth
// Chạy trên máy của bạn (cần .env có DATABASE_URL, DIRECT_URL và đã đăng nhập Vercel CLI).
import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, appendFileSync } from "node:fs";
import readline from "node:readline";

const run = (cmd, opts = {}) =>
  spawnSync(cmd, { shell: true, stdio: "inherit", ...opts });

function ask(question, { hidden = false } = {}) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    if (hidden) {
      rl._writeToOutput = (s) => {
        if (s.includes(question)) process.stdout.write(s);
      };
    }
    rl.question(question, (a) => {
      rl.close();
      if (hidden) process.stdout.write("\n");
      resolve(a.trim());
    });
  });
}

function step(n, text) {
  console.log(`\n=== Bước ${n}: ${text} ===`);
}

const env = existsSync(".env") ? readFileSync(".env", "utf8") : "";
if (!/^DATABASE_URL=/m.test(env) || !/^DIRECT_URL=/m.test(env)) {
  console.error("Thiếu DATABASE_URL hoặc DIRECT_URL trong file .env. Dừng.");
  process.exit(1);
}

// 1. AUTH_SECRET
step(1, "AUTH_SECRET");
let secret = env.match(/^AUTH_SECRET="?([^"\r\n]+)"?/m)?.[1];
if (secret && secret.length >= 32) {
  console.log("Đã có AUTH_SECRET trong .env.");
} else {
  secret = randomBytes(48).toString("base64");
  appendFileSync(".env", `\nAUTH_SECRET="${secret}"\n`);
  console.log("Đã tạo AUTH_SECRET và ghi vào .env.");
}
console.log("Đang đưa AUTH_SECRET lên Vercel (Production)...");
const v = run("npx vercel env add AUTH_SECRET production", { input: secret, stdio: ["pipe", "inherit", "inherit"] });
if (v.status !== 0) {
  console.log("Không thêm được (có thể đã tồn tại trên Vercel). Nếu chưa có, thêm tay: Vercel > Settings > Environment Variables > AUTH_SECRET.");
}

// 2. Migration
step(2, "Tạo bảng mới trên Supabase");
if (run("npx prisma migrate deploy").status !== 0) {
  console.error("Migration lỗi. Dừng, chưa deploy.");
  process.exit(1);
}

// 3. Tài khoản Chủ
step(3, "Tạo tài khoản Chủ");
const username = await ask("Tên đăng nhập (chữ thường, không dấu): ");
if (username) {
  const fullName = await ask("Họ tên: ");
  const pw = await ask("Mật khẩu (tối thiểu 8 ký tự): ", { hidden: true });
  const pw2 = await ask("Nhập lại mật khẩu: ", { hidden: true });
  if (pw !== pw2) {
    console.error("Hai mật khẩu không khớp. Chạy lại npm run setup-auth.");
    process.exit(1);
  }
  const r = run(`npx tsx scripts/create-owner.ts "${username}" "${fullName}"`, {
    env: { ...process.env, OWNER_PASSWORD: pw },
  });
  if (r.status !== 0) console.log("Không tạo được tài khoản (có thể tên đã tồn tại). Xem thông báo phía trên.");
} else {
  console.log("Bỏ qua tạo tài khoản.");
}

// 4. Deploy
step(4, "Deploy lên Vercel");
const go = (await ask("Deploy production ngay bây giờ? (y/n): ")).toLowerCase();
if (go === "y") {
  run("npx vercel --prod");
} else {
  console.log("Chưa deploy. Khi sẵn sàng: npx vercel --prod");
}
