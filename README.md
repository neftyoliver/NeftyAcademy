# NeftyAcademy

Nefty Academy의 공개 교재와, 교재를 담는 책장.

| 폴더 | 약칭 | 무엇 |
| --- | --- | --- |
| [NeftyAcademy-BibliothecaNeftias](NeftyAcademy-BibliothecaNeftias) | 대도서관 | 책 묶음. 컴퓨터의 입문, 컴퓨터 프로그래밍 초급·중급, 전자공학 입문, C++, 파이썬, 소형 기기(라즈베리파이 급), 네트워킹, OpenMP, MPI |
| [NeftyAcademy-ParagoniaHEX](NeftyAcademy-ParagoniaHEX) | 파라곤 | 책장 라이브러리(React). 책·챕터·하위 챕터 지도, 읽기 화면, 스크롤 레일, 북마크, 줄치기 |

대도서관이 파라곤에 의존한다(`file:../NeftyAcademy-ParagoniaHEX`). 그래서 두 폴더는 이 저장소 안에 나란히 있어야 한다.

## 실행

Node.js 22.12 이상.

```sh
cd NeftyAcademy-BibliothecaNeftias
npm install
npm run dev      # http://127.0.0.1:5173
npm run build    # dist/index.html 한 파일
```

파라곤만 따로 보려면 `cd NeftyAcademy-ParagoniaHEX && npm install && npm run dev` (견본 책).

## 라이선스

AGPL-3.0-or-later. 고쳐 쓰거나 이 교재로 강의를 만들어도 되지만, 고친 것은 같은 조건으로 공개해야 한다. 전문은 [LICENSE](LICENSE).

## 기타

프롬프트를 비공개 하는 것은 우둔한 욕심쟁이들이나 하는 일이다.
