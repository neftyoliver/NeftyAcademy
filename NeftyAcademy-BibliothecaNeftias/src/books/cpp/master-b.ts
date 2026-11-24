/**
 * C++ 최고급 서가 (2): 계산, 시스템, 플랫폼에 따른 책들.
 * OpenMP와 Open MPI, 병렬 처리, 가상화, 컴파일러별 방언, 임베디드, 리눅스, macOS, 비주얼 C++, 안드로이드, 임베디드 생태계.
 */
import { book } from '../outline';

export const cppOpenmpMpi = book('cpp-openmp-mpi', 'OpenMP와 Open MPI', '한 대의 여러 코어, 여러 대의 클러스터', 'cpp', `
overview          공유 메모리와 분산 메모리
omp-basics        OpenMP 기초
  omp-parallel      parallel 영역
  omp-for           for와 스케줄
  omp-sharing       데이터 공유 절
  omp-reduction     reduction
omp-sync          OpenMP의 동기화
  omp-critical      critical과 atomic
  omp-locks         락
  omp-false-sharing 거짓 공유
omp-tasks         태스크
  omp-task          task와 taskwait
  omp-taskloop      taskloop
  omp-depend        태스크 의존
omp-simd          SIMD와 오프로딩
  omp-simd-pragma   simd 지시문
  omp-target        GPU로 넘기기
omp-tuning        OpenMP 튜닝
  omp-affinity      스레드 친화도
  omp-numa          NUMA
  omp-nested        중첩 병렬
mpi-basics        MPI 기초
  mpi-init          초기화와 랭크
  mpi-p2p           점대점 송수신
  mpi-nonblocking   논블로킹 통신
  mpi-datatypes     데이터 타입
mpi-collective    집합 통신
  mpi-bcast         broadcast, scatter, gather
  mpi-reduce        reduce
mpi-topology      커뮤니케이터와 토폴로지
  mpi-comm          커뮤니케이터 나누기
  mpi-decomp        영역 분할
  mpi-ghost         고스트 셀 교환
mpi-io            병렬 입출력과 원격 메모리 접근
hybrid            MPI와 OpenMP 함께 쓰기
cluster           클러스터에서 돌리기
  clu-openmpi       Open MPI 설치와 mpirun
  clu-slurm         작업 스케줄러
  clu-interconnect  인터커넥트
performance       성능 분석
  hperf-scaling     강한 스케일링과 약한 스케일링
  hperf-laws        암달과 구스타프슨
  hperf-profilers   프로파일러
debugging         디버깅
  hdbg-races        경쟁 찾기
  hdbg-deadlock     교착 상태
  hdbg-repro        재현성
`);

export const cppParallel = book('cpp-parallel', '병렬 처리', '패턴, 동시 자료 구조, SIMD, GPU', 'cpp', `
foundations       기초
  par-vs            동시성과 병렬성
  par-hardware      코어, 캐시, NUMA
  par-laws          속도 향상의 법칙
  par-decompose     문제를 나누는 방식
patterns          병렬 패턴
  pat-map-reduce    맵과 리듀스
  pat-divide        분할 정복
  pat-pipeline      파이프라인
  pat-stencil       스텐실
  pat-producer      생산자와 소비자
std-parallel      표준 병렬 알고리즘
  stdp-policies     실행 정책
  stdp-limits       한계
task-based        태스크 기반 병렬
  task-pool         스레드 풀과 작업 훔치기
  task-tbb          oneTBB
  task-graph        태스크 그래프
concurrent-ds     동시 자료 구조
  cds-queue         동시 큐
  cds-hashmap       동시 해시 맵
  cds-lockfree      락 없는 구조와 대기 없는 구조
  cds-reclaim       RCU와 해저드 포인터
simd              SIMD
  simd-auto         자동 벡터화
  simd-intrinsics   내장 함수
  simd-std          std::simd
  simd-soa          자료 배치: 구조체의 배열과 배열의 구조체
gpu               GPU 컴퓨팅
  gpu-cuda          CUDA
  gpu-sycl          SYCL
  gpu-opencl        OpenCL
  gpu-vulkan        벌칸 컴퓨트
memory            메모리와 병렬
  pmem-false        거짓 공유
  pmem-numa         NUMA 배치
  pmem-alloc        할당자 경합
correctness       올바름
  cor-hazards       경쟁, 교착, 기아
  cor-tsan          스레드 새니타이저
  cor-determinism   결정성
  cor-model         모델 검사
async-io          비동기 I/O와 병렬
  paio-uring        io_uring
  paio-scheduler    코루틴 스케줄러
distributed       분산으로 넓히기
  dist-message      메시지 전달
  dist-actor        액터
  dist-consistency  일관성 맛보기
cases             사례
  case-matrix       행렬 곱
  case-sort         병렬 정렬
  case-image        이미지 처리
  case-nbody        N체 시뮬레이션
`);

