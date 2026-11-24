import { bookColor, useBook } from '../context';
import { href } from '../router';
import { flatChapters, progressOf } from './common';
import { Shelf } from './FrontPage';
import { ReadMark } from './ListView';

/** 책 한 권의 차례. */
export function BookPage({ bookId }: { bookId: string }) {
  const { library, findBook, record, readOf } = useBook();
  const book = findBook(bookId);
  if (!book) return <NotFound />;
  const reading = record.status === 'ready';
  const read = readOf(book);
  const category = library.categories.find((c) => c.id === book.category);
  const inner = book.books ?? [];
  const progress = progressOf(book);

  return (
    <main className={`bf-bookpage${inner.length > 0 ? ' is-shelf' : ''}`} style={{ ['--node' as string]: bookColor(library, book) }}>
      <header className="bf-bookpage-head">
        <span className="bf-eyebrow">{category?.name}</span>
        <h1>{book.title}</h1>
        {book.subtitle ? <p className="bf-lead">{book.subtitle}</p> : null}
        {reading && read.total > 0 ? (
          <p className="bf-shelf-note">
            읽은 쪽 {read.done}/{read.total}
            {read.complete ? <span className="bf-badge is-complete">완독</span> : null}
          </p>
        ) : null}
        {inner.length > 0 ? (
          <p className="bf-shelf-note">
            책 {inner.length}권이 들어 있는 라이브러리 · 챕터 {progress.total}개 가운데 {progress.written}개를 썼습니다
          </p>
        ) : null}
      </header>
      {inner.length > 0 ? (
        <div className="bf-shelf">
          <Shelf books={inner} tabs />
        </div>
      ) : null}
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
              {reading && record.pages[`${book.id}/${ch.id}`] ? <ReadMark record={record.pages[`${book.id}/${ch.id}`]!} /> : null}
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
