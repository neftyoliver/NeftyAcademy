/**
 * ParagonsBookShelf 예시: 책 여섯 권(5권 이상이라 정육각형 배치)에 아무 내용이나 넣어 본다.
 * 진짜 책을 만들 때는 이 파일처럼 Library 객체 하나를 만들어 <BookApp>에 넘기면 끝.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BookApp, Figure, Note, type Book, type Library } from '../../src';

function Sample() {
  return (
    <>
      <p>ParagonsBookShelf은 본문을 가리지 않습니다. MDX든 TSX든 React 컴포넌트면 됩니다.</p>
      <h2>단락은 h2</h2>
      <p>본문 안의 <code>&lt;h2&gt;</code>가 단락이 되어 오른쪽 레일에 눈금으로 나타납니다.</p>
      <Note kind="tip">글자를 드래그해 고르면 「줄치기」 단추가 뜹니다.</Note>
      {Array.from({ length: 6 }, (_, i) => (
        <p key={i}>채움 글. 레일과 스크롤을 시험하기 위한 문단 {i + 1}입니다. 빨리 읽고 넘어가도 됩니다.</p>
      ))}
      <h2>그림은 SVG로</h2>
      <Figure caption="원 세 개">
        <svg viewBox="0 0 300 80" width="300">
          {[50, 150, 250].map((x) => (
            <circle key={x} cx={x} cy={40} r={28} fill="none" stroke="currentColor" strokeWidth={2} />
          ))}
        </svg>
      </Figure>
      {Array.from({ length: 8 }, (_, i) => (
        <p key={i}>또 다른 채움 글 {i + 1}.</p>
      ))}
      <h2>마지막 단락</h2>
      <p>끝.</p>
    </>
  );
}

const palette = ['#4f7f78', '#8a6bb0', '#c0784a', '#4a78b8', '#a0566b', '#6f8f3a'];
const books: Book[] = palette.map((color, b) => ({
  id: `b${b + 1}`,
  title: ['수학의 문', '물리 산책', '화학 노트', '생물 지도', '지구 이야기', '천문 입문'][b]!,
  subtitle: '예시 책',
  category: b < 3 ? 'a' : 'b',
  color,
  chapters: Array.from({ length: 7 + b }, (_, c) => ({
    id: `c${c + 1}`,
    title: `예시 챕터 ${c + 1}`,
    summary: c === 0 ? '첫 챕터 요약' : undefined,
    draft: c > 4,
    Content: c > 4 ? undefined : Sample,
  })),
}));

const library: Library = {
  title: 'ParagonsBookShelf 예시',
  subtitle: '책 틀만 보여 주는 견본',
  storageKey: 'paragons-bookshelf-demo',
  categories: [
    { id: 'a', name: '첫째 갈래' },
    { id: 'b', name: '둘째 갈래' },
  ],
  books,
  footer: 'ParagonsBookShelf · AGPL-3.0-or-later',
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BookApp library={library} />
  </StrictMode>,
);
