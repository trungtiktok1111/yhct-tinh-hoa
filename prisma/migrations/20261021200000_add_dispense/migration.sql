ALTER TABLE "Invoice" ADD COLUMN "dispensedAt" TIMESTAMP(3), ADD COLUMN "dispensedBy" TEXT;
ALTER TABLE "StockMove" ADD COLUMN "invoiceId" TEXT;
CREATE INDEX "Invoice_dispensedAt_idx" ON "Invoice"("dispensedAt");
