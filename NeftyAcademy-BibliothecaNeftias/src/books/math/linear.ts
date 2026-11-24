/**
 * 수학 서가 · 선형대수학 (고등 → 석사). 벡터와 행렬에서 텐서까지 일곱 권.
 * 차례는 우선 장 단위로 적어 둔다. 책을 쓰기 시작할 때 장을 쪽으로 쪼갠다.
 */
import { book } from '../outline';

export const mLaFirst = book('m-la-first', '벡터와 행렬 첫걸음', '그림으로 한 바퀴: 화살표, 연립방정식, 변환으로서의 행렬', 'math', `
vectors          화살표와 수의 줄
combos           일차결합과 펼침
systems          연립일차방정식과 소거
matrices         행렬과 그 셈
transformations  행렬은 변환이다
inverse          역행렬
determinant      행렬식은 넓이의 배율
dot              내적과 정사영
eigen            고윳값과 고유벡터
uses             쓰임새: 그래프, 그림, 자료
`);

export const mVectorSpaces = book('m-vector-spaces', '벡터공간과 선형사상', '공리에서 시작하는 선형대수: 기저, 차원, 선형사상', 'math', `
axioms           벡터공간의 공리
subspaces        부분공간
independence     일차독립과 기저
dimension        차원
linear-maps      선형사상
kernel-image     핵과 상, 차원 정리
matrix           선형사상의 행렬
change-basis     기저 바꾸기
quotient         몫공간
dual             쌍대공간
`);

export const mDeterminants = book('m-determinants', '행렬식', '부피의 배율이라는 한 가지 생각에서 나오는 모든 성질', 'math', `
volume           부피로 보는 행렬식
alternating      교대 다중선형 형식
permutations     치환과 부호
expansion        여인수 전개
properties       행렬식의 성질
product          곱의 행렬식
cramer           크라메르 공식과 수반행렬
computation      행렬식의 셈법
special          특별한 행렬식
orientation      방향과 부호
`);

export const mEigen = book('m-eigen', '고윳값과 대각화', '변환이 방향을 지키는 곳: 고윳값, 대각화, 그 쓰임', 'math', `
eigen            고윳값과 고유벡터
characteristic   특성다항식
diagonalization  대각화
powers           행렬의 거듭제곱과 점화식
complex          복소 고윳값과 회전
cayley           케일리-해밀턴 정리
minimal          최소다항식
markov           마르코프 행렬
differential     연립 미분방정식
perron           양의 행렬
`);

export const mInnerProduct = book('m-inner-product', '내적과 직교', '길이와 각이 있는 벡터공간: 직교, 정사영, 스펙트럼 정리', 'math', `
inner            내적공간
orthogonal       직교와 정규직교기저
gram-schmidt     그람-슈미트 과정
projection       정사영과 최소제곱
adjoint          수반 사상
spectral         스펙트럼 정리
quadratic        이차형식
positive         양의 정부호 행렬
svd              특잇값 분해
unitary          유니터리 행렬과 정규 행렬
`);

export const mCanonicalForms = book('m-canonical-forms', '표준형', '대각화되지 않는 행렬의 가장 단순한 꼴', 'math', `
invariant        불변 부분공간
triangular       삼각화
nilpotent        멱영 사상
generalized      일반화된 고유공간
jordan           조르당 표준형
rational         유리 표준형
modules          PID 위의 가군으로 보기
smith            스미스 표준형
functions        행렬의 함수와 지수
similarity       닮음의 분류
`);

export const mTensors = book('m-tensors', '텐서와 다중선형대수', '여러 벡터를 한꺼번에 받는 사상: 텐서곱, 외대수', 'math', `
bilinear         쌍선형 형식
multilinear      다중선형 사상
tensor-product   텐서곱
components       성분과 첨자
symmetric        대칭 텐서
exterior         외대수
determinant      외대수로 보는 행렬식
contraction      축약과 대각합
algebra          텐서 대수
uses             텐서의 쓰임
`);

export const linearTexts = [mLaFirst, mVectorSpaces, mDeterminants, mEigen, mInnerProduct, mCanonicalForms, mTensors];
