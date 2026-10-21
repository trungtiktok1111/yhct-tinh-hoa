export type Checks = { chk: Record<string, boolean>; weighed: string[] };

export function readChecks(raw: string | null | undefined): Checks {
  try {
    const j = JSON.parse(raw ?? "") as Partial<Checks>;
    return { chk: j.chk ?? {}, weighed: Array.isArray(j.weighed) ? j.weighed : [] };
  } catch {
    return { chk: {}, weighed: [] };
  }
}