export const cppVirtualization = book('cpp-virtualization', '가상화 기술', '하이퍼바이저, 컨테이너, 에뮬레이터, 언어 VM', 'cpp', `
overview          가상화의 지도
  virt-hypervisors  하이퍼바이저의 두 종류
  virt-containers   컨테이너와의 차이
  virt-emulation    에뮬레이션과 반가상화
cpu               CPU 가상화
  vcpu-privilege    특권 수준과 트랩
  vcpu-vtx          VT-x와 AMD-V
  vcpu-exits        VM 종료 다루기
  vcpu-arm          ARM의 EL2
memory            메모리 가상화
  vmem-shadow       그림자 페이지 테이블
  vmem-ept          EPT와 NPT
  vmem-balloon      벌루닝과 페이지 공유
io                입출력 가상화
  vio-emulate       장치 에뮬레이션
  vio-virtio        virtio
  vio-passthrough   패스스루와 IOMMU
  vio-sriov         SR-IOV
kvm               KVM으로 작은 VMM 만들기
  kvm-api           /dev/kvm API
  kvm-memory        게스트 메모리
  kvm-vcpu          vCPU 루프
  kvm-serial        직렬 포트 에뮬레이션
  kvm-boot          리눅스 부팅하기
qemu              QEMU 들여다보기
  qemu-structure    구조
  qemu-device       장치 모델 쓰기
  qemu-tcg          TCG
containers        컨테이너
  cont-namespaces   네임스페이스
  cont-cgroups      cgroup
  cont-overlay      오버레이 파일 시스템
  cont-runtime      작은 컨테이너 런타임 만들기
  cont-seccomp      seccomp
emulator          에뮬레이터 만들기
  emu-interpreter   인터프리터
  emu-jit           동적 재컴파일
  emu-timing        타이밍
language-vm       언어 가상 머신
  lvm-bytecode      바이트코드 VM
  lvm-gc            가비지 컬렉션
  lvm-jit           JIT의 기초
  lvm-wasm          WebAssembly 런타임
cloud             클라우드의 가상화
  cld-microvm       마이크로 VM
  cld-migration     라이브 마이그레이션
  cld-nested        중첩 가상화
security          격리와 보안
  vsec-escape       탈출 취약점
  vsec-confidential 기밀 컴퓨팅
  vsec-sandbox      샌드박스
gpu               GPU와 가속기 가상화
`);

export const cppCompilers = book('cpp-compilers', '컴파일러별 방언과 기능', 'GCC, Clang, MSVC가 다른 곳', 'cpp', `
overview          세 컴파일러와 표준 준수
  cc-three          GCC, Clang, MSVC
  cc-others         그 밖의 컴파일러
  cc-support        표준 지원 표 읽기
  cc-feature-test   기능 검사 매크로
options           옵션 대응표
  opt-std           표준과 경고
  opt-optimize      최적화와 디버그 정보
  opt-linker        링커 옵션
extensions        언어 확장
  ext-gnu           GNU 확장
  ext-msvc          MSVC 확장
  ext-clang         Clang 고유 기능
attributes        속성과 내장 함수
  attr-standard     표준 속성
  attr-vendor       컴파일러별 속성
  attr-builtins     내장 함수와 인트린식
abi               ABI와 맹글링
  abi-itanium       Itanium ABI와 MSVC ABI
  abi-calling       호출 규약
  abi-exceptions    예외 처리 모델
  abi-stl           표준 라이브러리의 ABI
optimization      최적화의 차이
  copt-flags        최적화 플래그
  copt-lto          LTO
  copt-pgo          PGO
  copt-fastmath     빠른 수학
  copt-reports      벡터화 보고
diagnostics       진단과 정적 분석
  diag-warnings     경고 묶음
  diag-policy       경고를 오류로
  diag-analyzer     분석기
sanitizers        새니타이저와 계측
preprocessor      전처리기와 pragma
  pp-pragma         pragma once, pack, warning
  pp-has-include    __has_include
modules-pch       모듈과 미리 컴파일된 헤더
stdlib            표준 라이브러리 고르기
  lib-three         libstdc++, libc++, MSVC STL
  lib-mixing        섞어 쓸 때
cross             교차 컴파일과 툴체인
  cross-triple      타깃 트리플
  cross-sysroot     sysroot
  cross-clang-cl    clang-cl과 MinGW
portable          이식성 있는 코드 쓰기
  portc-macros      매크로로 감싸기
  portc-ci          CI 매트릭스
internals         컴파일러의 속
  int-stages        프런트엔드, IR, 백엔드
  int-libtooling    Clang 도구 만들기
  int-gcc-plugins   GCC 플러그인
`);

