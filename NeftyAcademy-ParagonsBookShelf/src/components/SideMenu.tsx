import { useEffect, useRef } from 'react';
import { bookColor, useBook } from '../context';
import { href } from '../router';
import { flatChapters } from './common';

/**
 * 왼쪽에서 내려오는 메뉴. 상단바와 다른 빛깔의 반투명 판.
 * 차례 / 북마크 / 줄친 곳 세 묶음이 접혔다 펴진다.
 */
export function SideMenu({ open, onClose, current }: { open: boolean; onClose: () => void; current?: { bookId: string; chapterId?: string } }) {
  const { library, bookmarks, marks, removeMark, findChapter } = useBook();
  const panel = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('hashchange', onClose);
    panel.current?.querySelector<HTMLElement>('a, button')?.focus({ preventScroll: true });
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('hashchange', onClose);
    };
  }, [open, onClose]);

  return (
    <>
      <div className={`bf-scrim${open ? ' is-open' : ''}`} onClick={onClose} aria-hidden="true" />
      <aside ref={panel} className={`bf-sidemenu${open ? ' is-open' : ''}`} aria-label="메뉴" aria-hidden={!open} inert={!open}>
        <details open>
          <summary>차례</summary>
          {library.books.map((book) => (
            <details key={book.id} className="bf-menu-book" open={current?.bookId === book.id}>
              <summary>
                <span className="bf-dot" style={{ background: bookColor(library, book) }} />
                {book.title}
              </summary>
              <ol className="bf-menu-chapters">
                {flatChapters(book).map(({ chapter: ch, label, depth }) => (
                  <li key={ch.id} className={depth ? 'bf-sub' : undefined}>
                    <a
                      href={href({ name: 'read', bookId: book.id, chapterId: ch.id })}
                      aria-current={current?.bookId === book.id && current.chapterId === ch.id ? 'page' : undefined}
                      className={ch.draft ? 'is-draft' : undefined}
                    >
                      <span className="bf-num">{label}</span>
                      {ch.title}
                    </a>
                  </li>
                ))}
              </ol>
            </details>
          ))}
        </details>

        <details open={bookmarks.length > 0}>
          <summary>북마크 <span className="bf-count">{bookmarks.length}</span></summary>
          {bookmarks.length === 0 ? (
            <p className="bf-empty">읽기 화면 위쪽의 책갈피 단추로 지금 단락을 꽂아 둘 수 있습니다.</p>
          ) : (
            <ul className="bf-menu-list">
              {[...bookmarks]
                .sort((a, b) => b.at - a.at)
                .map((b) => {
                  const found = findChapter(b.bookId, b.chapterId);
                  return (
                    <li key={`${b.bookId}/${b.chapterId}/${b.section}`}>
                      <a href={href({ name: 'read', bookId: b.bookId, chapterId: b.chapterId, section: b.section < 0 ? undefined : b.section })}>
                        <small>{found ? `${found.book.title} · ${found.label}` : '사라진 챕터'}</small>
                        {b.label}
                      </a>
                    </li>
                  );
                })}
            </ul>
          )}
        </details>

        <details open={marks.length > 0}>
          <summary>줄친 곳 <span className="bf-count">{marks.length}</span></summary>
          {marks.length === 0 ? (
            <p className="bf-empty">본문을 드래그해 고른 뒤 「줄치기」를 누르면 여기에 모입니다.</p>
          ) : (
            <ul className="bf-menu-list">
              {[...marks]
                .sort((a, b) => b.at - a.at)
                .map((m) => {
                  const found = findChapter(m.bookId, m.chapterId);
                  return (
                    <li key={m.id} className="bf-mark-item">
                      <a href={href({ name: 'read', bookId: m.bookId, chapterId: m.chapterId })}>
                        <small>{found ? `${found.book.title} · ${found.chapter.title}` : '사라진 챕터'}</small>
                        <span className="bf-mark-text">{m.text.length > 80 ? `${m.text.slice(0, 80)}…` : m.text}</span>
                      </a>
                      <button type="button" className="bf-x" aria-label="줄 지우기" onClick={() => removeMark(m.id)}>
                        ×
                      </button>
                    </li>
                  );
                })}
            </ul>
          )}
        </details>
      </aside>
    </>
  );
}
