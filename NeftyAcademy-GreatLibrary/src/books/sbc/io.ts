/**
 * 소형 기기 서가 (3) 장치와 버스: 핀과 선으로 바깥 장치와 말하는 인터페이스들. API 하나에 책 한 권.
 * libgpiod, PWM, I2C(i2c-dev), SPI(spidev), 시리얼(termios), IIO, libusb.
 */
import { book } from '../outline';

export const libgpiod = book('libgpiod', 'libgpiod', '문자 장치로 GPIO를 켜고, 읽고, 기다리기', 'sbc', `
gpio              GPIO라는 것
  gp-what           핀 하나를 프로그램이 쥔다는 것
  gp-electrical     3.3V, 전류 한계, 보호 저항
  gp-pull           풀업과 풀다운
  gp-numbering      핀 번호: 헤더, BCM, 줄 오프셋
history           리눅스 GPIO의 세 시대
  hs-sysfs          sysfs 방식과 그것이 사라진 이유
  hs-chardev        문자 장치와 uAPI v2
  hs-devmem         /dev/mem으로 레지스터를 만지던 라이브러리들
  hs-pi5            라즈베리파이 5에서 깨진 것들
tools             명령줄 도구
  tl-detect         gpiodetect와 gpioinfo
  tl-set-get        gpioset과 gpioget
  tl-mon            gpiomon
  tl-pinctrl        pinctrl
setup             준비
  st-install        libgpiod 2.x 설치와 버전 확인
  st-build          컴파일과 링크
  st-permission     권한: gpio 그룹과 udev
chip              칩과 줄
  ch-open           칩 열기
  ch-info           줄 정보 읽기
  ch-names          줄 이름으로 찾기
request           줄 요청하기
  rq-objects        설정 객체 셋: line_settings, line_config, request_config
  rq-request        gpiod_chip_request_lines
  rq-consumer       소비자 이름
  rq-release        놓아주기
  rq-busy           이미 쓰이는 줄
output            출력
  out-led           LED 켜기
  out-active-low    액티브 로
  out-drive         푸시풀, 오픈 드레인, 오픈 소스
  out-multi         여러 줄 한꺼번에 쓰기
  out-relay         릴레이와 트랜지스터 몰기
input             입력
  in-read           값 읽기
  in-bias           바이어스 설정
  in-button         단추 읽기
edges             에지 이벤트
  ed-request        에지 감지 켜기
  ed-wait           기다리고 읽기
  ed-buffer         이벤트 버퍼
  ed-timestamp      타임스탬프와 시계 고르기
  ed-debounce       디바운스
  ed-poll           poll, epoll과 함께 쓰기
reconfigure       도중에 바꾸기
timing            타이밍의 한계
  tm-jitter         사용자 공간에서 얼마나 정확한가
  tm-softpwm        소프트웨어 PWM의 한계
  tm-bitbang        비트뱅잉
  tm-kernel         커널 드라이버에 맡길 것들
bindings          다른 언어
  bn-cpp            C++ 바인딩
  bn-python         파이썬 바인딩
  bn-others         gpiozero, lgpio, pigpio와 견주기
projects          만들어 보기
  pj-traffic        신호등
  pj-encoder        로터리 엔코더
  pj-ultrasonic     초음파 거리 센서
  pj-keypad         키패드 훑기
`);

export const pwm = book('pwm', 'PWM', '커널의 PWM 인터페이스로 밝기, 서보, 소리 다루기', 'sbc', `
concept           PWM이라는 신호
  pw-duty           주기와 듀티
  pw-uses           밝기, 속도, 각도, 소리
  pw-resolution     분해능과 주파수의 맞바꿈
hardware          라즈베리파이의 PWM
  hw-channels       하드웨어 PWM 채널과 핀
  hw-overlay        dtoverlay로 켜기
  hw-pi5            라즈베리파이 5의 RP1 PWM
  hw-audio          오디오와 겹치는 문제
sysfs             sysfs PWM 인터페이스
  sy-export         pwmchip과 export
  sy-period         period와 duty_cycle
  sy-enable         enable과 polarity
  sy-c              C에서 다루기
  sy-permission     권한과 udev
chardev           문자 장치 /dev/pwmchipN 과 libpwm
led               LED 밝기
  led-gamma         눈은 선형이 아니다: 감마 보정
  led-fade          부드럽게 바꾸기
  led-rgb           RGB LED
  led-class         커널의 LED 클래스와 pwm-leds
servo             서보 모터
  sv-signal         50Hz와 1~2ms
  sv-calibrate      끝점 맞추기
  sv-power          전원 따로 주기
  sv-jitter         떨림의 원인
motor             DC 모터
  mt-driver         모터 드라이버와 H 브리지
  mt-frequency      주파수 고르기
  mt-direction      방향과 제동
sound             소리 내기
  sn-buzzer         수동 부저와 음계
  sn-melody         멜로디 연주
fan               팬 제어
  fn-pwm-fan        4선 팬
  fn-tach           회전수 읽기
  fn-thermal        커널의 열 관리에 맡기기
expander          채널이 모자랄 때
  ex-pca9685        PCA9685
  ex-soft           소프트웨어 PWM을 써도 되는 경우
measure           재서 확인하기
  me-scope          오실로스코프로 보기
  me-logic          로직 분석기
`);