export const cppEmbedded = book('cpp-embedded', '임베디드 C++', '베어메탈에서 RTOS까지, 힙과 예외 없이', 'cpp', `
why               임베디드에서 C++
  why-constraints   메모리, 실시간, 전력의 제약
  why-zero-cost     비용 없는 추상화
  why-avoid         쓰지 않는 기능
toolchain         툴체인
  etc-cross         교차 컴파일러
  etc-linker        링커 스크립트
  etc-startup       시작 코드
  etc-flash         플래시와 디버거
baremetal         베어메탈 시작
  bm-reset          리셋에서 main까지
  bm-ctors          정적 생성자
  bm-vectors        인터럽트 벡터
  bm-newlib         C 라이브러리 스텁
registers         레지스터 다루기
  reg-mmio          메모리 맵 입출력
  reg-volatile      volatile
  reg-typesafe      타입 안전한 레지스터 접근
  reg-bitfields     비트 필드의 함정
no-heap           힙 없이 쓰기
  nh-static         정적 할당
  nh-containers     고정 용량 컨테이너
  nh-placement      placement new
  nh-pmr            pmr로 버퍼 지정하기
no-exceptions     예외와 RTTI 없이
  ne-flags          컴파일 옵션
  ne-errors         오류 처리
  ne-size           코드 크기
interrupts        인터럽트와 동시성
  isr-rules         ISR의 규칙
  isr-atomic        원자성
  isr-queue         락 없는 큐
  isr-critical      임계 구역
peripherals       주변 장치 드라이버
  per-gpio          GPIO
  per-uart          UART
  per-buses         I2C와 SPI
  per-timers        타이머와 PWM
  per-adc           ADC
  per-dma           DMA
compile-time      컴파일 시간 활용
  ect-tables        constexpr 표
  ect-hal           템플릿으로 만든 HAL
  ect-pins          핀 설정 검사
rtos              RTOS와 함께
  ertos-primitives  태스크, 큐, 세마포어
  ertos-wrap        C++로 감싸기
  ertos-inversion   우선순위 역전
low-power         저전력
testing           테스트
  etest-host        호스트에서 단위 테스트
  etest-hil         하드웨어 인 더 루프
  etest-misra       정적 분석과 MISRA
linux             임베디드 리눅스
  elin-userspace    사용자 공간에서 장치 접근
  elin-devicetree   디바이스 트리
  elin-build        Yocto와 Buildroot
bootloader        부트로더와 펌웨어 업데이트
`);

export const cppLinux = book('cpp-linux', '리눅스에서의 C++', '툴체인, ELF, 시스템 인터페이스, 배포', 'cpp', `
toolchain         툴체인
  ltc-compilers     GCC와 Clang의 설치와 버전
  ltc-linkers       링커 고르기
  ltc-dev-packages  개발 패키지와 pkg-config
build             빌드
  lb-make           Make
  lb-cmake          CMake와 Ninja
  lb-ccache         ccache
  lb-distros        배포판 사이의 차이
elf               ELF와 동적 링킹
  elf-shared        공유 라이브러리와 soname
  elf-visibility    심볼 가시성
  elf-loader        로더와 RPATH
  elf-dlopen        dlopen으로 플러그인
syscalls          시스템 인터페이스
  sys-posix         파일과 프로세스
  sys-signals       시그널
  sys-epoll         epoll
  sys-uring         io_uring
  sys-mmap          메모리 매핑
ipc               프로세스와 IPC
  ipc-fork          fork와 exec
  ipc-channels      파이프, 소켓, 공유 메모리
  ipc-dbus          D-Bus
threads           스레드와 스케줄링
  lthr-pthread      pthread와 std::thread
  lthr-futex        futex
  lthr-affinity     친화도와 우선순위
  lthr-cgroup       cgroup
debugging         디버깅
  ldbg-gdb          GDB와 LLDB
  ldbg-core         코어 덤프
  ldbg-strace       strace와 ltrace
  ldbg-rr           rr로 되감기
profiling         성능 도구
  lprof-perf        perf
  lprof-valgrind    valgrind
  lprof-ebpf        eBPF
  lprof-heap        힙 프로파일러
gui               GUI 스택
  lgui-display      X11과 Wayland
  lgui-toolkits     GTK와 Qt
  lgui-gl           벌칸과 OpenGL 문맥
services          서비스로 돌리기
  lsvc-systemd      systemd 유닛
  lsvc-journal      로그
packaging         패키징과 배포
  lpkg-deb-rpm      deb와 rpm
  lpkg-bundle       AppImage와 Flatpak
  lpkg-glibc        정적 링크와 glibc 호환
  lpkg-container    컨테이너
kernel            커널과 만나기
  lk-modules        커널 모듈과 C++
  lk-userspace      사용자 공간 드라이버
  lk-ioctl          sysfs와 ioctl
`);

