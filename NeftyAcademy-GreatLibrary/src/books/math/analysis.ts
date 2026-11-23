/**
 * 수학 서가 · 해석학 (학부 → 석사). 극한을 엄밀하게 다루는 아홉 권.
 * 차례는 우선 장 단위로 적어 둔다. 책을 쓰기 시작할 때 장을 쪽으로 쪼갠다.
 */
import { book } from '../outline';

export const mRealSequences = book('m-real-sequences', '실수와 수열', '완비성에서 시작하는 해석학: 상한, 수렴, 급수', 'math', `
reals            실수의 공리
sup              상한과 하한
sequences        수열의 수렴
monotone         단조수렴정리
subsequences     부분수열과 볼차노-바이어슈트라스 정리
cauchy           코시 수열
limsup           상극한과 하극한
series           급수의 수렴
rearrangement    재배열
cantor           칸토어 집합
`);

export const mContinuityDiff = book('m-continuity-diff', '연속과 미분', '엡실론과 델타로 다시 쓰는 연속과 미분', 'math', `
limits           함수의 극한
continuity       연속함수
compact          닫힌 구간 위의 연속함수
uniform          균등연속
derivative       미분
mvt              평균값 정리
taylor           테일러 정리
convex           볼록함수
monotone         단조함수와 불연속점
strange          이상한 함수들
`);

export const mIntegralFuncseq = book('m-integral-funcseq', '적분과 함수열', '리만 적분, 그리고 함수의 줄이 수렴한다는 것', 'math', `
riemann          리만 적분
integrable       적분 가능한 함수
ftc              미적분의 기본정리
improper         이상적분
pointwise        점별수렴
uniform          균등수렴
interchange      극한의 순서 바꾸기
power-series     멱급수
weierstrass      바이어슈트라스 근사 정리
arzela           아르첼라-아스콜리 정리
`);

export const mMetricSpaces = book('m-metric-spaces', '거리공간', '거리만 있으면 할 수 있는 해석학', 'math', `
metric           거리
open-closed      열린집합과 닫힌집합
convergence      수렴과 완비성
continuity       연속사상
compactness      콤팩트성
connectedness    연결성
completion       완비화
contraction      축소사상 정리
baire            베르 범주 정리
function-spaces  함수공간
`);

export const mMultivarAnalysis = book('m-multivar-analysis', '다변수 해석', '미분은 선형사상이다: 역함수 정리에서 스토크스 정리까지', 'math', `
euclidean        유클리드 공간의 위상
derivative       미분은 선형사상
chain            연쇄법칙과 평균값 부등식
higher           고계 미분과 테일러 공식
inverse          역함수 정리
implicit         음함수 정리
integration      다중적분
fubini           푸비니 정리
change           변수 변환 공식
forms            미분형식과 스토크스 정리
`);

export const mMeasure = book('m-measure', '측도와 르베그 적분', '길이와 넓이를 다시 묻기: 측도, 가측함수, 르베그 적분', 'math', `
why              리만 적분의 한계
sigma            시그마 대수와 측도
lebesgue         르베그 측도
measurable       가측함수
integral         르베그 적분
convergence      수렴 정리들
product          곱측도와 푸비니 정리
lp               L^p 공간
radon            라돈-니코딤 정리
differentiation  미분 정리
`);

export const mFourier = book('m-fourier', '푸리에 해석', '함수를 진동으로 나누기: 푸리에 급수와 푸리에 변환', 'math', `
series           푸리에 급수
convergence      수렴의 문제
kernels          디리클레 핵과 페예르 핵
l2               L² 이론과 파르스발 등식
transform        푸리에 변환
inversion        역변환과 플랑슈렐 정리
convolution      합성곱
equations        열 방정식과 파동 방정식
discrete         이산 푸리에 변환
uncertainty      불확정성 원리
`);

export const mFunctional = book('m-functional', '함수해석학', '함수들이 사는 무한 차원 공간의 선형대수', 'math', `
normed           노름공간과 바나흐 공간
hilbert          힐베르트 공간
operators        유계 작용소
hahn-banach      한-바나흐 정리
baire            균등 유계 원리와 열린 사상 정리
dual             쌍대공간과 약한 위상
compact          콤팩트 작용소
spectrum         스펙트럼
self-adjoint     자기수반 작용소의 스펙트럼 정리
unbounded        비유계 작용소
`);

export const mDistributionsSobolev = book('m-distributions-sobolev', '분포와 소볼레프 공간', '미분할 수 없는 것을 미분하기: 분포, 약한 미분, 소볼레프 공간', 'math', `
test             시험 함수
distributions    분포
derivatives      분포의 미분
convolution      합성곱과 매끄럽게 하기
tempered         완만한 분포와 푸리에 변환
fundamental      기본해
sobolev          소볼레프 공간
embedding        매장 정리
trace            경계에서의 값
weak             약해
`);

export const analysisTexts = [mRealSequences, mContinuityDiff, mIntegralFuncseq, mMetricSpaces, mMultivarAnalysis, mMeasure, mFourier, mFunctional, mDistributionsSobolev];
