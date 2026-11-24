/**
 * Qt 책 그림: 위젯 창의 모습을 한 줄 설명으로 그린다(실제 화면을 찍은 것이 아니라 배치를 보여 주는 그림).
 *
 *   <QtMock title="첫 창" spec="label 2번 눌렀어요; button 눌러 보기" />
 *
 * spec 은 ';' 로 줄을 나누고, 한 줄 안의 '|' 는 가로로 나란히 놓는다. 각 칸은 "종류 글":
 *   label 글   button 글   edit 글   check 글(앞에 x 를 붙이면 체크됨: "check x 자동 저장")
 *   radio 글(앞에 x 면 선택)   combo 글   slider 0~100   progress 0~100   spin 글
 *   list 항목,항목,항목   text 여러 줄 글(\n)   menu 파일,편집,보기   status 글   space
 *   buttons 추가,삭제(위에서부터 세로로 쌓은 버튼 기둥)
 * labelWidth 를 주면 여러 칸인 줄의 첫 label 칸 폭을 맞춘다(양식 배치). 빈 이름표는 "label" 만 쓴다.
 */
import type { ReactElement } from 'react';

type Cell = { kind: string; text: string };

function parse(spec: string): Cell[][] {
  return spec.split(';').map((row) => row.trim()).filter(Boolean).map((row) =>
    row.split('|').map((c) => {
      const t = c.trim();
      const i = t.indexOf(' ');
      return i < 0 ? { kind: t, text: '' } : { kind: t.slice(0, i), text: t.slice(i + 1) };
    }),
  );
}

const box = {
  border: '1px solid currentColor', borderRadius: 4, padding: '3px 8px', minHeight: 22,
  display: 'flex', alignItems: 'center', gap: 6, boxSizing: 'border-box' as const,
};

function render(c: Cell, key: number): ReactElement {
  const on = c.text.startsWith('x ');
  const txt = on ? c.text.slice(2) : c.text;
  switch (c.kind) {
    case 'label':
      return <div key={key} style={{ padding: '3px 2px' }}>{c.text}</div>;
    case 'button':
      return <div key={key} style={{ ...box, justifyContent: 'center', background: 'rgba(127,127,127,.15)' }}>{c.text}</div>;
    case 'edit':
    case 'spin':
      return (
        <div key={key} style={{ ...box, justifyContent: 'space-between' }}>
          <span>{c.text}</span>{c.kind === 'spin' && <span style={{ opacity: 0.6 }}>▴▾</span>}
        </div>
      );
    case 'combo':
      return <div key={key} style={{ ...box, justifyContent: 'space-between' }}><span>{c.text}</span><span style={{ opacity: 0.6 }}>▾</span></div>;
    case 'check':
    case 'radio': {
      const r = c.kind === 'radio' ? '50%' : 3;
      return (
        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 2px' }}>
          <span style={{ width: 13, height: 13, border: '1px solid currentColor', borderRadius: r, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>{on ? (c.kind === 'radio' ? '●' : '✓') : ''}</span>
          {txt}
        </div>
      );
    }
    case 'slider':
    case 'progress': {
      const v = Math.max(0, Math.min(100, Number(c.text) || 0));
      return (
        <div key={key} style={{ position: 'relative', height: 22, display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '100%', height: c.kind === 'slider' ? 4 : 14, border: '1px solid currentColor', borderRadius: 7, position: 'relative', overflow: 'hidden' }}>
            {c.kind === 'progress' && <div style={{ width: `${v}%`, height: '100%', background: 'var(--node, #e80)' }} />}
          </div>
          {c.kind === 'slider' && <div style={{ position: 'absolute', left: `calc(${v}% - 7px)`, width: 14, height: 14, borderRadius: '50%', background: 'var(--node, #e80)' }} />}
        </div>
      );
    }
    case 'buttons':
      return (
        <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {c.text.split(',').map((b, i) => (
            <div key={i} style={{ ...box, justifyContent: 'center', background: 'rgba(127,127,127,.15)' }}>{b}</div>
          ))}
        </div>
      );
    case 'list':
      return (
        <div key={key} style={{ ...box, flexDirection: 'column', alignItems: 'stretch', padding: 0, gap: 0 }}>
          {c.text.split(',').map((it, i) => (
            <div key={i} style={{ padding: '2px 8px', borderTop: i ? '1px solid rgba(127,127,127,.3)' : 'none' }}>{it}</div>
          ))}
        </div>
      );
    case 'text':
      return <div key={key} style={{ ...box, alignItems: 'flex-start', whiteSpace: 'pre-wrap', minHeight: 54 }}>{c.text.replace(/\\n/g, '\n')}</div>;
    case 'menu':
      return (
        <div key={key} style={{ display: 'flex', gap: 14, padding: '2px 4px', borderBottom: '1px solid rgba(127,127,127,.4)' }}>
          {c.text.split(',').map((m, i) => <span key={i}>{m}</span>)}
        </div>
      );
    case 'status':
      return <div key={key} style={{ padding: '2px 4px', borderTop: '1px solid rgba(127,127,127,.4)', fontSize: 12, opacity: 0.8 }}>{c.text}</div>;
    case 'space':
      return <div key={key} style={{ flex: 1 }} />;
    default:
      return <div key={key}>{c.kind} {c.text}</div>;
  }
}

export function QtMock({ title, spec, width = 300, labelWidth }: { title: string; spec: string; width?: number; labelWidth?: number }) {
  const rows = parse(spec);
  return (
    <div role="img" aria-label={`창 '${title}'의 배치 그림`} style={{ width, maxWidth: '100%', margin: '0 auto', border: '1px solid currentColor', borderRadius: 8, overflow: 'hidden', fontSize: 13 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', background: 'rgba(127,127,127,.18)', borderBottom: '1px solid currentColor' }}>
        <span style={{ display: 'flex', gap: 4 }}>
          {[0, 1, 2].map((i) => <span key={i} style={{ width: 9, height: 9, borderRadius: '50%', border: '1px solid currentColor', opacity: 0.6 }} />)}
        </span>
        <span style={{ flex: 1, textAlign: 'center', fontWeight: 600 }}>{title}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 10 }}>
        {rows.map((row, r) => (
          <div key={r} style={{ display: 'flex', gap: 6 }}>
            {row.map((c, i) => {
              const lead = c.kind === 'label' && row.length > 1 && i === 0;
              const flex = lead ? (labelWidth ? `0 0 ${labelWidth}px` : '0 0 auto') : 1;
              return <div key={i} style={{ flex, minWidth: 0 }}>{render(c, i)}</div>;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
