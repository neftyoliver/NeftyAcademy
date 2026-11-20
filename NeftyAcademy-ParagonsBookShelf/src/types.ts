import type { ComponentType, ReactNode } from 'react';

/** 책을 묶는 갈래. 앞표지의 "카테고리" 고르기에 쓰인다. */
export interface Category {
  id: string;
  name: string;
  /** 노드·카드 색. 없으면 책 색이나 기본색을 쓴다. */
  color?: string;
}

/**
 * 챕터 한 개. 본문은 아무 React 컴포넌트나 된다(MDX 파일, TSX 등).
 * 본문 안의 <h2>가 "단락"이 되어 스크롤 레일과 북마크의 단위가 된다.
 */
export interface Chapter {
  /** 책 안에서 겹치지 않는 id. 주소(#/read/책/챕터)와 저장 키에 쓰인다. 바꾸면 북마크·줄치기가 끊긴다. */
  id: string;
  title: string;
  summary?: string;
  /** 아직 쓰지 않은 챕터. 노드는 흐리게, 누르면 "준비 중"을 보여 준다. */
  draft?: boolean;
  Content?: ComponentType;
  /**
   * 이 챕터가 본문에서 가리키는 다른 챕터들. '책id/챕터id', 같은 책이면 '챕터id'만 적어도 된다.
   * 지도에서 두 챕터 사이에 줄이 생긴다. 방향은 없다(어느 쪽에 적어도 같은 줄).
   */
  links?: string[];
  /** 하위 챕터. 번호는 3.1, 3.2처럼 붙고, 지도에서는 챕터 노드 바깥의 작은 점으로 보인다. id는 책 안에서 겹치지 않게. */
  children?: Chapter[];
}

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  /** Category.id */
  category: string;
  color?: string;
  /** 첫 챕터 번호. 0강부터 시작하는 책이면 0. 기본 1 */
  firstNumber?: number;
  /** 갤러리 카드 위쪽에 들어갈 그림. SVG 같은 HTML 요소를 권장. */
  cover?: ReactNode;
  chapters: Chapter[];
  /**
   * 책 속의 책. 이것이 있으면 이 책은 여러 권을 담은 "서가"가 된다(예: C++ 안에 문법·STL·고급…).
   * 서가도 몇 겹이든 겹칠 수 있다. 안쪽 책의 id도 도서관 전체에서 겹치지 않아야 한다(주소가 #/book/<id> 하나뿐이라서).
   * 서가의 chapters 는 비워도 되고, 머리말 같은 챕터를 둘 수도 있다.
   */
  books?: Book[];
}

export interface Library {
  title: string;
  subtitle?: string;
  categories: Category[];
  books: Book[];
  /** localStorage 이름표. 같은 도메인에 책이 여러 권 있으면 반드시 다르게. */
  storageKey: string;
  /** 앞표지 맨 아래 문구(라이선스 등). */
  footer?: ReactNode;
}

export type FrontView = 'web' | 'list' | 'gallery';

export interface Bookmark {
  bookId: string;
  chapterId: string;
  /** 단락 순번(본문 안 h2의 순서). 챕터 맨 위면 -1. */
  section: number;
  label: string;
  at: number;
}

export interface TextMark {
  id: string;
  bookId: string;
  chapterId: string;
  /** 칠한 글자 그대로 */
  text: string;
  /** 본문 전체 글자에서 같은 문자열이 여러 번 나올 때 몇 번째인지 */
  occurrence: number;
  at: number;
}

export type Route =
  | { name: 'front' }
  | { name: 'book'; bookId: string }
  | { name: 'read'; bookId: string; chapterId: string; section?: number };
