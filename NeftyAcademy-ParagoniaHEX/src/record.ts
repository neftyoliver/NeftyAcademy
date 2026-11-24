/**
 * 열람 기록. 켜 두었을 때만, 사용자가 고른 세이브 파일(JSON)에 쪽마다 연 횟수와 끝까지 읽은 때를 적고 읽는다.
 * 꺼 두면 아무것도 적지 않고 읽지도 않는다.
 *
 * HTML 한 파일을 file:// 로 연 화면은 옆의 파일을 마음대로 읽거나 쓸 수 없다(fetch 도 막혀 있다).
 * 길은 File System Access API 하나뿐이다: 사용자가 한 번 파일을 골라 주면 그 파일의 손잡이를 받아 읽고 쓸 수 있고,
 * 손잡이는 IndexedDB 에 넣어 두었다가 다음에 다시 쓴다. 다만 다음에 열었을 때는 브라우저가 허락을 다시 묻는데,
 * 이 물음은 단추를 누르는 것 같은 사용자의 동작 안에서만 띄울 수 있다. 그래서 상태가 여럿이다:
 *
 *   off          꺼짐
 *   unsupported  이 브라우저에는 그 API 가 없다(파이어폭스, 사파리). 켤 수 없다
 *   pick         켰지만 아직 세이브 파일을 고르지 않았다
 *   locked       세이브 파일은 기억하고 있지만 이번에 연 뒤로 허락을 받지 못했다(단추를 눌러야 한다)
 *   ready        읽고 쓰는 중
 *   error        세이브 파일을 읽거나 쓰지 못했다
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useStored } from './storage';
import type { PageRecord, SaveData } from './types';

export type RecordStatus = 'off' | 'unsupported' | 'pick' | 'locked' | 'ready' | 'error';

/** FileSystemFileHandle 가운데 여기서 쓰는 것. queryPermission 과 requestPermission 은 아직 표준 타입에 없다 */
interface SaveHandle {
  name: string;
  getFile(): Promise<File>;
  createWritable(): Promise<{ write(data: string): Promise<void>; close(): Promise<void> }>;
  queryPermission?(descriptor: { mode: 'readwrite' }): Promise<PermissionState>;
  requestPermission?(descriptor: { mode: 'readwrite' }): Promise<PermissionState>;
}
interface PickerWindow {
  showSaveFilePicker?(options: unknown): Promise<SaveHandle>;
  showOpenFilePicker?(options: unknown): Promise<SaveHandle[]>;
}

export interface RecordApi {
  /** 이 브라우저에서 세이브 파일을 쓸 수 있는가 */
  supported: boolean;
  status: RecordStatus;
  /** 세이브 파일의 이름(고른 적이 있으면) */
  fileName: string;
  /** status 가 error 일 때의 까닭 */
  error: string;
  /** '책id/챕터id' → 기록. ready 가 아니면 비어 있다 */
  pages: Record<string, PageRecord>;
  /** 켠다. 기억해 둔 세이브 파일이 있으면 허락을 받아 다시 잇고, 없으면 pick 이 된다. 단추를 누른 자리에서 불러야 한다 */
  enable: () => Promise<void>;
  /** 새 세이브 파일을 만들 자리를 고른다 */
  create: () => Promise<void>;
  /** 있는 세이브 파일을 고른다 */
  open: () => Promise<void>;
  /** 끈다. 세이브 파일은 그대로 두고, 화면이 들고 있던 기록만 버린다 */
  disable: () => void;
  /** 기억해 둔 세이브 파일을 잊는다(다른 파일로 바꿀 때) */
  forget: () => Promise<void>;
  /** 쪽을 열었다 */
  countView: (key: string) => void;
  /** 쪽을 끝까지 읽었다 */
  markDone: (key: string) => void;
}

const PICKER_TYPES = [{ description: '열람 기록(JSON)', accept: { 'application/json': ['.json'] } }];

