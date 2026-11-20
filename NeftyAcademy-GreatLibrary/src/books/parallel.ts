/**
 * 병렬 계산 두 권: OpenMP(한 대의 여러 코어)와 MPI(여러 대의 클러스터).
 * C를 기준으로 쓰고, C++에서 달라지는 점은 각 책의 끝에서 짚는다.
 * (C++ 서가의 「OpenMP와 Open MPI」는 C++ 쪽에서 본 책이다.)
 */
import { book } from './outline';

export const openmp = book('openmp', 'OpenMP', '지시문 몇 줄로 여러 코어 쓰기', 'parallel', `
model             공유 메모리 병렬
  md-forkjoin       포크와 조인
  md-threads        스레드와 코어
  md-when           어울리는 문제
  md-spec           표준과 구현들
setup             준비
  st-compile        컴파일 옵션
  st-version        버전 확인: _OPENMP
  st-first          첫 프로그램
  st-threads        스레드 수 정하기
  st-pi             라즈베리파이의 네 코어에서
parallel          parallel 영역
  pr-region         영역
  pr-ids            스레드 번호와 수
  pr-if             if와 num_threads
  pr-nested         중첩
for               루프 나누기
  fr-for            for 지시문
  fr-canonical      나눌 수 있는 루프의 모양
  fr-schedule       스케줄
  fr-collapse       collapse
  fr-nowait         nowait
  fr-ordered        ordered
  fr-loop           loop 지시문
sharing           데이터 공유
  sh-shared         shared와 private
  sh-first-last     firstprivate와 lastprivate
  sh-default        default(none)
  sh-threadprivate  threadprivate
  sh-pitfalls       흔한 실수
reduction         reduction
  rd-basic          합과 곱
  rd-minmax         최솟값과 최댓값
  rd-array          배열
  rd-user           직접 정의하기
  rd-float          부동소수 합의 순서
sync              동기화
  sy-race           경쟁 상태
  sy-critical       critical
  sy-atomic         atomic
  sy-locks          락
  sy-barrier        barrier
  sy-false-sharing  거짓 공유
other-worksharing 그 밖의 일 나누기
  ow-sections       sections
  ow-single         single과 masked
  ow-scope          scope
tasks             태스크
  tk-task           task
  tk-wait           taskwait와 taskgroup
  tk-data           태스크의 데이터
  tk-recursive      재귀 문제
  tk-cutoff         자르는 깊이
  tk-taskloop       taskloop
  tk-depend         의존 관계
  tk-priority       우선순위와 final
simd              SIMD
  sm-simd           simd 지시문
  sm-clauses        safelen, aligned, reduction
  sm-declare        declare simd
  sm-forsimd        for simd
  sm-report         벡터화됐는지 확인
affinity          배치
  af-places         OMP_PLACES
  af-bind           proc_bind
  af-numa           NUMA와 첫 접촉
  af-biglittle      큰 코어와 작은 코어
target            가속기로 넘기기
  tg-target         target
  tg-map            map
  tg-teams          teams와 distribute
  tg-data           데이터 영역
  tg-compilers      컴파일러 지원
  tg-limits         한계
runtime           런타임
  rt-functions      런타임 함수
  rt-env            환경 변수
  rt-icv            내부 제어 변수
  rt-time           시간 재기
  rt-cancel         취소
memory            메모리
  mm-allocators     할당자
  mm-stack          스택 크기
correctness       올바름
  cr-tsan           경쟁 찾기
  cr-determinism    결과가 매번 같은가
  cr-deadlock       교착 상태
  cr-exceptions     C++ 예외
performance       성능
  pf-amdahl         암달의 법칙
  pf-measure        스케일링 재기
  pf-overhead       오버헤드
  pf-granularity    일의 굵기
  pf-memory-bound   메모리 대역폭의 벽
  pf-tools          도구
cases             사례
  cs-pi             원주율 적분
  cs-matmul         행렬 곱
  cs-image          이미지 필터
  cs-montecarlo     몬테카를로와 난수
  cs-stencil        스텐실
  cs-sort           병렬 정렬
  cs-histogram      히스토그램
interop           다른 것과 함께
  io-pthreads       pthreads와 섞기
  io-mpi            MPI와 섞기
  io-blas           병렬 라이브러리 안에서
languages         C++과 포트란에서
versions          버전별 기능
  vr-3              3.x
  vr-4              4.0과 4.5
  vr-5              5.0에서 5.2
  vr-6              6.0
  vr-support        컴파일러별 지원
`);

