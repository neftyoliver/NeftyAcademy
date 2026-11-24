/**
 * 수학 서가 · 기하 (고등 → 학부). 도형과 공간을 다루는 여섯 권.
 * 차례는 우선 장 단위로 적어 둔다. 책을 쓰기 시작할 때 장을 쪽으로 쪼갠다.
 */
import { book } from '../outline';

export const mPlaneGeometry = book('m-plane-geometry', '평면도형 원론', '점, 선, 각에서 원과 닮음까지, 증명으로 쌓는 기하', 'math', `
basics           점, 선, 각
parallel         평행선과 각
congruence       삼각형의 합동
centers          삼각형의 중심들
quadrilateral    사각형
similarity       닮음
pythagoras       피타고라스 정리
circle           원: 현, 접선, 원주각
area             넓이
construction     자와 컴퍼스로 하는 작도
solids           다면체와 회전체
axioms           공리와 증명의 체계
`);

export const mCoordinateConics = book('m-coordinate-conics', '좌표기하와 이차곡선', '도형을 식으로: 직선, 원, 포물선, 타원, 쌍곡선', 'math', `
coordinates      좌표와 거리
line             직선의 방정식
circle           원의 방정식
locus            자취
parabola         포물선
ellipse          타원
hyperbola        쌍곡선
sections         원뿔을 자른 단면
tangent          접선
eccentricity     이심률과 준선
general          일반 이차식과 회전
`);

export const mVectorsSpace = book('m-vectors-space', '벡터와 공간도형', '화살표로 하는 기하: 성분, 내적, 외적, 직선과 평면', 'math', `
vector           화살표로서의 벡터
operations       벡터의 덧셈과 실수배
components       성분과 좌표
dot              내적
space            공간좌표
lines-planes     공간의 직선과 평면
cross            외적
distance         거리와 각
projection       공간도형과 정사영
sphere           구의 방정식
volume           부피와 삼중곱
`);

export const mTransformations = book('m-transformations', '변환의 기하', '옮기고 돌리고 뒤집기: 대칭, 닮음, 반전, 무늬', 'math', `
isometry         옮기기, 돌리기, 뒤집기
composition      변환의 합성
symmetry         도형의 대칭
similarity       닮음변환
matrix           행렬로 쓰는 변환
affine           아핀변환
patterns         띠 무늬와 벽지 무늬
tessellation     테셀레이션
inversion        원에 대한 반전
invariants       변환과 변하지 않는 것
`);

export const mProjective = book('m-projective', '사영기하', '보이는 대로의 기하: 소실점, 쌍대성, 복비', 'math', `
perspective      원근법과 소실점
infinity         무한원점과 사영평면
homogeneous      동차좌표
duality          쌍대성
desargues        데자르그 정리와 파푸스 정리
cross-ratio      복비
maps             사영변환
conics           사영기하의 이차곡선
pascal           파스칼 정리와 브리앙숑 정리
axioms           사영평면의 공리와 유한 사영평면
`);

export const mNoneuclid = book('m-noneuclid', '비유클리드 기하', '평행선이 다르게 행동하는 세계: 구면과 쌍곡 평면', 'math', `
parallel         평행선 공준
sphere           구면 위의 기하
spherical-area   구면삼각형과 넓이
models           쌍곡 평면의 모형들
lines            쌍곡 평면의 직선과 각
hyperbolic-area  쌍곡삼각형과 넓이
isometries       쌍곡 평면의 등거리변환
tilings          쌍곡 평면의 타일 붙이기
curvature        곡률로 보는 세 기하
consistency      모형과 무모순성
`);

export const geometryTexts = [mPlaneGeometry, mCoordinateConics, mVectorsSpace, mTransformations, mProjective, mNoneuclid];
