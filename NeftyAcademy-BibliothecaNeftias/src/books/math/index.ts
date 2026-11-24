/**
 * 수학 서가. 고등학교에서 분야마다의 석사 과정까지, 분야 스물셋으로 나눈다.
 *
 *   수학
 *   ├─ 대수 (서가)
 *   │  ├─ 수의 체계          ← 기본서
 *   │  ├─ 수의 체계 문제집   ← 기본서 바로 옆에, 차례가 같은 문제집 (workbook.ts 가 만든다)
 *   │  └─ …
 *   ├─ 함수, 기하, 미적분, …
 *   └─ 수학사 (서가)         ← 문제집이 없다. 다른 책들은 쪽 끝의 참고 문서에서 이리로 링크만 건다
 *
 * 기본서 126권 + 문제집 126권 + 수학사 17권 = 269권.
 *
 * 책을 쓰는 규칙
 *  - 분야의 첫 책은 그림과 쉬운 개념으로 전체를 한 바퀴 돈다. 정의와 증명은 뒤의 책에서 한다
 *  - 뒤 분야의 쉬운 개념은 앞 책의 장에 미리 나온다(대칭 → 군, 넓이 → 측도)
 *  - 한 쪽 안에서도 그림과 예 → 정의 → 정리와 증명의 차례로 쓴다
 *  - 기본서와 문제집의 본문에는 역사 이야기를 쓰지 않는다. 사람, 정리, 문제의 내력은 수학사의 쪽에 쓰고 링크한다
 *  - 차례는 우선 장 단위로 적어 두고, 책을 쓰기 시작할 때 장을 쪽으로 쪼갠다
 *
 * id 는 기본서 m-이름, 문제집 m-이름-w, 수학사 mh-이름. 이 머리글자로 시작하는 폴더의 .mdx 에서만
 * $수식$ 을 읽는다(vite.config.ts 의 mdxMath).
 */
import type { Book } from 'paragoniahex';
import { abstractTexts } from './abstract';
import { algebraTexts } from './algebra';
import { alggeoTexts } from './alggeo';
import { analysisTexts } from './analysis';
import { appliedTexts } from './applied';
import { calculusTexts } from './calculus';
import { categoryTexts } from './category';
import { complexTexts } from './complex';
import { diffeqTexts } from './diffeq';
import { diffgeoTexts } from './diffgeo';
import { discreteTexts } from './discrete';
import { functionTexts } from './functions';
import { geometryTexts } from './geometry';
import { historyBooks } from './history';
import { linearTexts } from './linear';
import { logicTexts } from './logic';
import { numberTexts } from './number';
import { numericalTexts } from './numerical';
import { optimizationTexts } from './optimization';
import { probabilityTexts } from './probability';
import { probstatTexts } from './probstat';
import { statisticsTexts } from './statistics';
import { topologyTexts } from './topology';
import { workbook } from './workbook';

/** 분야 하나: 기본서마다 문제집을 바로 옆에 놓는다 */
const field = (id: string, title: string, subtitle: string, texts: Book[]): Book => ({
  id: `math-${id}`,
  title,
  subtitle,
  category: 'math',
  chapters: [],
  books: texts.flatMap((text) => [text, workbook(text)]),
});

/** 수학사: 문제집 없이 책만 놓는다 */
const history: Book = {
  id: 'math-history',
  title: '수학사',
  subtitle: '따로 읽는 열일곱 권. 시대, 사람, 정리, 문제, 기호',
  category: 'math',
  chapters: [],
  books: historyBooks,
};

export const math: Book = {
  id: 'math',
  title: '수학',
  subtitle: '고등학교에서 석사 과정까지, 분야 스물셋의 기본서와 문제집, 그리고 수학사',
  category: 'math',
  chapters: [],
  books: [
    field('algebra', '대수', '고등학교. 수와 식: 수의 체계에서 복소수까지', algebraTexts),
    field('functions', '함수', '고등학교. 대응과 그래프: 다항함수, 지수와 로그, 삼각함수', functionTexts),
    field('geometry', '기하', '고등학교에서 학부까지. 도형, 좌표, 벡터, 변환, 유클리드 밖의 기하', geometryTexts),
    field('calculus', '미적분', '고등학교에서 학부까지. 극한, 미분, 적분, 급수, 다변수와 벡터 미적분', calculusTexts),
    field('probstat', '확률과 통계', '고등학교에서 학부까지. 세기, 확률, 분포, 추정과 검정, 회귀', probstatTexts),
    field('logic', '논리', '고등학교에서 석사까지. 증명, 집합, 수의 구성, 수리논리, 계산 가능성', logicTexts),
    field('discrete', '이산수학', '학부에서 석사까지. 조합론, 생성함수, 그래프, 순서, 확률적 방법', discreteTexts),
    field('linear', '선형대수학', '고등학교에서 석사까지. 벡터와 행렬에서 표준형과 텐서까지', linearTexts),
    field('analysis', '해석학', '학부에서 석사까지. 실수, 연속, 적분, 거리공간, 측도, 푸리에 해석, 함수해석학', analysisTexts),
    field('complex', '복소해석학', '학부에서 석사까지. 정칙함수, 코시 정리, 유수, 등각사상, 리만 곡면', complexTexts),
    field('diffeq', '미분방정식', '학부에서 석사까지. 상미분방정식, 동역학계, 편미분방정식, 변분법', diffeqTexts),
    field('abstract', '대수학', '학부에서 석사까지. 군, 환, 가군, 체, 가환대수, 표현론, 리 이론', abstractTexts),
    field('number', '정수론', '고등학교에서 석사까지. 합동식에서 타원곡선까지', numberTexts),
    field('topology', '위상수학', '학부에서 석사까지. 곡면과 매듭, 일반위상, 기본군, 호몰로지', topologyTexts),
    field('diffgeo', '미분기하학', '학부에서 석사까지. 곡선과 곡면, 다양체, 텐서, 리만 기하', diffgeoTexts),
    field('alggeo', '대수기하학', '석사. 대수곡선, 다양체, 스킴', alggeoTexts),
    field('probability', '확률론', '학부에서 석사까지. 측도 위의 확률, 극한 정리, 확률 과정', probabilityTexts),
    field('statistics', '통계학', '학부에서 석사까지. 추정, 검정, 선형모형, 다변량 해석, 베이즈 통계, 시계열', statisticsTexts),
    field('numerical', '수치해석', '학부에서 석사까지. 어림해 푸는 방법과 그 오차', numericalTexts),
    field('optimization', '최적화', '학부에서 석사까지. 선형계획법, 볼록, 비선형, 조합 최적화', optimizationTexts),
    field('category', '범주론', '학부에서 석사까지. 범주, 함자, 수반, 모나드', categoryTexts),
    field('applied', '응용수학', '학부에서 석사까지. 신호, 정보, 암호, 게임, 금융, 역학, 학습, 그래픽스', appliedTexts),
    history,
  ],
};
