/**
 * 수학 서가 · 대수 (고등). 수와 식을 다루는 여섯 권.
 *
 *   수의 체계            세는 수에서 실수까지
 *   다항식과 인수분해    문자로 쓰는 식의 셈
 *   방정식과 부등식      식을 푼다는 것
 *   지수와 로그          거듭제곱을 넓히고 뒤집기
 *   수열과 귀납법        규칙이 있는 수의 줄
 *   복소수와 복소평면    제곱해서 −1이 되는 수
 *
 * 문제집은 index.ts 에서 기본서마다 저절로 붙는다(workbook.ts).
 */
import { book } from '../outline';

export const mNumbers = book('m-numbers', '수의 체계', '세는 수에서 실수까지, 수가 넓어지는 길', 'math', `
natural          세는 수
  nat-count        세기와 자연수
  nat-place        자릿값과 십진법
  nat-add          덧셈과 곱셈을 그림으로
  nat-laws         교환, 결합, 분배법칙
  nat-order        크기와 수직선
  nat-bases        이진법과 십육진법
divide           나눗셈과 약수
  div-remainder    몫과 나머지
  div-parity       짝수와 홀수
  div-divisor      약수와 배수
  div-prime        소수
  div-factor       소인수분해
  div-gcd          최대공약수와 호제법
  div-lcm          최소공배수
integer          정수
  int-negative     0과 음수
  int-add          정수의 덧셈과 뺄셈
  int-mul          정수의 곱셈과 나눗셈
  int-abs          절댓값
rational         유리수
  rat-fraction     분수의 세 얼굴
  rat-equal        같은 분수: 약분과 통분
  rat-add          분수의 덧셈과 뺄셈
  rat-mul          분수의 곱셈과 나눗셈
  rat-order        유리수의 크기와 수직선
  rat-dense        유리수는 빽빽하다
  rat-decimal      유한소수와 순환소수
  rat-percent      비율과 백분율
power            거듭제곱과 제곱근
  pow-exponent     거듭제곱과 지수법칙
  pow-zero-neg     지수가 0이거나 음수일 때
  pow-sci          아주 큰 수와 아주 작은 수
  pow-sqrt         제곱근
  pow-irrational   √2는 유리수가 아니다
  pow-radical      근호가 있는 식의 셈
  pow-nth          세제곱근과 n제곱근
real             실수
  real-line        수직선의 빈자리와 무리수
  real-decimal     끝없는 소수
  real-order       실수의 크기와 구간
  real-approx      어림과 오차
  real-pi          원주율 π
  real-complete    빈틈이 없다는 것
system           수의 체계 한눈에
  sys-closed       닫혀 있다는 것
  sys-rules        셈의 규칙 아홉 가지
  sys-infinite     무한의 크기
  sys-algebraic    대수적 수와 초월수
  sys-beyond       실수 다음의 수
`);

export const mPolynomials = book('m-polynomials', '다항식과 인수분해', '문자로 쓰는 식의 셈: 곱셈 공식, 나눗셈, 인수분해', 'math', `
terms            문자와 식
  term-letter      문자를 쓰는 까닭
  term-poly        항, 계수, 차수
  term-value       식의 값
  term-place       자릿값과 다항식
add-mul          다항식의 덧셈과 곱셈
  am-add           동류항 모으기: 덧셈과 뺄셈
  am-mul           곱셈: 분배법칙과 넓이
  am-degree        차수의 셈
  am-ring          다항식은 정수와 닮았다
formulas         곱셈 공식
  fm-square        합의 제곱과 차의 제곱
  fm-diff          합과 차의 곱
  fm-linear        일차식 둘의 곱
  fm-cube          세제곱 공식
  fm-variant       공식의 변형과 대칭인 식
factoring        인수분해
  fc-common        공통인수로 묶기
  fc-formula       공식을 거꾸로 쓰기
  fc-quadratic     이차식의 인수분해
  fc-group         묶기와 치환
  fc-cubic         세제곱의 합과 차
  fc-irreducible   더 쪼갤 수 없는 식
division         다항식의 나눗셈
  dv-long          세로로 나누기
  dv-theorem       몫과 나머지는 하나뿐
  dv-synthetic     조립제법
  dv-gcd           다항식의 최대공약수
remainder        나머지정리와 인수정리
  rm-remainder     나머지정리
  rm-factor        인수정리
  rm-rational      유리수 근 찾기
  rm-count         근의 개수는 차수 이하
identity         항등식과 미정계수법
  id-identity      항등식과 방정식
  id-coeff         미정계수법
  id-interp        점을 지나는 다항식
binomial         이항정리와 파스칼의 삼각형
  bn-pascal        파스칼의 삼각형
  bn-choose        고르는 방법의 수
  bn-theorem       이항정리
  bn-apps          이항정리의 쓰임
rational-expr    유리식과 부분분수
  re-define        유리식
  re-arith         유리식의 셈
  re-proper        몫과 나머지로 나누어 적기
  re-partial       부분분수
roots            다항식의 근과 계수
  rt-quadratic     이차식의 근과 계수
  rt-vieta         삼차 이상의 근과 계수
  rt-symmetric     근의 대칭식
  rt-graph         근과 그래프
  rt-complex       실수 근의 수와 복소수 근
`);

export const mEquations = book('m-equations', '방정식과 부등식', '식을 푼다는 것: 일차에서 고차까지, 연립과 부등식', 'math', `
balance          등식과 방정식
linear           일차방정식
systems          연립일차방정식
quadratic        이차방정식
higher           삼차방정식과 고차방정식
frac-root        분수방정식과 무리방정식
inequality       부등식
regions          연립부등식과 영역
absolute         절대부등식
approx           근을 어림하기
`);

export const mExpLog = book('m-exp-log', '지수와 로그', '거듭제곱을 넓히고 뒤집기: 지수의 확장, 로그, 로그 눈금', 'math', `
roots            거듭제곱근과 유리수 지수
real-exp         실수 지수
log-def          로그의 뜻
log-laws         로그의 성질
common           상용로그와 자릿수
natural          자연상수 e와 자연로그
scales           로그 눈금
equations        지수방정식과 로그방정식
inequalities     지수부등식과 로그부등식
growth           성장과 붕괴의 모형
`);

export const mSequences = book('m-sequences', '수열과 귀납법', '규칙이 있는 수의 줄: 등차, 등비, 합, 점화식, 수학적 귀납법', 'math', `
sequence         수열이란
arithmetic       등차수열
geometric        등비수열
sigma            합의 기호 Σ
sums             여러 가지 수열의 합
figurate         도형수와 차분
recurrence       점화식
induction        수학적 귀납법
fibonacci        피보나치 수열
limit            끝없이 더하기: 무한등비급수
`);

export const mComplexNumbers = book('m-complex-numbers', '복소수와 복소평면', '제곱해서 −1이 되는 수와 평면 위의 셈', 'math', `
imaginary        허수 단위 i
arithmetic       복소수의 사칙연산과 켤레
plane            복소평면
polar            절댓값과 편각
rotation         곱셈은 돌리고 늘리는 일
demoivre         드무아브르의 정리와 1의 거듭제곱근
euler            오일러 공식
roots            방정식의 복소수 근
fundamental      대수학의 기본정리
geometry         복소수로 하는 평면 기하
`);

export const algebraTexts = [mNumbers, mPolynomials, mEquations, mExpLog, mSequences, mComplexNumbers];
