/**
 * 소형 기기 서가 (2) 시스템 API: 커널과 시스템 서비스에 부탁하는 인터페이스들. API 하나에 책 한 권.
 * 리눅스 시스템 호출, POSIX 스레드, libsystemd, D-Bus, 커널 모듈과 드라이버, ARM NEON.
 */
import { book } from '../outline';

export const sysCalls = book('syscalls', '리눅스 시스템 호출', 'open에서 epoll까지, 커널에 부탁하는 법', 'sbc', `
model             시스템 호출이라는 문
  sc-what           사용자 공간과 커널 공간
  sc-libc           glibc 래퍼와 syscall()
  sc-errno          errno와 오류 처리 습관
  sc-man            man 2와 man 3 읽기
  sc-strace         strace로 엿보기
files             파일 기술자
  fd-open           open, close, 플래그
  fd-rw             read와 write: 덜 읽히고 덜 쓰이는 경우
  fd-seek           lseek, pread, pwrite
  fd-dup            dup와 리다이렉션
  fd-fcntl          fcntl과 O_CLOEXEC
  fd-stat           stat과 파일 종류
  fd-sync           fsync: 정말 디스크에 썼는가
filesystem        디렉터리와 경로
  fs-dir            opendir와 readdir
  fs-ops            만들기, 지우기, 이름 바꾸기
  fs-atomic         안전하게 파일 바꿔 쓰기
  fs-links          하드 링크와 심볼릭 링크
  fs-inotify        inotify로 변화 지켜보기
ioctl             ioctl
  ioc-what          파일로 표현 안 되는 부탁
  ioc-numbers       요청 번호의 구조
  ioc-examples      장치에서 만나는 ioctl들
memory            메모리
  mem-mmap          mmap
  mem-shared        공유 메모리
  mem-devmem        /dev/mem과 레지스터 직접 만지기
  mem-lock          mlock과 실시간
process           프로세스
  pr-fork           fork
  pr-exec           exec 계열
  pr-wait           wait와 좀비
  pr-spawn          posix_spawn
  pr-env            환경 변수와 작업 디렉터리
  pr-daemon         데몬이 되는 옛 방식과 요즘 방식
signals           시그널
  sig-basics        시그널이 오는 경우들
  sig-action        sigaction
  sig-safe          핸들러 안에서 해도 되는 일
  sig-mask          시그널 막기와 대기
  sig-fd            signalfd
ipc               프로세스끼리 말하기
  ipc-pipe          파이프와 FIFO
  ipc-unix          유닉스 도메인 소켓
  ipc-mq            POSIX 메시지 큐
  ipc-shm           POSIX 공유 메모리와 세마포어
time              시간
  tm-clocks         clock_gettime과 시계의 종류
  tm-sleep          nanosleep과 clock_nanosleep
  tm-timerfd        timerfd
  tm-jitter         주기를 지키기 어려운 이유
multiplex         여러 기술자 한꺼번에 기다리기
  mx-blocking       블로킹과 논블로킹
  mx-poll           poll
  mx-epoll          epoll
  mx-edge           레벨 트리거와 에지 트리거
  mx-eventfd        eventfd
  mx-loop           이벤트 루프 짜기
  mx-uring          io_uring 맛보기
permissions       권한
  pm-ids            사용자와 그룹 ID
  pm-modes          파일 권한과 umask
  pm-caps           capabilities
  pm-drop           권한 내려놓기
limits            한도와 정보
  lim-rlimit        rlimit
  lim-proc          /proc에서 내 상태 읽기
  lim-sysinfo       시스템 정보 얻기
portability       이식성
  port-posix        POSIX인 것과 리눅스만의 것
  port-feature      기능 시험 매크로
`);

