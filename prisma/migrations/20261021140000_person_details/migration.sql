-- Patient
ALTER TABLE "Patient" ADD COLUMN "birthDate" TIMESTAMP(3),
ADD COLUMN "nationalId" TEXT,
ADD COLUMN "ethnicity" TEXT,
ADD COLUMN "nationality" TEXT,
ADD COLUMN "email" TEXT,
ADD COLUMN "ward" TEXT,
ADD COLUMN "district" TEXT,
ADD COLUMN "province" TEXT,
ADD COLUMN "bloodType" TEXT,
ADD COLUMN "insuranceNo" TEXT,
ADD COLUMN "emergencyName" TEXT,
ADD COLUMN "emergencyRelation" TEXT,
ADD COLUMN "emergencyPhone" TEXT;
CREATE UNIQUE INDEX "Patient_nationalId_key" ON "Patient"("nationalId");

-- Staff
ALTER TABLE "Staff" ADD COLUMN "birthDate" TIMESTAMP(3),
ADD COLUMN "sex" TEXT,
ADD COLUMN "nationalId" TEXT,
ADD COLUMN "phone" TEXT,
ADD COLUMN "email" TEXT,
ADD COLUMN "address" TEXT,
ADD COLUMN "ward" TEXT,
ADD COLUMN "district" TEXT,
ADD COLUMN "province" TEXT,
ADD COLUMN "jobTitle" TEXT,
ADD COLUMN "licenseNo" TEXT,
ADD COLUMN "hireDate" TIMESTAMP(3),
ADD COLUMN "note" TEXT;
CREATE UNIQUE INDEX "Staff_nationalId_key" ON "Staff"("nationalId");
