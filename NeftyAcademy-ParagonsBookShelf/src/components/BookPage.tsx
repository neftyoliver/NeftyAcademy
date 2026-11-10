import { bookColor, useBook } from '../context';
import { href } from '../router';
import { flatChapters } from './common';

/** 책 한 권의 차례. */
export function BookPage({ bookId }: { bookId: string }) {
  const { library, findBook } = useBook();
  const book = findBook(bookId);
  if (!book) return <NotFound />;
  const category = library.categories.find((c) => c.id === book.category);

  return (
    <main className="bf-bookpage" style={{ ['--node' as string]: bookColor(library, book) }}>
      <header className="bf-bookpage-head">
        <span className="bf-eyebrow">{category?.name}</span>
        <h1>{book.title}</h1>
        {book.subtitle ? <p className="bf-lead">{book.subtitle}</p> : null}
      </header>
      <ol className="bf-toc">
        {flatChapters(book).map(({ chapter: ch, label, depth }) => (
          <li key={ch.id} className={[ch.draft ? 'is-draft' : '', depth ? 'bf-sub' : ''].join(' ')}>
            <a href={href({ name: 'read', bookId: book.id, chapterId: ch.id })}>
              <span className="bf-toc-num">{label}</span>
              <span className="bf-toc-text">
                <strong>{ch.title}</strong>
                {ch.summary ? <span>{ch.summary}</span> : null}
              </span>
              {ch.draft ? <span className="bf-badge">준비 중</span> : null}
            </a>
          </li>
        ))}
      </ol>
    </main>
  );
}

export function NotFound() {
  return (
    <main className="bf-bookpage">
      <h1>찾을 수 없는 쪽입니다</h1>
      <p>
        <a href={href({ name: 'front' })}>앞표지로 돌아가기</a>
      </p>
    </main>
  );
}
