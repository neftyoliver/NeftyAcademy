/**
 * 수학 서가 · 수학사. 따로 읽는 열일곱 권이고, 문제집이 없다.
 *
 *   시대의 흐름      고대, 중세, 17~18세기, 19세기, 20세기와 오늘
 *   수학자 열전      고대와 중세, 16~18세기, 19세기, 20세기와 오늘
 *   정리의 역사      대수와 정수론, 기하와 위상, 해석과 확률, 논리와 이산
 *   문제들           풀린 문제들, 열린 문제들
 *   그 밖에          기호와 용어의 유래, 동아시아와 한국의 수학
 *
 * 기본서와 문제집은 본문에 역사 이야기를 쓰지 않고, 쪽 끝의 참고 문서에서 여기의 쪽(사람, 정리, 문제)으로 링크만 건다.
 * 여기의 쪽은 그 개념을 다루는 기본서의 쪽으로 되돌아가는 링크를 단다.
 * 누가 먼저인지 다툼이 있는 일은 다툼이 있다고 그대로 적는다. 출처는 쪽마다 참고 문서에 단다.
 * 쪽은 필요할 때 더한다(id 는 한번 정하면 바꾸지 않는다).
 */
import { book } from '../outline';

// ---------------------------------------------------------------- 시대의 흐름

export const mhAncient = book('mh-ancient', '고대의 수학', '세기에서 증명까지: 메소포타미아, 이집트, 그리스, 인도, 중국', 'math', `
origins          수의 시작
  or-tally         눈금과 셈
  or-numerals      여러 문명의 숫자
mesopotamia      메소포타미아
  me-tablets       점토판과 육십진법
  me-plimpton      플림프턴 322
  me-quadratic     이차 문제 풀기
egypt            이집트
  eg-papyri        린드 파피루스와 모스크바 파피루스
  eg-fractions     단위분수
greece           그리스
  gr-proof         증명의 시작
  gr-pythagoreans  피타고라스 학파
  gr-incommensurable  통약 불가능한 길이
  gr-three         세 가지 작도 문제
  gr-eudoxus       에우독소스의 비례론과 실진법
  gr-elements      유클리드의 원론
  gr-archimedes    아르키메데스의 구적
  gr-conics        아폴로니오스의 원뿔 곡선
  gr-astronomy     천문학과 삼각법
  gr-diophantus    디오판토스의 산학
  gr-late          알렉산드리아의 마지막 수학자들
india            인도
  in-sulba         술바수트라
  in-place-value   자릿값과 0
china            중국
  cn-rods          산가지
  cn-nine          구장산술
  cn-liu-hui       유휘의 주석
`);

export const mhMedieval = book('mh-medieval', '중세의 수학', '이슬람 세계, 인도, 중국, 그리고 유럽으로 건너간 수학', 'math', `
islam            이슬람 세계
  is-translation   번역과 지혜의 집
  is-algebra       알콰리즈미와 대수
  is-numerals      인도 숫자의 전파
  is-cubic         삼차방정식과 원뿔 곡선
  is-trig          삼각법의 독립
  is-optics        이븐 알하이삼의 광학과 기하
india            인도
  in-brahmagupta   0과 음수의 셈
  in-bhaskara      바스카라 2세
  in-kerala        케랄라 학파의 급수
china            중국
  cn-remainder     손자의 나머지 문제
  cn-pi            원주율의 계산
  cn-song-yuan     송과 원의 대수
europe           유럽
  eu-fibonacci     피보나치와 산반서
  eu-translation   번역과 대학
  eu-oresme        오렘의 그래프와 급수
  eu-commerce      상업 산술과 기호의 싹
`);

export const mhEarlyModern = book('mh-early-modern', '17~18세기의 수학', '기호 대수, 좌표, 미적분, 확률이 태어난 두 세기', 'math', `
renaissance      16세기의 준비
  re-cubic         삼차방정식과 사차방정식의 풀이
  re-symbols       문자 기호
  re-perspective   원근법
  re-logarithm     로그의 발명
coordinates      좌표
  co-descartes     데카르트의 기하학
  co-fermat        페르마의 방법들
calculus         미적분
  ca-before        미적분의 앞사람들
  ca-newton        뉴턴의 유율법
  ca-leibniz       라이프니츠의 기호
  ca-priority      우선권 다툼
  ca-bernoulli     베르누이 집안
  ca-critique      무한소에 대한 비판
probability      확률
  pr-points        점수 문제와 편지
  pr-bernoulli     추측술과 큰 수의 법칙
  pr-laplace       베이즈와 라플라스
euler-age        오일러의 세기
  eu-euler         오일러
  eu-mechanics     해석 역학
  eu-number        정수론의 부활
`);

