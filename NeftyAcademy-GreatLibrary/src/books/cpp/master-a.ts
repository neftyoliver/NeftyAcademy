/**
 * C++ 최고급 서가 (1): 만드는 것에 따른 책들.
 * 게임 엔진, Qt, 산업용 프로그램, 데이터베이스 연동, 벌칸, 복잡한 소프트웨어, 게임 서버, 서비스 서버, 직접 만드는 DBMS.
 */
import { book } from '../outline';

export const cppGameEngine = book('cpp-game-engine', '게임 엔진', '루프와 메모리에서 렌더러, ECS, 에디터까지', 'cpp', `
architecture      엔진의 구조
  arch-layers       층으로 나눈 구조
  arch-loop         게임 루프와 고정 시간 간격
  arch-subsystems   서브시스템의 시작과 종료 순서
  arch-boundary     엔진 코드와 게임 코드의 경계
platform          플랫폼 층
  plat-window       창과 입력
  plat-files        파일과 경로
  plat-time         시간 재기
  plat-hot-reload   동적 라이브러리와 핫 리로드
memory            메모리와 자료 구조
  mem-frame         프레임 할당자와 스택 할당자
  mem-pool          풀 할당자
  mem-handles       핸들과 세대 인덱스
  mem-containers    엔진용 컨테이너
math              수학
  math-vectors      벡터와 행렬
  math-quaternion   쿼터니언과 회전
  math-transform    변환과 계층
  math-conventions  좌표계의 약속
  math-simd         SIMD로 빠르게
ecs               엔티티, 컴포넌트, 시스템
  ecs-models        객체 모델 견주기
  ecs-storage       아키타입과 희소 집합
  ecs-systems       시스템과 실행 순서
  ecs-events        이벤트와 메시지
resources         자원 관리
  res-pipeline      에셋 파이프라인
  res-import        가져오기와 굽기
  res-async         비동기 로딩
  res-lifetime      참조 세기와 핫 리로드
  res-packaging     묶음 파일
rendering         렌더러
  rend-abstraction  그래픽 API 감싸기
  rend-graph        렌더 그래프
  rend-materials    머티리얼과 셰이더 관리
  rend-culling      컬링과 정렬
  rend-lighting     조명과 그림자
  rend-post         후처리
scene             장면
  scene-graph       장면 그래프
  scene-spatial     공간 분할
  scene-serialize   저장과 불러오기
  scene-prefab      프리팹
physics           물리
  phys-collision    충돌 감지의 두 단계
  phys-rigid        강체 시뮬레이션
  phys-integrate    물리 엔진 붙이기
  phys-character    캐릭터 컨트롤러
animation         애니메이션
  anim-skeleton     뼈대와 스키닝
  anim-blend        블렌딩
  anim-state        상태 기계
audio             소리
  audio-mixing      믹싱
  audio-3d          3차원 소리
  audio-stream      스트리밍
scripting         스크립팅과 리플렉션
  scr-reflection    리플렉션 만들기
  scr-lua           스크립트 언어 붙이기
  scr-editor        직렬화와 에디터 연동
jobs              작업 시스템
  job-queue         작업 큐와 워커 스레드
  job-graph         의존 그래프
  job-fibers        파이버
editor            에디터와 도구
  ed-imgui          즉시 모드 GUI
  ed-gizmo          기즈모와 선택
  ed-undo           실행 취소
  ed-profiler       엔진 안의 프로파일러
networking        네트워크
  net-replication   상태 복제
  net-prediction    예측과 보정
shipping          빌드와 출시
  ship-platforms    플랫폼별 빌드
  ship-crash        충돌 보고
  ship-budget       성능 예산
`);

