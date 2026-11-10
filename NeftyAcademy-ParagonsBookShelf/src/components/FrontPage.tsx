import { useBook } from '../context';
import type { FrontView } from '../types';
import { GalleryView } from './GalleryView';
import { ListView } from './ListView';
import { WebView } from './WebView';

const VIEWS: { id: FrontView; label: string }[] = [
  { id: 'web', label: '거미줄' },
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

      <section className="bf-front-view" role="tabpanel">
        {view === 'web' ? <WebView books={books} /> : view === 'list' ? <ListView books={books} /> : <GalleryView books={books} />}
      </section>

      {library.footer ? <footer className="bf-footer">{library.footer}</footer> : null}
    </main>
  );
}
