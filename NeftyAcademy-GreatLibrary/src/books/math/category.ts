/**
 * 수학 서가 · 범주론 (학부 → 석사). 화살표로 수학을 묶는 두 권.
 * 차례는 우선 장 단위로 적어 둔다. 책을 쓰기 시작할 때 장을 쪽으로 쪼갠다.
 */
import { book } from '../outline';

export const mCategoryFirst = book('m-category-first', '범주론 첫걸음', '대상보다 화살표: 범주, 함자, 자연 변환, 보편 성질', 'math', `
arrows           화살표로 생각하기
categories       범주
functors         함자
natural          자연 변환
universal        보편 성질
products         곱과 쌍대곱
limits           극한
duality          쌍대
yoneda           요네다 보조정리
examples         수학 곳곳의 범주
`);

export const mAdjoints = book('m-adjoints', '수반, 극한, 모나드', '범주론의 세 기둥과 그 쓰임', 'math', `
limits           극한과 쌍대극한
adjunctions      수반
units            단위와 쌍대단위
preservation     수반과 극한
monads           모나드
algebras         모나드의 대수
abelian          아벨 범주
monoidal         모노이드 범주
kan              칸 확장
topos            토포스
`);

export const categoryTexts = [mCategoryFirst, mAdjoints];
