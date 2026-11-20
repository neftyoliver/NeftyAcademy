import { useBook } from '../context';
import type { Book, FrontView } from '../types';
import { GalleryView } from './GalleryView';
import { ListView } from './ListView';
import { WebView } from './WebView';

const VIEWS: { id: FrontView; label: string }[] = [
  { id: 'web', label: '지도' },
  { id: 'list', label: '목록' },
  { id: 'gallery', label: '갤러리' },
];

/** 카테고리 고르기. 어느 보기에서든 늘 보이도록 상단바 오른쪽에 들어간다. */
export function CategoryPicker() {
  const { library, category, setCategory } = useBook();
  return (
    <label className="bf-select">
      <span className="bf-sr">카테고리</span>
      <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="카테고리">
        <option value="">모든 카테고리</option>
        {library.categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </label>
  );
}

/** 책 여러 권을 지도·목록·갤러리 가운데 고른 보기로 보여 준다. 앞표지와 서가(책 속의 책) 쪽이 함께 쓴다. */
export function Shelf({ books, tabs }: { books: Book[]; tabs?: boolean }) {
  const { view, setView } = useBook();
  return (
    <>
      {tabs ? <ViewTabs /> : null}
      <section className="bf-front-view" role="tabpanel">
        {view === 'web' ? <WebView books={books} /> : view === 'list' ? <ListView books={books} /> : <GalleryView books={books} />}
      </section>
    </>
  );

  function ViewTabs() {
    return (
      <div className="bf-tabs" role="tablist" aria-label="보기">
        {VIEWS.map((v) => (
          <button key={v.id} type="button" role="tab" aria-selected={view === v.id} onClick={() => setView(v.id)}>
            {v.label}
          </button>
        ))}
      </div>
    );
  }
}

export function FrontPage() {
  const { library, view, setView, category } = useBook();
  const books = category ? library.books.filter((b) => b.category === category) : library.books;

  return (
    <main className="bf-front">
      <div className="bf-front-head">
        <div>
          <h1>{library.title}</h1>
          {library.subtitle ? <p className="bf-lead">{library.subtitle}</p> : null}
        </div>
        <div className="bf-tabs" role="tablist" aria-label="보기">
          {VIEWS.map((v) => (
            <button key={v.id} type="button" role="tab" aria-selected={view === v.id} onClick={() => setView(v.id)}>
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <Shelf books={books} />

      {library.footer ? <footer className="bf-footer">{library.footer}</footer> : null}
    </main>
  );
}
