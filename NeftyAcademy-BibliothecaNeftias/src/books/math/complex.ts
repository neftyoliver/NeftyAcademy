/**
 * 수학 서가 · 복소해석학 (학부 → 석사). 복소수를 넣는 함수를 다루는 다섯 권.
 * 차례는 우선 장 단위로 적어 둔다. 책을 쓰기 시작할 때 장을 쪽으로 쪼갠다.
 */
import { book } from '../outline';

export const mComplexVisual = book('m-complex-visual', '그림으로 보는 복소함수', '평면을 평면으로 옮기는 함수를 눈으로 보기', 'math', `
plane            복소평면 다시 보기
mappings         함수는 평면을 옮긴다
power            거듭제곱과 제곱근
exp              지수함수와 로그
mobius           뫼비우스 변환
derivative       복소 미분은 돌리고 늘리는 일
coloring         정의역 색칠
integrals        길을 따라 더하기
winding          감는 수
sphere           리만 구
`);

export const mHolomorphic = book('m-holomorphic', '정칙함수와 코시 정리', '복소 미분 가능성 하나에서 쏟아지는 정리들', 'math', `
holomorphic      정칙함수
cauchy-riemann   코시-리만 방정식
power-series     멱급수
contour          선적분
cauchy           코시 정리
formula          코시 적분 공식
liouville        리우빌 정리와 대수학의 기본정리
maximum          최대 절댓값 원리
identity         항등 정리
morera           모레라 정리와 정칙함수의 극한
`);

export const mResidues = book('m-residues', '급수와 유수', '특이점 둘레에서 펼치고, 유수로 적분하기', 'math', `
taylor           테일러 급수
laurent          로랑 급수
singularities    특이점의 분류
residue          유수 정리
real-integrals   실적분의 계산
argument         편각 원리와 루셰 정리
sums             급수의 합
products         무한곱
gamma            감마 함수
zeta             제타 함수
`);

export const mConformal = book('m-conformal', '등각사상', '각을 지키는 사상과 영역을 원판으로 펴기', 'math', `
conformal        각을 지키는 사상
mobius           뫼비우스 변환의 분류
schwarz          슈바르츠 보조정리
automorphisms    원판과 반평면의 자기동형
normal           정규족
riemann          리만 사상 정리
christoffel      슈바르츠-크리스토펠 공식
harmonic         조화함수
dirichlet        디리클레 문제
physics          유체와 정전기에서
`);

export const mRiemannSurfaces = book('m-riemann-surfaces', '리만 곡면', '여러 값을 갖는 함수가 한 값을 갖게 되는 곡면', 'math', `
multivalued      여러 값을 갖는 함수
surfaces         리만 곡면
branched         분기 덮개
continuation     해석적 연속
genus            종수와 리만-후르비츠 공식
forms            미분형식과 적분
elliptic         타원함수
uniformization   균일화 정리
riemann-roch     리만-로흐 정리
curves           대수곡선과의 만남
`);

export const complexTexts = [mComplexVisual, mHolomorphic, mResidues, mConformal, mRiemannSurfaces];