export const cppQt = book('cpp-qt', 'Qt', '위젯과 QML로 만드는 크로스플랫폼 앱', 'cpp', `
start             시작하기
  start-what        Qt의 구성과 라이선스
  start-install     설치와 Qt Creator
  start-cmake       CMake로 프로젝트 만들기
  start-window      첫 창
object            QObject와 메타 객체
  obj-moc           moc가 하는 일
  obj-signals       시그널과 슬롯
  obj-properties    속성
  obj-ownership     부모와 자식, 수명
  obj-eventloop     이벤트 루프
widgets           위젯
  wid-basic         기본 위젯
  wid-layout        레이아웃
  wid-mainwindow    메인 윈도우, 메뉴, 도구 모음, 도킹
  wid-dialogs       대화 상자
  wid-style         스타일시트
model-view        모델과 뷰
  mv-model          모델 인터페이스
  mv-views          리스트, 테이블, 트리
  mv-delegate       델리게이트
  mv-proxy          프록시 모델
painting          그리기
  paint-painter     QPainter
  paint-custom      위젯 직접 그리기
  paint-scene       그래픽스 뷰
  paint-hidpi       고해상도 화면
qml               QML과 Qt Quick
  qml-syntax        QML 문법
  qml-binding       속성 바인딩
  qml-cpp           C++ 타입을 QML에 내놓기
  qml-controls      Qt Quick Controls
  qml-states        상태와 애니메이션
core              핵심 클래스
  core-string       QString과 유니코드
  core-containers   컨테이너와 암시적 공유
  core-variant      QVariant
  core-files        파일과 설정
  core-json         JSON
threads           스레드
  qthr-worker       QThread와 워커 객체
  qthr-signals      스레드를 건너는 시그널
  qthr-concurrent   QtConcurrent와 스레드 풀
network           네트워크와 장치
  qnet-http         HTTP 요청
  qnet-sockets      TCP와 UDP 소켓
  qnet-websocket    WebSocket
  qnet-serial       직렬 포트
  qnet-mqtt         MQTT
sql               데이터베이스
  qsql-connect      연결과 쿼리
  qsql-model        SQL 모델
graphics          3D와 그래픽
  qgfx-rhi          RHI
  qgfx-quick3d      Qt Quick 3D
  qgfx-embed        벌칸과 OpenGL 창 넣기
i18n              국제화
  i18n-tr           tr과 번역 파일
  i18n-locale       로캘
testing           테스트와 디버깅
  qtest-unit        Qt Test
  qtest-logging     로깅 범주
  qtest-inspect     객체 트리 들여다보기
deploy            배포
  dep-desktop       데스크톱 배포 도구
  dep-static        정적 빌드
  dep-embedded      임베디드 리눅스
  dep-android       안드로이드
architecture      큰 앱의 구조
  qarch-plugins     플러그인
  qarch-state       상태 관리
  qarch-undo        명령과 실행 취소
`);

export const cppIndustrial = book('cpp-industrial', '산업용 프로그램', '현장의 장비와 말하고, 실시간으로 제어하고, 기록하기', 'cpp', `
landscape         산업 현장의 소프트웨어
  land-pyramid      자동화 피라미드
  land-roles        PLC, HMI, SCADA, MES
  land-realtime     실시간이라는 요구
  land-safety       안전과 인증
fieldbus          필드버스와 프로토콜
  fb-modbus         Modbus RTU와 TCP
  fb-can            CAN과 CANopen
  fb-ethercat       EtherCAT
  fb-ethernet       PROFINET과 EtherNet/IP
  fb-opcua          OPC UA
plc               PLC와 말하기
  plc-structure     PLC의 구조와 스캔 주기
  plc-vendor        제조사 프로토콜
  plc-tags          태그 읽고 쓰기
  plc-polling       폴링 설계
realtime          실시간 프로그래밍
  rt-jitter         지연과 지터
  rt-preempt        PREEMPT_RT
  rt-memory         메모리 잠금과 할당 금지
  rt-cyclic         주기 작업
  rt-measure        측정
motion            모션 제어
  mot-servo         서보와 드라이브
  mot-trajectory    궤적 만들기
  mot-pid           PID 제어
  mot-multi-axis    여러 축 맞추기
vision            머신 비전
  vis-camera        카메라 인터페이스
  vis-opencv        OpenCV
  vis-inspection    검사 파이프라인
  vis-trigger       조명과 트리거
hmi               HMI 만들기
  hmi-screens       화면 설계
  hmi-alarms        알람
  hmi-recipes       레시피
  hmi-users         사용자와 권한
data              데이터 수집과 기록
  data-timeseries   시계열 저장
  data-mqtt         MQTT와 Sparkplug
  data-trace        추적성
reliability       신뢰성
  rel-watchdog      워치독
  rel-state         상태 기계로 짜기
  rel-recovery      오류에서 돌아오기
  rel-diagnostics   로그와 진단
  rel-redundancy    이중화
safety            기능 안전과 표준
  safe-iec61508     IEC 61508
  safe-misra        MISRA C++
  safe-analysis     정적 분석
  safe-docs         검증 문서
deployment        현장 배포
  depl-ipc          산업용 PC
  depl-update       업데이트
  depl-remote       원격 유지보수
  depl-security     보안
robotics          로봇
  rob-ros2          ROS 2
  rob-kinematics    기구학
  rob-controller    로봇 컨트롤러와 잇기
`);

