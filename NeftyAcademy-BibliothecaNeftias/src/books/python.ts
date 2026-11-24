/**
 * 파이썬 서가. C++ 서가와 같은 짜임(문법, 표준 라이브러리, 고급, 분야별 응용)으로 잡은 뼈대다.
 * 응용 쪽은 아직 챕터 제목까지만 있다.
 */
import type { Book } from 'paragoniahex';
import { book } from './outline';

const pySyntax = book('py-syntax', '파이썬 문법', '값과 이름에서 클래스, 제너레이터, 타입 힌트까지', 'python', `
start             시작하기
  start-install     설치와 버전 고르기
  start-repl        대화형 셸과 스크립트
  start-venv        가상 환경과 pip
  start-run         파이썬이 코드를 실행하는 방식
values            값과 이름
  val-objects       모든 것은 객체
  val-names         이름은 딱지다: 대입과 참조
  val-mutable       바뀌는 값과 안 바뀌는 값
  val-identity      같음과 같은 객체
numbers           수
  num-int           끝없는 정수
  num-float         float와 Decimal
  num-ops           연산자와 나눗셈
strings           문자열
  str-basics        str과 유니코드
  str-format        f-문자열
  str-methods       자주 쓰는 메서드
  str-bytes         bytes와 인코딩
collections       모음 자료형
  col-list          list
  col-tuple         tuple
  col-dict          dict
  col-set           set
  col-slicing       자르기
  col-comprehension 컴프리헨션
control           흐름 제어
  ctl-if            if와 참·거짓
  ctl-loops         for, while, else
  ctl-match         match 문
functions         함수
  fn-args           인자의 여러 모양
  fn-defaults       기본값의 함정
  fn-scope          이름 찾는 순서
  fn-closure        클로저
  fn-lambda         lambda
  fn-decorators     데코레이터
classes           클래스
  cls-basic         클래스와 인스턴스
  cls-dunder        특별 메서드
  cls-property      프로퍼티
  cls-inherit       상속과 MRO
  cls-dataclass     dataclass
  cls-protocol      덕 타이핑과 프로토콜
iterators         반복자와 제너레이터
  it-protocol       반복 프로토콜
  it-generator      제너레이터 함수
  it-genexpr        제너레이터 식
  it-itertools      itertools 맛보기
exceptions        예외
  exc-try           try, except, finally
  exc-raise         예외 만들고 던지기
  exc-context       with 문과 컨텍스트 관리자
modules           모듈과 패키지
  mod-import        import가 하는 일
  mod-package       패키지 만들기
  mod-main          __name__과 __main__
typing            타입 힌트
  typ-basics        기본 표기
  typ-generics      제네릭
  typ-checkers      타입 검사기
files             파일과 입출력
  file-open         파일 열고 닫기
  file-pathlib      pathlib
  file-formats      JSON과 CSV
versions          버전별 기능
`);

const pyStdlib = book('py-stdlib', '파이썬 표준 라이브러리', '배터리 포함: 자주 쓰는 모듈 훑기', 'python', `
overview          표준 라이브러리의 지도
text              글 다루기
  txt-re            re
  txt-string        string과 textwrap
  txt-unicode       unicodedata
data-types        자료형
  dt-collections    collections
  dt-dataclasses    dataclasses와 enum
  dt-datetime       datetime과 zoneinfo
  dt-decimal        decimal과 fractions
functional        함수 도구
  fnl-itertools     itertools
  fnl-functools     functools
  fnl-operator      operator
files             파일과 경로
  fs-pathlib        pathlib
  fs-shutil         shutil과 tempfile
  fs-glob           glob과 fnmatch
formats           데이터 형식
  fmt-json          json
  fmt-csv           csv
  fmt-toml          tomllib과 configparser
  fmt-struct        struct
  fmt-sqlite        sqlite3
os                운영체제와 만나기
  os-os             os와 sys
  os-subprocess     subprocess
  os-argparse       argparse
  os-logging        logging
concurrency       동시성
  cc-threading      threading
  cc-multiproc      multiprocessing
  cc-futures        concurrent.futures
  cc-asyncio        asyncio
network           네트워크
  net-socket        socket
  net-http          urllib과 http
  net-email         email
testing           테스트와 디버깅
  tst-unittest      unittest
  tst-pdb           pdb
  tst-timeit        timeit과 cProfile
math              수학
  mth-math          math와 statistics
  mth-random        random과 secrets
`);

