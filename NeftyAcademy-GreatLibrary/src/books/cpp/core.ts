/**
 * C++ 서가의 앞쪽 세 권: 문법, STL, 고급.
 * C를 아는 독자를 기준으로 한다(「컴퓨터 프로그래밍 초급」 다음에 읽는 책).
 */
import { book } from '../outline';

export const cppSyntax = book(
  'cpp-syntax',
  'C++ 문법',
  'C에서 건너와 클래스, 템플릿, 예외까지',
  'cpp',
  `
from-c            C에서 C++로
  from-c-hello      첫 프로그램과 iostream
  from-c-compile    컴파일러와 표준 버전 고르기
  from-c-diff       C와 달라지는 것들
  from-c-mangling   이름 맹글링과 extern "C"
types             타입과 초기화
  types-auto        auto와 decltype
  types-init        초기화의 여러 모양과 중괄호 초기화
  types-builtin     nullptr, bool, char8_t, 정수 타입
  types-enum        enum class
  types-binding     구조적 바인딩
  types-literal     사용자 정의 리터럴
references        참조
  ref-lvalue        좌측값 참조
  ref-const         const 참조와 임시 객체
  ref-vs-pointer    포인터와 참조 고르기
  ref-return        참조를 돌려줄 때의 함정
functions         함수
  fn-overload       오버로딩과 오버로드 해소
  fn-default        기본 인자
  fn-inline         inline과 하나의 정의 규칙(ODR)
  fn-constexpr      constexpr 함수
  fn-lambda         람다 기초
  fn-attributes     noexcept와 속성들
namespaces        네임스페이스와 이름 찾기
  ns-basic          namespace와 using
  ns-anonymous      이름 없는 네임스페이스
  ns-adl            인자 의존 이름 찾기(ADL)
classes           클래스
  class-members     멤버와 접근 지정
  class-ctor        생성자와 멤버 초기화 리스트
  class-dtor        소멸자와 RAII
  class-const       this, const 멤버 함수, mutable
  class-static      static 멤버
  class-friend      friend
  class-explicit    explicit과 변환 생성자
special-members   복사와 이동
  sm-copy           복사 생성과 복사 대입
  sm-rvalue         우측값 참조
  sm-move           이동 생성과 이동 대입
  sm-elision        std::move와 복사 생략
  sm-rules          0, 3, 5의 규칙
  sm-default        = default와 = delete
operators         연산자 오버로딩
  op-arith          산술과 복합 대입
  op-compare        비교와 우주선 연산자
  op-call           첨자와 함수 호출
  op-stream         스트림 입출력
  op-conversion     변환 연산자
inheritance       상속과 다형성
  inh-public        public 상속과 is-a
  inh-virtual       virtual 함수와 가상 함수 표
  inh-abstract      순수 가상 함수와 추상 클래스
  inh-override      override와 final
  inh-dtor          가상 소멸자
  inh-multiple      다중 상속과 가상 상속
  inh-rtti          dynamic_cast와 typeid
  inh-slicing       객체 잘림
templates         템플릿
  tpl-function      함수 템플릿
  tpl-class         클래스 템플릿
  tpl-deduction     인자 추론과 CTAD
  tpl-special       특수화와 부분 특수화
  tpl-nontype       타입이 아닌 템플릿 인자
  tpl-variadic      가변 인자 템플릿과 접기 식
  tpl-alias         별칭 템플릿과 변수 템플릿
  tpl-lookup        두 단계 이름 찾기와 typename
concepts          콘셉트와 제약
  con-requires      requires 절과 requires 식
  con-standard      표준 콘셉트
  con-own           콘셉트 만들기
  con-sfinae        옛 방식: SFINAE와 enable_if
exceptions        예외
  exc-basic         throw, try, catch
  exc-unwind        스택 풀기와 RAII
  exc-safety        예외 안전성의 세 단계
  exc-noexcept      noexcept
  exc-without       예외 없이 오류 알리기
casts             형 변환
  cast-static       static_cast
  cast-const        const_cast
  cast-reinterpret  reinterpret_cast와 std::bit_cast
  cast-dynamic      dynamic_cast
  cast-implicit     암시적 변환의 규칙
compile-time      컴파일 시간 계산
  ct-constexpr      constexpr 변수와 함수
  ct-if             if constexpr
  ct-consteval      consteval과 constinit
  ct-assert         static_assert
  ct-traits         타입 특성 맛보기
lambdas           람다 깊이
  lam-capture       캡처의 종류와 수명
  lam-generic       제네릭 람다
  lam-closure       클로저 타입의 정체
  lam-function      std::function과 그 비용
  lam-recursive     재귀 람다와 명시적 this
modules           헤더, 모듈, 빌드
  mod-headers       헤더와 ODR
  mod-pimpl         전방 선언과 pimpl
  mod-modules       C++20 모듈
  mod-cmake         CMake로 프로젝트 꾸리기
lifetime          객체의 수명과 저장 기간
  life-storage      자동, 정적, 동적, 스레드 저장 기간
  life-static-init  정적 초기화 순서 문제
  life-temporary    임시 객체의 수명
  life-new          new, delete, placement new
  life-alignment    크기와 정렬
ub-cpp            C++의 정의되지 않은 동작
  ubc-lifetime      수명이 끝난 객체 쓰기
  ubc-aliasing      엄격한 별칭과 union
  ubc-invalidation  반복자와 참조의 무효화
  ubc-odr           ODR 위반
  ubc-tools         새니타이저와 경고
versions          C++ 버전별 기능
  ver-98            C++98과 C++03
  ver-11            C++11
  ver-14            C++14
  ver-17            C++17
  ver-20            C++20
  ver-23            C++23
  ver-26            C++26
`,
);