export const cppDatabase = book('cpp-database', '데이터베이스 연동', 'SQLite에서 서버형 DB까지, C++로 안전하게 붙기', 'cpp', `
basics            관계형 데이터베이스 기초
  db-tables         테이블과 키
  db-sql            SQL 기본
  db-transactions   트랜잭션과 격리 수준
  db-index          인덱스
sqlite            SQLite
  sqlite-api        C API
  sqlite-prepared   준비된 문장
  sqlite-tx         트랜잭션
  sqlite-threads    스레드 모드
  sqlite-ext        확장
client-server     서버형 데이터베이스에 붙기
  cs-postgres       PostgreSQL
  cs-mysql          MySQL과 MariaDB
  cs-odbc           ODBC
  cs-mssql          SQL Server
injection         SQL 주입과 매개변수 바인딩
mapping           결과를 객체로
  map-rows          행을 구조체로
  map-types         타입 변환과 NULL
  map-time          시간과 소수
  map-orm           ORM과 쿼리 빌더
pooling           연결 관리
  pool-pool         연결 풀
  pool-reconnect    재연결과 타임아웃
  pool-async        비동기 쿼리
transactions      트랜잭션 다루기
  tx-raii           RAII 트랜잭션
  tx-retry          재시도
  tx-deadlock       교착 상태
  tx-optimistic     낙관적 잠금
schema            스키마와 마이그레이션
performance       성능
  dbperf-plan       실행 계획 읽기
  dbperf-batch      배치 삽입
  dbperf-index      인덱스 설계
  dbperf-nplus1     N+1 문제
nosql             관계형 밖의 저장소
  nosql-redis       Redis
  nosql-document    문서 데이터베이스
  nosql-embedded    내장 키-값 저장소
  nosql-timeseries  시계열 데이터베이스
testing           테스트
  dbtest-fixtures   테스트 DB와 픽스처
  dbtest-container  컨테이너로 띄우기
operations        운영
  dbops-backup      백업
  dbops-replica     복제
  dbops-monitor     모니터링
`);

