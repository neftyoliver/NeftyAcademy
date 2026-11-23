/**
 * 수학 서가 · 이산수학 (학부 → 석사). 세기, 점화식, 그래프, 순서를 다루는 다섯 권.
 * 차례는 우선 장 단위로 적어 둔다. 책을 쓰기 시작할 때 장을 쪽으로 쪼갠다.
 */
import { book } from '../outline';

export const mCombinatorics = book('m-combinatorics', '조합론 원론', '세는 방법의 이론: 일대일대응, 포함-배제, 대칭 아래에서 세기', 'math', `
counting         세기의 원리
bijection        일대일대응으로 세기
binomial         이항계수의 항등식
inclusion        포함-배제의 원리
pigeonhole       비둘기집 원리
stirling         스털링 수와 벨 수
catalan          카탈란 수
partitions       자연수의 분할
polya            대칭 아래에서 세기
designs          조합 설계
`);

export const mRecurrences = book('m-recurrences', '점화식과 생성함수', '수열을 식 하나에 담기: 점화식, 생성함수, 점근 어림', 'math', `
recurrence       점화식 세우기
linear           선형 점화식 풀기
generating       생성함수
operations       생성함수의 셈
exponential      지수 생성함수
catalan          생성함수로 푸는 카탈란 수
partitions       분할의 생성함수
difference       차분과 합의 셈
divide           분할 정복 점화식
asymptotics      점근 어림
`);

export const mGraphs = book('m-graphs', '그래프 이론', '점과 선으로 보는 관계: 길, 나무, 색칠, 짝짓기, 흐름', 'math', `
graph            점과 선
paths            길, 회로, 연결
trees            나무
euler-hamilton   오일러 길과 해밀턴 길
planar           평면 그래프와 오일러 공식
coloring         색칠하기
matching         짝짓기
flows            흐름과 자르기
directed         방향 그래프
matrices         그래프의 행렬
`);

export const mOrdersLattices = book('m-orders-lattices', '순서와 격자', '앞뒤가 있는 구조: 부분 순서, 격자, 불 대수', 'math', `
poset            부분 순서
hasse            하세 도형
chains           사슬과 반사슬
lattice          격자
distributive     분배 격자
boolean          불 대수
fixed-point      고정점 정리
mobius           뫼비우스 반전
closure          닫힘 연산과 갈루아 연결
well             정렬 순서와 초른의 보조정리
`);

export const mProbabilisticMethod = book('m-probabilistic-method', '확률적 방법과 극단 조합', '얼마나 크면 피할 수 없나, 그리고 우연으로 존재를 보이기', 'math', `
extremal         극단 문제란
turan            투란의 정리
ramsey           램지 이론
first-moment     기댓값으로 존재를 보이기
second-moment    분산으로 보이기
local-lemma      로바스 국소 보조정리
random-graphs    마구잡이 그래프
set-systems      집합족의 극단 문제
regularity       정칙성 보조정리
algebraic        선형대수 방법
`);

export const discreteTexts = [mCombinatorics, mRecurrences, mGraphs, mOrdersLattices, mProbabilisticMethod];
