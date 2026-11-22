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
├─ chapters/<책 id>/    그 밖의 책 MDX (파일 이름이 NN-M-<챕터 id>.mdx. 폴더에 넣으면 저절로 열린다)
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
├─ cpp/master-a.ts   최고급: 게임 엔진, Qt, 산업용, DB 연동, 벌칸, 복잡한 소프트웨어, 게임 서버, 서비스 서버, 직접 구현해 보는 DBMS·컴파일러·레이 트레이서
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
- 챕터를 쓰면 `src/chapters/<책 id>/`에 MDX를 넣는다. 그것으로 끝이다(아래 "챕터 쓰기")
- 책의 id는 도서관 전체에서 겹치면 안 된다(주소가 `#/book/<id>` 하나뿐이라서)

## 챕터 쓰기

어느 책이든 같다.

1. `src/chapters/<책 id>/NN-M-<챕터 id>.mdx` 만들기(하위 챕터가 없는 챕터는 `NN-<챕터 id>.mdx`). 앞의 숫자는 정렬용이고, 숫자를 뗀 나머지가 차례의 챕터 id와 같아야 한다. `##`(h2)가 단락이 되어 오른쪽 레일에 나온다
2. 한 줄 요약은 MDX 안에 `export const summary = '…';`로 적는다. 이 쪽이 설명하는 낱말이 있으면 바로 아래에 `export const terms = [...]`로 적는다(아래 "용어 링크")
3. 끝이다. import도 목록도 고칠 것이 없다. 빌드할 때 그 폴더의 파일을 모아 챕터 id에 이어 준다(`src/books/written.ts`). 차례를 글로 적은 책에서는 차례에 없는 id의 파일이 있으면 빌드가 알려 준다

차례를 글로 적은 책(`src/books/` 아래)은 `book(...)`이 이 일을 하고, `library.tsx`에 직접 적은 책(입문, C 초급·중급, 전자공학)은 `draft(...)`로 적힌 챕터에 같은 id의 파일이 생기면 열린다. 그림 컴포넌트를 import 하는 옛 챕터처럼 `written(..., Content)`로 직접 이어 둔 것은 그대로 둔다.

코드 블록을 여는 줄에 붙이는 말은 예제를 확인하는 도구가 읽는다.

| 붙이는 말 | 뜻 |
| --- | --- |
| `nocheck` | 일부러 틀렸거나 조각이라 컴파일해 보지 않는다 |
| `norun` | 컴파일과 링크까지만 확인했다(장치가 있어야 도는 예제) |
| `std26` | C++26 기능을 쓰므로 `-std=c++26`으로 확인했다 |
| `pkg=이름`, `flags=옵션` | 그 라이브러리(pkg-config)나 옵션을 붙여 컴파일했다 |
| `nolink` | 이 블록에는 용어 링크를 걸지 않는다(이것만 화면에 영향이 있다) |

아무 말도 없는 ` ```cpp ` 블록은 GCC 14 `-std=c++23 -Wall -Wextra -Wpedantic`과 새니타이저로 컴파일해 돌렸고, 바로 뒤의 ` ```text ` 블록이 그 출력이다(` ```c `는 `-std=c23`, ` ```python `은 그대로 실행).

다른 챕터를 가리킬 때는 `[글자](#/read/책id/챕터id)`로 링크한다. 예: `[「ABI」](#/read/c-basic/abi)`. 링크를 적으면 지도에서 두 챕터 사이에 줄이 생기고, 가리킨 쪽의 맨 아래 「같이 보기」에 이 쪽이 올라간다(`remark-chapter-links.mjs`가 빌드할 때 모은다).

바깥 문서는 쪽의 끝(`## 정리` 다음)에 `## 참고 문서` 절을 두고 `- [이름](https://…)` 으로 적는다. 바깥 링크에는 화면에서 ↗ 가 붙는다. 주소는 직접 열어 확인한 것만 적는다.

### 용어 링크

쪽은 **자기가 설명하는 낱말**을 맨 위에 적는다. 그러면 다른 쪽의 코드에 그 낱말이 나올 때 이 쪽으로 가는 링크가 된다(`term-index.mjs`, `remark-term-links.mjs`). 링크는 지도의 줄과 「같이 보기」에도 잡힌다.

```js
export const summary = '…';
export const terms = ['unique_ptr', 'std::move', '~move', 'free()'];
```

