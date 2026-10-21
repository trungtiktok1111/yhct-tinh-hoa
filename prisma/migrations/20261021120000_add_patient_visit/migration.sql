-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "birthYear" INTEGER NOT NULL,
    "sex" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT,
    "occupation" TEXT,
    "weightKg" DOUBLE PRECISION,
    "heightCm" DOUBLE PRECISION,
    "pastHistory" TEXT,
    "familyHistory" TEXT,
    "allergies" TEXT,
    "chronicConditions" TEXT,
    "note" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visit" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "queueNo" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'WAITING',
    "reason" TEXT,
    "weightKg" DOUBLE PRECISION,
    "heightCm" DOUBLE PRECISION,
    "pulse" INTEGER,
    "bloodPressure" TEXT,
    "temperature" DOUBLE PRECISION,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Visit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Patient_seq_key" ON "Patient"("seq");
CREATE INDEX "Patient_fullName_idx" ON "Patient"("fullName");
CREATE INDEX "Patient_phone_idx" ON "Patient"("phone");
CREATE INDEX "Visit_branchId_createdAt_idx" ON "Visit"("branchId", "createdAt");
CREATE INDEX "Visit_patientId_idx" ON "Visit"("patientId");

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
