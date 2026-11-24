/**
 * 소형 기기 서가 (1) 기초: 라이브러리 하나가 아니라 "기기를 다루는 법"을 다루는 여섯 권.
 * 라즈베리파이 5·4·Zero 2 W 급(ARM 코어 몇 개, 램 수백 MB~수 GB, 리눅스가 도는 보드)을 기준으로 한다.
 */
import { book } from '../outline';

export const sbcStart = book('sbc-start', '라즈베리파이 시작하기', '보드를 고르고, OS를 올리고, 모니터 없이 다루기까지', 'sbc', `
boards            보드 고르기
  brd-family        라즈베리파이의 갈래: 5, 4, Zero 2 W, CM, Pico
  brd-specs         사양 읽는 법: SoC, 램, 저장 장치, 전력
  brd-others        비슷한 급의 다른 보드들
  brd-limits        PC와 무엇이 다른가
parts             준비물
  prt-power         전원: 5V 5A와 USB-PD
  prt-storage       microSD와 NVMe
  prt-cooling       방열판과 팬
  prt-cables        케이블, 케이스, USB-시리얼 어댑터
os-install        OS 올리기
  os-imager         Raspberry Pi Imager
  os-choices        Raspberry Pi OS, 우분투, 그 밖의 배포판
  os-headless       모니터 없이 설정하기: Wi-Fi, SSH, 사용자
  os-first-boot     첫 부팅과 갱신
remote            원격으로 다루기
  rem-ssh           SSH와 키 인증
  rem-files         파일 옮기기: scp, rsync, sshfs
  rem-editor        원격 편집: VS Code Remote와 CLion
  rem-serial        시리얼 콘솔
  rem-desktop       화면이 필요할 때: VNC와 Wayland 원격
config            보드 설정
  cfg-raspi-config  raspi-config
  cfg-config-txt    config.txt와 cmdline.txt
  cfg-overlays      dtoverlay로 기능 켜기
  cfg-eeprom        부트로더 EEPROM과 부팅 순서
header            40핀 헤더
  hdr-pinout        핀 배치와 번호 붙이는 세 가지 방식
  hdr-voltage       3.3V 논리와 전류 한계
  hdr-functions     핀의 대체 기능: I2C, SPI, UART, PWM
  hdr-rp1           라즈베리파이 5의 RP1
  hdr-hats          HAT과 확장 보드
peripherals       그 밖의 단자
  per-csi-dsi       카메라와 디스플레이 단자
  per-usb           USB와 전력 예산
  per-pcie          PCIe 단자
  per-network       이더넷, Wi-Fi, 블루투스
care              탈 없이 쓰기
  care-shutdown     전원을 뽑기 전에
  care-sd           SD카드가 망가지는 이유
  care-thermal      온도와 스로틀링 확인하기
  care-backup       이미지 통째로 백업하기
  care-troubleshoot 부팅이 안 될 때: LED 신호와 진단
first-project     첫 프로젝트: LED 하나 켜기까지
`);

export const sbcLinux = book('sbc-linux', '임베디드 리눅스 시스템', '켜지는 순간부터 내 프로그램이 서비스로 돌기까지', 'sbc', `
boot              부팅 과정
  boot-chain        전원에서 로그인까지의 사슬
  boot-firmware     라즈베리파이의 펌웨어와 부트로더
  boot-kernel       커널과 initramfs
  boot-uboot        U-Boot를 쓰는 보드들
  boot-time         부팅 시간 재고 줄이기
device-tree       디바이스 트리
  dt-why            왜 필요한가: ARM에는 자동 탐색이 없다
  dt-syntax         dts 읽는 법
  dt-overlay        오버레이
  dt-write          오버레이 직접 쓰기
  dt-debug          /proc/device-tree로 확인하기
devices           커널이 장치를 내놓는 방식
  dev-nodes         /dev의 장치 파일
  dev-sysfs         sysfs
  dev-procfs        procfs
  dev-udev          udev 규칙
  dev-modules       커널 모듈 싣고 내리기
systemd           systemd
  sd-units          유닛과 의존 관계
  sd-service        내 프로그램을 서비스로 만들기
  sd-restart        죽으면 다시 띄우기
  sd-timers         타이머
  sd-journal        journald로 로그 보기
  sd-sandbox        서비스 가두기: 권한 줄이는 옵션들
storage           저장 장치
  sto-partitions    파티션과 파일 시스템
  sto-wear          플래시의 수명과 쓰기 줄이기
  sto-readonly      읽기 전용 루트와 overlayfs
  sto-tmpfs         tmpfs와 zram
  sto-power-loss    갑자기 꺼져도 안 깨지게
network           네트워크 설정
  net-manager       NetworkManager와 nmcli
  net-wifi          Wi-Fi 연결과 AP 모드
  net-static        고정 주소와 mDNS
  net-time          시간 맞추기: NTP와 RTC
resources         한정된 자원
  res-memory        메모리: 얼마나 쓰고 있나
  res-oom           메모리가 바닥날 때
  res-cpu           CPU 주파수와 거버너
  res-thermal       열과 스로틀링
  res-power         전력 재기와 줄이기
  res-cgroups       cgroup으로 몫 나누기
reliability       오래 켜 두기
  rel-watchdog      하드웨어 워치독
  rel-logs          로그가 디스크를 채우지 않게
  rel-monitor       상태 지켜보기
  rel-recovery      원격으로 되살리기
users             사용자와 권한
  usr-groups        gpio, i2c, spi, video 그룹
  usr-sudo          sudo 없이 장치 쓰기
  usr-capabilities  capabilities
containers        컨테이너
  ctr-docker        Docker와 Podman
  ctr-devices       컨테이너에 장치 넘기기
  ctr-arm           ARM 이미지와 멀티 아키텍처
`);

