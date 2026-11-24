/**
 * 수학 서가 · 확률과 통계 (고등 → 학부). 세기, 우연, 자료를 다루는 다섯 권.
 * 차례는 우선 장 단위로 적어 둔다. 책을 쓰기 시작할 때 장을 쪽으로 쪼갠다.
 */
import { book } from '../outline';

export const mCounting = book('m-counting', '경우의 수', '빠짐없이, 겹치지 않게 세기: 순열, 조합, 세는 원리들', 'math', `
rules            합의 법칙과 곱의 법칙
permutations     순열
combinations     조합
repetition       중복순열과 중복조합
binomial         이항정리
pigeonhole       비둘기집 원리
inclusion        포함과 배제
paths            길 세기와 카탈란 수
partitions       나누어 담기
double           두 가지 방법으로 세기
`);

export const mProbability = book('m-probability', '확률', '우연에 수를 매기기: 사건, 조건부확률, 독립, 베이즈 정리', 'math', `
chance           확률의 뜻
sample           표본공간과 사건
rules            덧셈정리와 여사건
conditional      조건부확률
independence     독립
bayes            베이즈 정리
trees            나무 그림과 표
geometric        넓이로 구하는 확률
puzzles          직관을 속이는 문제들
expectation      기댓값
`);

export const mDistributions = book('m-distributions', '확률변수와 분포', '우연한 값의 모양: 평균과 분산, 이항분포, 정규분포', 'math', `
random           확률변수
moments          평균과 분산
binomial         이항분포
geometric        기하분포와 포아송 분포
continuous       연속확률변수와 밀도
normal           정규분포
standard         표준화
joint            두 확률변수: 결합분포와 공분산
lln              큰 수의 법칙
clt              중심극한정리
`);

export const mInferenceFirst = book('m-inference-first', '추정과 검정 첫걸음', '표본에서 전체를 짐작하기: 자료의 요약, 신뢰구간, 가설검정', 'math', `
data             자료와 그림
summary          대푯값과 흩어진 정도
sampling         모집단과 표본
sampling-dist    표본평균의 분포
estimate         점추정
interval         신뢰구간
test             가설검정의 생각
p-value          p값과 두 가지 오류
proportion       비율의 추정과 검정
pitfalls         통계의 함정
`);

export const mRegressionFirst = book('m-regression-first', '상관과 회귀 첫걸음', '두 변수의 관계: 산점도, 상관계수, 최소제곱 직선', 'math', `
scatter          산점도
correlation      상관계수
line             최소제곱 직선
residual         잔차와 결정계수
causation        상관과 인과
transform        변환과 곡선 맞추기
multiple         변수가 여럿일 때
inference        기울기의 추정과 검정
simpson          심슨의 역설
prediction       예측과 그 한계
`);

export const probstatTexts = [mCounting, mProbability, mDistributions, mInferenceFirst, mRegressionFirst];