| 적는 꼴 | 걸리는 곳 |
| --- | --- |
| `unique_ptr` | 코드 블록과 본문의 `` `코드` `` 어디서든. `std::unique_ptr<T>`의 `std::unique_ptr`도 걸린다. 다른 뜻으로 쓰일 일이 없는 이름에 쓴다 |
| `std::move` | `std::move`라고 적힌 곳만. `move`처럼 변수 이름으로도 흔한 낱말은 이름공간까지 적는다 |
| `~move` | 본문의 `` `코드` ``에서만, 그 이름을 가리켜 적은 것만(`` `move` ``, `` `vector<int>` ``, `` `noexcept(false)` ``). 예약어처럼 코드 블록마다 나오는 낱말에도 쓴다 |
| `free()` | 함수. 코드 블록에서는 `free(…)`처럼 부르는 자리만(선언 `void free()`와 멤버 `x.free()`는 빼고), 본문에서는 `` `free` ``라고만 적은 것도 |

- 같은 낱말은 처음 한 번만 링크가 된다: 본문은 한 절(`##`)에서 한 번, 코드 블록은 그 블록에서 한 번. `text` 블록과 제목 줄, 자기 쪽으로 가는 것은 걸지 않는다
- 책은 **갈래**로 묶여 있다(`src/books/terms.json`). 한 갈래에서 낱말 하나는 한 쪽만 가질 수 있고(둘이 적으면 빌드가 멈추고 두 쪽을 알려 준다), 쪽은 자기 갈래 → 갈래가 "본다(`sees`)"고 적은 갈래 순서로 찾는다. 지금은 C(입문, C 초급·중급), C++(C, 그다음 Qt를 본다), Qt(C++, 그다음 C를 본다)이고, 갈래에 적지 않은 책은 자기 책 안에서만 걸린다. 갈래의 `local`에 적은 이름(`read`, `write`, `close` …)은 그 갈래의 책에서만 걸린다
- 어떤 쪽에서 같은 낱말이 다른 것을 가리키면(루아 함수 `move`) 그 쪽에 `export const noterms = ['move'];`를 적어 그 쪽에서만 끈다. 지어낸 이름이 든 코드 블록 하나만 끄려면 여는 줄에 `nolink`를 붙인다(` ```c nolink `)
- 흔한 낱말은 넣지 않는다. `const`, `class`, `auto` 같은 기본 예약어까지 걸면 문단마다 밑줄이 선다
- 용어를 고친 뒤에는 dev 서버를 다시 켜야 다른 쪽의 링크가 바뀐다(색인을 켤 때 한 번 만든다)

MDX 주의: 본문 글에 `{`, `<`를 그냥 쓰면 코드로 읽힌다 → 백틱으로 감싸기.
`**굵게(괄호)**` 바로 뒤에 조사가 붙으면 굵게가 안 먹는다 → `<strong>…</strong>`로 쓰기.
표의 칸 안에서 코드에 `|`가 들어가면 `\|`로 적는다(안 그러면 칸이 갈라진다).
표는 되도록 세 칸까지. 칸이 많으면 폰에서 옆으로 밀어 봐야 한다.
표에서 글이 여덟 자 넘는 칸에는 빌드할 때 `bf-wide`가 붙어서(`rehype-table-cells.mjs`), 폰에서 그 칸이 한 낱말 폭으로 찌그러지지 않는다.

## 책 구성 (2026-11-22)

| 책 | 챕터 | 쓴 것 |
| --- | --- | --- |
| 컴퓨터의 입문 | 10 (하위 37) | 전부 (39쪽) |
| 컴퓨터 프로그래밍 초급 | 22 (하위 29) | 전부 (2026-11-13 초안. 맥·WinUI 예제는 실행해 보지 못함) |
| 컴퓨터 프로그래밍 중급 | 19 (하위 35) | 전부 (43쪽) |
| 전자공학 입문 | 7 (하위 13) | 전부 (18쪽) |
| C++ (서가) | 24권: 챕터 335, 하위 1,215 | **C++ 문법, STL, 고급, 게임 엔진, Qt, 산업용 프로그램, 데이터베이스 연동, 벌칸** 전부(8권 537쪽. 문법은 모던 C++ 기준이고 레거시는 마지막 챕터). 나머지 16권은 뼈대만. 직접 구현해 보는 컴파일러와 레이 트레이서는 2026-11-22에 더한 책 |
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

`library.tsx`의 `draft(...)`는 같은 id의 MDX가 `src/chapters/<책 id>/`에 생기면 저절로 열린다.
하위 챕터가 있는 묶음은 안에 쓴 것이 하나라도 있으면 "준비 중" 딱지가 빠진다.

라이선스: AGPL-3.0-or-later
