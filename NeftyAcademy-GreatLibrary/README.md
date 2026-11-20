# NeftyAcademy-GreatLibrary

Nefty Academy의 책 묶음(컴퓨터 입문, C 초급·중급, 전자공학 입문). 틀은 [ParagonsBookShelf](../NeftyAcademy-ParagonsBookShelf), 이 프로젝트는 **내용만** 가진다.

## 준비

`ParagonsBookShelf` 폴더가 이 폴더 **옆**에 있어야 한다.

```
Projects/
├─ NeftyAcademy-ParagonsBookShelf/
└─ NeftyAcademy-GreatLibrary/
```

```sh
npm install
npm run dev      # http://127.0.0.1:5173
npm run build    # dist/index.html 한 파일 (수강생에게 그대로 보내도 열림)
```

## 폴더

```
src/
├─ library.tsx          차례 전체 (책·챕터 목록)
├─ chapters/basics/     컴퓨터의 입문 MDX
├─ chapters/c-basic/    컴퓨터 프로그래밍 초급 MDX (파일 이름 앞 숫자가 차례)
├─ components/          본문에 넣는 그림·상호작용 (Pipeline, PcStepper, Layers, Memory)
└─ style.css            Great Library만의 모양
```

## 서가: 책 속의 책

C++과 파이썬은 책 안에 책이 들어 있는 **서가**다. 차례는 `src/books/` 아래에 글로 적혀 있다.

```
src/books/
├─ outline.ts        차례를 글로 적는 도구 (id 제목, 두 칸 들여 쓰면 하위 챕터)
├─ cpp/core.ts       C++ 문법, STL, 고급
├─ cpp/master-a.ts   최고급: 게임 엔진, Qt, 산업용, DB 연동, 벌칸, 복잡한 소프트웨어, 게임 서버, 서비스 서버, DBMS
├─ cpp/master-b.ts   최고급: OpenMP·MPI, 병렬 처리, 가상화, 컴파일러 방언, 임베디드, 리눅스, macOS, 비주얼 C++, 안드로이드, 임베디드 생태계
├─ cpp/index.ts      C++ 서가로 묶기
└─ python.ts         파이썬 서가
```

- 챕터를 더하거나 순서를 바꾸려면 그 글을 고친다. id는 한번 정하면 바꾸지 않는다(한 권 안에서 겹치면 오류)
- 챕터를 쓰면 `book(...)`의 마지막 인자에 `{ 'id': [본문, '한 줄 요약'] }`을 넣는다
- 책의 id는 도서관 전체에서 겹치면 안 된다(주소가 `#/book/<id>` 하나뿐이라서)

## 챕터 쓰기

1. `src/chapters/<책>/NN-이름.mdx` 만들기. `##`(h2)가 단락이 되어 오른쪽 레일에 나온다
2. `library.tsx`에 import 하고 chapters 배열에 `{ id, title, summary, Content }` 추가
3. 아직 덜 썼으면 `draft: true`

코드 블록을 ` ```c nocheck `로 열면 "일부러 틀렸거나 조각이라 컴파일해 보지 않는 예제"라는 표시다(화면에는 영향 없음).

다른 챕터를 가리킬 때는 `[글자](#/read/책id/챕터id)`로 링크한다. 예: `[「ABI」](#/read/c-basic/abi)`. 링크를 적으면 지도에서 두 챕터 사이에 줄이 생긴다(`remark-chapter-links.mjs`가 빌드할 때 모은다).

MDX 주의: 본문 글에 `{`, `<`를 그냥 쓰면 코드로 읽힌다 → 백틱으로 감싸기.
`**굵게(괄호)**` 바로 뒤에 조사가 붙으면 굵게가 안 먹는다 → `<strong>…</strong>`로 쓰기.

## 책 구성 (2026-11-10)

| 책 | 챕터 | 쓴 것 |
| --- | --- | --- |
| 컴퓨터의 입문 | 10 (하위 37) | 커널의 종류, 설치 도구와 부팅, 루분투 설치, apt와 저장소, 여러 패키지 매니저, Git 기초, 리눅스 명령어와 POSIX, 우리 프로그램이 작동하는 방식 |
| 컴퓨터 프로그래밍 초급 | 22 (하위 29) | 전부 (2026-11-13 초안. 맥·WinUI 예제는 실행해 보지 못함) |
| 컴퓨터 프로그래밍 중급 | 19 (하위 35) | C 생태계의 네 층 |
| 전자공학 입문 | 7 (하위 13) | — |
| C++ (서가) | 22권: 챕터 305, 하위 1,127 | — (뼈대만) |
| 파이썬 (서가) | 10권: 챕터 83, 하위 117 | — (뼈대만, 구성은 제안) |

`library.tsx`에서 `draft(...)`를 `written(..., Content)`로 바꾸면 그 챕터가 열린다.
하위 챕터가 있는 묶음은 `group(...)`: 안에 쓴 것이 하나라도 있으면 "준비 중" 딱지가 빠진다.

라이선스: AGPL-3.0-or-later