export const mpi = book('mpi', 'MPI', 'Open MPI로 메시지를 주고받아 여러 대를 한 대처럼', 'parallel', `
model             분산 메모리와 메시지
  md-distributed    메모리를 나누지 않는다는 것
  md-spmd           같은 프로그램 여러 벌
  md-standard       표준과 구현: Open MPI, MPICH
  md-when           어울리는 문제
setup             준비
  st-install        Open MPI 설치
  st-mpicc          mpicc
  st-mpirun         mpirun
  st-first          첫 프로그램: 랭크와 크기
  st-oversubscribe  코어보다 많이 띄우기
basics            뼈대
  bc-init           Init과 Finalize
  bc-comm-world     COMM_WORLD
  bc-errors         오류 처리
  bc-time           Wtime
p2p               점대점 통신
  pp-send-recv      Send와 Recv
  pp-envelope       봉투: 원천, 태그, 커뮤니케이터
  pp-status         Status와 Get_count
  pp-any            ANY_SOURCE와 ANY_TAG
  pp-probe          Probe
  pp-sendrecv       Sendrecv
modes             블로킹의 속뜻
  mo-eager          eager와 rendezvous
  mo-deadlock       교착 상태
  mo-modes          보내기 모드 넷
  mo-order          순서 보장
nonblocking       논블로킹 통신
  nb-isend          Isend와 Irecv
  nb-wait           Wait 계열
  nb-test           Test 계열
  nb-request        요청 객체
  nb-overlap        계산과 겹치기
  nb-cancel         취소
datatypes         데이터 타입
  dt-basic          기본 타입
  dt-contiguous     contiguous와 vector
  dt-indexed        indexed
  dt-struct         구조체
  dt-commit         commit과 free
  dt-pack           Pack과 Unpack
  dt-large          큰 개수
collective        집합 통신
  cl-bcast          Bcast
  cl-scatter        Scatter와 Gather
  cl-v              개수가 다를 때
  cl-reduce         Reduce와 Allreduce
  cl-op             연산 직접 정의
  cl-scan           Scan
  cl-barrier        Barrier
  cl-nonblocking    논블로킹 집합
communicators     커뮤니케이터
  cm-dup            복제
  cm-split          나누기
  cm-group          그룹
  cm-inter          인터커뮤니케이터
  cm-attr           속성
topology          토폴로지
  tp-cart           직교 격자
  tp-shift          이웃 찾기
  tp-graph          그래프
  tp-neighbor       이웃 집합 통신
decomposition     영역 분할
  dc-1d             1차원 분할
  dc-2d             2차원 분할
  dc-ghost          고스트 셀
  dc-balance        부하 균형
patterns          패턴
  pt-master         마스터와 워커
  pt-pipeline       파이프라인
  pt-ring           고리
  pt-farm           작업 나눠 주기
io                MPI-IO
  io-open           파일 열기
  io-view           파일 뷰
  io-collective     집합 입출력
  io-hdf5           HDF5
rma               원격 메모리 접근
  rm-window         윈도우
  rm-put-get        Put과 Get
  rm-sync           동기화 방식
  rm-shared         공유 메모리 윈도우
threads           스레드와 함께
  th-levels         스레드 지원 수준
  th-hybrid         MPI와 OpenMP
  th-pitfalls       함정
dynamic           프로세스 만들기
  dy-spawn          Spawn
  dy-connect        연결하기
  dy-sessions       세션
cluster           클러스터
  cu-pi             라즈베리파이 여러 대 묶기
  cu-ssh            SSH 키
  cu-hostfile       호스트 파일
  cu-nfs            공유 폴더
  cu-binding        매핑과 바인딩
  cu-network        이더넷이라는 병목
  cu-slurm          Slurm
  cu-container      컨테이너
openmpi           Open MPI 속
  om-layers         구성 요소 구조
  om-mca            MCA 파라미터
  om-transports     전송 계층
  om-info           ompi_info
performance       성능
  pf-scaling        강한 스케일링과 약한 스케일링
  pf-model          통신 비용 모형
  pf-profile        프로파일링
  pf-tuning         튜닝
debugging         디버깅
  db-printf         출력 섞임
  db-attach         디버거 붙이기
  db-deadlock       교착 찾기
  db-tools          도구
fault             장애
  ft-default        하나가 죽으면 다 죽는다
  ft-checkpoint     체크포인트
  ft-ulfm           ULFM
cases             사례
  cs-pi             원주율
  cs-matvec         행렬과 벡터 곱
  cs-heat           열 방정식
  cs-sort           병렬 정렬
  cs-nbody          N체
  cs-mandelbrot     망델브로
languages         다른 언어에서
  lg-cpp            C++
  lg-python         mpi4py
versions          버전별 기능
  vr-1-2            MPI-1과 MPI-2
  vr-3              MPI-3
  vr-4              MPI-4
  vr-5              MPI-5와 ABI
  vr-openmpi        Open MPI 버전
`);