// ---------- 손잡이를 IndexedDB 에 넣어 두기 ----------
function database(name: string): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const q = indexedDB.open(name, 1);
    q.onupgradeneeded = () => q.result.createObjectStore('handles');
    q.onsuccess = () => resolve(q.result);
    q.onerror = () => reject(q.error);
  });
}
async function recall(name: string): Promise<SaveHandle | null> {
  try {
    const db = await database(name);
    return await new Promise((resolve) => {
      const q = db.transaction('handles').objectStore('handles').get('save');
      q.onsuccess = () => resolve((q.result as SaveHandle | undefined) ?? null);
      q.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}
async function remember(name: string, handle: SaveHandle | null): Promise<void> {
  try {
    const db = await database(name);
    await new Promise<void>((resolve) => {
      const tx = db.transaction('handles', 'readwrite');
      if (handle) tx.objectStore('handles').put(handle, 'save');
      else tx.objectStore('handles').delete('save');
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
      tx.onabort = () => resolve();
    });
  } catch {
    /* 기억하지 못해도 이번에는 쓸 수 있다 */
  }
}

// ---------- 세이브 파일 읽기와 합치기 ----------
type Pages = Record<string, PageRecord>;

/** 세이브 파일의 글을 읽는다. 빈 파일이면 빈 기록, 이 도서관의 세이브 파일이 아니면 까닭을 던진다 */
function parse(text: string, library: string): Pages {
  if (!text.trim()) return {};
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error('세이브 파일의 내용을 읽을 수 없습니다(JSON이 아닙니다)');
  }
  const d = raw as Partial<SaveData> | null;
  if (!d || (d.app !== 'paragoniahex' && d.app !== 'paragons-bookshelf') || typeof d.pages !== 'object' || d.pages === null) throw new Error('열람 기록 세이브 파일이 아닙니다');
  if (d.library !== library) throw new Error(`다른 도서관(${String(d.library)})의 세이브 파일입니다`);
  const out: Pages = {};
  for (const [key, v] of Object.entries(d.pages)) {
    const r = v as Partial<PageRecord> | null;
    if (!r || typeof r.views !== 'number' || typeof r.last !== 'number') continue;
    out[key] = { views: Math.max(0, Math.floor(r.views)), last: r.last, ...(typeof r.done === 'number' ? { done: r.done } : {}) };
  }
  return out;
}

/** 두 기록을 합친다. 다른 탭이 그사이에 적은 것을 잃지 않으려는 것: 횟수와 마지막 때는 큰 쪽, 다 읽은 때는 이른 쪽 */
function merge(a: Pages, b: Pages): Pages {
  const out: Pages = { ...a };
  for (const [key, r] of Object.entries(b)) {
    const m = out[key];
    if (!m) out[key] = r;
    else {
      const done = m.done !== undefined && r.done !== undefined ? Math.min(m.done, r.done) : (m.done ?? r.done);
      out[key] = { views: Math.max(m.views, r.views), last: Math.max(m.last, r.last), ...(done !== undefined ? { done } : {}) };
    }
  }
  return out;
}

function serialize(pages: Pages, library: string): string {
  const sorted: Pages = {};
  for (const key of Object.keys(pages).sort()) sorted[key] = pages[key]!;
  const body: SaveData = { app: 'paragoniahex', version: 1, library, updated: new Date().toISOString(), pages: sorted };
  return `${JSON.stringify(body, null, 1)}\n`;
}

const message = (e: unknown): string => (e instanceof Error ? e.message : String(e));
const aborted = (e: unknown): boolean => e instanceof DOMException && e.name === 'AbortError';

export function useRecord(storageKey: string): RecordApi {
  const picker = typeof window === 'undefined' ? {} : (window as unknown as PickerWindow);
  const supported = typeof picker.showSaveFilePicker === 'function' && typeof indexedDB !== 'undefined';
  const [enabled, setEnabled] = useStored<boolean>(`${storageKey}:record`, false);
  const [status, setStatus] = useState<RecordStatus>(enabled ? (supported ? 'locked' : 'unsupported') : 'off');
  const [pages, setPages] = useState<Pages>({});
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const handle = useRef<SaveHandle | null>(null);
  const data = useRef<Pages>({});
  const live = useRef<RecordStatus>(status);
  const timer = useRef(0);
  const queue = useRef<Promise<void>>(Promise.resolve());
  const lastView = useRef({ key: '', at: 0 });
  const db = `${storageKey}-record`;

  const put = useCallback((s: RecordStatus, why = ''): void => {
    live.current = s;
    setStatus(s);
    setError(why);
  }, []);

  /** 세이브 파일에 적는다. 적기 전에 파일을 다시 읽어 합친다 */
  const flush = useCallback((): Promise<void> => {
    window.clearTimeout(timer.current);
    timer.current = 0;
    queue.current = queue.current.then(async () => {
      const h = handle.current;
      if (!h || live.current !== 'ready') return;
      try {
        data.current = merge(data.current, parse(await (await h.getFile()).text(), storageKey));
        const w = await h.createWritable();
        await w.write(serialize(data.current, storageKey));
        await w.close();
      } catch (e) {
        put('error', `세이브 파일에 적지 못했습니다: ${message(e)}`);
      }
    });
    return queue.current;
  }, [put, storageKey]);

  const later = useCallback((): void => {
    if (!timer.current) timer.current = window.setTimeout(() => void flush(), 700);
  }, [flush]);

  /** 손잡이의 파일을 읽어 기록을 시작한다 */
  const start = useCallback(
    async (h: SaveHandle, write: boolean): Promise<void> => {
      try {
        data.current = parse(await (await h.getFile()).text(), storageKey);
      } catch (e) {
        handle.current = null;
        setFileName(h.name);
        put('error', message(e));
        return;
      }
      handle.current = h;
      setFileName(h.name);
      setPages(data.current);
      put('ready');
      await remember(db, h);
      if (write) await flush();
    },
    [db, flush, put, storageKey],
  );

  // 처음 열었을 때: 켜 두었고 기억한 세이브 파일이 있으면, 허락이 남아 있을 때만 바로 잇는다
  useEffect(() => {
    let alive = true;
    if (!enabled) return;
    if (!supported) return put('unsupported');
    void (async () => {
      const h = await recall(db);
      if (!alive || live.current === 'ready') return;
      if (!h) return put('pick');
      setFileName(h.name);
      const state = h.queryPermission ? await h.queryPermission({ mode: 'readwrite' }).catch(() => 'prompt' as const) : 'granted';
      if (!alive) return;
      if (state === 'granted') await start(h, false);
      else {
        handle.current = h;
        put('locked');
      }
    })();
    return () => {
      alive = false;
    };
    // 처음 한 번만 본다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 화면을 떠날 때 밀린 것을 적는다
  useEffect(() => {
    const onHide = (): void => {
      if (timer.current) void flush();
    };
    window.addEventListener('pagehide', onHide);
    document.addEventListener('visibilitychange', onHide);
    return () => {
      window.removeEventListener('pagehide', onHide);
      document.removeEventListener('visibilitychange', onHide);
    };
  }, [flush]);

  const enable = useCallback(async (): Promise<void> => {
    if (!supported) return put('unsupported');
    setEnabled(true);
    const h = handle.current ?? (await recall(db));
    if (!h) return put('pick');
    try {
      const state = h.requestPermission ? await h.requestPermission({ mode: 'readwrite' }) : 'granted';
      if (state === 'granted') await start(h, false);
      else {
        handle.current = h;
        setFileName(h.name);
        put('locked');
      }
    } catch (e) {
      put('error', message(e));
    }
  }, [db, put, setEnabled, start, supported]);

  const create = useCallback(async (): Promise<void> => {
    if (!picker.showSaveFilePicker) return put('unsupported');
    try {
      const h = await picker.showSaveFilePicker({ suggestedName: `${storageKey}.save.json`, types: PICKER_TYPES });
      setEnabled(true);
      await start(h, true);
    } catch (e) {
      if (!aborted(e)) put('error', message(e));
    }
  }, [picker, put, setEnabled, start, storageKey]);

  const open = useCallback(async (): Promise<void> => {
    if (!picker.showOpenFilePicker) return put('unsupported');
    try {
      const [h] = await picker.showOpenFilePicker({ types: PICKER_TYPES, multiple: false });
      if (!h) return;
      const state = h.requestPermission ? await h.requestPermission({ mode: 'readwrite' }) : 'granted';
      if (state !== 'granted') return put('error', '세이브 파일에 쓸 허락을 받지 못했습니다');
      setEnabled(true);
      await start(h, false);
    } catch (e) {
      if (!aborted(e)) put('error', message(e));
    }
  }, [picker, put, setEnabled, start]);

  const disable = useCallback((): void => {
    if (timer.current) void flush();
    setEnabled(false);
    data.current = {};
    setPages({});
    // 밀린 것을 다 적은 뒤에 끈다
    void queue.current.then(() => put('off'));
  }, [flush, put, setEnabled]);

  const forget = useCallback(async (): Promise<void> => {
    if (timer.current) await flush();
    await queue.current;
    handle.current = null;
    data.current = {};
    setPages({});
    setFileName('');
    await remember(db, null);
    put(enabled ? 'pick' : 'off');
  }, [db, enabled, flush, put]);

  const countView = useCallback(
    (key: string): void => {
      if (live.current !== 'ready') return;
      const now = Date.now();
      // 같은 쪽을 잇달아 다시 그린 것(개발 모드의 두 번 그리기 등)은 한 번으로 친다
      if (lastView.current.key === key && now - lastView.current.at < 1500) return;
      lastView.current = { key, at: now };
      const old = data.current[key];
      data.current = { ...data.current, [key]: { ...old, views: (old?.views ?? 0) + 1, last: now } };
      setPages(data.current);
      later();
    },
    [later],
  );

  const markDone = useCallback(
    (key: string): void => {
      if (live.current !== 'ready' || data.current[key]?.done !== undefined) return;
      const now = Date.now();
      const old = data.current[key];
      data.current = { ...data.current, [key]: { views: old?.views ?? 1, last: old?.last ?? now, done: now } };
      setPages(data.current);
      later();
    },
    [later],
  );

  return useMemo(
    () => ({ supported, status, fileName, error, pages, enable, create, open, disable, forget, countView, markDone }),
    [supported, status, fileName, error, pages, enable, create, open, disable, forget, countView, markDone],
  );
}
