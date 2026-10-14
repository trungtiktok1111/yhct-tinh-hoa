import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("=== PATTERN: missing description or supportCriteria ===");
  const sparsePatterns = await prisma.pattern.findMany({
    where: {
      OR: [
        { description: null },
        { description: "" },
        { supportCriteria: null },
        { supportCriteria: "" },
      ],
    },
    select: { id: true, name: true, description: true, supportCriteria: true, keySigns: true, sourceId: true },
  });
  console.log(`Count: ${sparsePatterns.length}`);
  for (const p of sparsePatterns) {
    console.log(`- [${p.id}] ${p.name} | desc:${p.description ? "Y" : "N"} support:${p.supportCriteria ? "Y" : "N"} keySigns:${p.keySigns ? "Y" : "N"} source:${p.sourceId}`);
  }

  console.log("\n=== DISEASE: missing definition/cause/symptoms ===");
  const sparseDiseases = await prisma.disease.findMany({
    where: {
      OR: [
        { definition: null },
        { definition: "" },
        { symptoms: null },
        { symptoms: "" },
      ],
    },
    select: { id: true, name: true, definition: true, cause: true, symptoms: true, sourceId: true },
  });
  console.log(`Count: ${sparseDiseases.length}`);
  for (const d of sparseDiseases) {
    console.log(`- [${d.id}] ${d.name} | def:${d.definition ? "Y" : "N"} cause:${d.cause ? "Y" : "N"} symptoms:${d.symptoms ? "Y" : "N"}`);
  }

  console.log("\n=== THEORYTOPIC: missing content ===");
  const sparseTopics = await prisma.theoryTopic.findMany({
    where: {
      OR: [
        { content: null },
        { content: "" },
        { summary: null },
        { summary: "" },
      ],
    },
    select: { id: true, name: true, category: true, content: true, summary: true },
  });
  console.log(`Count: ${sparseTopics.length}`);
  for (const t of sparseTopics) {
    console.log(`- [${t.id}] ${t.name} (${t.category}) | content:${t.content ? "Y" : "N"} summary:${t.summary ? "Y" : "N"}`);
  }

  console.log("\n=== FORMULA: missing indications ===");
  const sparseFormulas = await prisma.formula.findMany({
    where: {
      OR: [
        { indications: null },
        { indications: "" },
      ],
    },
    select: { id: true, name: true, indications: true, origin: true, sourceId: true },
  });
  console.log(`Count: ${sparseFormulas.length}`);
  for (const f of sparseFormulas) {
    console.log(`- [${f.id}] ${f.name} | origin:${f.origin || "none"}`);
  }

  console.log("\n=== HERB: missing actions/indications ===");
  const sparseHerbs = await prisma.herb.findMany({
    where: {
      OR: [
        { actions: null },
        { actions: "" },
        { indications: null },
        { indications: "" },
      ],
    },
    select: { id: true, standardName: true, actions: true, indications: true, sourceId: true },
  });
  console.log(`Count: ${sparseHerbs.length}`);
  for (const h of sparseHerbs) {
    console.log(`- [${h.id}] ${h.standardName} | actions:${h.actions ? "Y" : "N"} indications:${h.indications ? "Y" : "N"}`);
  }

  console.log("\n=== Total record counts ===");
  console.log("Pattern:", await prisma.pattern.count());
  console.log("Disease:", await prisma.disease.count());
  console.log("TheoryTopic:", await prisma.theoryTopic.count());
  console.log("Formula:", await prisma.formula.count());
  console.log("Herb:", await prisma.herb.count());
  console.log("AcupuncturePoint:", await prisma.acupuncturePoint.count());
  console.log("Source:", await prisma.source.count());
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