export const mh19c = book('mh-19c', '19세기의 수학', '엄밀함, 추상, 새로운 기하', 'math', `
rigor            엄밀함
  ri-cauchy        코시의 극한
  ri-fourier       푸리에 급수가 던진 물음
  ri-weierstrass   엡실론과 델타
  ri-reals         실수의 구성
algebra          대수
  al-gauss         가우스의 산술 연구
  al-quintic       오차방정식과 군
  al-quaternion    사원수
  al-boole         논리의 대수
  al-matrices      행렬과 행렬식
  al-structures    군, 환, 체라는 개념
geometry         기하
  ge-noneuclid     비유클리드 기하의 발견
  ge-projective    사영기하의 부흥
  ge-riemann       리만의 다양체
  ge-erlangen      에를랑겐 프로그램
analysis         해석
  an-complex       복소함수론
  an-primes        소수의 분포
  an-physics       수리물리의 방정식
foundations      기초
  fo-cantor        칸토어의 집합론
  fo-numbers       수의 공리화
  fo-frege         프레게의 논리
`);

export const mh20c = book('mh-20c', '20세기와 오늘의 수학', '기초의 위기, 구조, 컴퓨터, 그리고 풀린 오랜 문제들', 'math', `
foundations      기초
  fo-hilbert       힐베르트의 문제들
  fo-crisis        역설과 기초의 위기
  fo-godel         괴델의 정리
  fo-turing        계산의 수학
structures       구조
  st-noether       추상 대수
  st-bourbaki      부르바키
  st-topology      위상수학의 성장
  st-category      범주론의 탄생
analysis         해석과 확률
  an-lebesgue      르베그 적분
  an-functional    함수해석학
  an-kolmogorov    확률의 공리
geometry         기하
  ge-relativity    상대론과 기하
  ge-algebraic     대수기하의 재건
  ge-poincare      푸앵카레 추측의 길
computation      계산
  co-computers     컴퓨터와 수학
  co-four-color    컴퓨터가 낀 증명
  co-formal        형식 증명
today            오늘
  to-fermat        페르마의 마지막 정리
  to-prizes        필즈상과 아벨상
  to-millennium    밀레니엄 문제
`);

// ---------------------------------------------------------------- 수학자 열전

export const mhPeopleAncient = book('mh-people-ancient', '수학자 열전: 고대와 중세', '탈레스에서 레기오몬타누스까지', 'math', `
greece           그리스와 헬레니즘
  thales           탈레스
  pythagoras       피타고라스
  zeno             제논
  hippocrates      키오스의 히포크라테스
  theaetetus       테아이테토스
  eudoxus          에우독소스
  euclid           유클리드
  archimedes       아르키메데스
  eratosthenes     에라토스테네스
  apollonius       아폴로니오스
  hipparchus       히파르코스
  heron            헤론
  ptolemy          프톨레마이오스
  diophantus       디오판토스
  pappus           파푸스
  hypatia          히파티아
india            인도
  aryabhata        아리아바타
  brahmagupta      브라마굽타
  bhaskara         바스카라 2세
  madhava          마다바
china            중국
  liu-hui          유휘
  zu-chongzhi      조충지
  qin-jiushao      진구소
  li-ye            이야
  yang-hui         양휘
  zhu-shijie       주세걸
islam            이슬람 세계
  khwarizmi        알콰리즈미
  thabit           사비트 이븐 쿠라
  ibn-haytham      이븐 알하이삼
  khayyam          오마르 하이얌
  tusi             나시르 알딘 알투시
  kashi            알카시
europe           중세 유럽
  fibonacci        피보나치
  oresme           니콜 오렘
  regiomontanus    레기오몬타누스
`);

export const mhPeopleEarlyModern = book('mh-people-early-modern', '수학자 열전: 16~18세기', '파치올리에서 르장드르까지', 'math', `
c16              르네상스
  pacioli          파치올리
  tartaglia        타르탈리아
  cardano          카르다노
  ferrari          페라리
  bombelli         봄벨리
  viete            비에트
  stevin           스테빈
  napier           네이피어
c17              17세기
  kepler           케플러
  cavalieri        카발리에리
  desargues        데자르그
  descartes        데카르트
  fermat           페르마
  pascal           파스칼
  wallis           월리스
  huygens          하위헌스
  barrow           배로
  newton           뉴턴
  leibniz          라이프니츠
  jakob-bernoulli  야코프 베르누이
  johann-bernoulli 요한 베르누이
c18              18세기
  de-moivre        드무아브르
  taylor           테일러
  maclaurin        매클로린
  goldbach         골드바흐
  daniel-bernoulli 다니엘 베르누이
  euler            오일러
  dalembert        달랑베르
  bayes            베이즈
  lambert          람베르트
  agnesi           아녜시
  lagrange         라그랑주
  monge            몽주
  laplace          라플라스
  legendre         르장드르
`);

