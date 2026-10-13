-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "authorOrOrg" TEXT,
    "sourceType" TEXT NOT NULL,
    "year" INTEGER,
    "version" TEXT,
    "publisherOrUrl" TEXT,
    "locator" TEXT,
    "accessedAt" TIMESTAMP(3),
    "usageRights" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Disease" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "aliases" TEXT,
    "nameModern" TEXT,
    "definition" TEXT,
    "category" TEXT,
    "cause" TEXT,
    "mechanism" TEXT,
    "symptoms" TEXT,
    "differential" TEXT,
    "warnings" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sourceId" TEXT,

    CONSTRAINT "Disease_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pattern" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "supportCriteria" TEXT,
    "againstCriteria" TEXT,
    "keySigns" TEXT,
    "missingDataPrompts" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sourceId" TEXT,

    CONSTRAINT "Pattern_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiseasePattern" (
    "id" TEXT NOT NULL,
    "diseaseId" TEXT NOT NULL,
    "patternId" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "rationale" TEXT,

    CONSTRAINT "DiseasePattern_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TreatmentPrinciple" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "aliases" TEXT,
    "description" TEXT,
    "goal" TEXT,
    "scope" TEXT,
    "limitations" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sourceId" TEXT,

    CONSTRAINT "TreatmentPrinciple_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatternPrinciple" (
    "id" TEXT NOT NULL,
    "patternId" TEXT NOT NULL,
    "principleId" TEXT NOT NULL,
    "rationale" TEXT,

    CONSTRAINT "PatternPrinciple_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Herb" (
    "id" TEXT NOT NULL,
    "standardName" TEXT NOT NULL,
    "aliases" TEXT,
    "latinName" TEXT,
    "partUsed" TEXT,
    "origin" TEXT,
    "natureFlavor" TEXT,
    "meridians" TEXT,
    "actions" TEXT,
    "indications" TEXT,
    "dosage" TEXT,
    "safetyNotes" TEXT,
    "imageUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sourceId" TEXT,

    CONSTRAINT "Herb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Formula" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "aliases" TEXT,
    "origin" TEXT,
    "indications" TEXT,
    "preparation" TEXT,
    "modifications" TEXT,
    "safetyNotes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sourceId" TEXT,
    "principleId" TEXT,

    CONSTRAINT "Formula_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormulaIngredient" (
    "id" TEXT NOT NULL,
    "formulaId" TEXT NOT NULL,
    "herbId" TEXT NOT NULL,
    "amount" TEXT,
    "unit" TEXT,
    "preparation" TEXT,
    "role" TEXT,
    "note" TEXT,

    CONSTRAINT "FormulaIngredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcupuncturePoint" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "standardName" TEXT NOT NULL,
    "aliases" TEXT,
    "meridian" TEXT,
    "location" TEXT,
    "anatomyNotes" TEXT,
    "actions" TEXT,
    "technique" TEXT,
    "contraindications" TEXT,
    "riskNotes" TEXT,
    "imageUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sourceId" TEXT,

    CONSTRAINT "AcupuncturePoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PointProtocol" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "goal" TEXT,
    "conditions" TEXT,
    "warnings" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sourceId" TEXT,
    "principleId" TEXT,

    CONSTRAINT "PointProtocol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PointProtocolItem" (
    "id" TEXT NOT NULL,
    "protocolId" TEXT NOT NULL,
    "pointId" TEXT NOT NULL,
    "role" TEXT,
    "note" TEXT,

    CONSTRAINT "PointProtocolItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManualTherapy" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "techniqueType" TEXT,
    "targetArea" TEXT,
    "sequence" TEXT,
    "indications" TEXT,
    "contraindications" TEXT,
    "durationForce" TEXT,
    "imageUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sourceId" TEXT,

    CONSTRAINT "ManualTherapy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicalCase" (
    "id" TEXT NOT NULL,
    "caseCode" TEXT NOT NULL,
    "minimalIdentity" TEXT,
    "history" TEXT,
    "observations" TEXT,
    "candidatePatterns" TEXT,
    "confirmedConclusion" TEXT,
    "plan" TEXT,
    "actualTreatment" TEXT,
    "outcome" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicalCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Claim" (
    "id" TEXT NOT NULL,
    "subjectType" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "relation" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING_REVIEW',
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "sourceId" TEXT,

    CONSTRAINT "Claim_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DiseasePattern_diseaseId_patternId_relation_key" ON "DiseasePattern"("diseaseId", "patternId", "relation");

-- CreateIndex
CREATE UNIQUE INDEX "PatternPrinciple_patternId_principleId_key" ON "PatternPrinciple"("patternId", "principleId");

-- AddForeignKey
ALTER TABLE "Disease" ADD CONSTRAINT "Disease_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pattern" ADD CONSTRAINT "Pattern_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiseasePattern" ADD CONSTRAINT "DiseasePattern_diseaseId_fkey" FOREIGN KEY ("diseaseId") REFERENCES "Disease"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiseasePattern" ADD CONSTRAINT "DiseasePattern_patternId_fkey" FOREIGN KEY ("patternId") REFERENCES "Pattern"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreatmentPrinciple" ADD CONSTRAINT "TreatmentPrinciple_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatternPrinciple" ADD CONSTRAINT "PatternPrinciple_patternId_fkey" FOREIGN KEY ("patternId") REFERENCES "Pattern"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatternPrinciple" ADD CONSTRAINT "PatternPrinciple_principleId_fkey" FOREIGN KEY ("principleId") REFERENCES "TreatmentPrinciple"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Herb" ADD CONSTRAINT "Herb_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Formula" ADD CONSTRAINT "Formula_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Formula" ADD CONSTRAINT "Formula_principleId_fkey" FOREIGN KEY ("principleId") REFERENCES "TreatmentPrinciple"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormulaIngredient" ADD CONSTRAINT "FormulaIngredient_formulaId_fkey" FOREIGN KEY ("formulaId") REFERENCES "Formula"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormulaIngredient" ADD CONSTRAINT "FormulaIngredient_herbId_fkey" FOREIGN KEY ("herbId") REFERENCES "Herb"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcupuncturePoint" ADD CONSTRAINT "AcupuncturePoint_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointProtocol" ADD CONSTRAINT "PointProtocol_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointProtocol" ADD CONSTRAINT "PointProtocol_principleId_fkey" FOREIGN KEY ("principleId") REFERENCES "TreatmentPrinciple"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointProtocolItem" ADD CONSTRAINT "PointProtocolItem_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "PointProtocol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointProtocolItem" ADD CONSTRAINT "PointProtocolItem_pointId_fkey" FOREIGN KEY ("pointId") REFERENCES "AcupuncturePoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManualTherapy" ADD CONSTRAINT "ManualTherapy_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;
