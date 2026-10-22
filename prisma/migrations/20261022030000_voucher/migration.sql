CREATE TABLE "Voucher" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "seq" INTEGER NOT NULL,
    "branchId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ISSUED',
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "issuedBy" TEXT,
    "usedAt" TIMESTAMP(3),
    "usedBy" TEXT,
    "voidedAt" TIMESTAMP(3),
    "voidedBy" TEXT,
    "note" TEXT,

    CONSTRAINT "Voucher_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Voucher_code_key" ON "Voucher"("code");
CREATE INDEX "Voucher_kind_day_idx" ON "Voucher"("kind", "day");
CREATE INDEX "Voucher_status_idx" ON "Voucher"("status");
