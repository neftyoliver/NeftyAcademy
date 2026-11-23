/**
 * 수학 서가 · 응용수학 (학부 → 석사). 수학이 쓰이는 자리의 열한 권.
 * 차례는 우선 장 단위로 적어 둔다. 책을 쓰기 시작할 때 장을 쪽으로 쪼갠다.
 */
import { book } from '../outline';

export const mSignals = book('m-signals', '신호 처리의 수학', '표본, 주파수, 필터', 'math', `
signals          신호와 표본
sampling         표본화 정리
fourier          푸리에 변환
dft              이산 푸리에 변환과 FFT
convolution      합성곱과 필터
z                z 변환
filters          필터 설계
windows          창과 스펙트럼 새기
wavelets         웨이블릿
compression      압축
`);

export const mInformation = book('m-information', '정보 이론', '정보의 양을 재기: 엔트로피, 부호화, 통신로 용량', 'math', `
entropy          엔트로피
source           정보원 부호화
huffman          허프만 부호
mutual           상호 정보량
channel          통신로와 용량
shannon          통신로 부호화 정리
continuous       연속 변수의 정보
divergence       쿨백-라이블러 발산
distortion       율-왜곡 이론
complexity       콜모고로프 복잡도
`);

export const mCoding = book('m-coding', '부호 이론', '오류를 찾고 고치는 부호의 대수', 'math', `
errors           오류를 찾고 고치기
hamming          해밍 거리와 해밍 부호
linear           선형 부호
bounds           한계
cyclic           순환 부호
bch              BCH 부호
reed-solomon     리드-솔로몬 부호
convolutional    길쌈 부호
ldpc             LDPC 부호
lattices         구 채우기와 격자
`);

export const mCrypto = book('m-crypto', '암호의 수학', '어려운 문제 위에 세운 비밀', 'math', `
classical        옛 암호와 깨는 법
modular          합동 산술
rsa              RSA
discrete-log     이산 로그와 열쇠 나눔
elliptic         타원곡선 암호
hash             해시 함수
signatures       전자 서명
primality        소수 판정과 인수분해
lattice          격자 암호
zero-knowledge   영지식 증명
`);

export const mGameTheory = book('m-game-theory', '게임 이론', '서로의 선택에 기대는 결정', 'math', `
games            게임의 틀
dominance        우월 전략
nash             내시 균형
mixed            섞은 전략
zero-sum         영합 게임과 최소최대 정리
extensive        차례가 있는 게임
repeated         되풀이 게임
bayesian         정보가 모자란 게임
cooperative      협조 게임
mechanism        제도 설계
`);

export const mFinance = book('m-finance', '금융 수학', '이자, 위험, 차익 거래 없음', 'math', `
interest         이자와 현재 가치
bonds            채권
portfolio        포트폴리오와 분산
arbitrage        차익 거래 없음
binomial         이항 모형
brownian         기하 브라운 운동
black-scholes    블랙-숄즈 공식
greeks           민감도
risk             위험의 척도
rates            금리 모형
`);

export const mMechanics = book('m-mechanics', '역학의 수학', '뉴턴에서 라그랑주, 해밀턴으로', 'math', `
newton           뉴턴 역학
conservation     보존 법칙
lagrangian       라그랑주 역학
hamiltonian      해밀턴 역학
central          중심력과 케플러 문제
rigid            강체
oscillations     작은 진동
symplectic       심플렉틱 기하
continuum        연속체
relativity       특수 상대론
`);

export const mMlMath = book('m-ml-math', '기계학습의 수학', '자료에서 배우는 일을 수학으로 적기', 'math', `
learning         배운다는 것
linear           선형 모형
loss             손실과 최적화
probability      확률 모형
generalization   일반화
kernels          커널 방법
neural           신경망과 역전파
dimension        차원 줄이기
information      정보와 엔트로피
theory           학습 이론
`);

export const mGraphicsMath = book('m-graphics-math', '컴퓨터 그래픽스의 수학', '화면에 그리는 데 드는 기하와 해석', 'math', `
coordinates      좌표와 동차좌표
transforms       변환 행렬
rotations        회전과 사원수
projection       투영
curves           베지에 곡선과 스플라인
surfaces         곡면과 메시
shading          빛의 계산
rendering        렌더링 방정식
sampling         표본화와 몬테카를로
intersection     교차와 가속 구조
`);

export const mCompGeometry = book('m-comp-geometry', '계산 기하', '점, 선분, 다각형을 다루는 알고리즘', 'math', `
primitives       기본 판정
hull             볼록 껍질
intersections    선분의 교차
triangulation    삼각 분할
voronoi          보로노이 도형
delaunay         들로네 삼각 분할
search           범위 탐색
arrangements     배열
motion           길 찾기
robustness       수치 견고성
`);

export const mComplexity = book('m-complexity', '계산 복잡도', '문제가 얼마나 어려운가를 재는 이론', 'math', `
time             시간과 공간
p-np             P와 NP
reductions       환원과 NP-완전
hierarchy        위계 정리
space            공간 복잡도
randomness       확률적 계산
circuits         회로 복잡도
interactive      상호 증명
approximation    근사의 어려움
quantum          양자 계산
`);

export const appliedTexts = [mSignals, mInformation, mCoding, mCrypto, mGameTheory, mFinance, mMechanics, mMlMath, mGraphicsMath, mCompGeometry, mComplexity];
