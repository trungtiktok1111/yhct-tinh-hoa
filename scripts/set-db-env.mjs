// Ghi lại DATABASE_URL và DIRECT_URL cho đúng từ mật khẩu database Supabase, rồi đưa lên Vercel.
//   npm run set-db-env
// Mật khẩu chỉ gõ một lần (ẩn), không lưu ở đâu ngoài .env của bạn và biến môi trường Vercel.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import readline from "node:readline";

// Thông tin kết nối của project (không phải bí mật).
const PROJECT_REF = "evcxdzkljibtyehbyffh";
const HOST = "aws-0-ap-southeast-1.pooler.supabase.com";
const USER = `postgres.${PROJECT_REF}`;

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
      resolve(a);
    });
  });
}

const pw = (await ask("Mật khẩu database Supabase (mới đặt): ", { hidden: true })).trim();
const pw2 = (await ask("Nhập lại mật khẩu: ", { hidden: true })).trim();
if (!pw || pw !== pw2) {
  console.error("Mật khẩu trống hoặc hai lần nhập không khớp. Chạy lại.");
  process.exit(1);
}
if (/[\s"'\\]/.test(pw)) {
  console.error("Mật khẩu không được chứa khoảng trắng hoặc dấu nháy. Đặt lại mật khẩu chỉ gồm chữ và số.");
  process.exit(1);
}

const enc = encodeURIComponent(pw);
const databaseUrl = `postgresql://${USER}:${enc}@${HOST}:6543/postgres?pgbouncer=true`;
const directUrl = `postgresql://${USER}:${enc}@${HOST}:5432/postgres`;

// Ghi lại .env: bỏ mọi dòng DATABASE_URL, DIRECT_URL và dòng chú thích của Supabase, giữ phần còn lại.
const old = existsSync(".env") ? readFileSync(".env", "utf8") : "";
const kept = old
  .split(/\r?\n/)
  .filter((l) => !/^\s*(DATABASE_URL|DIRECT_URL)\s*=/.test(l) && !/^\s*#\s*Connect to Postgres/.test(l));
while (kept.length && kept[kept.length - 1] === "") kept.pop();
kept.push("", `DATABASE_URL="${databaseUrl}"`, `DIRECT_URL="${directUrl}"`, "");
writeFileSync(".env", kept.join("\n"));
console.log("Đã ghi lại DATABASE_URL và DIRECT_URL trong .env (mỗi biến một dòng).");

// Đưa lên Vercel (Production): xóa bản cũ rồi thêm bản mới.
for (const [name, value] of [["DATABASE_URL", databaseUrl], ["DIRECT_URL", directUrl]]) {
  spawnSync(`npx vercel env rm ${name} production --yes`, { shell: true, stdio: "ignore" });
  const r = spawnSync(`npx vercel env add ${name} production`, {
    shell: true,
    input: value,
    stdio: ["pipe", "inherit", "inherit"],
  });
  if (r.status !== 0) {
    console.error(`Không đưa được ${name} lên Vercel. Thêm tay: Vercel > Settings > Environment Variables.`);
  }
}
console.log("\nXong. Chạy tiếp: npm run setup-auth");