export const cppVulkan = book('cpp-vulkan', '벌칸, GLSL, SPIR-V', '삼각형 하나에서 레이 트레이싱까지', 'cpp', `
overview          그래픽 API의 지도
  vk-gpu-pipeline   GPU 파이프라인
  vk-design         벌칸의 설계
  vk-others         OpenGL, Direct3D, Metal과 견주기
  vk-environment    개발 환경과 검증 레이어
setup             초기화
  setup-instance    인스턴스와 확장
  setup-device      물리 장치와 논리 장치
  setup-queues      큐 패밀리
  setup-swapchain   표면과 스왑체인
triangle          첫 삼각형
  tri-renderpass    렌더 패스와 동적 렌더링
  tri-pipeline      그래픽 파이프라인
  tri-commands      커맨드 버퍼
  tri-sync          펜스와 세마포어
  tri-loop          프레임 루프
glsl              GLSL
  glsl-types        타입과 내장 함수
  glsl-stages       정점 셰이더와 프래그먼트 셰이더
  glsl-interface    인터페이스 블록과 레이아웃
  glsl-compute      컴퓨트 셰이더
  glsl-include      전처리와 include
spirv             SPIR-V
  spv-why           왜 중간 표현인가
  spv-module        모듈의 구조
  spv-compile       glslang과 shaderc
  spv-reflect       리플렉션
  spv-languages     HLSL과 Slang에서 오기
  spv-spec-const    특수화 상수
buffers           버퍼와 메모리
  buf-alloc         메모리 할당과 VMA
  buf-vertex        정점 버퍼와 인덱스 버퍼
  buf-staging       스테이징
  buf-uniform       유니폼 버퍼
descriptors       디스크립터
  desc-sets         세트와 레이아웃
  desc-pool         풀
  desc-bindless     바인드리스
  desc-push         푸시 상수
textures          이미지와 텍스처
  tex-image         이미지, 뷰, 샘플러
  tex-layout        레이아웃 전환
  tex-mipmaps       밉맵
  tex-compressed    압축 포맷
  tex-depth         깊이 버퍼
pipeline-state    파이프라인 상태
  ps-blend          블렌딩, 깊이, 스텐실
  ps-dynamic        동적 상태
  ps-cache          파이프라인 캐시
  ps-msaa           다중 샘플링
synchronization   동기화와 다중 스레드
  vsync-barriers    파이프라인 배리어
  vsync-frames      여러 프레임을 겹쳐 진행하기
  vsync-threads     스레드별 커맨드 풀
techniques        렌더링 기법
  tech-pbr          물리 기반 조명
  tech-shadows      그림자
  tech-deferred     지연 렌더링
  tech-post         후처리
  tech-instancing   인스턴싱과 간접 그리기
compute           컴퓨트와 GPGPU
raytracing        레이 트레이싱
  rt-accel          가속 구조
  rt-pipeline       레이 트레이싱 파이프라인
  rt-query          레이 쿼리
debugging         디버깅과 성능
  vdbg-validation   검증 레이어 읽기
  vdbg-renderdoc    RenderDoc
  vdbg-profile      GPU 프로파일링
  vdbg-mistakes     흔한 실수
portability       이식성
  port-moltenvk     MoltenVK
  port-android      안드로이드
  port-features     장치 기능에 따라 가르기
`);

export const cppComplexApp = book('cpp-complex-app', '복잡한 소프트웨어', '워드와 포토샵 수준의 창, 레이아웃, 문서를 가진 프로그램', 'cpp', `
anatomy           큰 데스크톱 앱의 해부
  ana-layers        문서, 명령, 뷰의 층
  ana-modules       프로세스와 모듈
  ana-cases         실제 프로그램들의 구조
document          문서 모델
  doc-text          글의 자료 구조: 피스 테이블과 로프
  doc-layers        그림의 자료 구조: 레이어 트리와 타일
  doc-immutable     불변 모델과 변경 추적
  doc-selection     선택 모델
commands          명령과 실행 취소
  cmd-pattern       커맨드 패턴
  cmd-stack         실행 취소 스택
  cmd-merge         명령 묶기와 합치기
  cmd-transaction   트랜잭션
windows           창 체계
  win-multi         여러 창과 탭
  win-docking       도킹 패널
  win-ribbon        메뉴, 도구 모음, 리본
  win-workspace     작업 공간 저장
layout            레이아웃 엔진
  lay-box           제약과 박스 모델
  lay-text          글 조판: 줄 나눔과 쪽 나눔
  lay-canvas        캔버스: 확대와 타일 렌더링
rendering         화면 그리기
  rnd-2d            2D 가속 그리기
  rnd-invalidate    무효화와 다시 그리기
  rnd-hidpi         고해상도
  rnd-color         색 관리
text              글자
  txt-shaping       글꼴과 셰이핑
  txt-bidi          양방향 글
  txt-ime           입력기
  txt-spell         맞춤법 검사
tools             도구 체계
  tl-state          도구 상태 기계
  tl-input          펜과 압력
  tl-handles        조작 핸들
plugins           플러그인과 스크립팅
  plg-points        확장 지점
  plg-abi           ABI가 안정된 인터페이스
  plg-script        스크립트 엔진
  plg-sandbox       샌드박스
files             파일 형식
  file-design       자체 형식 설계
  file-versions     버전과 호환
  file-convert      가져오기와 내보내기
  file-autosave     자동 저장과 복구
responsiveness    반응성
  rsp-ui-thread     UI 스레드의 규칙
  rsp-background    백그라운드 작업과 취소
  rsp-progress      진행 표시
  rsp-lazy          큰 문서 늦게 불러오기
collaboration     협업
  col-ot-crdt       OT와 CRDT
  col-history       변경 내역
accessibility     접근성과 국제화
quality           품질
  qa-tests          테스트 전략
  qa-crash          충돌 보고
  qa-telemetry      원격 측정
  qa-budget         성능 예산
shipping          배포와 업데이트
  shp-installer     설치 프로그램
  shp-signing       코드 서명
  shp-update        자동 업데이트
  shp-license       라이선스
`);

