import { useBook } from '../context';
import { href } from '../router';
import type { Book } from '../types';
import { readablePages } from './common';
import { RecordPanel } from './RecordPanel';

const day = (ms: number): string => new Date(ms).toLocaleDateString('ko-KR', { year: '2-digit', month: 'numeric', day: 'numeric' });

/** 자주 본 쪽: 열람 기록에서 많이 연 순서로. 이 보기에 넘어온 책들(서가면 안쪽 책까지)의 쪽만 보인다. */
export function TopView({ books }: { books: Book[] }) {
  const { record, refs } = useBook();
  if (record.status !== 'ready') {
    return (
      <div className="bf-top-empty">
        <p>열람 기록을 켜면 자주 본 쪽이 여기에 모입니다.</p>
        <RecordPanel />
      </div>
    );
  }
  const inside = new Set(books.flatMap(readablePages));
  const rows = Object.entries(record.pages)
    .filter(([key, r]) => r.views > 0 && inside.has(key))
    .sort((a, b) => b[1].views - a[1].views || b[1].last - a[1].last)
    .slice(0, 50);
  if (rows.length === 0) return <p className="bf-empty">아직 기록이 없습니다. 쪽을 열면 여기에 쌓입니다.</p>;
  return (
    <ol className="bf-top">
      {rows.map(([key, r], i) => {
        const t = refs.at.get(key)!;
        return (
          <li key={key}>
            <a href={href({ name: 'read', bookId: t.book.id, chapterId: t.chapter.id })}>
              <span className="bf-top-rank">{i + 1}</span>
              <span className="bf-top-title">
                <strong>{t.chapter.title}</strong>
                <small>
                  {t.book.title} · {t.label}
                </small>
              </span>
              {r.done !== undefined ? <span className="bf-badge is-read">다 읽음</span> : null}
              <span className="bf-top-when">{day(r.last)}</span>
              <span className="bf-top-count">{r.views}번</span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}
