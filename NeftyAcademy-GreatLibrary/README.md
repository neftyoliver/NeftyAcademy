# NeftyAcademy-GreatLibrary

Nefty Academy의 책 묶음(컴퓨터 입문, C 초급·중급, 전자공학 입문, C++, 파이썬, 소형 기기, 네트워킹, OpenMP, MPI). 틀은 [ParagonsBookShelf](../NeftyAcademy-ParagonsBookShelf), 이 프로젝트는 **내용만** 가진다.

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
├─ chapters/cpp-syntax/ C++ 문법 MDX (파일 이름이 NN-M-<챕터 id>.mdx. 폴더에 넣으면 저절로 열린다)
├─ components/          본문에 넣는 그림·상호작용 (Pipeline, PcStepper, Layers, Memory, Permissions)
└─ style.css            Great Library만의 모양
```

## 서가: 책 속의 책

C++, 파이썬, 소형 기기는 책 안에 책이 들어 있는 **서가**다. 차례는 `src/books/` 아래에 글로 적혀 있다.
네트워킹, OpenMP, MPI는 서가가 아닌 낱권이지만 차례를 같은 방식으로 적는다.

```
src/books/
├─ outline.ts        차례를 글로 적는 도구 (id 제목, 두 칸 들여 쓰면 하위 챕터)
├─ written.ts        writtenIn('폴더'): src/chapters/<폴더>/ 의 MDX를 챕터 id에 이어 준다
├─ cpp/core.ts       C++ 문법, STL, 고급
├─ cpp/master-a.ts   최고급: 게임 엔진, Qt, 산업용, DB 연동, 벌칸, 복잡한 소프트웨어, 게임 서버, 서비스 서버, DBMS
├─ cpp/master-b.ts   최고급: OpenMP·MPI, 병렬 처리, 가상화, 컴파일러 방언, 임베디드, 리눅스, macOS, 비주얼 C++, 안드로이드, 임베디드 생태계
├─ cpp/index.ts      C++ 서가로 묶기
├─ python.ts         파이썬 서가
├─ sbc/basics.ts     소형 기기 기초: 라즈베리파이 시작하기, 임베디드 리눅스 시스템, 교차 컴파일과 배포, 장치 보안과 업데이트, 측정값 다루기, 베어메탈
├─ sbc/system.ts     시스템 API: 리눅스 시스템 호출, POSIX 스레드, libsystemd, D-Bus, 커널 모듈과 드라이버, ARM NEON
├─ sbc/io.ts         장치와 버스: libgpiod, PWM, I2C, SPI, 시리얼 통신, IIO, libusb
├─ sbc/media.ts      카메라·영상·소리: V4L2, libcamera, OpenCV, GStreamer, ALSA, LiteRT
├─ sbc/display.ts    화면과 입력: DRM/KMS, OpenGL ES와 EGL, SDL, LVGL, GTK 4, evdev
├─ sbc/connect.ts    연결과 데이터: BlueZ, libcurl, MQTT, OpenSSL, cJSON, SQLite
├─ sbc/index.ts      소형 기기 서가 여섯 개로 묶기
├─ networking.ts     네트워킹 (7계층 → 소켓 → HTTP 서버 만들기)
└─ parallel.ts       OpenMP, MPI
```

소형 기기 책은 라즈베리파이 5·4·Zero 2 W 급의 리눅스 보드를 기준으로 하고, **라이브러리·API 하나에 책 한 권**이다.

- 챕터를 더하거나 순서를 바꾸려면 그 글을 고친다. id는 한번 정하면 바꾸지 않는다(한 권 안에서 겹치면 오류)
- 챕터를 쓰면 `src/chapters/<책 id>/`에 MDX를 넣는다. `book(...)`의 마지막 인자가 `writtenIn('<책 id>')`인 책은 그것으로 끝이다(아래 "챕터 쓰기")
- 책의 id는 도서관 전체에서 겹치면 안 된다(주소가 `#/book/<id>` 하나뿐이라서)

## 챕터 쓰기

`library.tsx`에 직접 적힌 책(입문, C 초급·중급, 전자공학):

1. `src/chapters/<책>/NN-이름.mdx` 만들기. `##`(h2)가 단락이 되어 오른쪽 레일에 나온다
2. `library.tsx`에 import 하고 chapters 배열에 `{ id, title, summary, Content }` 추가
3. 아직 덜 썼으면 `draft: true`

