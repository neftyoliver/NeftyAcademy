/**
 * tex2mml.mjs 와 mdx-math.mjs 가 하기로 한 일을 지키는지 본다.   node --test tex2mml.test.mjs
 * 바깥 꾸러미 없이 node 에 든 시험 도구만 쓴다.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mathToJsx } from './mdx-math.mjs';
import { tex2mml } from './tex2mml.mjs';

const R = String.raw;
const inner = (tex, options) => tex2mml(tex, options).replace(/^<math[^>]*>|<\/math>$/g, '');
const THIN = '0.1667em';
const MED = '0.2222em';
const THICK = '0.2778em';

test('글자, 수, 그리스 글자', () => {
  assert.equal(inner('x'), '<mi>x</mi>');
  assert.equal(inner('3.14'), '<mn>3.14</mn>');
  assert.equal(inner(R`\alpha`), '<mi>α</mi>');
  // 그리스 대문자와 기호는 곧게 선다
  assert.equal(inner(R`\Delta`), '<mi mathvariant="normal">Δ</mi>');
  assert.equal(inner(R`\infty`), '<mi mathvariant="normal">∞</mi>');
  // 한글은 저절로 글이 된다
  assert.equal(inner('넓이'), '<mtext>넓이</mtext>');
  assert.equal(inner(R`\text{밑변 a}`), '<mtext>밑변 a</mtext>');
});

test('위아래: 첨자, 분수, 근호', () => {
  assert.equal(inner('x^2'), '<msup><mi>x</mi><mn>2</mn></msup>');
  assert.equal(inner('a_n'), '<msub><mi>a</mi><mi>n</mi></msub>');
  assert.equal(inner('x_i^2'), '<msubsup><mi>x</mi><mi>i</mi><mn>2</mn></msubsup>');
  assert.equal(inner(R`\frac{a}{b}`), '<mfrac><mi>a</mi><mi>b</mi></mfrac>');
  // \frac12 는 1과 2다
  assert.equal(inner(R`\frac12`), '<mfrac><mn>1</mn><mn>2</mn></mfrac>');
  assert.equal(inner(R`\sqrt{2}`), '<msqrt><mn>2</mn></msqrt>');
  assert.equal(inner(R`\sqrt[3]{x}`), '<mroot><mi>x</mi><mn>3</mn></mroot>');
  // 분수에 붙는 지수는 분수 전체에
  assert.match(inner(R`\frac{a}{b}^2`), /^<msup><mrow><mfrac>/);
});

test('프라임은 위첨자로 올리지 않고 밑 뒤에 놓는다', () => {
  assert.equal(inner("f'"), '<mrow><mi>f</mi><mo lspace="0" rspace="0">′</mo></mrow>');
  assert.match(inner("f''(x)"), /″/);
  assert.match(inner("y'^2"), /^<msup><mrow><mi>y<\/mi><mo[^>]*>′<\/mo><\/mrow><mn>2<\/mn><\/msup>$/);
  assert.throws(() => tex2mml("x^2'"), /프라임/);
});

test('빈칸: 이항은 중간, 관계는 두껍게, 구두점 뒤는 얇게', () => {
  assert.equal(inner('a+b'), `<mi>a</mi><mo lspace="${MED}" rspace="${MED}">+</mo><mi>b</mi>`);
  assert.equal(inner('a=b'), `<mi>a</mi><mo lspace="${THICK}" rspace="${THICK}">=</mo><mi>b</mi>`);
  assert.equal(inner('a,b'), `<mi>a</mi><mo lspace="0" rspace="${THIN}">,</mo><mi>b</mi>`);
  // 빼기는 U+2212 로
  assert.match(inner('a-b'), />−</);
});

test('빈칸: 맨 앞이나 관계 뒤의 이항 연산자는 부호다', () => {
  assert.equal(inner('-x'), '<mo lspace="0" rspace="0">−</mo><mi>x</mi>');
  assert.equal(inner('a=-b'), `<mi>a</mi><mo lspace="${THICK}" rspace="${THICK}">=</mo><mo lspace="0" rspace="0">−</mo><mi>b</mi>`);
  assert.equal(inner('(-x)'), '<mo lspace="0" rspace="0" stretchy="false">(</mo><mo lspace="0" rspace="0">−</mo><mi>x</mi><mo lspace="0" rspace="0" stretchy="false">)</mo>');
});

test('빈칸: 세로줄 | 은 여는 것과 닫는 것을 앞뒤로 가린다', () => {
  const minus = (tex) => [...inner(tex).matchAll(/<mo lspace="([^"]*)" rspace="[^"]*">−<\/mo>/g)].map((m) => m[1]);
  // 절댓값 안의 맨 앞 빼기는 부호다
  assert.deepEqual(minus('|-3|'), ['0']);
  assert.deepEqual(minus('2|-x|'), ['0']);
  // 닫는 세로줄 뒤의 빼기는 이항 연산자다
  assert.deepEqual(minus('|a|-|b|'), [MED]);
  assert.deepEqual(minus('||a|-|b||'), [MED]);
  // 이웃한 두 절댓값: 둘째도 다시 여는 것으로 읽는다
  assert.deepEqual(minus('|a||-b|'), ['0']);
  assert.deepEqual(minus('-|-a|'), ['0', '0']);
});

test('빈칸: 첨자 안에서는 이항과 관계의 빈칸을 뺀다', () => {
  assert.equal(inner('x^{n+1}'), '<msup><mi>x</mi><mrow><mi>n</mi><mo lspace="0" rspace="0">+</mo><mn>1</mn></mrow></msup>');
});

test('이름으로 적는 연산자 뒤에는 얇은 빈칸, 괄호 앞에는 없다', () => {
  assert.equal(inner(R`\sin x`), `<mi>sin</mi><mspace width="${THIN}"/><mi>x</mi>`);
  assert.match(inner(R`\sin(x)`), /^<mi>sin<\/mi><mo[^>]*>\(<\/mo>/);
  assert.equal(inner(R`2\sin x`), `<mn>2</mn><mspace width="${THIN}"/><mi>sin</mi><mspace width="${THIN}"/><mi>x</mi>`);
});

test('큰 연산자: 합은 위아래에, 적분은 옆에', () => {
  assert.match(inner(R`\sum_{k=1}^n k`), /^<munderover><mo[^>]*>∑<\/mo>/);
  assert.match(inner(R`\int_0^1 x`), /^<msubsup><mo[^>]*>∫<\/mo><mn>0<\/mn><mn>1<\/mn><\/msubsup>/);
  // \lim 은 <mo>로 써야 글 안에서 한계가 옆으로 옮겨진다
  assert.match(inner(R`\lim_{x\to 0} f`), /^<munder><mo lspace="0" rspace="0" movablelimits="true">lim<\/mo>/);
});

test('괄호: 그냥 적은 것은 늘어나지 않고, \\left 는 키 큰 것이 있을 때만 늘어난다', () => {
  assert.match(inner('(x)'), /stretchy="false">\(/);
  assert.match(inner(R`\left(x\right)`), /stretchy="false">\(/);
  assert.match(inner(R`\left(\frac{a}{b}\right)`), /fence="true" stretchy="true" symmetric="true">\(/);
  // \left. 은 그리지 않는다
  assert.doesNotMatch(inner(R`\left. \frac{x}{2} \right|`), /<mo[^>]*><\/mo>/);
  assert.throws(() => tex2mml(R`\left( x`), /\\right/);
});

test('글꼴', () => {
  assert.equal(inner(R`\mathbb{R}`), '<mi>ℝ</mi>');
  assert.equal(inner(R`\mathbf{v}`), '<mi>𝐯</mi>');
  assert.equal(inner(R`\mathcal{F}`), '<mi>ℱ</mi>');
  assert.equal(inner(R`\mathfrak{g}`), '<mi>𝔤</mi>');
  assert.equal(inner(R`\mathrm{d}`), '<mi mathvariant="normal">d</mi>');
});

test('위에 얹는 것: 점, 벡터, 윗줄', () => {
  assert.match(inner(R`0.\dot{3}`), /<mover accent="true"><mn>3<\/mn><mo[^>]*>˙<\/mo><\/mover>$/);
  assert.match(inner(R`\vec{v}`), /^<mover><mi>v<\/mi><mo[^>]*>→<\/mo><\/mover>$/);
  // 윗줄은 CSS 로 긋는다
  assert.equal(inner(R`\overline{AB}`), '<mrow class="tex-ol"><mi>A</mi><mi>B</mi></mrow>');
});

test('여러 줄: aligned 의 짝수째 칸은 = 앞에도 빈칸이 생긴다', () => {
  const html = inner(R`\begin{aligned} a &= b \\ &= c \end{aligned}`, { display: true });
  assert.match(html, /^<mtable class="tex-al"/);
  assert.equal(html.match(/<mtr>/g).length, 2);
  assert.match(html, new RegExp(`<mtd class="tex-l"><mstyle[^>]*><mrow></mrow><mo lspace="${THICK}" rspace="${THICK}">=</mo>`));
});

test('여러 줄: cases, 행렬, 환경 없이 \\\\ 로 나눈 줄', () => {
  assert.match(inner(R`\begin{cases} x & (x \ge 0) \\ -x & (x < 0) \end{cases}`, { display: true }), /^<mrow><mo[^>]*>\{<\/mo><mtable class="tex-ca"/);
  assert.match(inner(R`\begin{pmatrix} a & b \\ c & d \end{pmatrix}`), /^<mrow><mo[^>]*>\(<\/mo><mtable class="tex-ma">/);
  assert.match(inner(R`a = b \\ c = d`, { display: true }), /^<mtable class="tex-ga"/);
  assert.throws(() => tex2mml(R`a \\ b`), /환경 안에서만/);
});

test('글자로 바로 적은 기호도 명령으로 적은 것과 같다', () => {
  assert.equal(inner('a ≤ b'), inner(R`a \le b`));
  assert.equal(inner('2 × 3'), inner(R`2 \times 3`));
  assert.equal(inner('α'), inner(R`\alpha`));
});

test('HTML 에서 뜻이 있는 글자는 바꿔 적는다', () => {
  assert.match(inner('a<b'), />&lt;</);
  assert.match(inner(R`\text{A&B}`), /A&amp;B/);
});

test('따로 놓는 수식', () => {
  assert.match(tex2mml('x', { display: true }), /^<math display="block">/);
  assert.match(tex2mml('x'), /^<math>/);
});

test('모르는 명령과 짝이 안 맞는 것은 오류다', () => {
  assert.throws(() => tex2mml(R`\nosuchcommand`), /모르는 명령/);
  assert.throws(() => tex2mml('{x'), /닫히지 않았다/);
  assert.throws(() => tex2mml('x}'), /짝이 없는/);
  assert.throws(() => tex2mml('x^'), /인자/);
  assert.throws(() => tex2mml('a & b'), /환경 안에서만/);
  assert.throws(() => tex2mml(R`\begin{aligned} a \end{cases}`), /닫았다/);
  assert.throws(() => tex2mml('x^2^3'), /두 번/);
});

// ---------------------------------------------------------------- mdx-math.mjs

const span = (tex) => `<span className="tex" dangerouslySetInnerHTML={{ __html: ${JSON.stringify(tex2mml(tex)).replace(/\|/g, '\\u007c')} }} />`;

test('글 안의 $…$ 를 바꾼다', () => {
  assert.equal(mathToJsx('넓이는 $x^2$ 이다.'), `넓이는 ${span('x^2')} 이다.`);
  assert.equal(mathToJsx(R`$\frac{a}{b}$ 와 $c$`), `${span(R`\frac{a}{b}`)} 와 ${span('c')}`);
});

test('$$ … $$ 는 따로 놓는 수식이 된다', () => {
  const out = mathToJsx('앞\n\n$$\nx = 1\n$$\n\n뒤');
  assert.match(out, /^앞\n\n<div className="tex-block" dangerouslySetInnerHTML=\{\{ __html: "<math display=\\"block\\">.*<\/math>" \}\} \/>\n\n뒤$/);
});

test('코드, import, JSX 태그 안은 건드리지 않는다', () => {
  const code = '```sh\necho $HOME $PATH\n```\n';
  assert.equal(mathToJsx(code), code);
  assert.equal(mathToJsx('값은 `$a$` 다'), '값은 `$a$` 다');
  const esm = "export const summary = '값 $a$ 와 $b$';\n";
  assert.equal(mathToJsx(esm), esm);
  const tag = '<Plane f={(x) => `${x}$`} label="$5" />\n';
  assert.equal(mathToJsx(tag), tag);
});

test('\\$ 는 달러 글자다', () => {
  assert.equal(mathToJsx(R`값은 \$5 이고 \$6 이다`), R`값은 \$5 이고 \$6 이다`);
});

test('표의 칸 안에서는 | 를 유니코드 번호로 적어 칸이 갈라지지 않게 한다', () => {
  const out = mathToJsx('| $|x|$ | 절댓값 |');
  assert.equal(out.match(/(?<!\\u007c)\|/g).length, 3);
  assert.match(out, /\\u007c/);
});

test('TEX`…` 는 JSX 안에서 쓴다', () => {
  assert.equal(mathToJsx('<Figure caption={<>넓이 {TEX`x^2`}</>}>'), `<Figure caption={<>넓이 {${span('x^2')}}</>}>`);
});

test('닫히지 않은 $ 와 틀린 수식은 파일과 줄을 알려 준다', () => {
  assert.throws(() => mathToJsx('첫 줄\n값은 $x^2 이다', 'a.mdx'), /a\.mdx:2/);
  assert.throws(() => mathToJsx(R`$\nosuch$`, 'a.mdx'), /a\.mdx:1[\s\S]*모르는 명령/);
});
