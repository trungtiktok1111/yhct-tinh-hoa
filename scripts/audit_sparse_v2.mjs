import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("=== PATTERN: genuinely thin (no description AND/OR no keySigns) ===");
  const thin = await prisma.pattern.findMany({
    where: {
      OR: [
        { AND: [{ description: null }] },
        { AND: [{ description: "" }] },
        { keySigns: null },
        { keySigns: "" },
      ],
    },
    select: { id: true, name: true, description: true, keySigns: true, sourceId: true },
    orderBy: { sourceId: "asc" },
  });
  console.log(`Count: ${thin.length}`);
  const bySource = {};
  for (const p of thin) {
    bySource[p.sourceId] = bySource[p.sourceId] || [];
    bySource[p.sourceId].push(p.name);
  }
  for (const [sid, names] of Object.entries(bySource)) {
    const src = await prisma.source.findUnique({ where: { id: sid } });
    console.log(`\n--- Source: ${src?.title} (${src?.locator}) [${sid}] — ${names.length} patterns ---`);
    for (const n of names) console.log(`  - ${n}`);
  }

  console.log("\n\n=== DISEASE: full detail of the 11 sparse ones ===");
  const sparseDiseases = await prisma.disease.findMany({
    where: { OR: [{ definition: null }, { definition: "" }, { symptoms: null }, { symptoms: "" }] },
    select: { id: true, name: true, definition: true, cause: true, symptoms: true, sourceId: true },
  });
  for (const d of sparseDiseases) {
    const src = await prisma.source.findUnique({ where: { id: d.sourceId } });
    console.log(`- ${d.name} | source: ${src?.title}`);
  }

  console.log("\n=== FORMULA: full detail of the 3 sparse ones ===");
  const sparseFormulas = await prisma.formula.findMany({
    where: { OR: [{ indications: null }, { indications: "" }] },
    select: { id: true, name: true, sourceId: true },
  });
  for (const f of sparseFormulas) {
    const src = await prisma.source.findUnique({ where: { id: f.sourceId } });
    console.log(`- ${f.name} | source: ${src?.title}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