export const cppMacos = book('cpp-macos', 'macOS에서의 C++', 'Apple Clang, Objective-C++, 서명과 공증', 'cpp', `
toolchain         툴체인
  mtc-xcode         Xcode와 명령줄 도구
  mtc-clang         Apple Clang과 libc++
  mtc-homebrew      Homebrew
  mtc-cmake         CMake와 Xcode 생성기
platform          플랫폼 기초
  mpl-macho         Mach-O와 dyld
  mpl-bundles       프레임워크와 번들
  mpl-universal     유니버설 바이너리
  mpl-target        배포 타깃
objcpp            Objective-C++
  ocpp-mm           .mm 파일
  ocpp-arc          객체 수명과 ARC
  ocpp-mixing       C++과 섞는 규칙
  ocpp-swift        Swift와 C++ 상호 운용
frameworks        시스템 프레임워크
  mfw-foundation    Foundation과 Core Foundation
  mfw-appkit        AppKit으로 창 만들기
  mfw-gcd           Grand Central Dispatch
  mfw-iokit         IOKit
graphics          그래픽
  mgfx-metal        Metal
  mgfx-moltenvk     MoltenVK
  mgfx-ca           Core Animation
system            시스템 인터페이스
  msys-bsd          BSD 층과 kqueue
  msys-xpc          XPC
  msys-sandbox      샌드박스와 권한
  msys-keychain     키체인
debugging         디버깅과 성능
  mdbg-lldb         LLDB
  mdbg-instruments  Instruments
  mdbg-crash        충돌 로그
distribution      배포
  mdist-signing     코드 서명
  mdist-notarize    공증
  mdist-package     dmg와 pkg
  mdist-update      자동 업데이트
apple-silicon     애플 실리콘
  as-abi            ARM64 ABI
  as-neon           NEON
  as-cores          성능 코어와 효율 코어
ios               iOS로 넓히기
`);

export const cppMsvc = book('cpp-msvc', '비주얼 C++', 'MSVC, Win32, COM, DLL, 윈도우 배포', 'cpp', `
toolchain         툴체인
  vtc-vs            Visual Studio와 빌드 도구
  vtc-cl            cl과 link
  vtc-msbuild       MSBuild와 CMake
  vtc-vcpkg         vcpkg
projects          프로젝트 설정
  vprj-config       구성과 플랫폼
  vprj-crt          런타임 라이브러리: /MD와 /MT
  vprj-pdb          PDB
  vprj-props        속성 시트
language          MSVC의 언어
  vlang-conformance 표준 준수 옵션
  vlang-declspec    __declspec
  vlang-seh         구조적 예외 처리
  vlang-modules     모듈과 헤더 유닛
win32             Win32 API
  w32-handles       핸들과 오류
  w32-unicode       유니코드와 UTF-16
  w32-windows       창과 메시지
  w32-files         파일과 레지스트리
  w32-threads       스레드와 동기화
com               COM과 WinRT
  com-basics        COM 기초
  com-ptr           ComPtr
  com-winrt         C++/WinRT
  com-winui         WinUI 3
dll               DLL
  dll-export        내보내기와 가져오기 라이브러리
  dll-boundary      DLL 경계의 규칙
  dll-delay         지연 로딩
  dll-manifest      매니페스트
legacy            MFC와 ATL
managed           C++/CLI와 .NET 상호 운용
directx           DirectX
  dx-d3d            Direct3D 11과 12
  dx-2d             Direct2D와 DirectWrite
  dx-hlsl           HLSL
debugging         디버깅
  vdb-debugger      Visual Studio 디버거
  vdb-windbg        WinDbg와 덤프
  vdb-etw           ETW와 WPA
  vdb-verifier      Application Verifier
performance       성능
  vperf-profiler    프로파일러
  vperf-pgo         PGO와 LTCG
deployment        배포
  vdep-redist       재배포 패키지
  vdep-installer    MSIX와 MSI
  vdep-signing      코드 서명
  vdep-service      윈도우 서비스
kernel            드라이버 맛보기
  vk-wdk            WDK
  vk-limits         커널 모드에서의 C++ 제약
clang-cl          clang-cl과 다른 툴체인
`);

