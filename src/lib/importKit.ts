import type { CurrentStaff } from "@/lib/auth";
import type { Role } from "@/lib/permissions";

// Hợp đồng chung của mọi mẫu Excel điền rồi tải lên.
// analyze: chỉ đọc, trả về từng dòng với lỗi và cảnh báo (không ghi gì).
// commit: chạy lại analyze ở máy chủ rồi ghi một lần, có lỗi thì không ghi dòng nào.
export type ImportRow = { row: number; label: string; detail: string; errors: string[]; warnings: string[] };
export type Analysis = { hash: string; fileErrors: string[]; rows: ImportRow[]; summary: string; payload: unknown };
export type Branch = { id: string; name: string };
export type Ctx = { branch: Branch | null; staff: CurrentStaff; cost: boolean };

export type Importer = {
  id: string;
  name: string; // tên mẫu, dùng trong thông báo
  roles: Role[];
  needsBranch: boolean;
  columns: [string, string]; // tiêu đề 2 cột của bảng xem trước
  allowedHint: string;
  build(ctx: Ctx): Promise<Buffer>;
  fileName(ctx: Ctx): string;
  analyze(buf: Buffer, ctx: Ctx): Promise<Analysis>;
  commit(a: Analysis, ctx: Ctx & { fileName: string }): Promise<string>; // trả thông báo thành công
};

export const emptyAnalysis = (hash: string, error?: string): Analysis => ({ hash, fileErrors: error ? [error] : [], rows: [], summary: "", payload: null });
export const MAX_ROWS = 500;
export const MAX_BYTES = 2_000_000;
