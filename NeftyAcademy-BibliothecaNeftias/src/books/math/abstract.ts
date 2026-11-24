/**
 * 수학 서가 · 대수학 (학부 → 석사). 군, 환, 체와 그 너머의 아홉 권.
 * 차례는 우선 장 단위로 적어 둔다. 책을 쓰기 시작할 때 장을 쪽으로 쪼갠다.
 */
import { book } from '../outline';

export const mSymmetryGroups = book('m-symmetry-groups', '대칭과 군 첫걸음', '도형을 돌리고 뒤집는 데서 시작하는 군', 'math', `
symmetry         도형의 대칭
composition      대칭을 이어 하기
tables           곱셈표
group            군의 뜻
permutations     치환
cyclic           순환군과 시계 셈
subgroups        부분군
cosets           잉여류와 라그랑주 정리
isomorphism      같은 군
actions          군이 움직이는 것
`);

export const mGroups = book('m-groups', '군론', '준동형, 몫군, 작용, 실로우 정리', 'math', `
axioms           군의 공리와 예
homomorphisms    준동형
normal           정규부분군과 몫군
isomorphisms     동형 정리
actions          군의 작용
sylow            실로우 정리
abelian          유한 생성 아벨 군
solvable         가해군과 멱영군
free             자유군과 표시
simple           단순군과 조르당-횔더 정리
`);

export const mRings = book('m-rings', '환과 아이디얼', '더하고 곱할 수 있는 구조: 아이디얼, 몫환, 인수분해', 'math', `
ring             환의 뜻과 예
ideals           아이디얼과 몫환
homomorphisms    환 준동형
domains          정역과 분수체
prime-maximal    소 아이디얼과 극대 아이디얼
polynomial       다항식환
euclidean        유클리드 정역, PID, UFD
factorization    다항식의 인수분해
crt              중국인의 나머지 정리
noetherian       뇌터 환
`);

export const mModules = book('m-modules', '가군', '환 위의 벡터공간: 완전열, 텐서곱, 구조 정리', 'math', `
module           가군의 뜻
quotient         부분가군과 몫가군
free             자유 가군
exact            완전열
tensor           텐서곱
pid              PID 위의 유한 생성 가군
projective       사영 가군과 단사 가군
chains           사슬 조건
semisimple       반단순 가군
localization     국소화
`);

export const mFieldsGalois = book('m-fields-galois', '체와 갈루아 이론', '방정식의 근의 대칭: 체의 확대와 갈루아 대응', 'math', `
fields           체와 확대
algebraic        대수적 확대
constructions    작도할 수 있는 수
splitting        분해체
separable        분리 확대와 정규 확대
galois-group     갈루아 군
correspondence   갈루아 대응
radicals         거듭제곱근으로 풀기
finite           유한체
cyclotomic       원분체
`);

export const mCommutative = book('m-commutative', '가환대수', '대수기하와 정수론의 바탕이 되는 환의 이론', 'math', `
ideals           아이디얼의 셈
localization     국소화
spectrum         소 스펙트럼
noetherian       뇌터 환과 힐베르트 기저 정리
primary          준소 분해
integral         정수적 확대
nullstellensatz  영점 정리
dimension        차원
dedekind         이산 값매김 환과 데데킨트 정역
completion       완비화
`);

export const mHomological = book('m-homological', '호몰로지 대수', '사슬 복합체와 유도 함자', 'math', `
complexes        사슬 복합체
homology         호몰로지
exact            긴 완전열
resolutions      분해
derived          유도 함자
ext              Ext
tor              Tor
spectral         스펙트럼 열
group            군의 코호몰로지
category         유도 범주
`);

export const mRepresentations = book('m-representations', '군의 표현론', '군을 행렬로 나타내기: 지표와 지표표', 'math', `
representation   표현이란
maschke          완전 가약성
schur            슈어의 보조정리
characters       지표
orthogonality    직교 관계
tables           지표표
induced          유도 표현
symmetric        대칭군의 표현
burnside         번사이드의 정리
compact          콤팩트 군
`);

export const mLie = book('m-lie', '리 대수와 리 군', '연속인 대칭과 그 무한소: 행렬 군, 리 대수, 근계', 'math', `
matrix-groups    행렬 군
exponential      지수 사상
lie-algebra      리 대수
correspondence   리 군과 리 대수의 대응
sl2              sl(2)의 표현
solvable         가해 리 대수와 반단순 리 대수
roots            근계
classification   딘킨 도형과 분류
weights          무게와 표현
compact          콤팩트 리 군
`);

export const abstractTexts = [mSymmetryGroups, mGroups, mRings, mModules, mFieldsGalois, mCommutative, mHomological, mRepresentations, mLie];
