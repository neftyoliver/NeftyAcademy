/**
 * 수학 서가 · 확률론 (학부 → 석사). 측도 위에 세운 확률의 다섯 권.
 * 차례는 우선 장 단위로 적어 둔다. 책을 쓰기 시작할 때 장을 쪽으로 쪼갠다.
 */
import { book } from '../outline';

export const mMeasureProbability = book('m-measure-probability', '측도로 보는 확률', '확률은 측도, 확률변수는 가측함수, 기댓값은 적분', 'math', `
spaces           확률공간
random           확률변수는 가측함수
expectation      기댓값은 적분
independence     독립
distributions    분포와 분포함수
conditional      조건부 기댓값
inequalities     부등식들
convergence      수렴의 종류
borel-cantelli   보렐-칸텔리 보조정리
extension        콜모고로프의 확장 정리
`);

export const mLimitTheorems = book('m-limit-theorems', '극한 정리', '많이 모으면 생기는 질서: 큰 수의 법칙과 중심극한정리', 'math', `
weak-lln         큰 수의 약한 법칙
strong-lln       큰 수의 강한 법칙
characteristic   특성함수
weak             분포 수렴
clt              중심극한정리
lindeberg        린데베르그 조건
rate             수렴의 빠르기
deviations       큰 편차
stable           안정 분포
lil              반복 로그의 법칙
`);

export const mMarkov = book('m-markov', '마르코프 연쇄', '지금만 보고 다음을 정하는 과정', 'math', `
chain            마르코프 연쇄
transition       전이 행렬
classification   상태의 분류
stationary       정상 분포
convergence      수렴 정리
reversible       가역 연쇄
random-walk      마구잡이 걷기
hitting          도달 시간
mcmc             마르코프 연쇄 몬테카를로
continuous       연속 시간 연쇄와 포아송 과정
`);

export const mMartingales = book('m-martingales', '마팅게일', '공정한 놀이의 수학', 'math', `
fair             공정한 놀이
filtration       조건부 기댓값과 여과
martingale       마팅게일의 뜻
stopping         멈춤 시간
optional         선택적 멈춤 정리
inequalities     두브 부등식
convergence      수렴 정리
uniform          균등 적분 가능성
uses             쓰임새
continuous       연속 시간 마팅게일
`);

export const mBrownian = book('m-brownian', '브라운 운동과 확률 미적분', '끝없이 떨리는 길 위의 미적분', 'math', `
random-walk      마구잡이 걷기의 극한
brownian         브라운 운동
paths            길의 성질
markov           마르코프 성질과 반사 원리
ito-integral     이토 적분
ito-formula      이토 공식
sde              확률 미분방정식
girsanov         측도 바꾸기
pde              편미분방정식과의 관계
uses             쓰임새
`);

export const probabilityTexts = [mMeasureProbability, mLimitTheorems, mMarkov, mMartingales, mBrownian];
