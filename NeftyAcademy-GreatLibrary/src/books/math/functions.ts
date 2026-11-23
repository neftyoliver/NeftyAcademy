/**
 * 수학 서가 · 함수 (고등). 대응과 그래프를 다루는 다섯 권.
 * 차례는 우선 장 단위로 적어 둔다. 책을 쓰기 시작할 때 장을 쪽으로 쪼갠다.
 */
import { book } from '../outline';

export const mFunctions = book('m-functions', '함수와 그래프', '대응으로 보는 함수, 그래프를 읽고 옮기고 합치는 법', 'math', `
correspondence   대응과 함수
graph            좌표평면과 그래프
reading          그래프 읽기: 오르내림, 최대와 최소
linear           일차함수와 기울기
quadratic        이차함수와 포물선
transform        그래프의 이동과 대칭
compose          합성함수
inverse          역함수
piecewise        절댓값 함수와 구간별 함수
models           함수로 현상을 나타내기
`);

export const mPolyRational = book('m-poly-rational', '다항함수와 유리함수', '그래프의 모양을 식에서 읽기: 근, 끝의 모습, 점근선', 'math', `
power            거듭제곱 함수
cubic            삼차함수와 사차함수
roots            근과 인수: 그래프가 축을 만나는 곳
end              끝의 모습과 차수
symmetry         짝함수와 홀함수
rational         유리함수와 점근선
radical          무리함수
inequalities     그래프로 푸는 부등식
interpolation    점을 지나는 다항식
rate             평균변화율
`);

export const mExpLogFunctions = book('m-exp-log-functions', '지수함수와 로그함수', '배로 느는 것과 그 거꾸로: 그래프, 자연상수, 로그 눈금', 'math', `
exp-graph        지수함수의 그래프
growth           배로 늘기와 반으로 줄기
e                자연상수 e
log-graph        로그함수의 그래프
inverse          지수와 로그는 서로 역함수
transform        그래프의 이동과 밑의 바꿈
semi-log         로그 눈금의 그래프
equations        그래프로 푸는 방정식과 부등식
logistic         로지스틱 곡선
hyperbolic       쌍곡선함수
`);

export const mTrig = book('m-trig', '삼각함수', '각에서 파동까지: 삼각비, 단위원, 그래프, 덧셈정리', 'math', `
ratio            직각삼각형의 삼각비
radian           호도법
circle           단위원과 삼각함수
graphs           사인, 코사인, 탄젠트의 그래프
identities       삼각함수 사이의 관계
addition         덧셈정리
double           배각, 반각, 합과 곱
laws             사인법칙과 코사인법칙
inverse          역삼각함수
equations        삼각방정식과 삼각부등식
waves            파동과 삼각함수의 합성
`);

export const mParametricPolar = book('m-parametric-polar', '매개변수와 극좌표', '곡선을 그리는 다른 방법: 움직이는 점, 각과 거리', 'math', `
parametric       매개변수로 나타낸 곡선
motion           움직이는 점의 자취
cycloid          사이클로이드와 굴림 곡선
lissajous        리사주 도형
implicit         음함수와 곡선
polar            극좌표
polar-curves     극좌표의 곡선: 장미, 심장형, 나선
convert          좌표 바꾸기
conics           극좌표로 본 이차곡선
space            공간의 좌표: 원기둥좌표와 구면좌표
`);

export const functionTexts = [mFunctions, mPolyRational, mExpLogFunctions, mTrig, mParametricPolar];
