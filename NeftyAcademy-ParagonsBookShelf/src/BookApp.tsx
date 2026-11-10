import { useCallback, useEffect, useState } from 'react';
import { BookPage } from './components/BookPage';
import { CategoryPicker, FrontPage } from './components/FrontPage';
import { Reader } from './components/Reader';
import { SideMenu } from './components/SideMenu';
import { TopBar } from './components/TopBar';
import { BookProvider, useBook } from './context';
import { href, parseHash, useHash } from './router';
import type { Library } from './types';

/** 책 한 질 전체. 이것 하나만 그리면 된다. */
export function BookApp({ library }: { library: Library }) {
  return (
    <BookProvider library={library}>
      <Screens />
    </BookProvider>
  );
}

function Screens() {
  const { library, findBook, findChapter } = useBook();
  const route = parseHash(useHash());
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // 쪽이 바뀌면 문서 제목도 바꾼다(탭·방문 기록에 보이는 이름).
  useEffect(() => {
    let title = library.title;
    if (route.name === 'book') title = `${findBook(route.bookId)?.title ?? ''} · ${library.title}`;
    if (route.name === 'read') {
      const f = findChapter(route.bookId, route.chapterId);
      if (f) title = `${f.chapter.title} · ${f.book.title}`;
    }
    document.title = title;
  });

  let trail = null;
  let current: { bookId: string; chapterId?: string } | undefined;
  if (route.name === 'book') {
    const book = findBook(route.bookId);
    current = { bookId: route.bookId };
    trail = book ? <span>{book.title}</span> : null;
  } else if (route.name === 'read') {
    const f = findChapter(route.bookId, route.chapterId);
    current = { bookId: route.bookId, chapterId: route.chapterId };
    trail = f ? (
      <>
        <a href={href({ name: 'book', bookId: f.book.id })}>{f.book.title}</a>
        <span aria-hidden="true">›</span>
        <span>
          {f.label}. {f.chapter.title}
        </span>
      </>
    ) : null;
  }

  return (
    <div className="bf-root">
      <TopBar onMenu={() => setMenuOpen((v) => !v)} menuOpen={menuOpen} trail={trail} right={route.name === 'front' ? <CategoryPicker /> : null} />
      <SideMenu open={menuOpen} onClose={closeMenu} current={current} />
      {route.name === 'front' && <FrontPage />}
      {route.name === 'book' && <BookPage bookId={route.bookId} />}
      {route.name === 'read' && <Reader key={`${route.bookId}/${route.chapterId}`} bookId={route.bookId} chapterId={route.chapterId} section={route.section} />}
    </div>
  );
}
