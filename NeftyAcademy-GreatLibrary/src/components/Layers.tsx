/** 층 쌓기 그림. C 생태계, 부팅 순서 같은 "아래에서 위로" 구조에 쓴다. */
export function Layers({ items, label }: { items: { name: string; desc: string; eg?: string }[]; label: string }) {
  const H = 58;
  const GAP = 8;
  const W = 560;
  const EDGE = 2; // 테두리 선이 그림 가장자리에서 잘리지 않게 두는 여백
  const height = items.length * (H + GAP) - GAP;
  return (
    <svg viewBox={`${-EDGE} ${-EDGE} ${W + EDGE * 2} ${height + EDGE * 2}`} width={W + EDGE * 2} role="img" aria-label={label}>
      {items.map((it, i) => {
        const y = i * (H + GAP);
        const inset = (items.length - 1 - i) * 14; // 위층일수록 살짝 좁게
        return (
          <g key={it.name}>
            <rect
              x={inset}
              y={y}
              width={W - inset * 2}
              height={H}
              rx={10}
              fill="var(--node)"
              fillOpacity={0.12 + (i / Math.max(1, items.length - 1)) * 0.22}
              stroke="var(--node)"
              strokeWidth={1.4}
            />
            <text x={inset + 16} y={y + 25} fontSize={15} fontWeight={700} fill="currentColor">
              {it.name}
            </text>
            <text x={inset + 16} y={y + 45} fontSize={13} fill="currentColor" opacity={0.75}>
              {it.desc}
            </text>
            {it.eg && (
              <text x={W - inset - 16} y={y + 25} fontSize={12} textAnchor="end" fontFamily="var(--bf-mono)" fill="currentColor" opacity={0.7}>
                {it.eg}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
