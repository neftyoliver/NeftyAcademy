import { Fragment, memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ComponentType, type ReactNode } from 'react';
import { bookColor, useBook } from '../context';
import { buildIndex, canPaint, caretAt, findOccurrence, occurrenceBefore, offsetOf, paint, rangeOf } from '../marks';
import type { RefIndex } from '../refs';
import { href, parseHash } from '../router';
import { NotFound } from './BookPage';
import { ScrollRail, type RailSection } from './ScrollRail';

/**
 * 띄어쓰기 없는 긴 식별자(`enable_shared_from_this`, `std::chrono::duration`)가
 * 좁은 화면에서 `_`와 `::` 뒤에서 끊기게 한다. 끊을 자리가 없는 제목은 그대로 돌려준다.
 */
function breakable(text: string): ReactNode {
  if (!/_|::/.test(text)) return text;
  return text.split(/(_|::)/).map((part, i) =>
    part === '_' || part === '::' ? (
      <Fragment key={i}>
        {part}
        <wbr />
      </Fragment>
    ) : (
      part
    ),
  );
}

/** 본문은 한 번 그린 뒤 Reader의 상태가 바뀌어도 다시 그리지 않는다(줄치기 Range가 흔들리지 않게). */
const Body = memo(function Body({ Content }: { Content: ComponentType }) {
  return <Content />;
});

/**
 * 바깥(http, https)으로 나가는 링크는 새 탭에서 열고 bf-ext 를 붙인다. 본문이 MDX 든 TSX 든 그린 뒤에 한 번 훑는다.
 * 바깥 링크라는 표시(↗)는 CSS 가 붙인다. 본문의 글자를 바꾸면 줄치기의 자리가 어긋나기 때문이다.
 */
