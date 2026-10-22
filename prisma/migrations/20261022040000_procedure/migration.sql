ALTER TABLE "ServiceItem" ADD COLUMN "procedure" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "InvoiceLine" ADD COLUMN "serviceId" TEXT;

CREATE TABLE "ServiceSupply" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "qty" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ServiceSupply_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ServiceSupply_serviceId_itemId_key" ON "ServiceSupply"("serviceId", "itemId");
ALTER TABLE "ServiceSupply" ADD CONSTRAINT "ServiceSupply_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "ServiceItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "ProcedureOrder" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "visitId" TEXT,
    "invoiceId" TEXT,
    "patientId" TEXT,
    "serviceId" TEXT,
    "name" TEXT NOT NULL,
    "sessionNo" INTEGER NOT NULL DEFAULT 1,
    "sessionTotal" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "performerId" TEXT,
    "performerName" TEXT,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "note" TEXT,
    "cancelReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProcedureOrder_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ProcedureOrder_branchId_status_idx" ON "ProcedureOrder"("branchId", "status");
CREATE INDEX "ProcedureOrder_visitId_idx" ON "ProcedureOrder"("visitId");
CREATE INDEX "ProcedureOrder_patientId_serviceId_idx" ON "ProcedureOrder"("patientId", "serviceId");