export const cppAndroid = book('cpp-android', '안드로이드에서의 C++', 'NDK, JNI, 네이티브 그래픽과 오디오', 'cpp', `
overview          안드로이드와 네이티브 코드
  and-structure     앱의 구조
  and-art           ART와 JNI의 자리
  and-when          C++을 쓸 때와 쓰지 않을 때
ndk               NDK
  ndk-install       설치
  ndk-abi           툴체인과 ABI
  ndk-api-level     API 레벨
  ndk-stl           libc++ 고르기
  ndk-bionic        Bionic
build             빌드
  ab-gradle         Gradle과 CMake
  ab-prefab         prefab
  ab-aar            AAR에 네이티브 코드 넣기
jni               JNI
  jni-register      함수 이름과 등록
  jni-refs          타입과 참조
  jni-strings       문자열과 배열
  jni-exceptions    예외
  jni-threads       스레드 붙이기
  jni-performance   성능
lifecycle         수명 주기
  lc-activity       NativeActivity와 GameActivity
  lc-surface        표면과 입력
  lc-pause          일시 정지와 재개
graphics          그래픽
  agfx-gles         EGL과 OpenGL ES
  agfx-vulkan       벌칸
  agfx-pacing       프레임 페이싱
audio             오디오
platform          플랫폼 API
  ap-assets         에셋
  ap-sensors        센서와 카메라
  ap-log            로그
debugging         디버깅과 성능
  adbg-lldb         LLDB
  adbg-tombstone    충돌 덤프
  adbg-perfetto     Perfetto와 simpleperf
  adbg-hwasan       새니타이저
size              크기와 성능
  asz-apk           APK 크기 줄이기
  asz-lto           LTO
  asz-pages         16KB 페이지
cross-platform    크로스플랫폼 구조
  axp-core          공통 코어와 플랫폼 층
  axp-ios           iOS와 코드 나누기
  axp-ffi           Kotlin과 Flutter에서 부르기
release           출시
  arel-signing      서명
  arel-requirements 스토어 요구 사항
  arel-symbols      심볼 올리기
`);

export const cppEmbeddedEco = book('cpp-embedded-eco', 'C++의 임베디드 생태계', '칩, SDK, RTOS, 프레임워크, 표준의 지형도', 'cpp', `
map               지형도
  eco-mcu           마이크로컨트롤러 계열
  eco-mpu           리눅스가 도는 보드
vendors           제조사 SDK
  ven-stm32         STM32Cube
  ven-esp           ESP-IDF
  ven-nordic        nRF Connect SDK
  ven-pico          Pico SDK
  ven-arduino       Arduino 코어
rtos              RTOS
  eco-freertos      FreeRTOS
  eco-zephyr        Zephyr
  eco-others        ThreadX, NuttX, RT-Thread
  eco-choosing      고르는 기준
frameworks        C++ 프레임워크와 라이브러리
  fw-arduino        Arduino
  fw-hal            C++ HAL들
  fw-etl            Embedded Template Library
build             빌드와 패키지
  eb-cmake          CMake 툴체인 파일
  eb-platformio     PlatformIO
  eb-west           West
debug-tools       디버그 도구
  dt-probes         디버그 프로브
  dt-openocd        OpenOCD와 pyOCD
  dt-trace          SWO와 RTT
  dt-logic          로직 분석기
comms             통신 스택
  cm-ip             lwIP와 TLS
  cm-mqtt           MQTT
  cm-ble            블루투스 LE
  cm-lpwan          LoRaWAN
  cm-matter         Thread와 Matter
  cm-usb            USB
storage           저장
  est-fs            파일 시스템
  est-settings      설정 저장
  est-wear          웨어 레벨링
gui               임베디드 GUI
  egui-lvgl         LVGL
  egui-vendor       제조사 GUI 도구
  egui-qt           Qt for MCUs와 Slint
ml                엣지 AI
safety            표준과 인증
  std-misra         MISRA C++
  std-autosar       AUTOSAR C++
  std-functional    ISO 26262와 IEC 62304
ota               업데이트와 보안
  ota-mcuboot       MCUboot
  ota-secure        보안 부트
  ota-update        OTA
linux             임베디드 리눅스 생태계
  eeco-yocto        Yocto와 Buildroot
  eeco-realtime     실시간 패치
industries        분야별 지도
  ind-automotive    자동차
  ind-robotics      로봇
  ind-drones        드론
  ind-consumer      가전
`);