export const cppStl = book(
  'cpp-stl',
  'C++ STL',
  '컨테이너, 반복자, 알고리즘과 표준 라이브러리 전부',
  'cpp',
  `
overview          표준 라이브러리의 구조
  ov-parts          컨테이너, 반복자, 알고리즘
  ov-headers        헤더 지도
  ov-complexity     복잡도 보장 읽는 법
  ov-allocator      할당자가 끼어드는 자리
strings           문자열
  str-string        std::string
  str-view          std::string_view
  str-convert       숫자와 문자열 바꾸기
  str-format        std::format과 std::print
  str-unicode       유니코드와 인코딩
  str-regex         정규식
sequence          순차 컨테이너
  seq-vector        vector
  seq-array         array
  seq-deque         deque
  seq-list          list와 forward_list
  seq-span          span
  seq-vector-bool   vector<bool>의 함정
  seq-invalidation  반복자 무효화 규칙
associative       연관 컨테이너
  assoc-map         map과 set
  assoc-multi       multimap과 multiset
  assoc-compare     비교자와 투명 비교
  assoc-unordered   unordered_map과 unordered_set
  assoc-hash        해시 함수 만들기
  assoc-flat        flat_map과 flat_set
  assoc-node        노드 핸들과 merge
adaptors          컨테이너 어댑터
  adp-stack         stack과 queue
  adp-priority      priority_queue
iterators         반복자
  it-category       반복자의 범주
  it-adaptors       reverse, insert, move 반복자
  it-own            반복자 직접 만들기
  it-sentinel       센티널
algorithms        알고리즘
  alg-search        찾기와 세기
  alg-sort          정렬과 이진 탐색
  alg-modify        복사, 변형, 지우기
  alg-numeric       수치 알고리즘
  alg-set-heap      집합, 힙, 순열
  alg-parallel      실행 정책
ranges            레인지
  rng-algorithms    레인지 알고리즘과 프로젝션
  rng-views         뷰
  rng-pipe          파이프로 잇기
  rng-own           뷰 직접 만들기
  rng-dangling      댕글링과 빌린 레인지
vocabulary        어휘 타입
  voc-pair          pair와 tuple
  voc-optional      optional
  voc-variant       variant와 visit
  voc-any           any
  voc-expected      expected
  voc-function      function, move_only_function, function_ref
  voc-bitset        bitset
  voc-refwrap       reference_wrapper
memory            메모리 도구
  mem-unique        unique_ptr
  mem-shared        shared_ptr과 weak_ptr
  mem-make          make_unique와 make_shared
  mem-allocator     allocator와 pmr
  mem-uninit        초기화되지 않은 메모리 다루기
io                입출력
  io-streams        iostream의 구조
  io-file           파일 스트림
  io-string         stringstream과 spanstream
  io-manip          서식 조작자
  io-binary         이진 입출력
  io-speed          느린 이유와 대안
filesystem        파일 시스템
  fs-path           path
  fs-walk           디렉터리 순회
  fs-ops            만들기, 복사, 지우기
  fs-errors         error_code로 오류 받기
chrono            시간
  chr-duration      duration과 time_point
  chr-clocks        시계의 종류
  chr-calendar      달력과 시간대
  chr-format        시간 서식
numeric           수와 난수
  num-random        난수
  num-bit           비트 조작
  num-numbers       수학 상수와 특수 함수
  num-complex       complex와 ratio
  num-linalg        mdspan과 선형대수
errors            오류 처리 도구
  err-exceptions    표준 예외 계층
  err-system        system_error와 error_code
  err-location      source_location과 stacktrace
concurrency       동시성 맛보기
  conc-thread       thread와 jthread
  conc-mutex        mutex와 lock
  conc-future       future와 async
traits            타입 특성과 메타 도구
  tr-type-traits    type_traits
  tr-concepts       concepts 헤더
  tr-utility        declval, forward, integer_sequence
implementations   구현 들여다보기
  impl-three        libstdc++, libc++, MSVC STL
  impl-vector       vector는 어떻게 자라는가
  impl-sso          작은 문자열 최적화
  impl-debug        디버그 모드와 경화 모드
  impl-abi          구현마다 다른 ABI
`,
);

