import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useStored } from './storage';
import { flatChapters, type FlatChapter } from './components/common';
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
  findBook: (id: string) => Book | undefined;
  findChapter: (bookId: string, chapterId: string) => { book: Book; chapter: Chapter; index: number; label: string; flat: FlatChapter[] } | undefined;
}

const Ctx = createContext<BookState | null>(null);

export function BookProvider({ library, children }: { library: Library; children: ReactNode }) {
  const k = (name: string): string => `${library.storageKey}:${name}`;
  const [bookmarks, setBookmarks] = useStored<Bookmark[]>(k('bookmarks'), []);
  const [marks, setMarks] = useStored<TextMark[]>(k('marks'), []);
  const [view, setView] = useStored<FrontView>(k('view'), 'web');
  const [category, setCategory] = useStored<string>(k('category'), '');

  const value = useMemo<BookState>(() => {
    const findBook = (id: string): Book | undefined => library.books.find((b) => b.id === id);
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
      findChapter: (bookId, chapterId) => {
        const book = findBook(bookId);
        if (!book) return undefined;
        const flat = flatChapters(book);
        const index = flat.findIndex((f) => f.chapter.id === chapterId);
        const hit = flat[index];
        return hit ? { book, chapter: hit.chapter, index, label: hit.label, flat } : undefined;
      },
    };
  }, [library, bookmarks, marks, view, category, setBookmarks, setMarks, setView, setCategory]);

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