export const mhPeople19c = book('mh-people-19c', '수학자 열전: 19세기', '가우스에서 힐베르트까지', 'math', `
early            세기의 앞쪽
  gauss            가우스
  germain          제르맹
  fourier          푸리에
  bolzano          볼차노
  cauchy           코시
  mobius           뫼비우스
  lobachevsky      로바쳅스키
  bolyai           보여이
  abel             아벨
  jacobi           야코비
  dirichlet        디리클레
  hamilton         해밀턴
  galois           갈루아
  grassmann        그라스만
  liouville        리우빌
  de-morgan        드모르간
  boole            불
late             세기의 뒤쪽
  chebyshev        체비쇼프
  weierstrass      바이어슈트라스
  cayley           케일리
  sylvester        실베스터
  hermite          에르미트
  kronecker        크로네커
  kummer           쿠머
  riemann          리만
  dedekind         데데킨트
  cantor           칸토어
  lie              리
  klein            클라인
  frege            프레게
  kovalevskaya     코발렙스카야
  poincare         푸앵카레
  peano            페아노
  hilbert          힐베르트
`);

export const mhPeople20c = book('mh-people-20c', '수학자 열전: 20세기와 오늘', '러셀에서 허준이까지', 'math', `
foundations      기초와 계산
  russell          러셀
  zermelo          체르멜로
  brouwer          브라우어르
  godel            괴델
  church           처치
  turing           튜링
  tarski           타르스키
  cohen            코언
algebra          대수와 정수론
  noether          뇌터
  hardy            하디
  ramanujan        라마누잔
  artin            아르틴
  weil             베유
  robinson         줄리아 로빈슨
  grothendieck     그로텐디크
  serre            세르
  wiles            와일스
analysis         해석과 확률
  hadamard         아다마르
  lebesgue         르베그
  banach           바나흐
  von-neumann      폰 노이만
  kolmogorov       콜모고로프
  ito              이토 기요시
  shannon          섀넌
  nash             내시
geometry         기하와 위상
  minkowski        민코프스키
  hausdorff        하우스도르프
  cartan           카르탕
  weyl             바일
  chern            천싱선
  milnor           밀너
  atiyah           아티야
  thurston         서스턴
  perelman         페렐만
  mirzakhani       미르자하니
discrete         이산과 그 밖
  erdos            에르되시
  conway           콘웨이
  tao              타오
  june-huh         허준이
`);

// ---------------------------------------------------------------- 정리의 역사

export const mhThmAlgebra = book('mh-thm-algebra', '정리의 역사: 대수와 정수론', '수, 방정식, 구조, 정수에 관한 정리들이 걸어온 길', 'math', `
numbers          수
  nu-zero          0
  nu-negative      음수
  nu-fractions     분수와 소수
  nu-irrational    무리수의 발견
  nu-complex       허수와 복소수
  nu-quaternion    사원수
  nu-transcendental  초월수
equations        방정식
  eq-quadratic     이차방정식의 풀이
  eq-cubic         삼차방정식과 사차방정식의 근의 공식
  eq-quintic       오차방정식은 풀리지 않는다
  eq-fta           대수학의 기본정리
  eq-elimination   연립방정식과 소거법
  eq-determinant   행렬식과 행렬
  eq-binomial      이항정리와 파스칼의 삼각형
structures       구조
  st-group         군
  st-ring-field    환과 체
  st-vector        벡터공간
  st-galois        갈루아 이론
integers         정수
  nt-primes        소수는 끝없이 많다
  nt-sieve         에라토스테네스의 체
  nt-euclid        유클리드 호제법
  nt-fta           산술의 기본정리
  nt-fermat        페르마 소정리
  nt-crt           중국인의 나머지 정리
  nt-reciprocity   이차 상호 법칙
  nt-pell          펠 방정식
  nt-pnt           소수 정리
powers           지수와 로그
  el-exponent      지수의 확장
  el-logarithm     로그
  el-e             자연상수 e
  el-euler         오일러 공식
`);