export const i2cDev = book('i2c-dev', 'I2C', 'i2c-dev로 센서의 레지스터를 읽고 쓰기', 'sbc', `
bus               I2C 버스
  bs-wires          두 줄: SDA와 SCL
  bs-open-drain     오픈 드레인과 풀업 저항
  bs-frame          시작, 주소, ACK, 정지
  bs-address        7비트 주소와 충돌
  bs-speed          속도 등급
  bs-stretch        클럭 스트레칭
pi                라즈베리파이의 I2C
  pi-enable         켜기와 버스 번호
  pi-pins           핀과 내장 풀업
  pi-extra          버스 더 만들기: 오버레이와 i2c-gpio
  pi-baudrate       속도 바꾸기
tools             i2c-tools
  tl-detect         i2cdetect
  tl-get-set        i2cget과 i2cset
  tl-dump           i2cdump
  tl-transfer       i2ctransfer
  tl-caution        함부로 훑으면 안 되는 이유
api               i2c-dev 인터페이스
  ap-open           /dev/i2c-N 열기
  ap-slave          I2C_SLAVE와 read, write
  ap-rdwr           I2C_RDWR: 반복 시작을 낀 전송
  ap-funcs          I2C_FUNCS로 기능 묻기
  ap-errors         오류 값 읽기
smbus             SMBus
  sm-what           I2C와 SMBus의 관계
  sm-ioctl          I2C_SMBUS ioctl
  sm-libi2c         libi2c의 도우미 함수
  sm-pec            PEC
registers         레지스터 다루기
  rg-map            데이터시트의 레지스터 표
  rg-read           레지스터 읽기 패턴
  rg-multi          여러 바이트와 자동 증가
  rg-endian         바이트 순서 맞추기
  rg-bits           비트 필드 고치기
sensor            센서 하나 끝까지: BME280
  sn-id             칩 ID 확인
  sn-config         설정 레지스터
  sn-calib          보정 계수 읽기
  sn-compensate     보상식 계산
  sn-loop           주기적으로 재기
devices           그 밖의 장치들
  dv-eeprom         EEPROM
  dv-rtc            RTC
  dv-oled           OLED 화면
  dv-adc            ADC: ADS1115
  dv-expander       GPIO 확장기
  dv-mux            주소가 겹칠 때: 멀티플렉서
kernel-drivers    커널 드라이버가 있는 장치
  kd-bind           사용자 공간 대신 드라이버에 맡기기
  kd-new-device     new_device로 붙여 보기
  kd-busy           Device or resource busy
trouble           안 될 때
  tr-nack           응답이 없다
  tr-pullup         풀업과 배선 길이
  tr-level          3.3V와 5V 섞기
  tr-stuck          버스가 붙들렸을 때
  tr-analyzer       로직 분석기로 보기
design            드라이버 코드 설계
  ds-layer          버스 층과 장치 층 나누기
  ds-test           하드웨어 없이 시험하기
i3c               I3C 맛보기
`);

