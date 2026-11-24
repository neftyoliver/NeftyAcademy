/**
 * 수학 서가 · 위상수학 (학부 → 석사). 늘이고 구부려도 변하지 않는 성질을 다루는 다섯 권.
 * 차례는 우선 장 단위로 적어 둔다. 책을 쓰기 시작할 때 장을 쪽으로 쪼갠다.
 */
import { book } from '../outline';

export const mTopologyFirst = book('m-topology-first', '위상 첫걸음', '고무판 기하: 곡면, 매듭, 구멍을 세는 법', 'math', `
rubber           고무판 기하
gluing           붙여서 만드는 곡면
euler            오일러 표수
orientation      뫼비우스 띠와 방향
classification   곡면의 분류
knots            매듭
graphs           그래프와 평면
continuity       연속과 가까움
fixed            고정점 정리
holes            구멍을 세는 법
`);

export const mGeneralTopology = book('m-general-topology', '일반위상', '열린집합만으로 하는 수학: 연속, 연결, 콤팩트', 'math', `
topology         위상공간
basis            기저와 부분기저
continuous       연속사상과 위상동형
constructions    부분공간, 곱공간, 몫공간
connected        연결성
compact          콤팩트성
separation       분리 공리
countability     가산 공리
metrization      거리화
tychonoff        티호노프 정리
`);

export const mFundamentalGroup = book('m-fundamental-group', '기본군과 덮개공간', '고리로 공간을 재기', 'math', `
homotopy         호모토피
fundamental      기본군
circle           원의 기본군
van-kampen       자이페르트-판 캄펀 정리
covering         덮개공간
lifting          올림
classification   덮개공간의 분류
deck             덮개 변환
uses             쓰임: 고정점과 대수학의 기본정리
higher           고차 호모토피 군
`);

export const mHomology = book('m-homology', '호몰로지와 코호몰로지', '구멍을 대수로 세기', 'math', `
simplicial       단체 복합체
simplicial-h     단체 호몰로지
singular         특이 호몰로지
exact            완전열과 절단
mayer-vietoris   마이어-피토리스 열
cellular         세포 호몰로지
euler            오일러 표수와 레프셰츠 정리
cohomology       코호몰로지
cup              컵 곱
duality          푸앵카레 쌍대성
`);

export const mDiffTopology = book('m-diff-topology', '미분위상', '매끄러운 다양체와 매끄러운 사상', 'math', `
manifolds        매끄러운 다양체
tangent          접공간
regular          정칙값과 사드의 정리
transversality   횡단성
degree           사상의 차수
vector-fields    벡터장과 지표
morse            모스 이론
embedding        매장 정리
cobordism        보충경계
de-rham          드람 코호몰로지
`);

export const topologyTexts = [mTopologyFirst, mGeneralTopology, mFundamentalGroup, mHomology, mDiffTopology];
