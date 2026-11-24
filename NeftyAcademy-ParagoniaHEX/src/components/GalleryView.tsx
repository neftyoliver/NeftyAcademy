import { bookColor, useBook } from '../context';
import { href } from '../router';
import type { Book } from '../types';
import { progressOf } from './common';

/** 갤러리 보기: 책만 카드로. */
export function GalleryView({ books }: { books: Book[] }) {
  const { library, record, readOf } = useBook();
  const reading = record.status === 'ready';
  if (books.length === 0) return <p className="bf-empty">이 카테고리에는 아직 책이 없습니다.</p>;
  return (
    <div className="bf-gallery">
      {books.map((book) => {
        const { written, total } = progressOf(book);
        const inner = book.books?.length ?? 0;
        const read = readOf(book);
        const complete = reading && read.complete;
        return (
          <a key={book.id} href={href({ name: 'book', bookId: book.id })} className={`bf-card${complete ? ' is-complete' : ''}`} style={{ ['--node' as string]: bookColor(library, book) }}>
            <div className="bf-card-cover">{book.cover ?? <span className="bf-card-initial">{Array.from(book.title)[0]}</span>}</div>
            <div className="bf-card-body">
              <strong>{book.title}</strong>
              {book.subtitle ? <span>{book.subtitle}</span> : null}
              <small>
                {library.categories.find((c) => c.id === book.category)?.name} · {inner ? `${inner}권 · ` : ''}{written}/{total}챕터
                {reading && read.total > 0 ? ` · 읽음 ${read.done}/${read.total}` : ''}
              </small>
              {complete ? <span className="bf-badge is-complete">완독</span> : null}
              <span className="bf-progress" aria-hidden="true">
                <span style={{ width: `${(written / Math.max(1, total)) * 100}%` }} />
              </span>
            </div>
          </a>
        );
      })}
    </div>
  );
}
