ALTER TABLE "Item" ADD COLUMN "code" TEXT;
CREATE UNIQUE INDEX "Item_code_key" ON "Item"("code");
UPDATE "Item" i SET "code" = (CASE WHEN i."type" = 'HERB' THEN 'VT' ELSE 'TP' END) || lpad(r.n::text, 3, '0')
FROM (SELECT id, row_number() OVER (PARTITION BY "type" ORDER BY "createdAt", id) AS n FROM "Item") r WHERE r.id = i.id;

CREATE TABLE "Supplier" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "phone" TEXT,
  "address" TEXT,
  "note" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "StockLot" ADD COLUMN "supplierId" TEXT;
ALTER TABLE "StockLot" ADD CONSTRAINT "StockLot_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Visit" ADD COLUMN "priority" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Visit" ADD COLUMN "doctorName" TEXT;
ALTER TABLE "Visit" ADD COLUMN "cancelReason" TEXT;

ALTER TABLE "Exam" ADD COLUMN "icd10Code" TEXT;
ALTER TABLE "Exam" ADD COLUMN "clinicalExam" TEXT;

ALTER TABLE "Invoice" ADD COLUMN "vatPct" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Invoice" ADD COLUMN "vat" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Invoice" ADD COLUMN "cashGiven" INTEGER;
ALTER TABLE "Invoice" ADD COLUMN "dispenseChecks" TEXT;
ALTER TABLE "InvoiceLine" ADD COLUMN "discountPct" INTEGER NOT NULL DEFAULT 0;

CREATE TABLE "ServiceItem" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "unit" TEXT NOT NULL DEFAULT 'Lần',
  "price" INTEGER NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "position" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ServiceItem_pkey" PRIMARY KEY ("id")
);
INSERT INTO "ServiceItem" ("id","name","unit","price","position") VALUES
 ('svc_kham','Khám và tư vấn YHCT','Lần',200000,0),
 ('svc_chamcuu','Châm cứu, thủy châm','Lần',150000,1),
 ('svc_xoabop','Xoa bóp bấm huyệt','Lần',150000,2),
 ('svc_cuu','Cứu ngải','Lần',100000,3),
 ('svc_giac','Giác hơi','Lần',80000,4);

CREATE TABLE "QuickNote" (
  "id" TEXT NOT NULL,
  "branchId" TEXT,
  "text" TEXT NOT NULL,
  "staffName" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "QuickNote_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "QuickNote_branchId_createdAt_idx" ON "QuickNote"("branchId", "createdAt");

CREATE TABLE "BackupLog" (
  "id" TEXT NOT NULL,
  "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "status" TEXT NOT NULL DEFAULT 'OK',
  "staffName" TEXT,
  "bytes" INTEGER,
  "note" TEXT,
  CONSTRAINT "BackupLog_pkey" PRIMARY KEY ("id")
);
