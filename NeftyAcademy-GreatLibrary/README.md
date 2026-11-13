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

`library.tsx`에서 `draft(...)`를 `written(..., Content)`로 바꾸면 그 챕터가 열린다.
하위 챕터가 있는 묶음은 `group(...)`: 안에 쓴 것이 하나라도 있으면 "준비 중" 딱지가 빠진다.

라이선스: AGPL-3.0-or-later
