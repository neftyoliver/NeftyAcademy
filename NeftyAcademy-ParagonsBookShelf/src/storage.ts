/**
 * localStorage에 붙는 상태. 사생활 보호 창처럼 저장소가 막혀도 화면은 그대로 돌아가야 하므로
 * 읽기·쓰기를 모두 try로 감싸고, 실패하면 메모리에서만 들고 있는다.
 */
import { useCallback, useEffect, useState } from 'react';

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* 저장 못 해도 계속 */
  }
}

export function useStored<T>(key: string, fallback: T): [T, (next: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => read(key, fallback));

  // 다른 탭에서 바꾼 것도 따라간다.
  useEffect(() => {
    const onStorage = (e: StorageEvent): void => {
      if (e.key === key) setValue(read(key, fallback));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
    // fallback은 처음 값만 의미가 있다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const v = typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
        write(key, v);
        return v;
      });
    },
    [key],
  );
  return [value, set];
}