export const cppAdvanced = book(
  'cpp-advanced',
  'C++ 고급',
  '소유권, 동시성, 코루틴, 메타프로그래밍, 성능, 도구',
  'cpp',
  `
smart-pointers    스마트 포인터 깊이
  sp-unique         unique_ptr과 삭제자
  sp-shared         shared_ptr의 제어 블록
  sp-weak           weak_ptr과 순환 참조
  sp-from-this      enable_shared_from_this
  sp-passing        함수에 넘기고 돌려주는 법
  sp-cost           비용과 고르는 기준
move-semantics    이동 의미론 깊이
  mv-categories     값 범주
  mv-forwarding     보편 참조와 완벽 전달
  mv-rvo            RVO와 NRVO
  mv-noexcept       noexcept 이동과 컨테이너
  mv-moved-from     이동된 뒤의 상태
resources         자원 관리 패턴
  res-wrapper       RAII 래퍼 만들기
  res-guard         스코프 가드
  res-exception     예외에 안전한 코드 쓰기
  res-ownership     소유권 설계
threads           스레드
  thr-jthread       thread, jthread, stop_token
  thr-args          인자 전달과 수명
  thr-local         thread_local
  thr-hardware      코어 수와 스레드 친화도
sync              동기화
  sync-mutex        뮤텍스의 종류
  sync-locks        lock_guard, unique_lock, scoped_lock
  sync-deadlock     교착 상태와 잠금 순서
  sync-shared       shared_mutex
  sync-condvar      조건 변수
  sync-once         call_once와 정적 지역 변수
  sync-semaphore    세마포어, 래치, 배리어
atomics           원자적 연산과 메모리 모델
  atm-atomic        std::atomic
  atm-order         메모리 순서
  atm-cas           비교 후 교환
  atm-false-sharing 거짓 공유
  atm-lockfree      락 없는 자료 구조의 기초
  atm-aba           ABA 문제와 메모리 회수
  atm-wait          atomic wait와 notify
async             비동기
  asy-future        future와 promise
  asy-async         std::async와 packaged_task
  asy-pool          스레드 풀 만들기
  asy-execution     std::execution(센더와 리시버)
coroutines        코루틴
  co-keywords       co_await, co_yield, co_return
  co-promise        promise_type과 코루틴 핸들
  co-generator      제너레이터
  co-task           태스크 타입 만들기
  co-transfer       대칭 전달
  co-cost           프레임 할당과 비용
metaprogramming   템플릿 메타프로그래밍
  tmp-typelist      타입 리스트와 재귀
  tmp-detection     SFINAE에서 콘셉트로
  tmp-crtp          CRTP
  tmp-expression    표현식 템플릿
  tmp-tag           태그 디스패치
  tmp-strings       컴파일 시간 문자열
  tmp-reflection    정적 리플렉션
type-erasure      타입 지우기와 다형성 설계
  te-compare        가상 함수, 템플릿, variant 견주기
  te-implement      타입 지우기 구현하기
  te-sbo            작은 버퍼 최적화
  te-pimpl          pimpl과 컴파일 방화벽
memory            메모리 관리
  mm-new            operator new 바꾸기
  mm-allocator      할당자 만들기
  mm-pmr            pmr 메모리 자원
  mm-arena          아레나와 풀
  mm-layout         객체 배치와 캐시
performance       성능
  perf-measure      벤치마크와 프로파일러
  perf-cache        캐시와 자료 배치
  perf-branch       분기 예측
  perf-inline       인라이닝, LTO, PGO
  perf-simd         SIMD
  perf-copies       복사 줄이기
design            설계 관용구
  des-zero          0의 규칙과 값 의미론
  des-interface     인터페이스 설계
  des-errors        오류 전달 전략
  des-injection     의존성 주입
  des-patterns      디자인 패턴의 C++식 표현
interop           다른 언어와 바이너리 경계
  iop-c-abi         C ABI로 내놓기
  iop-shared        DLL과 공유 라이브러리의 경계
  iop-abi-stable    ABI 안정성
  iop-python        파이썬과 잇기
  iop-rust          Rust와 잇기
tooling           도구
  tool-cmake        CMake 깊이
  tool-packages     vcpkg와 Conan
  tool-sanitizers   새니타이저
  tool-static       정적 분석과 포매터
  tool-testing      단위 테스트와 퍼징
  tool-ci           지속적 통합
safety            안전한 C++
  safe-guidelines   Core Guidelines
  safe-profiles     수명 검사와 프로파일
  safe-hardening    표준 라이브러리 경화
  safe-contracts    계약
  safe-vulns        취약점의 유형
reading           큰 코드와 표준 읽기
  read-standard     표준 문서 읽는 법
  read-reference    cppreference와 컴파일러 탐색기
  read-source       오픈소스 코드 읽기
`,
);
