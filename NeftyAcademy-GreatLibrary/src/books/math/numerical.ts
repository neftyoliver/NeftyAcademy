/**
 * 수학 서가 · 수치해석 (학부 → 석사). 수로 어림해 푸는 방법과 그 오차를 다루는 세 권.
 * 차례는 우선 장 단위로 적어 둔다. 책을 쓰기 시작할 때 장을 쪽으로 쪼갠다.
 */
import { book } from '../outline';

export const mNumerical = book('m-numerical', '수치해석 원론', '컴퓨터의 수로 어림하기: 오차, 근, 보간, 적분', 'math', `
floating         부동소수점과 오차
conditioning     조건수와 안정성
roots            방정식의 근
interpolation    보간
approximation    근사와 직교 다항식
differentiation  수치 미분
integration      수치 적분
linear           연립방정식 풀기
least-squares    최소제곱
optimization     최솟값 찾기
`);

export const mNumericalLa = book('m-numerical-la', '수치 선형대수', '큰 행렬을 안정하게 다루는 분해와 반복법', 'math', `
norms            노름과 조건수
lu               LU 분해
cholesky         촐레스키 분해
qr               QR 분해
svd              특잇값 분해
eigen            고윳값 알고리즘
iterative        반복법
krylov           크릴로프 부분공간 방법
sparse           성긴 행렬
preconditioning  선조건
`);

export const mNumericalDe = book('m-numerical-de', '미분방정식의 수치해법', '걸음을 나누어 미분방정식 풀기', 'math', `
euler            오일러 방법과 오차
runge-kutta      룽게-쿠타 방법
multistep        다단계 방법
stability        안정성과 굳은 방정식
adaptive         걸음 조절
boundary         경곗값 문제
difference       유한 차분법
element          유한 요소법
spectral         스펙트럼 방법
conservation     보존 법칙의 수치해법
`);

export const numericalTexts = [mNumerical, mNumericalLa, mNumericalDe];