export const sbcCross = book('sbc-cross', '교차 컴파일과 배포', 'PC에서 빌드해 보드에 올리고, 여러 대를 굴리기', 'sbc', `
why               보드에서 빌드할까, PC에서 빌드할까
toolchain         교차 툴체인
  tc-triplet        타깃 트리플 읽기
  tc-install        aarch64-linux-gnu-gcc 설치
  tc-clang          Clang으로 교차 컴파일
  tc-abi            armhf와 arm64, glibc 버전
sysroot           sysroot
  sr-what           헤더와 라이브러리를 어디서 가져오나
  sr-copy           보드에서 복사해 오기
  sr-multiarch      데비안 멀티아치
  sr-pkgconfig      pkg-config가 PC의 것을 찾지 않게
cmake             CMake 툴체인 파일
  cm-toolchain      툴체인 파일 쓰기
  cm-find           find_package가 엉뚱한 것을 찾을 때
  cm-presets        프리셋으로 PC용과 보드용 나누기
  cm-install        install 규칙
emulation         보드 없이 돌려 보기
  emu-user          qemu-user와 binfmt
  emu-system        qemu-system으로 보드 흉내
  emu-docker        buildx로 ARM 컨테이너 빌드
debug             원격 디버깅
  dbg-gdbserver     gdbserver
  dbg-ide           IDE에서 붙기
  dbg-core          코어 덤프 가져와 보기
  dbg-symbols       디버그 심볼 따로 두기
deploy            보드에 올리기
  dep-rsync         rsync와 스크립트
  dep-deb           .deb 패키지 만들기
  dep-repo          나만의 apt 저장소
  dep-container     컨테이너 이미지로 내보내기
image             이미지 만들기
  img-golden        잘 만든 카드 복제하기
  img-pigen         pi-gen
  img-buildroot     Buildroot
  img-yocto         Yocto
  img-compare       무엇을 고를까
ci                자동 빌드
  ci-actions        GitHub Actions에서 ARM 빌드
  ci-cache          ccache와 sccache
  ci-test           보드에서 자동으로 시험하기
fleet             여러 대 관리하기
  flt-identity      장치마다 다른 것: 이름, 키, 설정
  flt-provision     처음 굽는 절차
  flt-ansible       Ansible
  flt-inventory     무엇이 어디서 돌고 있나
`);

export const sbcSecurity = book('sbc-security', '장치 보안과 업데이트', '현장에 나간 장치를 지키고 고쳐 주기', 'sbc', `
threats           무엇으로부터 지키나
  thr-model         위협 모델 세우기
  thr-cases         실제로 뚫린 장치들
  thr-physical      손에 쥘 수 있는 장치라는 것
accounts          계정과 접속
  acc-defaults      기본 계정과 암호 없애기
  acc-ssh           SSH 굳히기
  acc-services      안 쓰는 서비스 끄기
  acc-firewall      nftables 방화벽
least-privilege   최소 권한
  lp-user           전용 사용자로 돌리기
  lp-systemd        systemd 샌드박스 옵션
  lp-seccomp        seccomp와 capabilities
secrets           비밀 보관
  sec-where         키와 암호를 어디에 두나
  sec-tpm           TPM과 보안 칩
  sec-otp           라즈베리파이의 OTP와 보안 부팅
  sec-disk          디스크 암호화
comms             통신 지키기
  com-tls           TLS와 인증서 확인
  com-mtls          장치 인증서와 상호 TLS
  com-vpn           WireGuard로 관리망 만들기
  com-rotate        인증서 갈아 끼우기
updates           업데이트
  upd-why           업데이트가 없으면 생기는 일
  upd-apt           패키지 단위 업데이트와 자동 갱신
  upd-ab            A/B 파티션과 되돌리기
  upd-tools         RAUC, SWUpdate, Mender
  upd-signing       업데이트에 서명하기
  upd-rollout       조금씩 내보내기
supply-chain      공급망
  sc-sbom           무엇이 들어 있는지 적어 두기: SBOM
  sc-cve            취약점 소식 따라가기
  sc-reproducible   다시 만들 수 있는 빌드
law               규정
  law-cra           유럽 CRA와 각국의 IoT 보안 기준
  law-disclosure    취약점 신고 받기
incident          뚫렸을 때
`);

