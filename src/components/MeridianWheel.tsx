// Vòng Ngũ Hành – Quy Kinh: sơ đồ trực quan hóa trường Quy kinh của một vị thuốc,
// tô sáng đúng những tạng mà `meridians` (dữ liệu nguồn) liệt kê, theo thứ tự tương sinh
// cổ điển (Mộc→Hỏa→Thổ→Kim→Thủy). Không suy diễn quy kinh — chỉ đối chiếu chuỗi gốc.
const PHASES: { tang: string; hanh: string; angle: number; color: string }[] = [
  { tang: "Can", hanh: "Mộc", angle: -90, color: "#2f6b3a" },
  { tang: "Tâm", hanh: "Hỏa", angle: -18, color: "#b42318" },
  { tang: "Tỳ", hanh: "Thổ", angle: 54, color: "#c9a227" },
  { tang: "Phế", hanh: "Kim", angle: 126, color: "#8a8f98" },
  { tang: "Thận", hanh: "Thủy", angle: 198, color: "#1b4a66" },
];

const R = 72;
const CX = 100;
const CY = 100;

function pointFor(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + R * Math.cos(rad), y: CY + R * Math.sin(rad) };
}

function matchedTangSet(meridians: string): Set<string> {
  const tokens = meridians
    .split(/[,、/]|và/i)
    .map((t) => t.trim())
    .filter(Boolean);
  const matched = new Set<string>();
  for (const { tang } of PHASES) {
    if (tokens.some((t) => t.toLowerCase() === tang.toLowerCase())) matched.add(tang);
  }
  return matched;
}

export function MeridianWheel({ meridians }: { meridians: string }) {
  const matched = matchedTangSet(meridians);
  const points = PHASES.map((p) => ({ ...p, pos: pointFor(p.angle) }));

  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-[220px] mx-auto">
      {/* Vòng tương sinh nối 5 điểm */}
      <polygon
        points={points.map((p) => `${p.pos.x},${p.pos.y}`).join(" ")}
        fill="none"
        stroke="rgba(201,162,39,0.35)"
        strokeWidth={1}
        strokeDasharray="3 3"
      />
      <circle cx={CX} cy={CY} r={R + 24} fill="none" stroke="rgba(201,162,39,0.18)" strokeWidth={1} />

      {points.map((p) => {
        const isOn = matched.has(p.tang);
        return (
          <g key={p.tang}>
            <circle
              cx={p.pos.x}
              cy={p.pos.y}
              r={24}
              fill={isOn ? p.color : "#f2ead9"}
              stroke={isOn ? p.color : "rgba(42,36,29,0.2)"}
              strokeWidth={isOn ? 0 : 1}
              className={isOn ? "drop-shadow-sm" : ""}
            />
            <text
              x={p.pos.x}
              y={p.pos.y - 2}
              textAnchor="middle"
              fontSize={13}
              fontWeight={700}
              fill={isOn ? "#faf6ec" : "#8a8273"}
              style={{ fontFamily: "var(--font-display), serif" }}
            >
              {p.tang}
            </text>
            <text
              x={p.pos.x}
              y={p.pos.y + 11}
              textAnchor="middle"
              fontSize={8}
              fill={isOn ? "rgba(250,246,236,0.85)" : "rgba(42,36,29,0.4)"}
            >
              {p.hanh}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
