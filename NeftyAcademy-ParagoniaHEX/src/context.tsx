import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useRecord, type RecordApi } from './record';
import { buildRefs, type RefIndex } from './refs';
import { useStored } from './storage';
import { allBooks, flatChapters, pathToBook, readablePages, type FlatChapter } from './components/common';
import type { Book, Bookmark, Chapter, FrontView, TextMark, Library } from './types';

interface BookState {
  library: Library;
  bookmarks: Bookmark[];
  toggleBookmark: (b: Omit<Bookmark, 'at'>) => void;
  marks: TextMark[];
  addMark: (h: Omit<TextMark, 'id' | 'at'>) => void;
  removeMark: (id: string) => void;
  view: FrontView;
  setView: (v: FrontView) => void;
  category: string; // '' = 전체
  setCategory: (c: string) => void;
  /** 서가 안쪽의 책까지 찾는다 */
  findBook: (id: string) => Book | undefined;
  /** 가장 바깥 책에서 이 책까지의 길(자기 자신 포함) */
  bookPath: (id: string) => Book[];
  findChapter: (bookId: string, chapterId: string) => { book: Book; chapter: Chapter; index: number; label: string; flat: FlatChapter[] } | undefined;
  /** 참조 관계: 어느 쪽이 어느 쪽을 가리키는가 */
  refs: RefIndex;
  /** 열람 기록(세이브 파일) */
  record: RecordApi;
  /** 이 책(서가면 안쪽 책까지)에서 읽을 수 있는 쪽의 수와 그중 끝까지 읽은 쪽의 수. 기록이 꺼져 있으면 done 은 0 */
  readOf: (book: Book) => { done: number; total: number; complete: boolean };
}

const Ctx = createContext<BookState | null>(null);

export function BookProvider({ library, children }: { library: Library; children: ReactNode }) {
  const k = (name: string): string => `${library.storageKey}:${name}`;
  const [bookmarks, setBookmarks] = useStored<Bookmark[]>(k('bookmarks'), []);
  const [marks, setMarks] = useStored<TextMark[]>(k('marks'), []);
  const [view, setView] = useStored<FrontView>(k('view'), 'web');
  const [category, setCategory] = useStored<string>(k('category'), '');
  const record = useRecord(library.storageKey);
  const refs = useMemo(() => buildRefs(library), [library]);

  const value = useMemo<BookState>(() => {
    const every = allBooks(library.books);
    const pagesOf = new Map<string, string[]>();
    const findBook = (id: string): Book | undefined => every.find((b) => b.id === id);
    return {
      library,
      bookmarks,
      toggleBookmark: (b) =>
        setBookmarks((prev) => {
          const same = (x: Bookmark): boolean => x.bookId === b.bookId && x.chapterId === b.chapterId && x.section === b.section;
          return prev.some(same) ? prev.filter((x) => !same(x)) : [...prev, { ...b, at: Date.now() }];
        }),
      marks,
      addMark: (h) =>
        setMarks((prev) => [...prev, { ...h, id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, at: Date.now() }]),
      removeMark: (id) => setMarks((prev) => prev.filter((x) => x.id !== id)),
      view,
      setView,
      category: library.categories.some((c) => c.id === category) ? category : '',
      setCategory,
      findBook,
      bookPath: (id) => pathToBook(library.books, id),
      findChapter: (bookId, chapterId) => {
        const book = findBook(bookId);
        if (!book) return undefined;
        const flat = flatChapters(book);
        const index = flat.findIndex((f) => f.chapter.id === chapterId);
        const hit = flat[index];
        return hit ? { book, chapter: hit.chapter, index, label: hit.label, flat } : undefined;
      },
      refs,
      record,
      readOf: (book) => {
        const keys = pagesOf.get(book.id) ?? pagesOf.set(book.id, readablePages(book)).get(book.id)!;
        const done = keys.reduce((n, key) => n + (record.pages[key]?.done !== undefined ? 1 : 0), 0);
        return { done, total: keys.length, complete: keys.length > 0 && done === keys.length };
      },
    };
  }, [library, bookmarks, marks, view, category, setBookmarks, setMarks, setView, setCategory, refs, record]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBook(): BookState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useBook()은 <BookApp> 안에서만 쓸 수 있습니다');
  return v;
}

export function bookColor(library: Library, book: Book): string {
  return book.color ?? library.categories.find((c) => c.id === book.category)?.color ?? 'var(--bf-accent)';
}