export const mhThmGeometry = book('mh-thm-geometry', '정리의 역사: 기하와 위상', '도형과 공간에 관한 정리들이 걸어온 길', 'math', `
classical        고전 기하
  cl-pythagoras    피타고라스 정리
  cl-thales        탈레스의 정리들
  cl-pi            원주율
  cl-area          넓이와 부피의 공식
  cl-conics        원뿔 곡선
  cl-trig          삼각법
  cl-construction  작도와 그 한계
coordinates      좌표와 벡터
  co-analytic      좌표기하
  co-vectors       벡터
  co-symmetry      변환과 대칭
new              새로운 기하
  ng-parallel      평행선 공준
  ng-noneuclid     비유클리드 기하
  ng-projective    사영기하
  ng-curvature     곡률과 가우스의 정리
  ng-riemann       리만 기하
topology         위상
  to-euler         오일러의 다면체 공식
  to-bridges       쾨니히스베르크의 다리
  to-surfaces      곡면의 분류
  to-fixed         고정점 정리
  to-homology      호몰로지의 탄생
  to-knots         매듭 이론
`);

export const mhThmAnalysis = book('mh-thm-analysis', '정리의 역사: 해석과 확률', '극한, 미적분, 확률에 관한 정리들이 걸어온 길', 'math', `
calculus         미적분
  ca-exhaustion    실진법
  ca-tangent       접선과 넓이의 문제
  ca-ftc           미적분의 기본정리
  ca-series        무한급수
  ca-taylor        테일러 급수
  ca-function      함수라는 개념
  ca-limit         극한의 정의
  ca-continuity    연속과 사잇값 정리
  ca-reals         실수의 구성
advanced         그 뒤의 해석
  ad-fourier       푸리에 급수
  ad-cauchy        코시의 적분 정리
  ad-measure       측도와 르베그 적분
  ad-ode           미분방정식
  ad-variations    변분법
  ad-spaces        함수공간
  ad-chaos         혼돈
probability      확률과 통계
  pr-origins       확률의 시작
  pr-lln           큰 수의 법칙
  pr-normal        정규분포와 중심극한정리
  pr-bayes         베이즈 정리
  pr-least-squares 최소제곱법
  pr-axioms        확률의 공리
  pr-statistics    통계학의 성립
`);

export const mhThmLogic = book('mh-thm-logic', '정리의 역사: 논리와 이산', '증명, 집합, 세기, 계산에 관한 생각들이 걸어온 길', 'math', `
logic            논리와 집합
  lo-syllogism     삼단논법에서 기호 논리로
  lo-proof         증명이라는 생각
  lo-induction     수학적 귀납법
  lo-sets          집합과 무한
  lo-diagonal      대각선 논법
  lo-paradoxes     역설들
  lo-axioms        공리적 방법
  lo-choice        선택공리와 연속체 가설
  lo-incompleteness  불완전성 정리
  lo-computability 계산 가능성
discrete         이산수학
  di-counting      순열과 조합
  di-pigeonhole    비둘기집 원리
  di-fibonacci     피보나치 수
  di-catalan       카탈란 수
  di-generating    생성함수
  di-graph         그래프 이론의 시작
  di-four-color    사색 정리
  di-ramsey        램지 이론
computing        계산
  cp-algorithm     알고리즘
  cp-binary        이진법
  cp-information   정보 이론
  cp-complexity    P 대 NP
  cp-crypto        공개키 암호
`);

// ---------------------------------------------------------------- 문제들

export const mhSolved = book('mh-solved', '풀린 문제들', '오래 버틴 문제들과 그것을 푼 사람들', 'math', `
antiquity        고대에서 온 문제
  an-duplication   정육면체의 배적
  an-trisection    각의 삼등분
  an-squaring      원적 문제
  an-polygons      정다각형의 작도
  an-parallel      평행선 공준
equations        방정식과 급수
  eq-cubic         삼차방정식
  eq-quintic       오차방정식
  eq-basel         바젤 문제
  eq-brachistochrone  최속 강하선
  eq-bridges       쾨니히스베르크의 다리
modern           근대와 현대
  mo-pnt           소수 정리
  mo-continuum     연속체 가설
  mo-hilbert10     힐베르트의 열째 문제
  mo-four-color    사색 문제
  mo-classification  유한 단순군의 분류
  mo-mordell       모델 추측
  mo-bieberbach    비버바흐 추측
  mo-fermat        페르마의 마지막 정리
  mo-kepler        케플러 추측
  mo-catalan       카탈랑 추측
  mo-poincare      푸앵카레 추측
  mo-gaps          소수 사이의 유한한 간격
`);

