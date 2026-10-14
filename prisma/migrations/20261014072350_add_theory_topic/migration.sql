-- CreateTable
CREATE TABLE "TheoryTopic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "summary" TEXT,
    "content" TEXT,
    "keyPoints" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sourceId" TEXT,

    CONSTRAINT "TheoryTopic_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TheoryTopic" ADD CONSTRAINT "TheoryTopic_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;
