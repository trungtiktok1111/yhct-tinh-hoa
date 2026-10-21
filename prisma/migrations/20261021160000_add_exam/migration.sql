-- CreateTable
CREATE TABLE "Exam" (
    "id" TEXT NOT NULL,
    "visitId" TEXT NOT NULL,
    "doctorId" TEXT,
    "doctorName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "chiefComplaint" TEXT,
    "presentHistory" TEXT,
    "inspection" TEXT,
    "listening" TEXT,
    "inquiry" TEXT,
    "palpation" TEXT,
    "modernDiagnosis" TEXT,
    "exteriorInterior" TEXT,
    "coldHeat" TEXT,
    "deficiencyExcess" TEXT,
    "yinYang" TEXT,
    "eightMethods" TEXT,
    "diseaseId" TEXT,
    "diseaseText" TEXT,
    "patternId" TEXT,
    "patternText" TEXT,
    "principleId" TEXT,
    "principleText" TEXT,
    "advice" TEXT,
    "followUpDate" TIMESTAMP(3),
    "finalAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ExamPoint" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "pointId" TEXT,
    "label" TEXT NOT NULL,
    "note" TEXT,

    CONSTRAINT "ExamPoint_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ExamTherapy" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "therapyId" TEXT,
    "label" TEXT NOT NULL,
    "note" TEXT,

    CONSTRAINT "ExamTherapy_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Prescription" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "thangCount" INTEGER NOT NULL DEFAULT 0,
    "decoctionNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PrescriptionLine" (
    "id" TEXT NOT NULL,
    "prescriptionId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "qty" DOUBLE PRECISION NOT NULL,
    "usage" TEXT,
    "note" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PrescriptionLine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Exam_visitId_key" ON "Exam"("visitId");
CREATE UNIQUE INDEX "Prescription_examId_key" ON "Prescription"("examId");

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "Visit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ExamPoint" ADD CONSTRAINT "ExamPoint_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ExamTherapy" ADD CONSTRAINT "ExamTherapy_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PrescriptionLine" ADD CONSTRAINT "PrescriptionLine_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "Prescription"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PrescriptionLine" ADD CONSTRAINT "PrescriptionLine_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