export const pthreads = book('pthreads', 'POSIX 스레드', 'pthreads로 스레드, 잠금, 실시간까지', 'sbc', `
basics            스레드 만들기
  th-create         pthread_create와 인자 넘기기
  th-join           join과 detach
  th-attr           스레드 속성: 스택 크기
  th-return         결과 돌려받기
  th-compile        컴파일과 링크
races             경쟁 상태
  rc-what           같은 변수를 둘이 고치면
  rc-tsan           ThreadSanitizer로 찾기
  rc-atomic         원자적이라는 말의 뜻
mutex             뮤텍스
  mx-lock           lock과 unlock
  mx-types          일반, 재귀, 오류 검사 뮤텍스
  mx-trylock        trylock과 timedlock
  mx-deadlock       교착 상태와 잠금 순서
  mx-granularity    잠금의 굵기
condvar           조건 변수
  cv-wait           wait와 signal
  cv-spurious       까닭 없이 깨어남과 while
  cv-queue          작업 줄 만들기
  cv-timed          시간제한 대기
other-sync        그 밖의 동기화 도구
  os-rwlock         읽기-쓰기 락
  os-spin           스핀락
  os-barrier        배리어
  os-sem            세마포어
  os-once           pthread_once
tls               스레드별 데이터
  tls-keyword       thread_local
  tls-key           pthread_key
  tls-errno         errno는 어떻게 스레드마다 다른가
cancel            끝내기
  cn-flag           플래그로 멈추게 하기
  cn-cancel         pthread_cancel과 취소 지점
  cn-cleanup        정리 핸들러
  cn-signals        스레드와 시그널
patterns          자주 쓰는 구조
  pt-pool           스레드 풀
  pt-producer       생산자와 소비자
  pt-pipeline       파이프라인
  pt-ringbuffer     락 없는 링 버퍼
scheduling        스케줄링
  sch-policies      SCHED_OTHER, FIFO, RR, DEADLINE
  sch-priority      우선순위 주기
  sch-affinity      코어에 묶기
  sch-inversion     우선순위 역전과 상속
realtime          실시간
  rt-what           실시간의 뜻: 빠름이 아니라 제때
  rt-preempt        PREEMPT_RT 커널
  rt-loop           주기 루프 짜기
  rt-latency        cyclictest로 지연 재기
  rt-pitfalls       페이지 폴트, malloc, 출력
c11-threads       C11 threads.h와 견주기
debugging         디버깅
  dbg-gdb           gdb에서 스레드 보기
  dbg-helgrind      Helgrind와 TSan
  dbg-hang          멈춘 프로그램 들여다보기
`);

export const libsystemd = book('libsystemd', 'libsystemd', 'sd-daemon, sd-journal, sd-event로 서비스답게', 'sbc', `
overview          libsystemd에 든 것들
  ov-parts          sd-daemon, sd-journal, sd-event, sd-bus, sd-device
  ov-build          헤더, pkg-config, 링크
  ov-without        systemd가 없는 시스템에서는
notify            sd-daemon: 준비됐다고 알리기
  nt-type           Type=notify
  nt-ready          sd_notify와 READY=1
  nt-status         STATUS와 진행 상황
  nt-reload         다시 읽기와 멈추기 알림
watchdog          워치독
  wd-unit           WatchdogSec
  wd-ping           WATCHDOG=1 보내기
  wd-design         무엇이 살아 있을 때 알릴 것인가
  wd-hardware       하드웨어 워치독과 잇기
socket-activation 소켓 활성화
  sa-idea           소켓을 systemd가 먼저 연다
  sa-unit           .socket 유닛
  sa-listen-fds     sd_listen_fds
  sa-fdstore        기술자 맡겨 두기
journal           sd-journal: 로그
  jr-stderr         그냥 stderr에 쓰기와 우선순위 접두어
  jr-send           sd_journal_send와 구조화 로그
  jr-fields         필드 설계
  jr-read           로그 읽기 API
  jr-rate           로그 폭주 막기
event             sd-event: 이벤트 루프
  ev-loop           루프 만들기
  ev-io             입출력 소스
  ev-timer          타이머 소스
  ev-signal         시그널과 자식 프로세스
  ev-defer          defer, post, exit
  ev-priority       우선순위
device            sd-device: 장치 찾기
  dv-enumerate      장치 훑기
  dv-monitor        꽂고 뽑는 것 알아채기
login             sd-login: 세션과 전원
  lg-inhibit        종료 미루기
  lg-power          전원 이벤트 받기
credentials       자격 증명 넘겨받기
  cr-load           LoadCredential
  cr-encrypted      암호화된 자격 증명
example           끝까지 만들어 보기: 센서 기록 서비스
`);

