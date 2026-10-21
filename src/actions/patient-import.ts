"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { logAudit, requireRole } from "@/lib/auth";
import { PATIENT_ROLES } from "@/lib/permissions";

function splitCsv(line: string, sep: string) {
  const out: string[] = [];
  let cur = "";
  let q = false;
  for (const ch of line) {
    if (ch === '"') q = !q;
    else if (ch === sep && !q) { out.push(cur.trim()); cur = ""; }
    else cur += ch;
  }
  out.push(cur.trim());
  return out;
}

// Nhập bệnh nhân từ CSV: Họ tên, Ngày sinh (dd/mm/yyyy hoặc yyyy), Giới tính (Nam/Nữ), SĐT, Địa chỉ.
export async function importPatients(formData: FormData) {
  const staff = await requireRole(...PATIENT_ROLES);
  const f = formData.get("file");
  if (!(f instanceof File) || f.size === 0) redirect(`/benh-nhan?loi=${encodeURIComponent("Chưa chọn file CSV.")}`);
  if (f.size > 2_000_000) redirect(`/benh-nhan?loi=${encodeURIComponent("File quá lớn (tối đa 2MB).")}`);
  const text = (await f.text()).replace(/^﻿/, "");
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) redirect(`/benh-nhan?loi=${encodeURIComponent("File không có dòng dữ liệu.")}`);
  const sep = lines[0].includes(";") && !lines[0].includes(",") ? ";" : ",";
  let ok = 0;
  const bad: number[] = [];
  for (let i = 1; i < lines.length && i <= 1000; i++) {
    const [name, dob, sexT, phone, address] = splitCsv(lines[i], sep);
    const fullName = (name ?? "").trim();
    const m = (dob ?? "").match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    const y = m ? null : (dob ?? "").match(/^(\d{4})$/);
    if (!fullName || (!m && !y)) { bad.push(i + 1); continue; }
    const birthDate = m ? new Date(Date.UTC(+m[3], +m[2] - 1, +m[1])) : null;
    const birthYear = m ? +m[3] : +(y as RegExpMatchArray)[1];
    if (birthYear < 1900 || birthYear > new Date().getFullYear()) { bad.push(i + 1); continue; }
    const sex = /^n[ữu]$|^f/i.test((sexT ?? "").trim()) ? "F" : /^nam$|^m/i.test((sexT ?? "").trim()) ? "M" : "O";
    await prisma.patient.create({
      data: { fullName, birthDate, birthYear, sex, phone: (phone ?? "").replace(/[\s.\-]/g, ""), address: address || null, createdBy: staff.fullName },
    });
    ok++;
  }
  await logAudit({ staffId: staff.id, staffName: staff.fullName, action: "CREATE", entity: "Patient", detail: `Nhập CSV: ${ok} bệnh nhân` });
  revalidatePath("/benh-nhan");
  const msg = `Đã nhập ${ok} bệnh nhân${bad.length ? `. Bỏ qua dòng lỗi: ${bad.slice(0, 15).join(", ")}` : ""}.`;
  redirect(`/benh-nhan?ok=${encodeURIComponent(msg)}`);
}