export const spidev = book('spidev', 'SPI', 'spidev로 빠른 장치와 주고받기', 'sbc', `
bus               SPI 버스
  bs-wires          네 줄: SCLK, MOSI, MISO, CS
  bs-duplex         보내면서 동시에 받는다
  bs-modes          모드 0~3: 극성과 위상
  bs-cs             칩 선택
  bs-compare        I2C와 견주기
pi                라즈베리파이의 SPI
  pi-enable         켜기와 장치 이름
  pi-pins           핀과 CS 줄
  pi-aux            SPI 버스 더 쓰기
  pi-speed          낼 수 있는 속도
api               spidev 인터페이스
  ap-open           /dev/spidevB.C 열기
  ap-mode           모드, 비트 수, 속도 설정
  ap-rw             read와 write
  ap-message        SPI_IOC_MESSAGE
  ap-multi          전송 여러 개를 한 묶음으로
  ap-cs-change      cs_change와 지연
patterns          전송 패턴
  pt-command        명령 바이트와 응답
  pt-dummy          더미 바이트
  pt-register       레지스터 읽고 쓰기 규칙
  pt-burst          연속 읽기
adc               ADC 읽기: MCP3008
  ad-protocol       데이터시트의 타이밍도 읽기
  ad-read           채널 값 읽기
  ad-volt           전압으로 바꾸기
  ad-rate           샘플링 속도
display           화면 몰기: ST7789
  dp-dc             데이터와 명령 구분 줄
  dp-init           초기화 순서
  dp-pixels         픽셀 보내기
  dp-speed          한 프레임에 걸리는 시간
  dp-kernel         커널의 패널 드라이버에 맡기기
devices           그 밖의 장치들
  dv-flash          플래시 메모리
  dv-sdcard         SD카드
  dv-imu            IMU
  dv-radio          무선 모듈
  dv-shift          시프트 레지스터
leds              주소 지정 LED를 SPI로
  ld-ws2812         WS2812의 타이밍을 SPI로 흉내 내기
  ld-apa102         APA102
performance       성능
  pf-overhead       호출 한 번의 값
  pf-buffer         버퍼 크기 한도
  pf-dma            DMA
  pf-realtime       주기 지키기
trouble           안 될 때
  tr-mode           모드가 틀렸을 때의 증상
  tr-wiring         배선과 길이
  tr-loopback       루프백 시험
  tr-analyzer       로직 분석기로 보기
kernel-drivers    커널 드라이버와의 관계
`);

export const termios = book('termios', '시리얼 통신', 'termios로 UART를 날것으로 다루기', 'sbc', `
uart              UART
  ua-frame          시작 비트, 데이터, 패리티, 정지 비트
  ua-baud           보레이트와 오차
  ua-levels         TTL, RS-232, RS-485
  ua-flow           흐름 제어
pi                라즈베리파이의 UART
  pi-which          PL011과 mini UART
  pi-names          serial0, ttyAMA0, ttyS0
  pi-console        시리얼 콘솔 끄기
  pi-more           UART 더 켜기
  pi-usb            USB-시리얼 어댑터
tty               tty라는 층
  ty-history        텔레타이프에서 온 것들
  ty-discipline     줄 규율: 캐노니컬 모드
  ty-surprises      날것으로 쓰려면 꺼야 하는 것들
tools             도구
  tl-stty           stty
  tl-term           minicom, picocom, screen
  tl-loopback       루프백 시험
termios           termios 설정
  tm-open           open과 O_NOCTTY
  tm-getset         tcgetattr와 tcsetattr
  tm-raw            cfmakeraw
  tm-speed          속도 정하기
  tm-flags          c_cflag, c_iflag, c_oflag, c_lflag
  tm-custom         표준에 없는 속도: termios2
read              읽기
  rd-vmin-vtime     VMIN과 VTIME
  rd-partial        조각나서 들어온다
  rd-poll           poll로 기다리기
  rd-timeout        시간제한
write             쓰기
  wr-drain          tcdrain과 tcflush
  wr-buffer         버퍼가 찼을 때
framing           메시지 경계 만들기
  fr-line           줄 단위
  fr-length         길이 접두
  fr-cobs           SLIP과 COBS
  fr-checksum       체크섬과 CRC
  fr-state          상태 기계로 파싱하기
protocol          프로토콜 설계
  pr-binary-text    글자냐 이진이냐
  pr-request        요청과 응답, 재시도
  pr-version        버전과 호환
devices           장치들
  dv-gps            GPS: NMEA 읽기
  dv-modem          AT 명령
  dv-mcu            마이크로컨트롤러와 말하기
  dv-modbus         Modbus RTU
rs485             RS-485
  rs-half           반이중과 방향 전환
  rs-kernel         커널의 RS-485 지원
modem-lines       제어선
  ml-dtr-rts        DTR과 RTS 움직이기
  ml-reset          보드 리셋에 쓰기
trouble           안 될 때
  tr-garbage        깨진 글자
  tr-nothing        아무것도 안 온다
  tr-permission     권한과 dialout 그룹
  tr-names          장치 이름 고정하기
`);

