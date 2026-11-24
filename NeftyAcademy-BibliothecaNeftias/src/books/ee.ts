/**
 * 전자공학 보강 세 권. 「전자공학 입문」 다음에 읽는다.
 *
 *   오실로스코프 읽기      화면의 칸, 트리거, 프로브, 장비의 한계, 파형으로 진단하기, 디지털 버스
 *   회로 시뮬레이터        어떤 프로그램이 있나, 넷리스트, 해석, 모델, ngspice, LTspice, KiCad
 *   아날로그에서 디지털로  아날로그 회로의 신호를 디지털 핀이 알아듣게: 전압 맞추기, 비교기, ADC, 전원 재기
 */
import { book } from './outline';

export const scope = book('scope', '오실로스코프 읽기', '화면의 칸에서 회로의 사정을 읽어 내기', 'ee', `
screen            화면 읽기
  sc-grid           칸, V/칸, 시간/칸
  sc-coupling       DC 결합, AC 결합, 접지 기준선
  sc-measure        Vpp, 평균, RMS, 주기, 듀티
  sc-cursors        커서와 자동 측정
trigger           트리거
  tr-edge           에지 트리거와 레벨
  tr-modes          자동, 일반, 단발
  tr-holdoff        홀드오프와 흐르는 화면 멈추기
  tr-pulse          펄스 폭 트리거로 드문 사건 잡기
probe             프로브
  pb-ground         접지 집게가 닿는 곳
  pb-x10            1배와 10배, 보정
  pb-loading        프로브가 회로를 바꾼다
  pb-points         어디에 대야 하나: 측정점 고르기
limits            장비의 한계
  lm-bandwidth      대역폭과 상승 시간
  lm-sampling       샘플링 속도와 에일리어싱
  lm-memory         기록 길이와 확대
  lm-resolution     세로 분해능과 잡음
shapes            파형으로 진단하기
  sh-rc             RC 충전 곡선과 시정수
  sh-ringing        링잉과 오버슈트
  sh-ripple         전원의 리플
  sh-bounce         단추의 떨림
  sh-pwm            PWM과 평균값
  sh-noise          잡음과 접지 루프
buses             디지털 신호 보기
  bs-levels         논리 레벨과 문턱
  bs-uart           UART 프레임 읽기
  bs-i2c            I2C: 시작, 주소, ACK
  bs-spi            SPI: 클럭과 데이터
  bs-logic          로직 분석기를 쓸 때
practice          장비 없이 연습하기
  pr-sim            시뮬레이터의 파형을 오실로스코프처럼 읽기
  pr-cheap          싼 장비들: 휴대용, USB, 사운드 카드
  pr-checklist      측정 전 점검표
`);

export const circuitSim = book('circuit-sim', '회로 시뮬레이터', '만들기 전에 컴퓨터에서 돌려 보기: ngspice, LTspice, KiCad', 'ee', `
landscape         어떤 프로그램이 있나
  ls-spice          SPICE라는 뿌리
  ls-programs       ngspice, LTspice, KiCad, Qucs-S, Falstad, Tinkercad
  ls-choose         무엇을 고를까
netlist           넷리스트
  nl-first          첫 넷리스트: 전압 분배기
  nl-elements       소자 줄: R, C, L, V, I
  nl-sources        신호원: DC, SIN, PULSE, PWL
  nl-units          접미사와 단위의 함정
analyses          해석
  an-op             동작점 (.op)
  an-dc             DC 훑기 (.dc)
  an-tran           과도 해석 (.tran)
  an-ac             주파수 훑기 (.ac)와 보드 선도
  an-param          값 바꿔 가며 돌리기
  an-meas           .meas로 숫자 뽑기
devices           반도체와 모델
  dv-diode          다이오드와 .model
  dv-bjt            트랜지스터 스위치
  dv-mosfet         MOSFET
  dv-opamp          연산 증폭기: 이상적 모델과 부품 모델
  dv-subckt         .subckt와 제조사 모델 가져오기
ngspice           ngspice 쓰기
  ng-run            배치 실행과 대화형
  ng-control        .control 블록
  ng-plot           파형을 파일로 내고 그리기
  ng-errors         수렴 실패와 흔한 오류
ltspice           LTspice 쓰기
  lt-schematic      회로도 그리기
  lt-run            해석 지시문과 파형 창
  lt-export         넷리스트와 파형 내보내기
kicad             KiCad에서 시뮬레이션하기
  kc-schematic      회로도와 시뮬레이션 모델 붙이기
  kc-run            시뮬레이터 창
  kc-to-pcb         시뮬레이션에서 기판으로
trust             시뮬레이션을 믿는 법
  ts-ideal          이상적인 부품이 숨기는 것
  ts-tolerance      부품 오차와 몬테카를로
  ts-compare        측정과 견주기
`);

export const analogDigital = book('analog-digital', '아날로그에서 디지털로', '아날로그 회로의 신호를 디지털 핀이 알아듣게 만들기', 'ee', `
two-worlds        두 세계
  tw-continuous     이어진 값과 끊어진 값
  tw-thresholds     논리 레벨과 문턱, 잡음 여유
  tw-families       3.3V, 5V, 1.8V: 전압이 다른 식구들
  tw-undefined      어중간한 전압이 하는 일
levels            전압 맞추기
  lv-divider        저항 분배기로 낮추기
  lv-clamp          다이오드 클램프와 직렬 저항
  lv-mosfet         MOSFET 양방향 레벨 시프터
  lv-ic             레벨 시프터 IC
  lv-up             3.3V로 5V 입력 몰기
  lv-opto           옵토커플러로 떼어 놓기
decide            하나의 비트로 만들기
  dc-comparator     비교기
  dc-hysteresis     히스테리시스와 슈미트 트리거
  dc-debounce       RC와 슈미트 트리거로 떨림 지우기
  dc-window         창 비교기
  dc-reference      기준 전압
sampling          숫자로 만들기: ADC
  ad-sampling       샘플링과 나이퀴스트
  ad-aliasing       에일리어싱과 안티에일리어싱 필터
  ad-quantize       양자화, 분해능, LSB
  ad-reference      기준 전압과 정확도
  ad-types          SAR, 델타시그마, 그 밖의 방식
  ad-input          입력 임피던스와 샘플 홀드
  ad-chips          라즈베리파이에 붙이는 ADC: MCP3008, ADS1115
condition         ADC 앞의 회로
  cd-buffer         버퍼
  cd-scale          키우고 줄이고 옮기기
  cd-filter         RC 저역 통과 필터
  cd-sensor         센서 신호: 서미스터, 전류 감지, 브리지
  cd-protect        입력 보호
back              다시 아날로그로
  bk-pwm            PWM과 RC 필터
  bk-r2r            R-2R 사다리
  bk-dac            DAC 칩
power             전원을 재고 고르기
  pw-battery        배터리 전압 재기
  pw-solar          태양광 패널과 배터리 사이
  pw-detect         전원 판별 회로
  pw-supervisor     전압 감시 IC와 리셋
  pw-lowpower       저전력으로 재기
noise             섞이지 않게
  ns-ground         아날로그 접지와 디지털 접지
  ns-decouple       디커플링 커패시터
  ns-layout         배선과 차폐
`);