export const sbcMeasure = book('sbc-measure', '측정값 다루기', '센서의 숫자를 단위가 있는 믿을 만한 값으로', 'sbc', `
units             단위
  un-si             SI 기본 단위와 유도 단위
  un-prefix         접두어와 2진 접두어
  un-bugs           단위를 틀려서 생긴 사고들
  un-naming         변수 이름에 단위 적기
typed-units       타입으로 단위 지키기
  tu-c              C에서: 구조체로 감싸기
  tu-fixed          고정소수점으로 단위 담기
  tu-cpp            C++에서: 단위 라이브러리
  tu-design         나만의 SI 단위 라이브러리 설계
raw               날것의 값
  raw-adc           ADC: 분해능, 기준 전압, 양자화
  raw-datasheet     데이터시트의 변환식 읽기
  raw-twos          레지스터 값 조립하기: 부호와 바이트 순서
  raw-sampling      샘플링 주기와 나이퀴스트
error             오차
  err-kinds         정확도, 정밀도, 분해능
  err-noise         잡음의 원인
  err-uncertainty   불확도 적는 법
  err-propagate     오차의 전파
calibration       보정
  cal-offset-gain   영점과 기울기
  cal-two-point     두 점 보정과 여러 점 보정
  cal-temp          온도에 따른 흔들림
  cal-store         보정값 보관하기
filters           걸러 내기
  flt-average       이동 평균과 중앙값
  flt-ema           지수 이동 평균
  flt-iir-fir       IIR과 FIR 맛보기
  flt-outlier       튀는 값 버리기
  flt-kalman        칼만 필터 맛보기
time              시간
  tm-stamp          언제 잰 값인가: 타임스탬프
  tm-clock          단조 시계와 벽시계
  tm-sync           여러 센서의 시간 맞추기
fusion            여러 센서 합치기
  fus-complement    상보 필터
  fus-imu           가속도계와 자이로로 자세 구하기
logging           기록과 전송
  log-format        값, 단위, 시각, 품질을 함께 적기
  log-downsample    줄여서 보관하기
  log-validate      이상한 값 알아채기
`);

export const sbcBaremetal = book('sbc-baremetal', '베어메탈 라즈베리파이', 'OS 없이 켜서 UART, 타이머, 화면까지', 'sbc', `
why               OS 없이 무엇을 배우나
toolbox           준비
  tb-toolchain      aarch64-none-elf 툴체인
  tb-qemu           QEMU의 raspi 보드
  tb-uart-cable     USB-시리얼로 보드와 말하기
  tb-docs           SoC 주변 장치 문서 읽기
boot              부팅
  bm-chain          GPU 펌웨어가 kernel8.img를 올리기까지
  bm-linker         링커 스크립트
  bm-start          첫 어셈블리: 스택과 BSS
  bm-cmain          C로 넘어가기
mmio              레지스터로 장치 만지기
  mm-map            주변 장치의 주소 지도
  mm-volatile       volatile과 읽고 쓰는 순서
  mm-gpio           GPIO 레지스터로 LED 켜기
uart              UART
  ua-mini           mini UART 초기화
  ua-pl011          PL011
  ua-printf         printf 만들기
exceptions        예외와 인터럽트
  ex-levels         예외 레벨: EL3에서 EL0까지
  ex-vectors        예외 벡터 표
  ex-gic            인터럽트 컨트롤러
  ex-timer          타이머 인터럽트
  ex-context        레지스터 저장과 복원
mailbox           메일박스와 화면
  mb-protocol       메일박스 프로토콜
  mb-framebuffer    프레임버퍼 얻기
  mb-draw           점, 선, 글자 그리기
memory            메모리
  me-alloc          가장 단순한 할당기
  me-mmu            MMU와 페이지 표
  me-cache          캐시 켜기
multicore         여러 코어
  mc-wake           잠든 코어 깨우기
  mc-spinlock       스핀락
scheduler         작은 스케줄러
  sch-task          태스크와 문맥 전환
  sch-preempt       타이머로 선점하기
  sch-syscall       시스템 콜 흉내
storage           SD카드
  sd-emmc           EMMC 컨트롤러
  sd-fat            FAT 읽기
pi5               라즈베리파이 5에서 달라지는 것
next              다음 걸음: 직접 만든 커널과 리눅스 사이
`);
