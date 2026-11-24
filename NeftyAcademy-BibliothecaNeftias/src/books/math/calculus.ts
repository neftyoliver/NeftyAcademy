/**
 * 수학 서가 · 미적분 (고등 → 학부). 변화와 쌓임을 다루는 여섯 권.
 * 차례는 우선 장 단위로 적어 둔다. 책을 쓰기 시작할 때 장을 쪽으로 쪼갠다.
 */
import { book } from '../outline';

export const mLimits = book('m-limits', '극한과 연속', '다가간다는 것: 수열과 함수의 극한, 끊기지 않는 그래프', 'math', `
approach         다가간다는 것
sequences        수열의 극한
function-limit   함수의 극한
laws             극한의 성질
infinite         무한대와 점근선
squeeze          샌드위치 정리
continuity       연속
ivt              사잇값 정리와 최대·최소 정리
e                극한으로 만나는 e
epsilon          엡실론과 델타
`);

export const mDerivatives = book('m-derivatives', '미분', '순간의 변화: 접선의 기울기, 미분법, 그래프의 모양, 최적화', 'math', `
slope            순간변화율과 접선
definition       도함수
rules            합, 곱, 몫의 미분법
chain            연쇄법칙
elementary       지수, 로그, 삼각함수의 미분
implicit         음함수와 역함수의 미분
shape            오르내림, 극값, 오목과 볼록
mvt              평균값 정리
optimization     최댓값과 최솟값 문제
approximation    선형 근사와 뉴턴 방법
motion           속도, 가속도, 관련 변화율
lhopital         로피탈의 정리
`);

export const mIntegrals = book('m-integrals', '적분', '잘게 나눠 쌓기: 넓이, 미적분의 기본정리, 적분법, 쓰임', 'math', `
area             넓이와 구분구적법
definite         정적분
ftc              미적분의 기본정리
antiderivative   부정적분
substitution     치환적분
parts            부분적분
techniques       유리함수와 삼각함수의 적분
applications     넓이, 부피, 길이
physics          일, 무게중심, 평균
improper         이상적분
numerical        수치적분
`);

export const mSeries = book('m-series', '급수와 테일러 전개', '끝없이 더하기: 수렴, 멱급수, 함수를 다항식으로 펼치기', 'math', `
infinite-sum     끝없는 합
geometric        등비급수
tests            수렴 판정법
alternating      교대급수와 절대수렴
power            멱급수
taylor           테일러 다항식
remainder        테일러 급수와 나머지
euler            오일러 공식
uses             급수로 하는 어림과 극한
fourier          삼각함수로 펼치기
`);

export const mMultivariable = book('m-multivariable', '다변수 미적분', '변수가 여럿일 때: 곡면, 편미분, 기울기, 다중적분', 'math', `
surfaces         이변수 함수, 곡면, 등고선
partial          편미분
gradient         기울기 벡터와 방향미분
tangent-plane    접평면과 선형 근사
chain            다변수 연쇄법칙
extrema          극값과 안장점
lagrange         라그랑주 승수법
double           이중적분
change           변수 바꾸기와 야코비안
triple           삼중적분
`);

export const mVectorCalculus = book('m-vector-calculus', '벡터 미적분', '장 위의 미적분: 선적분, 면적분, 그린, 스토크스, 발산 정리', 'math', `
fields           벡터장
line             선적분
conservative     보존장과 퍼텐셜
green            그린 정리
surface          곡면과 면적분
curl-div         회전과 발산
stokes           스토크스 정리
divergence       발산 정리
physics          유체와 전자기에서
forms            미분형식
`);

export const calculusTexts = [mLimits, mDerivatives, mIntegrals, mSeries, mMultivariable, mVectorCalculus];