export const dbus = book('dbus', 'D-Bus', 'sd-bus로 시스템의 서비스들과 말하기', 'sbc', `
concepts          D-Bus의 생각
  cc-bus            시스템 버스와 세션 버스
  cc-names          버스 이름, 객체 경로, 인터페이스
  cc-messages       메서드, 시그널, 프로퍼티
  cc-types          타입 시그니처
  cc-broker         dbus-daemon과 dbus-broker
tools             도구
  tl-busctl         busctl
  tl-introspect     인트로스펙션
  tl-monitor        오가는 메시지 엿보기
  tl-gdbus          gdbus와 D-Spy
client            sd-bus로 부르기
  cl-open           버스 열기
  cl-call           메서드 호출
  cl-read           응답 읽기
  cl-property       프로퍼티 읽고 쓰기
  cl-error          오류 다루기
  cl-async          비동기 호출
signals           시그널 받기
  sg-match          매치 규칙
  sg-handler        핸들러와 이벤트 루프
  sg-properties     PropertiesChanged
containers        복잡한 타입
  ct-array          배열과 딕셔너리
  ct-variant        variant
  ct-struct         구조체
  ct-fd             파일 기술자 넘기기
service           서비스 만들기
  sv-name           이름 얻기
  sv-vtable         vtable로 인터페이스 내놓기
  sv-emit           시그널 보내기
  sv-objects        객체 여러 개와 ObjectManager
  sv-activation     버스 활성화
policy            권한
  pl-policy         버스 정책 파일
  pl-polkit         polkit
system-services   시스템 서비스 다루기
  ss-systemd        systemd: 유닛 켜고 끄기
  ss-nm             NetworkManager: 연결 상태와 Wi-Fi
  ss-logind         logind: 종료와 재시작
  ss-timedate       timedated와 hostnamed
  ss-bluez          BlueZ로 가는 길
other-bindings    다른 라이브러리들
  ob-gdbus          GDBus
  ob-libdbus        libdbus
  ob-cpp            sdbus-c++
  ob-python         파이썬에서
design            인터페이스 설계 요령
`);

export const kernelModule = book('kernel-module', '커널 모듈과 드라이버', '첫 모듈에서 디바이스 트리에 붙는 드라이버까지', 'sbc', `
setup             준비
  ks-headers        커널 헤더와 버전 맞추기
  ks-kbuild         Kbuild와 Makefile
  ks-risk           커널에서는 실수의 값이 다르다
  ks-vm             가상 머신과 여분의 보드에서 연습하기
hello             첫 모듈
  hm-init           init과 exit
  hm-printk         printk와 dmesg
  hm-param          모듈 인자
  hm-info           modinfo, 라이선스, 오염 표시
char-device       문자 장치
  cd-register       장치 번호와 cdev
  cd-fops           file_operations
  cd-rw             read와 write: copy_to_user
  cd-node           /dev 노드가 생기게 하기
  cd-misc           misc 장치로 간단하게
ioctl             ioctl 설계하기
  io-numbers        번호 정하기
  io-compat         32비트 사용자 공간
  io-alternatives   sysfs, configfs, netlink와 견주기
memory            커널의 메모리
  km-kmalloc        kmalloc과 vmalloc
  km-devm           devm_ 계열: 알아서 치워지는 자원
  km-user           사용자 메모리 다루기
  km-mmap           드라이버의 mmap
concurrency       동시성
  kc-context        프로세스 문맥과 인터럽트 문맥
  kc-spinlock       스핀락
  kc-mutex          뮤텍스
  kc-atomic         원자적 연산과 RCU 맛보기
  kc-wait           대기 큐와 completion
platform          플랫폼 드라이버와 디바이스 트리
  pf-driver         platform_driver
  pf-compatible     compatible 문자열로 짝짓기
  pf-probe          probe와 remove
  pf-props          디바이스 트리 속성 읽기
  pf-overlay        내 장치를 오버레이로 선언하기
gpio-irq          GPIO와 인터럽트
  gi-gpiod          gpiod 소비자 API
  gi-irq            인터럽트 핸들러
  gi-threaded       스레드 인터럽트
  gi-debounce       디바운스와 워크큐
bus-drivers       버스 장치 드라이버
  bd-i2c            I2C 클라이언트 드라이버
  bd-spi            SPI 드라이버
  bd-regmap         regmap
  bd-usb            USB 드라이버 맛보기
  bd-pci            PCI 드라이버 맛보기: QEMU의 edu 장치
subsystems        서브시스템에 올라타기
  ss-why            직접 문자 장치를 만들기 전에
  ss-iio            IIO 드라이버
  ss-led-input      LED와 입력 서브시스템
  ss-hwmon          hwmon
sysfs             sysfs 속성
timers            시간
  kt-delay          지연과 sleep
  kt-timer          타이머와 hrtimer
  kt-workqueue      워크큐
debugging         디버깅
  kd-oops           Oops 읽기
  kd-dyndbg         dynamic debug
  kd-ftrace         ftrace
  kd-kgdb           KGDB와 QEMU
distribution      내보내기
  ds-dkms           DKMS
  ds-signing        모듈 서명
  ds-upstream       메인라인에 올린다는 것
  ds-rust           Rust로 쓰는 드라이버
`);