차례를 글로 적은 책(`src/books/` 아래. 지금은 C++ 문법이 이 방식으로 쓰여 있다):

1. `src/chapters/<책 id>/NN-M-<챕터 id>.mdx` 만들기. 앞의 숫자는 정렬용이고, 숫자를 뗀 나머지가 차례의 챕터 id와 같아야 한다
2. 한 줄 요약은 MDX 안에 `export const summary = '…';`로 적는다
3. 그 책의 `book(...)` 마지막 인자가 `writtenIn('<책 id>')`이면 끝이다. import도 목록도 고칠 것이 없다

코드 블록을 ` ```c nocheck `, ` ```cpp nocheck `로 열면 "일부러 틀렸거나 조각이라 컴파일해 보지 않는 예제"라는 표시다(화면에는 영향 없음).
` ```cpp std26 `은 "C++26 기능을 쓰므로 `-std=c++26`으로 확인한 예제"라는 표시다.
C++ 문법 책의 나머지 ` ```cpp ` 블록은 GCC 14 `-std=c++23 -Wall -Wextra -Wpedantic`과 새니타이저로 컴파일해 돌렸고, 바로 뒤의 ` ```text ` 블록이 그 출력이다.

다른 챕터를 가리킬 때는 `[글자](#/read/책id/챕터id)`로 링크한다. 예: `[「ABI」](#/read/c-basic/abi)`. 링크를 적으면 지도에서 두 챕터 사이에 줄이 생긴다(`remark-chapter-links.mjs`가 빌드할 때 모은다).

MDX 주의: 본문 글에 `{`, `<`를 그냥 쓰면 코드로 읽힌다 → 백틱으로 감싸기.
`**굵게(괄호)**` 바로 뒤에 조사가 붙으면 굵게가 안 먹는다 → `<strong>…</strong>`로 쓰기.
표의 칸 안에서 코드에 `|`가 들어가면 `\|`로 적는다(안 그러면 칸이 갈라진다).
표는 되도록 세 칸까지. 칸이 많으면 폰에서 옆으로 밀어 봐야 한다.

## 책 구성 (2026-11-20)

| 책 | 챕터 | 쓴 것 |
| --- | --- | --- |
| 컴퓨터의 입문 | 10 (하위 37) | 커널의 종류, 설치 도구와 부팅, 루분투 설치, apt와 저장소, 여러 패키지 매니저, Git 기초, 리눅스 명령어와 POSIX, 우리 프로그램이 작동하는 방식 |
| 컴퓨터 프로그래밍 초급 | 22 (하위 29) | 전부 (2026-11-13 초안. 맥·WinUI 예제는 실행해 보지 못함) |
| 컴퓨터 프로그래밍 중급 | 19 (하위 35) | C 생태계의 네 층 |
| 전자공학 입문 | 7 (하위 13) | — |
| C++ (서가) | 22권: 챕터 307, 하위 1,120 | **C++ 문법** 전부(21챕터, 95쪽. 2026-11-20 초안. 모던 C++ 기준이고 레거시는 마지막 챕터). 나머지 21권은 뼈대만 |
| 파이썬 (서가) | 10권: 챕터 83, 하위 117 | — (뼈대만, 구성은 제안) |
| 소형 기기 기초 (서가) | 6권: 챕터 60, 하위 210 | — (뼈대만) |
| 시스템 API (서가) | 6권: 챕터 72, 하위 275 | — (뼈대만) |
| 장치와 버스 (서가) | 7권: 챕터 89, 하위 296 | — (뼈대만) |
| 카메라, 영상, 소리 (서가) | 6권: 챕터 90, 하위 308 | — (뼈대만) |
| 화면과 입력 (서가) | 6권: 챕터 104, 하위 346 | — (뼈대만) |
| 연결과 데이터 (서가) | 6권: 챕터 108, 하위 363 | — (뼈대만) |
| 네트워킹 | 20 (하위 145) | — (뼈대만) |
| OpenMP | 20 (하위 94) | — (뼈대만) |
| MPI | 24 (하위 111) | — (뼈대만) |

`library.tsx`에서 `draft(...)`를 `written(..., Content)`로 바꾸면 그 챕터가 열린다.
하위 챕터가 있는 묶음은 `group(...)`: 안에 쓴 것이 하나라도 있으면 "준비 중" 딱지가 빠진다.

라이선스: AGPL-3.0-or-later
