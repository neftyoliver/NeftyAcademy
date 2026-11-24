/**
 * 해시 주소(#/...)로 움직이는 아주 작은 라우터.
 * 해시를 쓰면 HTML 한 파일을 file:// 로 열어도 새로고침·뒤로 가기가 그대로 된다.
 *
 *   #/                       앞표지
 *   #/book/<책>              책 차례
 *   #/read/<책>/<챕터>       읽기
 *   #/read/<책>/<챕터>/<n>   읽기, n번째 단락으로 이동
 */
import { useSyncExternalStore } from 'react';
import type { Route } from './types';

export function parseHash(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  if (parts[0] === 'book' && parts[1]) return { name: 'book', bookId: parts[1] };
  if (parts[0] === 'read' && parts[1] && parts[2]) {
    const n = parts[3] === undefined ? undefined : Number(parts[3]);
    return { name: 'read', bookId: parts[1], chapterId: parts[2], section: Number.isInteger(n) ? n : undefined };
  }
  return { name: 'front' };
}

export function href(route: Route): string {
  const enc = encodeURIComponent;
  switch (route.name) {
    case 'front':
      return '#/';
    case 'book':
      return `#/book/${enc(route.bookId)}`;
    case 'read':
      return `#/read/${enc(route.bookId)}/${enc(route.chapterId)}${route.section === undefined ? '' : `/${route.section}`}`;
  }
}

export function navigate(route: Route): void {
  window.location.hash = href(route);
}

function subscribe(cb: () => void): () => void {
  window.addEventListener('hashchange', cb);
  return () => window.removeEventListener('hashchange', cb);
}

export function useHash(): string {
  return useSyncExternalStore(subscribe, () => window.location.hash);
}
