/** 전자공학 입문 1.1 그림: 작은 빵판. 구멍을 누르면 그 구멍과 속에서 이어진 구멍들이 함께 밝아진다. */
import { useState } from 'react';

const COLS = 20;
const P = 18; // 구멍 사이(그림에서 2.54mm)
const ROWS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];

type Hole = { id: string; x: number; y: number; net: string };

function holes(): Hole[] {
  const list: Hole[] = [];
  const left = 40;
  // 위 전원 줄 두 줄
  const rails: [string, number][] = [
    ['top+', 20],
    ['top-', 20 + P],
    ['bot-', 20 + P * 2 + 24 + P * 10 + 26],
    ['bot+', 20 + P * 3 + 24 + P * 10 + 26],
  ];
  for (const [net, y] of rails) {
    for (let c = 0; c < COLS; c++) {
      if (c % 6 === 5) continue; // 다섯 개마다 한 칸 비운다(실물과 같은 모양)
      list.push({ id: `${net}${c}`, x: left + c * P, y, net });
    }
  }
  const top = 20 + P * 2 + 24;
  ROWS.forEach((r, i) => {
    const y = top + i * P + (i >= 5 ? P : 0); // 가운데 홈
    for (let c = 0; c < COLS; c++) {
      list.push({ id: `${r}${c + 1}`, x: left + c * P, y, net: `${c + 1}${i < 5 ? 'u' : 'd'}` });
    }
  });
  return list;
}

const HOLES = holes();

export function Breadboard() {
  const [net, setNet] = useState('7u');
  const w = 40 + COLS * P + 20;
  const h = HOLES.reduce((m, o) => Math.max(m, o.y), 0) + 24;
  const top = 20 + P * 2 + 24;
  const picked = HOLES.filter((o) => o.net === net);
  const label = net.startsWith('top') || net.startsWith('bot')
    ? `${net.endsWith('+') ? '+' : '−'} 전원 줄: 가로로 길게 이어짐`
    : `${parseInt(net, 10)}열 ${net.endsWith('u') ? 'a~e' : 'f~j'}: 세로 다섯 구멍이 이어짐`;
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} width={w} role="img" aria-label="빵판의 속 연결">
        <rect x={4} y={4} width={w - 8} height={h - 8} rx={8} fill="none" stroke="currentColor" opacity={0.35} />
        <line x1={28} y1={20} x2={w - 14} y2={20} stroke="#d33" opacity={0.5} />
        <line x1={28} y1={20 + P} x2={w - 14} y2={20 + P} stroke="#36c" opacity={0.5} />
        <line x1={28} y1={top + P * 10 + 26} x2={w - 14} y2={top + P * 10 + 26} stroke="#36c" opacity={0.5} />
        <line x1={28} y1={top + P * 11 + 26} x2={w - 14} y2={top + P * 11 + 26} stroke="#d33" opacity={0.5} />
        <rect x={30} y={top + P * 4.5} width={w - 50} height={P} fill="currentColor" opacity={0.08} />
        {ROWS.map((r, i) => (
          <text key={r} x={22} y={top + i * P + (i >= 5 ? P : 0)} fontSize={10} textAnchor="middle" dominantBaseline="central" fill="currentColor" opacity={0.6}>
            {r}
          </text>
        ))}
        {HOLES.map((o) => {
          const on = o.net === net;
          return (
            <rect
              key={o.id}
              x={o.x - 5}
              y={o.y - 5}
              width={10}
              height={10}
              rx={2}
              fill={on ? 'var(--node, #e80)' : 'currentColor'}
              opacity={on ? 1 : 0.28}
              style={{ cursor: 'pointer' }}
              onClick={() => setNet(o.net)}
            />
          );
        })}
        {picked.length > 1 && (
          <line
            x1={Math.min(...picked.map((o) => o.x))}
            y1={Math.min(...picked.map((o) => o.y))}
            x2={Math.max(...picked.map((o) => o.x))}
            y2={Math.max(...picked.map((o) => o.y))}
            stroke="var(--node, #e80)"
            strokeWidth={3}
            opacity={0.45}
          />
        )}
      </svg>
      <p style={{ margin: '10px 0 0', textAlign: 'center' }}>{label}</p>
    </div>
  );
}