function markExternalLinks(root: HTMLElement): void {
  for (const a of root.querySelectorAll<HTMLAnchorElement>('a[href]')) {
    if (a.classList.contains('bf-ext') || !/^(?:https?:)?\/\//i.test(a.getAttribute('href') ?? '')) continue;
    a.classList.add('bf-ext');
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    if (!a.title) a.title = '바깥 링크 (새 탭에서 열립니다)';
  }
}

/** 다른 쪽으로 가는 링크에, 올리면 보이는 이름표를 단다: "책 제목 › 3.2 챕터 제목". 코드 속 낱말에 걸린 링크가 어디로 가는지 누르기 전에 알 수 있다. */
function nameInnerLinks(root: HTMLElement, at: RefIndex['at']): void {
  for (const a of root.querySelectorAll<HTMLAnchorElement>('a[href^="#/read/"]')) {
    if (a.title) continue;
    const route = parseHash(a.getAttribute('href') ?? '');
    const t = route.name === 'read' ? at.get(`${route.bookId}/${route.chapterId}`) : undefined;
    if (t) a.title = `${t.book.title} › ${t.label} ${t.chapter.title}`;
  }
}

/** 「같이 보기」에 처음부터 보여 주는 수. 이보다 많으면 나머지는 단추를 눌러야 편다 */
const SEE_ALSO = 24;

interface Placed {
  id: string;
  start: number;
  end: number;
  range: Range;
}

export function Reader({ bookId, chapterId, section }: { bookId: string; chapterId: string; section?: number }) {
  const { library, findChapter, marks, addMark, removeMark, bookmarks, toggleBookmark, refs, record } = useBook();
  const found = findChapter(bookId, chapterId);
  const article = useRef<HTMLDivElement>(null);
  const endMark = useRef<HTMLDivElement>(null);
  const pageKey = `${bookId}/${chapterId}`;
  const readable = Boolean(found?.chapter.Content && !found.chapter.draft);
  const recording = record.status === 'ready';
  const pageRecord = record.pages[pageKey];
  const finished = pageRecord?.done !== undefined;
  const [sections, setSections] = useState<RailSection[]>([]);
  const [current, setCurrent] = useState(-1);
  const [pending, setPending] = useState<{ start: number; end: number; x: number; y: number } | null>(null);
  const [popover, setPopover] = useState<{ id: string; x: number; y: number } | null>(null);
  const placed = useRef<Placed[]>([]);
  const [markTops, setMarkTops] = useState<number[]>([]);
  /** 「같이 보기」를 다 펴 둔 쪽. 다른 쪽으로 가면 다시 접힌다 */
  const [allRefs, setAllRefs] = useState('');

  const chapterMarks = useMemo(() => marks.filter((m) => m.bookId === bookId && m.chapterId === chapterId), [marks, bookId, chapterId]);

  // ---------- 단락(h2) 찾기 ----------
  const scan = useCallback(() => {
    const root = article.current;
    if (!root) return;
    markExternalLinks(root);
    nameInnerLinks(root, refs.at);
    const hs = Array.from(root.querySelectorAll('h2'));
    setSections(
      hs.map((h, i) => {
        if (!h.id) h.id = `s${i}`;
        return { index: i, title: h.textContent ?? `단락 ${i + 1}`, el: h };
      }),
    );
  }, [refs]);

  useLayoutEffect(() => {
    scan();
    setPending(null);
    setPopover(null);
  }, [bookId, chapterId, scan]);

  // ---------- 처음 들어왔을 때 위치 ----------
  useEffect(() => {
    const target = section === undefined ? null : article.current?.querySelectorAll('h2')[section];
    if (target) target.scrollIntoView({ block: 'start' });
    else window.scrollTo(0, 0);
  }, [bookId, chapterId, section]);

  // ---------- 열람 기록: 연 횟수, 끝까지 읽었는가 ----------
  const { countView, markDone } = record;
  useEffect(() => {
    if (readable && recording) countView(pageKey);
  }, [pageKey, readable, recording, countView]);

  useEffect(() => {
    const el = endMark.current;
    if (!el || !readable || !recording || finished) return;
    // 본문의 끝이 화면에 들어와 잠깐 머물면 끝까지 읽은 것으로 친다
    let timer = 0;
    const io = new IntersectionObserver(([entry]) => {
      window.clearTimeout(timer);
      if (entry?.isIntersecting) timer = window.setTimeout(() => markDone(pageKey), 1200);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [pageKey, readable, recording, finished, markDone]);

  // ---------- 지금 읽는 단락 ----------
  useEffect(() => {
    let raf = 0;
    const update = (): void => {
      raf = 0;
      const line = 90; // 상단바 바로 아래
      let cur = -1;
      for (const s of sections) {
        if (s.el.getBoundingClientRect().top <= line) cur = s.index;
        else break;
      }
      setCurrent(cur);
    };
    const onScroll = (): void => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [sections]);

  // ---------- 줄치기 칠하기 ----------
  const repaint = useCallback(() => {
    const root = article.current;
    if (!root) return;
    const index = buildIndex(root);
    const list: Placed[] = [];
    for (const m of chapterMarks) {
      const start = findOccurrence(index.text, m.text, m.occurrence);
      if (start < 0) continue; // 본문이 바뀌어 더는 찾을 수 없는 줄
      const range = rangeOf(index, start, start + m.text.length);
      if (range) list.push({ id: m.id, start, end: start + m.text.length, range });
    }
    placed.current = list;
    paint(list.map((p) => p.range));
    setMarkTops(list.map((p) => p.range.getBoundingClientRect().top + window.scrollY));
  }, [chapterMarks]);

  useEffect(() => {
    repaint();
    const root = article.current;
    if (!root) return;
    // 본문 속 상호작용 컴포넌트가 글자를 바꾸면 다시 찾는다.
    let t = 0;
    const mo = new MutationObserver(() => {
      clearTimeout(t);
      t = window.setTimeout(() => {
        repaint();
        scan();
      }, 120);
    });
    mo.observe(root, { childList: true, subtree: true, characterData: true });
    return () => {
      mo.disconnect();
      clearTimeout(t);
      paint([]);
    };
  }, [repaint, scan]);

  // ---------- 고르기 → 「줄치기」 단추 ----------
  const onSelectEnd = (): void => {
    const root = article.current;
    const sel = window.getSelection();
    if (!root || !sel || sel.isCollapsed || sel.rangeCount === 0) {
      setPending(null);
      return;
    }
    const r = sel.getRangeAt(0);
    if (!root.contains(r.startContainer) || !root.contains(r.endContainer)) return;
    const start = offsetOf(root, r.startContainer, r.startOffset);
    const end = offsetOf(root, r.endContainer, r.endOffset);
    if (end - start < 1) return;
    const rects = r.getClientRects();
    const last = rects[rects.length - 1] ?? r.getBoundingClientRect();
    setPopover(null);
    setPending({ start, end, x: last.right, y: last.bottom });
  };

  useEffect(() => {
    const onSel = (): void => {
      if (window.getSelection()?.isCollapsed) setPending(null);
    };
    document.addEventListener('selectionchange', onSel);
    return () => document.removeEventListener('selectionchange', onSel);
  }, []);

  const commitMark = (): void => {
    const root = article.current;
    if (!root || !pending) return;
    const full = buildIndex(root).text;
    const text = full.slice(pending.start, pending.end);
    if (text.trim()) addMark({ bookId, chapterId, text, occurrence: occurrenceBefore(full, text, pending.start) });
    window.getSelection()?.removeAllRanges();
    setPending(null);
  };

  // ---------- 칠한 곳을 누르면 「줄 지우기」 ----------
  const onArticleClick = (e: React.MouseEvent): void => {
    const root = article.current;
    if (!root || !window.getSelection()?.isCollapsed) return;
    const caret = caretAt(e.clientX, e.clientY);
    if (!caret || !root.contains(caret.node)) return setPopover(null);
    const pos = offsetOf(root, caret.node, caret.offset);
    const hit = placed.current.find((p) => pos >= p.start && pos < p.end);
    setPopover(hit ? { id: hit.id, x: e.clientX, y: e.clientY } : null);
  };

  if (!found) return <NotFound />;
  const { book, chapter, index, label, flat } = found;
  const prev = flat[index - 1];
  const next = flat[index + 1];
  const curSection = current;
  const bookmarked = bookmarks.some((b) => b.bookId === bookId && b.chapterId === chapterId && b.section === curSection);
  const chapterBookmarks = bookmarks.filter((b) => b.bookId === bookId && b.chapterId === chapterId).map((b) => b.section);
  // 같이 보기: 이 쪽을 참조하는 문서들. 같은 책의 것이 먼저 온다
  const referrers = refs.into.get(pageKey) ?? [];
  const seeAlso = [...referrers.filter((k) => refs.at.get(k)?.book.id === bookId), ...referrers.filter((k) => refs.at.get(k)?.book.id !== bookId)];
  const seeAlsoShown = allRefs === pageKey ? seeAlso : seeAlso.slice(0, SEE_ALSO);

  return (
    <div className="bf-reader" style={{ ['--node' as string]: bookColor(library, book) }}>
      <article className="bf-article">
        <header className="bf-chapter-head">
          <a className="bf-eyebrow" href={href({ name: 'book', bookId: book.id })}>
            {book.title}
          </a>
          <h1>
            <span className="bf-chapter-num">{label}</span>
            <span className="bf-chapter-title">{breakable(chapter.title)}</span>
          </h1>
          {chapter.summary ? <p className="bf-lead">{chapter.summary}</p> : null}
          {recording && readable && pageRecord ? (
            <p className="bf-read-note">
              열람 {pageRecord.views}번{finished ? ' · 끝까지 읽음' : ''}
            </p>
          ) : null}
        </header>

        <div ref={article} className="bf-prose" onMouseUp={onSelectEnd} onKeyUp={onSelectEnd} onClick={onArticleClick}>
          {chapter.draft || !chapter.Content ? (
            chapter.children?.length ? (
              <ol className="bf-toc bf-subtoc">
                {chapter.children.map((sub, j) => (
                  <li key={sub.id} className={`bf-sub${sub.draft ? ' is-draft' : ''}`}>
                    <a href={href({ name: 'read', bookId, chapterId: sub.id })}>
                      <span className="bf-toc-num">{`${label}.${j + 1}`}</span>
                      <span className="bf-toc-text">
                        <strong>{sub.title}</strong>
                        {sub.summary ? <span>{sub.summary}</span> : null}
                      </span>
                      {sub.draft ? <span className="bf-badge">준비 중</span> : null}
                    </a>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="bf-draft">
                <p>이 챕터는 아직 쓰는 중입니다.</p>
              </div>
            )
          ) : (
            <Body key={`${bookId}/${chapterId}`} Content={chapter.Content} />
          )}
        </div>

        <div ref={endMark} className="bf-end-mark" aria-hidden="true" />

        {seeAlso.length > 0 ? (
          <section className="bf-seealso" aria-labelledby="bf-seealso-title">
            <h2 id="bf-seealso-title">같이 보기</h2>
            <p>이 쪽을 참조하는 문서 {seeAlso.length}</p>
            <ul>
              {seeAlsoShown.map((k) => {
                const t = refs.at.get(k)!;
                return (
                  <li key={k}>
                    <a href={href({ name: 'read', bookId: t.book.id, chapterId: t.chapter.id })}>
                      <span className="bf-num">{t.label}</span>
                      <span>{breakable(t.chapter.title)}</span>
                      {t.book.id !== bookId ? <small>{t.book.title}</small> : null}
                    </a>
                  </li>
                );
              })}
            </ul>
            {seeAlso.length > seeAlsoShown.length ? (
              <button type="button" className="bf-seealso-more" onClick={() => setAllRefs(pageKey)}>
                나머지 {seeAlso.length - seeAlsoShown.length}쪽 모두 보기
              </button>
            ) : null}
          </section>
        ) : null}

        <nav className="bf-pager" aria-label="챕터 넘기기">
          {prev ? (
            <a href={href({ name: 'read', bookId, chapterId: prev.chapter.id })} className="bf-pager-prev">
              <small>이전</small>
              <span>
                {prev.label}. {breakable(prev.chapter.title)}
              </span>
            </a>
          ) : (
            <span />
          )}
          {next ? (
            <a href={href({ name: 'read', bookId, chapterId: next.chapter.id })} className="bf-pager-next">
              <small>다음</small>
              <span>
                {next.label}. {breakable(next.chapter.title)}
              </span>
            </a>
          ) : null}
        </nav>
      </article>

      <button
        type="button"
        className={`bf-bookmark-btn${bookmarked ? ' is-on' : ''}`}
        aria-pressed={bookmarked}
        title={bookmarked ? '북마크 빼기' : '지금 단락 북마크'}
        onClick={() =>
          toggleBookmark({
            bookId,
            chapterId,
            section: curSection,
            label: curSection >= 0 ? (sections[curSection]?.title ?? chapter.title) : chapter.title,
          })
        }
      >
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
          <path d="M5 2.5h10v15l-5-3.6-5 3.6z" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
        <span className="bf-sr">북마크</span>
      </button>

      <ScrollRail sections={sections} current={current} markTops={markTops} bookmarkSections={chapterBookmarks} chapterTitle={chapter.title} />

      {pending && (
        <button
          type="button"
          className="bf-float-btn"
          style={{ left: Math.min(pending.x, window.innerWidth - 90), top: pending.y + 8 }}
          onMouseDown={(e) => e.preventDefault() /* 고른 영역이 풀리지 않게 */}
          onClick={commitMark}
        >
          줄치기{canPaint() ? '' : ' (목록에만)'}
        </button>
      )}
      {popover && (
        <button
          type="button"
          className="bf-float-btn is-danger"
          style={{ left: popover.x, top: popover.y + 12 }}
          onClick={() => {
            removeMark(popover.id);
            setPopover(null);
          }}
        >
          줄 지우기
        </button>
      )}
    </div>
  );
}
