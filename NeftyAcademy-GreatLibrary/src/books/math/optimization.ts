/**
 * 수학 서가 · 최적화 (학부 → 석사). 가장 좋은 것을 찾는 네 권.
 * 차례는 우선 장 단위로 적어 둔다. 책을 쓰기 시작할 때 장을 쪽으로 쪼갠다.
 */
import { book } from '../outline';

export const mLinearProgramming = book('m-linear-programming', '선형계획법', '일차식의 제약 아래에서 일차식을 가장 크게', 'math', `
model            문제 세우기
geometry         다면체와 꼭짓점
simplex          단체법
duality          쌍대성
sensitivity      민감도 분석
network          그물 흐름
integer          정수 계획
interior         내점법
games            영합 게임
uses             쓰임새
`);

export const mConvex = book('m-convex', '볼록 최적화', '볼록이면 풀린다: 볼록집합, 쌍대, 알고리즘', 'math', `
sets             볼록집합
functions        볼록함수
problems         볼록 최적화 문제
duality          라그랑주 쌍대
kkt              KKT 조건
gradient         경사 하강법
newton           뉴턴 방법
proximal         근접 방법
conic            원뿔 계획
uses             쓰임새
`);

export const mNonlinearOpt = book('m-nonlinear-opt', '비선형 최적화', '볼록이 아닌 문제의 조건과 알고리즘', 'math', `
conditions       최적 조건
line-search      선 탐색
trust-region     신뢰 영역
quasi-newton     준뉴턴 방법
conjugate        켤레 기울기법
constrained      제약이 있는 문제
penalty          벌점과 장벽
sqp              순차 이차 계획
global           전역 최적화
derivative-free  미분 없이 찾기
`);

export const mCombinatorialOpt = book('m-combinatorial-opt', '조합 최적화', '유한한 것들 가운데 가장 좋은 것: 길, 나무, 흐름, 짝', 'math', `
shortest         최단 경로
spanning         최소 신장 나무
flows            최대 흐름
matching         짝짓기
matroids         매트로이드와 탐욕법
polyhedra        다면체 방법
tsp              외판원 문제
approximation    근사 알고리즘
dynamic          동적 계획법
hardness         어려운 문제들
`);

export const optimizationTexts = [mLinearProgramming, mConvex, mNonlinearOpt, mCombinatorialOpt];
