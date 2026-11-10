import { bookColor, useBook } from '../context';
import { href } from '../router';
import type { Book } from '../types';
import { flatChapters } from './common';

/** 목록 보기: 카테고리 → 책 → 챕터를 접었다 펴는 드롭다운으로. */
export function ListView({ books }: { books: Book[] }) {
  const { library } = useBook();
  const groups = library.categories
    .map((cat) => ({ cat, books: books.filter((b) => b.category === cat.id) }))
    .filter((g) => g.books.length > 0);

  if (groups.length === 0) return <p className="bf-empty">이 카테고리에는 아직 책이 없습니다.</p>;

  return (
    <div className="bf-list">
      {groups.map(({ cat, books }) => (
        <details key={cat.id} open className="bf-list-cat">
          <summary>
            {cat.name} <span className="bf-count">{books.length}</span>
          </summary>
          {books.map((book) => (
            <details key={book.id} className="bf-list-book" style={{ ['--node' as string]: bookColor(library, book) }}>
              <summary>
                <span className="bf-dot" />
                <span className="bf-list-title">{book.title}</span>
                {book.subtitle ? <span className="bf-list-sub">{book.subtitle}</span> : null}
                <span className="bf-count">{flatChapters(book).length}챕터</span>
              </summary>
              <ol>
                {flatChapters(book).map(({ chapter: ch, label, depth }) => (
                  <li key={ch.id} className={[ch.draft ? 'is-draft' : '', depth ? 'bf-sub' : ''].join(' ')}>
                    <a href={href({ name: 'read', bookId: book.id, chapterId: ch.id })}>
                      <span className="bf-num">{label}</span>
                      <span>
                        {ch.title}
                        {ch.summary ? <small>{ch.summary}</small> : null}
                      </span>
                      {ch.draft ? <span className="bf-badge">준비 중</span> : null}
                    </a>
                  </li>
                ))}
              </ol>
            </details>
          ))}
        </details>
      ))}
    </div>
  );
}
