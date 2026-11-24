/**
 * 수학 서가 · 미분기하학 (학부 → 석사). 굽은 것을 미분으로 재는 네 권.
 * 차례는 우선 장 단위로 적어 둔다. 책을 쓰기 시작할 때 장을 쪽으로 쪼갠다.
 */
import { book } from '../outline';

export const mCurvesSurfaces = book('m-curves-surfaces', '곡선과 곡면', '얼마나 굽었나: 곡률, 기본형식, 가우스-보네 정리', 'math', `
curves           곡선과 호의 길이
curvature        곡률
frenet           프레네 틀
surfaces         곡면과 매개화
first            제1 기본형식
second           제2 기본형식
gauss            가우스 곡률
theorema         가우스의 빼어난 정리
geodesics        측지선
gauss-bonnet     가우스-보네 정리
`);

export const mManifolds = book('m-manifolds', '다양체와 미분형식', '좌표를 넘어서: 접공간, 미분형식, 스토크스 정리', 'math', `
manifolds        다양체
tangent          접벡터와 접다발
vector-fields    벡터장과 흐름
bracket          리 괄호
forms            미분형식
exterior         외미분
integration      형식의 적분
stokes           스토크스 정리
de-rham          드람 코호몰로지
lie-groups       리 군
`);

export const mTensorAnalysis = book('m-tensor-analysis', '텐서 해석', '좌표를 바꿔도 뜻이 남는 양과 그 미분', 'math', `
tensors          텐서장
index            첨자 표기
metric           계량 텐서
covariant        공변미분
christoffel      크리스토펠 기호
parallel         평행 이동
curvature        리만 곡률 텐서
ricci            리치 텐서와 스칼라 곡률
lie-derivative   리 미분
relativity       일반 상대론에서
`);

export const mRiemannian = book('m-riemannian', '리만 기하', '계량이 정하는 기하: 측지선, 곡률, 위상', 'math', `
metrics          리만 계량
connection       레비-치비타 접속
geodesics        측지선과 지수 사상
curvature        곡률
jacobi           야코비 장
completeness     호프-리노브 정리
comparison       비교 정리
constant         상수 곡률 공간
variations       변분 공식
topology         곡률과 위상
`);

export const diffgeoTexts = [mCurvesSurfaces, mManifolds, mTensorAnalysis, mRiemannian];