export const cppGameServer = book('cpp-game-server', '게임 서버', '소켓에서 동기화, 월드, 확장, 운영까지', 'cpp', `
overview          게임 서버의 종류
  gs-topology       전용 서버, P2P, 릴레이
  gs-genres         장르에 따른 구조
  gs-authority      틱과 권위
sockets           소켓 프로그래밍
  sock-tcp-udp      TCP와 UDP
  sock-nonblocking  논블로킹 I/O
  sock-multiplex    epoll, IOCP, io_uring
  sock-asio         Asio
protocol          프로토콜 설계
  proto-serialize   직렬화
  proto-framing     패킷 나누기
  proto-reliable    믿을 수 있는 UDP
  proto-crypto      암호화
session           세션과 연결 관리
  sess-auth         인증
  sess-heartbeat    하트비트
  sess-reconnect    재접속
simulation        시뮬레이션 동기화
  sim-tick          틱 루프
  sim-snapshot      스냅샷과 델타
  sim-prediction    클라이언트 예측과 서버 보정
  sim-lag           지연 보상
  sim-lockstep      락스텝과 롤백
world             월드와 관심 영역
  wld-spatial       공간 분할
  wld-aoi           관심 영역
  wld-instances     인스턴스와 채널
  wld-seamless      심리스 월드
concurrency       서버의 동시성 모델
  gconc-single      단일 스레드 루프
  gconc-actor       액터
  gconc-jobs        잡 시스템
  gconc-locks       락 설계
persistence       저장
  pers-schema       DB 설계
  pers-cache        캐시
  pers-dupe         트랜잭션과 아이템 복사 막기
  pers-logs         게임 로그
services          주변 서비스
  svc-login         로그인, 매치메이킹, 로비
  svc-chat          채팅
  svc-ranking       랭킹
  svc-payment       결제
scaling           확장
  scl-sharding      샤딩
  scl-interserver   서버 사이의 통신
  scl-orchestrate   오케스트레이션
  scl-patch         무중단 패치
security          보안과 치트 방지
  gsec-authority    서버 권위
  gsec-validate     패킷 검증
  gsec-detect       핵과 봇 찾기
  gsec-ddos         DDoS
operations        운영
  gops-monitor      모니터링
  gops-load         부하 시험
  gops-incident     장애 대응
  gops-tools        라이브 운영 도구
`);

