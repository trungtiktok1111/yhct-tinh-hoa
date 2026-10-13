-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "authorOrOrg" TEXT,
    "sourceType" TEXT NOT NULL,
    "year" INTEGER,
    "version" TEXT,
    "publisherOrUrl" TEXT,
    "locator" TEXT,
    "accessedAt" DATETIME,
    "usageRights" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Disease" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "sourceId" TEXT,
    CONSTRAINT "Disease_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pattern" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "sourceId" TEXT,
    CONSTRAINT "Pattern_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DiseasePattern" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "diseaseId" TEXT NOT NULL,
    "patternId" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "rationale" TEXT,
    CONSTRAINT "DiseasePattern_diseaseId_fkey" FOREIGN KEY ("diseaseId") REFERENCES "Disease" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DiseasePattern_patternId_fkey" FOREIGN KEY ("patternId") REFERENCES "Pattern" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TreatmentPrinciple" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "sourceId" TEXT,
    CONSTRAINT "TreatmentPrinciple_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PatternPrinciple" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patternId" TEXT NOT NULL,
    "principleId" TEXT NOT NULL,
    "rationale" TEXT,
    CONSTRAINT "PatternPrinciple_patternId_fkey" FOREIGN KEY ("patternId") REFERENCES "Pattern" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PatternPrinciple_principleId_fkey" FOREIGN KEY ("principleId") REFERENCES "TreatmentPrinciple" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Herb" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "sourceId" TEXT,
    CONSTRAINT "Herb_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Formula" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "sourceId" TEXT,
    "principleId" TEXT,
    CONSTRAINT "Formula_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Formula_principleId_fkey" FOREIGN KEY ("principleId") REFERENCES "TreatmentPrinciple" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FormulaIngredient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "formulaId" TEXT NOT NULL,
    "herbId" TEXT NOT NULL,
    "amount" TEXT,
    "unit" TEXT,
    "preparation" TEXT,
    "role" TEXT,
    "note" TEXT,
    CONSTRAINT "FormulaIngredient_formulaId_fkey" FOREIGN KEY ("formulaId") REFERENCES "Formula" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FormulaIngredient_herbId_fkey" FOREIGN KEY ("herbId") REFERENCES "Herb" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AcupuncturePoint" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "sourceId" TEXT,
    CONSTRAINT "AcupuncturePoint_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PointProtocol" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "goal" TEXT,
    "conditions" TEXT,
    "warnings" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "sourceId" TEXT,
    "principleId" TEXT,
    CONSTRAINT "PointProtocol_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "PointProtocol_principleId_fkey" FOREIGN KEY ("principleId") REFERENCES "TreatmentPrinciple" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PointProtocolItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "protocolId" TEXT NOT NULL,
    "pointId" TEXT NOT NULL,
    "role" TEXT,
    "note" TEXT,
    CONSTRAINT "PointProtocolItem_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "PointProtocol" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PointProtocolItem_pointId_fkey" FOREIGN KEY ("pointId") REFERENCES "AcupuncturePoint" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ManualTherapy" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "techniqueType" TEXT,
    "targetArea" TEXT,
    "sequence" TEXT,
    "indications" TEXT,
    "contraindications" TEXT,
    "durationForce" TEXT,
    "imageUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "sourceId" TEXT,
    CONSTRAINT "ManualTherapy_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ClinicalCase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseCode" TEXT NOT NULL,
    "minimalIdentity" TEXT,
    "history" TEXT,
    "observations" TEXT,
    "candidatePatterns" TEXT,
    "confirmedConclusion" TEXT,
    "plan" TEXT,
    "actualTreatment" TEXT,
    "outcome" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Claim" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subjectType" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "relation" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING_REVIEW',
    "reviewedBy" TEXT,
    "reviewedAt" DATETIME,
    "sourceId" TEXT,
    CONSTRAINT "Claim_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "DiseasePattern_diseaseId_patternId_relation_key" ON "DiseasePattern"("diseaseId", "patternId", "relation");

-- CreateIndex
CREATE UNIQUE INDEX "PatternPrinciple_patternId_principleId_key" ON "PatternPrinciple"("patternId", "principleId");
