/**
 * 수학 서가 · 대수기하학 (석사). 다항식의 해가 그리는 도형을 다루는 세 권.
 * 차례는 우선 장 단위로 적어 둔다. 책을 쓰기 시작할 때 장을 쪽으로 쪼갠다.
 */
import { book } from '../outline';

export const mAlgebraicCurves = book('m-algebraic-curves', '대수곡선', '식 하나가 그리는 곡선: 특이점, 교점, 종수', 'math', `
curves           식으로 그린 곡선
singular         특이점과 접선
projective       사영평면의 곡선
bezout           베주 정리
cubics           삼차곡선
rational         유리 곡선과 매개화
genus            종수
divisors         인자
riemann-roch     리만-로흐 정리
resolution       특이점 풀기
`);

export const mVarieties = book('m-varieties', '아핀 다양체와 사영 다양체', '도형과 환 사이의 사전', 'math', `
affine           아핀 다양체
nullstellensatz  영점 정리와 사전
coordinate-ring  좌표환
morphisms        사상
projective       사영 다양체
rational-maps    유리 사상
dimension        차원
smooth           매끄러움과 접공간
products         곱과 세그레 매장
grassmannian     그라스만 다양체
`);

export const mSchemes = book('m-schemes', '층과 스킴 첫걸음', '환마다 공간을 하나씩: 스펙트럼, 층, 스킴', 'math', `
spec             환의 스펙트럼
sheaves          층
schemes          스킴
morphisms        스킴의 사상
fiber            올곱
properties       스킴의 성질
quasi-coherent   준연접층
line-bundles     선다발과 인자
cohomology       층 코호몰로지
curves           스킴으로 다시 보는 곡선
`);

export const alggeoTexts = [mAlgebraicCurves, mVarieties, mSchemes];
