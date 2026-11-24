/**
 * ParagoniaHEX.js 예시: 책 여섯 권(5권 이상이라 정육각형 배치)에 아무 내용이나 넣어 본다.
 * 진짜 책을 만들 때는 이 파일처럼 Library 객체 하나를 만들어 <BookApp>에 넘기면 끝.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BookApp, Figure, Note, type Book, type Library } from '../../src';

function Sample() {
  return (
    <>
      <p>ParagoniaHEX.js는 본문을 가리지 않습니다. MDX든 TSX든 React 컴포넌트면 됩니다.</p>
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
      <h2>링크</h2>
      <p>
        본문에서 다른 챕터를 가리키면(<a href="#/read/b2/c1">물리 산책 1</a>) 지도에 화살표가 생기고, 가리킨 쪽의 아래 "같이 보기"에 이 챕터가 나옵니다.
        바깥으로 나가는 링크(<a href="https://example.com/">example.com</a>)는 새 탭에서 열리고 표시가 붙습니다.
      </p>
      <pre>
        <code>
          {'auto p = std::make_unique<int>(3);  // '}
          <a className="bf-ref" href="#/read/b1/c2">
            make_unique
          </a>
          {' 는 개념 링크\n'}
        </code>
      </pre>
      <h2>마지막 단락</h2>
      <p>끝.</p>
    </>
  );
}

/** 예시 참조: 어느 챕터가 어느 챕터를 가리키는가. 같은 책이면 챕터 id만, 다른 책이면 '책/챕터' */
const LINKS: Record<string, string[]> = {
  'b1/c1': ['c2', 'b2/c1', 'b4/c3', 'in1/x1'],
  'b1/c2': ['c1'],
  'b1/c3': ['c1', 'b6/c2'],
  'b2/c1': ['b1/c1', 'b1/c2'],
  'b2/c2': ['b1/c1'],
  'b3/c1': ['b1/c1', 'b2/c1'],
  'b4/c3': ['b1/c1'],
  'b5/c2': ['b1/c1', 'b5/c1'],
  'b6/c2': ['b1/c3'],
  'in1/x1': ['b1/c1', 'in2/y1'],
  'in2/y1': ['b1/c2'],
};

const palette = ['#4f7f78', '#8a6bb0', '#c0784a', '#4a78b8', '#a0566b', '#6f8f3a'];
const books: Book[] = palette.map((color, b) => ({
  id: `b${b + 1}`,
  title: ['수학의 문', '물리 산책', '화학 노트', '생물 지도', '지구 이야기', '천문 입문'][b]!,
  subtitle: '예시 책',
  category: b < 3 ? 'a' : 'b',
  color,
  chapters: Array.from({ length: 7 + b }, (_, c) => ({
    id: `c${c + 1}`,
    title: c === 1 ? '여러 프레임을 겹쳐 진행하기' : c === 2 ? 'enable_shared_from_this' : `예시 챕터 ${c + 1}`,
    summary: c === 0 ? '첫 챕터 요약' : undefined,
    draft: c > 4,
    Content: c > 4 ? undefined : Sample,
    links: LINKS[`b${b + 1}/c${c + 1}`],
  })),
}));
// 서가(책 속의 책): 앞표지 지도에서는 안쪽 책이 노드 하나로 보이고, 그 안의 쪽이 가리키는 줄은 그 노드에서 나온다
books.push({
  id: 'shelf',
  title: '서가 견본',
  subtitle: '책 속의 책',
  category: 'b',
  color: '#7a6a4f',
  chapters: [],
  books: [
    { id: 'in1', title: '안쪽 책 하나', category: 'b', chapters: [{ id: 'x1', title: '안쪽 챕터', Content: Sample, links: LINKS['in1/x1'] }] },
    { id: 'in2', title: '안쪽 책 둘', category: 'b', chapters: [{ id: 'y1', title: '또 안쪽 챕터', Content: Sample, links: LINKS['in2/y1'] }] },
  ],
});

const library: Library = {
  title: 'ParagoniaHEX.js 예시',
  subtitle: '책 틀만 보여 주는 견본',
  storageKey: 'paragons-bookshelf-demo',
  categories: [
    { id: 'a', name: '첫째 갈래' },
    { id: 'b', name: '둘째 갈래' },
  ],
  books,
  footer: 'ParagoniaHEX.js · AGPL-3.0-or-later',
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BookApp library={library} />
  </StrictMode>,
);
