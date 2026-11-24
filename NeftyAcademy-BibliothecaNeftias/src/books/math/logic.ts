/**
 * 수학 서가 · 논리 (고등 → 석사). 증명, 집합, 수의 구성에서 수리논리와 유형 이론까지 여덟 권.
 * 차례는 우선 장 단위로 적어 둔다. 책을 쓰기 시작할 때 장을 쪽으로 쪼갠다.
 */
import { book } from '../outline';

export const mProofs = book('m-proofs', '논리와 증명', '참과 거짓을 다루는 말, 그리고 증명을 읽고 쓰는 법', 'math', `
statements       명제와 진리값
connectives      그리고, 또는, 아니다, 이면
truth-table      진리표와 동치
quantifiers      모든과 어떤
direct           직접 증명
contrapositive   대우와 귀류법
cases            경우 나누기와 반례
induction        수학적 귀납법
existence        존재와 유일성의 증명
writing          증명을 쓰는 법
`);

export const mSets = book('m-sets', '집합과 대응', '수학의 말: 집합, 관계, 함수, 그리고 무한의 크기', 'math', `
set              집합과 원소
operations       합집합, 교집합, 여집합
product          순서쌍과 곱집합
relations        관계
equivalence      동치관계와 분할
functions        함수: 단사, 전사, 전단사
order            순서관계
cardinality      집합의 크기
countable        셀 수 있는 무한과 없는 무한
paradox          러셀의 역설과 공리의 필요
`);

export const mNumberConstruction = book('m-number-construction', '수의 구성', '자연수에서 실수까지를 집합과 논리로 다시 짓기', 'math', `
peano            페아노 공리와 자연수
recursion        귀납적 정의: 덧셈과 곱셈
integers         순서쌍으로 만드는 정수
rationals        동치류로 만드는 유리수
ordered-field    순서체
dedekind         데데킨트 절단
cauchy           코시 수열로 만드는 실수
completeness     완비성과 유일성
complex          복소수의 구성
beyond           사원수와 그 너머
`);

export const mMathLogic = book('m-math-logic', '수리논리', '증명 자체를 수학의 대상으로: 형식 체계, 모형, 완전성', 'math', `
propositional    명제논리의 문법과 의미
natural          자연 연역
soundness        건전성과 완전성
first-order      1차 논리의 언어
structures       구조와 참
deduction        1차 논리의 증명
completeness     괴델의 완전성 정리
compactness      콤팩트성 정리
lowenheim        뢰벤하임-스콜렘 정리
theories         이론과 공리화
`);

export const mSetTheory = book('m-set-theory', '집합론', '공리로 다시 세운 집합: 순서수, 기수, 선택공리', 'math', `
zfc              ZFC 공리
ordinals         순서수
transfinite      초한 귀납과 재귀
cardinals        기수
choice           선택공리와 동치인 명제들
arithmetic       기수의 셈
continuum        연속체 가설
hierarchy        누적 위계
constructible    구성 가능 집합
forcing          강제법
`);

export const mComputability = book('m-computability', '계산 가능성과 불완전성', '셈할 수 있는 것의 끝과 증명할 수 있는 것의 끝', 'math', `
algorithm        알고리즘이란
turing           튜링 기계
recursive        재귀 함수
church           처치-튜링 논제
halting          정지 문제
reductions       환원과 결정할 수 없는 문제들
arithmetic       산술의 형식 체계
numbering        괴델 수
first            제1 불완전성 정리
second           제2 불완전성 정리
`);

export const mModelTheory = book('m-model-theory', '모형 이론', '이론과 그 모형들 사이의 관계', 'math', `
models           구조와 모형
elementary       기본 동치와 기본 확대
compactness      콤팩트성의 쓰임
types            형
elimination      양화사 소거
categoricity     범주성
ultraproducts    초곱
nonstandard      비표준 모형과 무한소
saturation       포화 모형
definable        정의 가능 집합과 o-최소 구조
`);

export const mTypeTheory = book('m-type-theory', '유형 이론', '명제는 유형이고 증명은 프로그램이다', 'math', `
lambda           람다 계산
simple           단순 유형
curry-howard     명제는 유형이다
products-sums    곱 유형과 합 유형
dependent        의존 유형
inductive        귀납 유형
identity         항등 유형
universes        우주
assistants       증명 보조기
homotopy         호모토피 유형 이론
`);

export const logicTexts = [mProofs, mSets, mNumberConstruction, mMathLogic, mSetTheory, mComputability, mModelTheory, mTypeTheory];
