# NeftyAcademy-ParagonsBookShelf

React로 만드는 **웹 책의 틀**. 내용은 넣지 않고 틀만 맡는다.

- 앞표지: **거미줄**(책=큰 노드, 챕터=번호 붙은 작은 노드, 5개 이상은 정n각형·미만은 십자가) / **목록**(카테고리 → 책 → 챕터 드롭다운) / **갤러리**(책 카드) 보기, 호버 시 글로우·확대
- **하위 챕터**: 챕터에 `children`을 주면 번호가 3.1, 3.2로 붙고, 지도에서는 챕터 바깥의 작은 점으로 보인다
- 지도는 끌어서 옮기고 ＋/－ 단추로 확대·축소
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
