/**
 * 수학 서가 · 통계학 (학부 → 석사). 자료에서 결론을 끌어내는 이론의 여섯 권.
 * 차례는 우선 장 단위로 적어 둔다. 책을 쓰기 시작할 때 장을 쪽으로 쪼갠다.
 */
import { book } from '../outline';

export const mEstimation = book('m-estimation', '추정', '자료로 모수를 짐작하는 방법과 그 좋고 나쁨', 'math', `
models           통계 모형
estimators       추정량과 그 좋고 나쁨
moments          적률법
likelihood       가능도와 최대가능도추정
sufficiency      충분통계량
unbiased         불편추정과 크라메르-라오 부등식
exponential      지수족
asymptotics      큰 표본에서의 성질
robust           강건한 추정
bootstrap        붓스트랩
`);

export const mTesting = book('m-testing', '검정과 신뢰구간', '가설을 자료로 따지는 이론', 'math', `
hypotheses       가설과 오류
neyman-pearson   네이만-피어슨 보조정리
ratio            가능도비 검정
t-tests          t 검정
chi-square       카이제곱 검정
intervals        신뢰구간
anova            분산분석
nonparametric    비모수 검정
multiple         다중 검정
power            검정력과 표본 크기
`);

export const mLinearModels = book('m-linear-models', '선형모형과 회귀', '정사영으로 보는 회귀와 그 넓힘', 'math', `
model            선형모형
least-squares    최소제곱과 정사영
gauss-markov     가우스-마르코프 정리
inference        계수의 추론
diagnostics      진단
selection        변수 고르기
regularization   능형 회귀와 라쏘
glm              일반화 선형모형
logistic         로지스틱 회귀
mixed            혼합 모형
`);

export const mMultivariate = book('m-multivariate', '다변량 해석', '변수가 많은 자료의 모양 읽기', 'math', `
normal           다변량 정규분포
covariance       공분산 행렬
pca              주성분 분석
factor           인자 분석
discriminant     판별 분석
clustering       군집
canonical        정준 상관
scaling          다차원 척도법
hotelling        호텔링의 T²
high-dim         고차원 자료
`);

export const mBayes = book('m-bayes', '베이즈 통계', '믿음을 자료로 고쳐 가기', 'math', `
belief           믿음을 고쳐 가기
prior            사전분포와 사후분포
conjugate        켤레 사전분포
estimation       베이즈 추정과 구간
prediction       예측 분포
hierarchical     계층 모형
mcmc             마르코프 연쇄 몬테카를로
comparison       모형 비교
decision         결정 이론
variational      변분 추론
`);

export const mTimeSeries = book('m-time-series', '시계열', '시간을 따라 늘어선 자료', 'math', `
series           시계열과 그림
stationarity     정상성
autocorrelation  자기상관
ar               자기회귀 모형
ma               이동평균 모형
arima            ARIMA 모형
forecasting      예측
spectral         스펙트럼 분석
state-space      상태 공간 모형과 칼만 필터
volatility       변동성 모형
`);

export const statisticsTexts = [mEstimation, mTesting, mLinearModels, mMultivariate, mBayes, mTimeSeries];
