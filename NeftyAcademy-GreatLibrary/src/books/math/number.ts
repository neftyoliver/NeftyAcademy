/**
 * 수학 서가 · 정수론 (고등 → 석사). 정수의 성질을 다루는 다섯 권.
 * 차례는 우선 장 단위로 적어 둔다. 책을 쓰기 시작할 때 장을 쪽으로 쪼갠다.
 */
import { book } from '../outline';

export const mNtElementary = book('m-nt-elementary', '초등 정수론', '나누어떨어짐에서 합동식과 원시근까지', 'math', `
divisibility     나누어떨어짐
euclid           유클리드 호제법
primes           소수와 산술의 기본정리
congruence       합동식
linear           일차 합동식과 중국인의 나머지 정리
fermat           페르마 소정리와 오일러 정리
primitive        원시근
functions        수론적 함수
diophantine      일차 부정방정식
rsa              공개키 암호
`);

export const mNtQuadratic = book('m-nt-quadratic', '이차 잉여와 디오판토스 방정식', '제곱수의 합동과 정수해를 찾는 방정식', 'math', `
residues         이차 잉여
legendre         르장드르 기호
reciprocity      이차 상호 법칙
jacobi           야코비 기호
squares          제곱수의 합
pythagorean      피타고라스 세 쌍
pell             펠 방정식
continued        연분수
forms            이진 이차 형식
descent          무한 강하법
`);

export const mNtAlgebraic = book('m-nt-algebraic', '대수적 정수론', '수체의 정수환에서 다시 하는 소인수분해', 'math', `
gaussian         가우스 정수
fields           수체
integers         대수적 정수
ideals           아이디얼의 소인수분해
class-group      유군
units            단수 정리
ramification     분기
quadratic        이차 수체
cyclotomic       원분체
local            p진수와 국소체
`);

export const mNtAnalytic = book('m-nt-analytic', '해석적 정수론', '소수를 해석학으로 세기: 제타 함수와 소수 정리', 'math', `
counting         소수 세기
averages         수론적 함수의 평균
dirichlet        디리클레 급수
zeta             리만 제타 함수
pnt              소수 정리
characters       디리클레 지표
progressions     등차수열 속의 소수
l-functions      L-함수
sieve            체 방법
riemann          리만 가설
`);

export const mEllipticModular = book('m-elliptic-modular', '타원곡선과 모듈러 형식', '삼차곡선 위의 덧셈에서 모듈러성까지', 'math', `
cubic            삼차곡선과 점의 덧셈
group            타원곡선의 군 구조
complex          복소수 위의 타원곡선과 격자
finite           유한체 위의 타원곡선
rational         유리점과 모델-베유 정리
modular-group    모듈러 군
forms            모듈러 형식
hecke            헤케 작용소
l-function       타원곡선의 L-함수
modularity       모듈러성
`);

export const numberTexts = [mNtElementary, mNtQuadratic, mNtAlgebraic, mNtAnalytic, mEllipticModular];
