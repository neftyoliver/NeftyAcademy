/**
 * 수학 서가 · 미분방정식 (학부 → 석사). 변화의 법칙에서 함수를 찾는 일곱 권.
 * 차례는 우선 장 단위로 적어 둔다. 책을 쓰기 시작할 때 장을 쪽으로 쪼갠다.
 */
import { book } from '../outline';

export const mOdeFirst = book('m-ode-first', '상미분방정식 첫걸음', '방향장을 그리고, 풀고, 어림하기', 'math', `
what             미분방정식이란
direction        방향장
separable        변수분리
linear-first     일계 선형 방정식
models           성장, 식기, 섞기
euler            오일러 방법
second           이계 선형 방정식과 용수철
forced           강제 진동과 공명
laplace          라플라스 변환
series           급수해
`);

export const mLinearSystems = book('m-linear-systems', '선형계와 위상 평면', '연립 미분방정식을 그림으로: 평형점과 그 둘레의 흐름', 'math', `
systems          연립 미분방정식
phase            위상 평면
eigen            고윳값으로 푸는 선형계
classification   평형점의 분류
exponential      행렬 지수
nonhomogeneous   비동차 선형계
linearization    선형화
pendulum         진자
predator         포식자와 먹이
stability        안정성
`);

export const mExistence = book('m-existence', '존재와 유일성', '해가 있는가, 하나뿐인가, 초깃값에 어떻게 기대는가', 'math', `
picard           피카르 반복
lipschitz        립시츠 조건
existence        존재와 유일성 정리
peano            페아노 존재 정리
continuation     해의 연장
dependence       초깃값에 대한 의존
gronwall         그론월 부등식
linear           선형 방정식의 일반론
sturm            스튀름-리우빌 이론
boundary         경곗값 문제
`);

export const mDynamical = book('m-dynamical', '동역학계와 혼돈', '오래 지나면 어떻게 되는가: 안정성, 분기, 혼돈', 'math', `
flows            흐름과 사상
fixed            고정점과 주기 궤도
lyapunov         리아푸노프 안정성
bifurcation      분기
limit-cycles     극한 주기 궤도
maps             일차원 사상과 주기 배증
chaos            혼돈
lorenz           로렌츠 끌개
fractals         프랙털과 차원
hamiltonian      해밀턴 계
`);

export const mPdeFirst = book('m-pde-first', '편미분방정식 첫걸음', '파동, 열, 퍼텐셜: 세 방정식을 풀어 보기', 'math', `
what             편미분방정식이란
transport        수송 방정식
wave             파동 방정식
heat             열 방정식
laplace          라플라스 방정식
separation       변수분리와 푸리에 급수
characteristics  특성 곡선
classification   세 가지 유형
fourier          푸리에 변환으로 풀기
grid             격자로 풀기
`);

export const mPdeTheory = book('m-pde-theory', '편미분방정식의 이론', '약해, 에너지, 정칙성', 'math', `
harmonic         조화함수의 성질
maximum          최대 원리
green            그린 함수
energy           에너지 방법
weak             약해와 소볼레프 공간
lax-milgram      락스-밀그램 정리
regularity       정칙성
evolution        발전 방정식과 반군
conservation     보존 법칙과 충격파
nonlinear        비선형 방정식
`);

export const mVariations = book('m-variations', '변분법', '함수 가운데에서 가장 좋은 것 찾기', 'math', `
functional       범함수
euler-lagrange   오일러-라그랑주 방정식
brachistochrone  최속 강하선
geodesics        측지선
constraints      등주 문제와 제약
action           최소 작용의 원리
noether          대칭과 보존량
second           이계 변분
direct           직접법
control          최적 제어
`);

export const diffeqTexts = [mOdeFirst, mLinearSystems, mExistence, mDynamical, mPdeFirst, mPdeTheory, mVariations];
