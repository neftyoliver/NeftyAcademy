import type { ReactNode } from 'react';
import { useBook } from '../context';
import { href } from '../router';

/** 반투명 상단바. 왼쪽에 메뉴 단추와 제목, 가운데 현재 위치, 오른쪽에 끼워 넣을 자리. */
export function TopBar({ onMenu, menuOpen, trail, right }: { onMenu: () => void; menuOpen: boolean; trail?: ReactNode; right?: ReactNode }) {
  const { library } = useBook();
  return (
    <header className="bf-topbar">
      <button type="button" className="bf-icon-btn" aria-label="메뉴" aria-expanded={menuOpen} onClick={onMenu}>
        <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
          <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
      <a className="bf-brand" href={href({ name: 'front' })}>
        {library.title}
      </a>
      {trail ? <nav className="bf-trail" aria-label="현재 위치">{trail}</nav> : null}
      <div className="bf-topbar-right">{right}</div>
    </header>
  );
}