export const mhOpen = book('mh-open', '열린 문제들', '아직 아무도 풀지 못한 문제들', 'math', `
primes           소수와 정수
  op-riemann       리만 가설
  op-goldbach      골드바흐 추측
  op-twin          쌍둥이 소수 추측
  op-collatz       콜라츠 추측
  op-perfect       홀수 완전수
  op-abc           abc 추측
  op-euler-const   오일러 상수는 무리수인가
  op-normal        π의 숫자는 고르게 나오는가
millennium       밀레니엄 문제
  op-p-np          P 대 NP
  op-navier        나비에-스토크스 방정식
  op-hodge         호지 추측
  op-bsd           버치-스위너턴다이어 추측
  op-yang-mills    양-밀스 이론과 질량 간극
geometry         기하와 조합
  op-square        내접 정사각형 문제
  op-coloring      평면의 색칠수
  op-kissing       입맞춤 수
  op-ramsey        램지 수
  op-sofa          소파 옮기기 문제
other            그 밖에
  op-invariant     불변 부분공간 문제
  op-jacobian      야코비안 추측
  op-hilbert       힐베르트의 문제 가운데 남은 것
`);

// ---------------------------------------------------------------- 그 밖에

export const mhSymbols = book('mh-symbols', '기호와 용어의 유래', '지금 쓰는 기호와 말이 어디에서 왔나', 'math', `
numerals         숫자
  sy-digits        인도-아라비아 숫자
  sy-decimal       소수점
  sy-fraction      분수의 가로줄
  sy-percent       퍼센트 기호
  sy-infinity      무한대 기호
operations       셈 기호
  sy-plus-minus    더하기와 빼기 기호
  sy-times-divide  곱하기와 나누기 기호
  sy-equals        등호
  sy-inequality    부등호
  sy-root          근호
  sy-abs           절댓값 기호
  sy-exponent      지수 표기
  sy-parentheses   괄호
algebra          대수의 기호
  sy-variables     미지수 x
  sy-function      함수 기호 f(x)
  sy-sigma         합과 곱의 기호
  sy-factorial     계승 기호
  sy-i             허수 단위 i
  sy-e             자연상수 e
  sy-pi            원주율 π
  sy-log           log와 ln
  sy-matrix        행렬 표기
  sy-vector        벡터 표기
calculus         해석의 기호
  sy-derivative    미분 기호
  sy-integral      적분 기호
  sy-limit         극한 기호
  sy-partial       편미분 기호
  sy-nabla         나블라
  sy-epsilon       엡실론과 델타
logic            집합과 논리의 기호
  sy-set           집합의 기호
  sy-empty         공집합 기호
  sy-number-sets   수의 집합을 적는 글자
  sy-quantifiers   모든과 어떤의 기호
  sy-implies       함의 기호
  sy-qed           증명 끝 표시
words            말
  wo-hanja         한자로 옮긴 수학 용어
  wo-korean        우리말 수학 용어
  wo-misnamed      이름이 잘못 붙은 정리들
`);

export const mhEastAsia = book('mh-east-asia', '동아시아와 한국의 수학', '산가지에서 오늘까지: 중국, 일본, 한국', 'math', `
china            중국
  ch-rods          산가지와 셈
  ch-nine          구장산술
  ch-classics      산경십서
  ch-pi            유휘와 조충지의 원주율
  ch-four          송과 원의 네 대가
  ch-tianyuan      천원술
  ch-magic         마방진
  ch-western       서양 수학의 전래
japan            일본
  ja-wasan         와산
  ja-seki          세키 다카카즈
  ja-sangaku       산가쿠
  ja-soroban       주판
korea            한국
  ko-early         삼국과 고려의 산학
  ko-system        조선의 산학 제도
  ko-sejong        세종 때의 수학과 천문
  ko-choe          최석정과 구수략
  ko-hong          홍정하
  ko-jungin        중인 산학자들
  ko-nam           남병길과 이상혁
  ko-modern        근대 수학 교육의 시작
  ko-today         오늘의 한국 수학
`);

export const historyBooks = [
  mhAncient,
  mhMedieval,
  mhEarlyModern,
  mh19c,
  mh20c,
  mhPeopleAncient,
  mhPeopleEarlyModern,
  mhPeople19c,
  mhPeople20c,
  mhThmAlgebra,
  mhThmGeometry,
  mhThmAnalysis,
  mhThmLogic,
  mhSolved,
  mhOpen,
  mhSymbols,
  mhEastAsia,
];