const pyAdvanced = book('py-advanced', '파이썬 고급', '객체 모델, 비동기, 성능, 패키징', 'python', `
object-model      객체 모델
  om-attributes     속성을 찾는 순서
  om-descriptors    디스크립터
  om-slots          __slots__
  om-metaclass      메타클래스
memory            메모리와 실행
  pm-refcount       참조 세기와 가비지 컬렉션
  pm-bytecode       바이트코드
  pm-gil            GIL과 자유 스레드 빌드
async             비동기
  pa-eventloop      이벤트 루프
  pa-await          코루틴과 await
  pa-tasks          태스크와 취소
  pa-patterns       비동기 패턴
parallel          병렬 처리
  pp-threads        스레드가 도움이 될 때
  pp-processes      프로세스로 나누기
  pp-shared         공유 메모리
performance       성능
  ppf-profile       프로파일링
  ppf-numpy         벡터화
  ppf-cython        Cython과 Numba
  ppf-native        C 확장으로 넘기기
typing-adv        타입 깊이
  pt-protocols      프로토콜과 구조적 타입
  pt-generics       제네릭과 변성
  pt-runtime        실행 중 타입 검사
metaprogramming   메타프로그래밍
  pmp-decorators    데코레이터 깊이
  pmp-inspect       inspect와 리플렉션
  pmp-ast           ast
packaging         패키징
  pkg-pyproject     pyproject.toml
  pkg-tools         uv, pip, 빌드 도구
  pkg-wheels        휠과 배포
  pkg-apps          실행 파일로 만들기
quality           코드 품질
  pq-lint           린터와 포매터
  pq-pytest         pytest
  pq-ci             지속적 통합
design            설계 관용구
`);

const pyApplied: Book = {
  id: 'py-applied',
  title: '파이썬 응용',
  subtitle: '분야별로 고르는 책들',
  category: 'python',
  chapters: [],
  books: [
    book('py-data', '데이터 분석', 'NumPy, pandas, 그래프', 'python', `
numpy             NumPy 배열
pandas            pandas 데이터프레임
cleaning          데이터 정리
plotting          그래프 그리기
statistics        통계 기초
notebooks         노트북 환경
io                파일과 데이터베이스에서 읽기
performance       큰 데이터 다루기
`),
    book('py-web', '웹 서버', 'HTTP API와 웹 서비스', 'python', `
http              HTTP 기초
fastapi           FastAPI
django            Django
database          데이터베이스와 ORM
auth              인증
async-server      비동기 서버
testing           테스트
deploy            배포
`),
    book('py-automation', '자동화와 스크립트', '반복되는 일을 코드로', 'python', `
files             파일과 폴더 정리
cli               명령줄 도구 만들기
scraping          웹에서 긁어 오기
office            문서와 스프레드시트
scheduling        예약 실행
apis              외부 API 쓰기
`),
    book('py-ml', '머신러닝', '고전 기법에서 신경망까지', 'python', `
basics            머신러닝의 기본 개념
sklearn           scikit-learn
pytorch           PyTorch
training          학습 돌리기
evaluation        평가
deployment        모델 배포
llm               언어 모델 쓰기
`),
    book('py-device', '라즈베리파이와 MicroPython', '파이썬으로 장치 다루기', 'python', `
gpio              GPIO
buses             I2C, SPI, UART
sensors           센서 읽기
micropython       MicroPython
networking        네트워크와 MQTT
camera            카메라
services          부팅할 때 실행하기
`),
    book('py-native', 'C와 C++로 넓히기', '느린 곳을 네이티브 코드로', 'python', `
ctypes            ctypes
cffi              cffi
c-api             C API로 확장 모듈 쓰기
pybind11          pybind11
buffers           버퍼 프로토콜과 NumPy
embedding         C++ 프로그램 안에 파이썬 넣기
packaging         네이티브 휠 만들기
`),
    book('py-gui', 'GUI', '창이 있는 프로그램', 'python', `
tkinter           tkinter
pyside            PySide(Qt)
layout            레이아웃과 위젯
threads           긴 작업과 화면
packaging         배포
`),
  ],
};

export const python: Book = {
  id: 'python',
  title: '파이썬',
  subtitle: '문법, 표준 라이브러리, 고급, 그리고 분야별 응용',
  category: 'python',
  chapters: [],
  books: [pySyntax, pyStdlib, pyAdvanced, pyApplied],
};
