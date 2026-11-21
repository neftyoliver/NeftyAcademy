# NeftyAcademy-ParagonsBookShelf

React로 만드는 **웹 책의 틀**. 내용은 넣지 않고 틀만 맡는다.

- 앞표지: **지도**(책=큰 노드, 챕터=번호 붙은 작은 노드. 챕터의 `links`에 적힌 챕터끼리는 줄로 이어진다) / **목록**(카테고리 → 책 → 챕터 드롭다운) / **갤러리**(책 카드) 보기, 호버 시 글로우·확대
- **서가**: `Book.books`에 책을 넣으면 책 속의 책이 된다. 서가를 열면 그 안의 책들이 다시 지도·목록·갤러리로 보인다. 몇 겹이든 된다
- **하위 챕터**: 챕터에 `children`을 주면 번호가 3.1, 3.2로 붙고, 지도에서는 챕터 바깥의 작은 점으로 보인다
- 지도의 배치는 저절로 정해진다. 책이 여러 권이면 지도 전체가 육각형이 되고, 책들은 양파 껍질처럼 겹겹이(한 겹에 여섯 권 안팎) 놓인다. 11권이면 두 겹, 19권이면 세 겹이다. 노드 사이의 간격은 어느 책에서나 같고, 책의 영역은 노드의 자리를 먼저 정한 뒤 그것을 감싸는 다각형으로 그려진다. 영역 사이의 틈은 어디서나 같다. 책을 더하거나 빼면 다시 계산된다(`src/onion.ts`). 책 한 권만 볼 때는 챕터가 책 둘레에 육각형을 그려 가며 6개, 12개, 18개… 순서로 놓인다
- 지도는 끌어서 옮기고, 휠이나 ＋/－ 단추로 확대·축소한다. 확대하면 간격이 벌어지면서 책·챕터·하위 챕터의 노드와 글자도 함께 커지고(줄의 굵기는 그대로), 충분히 커지면 챕터, 그다음 하위 챕터의 노드 속에 제목이 들어간다
- 지도의 줄(읽는 순서, 상호 참조, 가운데에서 책으로)은 모두 육각형 결을 따라 60도로만 꺾이고 노드를 뚫지 않는다(`src/hexroute.ts`)
- 상호 참조 줄이 한 지도에 40개를 넘으면 평소에는 그리지 않고, 챕터에 올렸을 때 그 챕터의 줄만 그린다(참조가 수백 개인 책에서 줄이 그물처럼 덮이지 않고, 지도도 빨리 뜬다)
- 본문의 표: 칸 안의 한글은 낱말 단위로 끊고, 좁은 화면에서는 긴 코드를 칸 안에서 접는다. 그래도 넘치면 표가 옆으로 밀린다. 칸에 `bf-wide` 클래스를 붙이면 좁은 화면에서 예닐곱 글자 폭을 지킨다(문장이 든 칸이 한 낱말 폭으로 줄지 않게)
- 카테고리 고르기는 상단바 오른쪽에 늘 보임
- 반투명 상단바, 왼쪽 반투명 메뉴(차례·북마크·줄친 곳)
- 읽기 화면: 오른쪽 **스크롤 레일**(단락 눈금, 지금 단락, 줄친 곳·북마크 표시, 호버하면 그 높이의 단락 이름)
- **북마크**(단락 단위), **줄치기**(드래그 → 「줄치기」, 칠한 곳 누르면 「줄 지우기」)
- 주소는 해시(`#/read/책/챕터/단락`)라 HTML 한 파일을 `file://`로 열어도 그대로 동작
- 본문은 아무 React 컴포넌트(MDX 권장). 본문 안의 `<h2>`가 단락

## 쓰는 법

```tsx
import { BookApp, type Library } from 'neftyacademy-paragons-bookshelf';
import Intro from './chapters/intro.mdx';

const library: Library = {
  title: '내 책',
  storageKey: 'my-book',            // 같은 도메인의 다른 책과 겹치지 않게
  categories: [{ id: 'a', name: '기초', color: '#4f7f78' }],
  books: [
    {
      id: 'basics', title: '첫 권', category: 'a', firstNumber: 0,
      chapters: [
        { id: 'intro', title: '시작', summary: '한 줄 요약', Content: Intro },
        { id: 'next', title: '다음', draft: true },   // 아직 안 쓴 챕터
        { id: 'ptr', title: '포인터', children: [    // 하위 챕터 (id는 책 안에서 겹치지 않게)
          { id: 'ptr-decl', title: '선언문에서의 *', draft: true },
        ] },
      ],
    },
  ],
};

createRoot(root).render(<BookApp library={library} />);
```

본문 조각: `Note`(참고·요령·주의), `Figure`(그림+설명), `Term`(용어 풀이), `Cmd`(명령어와 뜻).
색은 `--bf-*` CSS 변수를 덮어써서 바꾼다(`src/style.css` 맨 위).

## 이 폴더에서

```sh
npm install
npm run dev          # 예시 책 (demo/)
npm run build:demo   # demo/dist/index.html 한 파일
npm run typecheck
```

## 다른 프로젝트에서 쓰기

책 프로젝트를 이 폴더 옆에 두고 `"neftyacademy-paragons-bookshelf": "file:../NeftyAcademy-ParagonsBookShelf"`로 의존한다. 그때 책 프로젝트의
`vite.config.ts`에 `resolve.dedupe: ['react', 'react-dom']`, `tsconfig.json`에 react 타입 `paths`를 넣어
React가 두 벌 잡히지 않게 한다(NeftyAcademy-GreatLibrary 참고).

## 메모

- 줄치기는 CSS Custom Highlight API로 칠한다(본문 DOM을 건드리지 않음). Chrome 105+, Safari 17.2+, Firefox 140+
- 북마크·줄치기·보기 설정은 브라우저 localStorage에만 저장된다(기기 사이 동기화 없음)
- 챕터 id를 바꾸면 그 챕터의 북마크·줄치기가 끊긴다

라이선스: AGPL-3.0-or-later
