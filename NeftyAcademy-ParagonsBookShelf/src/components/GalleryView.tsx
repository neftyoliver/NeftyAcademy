import { bookColor, useBook } from '../context';
import { href } from '../router';
import type { Book } from '../types';
import { flatChapters } from './common';

/** 갤러리 보기: 책만 카드로. */
export function GalleryView({ books }: { books: Book[] }) {
  const { library } = useBook();
  if (books.length === 0) return <p className="bf-empty">이 카테고리에는 아직 책이 없습니다.</p>;
  return (
    <div className="bf-gallery">
      {books.map((book) => {
        const all = flatChapters(book);
        const written = all.filter((f) => !f.chapter.draft).length;
        return (
          <a key={book.id} href={href({ name: 'book', bookId: book.id })} className="bf-card" style={{ ['--node' as string]: bookColor(library, book) }}>
            <div className="bf-card-cover">{book.cover ?? <span className="bf-card-initial">{Array.from(book.title)[0]}</span>}</div>
            <div className="bf-card-body">
              <strong>{book.title}</strong>
              {book.subtitle ? <span>{book.subtitle}</span> : null}
              <small>
                {library.categories.find((c) => c.id === book.category)?.name} · {written}/{all.length}챕터
              </small>
              <span className="bf-progress" aria-hidden="true">
                <span style={{ width: `${(written / Math.max(1, all.length)) * 100}%` }} />
              </span>
            </div>
          </a>
        );
      })}
    </div>
  );
}