export const neon = book('neon', 'ARM NEON', '내장 함수로 한 번에 여러 값을 계산하기', 'sbc', `
simd              SIMD라는 생각
  sm-why            한 명령으로 여러 값
  sm-registers      NEON 레지스터와 레인
  sm-armv7-v8       ARMv7과 AArch64의 차이
  sm-check          컴파일 옵션과 지원 확인
types             타입과 이름 규칙
  ty-vectors        벡터 타입 읽기: float32x4_t
  ty-naming         내장 함수 이름 읽기: vaddq_f32
  ty-header         arm_neon.h
load-store        싣고 내리기
  ls-load           vld1과 vst1
  ls-interleave     채널 풀어서 싣기: vld3, vld4
  ls-lanes          레인 하나 꺼내고 넣기
  ls-align          정렬
arith             산술
  ar-basic          더하기, 빼기, 곱하기
  ar-fma            곱하고 더하기
  ar-saturate       포화 연산
  ar-widen          넓히기와 좁히기
  ar-shift          시프트
  ar-divide         나눗셈이 없을 때: 역수 근사
compare           비교와 선택
  cp-mask           비교 결과는 마스크
  cp-select         vbsl로 분기 없애기
  cp-minmax         최솟값, 최댓값, 절댓값
  cp-any-all        하나라도 참인가
shuffle           자리 바꾸기
  sh-combine        반으로 나누고 합치기
  sh-zip            zip과 unzip
  sh-ext            ext와 rev
  sh-table          표 찾기: vtbl
reduce            하나로 모으기
  rd-sum            가로 합
  rd-dot            내적
  rd-max            최댓값 찾기
loops             루프 짜기
  lp-tail           남는 자투리 처리
  lp-unroll         풀어 쓰기와 누산기 여러 개
  lp-alias          restrict와 겹침
cases             사례
  cs-gray           컬러를 회색조로
  cs-blur           상자 블러
  cs-threshold      임계값과 마스크
  cs-fir            FIR 필터
  cs-matmul         4x4 행렬 곱
  cs-memchr         글자 찾기
auto-vec          자동 벡터화
  av-report         컴파일러가 해 주는 것 확인하기
  av-help           컴파일러를 돕는 법
  av-compare        손으로 쓴 것과 견주기
measure           재기
  ms-bench          벤치마크 요령
  ms-perf           perf로 보기
  ms-thermal        열로 느려지는 것 가려내기
portable          옮겨 다니기
  pt-sse            x86 SSE·AVX와 대응
  pt-simde          SIMDe
  pt-highway        Highway와 std::simd
  pt-dispatch       실행 중에 고르기
sve               SVE와 SVE2 맛보기
`);