export const iio = book('iio', 'IIO', '커널의 센서 틀로 ADC와 센서 읽기', 'sbc', `
why               왜 IIO인가
  wy-userspace      사용자 공간 드라이버와 커널 드라이버
  wy-subsystems     IIO, hwmon, input의 영역
  wy-supported      지원되는 센서 찾기
attach            센서 붙이기
  at-overlay        오버레이로 선언하기
  at-check          붙었는지 확인하기
  at-new-device     실험용으로 잠깐 붙이기
sysfs             sysfs로 읽기
  sy-tree           iio:deviceN의 구조
  sy-raw            raw, scale, offset
  sy-units          IIO가 쓰는 단위
  sy-attrs          샘플링 주파수와 그 밖의 속성
  sy-c              C에서 읽기
buffer            버퍼와 트리거
  bf-why            한 번씩 읽기의 한계
  bf-scan           스캔 요소
  bf-trigger        트리거
  bf-read           문자 장치에서 읽기
  bf-format         샘플의 배치 해석하기
libiio            libiio
  li-context        컨텍스트
  li-channels       장치와 채널
  li-buffer         버퍼로 받기
  li-network        네트워크 너머의 장치
  li-tools          iio_info와 iio_readdev
events            이벤트
  ev-threshold      임계값 이벤트
  ev-read           이벤트 읽기
adc               ADC
  ad-chips          MCP3008, MCP3208, ADS1115
  ad-reference      기준 전압
  ad-rate           얼마나 빨리 읽을 수 있나
imu               관성 센서
  im-axes           축과 마운트 행렬
  im-rate           출력 속도와 필터
  im-fifo           하드웨어 FIFO
environment       환경 센서
  en-temp           온도, 습도, 기압
  en-light          조도와 근접
  en-gas            가스와 공기질
hwmon             hwmon
  hm-sysfs          hwmon의 sysfs
  hm-soc            SoC 온도와 전압
  hm-sensors        lm-sensors
output            출력 장치: DAC
write-driver      드라이버가 없을 때
`);

export const libusb = book('libusb', 'libusb', 'USB 장치와 직접 주고받기', 'sbc', `
usb               USB의 구조
  us-topology       호스트, 허브, 장치
  us-speeds         속도와 커넥터
  us-descriptors    디스크립터: 장치, 구성, 인터페이스, 엔드포인트
  us-transfers      네 가지 전송
  us-classes        장치 클래스
  us-enumeration    꽂았을 때 일어나는 일
tools             도구
  tl-lsusb          lsusb 읽기
  tl-usbmon         usbmon과 Wireshark
  tl-udevadm        udevadm
setup             준비
  st-install        libusb-1.0 설치와 링크
  st-permission     권한: udev 규칙
  st-kernel-driver  이미 붙은 커널 드라이버 떼기
basics            열고 닫기
  bc-init           컨텍스트
  bc-list           장치 훑기
  bc-open           열기
  bc-claim          인터페이스 차지하기
  bc-strings        문자열 디스크립터 읽기
control           제어 전송
  ct-setup          셋업 패킷
  ct-standard       표준 요청
  ct-vendor         벤더 요청
bulk              벌크 전송
  bk-rw             읽고 쓰기
  bk-short          짧은 패킷과 ZLP
  bk-timeout        시간제한과 되살리기
interrupt         인터럽트 전송
async             비동기 API
  as-transfer       전송 객체
  as-submit         내보내고 콜백 받기
  as-events         이벤트 처리 루프
  as-cancel         취소
  as-poll           내 이벤트 루프에 끼워 넣기
iso               등시성 전송
hotplug           꽂고 뽑기
hid               HID
  hd-report         리포트 디스크립터
  hd-hidraw         hidraw
  hd-hidapi         hidapi
serial            USB 시리얼
  sr-cdc            CDC ACM
  sr-vendor         FTDI, CP210x, CH340
gadget            보드가 장치 쪽이 되기
  gd-otg            장치 모드가 되는 단자
  gd-configfs       configfs로 가젯 만들기
  gd-functionfs     FunctionFS
  gd-composite      여러 기능을 한 장치로
firmware          내 장치 만들기
  fw-pico           Pico로 USB 장치 만들기
  fw-ids            VID와 PID
power             전력
  pw-budget         단자의 전력 예산
  pw-suspend        자동 절전
trouble           안 될 때
portability       윈도우와 맥에서
`);