export const cppServiceServer = book('cpp-service-server', '서비스 서버', 'HTTP와 gRPC로 요청을 받는 백엔드', 'cpp', `
overview          서비스 서버란
  ss-request        요청과 응답
  ss-stateless      상태 없는 서버
  ss-latency        지연과 처리량
http              HTTP 서버
  http-versions     HTTP/1.1, 2, 3
  http-libraries    서버 라이브러리
  http-routing      라우팅과 미들웨어
  http-tls          TLS
api               API 설계
  api-rest          REST
  api-grpc          gRPC와 Protobuf
  api-websocket     WebSocket
  api-versioning    버전 관리와 문서
async-io          비동기 I/O
  aio-models        리액터와 프로액터
  aio-coroutines    Asio와 코루틴
  aio-threads       스레드 모델
  aio-backpressure  백프레셔
data              데이터 계층
  sdata-pool        연결 풀
  sdata-cache       캐시
  sdata-queue       메시지 큐
auth              인증과 인가
  auth-session      세션과 JWT
  auth-oauth        OAuth 2
  auth-secrets      비밀 관리
reliability       신뢰성
  srel-timeouts     타임아웃, 재시도, 서킷 브레이커
  srel-idempotent   멱등성
  srel-shutdown     우아한 종료
  srel-overload     과부하 제어
observability     관측
  obs-logs          구조화 로그
  obs-metrics       지표
  obs-tracing       분산 추적
deployment        설정과 배포
  sdep-config       설정 관리
  sdep-container    컨테이너
  sdep-kubernetes   쿠버네티스
  sdep-rollout      무중단 배포
performance       성능
  sperf-profile     프로파일링
  sperf-alloc       메모리 할당자
  sperf-zerocopy    제로 카피
  sperf-load        부하 시험
security          보안
  ssec-input        입력 검증
  ssec-memory       메모리 안전
  ssec-deps         의존성 관리
architecture      구조
  sarch-monolith    모놀리식과 마이크로서비스
  sarch-comm        서비스 사이의 통신
  sarch-consistency 일관성
`);

export const cppDbms = book('cpp-dbms', '직접 구현해 보는 DBMS', '페이지와 B+트리에서 SQL 실행기, 트랜잭션, 복구까지', 'cpp', `
overview          DBMS의 구조
  dbms-layers       질의 처리, 실행, 저장의 층
  dbms-scope        만들 것의 범위
storage           디스크와 페이지
  stor-file         페이지 파일
  stor-slotted      슬롯 페이지
  stor-record       레코드 형식
  stor-overflow     가변 길이와 넘침
buffer            버퍼 풀
  bp-table          페이지 테이블
  bp-replace        교체 정책
  bp-pin            핀과 래치
  bp-flush          더티 페이지 쓰기
btree             B+트리
  bt-node           노드의 구조
  bt-search         탐색
  bt-insert         삽입과 분할
  bt-delete         삭제와 병합
  bt-scan           범위 스캔
  bt-latch          동시 접근: 래치 크래빙
other-index       다른 인덱스
  idx-hash          해시 인덱스
  idx-lsm           LSM 트리
catalog           카탈로그
  cat-schema        테이블과 열의 정보
  cat-system        시스템 테이블
parser            SQL 읽기
  sql-lexer         어휘 분석
  sql-parser        구문 분석과 AST
  sql-binder        이름 묶기와 타입 검사
planner           질의 계획
  plan-logical      논리 계획
  plan-rules        규칙 기반 최적화
  plan-cost         비용과 통계
  plan-join-order   조인 순서
executor          실행기
  exec-volcano      볼케이노 모델
  exec-scan         스캔, 필터, 프로젝션
  exec-join         조인: 중첩 루프, 해시, 정렬 병합
  exec-aggregate    집계와 정렬
  exec-vectorized   벡터화 실행
transactions      트랜잭션
  txn-acid          ACID
  txn-2pl           2단계 잠금
  txn-deadlock      교착 탐지
  txn-mvcc          MVCC
  txn-isolation     격리 수준 구현
recovery          복구
  rec-wal           미리 쓰기 로그
  rec-checkpoint    체크포인트
  rec-aries         ARIES: 분석, 재실행, 취소
server            서버로 만들기
  srv-protocol      프로토콜
  srv-session       연결과 세션
  srv-pgwire        PostgreSQL 와이어 프로토콜 흉내 내기
testing           테스트
  dtest-logic       sqllogictest
  dtest-fault       장애 주입
  dtest-fuzz        퍼징
  dtest-bench       벤치마크
beyond            그다음
  bey-columnar      열 지향 저장
  bey-distributed   분산과 복제
  bey-reading       기존 DBMS 코드 읽기
`);
