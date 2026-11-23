/**
 * TeX로 적은 수식을 MathML로 바꾼다. 바깥 꾸러미 없이 이 파일 하나로 돈다.
 *
 *   tex2mml('\\frac{a}{b}')                         → '<math>…</math>'                  글 안의 수식
 *   tex2mml('\\sum_{k=1}^n k', { display: true })   → '<math display="block">…</math>'  따로 놓는 수식
 *
 * 받는 것은 TeX의 일부다. 아래 표에 없는 명령은 오류를 낸다(틀린 수식이 조용히 지나가지 않게).
 * 수식은 빌드할 때 바뀌어 결과물에는 MathML만 남는다. 그리는 일은 브라우저가 기기의 수학 글꼴로 한다.
 *
 * 빈칸은 TeX의 규칙으로 직접 셈한다. 조각마다 갈래(보통, 큰 연산자, 이항, 관계, 여는, 닫는, 구두점, 안쪽)를
 * 매기고 이웃한 두 갈래로 빈칸을 정해 <mo>의 lspace, rspace 나 <mspace>에 적는다.
 * 브라우저마다 조금씩 다른 연산자 사전에 기대지 않으려는 것이다. 첨자 안에서는 TeX처럼 이항·관계의 빈칸을 뺀다.
 *
 * 쓸 수 있는 것(간추림)
 *   글자와 수      x, 3.14, \alpha … \Omega, \infty, \partial, 한글(저절로 \text 가 된다)
 *   위아래         x^2, a_n, x_i^2, f', \frac \dfrac \tfrac \binom, \sqrt[n]{x}
 *   큰 연산자      \sum \prod \int \lim \max … (따로 놓는 수식에서는 위아래에, 글 안에서는 옆에 붙는다)
 *   괄호           ( ) [ ] \{ \} \langle \rangle \lvert \rvert \lfloor \rceil, \left … \middle … \right, \big \Big \bigg \Bigg
 *                  절댓값은 |x| 로 적으면 된다. 여는 | 와 닫는 | 는 앞뒤를 보고 가린다(|-3| 의 빼기는 부호가 된다)
 *   글꼴           \mathrm \mathbf \mathbb \mathcal \mathfrak \mathsf \mathtt \bm, \text \textbf \textit, \operatorname
 *   위에 얹는 것   \hat \bar \vec \dot \ddot \tilde \overline \underline \overrightarrow \overbrace \underbrace \overset \underset
 *   여러 줄        aligned, gathered, cases, matrix pmatrix bmatrix vmatrix Vmatrix, array
 *   빈칸           \, \: \; \! \quad \qquad ~
 *   색             \ca{…} \cb{…} \cc{…} \cd{…} (그림의 선 색 넷), \textcolor{이름}{…}
 */

// ---------------------------------------------------------------- 표

const GREEK = {
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ϵ', varepsilon: 'ε', zeta: 'ζ', eta: 'η', theta: 'θ', vartheta: 'ϑ',
  iota: 'ι', kappa: 'κ', lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', pi: 'π', varpi: 'ϖ', rho: 'ρ', varrho: 'ϱ', sigma: 'σ',
  varsigma: 'ς', tau: 'τ', upsilon: 'υ', phi: 'ϕ', varphi: 'φ', chi: 'χ', psi: 'ψ', omega: 'ω',
};
const GREEK_UP = { Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ', Lambda: 'Λ', Xi: 'Ξ', Pi: 'Π', Sigma: 'Σ', Upsilon: 'Υ', Phi: 'Φ', Psi: 'Ψ', Omega: 'Ω' };
/** 곧게 서는 기호. 갈래는 보통 */
const SYMBOL = {
  infty: '∞', emptyset: '∅', varnothing: '∅', nabla: '∇', partial: '∂', hbar: 'ℏ', ell: 'ℓ', Re: 'ℜ', Im: 'ℑ', aleph: 'ℵ',
  forall: '∀', exists: '∃', nexists: '∄', neg: '¬', lnot: '¬', angle: '∠', measuredangle: '∡', triangle: '△', square: '□',
  blacksquare: '■', top: '⊤', bot: '⊥', prime: '′', degree: '°', imath: 'ı', jmath: 'ȷ', backslash: '\\', checkmark: '✓',
  dots: '…', ldots: '…', cdots: '⋯', vdots: '⋮', ddots: '⋱', '%': '%', '#': '#', '&': '&', $: '$', _: '_',
};
const INNER = new Set(['dots', 'ldots', 'cdots']);
const BIN = {
  pm: '±', mp: '∓', times: '×', div: '÷', cdot: '⋅', ast: '∗', star: '⋆', circ: '∘', bullet: '∙', cup: '∪', cap: '∩',
  setminus: '∖', land: '∧', wedge: '∧', lor: '∨', vee: '∨', oplus: '⊕', ominus: '⊖', otimes: '⊗', odot: '⊙', sqcup: '⊔',
  sqcap: '⊓', uplus: '⊎', triangleleft: '◁', triangleright: '▷', dagger: '†', bmod: 'mod',
};
const REL = {
  le: '≤', leq: '≤', ge: '≥', geq: '≥', leqslant: '⩽', geqslant: '⩾', lt: '<', gt: '>', ne: '≠', neq: '≠', approx: '≈', equiv: '≡', sim: '∼', simeq: '≃', cong: '≅',
  propto: '∝', in: '∈', notin: '∉', ni: '∋', subset: '⊂', supset: '⊃', subseteq: '⊆', supseteq: '⊇', subsetneq: '⊊',
  supsetneq: '⊋', nsubseteq: '⊈', to: '→', rightarrow: '→', leftarrow: '←', gets: '←', leftrightarrow: '↔', Rightarrow: '⇒',
  Leftarrow: '⇐', Leftrightarrow: '⇔', implies: '⟹', impliedby: '⟸', iff: '⟺', mapsto: '↦', longrightarrow: '⟶',
  longleftarrow: '⟵', longmapsto: '⟼', hookrightarrow: '↪', twoheadrightarrow: '↠', uparrow: '↑', downarrow: '↓',
  nearrow: '↗', searrow: '↘', perp: '⊥', parallel: '∥', mid: '∣', nmid: '∤', ll: '≪', gg: '≫', prec: '≺', succ: '≻',
  preceq: '⪯', succeq: '⪰', vdash: '⊢', models: '⊨', dashv: '⊣', doteq: '≐', asymp: '≍', coloneqq: '≔', lessgtr: '≶',
  therefore: '∴', because: '∵', nless: '≮', ngtr: '≯', nleq: '≰', ngeq: '≱', nsim: '≁', ncong: '≇', nparallel: '∦',
};
const NOT = { '=': '≠', '<': '≮', '>': '≯', '∈': '∉', '≡': '≢', '∼': '≁', '≈': '≉', '⊂': '⊄', '⊆': '⊈', '∣': '∤', '∥': '∦', '≤': '≰', '≥': '≱', '∃': '∄' };
const OPEN = { '(': '(', '[': '[', '\\{': '{', lbrace: '{', langle: '⟨', lfloor: '⌊', lceil: '⌈', lvert: '|', lVert: '‖', lbrack: '[' };
const CLOSE = { ')': ')', ']': ']', '\\}': '}', rbrace: '}', rangle: '⟩', rfloor: '⌋', rceil: '⌉', rvert: '|', rVert: '‖', rbrack: ']' };
/** \left, \right, \big 뒤에 올 수 있는 것 */
const DELIM = { ...OPEN, ...CLOSE, '|': '|', vert: '|', '\\|': '‖', Vert: '‖', '/': '/', backslash: '\\', uparrow: '↑', downarrow: '↓', '.': '' };
/** 위아래에 한계를 다는 큰 연산자 */
const BIGOP = { sum: '∑', prod: '∏', coprod: '∐', bigcup: '⋃', bigcap: '⋂', bigoplus: '⨁', bigotimes: '⨂', bigvee: '⋁', bigwedge: '⋀', bigsqcup: '⨆' };
/** 한계를 옆에 다는 적분 */
const INTEGRAL = { int: '∫', iint: '∬', iiint: '∭', oint: '∮' };
/** 이름으로 적는 연산자. true 는 한계를 위아래에 다는 것 */
const NAMED = {
  lim: true, limsup: true, liminf: true, max: true, min: true, sup: true, inf: true, det: true, gcd: true, Pr: true, lcm: true,
  argmax: true, argmin: true,
  sin: false, cos: false, tan: false, cot: false, sec: false, csc: false, arcsin: false, arccos: false, arctan: false,
  sinh: false, cosh: false, tanh: false, coth: false, log: false, ln: false, lg: false, exp: false, deg: false, dim: false,
  ker: false, hom: false, arg: false, sgn: false, rank: false, tr: false, mod: false,
};
const NAMED_TEXT = { limsup: 'lim sup', liminf: 'lim inf', argmax: 'arg max', argmin: 'arg min' };
const ACCENT = {
  hat: ['^', false], widehat: ['^', true], bar: ['¯', false], dot: ['˙', false], ddot: ['¨', false],
  tilde: ['~', false], widetilde: ['~', true], check: ['ˇ', false], overrightarrow: ['→', true],
  overleftarrow: ['←', true], overleftrightarrow: ['↔', true],
};
const FONT = { mathrm: 'rm', mathbf: 'bold', mathbb: 'bb', mathcal: 'cal', mathscr: 'cal', mathfrak: 'frak', mathsf: 'sf', mathtt: 'tt', mathit: 'it', bm: 'bi', boldsymbol: 'bi' };
const TEXT_CMD = { text: '', textrm: '', mbox: '', textbf: 'font-weight:bold', textit: 'font-style:italic', textsf: 'font-family:sans-serif', texttt: 'font-family:monospace' };
const SPACE = { ',': 3, ':': 4, '>': 4, ';': 5, '!': -3, ' ': 6, quad: 18, qquad: 36, enspace: 9, thinspace: 3, medspace: 4, thickspace: 5, negthinspace: -3 };
const BIGSIZE = { big: 1.2, Big: 1.8, bigg: 2.4, Bigg: 3.0 };
/** 그림의 선 색과 같은 넷, 그리고 이름으로 부르는 몇 가지 */
const COLOR = { a: '#e8590c', b: '#1c7ed6', c: '#2f9e44', d: '#9c36b5', red: '#e03131', blue: '#1c7ed6', green: '#2f9e44', orange: '#e8590c', purple: '#9c36b5', gray: '#868e96' };
const ALIGNED = new Set(['aligned', 'align', 'align*', 'split', 'alignedat']);
const MATRIX = { matrix: ['', ''], pmatrix: ['(', ')'], bmatrix: ['[', ']'], Bmatrix: ['{', '}'], vmatrix: ['|', '|'], Vmatrix: ['‖', '‖'], smallmatrix: ['', ''] };

/** TeX의 조각 사이 빈칸. 1 얇게(3mu) 2 중간(4mu) 3 두껍게(5mu). 음수는 첨자 안에서 빼는 것 */
const GAP = {
  ord: { ord: 0, op: 1, bin: -2, rel: -3, open: 0, close: 0, punct: 0, inner: -1 },
  op: { ord: 1, op: 1, bin: 0, rel: -3, open: 0, close: 0, punct: 0, inner: -1 },
  bin: { ord: -2, op: -2, bin: 0, rel: 0, open: -2, close: 0, punct: 0, inner: -2 },
  rel: { ord: -3, op: -3, bin: 0, rel: 0, open: -3, close: 0, punct: 0, inner: -3 },
  open: { ord: 0, op: 0, bin: 0, rel: 0, open: 0, close: 0, punct: 0, inner: 0 },
  close: { ord: 0, op: 1, bin: -2, rel: -3, open: 0, close: 0, punct: 0, inner: -1 },
  punct: { ord: -1, op: -1, bin: 0, rel: -1, open: -1, close: -1, punct: -1, inner: -1 },
  inner: { ord: -1, op: 1, bin: -2, rel: -3, open: -1, close: 0, punct: -1, inner: -1 },
};
const MU = [0, 3, 4, 5];

/** 명령 대신 글자로 바로 적은 기호(≤, ×, α …)의 갈래 */
const DIRECT = new Map();
for (const ch of Object.values(REL)) DIRECT.set(ch, 'rel');
for (const ch of Object.values(BIN)) if ([...ch].length === 1) DIRECT.set(ch, 'bin');
for (const ch of Object.values(GREEK)) DIRECT.set(ch, 'mi');
for (const ch of Object.values(GREEK_UP)) DIRECT.set(ch, 'up');
for (const ch of Object.values(SYMBOL)) if (ch.codePointAt(0) > 0x7f) DIRECT.set(ch, 'up');
for (const ch of Object.values(BIGOP)) DIRECT.set(ch, 'bigop');
for (const ch of Object.values(INTEGRAL)) DIRECT.set(ch, 'int');
for (const ch of ['⟨', '⌊', '⌈']) DIRECT.set(ch, 'open');
for (const ch of ['⟩', '⌋', '⌉']) DIRECT.set(ch, 'close');
DIRECT.set('−', 'bin');
DIRECT.set('·', 'bin');

// ---------------------------------------------------------------- 작은 도구

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const em = (mu) => `${Number((mu / 18).toFixed(4))}em`;
const cp = (n) => String.fromCodePoint(n);

class TexError extends Error {}
const fail = (msg) => {
  throw new TexError(msg);
};

/** 글꼴 명령이 바꾸는 글자. 유니코드의 수학 글자 자리로 옮긴다. 옮길 자리가 없으면 undefined */
function styled(ch, font) {
  const c = ch.codePointAt(0);
  const up = c >= 65 && c <= 90;
  const lo = c >= 97 && c <= 122;
  const dig = c >= 48 && c <= 57;
  const gl = c >= 0x3b1 && c <= 0x3c9;
  const pick = (holes, U, L, D) => holes[ch] ?? (up && U ? cp(U + c - 65) : lo && L ? cp(L + c - 97) : dig && D ? cp(D + c - 48) : undefined);
  switch (font) {
    case 'bold':
      return pick({}, 0x1d400, 0x1d41a, 0x1d7ce);
    case 'bi':
      return gl ? cp(0x1d736 + c - 0x3b1) : pick({}, 0x1d468, 0x1d482, 0x1d7ce);
    case 'bb':
      return pick({ C: 'ℂ', H: 'ℍ', N: 'ℕ', P: 'ℙ', Q: 'ℚ', R: 'ℝ', Z: 'ℤ' }, 0x1d538, 0x1d552, 0x1d7d8);
    case 'cal':
      return pick({ B: 'ℬ', E: 'ℰ', F: 'ℱ', H: 'ℋ', I: 'ℐ', L: 'ℒ', M: 'ℳ', R: 'ℛ', e: 'ℯ', g: 'ℊ', o: 'ℴ' }, 0x1d49c, 0x1d4b6, 0);
    case 'frak':
      return pick({ C: 'ℭ', H: 'ℌ', I: 'ℑ', R: 'ℜ', Z: 'ℨ' }, 0x1d504, 0x1d51e, 0);
    case 'sf':
      return pick({}, 0x1d5a0, 0x1d5ba, 0x1d7e2);
    case 'tt':
      return pick({}, 0x1d670, 0x1d68a, 0x1d7f6);
    default:
      return undefined;
  }
}

// ---------------------------------------------------------------- 낱말로 자르기

/** 토큰: { t: 'cmd' | 'chr' | 'num' | 'text' | '{' | '}' | '^' | '_' | '&' | "'" , v } */
function tokenize(src) {
  const out = [];
  let i = 0;
  const n = src.length;
  while (i < n) {
    const ch = src[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (ch === '\\') {
      const m = /^\\([a-zA-Z]+\*?)/.exec(src.slice(i));
      if (m) {
        i += m[0].length;
        const name = m[1];
        if (name in TEXT_CMD) {
          // \text{…}: 중괄호 안을 글자 그대로 읽는다
          while (i < n && /\s/.test(src[i])) i++;
          if (src[i] !== '{') fail(`\\${name} 뒤에 { 가 없다`);
          let depth = 0;
          let j = i;
          for (; j < n; j++) {
            if (src[j] === '\\') j++;
            else if (src[j] === '{') depth++;
            else if (src[j] === '}' && --depth === 0) break;
          }
          if (j >= n) fail(`\\${name}{ 가 닫히지 않았다`);
          out.push({ t: 'text', v: src.slice(i + 1, j).replace(/\\([{}$%&#_ ])/g, '$1'), font: TEXT_CMD[name] });
          i = j + 1;
        } else out.push({ t: 'cmd', v: name });
        continue;
      }
      if (i + 1 >= n) fail('수식이 \\ 로 끝난다');
      out.push({ t: 'cmd', v: src[i + 1] === '\\' ? '\\\\' : src[i + 1], sym: true });
      i += 2;
      continue;
    }
    if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(src[i + 1] ?? ''))) {
      const m = /^[0-9]*\.?[0-9]+|^[0-9]+/.exec(src.slice(i));
      out.push({ t: 'num', v: m[0] });
      i += m[0].length;
      continue;
    }
    if ('{}^_&\''.includes(ch)) {
      out.push({ t: ch, v: ch });
      i++;
      continue;
    }
    if (ch === '~') {
      out.push({ t: 'cmd', v: ' ', sym: true });
      i++;
      continue;
    }
    // 한글처럼 수식 글자가 아닌 것은 이어서 글로 읽는다
    const code = src.codePointAt(i);
    if (code > 0x2e7f) {
      let j = i;
      while (j < n && (src.codePointAt(j) > 0x2e7f || (src[j] === ' ' && src.codePointAt(j + 1) > 0x2e7f))) j += src.codePointAt(j) > 0xffff ? 2 : 1;
      out.push({ t: 'text', v: src.slice(i, j), font: '' });
      i = j;
      continue;
    }
    const s = cp(code);
    out.push({ t: 'chr', v: s });
    i += s.length;
  }
  return out;
}

// ---------------------------------------------------------------- 읽기(나무로)

/**
 * 조각: { k, cls, … }
 *   k: 'mi' 'mn' 'mo' 'text' 'group' 'frac' 'sqrt' 'script' 'named' 'bigop' 'accent' 'vec' 'ruled' 'brace' 'stack' 'xarrow'
 *      'lr' 'env' 'space' 'style' 'empty' 'phantom'
 */
class Parser {
  constructor(tokens) {
    this.toks = tokens;
    this.i = 0;
  }
  peek() {
    return this.toks[this.i];
  }
  next() {
    return this.toks[this.i++];
  }
  isCmd(tok, name) {
    return tok && tok.t === 'cmd' && tok.v === name;
  }

  /** stop(토큰)이 참이 될 때까지의 조각들 */
  list(stop) {
    const out = [];
    for (;;) {
      const tok = this.peek();
      if (!tok || stop(tok)) return out;
      // 묶음의 끝까지 걸리는 명령
      if (tok.t === 'cmd' && !tok.sym && (tok.v === 'displaystyle' || tok.v === 'textstyle' || tok.v === 'scriptstyle')) {
        this.next();
        out.push({ k: 'style', cls: 'ord', body: this.list(stop), display: tok.v === 'displaystyle', level: tok.v === 'scriptstyle' ? 1 : 0 });
        return out;
      }
      if (this.isCmd(tok, 'color') && !tok.sym) {
        this.next();
        const color = this.colorName();
        out.push({ k: 'style', cls: 'ord', body: this.list(stop), color });
        return out;
      }
      out.push(this.scripted());
    }
  }

  colorName() {
    const tok = this.next();
    if (!tok || tok.t !== '{') fail('색 이름은 { } 안에 적는다');
    let name = '';
    for (;;) {
      const t = this.next();
      if (!t) fail('색 이름의 { 가 닫히지 않았다');
      if (t.t === '}') break;
      name += t.v;
    }
    if (!(name in COLOR) && !/^#[0-9a-fA-F]{3,6}$/.test(name)) fail(`모르는 색: ${name}`);
    return COLOR[name] ?? name;
  }

  /** 조각 하나와 거기 붙은 위첨자, 아래첨자, 프라임 */
  scripted() {
    const tok = this.peek();
    let base;
    if (tok.t === '^' || tok.t === '_' || tok.t === "'") base = { k: 'empty', cls: 'ord' };
    else base = this.atom();
    let sub;
    let sup;
    let limits;
    let primes = 0;
    for (;;) {
      const t = this.peek();
      if (!t) break;
      if (t.t === '^') {
        this.next();
        if (sup) fail('위첨자가 두 번 붙었다');
        sup = this.arg();
      } else if (t.t === '_') {
        this.next();
        if (sub) fail('아래첨자가 두 번 붙었다');
        sub = this.arg();
      } else if (t.t === "'") {
        if (sup) fail('프라임은 위첨자보다 앞에 적는다');
        this.next();
        primes++;
      } else if (this.isCmd(t, 'limits') || this.isCmd(t, 'nolimits')) {
        this.next();
        limits = t.v === 'limits';
      } else break;
    }
    if (limits !== undefined) base = { ...base, limits, forced: limits };
    // 프라임은 위첨자로 올리지 않는다. 수학 글꼴의 ′ 는 이미 위로 올라가 있어서, 밑 바로 뒤에 놓으면 제자리다
    if (primes) base = { k: 'group', cls: 'ord', body: [base, { k: 'mo', cls: 'ord', text: ['′', '″', '‴', '⁗'][primes - 1] ?? '′'.repeat(primes) }], tight: true };
    if (!sub && !sup) return base;
    return { k: 'script', cls: base.k === 'bigop' || base.k === 'named' ? 'op' : base.cls, lc: base.lc, rc: base.rc, base, sub, sup };
  }

  /** 명령의 인자: { … } 이거나 조각 하나 */
  arg() {
    const tok = this.peek();
    if (!tok) fail('인자가 있어야 할 곳에서 수식이 끝났다');
    if (tok.t === '{') {
      this.next();
      const body = this.list((t) => t.t === '}');
      if (!this.next()) fail('{ 가 닫히지 않았다');
      return body;
    }
    if (tok.t === '}' || tok.t === '&' || tok.t === '^' || tok.t === '_') fail(`인자가 있어야 할 곳에 ${tok.v} 가 왔다`);
    if (tok.t === 'num' && tok.v.length > 1) {
      // \frac12 는 1과 2다
      const first = tok.v[0];
      tok.v = tok.v.slice(1);
      return [{ k: 'mn', cls: 'ord', text: first }];
    }
    return [this.atom()];
  }

  /** [ … ] 로 적는 고를 수 있는 인자. 없으면 undefined */
  optional() {
    const tok = this.peek();
    if (!tok || tok.t !== 'chr' || tok.v !== '[') return undefined;
    this.next();
    const body = this.list((t) => t.t === 'chr' && t.v === ']');
    if (!this.next()) fail('[ 가 닫히지 않았다');
    return body;
  }

  /** \left, \big 뒤의 괄호 글자 */
  delim() {
    const tok = this.next();
    if (!tok) fail('괄호가 있어야 할 곳에서 수식이 끝났다');
    const key = tok.t === 'cmd' && tok.sym ? (tok.v === '|' ? '\\|' : `\\${tok.v}`) : tok.v;
    if (tok.t === 'cmd' && tok.sym && (tok.v === '{' || tok.v === '}')) return tok.v;
    if (!(key in DELIM)) fail(`괄호로 쓸 수 없다: ${tok.t === 'cmd' ? '\\' : ''}${tok.v}`);
    return DELIM[key];
  }

  atom() {
    const tok = this.next();
    switch (tok.t) {
      case 'num':
        return { k: 'mn', cls: 'ord', text: tok.v };
      case 'text':
        return { k: 'text', cls: 'ord', text: tok.v, font: tok.font };
      case '{': {
        const body = this.list((t) => t.t === '}');
        if (!this.next()) fail('{ 가 닫히지 않았다');
        return { k: 'group', cls: 'ord', body };
      }
      case '}':
        return fail('짝이 없는 }');
      case '&':
        return fail('& 는 aligned, cases, matrix 같은 환경 안에서만 쓴다');
      case 'chr':
        return this.char(tok.v);
      case 'cmd':
        return tok.sym ? this.symbol(tok.v) : this.command(tok.v);
      default:
        return fail(`여기에 올 수 없다: ${tok.v}`);
    }
  }

  char(ch) {
    if (/[a-zA-Z]/.test(ch)) return { k: 'mi', cls: 'ord', text: ch };
    switch (ch) {
      case '+':
        return { k: 'mo', cls: 'bin', text: '+' };
      case '-':
        return { k: 'mo', cls: 'bin', text: '−' };
      case '*':
        return { k: 'mo', cls: 'bin', text: '∗' };
      case '=':
      case '<':
      case '>':
      case ':':
        return { k: 'mo', cls: 'rel', text: ch };
      case ',':
      case ';':
        return { k: 'mo', cls: 'punct', text: ch };
      case '(':
      case '[':
        return { k: 'mo', cls: 'open', text: ch };
      case ')':
      case ']':
      case '!':
      case '?':
        return { k: 'mo', cls: 'close', text: ch };
      case '|':
        // 여는 것인지 닫는 것인지는 줄을 쓸 때 앞뒤를 보고 정한다(classes)
        return { k: 'mo', cls: 'ord', text: ch, bar: true };
      case '/':
      case '.':
      case '@':
      case '"':
        return { k: 'mo', cls: 'ord', text: ch };
      default: {
        const kind = DIRECT.get(ch);
        if (kind === 'rel' || kind === 'bin' || kind === 'open' || kind === 'close') return { k: 'mo', cls: kind, text: ch === '·' ? '⋅' : ch };
        if (kind === 'mi' || kind === 'up') return { k: 'mi', cls: 'ord', text: ch, upright: kind === 'up' };
        if (kind === 'bigop' || kind === 'int') return { k: 'bigop', cls: 'op', text: ch, limits: kind === 'bigop' };
        if (ch.codePointAt(0) > 0x7f) return { k: 'mo', cls: 'ord', text: ch };
        return fail(`수식에 쓸 수 없는 글자: ${ch}`);
      }
    }
  }

  /** \, \{ \\ 처럼 글자 하나짜리 명령 */
  symbol(ch) {
    if (ch in SPACE) return { k: 'space', cls: 'ord', mu: SPACE[ch], glue: true };
    if (ch === '{' || ch === '}') return { k: 'mo', cls: ch === '{' ? 'open' : 'close', text: ch };
    if (ch === '|') return { k: 'mo', cls: 'ord', text: '‖' };
    if (ch === '\\\\') return fail('\\\\ 는 aligned, cases, matrix 같은 환경 안에서만 쓴다');
    if (ch in SYMBOL) return { k: 'mi', cls: 'ord', text: SYMBOL[ch], upright: true };
    return fail(`모르는 명령: \\${ch}`);
  }

  command(name) {
    if (name in GREEK) return { k: 'mi', cls: 'ord', text: GREEK[name] };
    if (name in GREEK_UP) return { k: 'mi', cls: 'ord', text: GREEK_UP[name], upright: true };
    if (name in SYMBOL) return { k: 'mi', cls: INNER.has(name) ? 'inner' : 'ord', text: SYMBOL[name], upright: true };
    if (name in BIN) return { k: 'mo', cls: 'bin', text: BIN[name] };
    if (name in REL) return { k: 'mo', cls: 'rel', text: REL[name], wide: name === 'iff' || name === 'implies' || name === 'impliedby' };
    if (name in OPEN) return { k: 'mo', cls: 'open', text: OPEN[name] };
    if (name in CLOSE) return { k: 'mo', cls: 'close', text: CLOSE[name] };
    if (name in BIGOP) return { k: 'bigop', cls: 'op', text: BIGOP[name], limits: true };
    if (name in INTEGRAL) return { k: 'bigop', cls: 'op', text: INTEGRAL[name], limits: false };
    if (name in NAMED) return { k: 'named', cls: 'op', text: NAMED_TEXT[name] ?? name, limits: NAMED[name] };
    if (name in SPACE) return { k: 'space', cls: 'ord', mu: SPACE[name], glue: true };
    if (name in ACCENT) return { k: 'accent', cls: 'ord', body: this.arg(), mark: ACCENT[name][0], stretchy: ACCENT[name][1] };
    if (name in FONT) return { k: 'group', cls: 'ord', body: restyle(this.arg(), FONT[name]) };
    if (name in BIGSIZE || (name.slice(0, -1) in BIGSIZE && 'lrm'.includes(name.at(-1)))) {
      const size = BIGSIZE[name] ?? BIGSIZE[name.slice(0, -1)];
      const side = name in BIGSIZE ? 'ord' : { l: 'open', r: 'close', m: 'rel' }[name.at(-1)];
      return { k: 'mo', cls: side, text: this.delim(), size };
    }
    switch (name) {
      case 'ca':
      case 'cb':
      case 'cc':
      case 'cd':
        return { k: 'style', cls: 'ord', body: this.arg(), color: COLOR[name[1]] };
      case 'textcolor': {
        const color = this.colorName();
        return { k: 'style', cls: 'ord', body: this.arg(), color };
      }
      case 'frac':
      case 'dfrac':
      case 'tfrac':
      case 'cfrac':
        return { k: 'frac', cls: 'ord', num: this.arg(), den: this.arg(), style: name[0] === 'f' ? undefined : name[0] === 't' ? 'text' : 'display' };
      case 'binom':
      case 'dbinom':
      case 'tbinom':
        return { k: 'frac', cls: 'ord', num: this.arg(), den: this.arg(), bare: true, style: name[0] === 'b' ? undefined : name[0] === 't' ? 'text' : 'display' };
      case 'sqrt': {
        const index = this.optional();
        return { k: 'sqrt', cls: 'ord', index, body: this.arg() };
      }
      case 'vec':
        return { k: 'vec', cls: 'ord', body: this.arg() };
      case 'overline':
      case 'underline':
      case 'boxed':
        return { k: 'ruled', cls: 'ord', body: this.arg(), how: { overline: 'tex-ol', underline: 'tex-ul', boxed: 'tex-box' }[name] };
      case 'overbrace':
      case 'underbrace':
        return { k: 'brace', cls: 'ord', body: this.arg(), over: name === 'overbrace' };
      case 'overset':
      case 'stackrel':
      case 'underset': {
        const mark = this.arg();
        const body = this.arg();
        const cls = body.length === 1 ? body[0].cls : 'ord';
        return { k: 'stack', cls: name === 'stackrel' ? 'rel' : cls, body, mark, over: name !== 'underset' };
      }
      case 'xrightarrow':
      case 'xleftarrow': {
        const below = this.optional();
        return { k: 'xarrow', cls: 'rel', text: name === 'xrightarrow' ? '→' : '←', below, above: this.arg() };
      }
      case 'operatorname':
      case 'operatorname*': {
        const tok = this.next();
        if (!tok || tok.t !== '{') fail('\\operatorname 뒤에 { 가 없다');
        let text = '';
        for (;;) {
          const t = this.next();
          if (!t) fail('\\operatorname{ 가 닫히지 않았다');
          if (t.t === '}') break;
          text += t.t === 'cmd' && t.sym && t.v in SPACE ? ' ' : t.v;
        }
        return { k: 'named', cls: 'op', text, limits: name.endsWith('*') };
      }
      case 'not': {
        const next = this.atom();
        if (next.k !== 'mo' || !(next.text in NOT)) fail('\\not 뒤에는 = < > \\in \\equiv \\sim \\subset \\mid 같은 관계가 온다');
        return { ...next, text: NOT[next.text] };
      }
      case 'pmod': {
        const body = this.arg();
        return { k: 'group', cls: 'ord', body: [{ k: 'space', cls: 'ord', mu: 8, glue: true }, { k: 'mo', cls: 'open', text: '(' }, { k: 'named', cls: 'op', text: 'mod', limits: false }, ...body, { k: 'mo', cls: 'close', text: ')' }] };
      }
      case 'colon':
        return { k: 'mo', cls: 'punct', text: ':' };
      case 'phantom':
      case 'vphantom':
      case 'hphantom':
        return { k: 'phantom', cls: 'ord', body: this.arg() };
      case 'left':
        return this.leftRight();
      case 'right':
        return fail('\\right 에 짝이 되는 \\left 가 없다');
      case 'middle':
        return fail('\\middle 은 \\left 와 \\right 사이에서만 쓴다');
      case 'begin':
        return this.environment();
      case 'end':
        return fail('\\end 에 짝이 되는 \\begin 이 없다');
      case 'substack':
        return this.substack();
      case 'hline':
        return { k: 'empty', cls: 'ord', skip: true };
      default:
        return fail(`모르는 명령: \\${name}`);
    }
  }

  leftRight() {
    const left = this.delim();
    const parts = [];
    const mids = [];
    for (;;) {
      parts.push(this.list((t) => t.t === 'cmd' && !t.sym && (t.v === 'right' || t.v === 'middle')));
      const tok = this.next();
      if (!tok) fail('\\left 에 짝이 되는 \\right 가 없다');
      if (tok.v === 'middle') mids.push(this.delim());
      else break;
    }
    return { k: 'lr', cls: 'inner', lc: 'open', rc: 'close', left, right: this.delim(), parts, mids };
  }

  envName() {
    const tok = this.next();
    if (!tok || tok.t !== '{') fail('\\begin, \\end 뒤에는 { 이름 } 이 온다');
    let name = '';
    for (;;) {
      const t = this.next();
      if (!t) fail('환경 이름의 { 가 닫히지 않았다');
      if (t.t === '}') break;
      name += t.v;
    }
    return name;
  }

  /** & 와 \\ 로 나뉜 칸들. until(토큰)이 참이면 끝. toEnd: 수식이 끝나는 곳에서도 끝난다 */
  rows(until, toEnd = false) {
    const rows = [[]];
    for (;;) {
      const cell = this.list((t) => t.t === '&' || (t.t === 'cmd' && t.sym && t.v === '\\\\') || until(t));
      rows.at(-1).push(cell);
      const tok = this.peek();
      if (!tok && toEnd) break;
      if (!tok) fail('환경이 닫히지 않았다');
      if (until(tok)) break;
      this.next();
      if (tok.t === '&') continue;
      this.optional(); // \\[4pt] 의 간격은 읽고 버린다
      rows.push([]);
    }
    // \\ 로 끝난 마지막 빈 줄은 버린다
    if (rows.length > 1 && rows.at(-1).length === 1 && rows.at(-1)[0].every((n) => n.skip)) rows.pop();
    return rows;
  }

  environment() {
    const name = this.envName();
    let cols;
    if (name === 'array' || name === 'alignedat') {
      const tok = this.next();
      if (!tok || tok.t !== '{') fail(`\\begin{${name}} 뒤에 { 열 } 이 없다`);
      cols = '';
      for (;;) {
        const t = this.next();
        if (!t) fail('열을 적는 { 가 닫히지 않았다');
        if (t.t === '}') break;
        cols += t.v;
      }
    }
    if (!ALIGNED.has(name) && !(name in MATRIX) && !['gathered', 'gather', 'gather*', 'cases', 'array'].includes(name)) fail(`모르는 환경: ${name}`);
    const rows = this.rows((t) => t.t === 'cmd' && !t.sym && t.v === 'end');
    this.next();
    const closing = this.envName();
    if (closing !== name) fail(`\\begin{${name}} 을 \\end{${closing}} 으로 닫았다`);
    return { k: 'env', cls: 'ord', name, rows, cols };
  }

  substack() {
    const tok = this.next();
    if (!tok || tok.t !== '{') fail('\\substack 뒤에 { 가 없다');
    const rows = this.rows((t) => t.t === '}');
    this.next();
    return { k: 'env', cls: 'ord', name: 'substack', rows };
  }
}

/** \mathbf 같은 글꼴 명령을 조각들에 입힌다 */
function restyle(nodes, font) {
  return nodes.map((n) => {
    if (n.k === 'mi' || n.k === 'mn') return { ...n, font };
    const copy = { ...n };
    for (const key of ['body', 'num', 'den', 'sub', 'sup', 'index']) if (Array.isArray(copy[key])) copy[key] = restyle(copy[key], font);
    if (copy.base) copy.base = restyle([copy.base], font)[0];
    return copy;
  });
}

// ---------------------------------------------------------------- 쓰기(MathML로)

const mspace = (mu) => (mu > 0 ? `<mspace width="${em(mu)}"/>` : `<mspace style="margin-left:${em(mu)}"/>`);

function mo(text, { ls = 0, rs = 0, attrs = '' } = {}) {
  return `<mo lspace="${ls ? em(ls) : '0'}" rspace="${rs ? em(rs) : '0'}"${attrs}>${esc(text)}</mo>`;
}

/** 늘어나지 않는 괄호 */
const fence = (text) => mo(text, { attrs: ' stretchy="false"' });
/** 안의 것에 맞춰 늘어나는 괄호 */
const stretchy = (text) => (text ? mo(text, { attrs: ' fence="true" stretchy="true" symmetric="true"' }) : '');

/** 조각들을 한 요소로. 여럿이면 <mrow>로 묶는다 */
function one(nodes, ctx) {
  const { html, count } = row(nodes, ctx);
  return count === 1 ? html : `<mrow>${html}</mrow>`;
}

/** 이항 연산자가 놓인 자리에 따라 보통으로 바꾼다(TeX의 규칙). 갈래의 목록을 돌려준다 */
function classes(nodes) {
  const live = nodes.filter((n) => !(n.k === 'space') && !n.skip);
  const cls = live.map((n) => [n.lc ?? n.cls, n.rc ?? n.cls]);
  // 세로줄 | 는 글자만으로는 여는 것인지 닫는 것인지 알 수 없다. 앞이 비었거나 연산자, 관계, 여는 괄호, 구두점이면 여는 것으로 보고,
  // 그 밖에는 열린 세로줄이 있으면 닫는 것으로, 없으면 여는 것으로 본다. 그래야 |-3| 과 2|-x| 의 빼기가 부호로 읽힌다
  // (TeX 는 이럴 때 \lvert, \rvert 를 쓰라고 한다. 여기서는 그냥 | 로 적어도 되게 했다)
  let bars = 0;
  for (let i = 0; i < live.length; i++) {
    if (!live[i].bar) continue;
    const prev = i > 0 ? cls[i - 1][1] : undefined;
    const open = prev === undefined || ['bin', 'op', 'rel', 'open', 'punct'].includes(prev) || bars === 0;
    bars += open ? 1 : -1;
    cls[i] = open ? ['open', 'open'] : ['close', 'close'];
  }
  for (let i = 0; i < live.length; i++) {
    if (cls[i][0] !== 'bin') continue;
    const prev = i > 0 ? cls[i - 1][1] : undefined;
    const next = i + 1 < live.length ? cls[i + 1][0] : undefined;
    if (prev === undefined || ['bin', 'op', 'rel', 'open', 'punct'].includes(prev) || next === undefined || ['rel', 'close', 'punct'].includes(next)) cls[i] = ['ord', 'ord'];
  }
  return new Map(live.map((n, i) => [n, cls[i]]));
}

/** 조각들을 차례로 쓰고 사이에 빈칸을 넣는다. { html, count: 맨 위 요소의 수 } */
function row(nodes, ctx) {
  const cls = classes(nodes);
  const live = nodes.filter((n) => cls.has(n));
  // 이웃한 두 조각 사이의 빈칸(mu)
  const gap = new Map();
  for (let i = 0; i + 1 < live.length; i++) {
    const g = GAP[cls.get(live[i])[1]][cls.get(live[i + 1])[0]];
    let mu = g < 0 && ctx.script ? 0 : MU[Math.abs(g)];
    if (mu && (live[i].wide || live[i + 1].wide)) mu += 5;
    gap.set(live[i], mu);
  }
  let html = '';
  let count = 0;
  let before = 0; // 왼쪽 조각이 남긴 빈칸
  for (const n of nodes) {
    if (n.skip) continue;
    if (n.k === 'space') {
      html += mspace(n.mu);
      count++;
      continue;
    }
    const after = gap.get(n) ?? 0;
    const bare = n.k === 'mo' && !n.size;
    const c = cls.get(n)[0];
    if (bare && (c === 'bin' || c === 'rel')) {
      html += render(n, ctx, before, after);
      before = 0;
    } else if (bare && c === 'punct') {
      if (before) html += mspace(before), count++;
      html += render(n, ctx, 0, after);
      before = 0;
    } else {
      if (before) html += mspace(before), count++;
      html += render(n, ctx, 0, 0);
      before = after;
    }
    count++;
  }
  return { html, count };
}

function variantOf(n) {
  if (!n.font || n.font === 'it') return { text: n.text, attr: n.upright ? ' mathvariant="normal"' : '' };
  if (n.font === 'rm') return { text: n.text, attr: [...n.text].length === 1 ? ' mathvariant="normal"' : '' };
  let out = '';
  let missing = false;
  for (const ch of n.text) {
    const s = styled(ch, n.font);
    if (s === undefined) missing = true;
    out += s ?? ch;
  }
  // 옮길 글자가 없으면(굵은 그리스 대문자 등) 모양으로 흉내 낸다
  const style = missing && (n.font === 'bold' || n.font === 'bi') ? ' style="font-weight:bold"' : '';
  return { text: out, attr: (n.font === 'bold' && missing ? ' mathvariant="normal"' : '') + style };
}

const inner = (ctx) => ({ ...ctx, script: ctx.script + 1 });

function limitsOf(base, ctx) {
  // 위아래에 달 것인가. 큰 연산자는 브라우저가 글 안에서는 저절로 옆으로 옮긴다(movablelimits)
  if (base.k !== 'bigop' && base.k !== 'named') return false;
  return base.limits === true;
}

function render(n, ctx, ls = 0, rs = 0) {
  switch (n.k) {
    case 'empty':
      return '<mrow></mrow>';
    case 'mn': {
      const { text, attr } = variantOf(n);
      return `<mn${attr}>${esc(text)}</mn>`;
    }
    case 'mi': {
      const { text, attr } = variantOf(n);
      return `<mi${attr}>${esc(text)}</mi>`;
    }
    case 'mo':
      if (n.size) return mo(n.text, { attrs: ` fence="true" stretchy="true" symmetric="true" minsize="${n.size}em" maxsize="${n.size}em"` });
      if (n.cls === 'open' || n.cls === 'close') return fence(n.text);
      if (n.text === '|' || n.text === '‖' || n.text === '/') return fence(n.text);
      return mo(n.text, { ls, rs });
    case 'text': {
      const text = esc(n.text).replace(/^ +| +$/g, (s) => ' '.repeat(s.length));
      return `<mtext${n.font ? ` style="${n.font}"` : ''}>${text}</mtext>`;
    }
    case 'space':
      return mspace(n.mu);
    case 'group':
      return one(n.body, ctx);
    case 'named':
      return `<mi${[...n.text].length === 1 ? ' mathvariant="normal"' : ''}>${esc(n.text)}</mi>`;
    case 'bigop':
      return mo(n.text);
    case 'style': {
      const sub = { ...ctx };
      let attrs = '';
      if (n.color) attrs += ` mathcolor="${n.color}"`;
      if (n.display !== undefined) {
        sub.display = n.display;
        sub.script = n.level;
        attrs += ` displaystyle="${n.display}" scriptlevel="${n.level}"`;
      }
      return `<mstyle${attrs}>${row(n.body, sub).html}</mstyle>`;
    }
    case 'frac': {
      const sub = n.style ? { ...ctx, display: n.style === 'display', script: 0 } : ctx;
      const deeper = sub.display ? { ...sub, display: false } : inner(sub);
      let html = `<mfrac${n.bare ? ' linethickness="0"' : ''}>${one(n.num, deeper)}${one(n.den, deeper)}</mfrac>`;
      if (n.bare) html = `<mrow>${stretchy('(')}${html}${stretchy(')')}</mrow>`;
      return n.style ? `<mstyle displaystyle="${n.style === 'display'}" scriptlevel="0">${html}</mstyle>` : html;
    }
    case 'sqrt':
      if (n.index) return `<mroot>${one(n.body, ctx)}${one(n.index, inner(inner(ctx)))}</mroot>`;
      return `<msqrt>${row(n.body, ctx).html}</msqrt>`;
    case 'accent':
      return `<mover accent="true">${one(n.body, ctx)}${mo(n.mark, { attrs: n.stretchy ? ' stretchy="true"' : ' stretchy="false"' })}</mover>`;
    case 'vec':
      // 강세로 얹으면 화살표가 글자보다 넓다. 첨자 크기로 얹는다
      return `<mover>${one(n.body, ctx)}${mo('→', { attrs: ' stretchy="false"' })}</mover>`;
    case 'ruled':
      // 윗줄, 밑줄, 테두리는 CSS 로 긋는다(늘어나는 줄 글자는 글꼴마다 되는 것이 다르다). style.css 의 .tex-ol, .tex-ul, .tex-box
      return `<mrow class="${n.how}">${row(n.body, ctx).html}</mrow>`;
    case 'brace':
      return n.over
        ? `<mover>${one(n.body, ctx)}${mo('⏞', { attrs: ' stretchy="true"' })}</mover>`
        : `<munder>${one(n.body, ctx)}${mo('⏟', { attrs: ' stretchy="true"' })}</munder>`;
    case 'stack':
      return n.over ? `<mover>${one(n.body, ctx)}${one(n.mark, inner(ctx))}</mover>` : `<munder>${one(n.body, ctx)}${one(n.mark, inner(ctx))}</munder>`;
    case 'xarrow': {
      const arrow = mo(n.text, { attrs: ' stretchy="true"' });
      const pad = (nodes) => `<mrow><mspace width="0.3em"/>${row(nodes, inner(ctx)).html}<mspace width="0.3em"/></mrow>`;
      return n.below ? `<munderover>${arrow}${pad(n.below)}${pad(n.above)}</munderover>` : `<mover>${arrow}${pad(n.above)}</mover>`;
    }
    case 'phantom':
      return `<mphantom>${row(n.body, ctx).html}</mphantom>`;
    case 'lr': {
      const parts = n.parts.map((part) => row(part, ctx).html);
      // 안에 키 큰 것(분수, 근호, 표, 위아래에 얹은 것)이 없으면 TeX처럼 보통 크기의 괄호를 쓴다
      const tall = parts.some((html) => /<(mfrac|mtable|munder|mover|munderover|msqrt|mroot|mstyle displaystyle="true")[ >]/.test(html) || (ctx.display && /[∑∏∐⋃⋂∫∬∭∮]/.test(html)));
      const side = (text) => (tall ? stretchy(text) : text ? fence(text) : '');
      let html = side(n.left);
      parts.forEach((part, i) => {
        if (i > 0) html += tall ? mo(n.mids[i - 1], { ls: 3, rs: 3, attrs: ' fence="true" stretchy="true" symmetric="true"' }) : mo(n.mids[i - 1], { ls: 3, rs: 3, attrs: ' stretchy="false"' });
        html += part;
      });
      return `<mrow>${html}${side(n.right)}</mrow>`;
    }
    case 'script':
      return script(n, ctx);
    case 'env':
      return environment(n, ctx);
    default:
      return fail(`쓸 줄 모르는 조각: ${n.k}`);
  }
}

function script(n, ctx) {
  const deeper = inner(ctx);
  const sub = n.sub && one(n.sub, deeper);
  const sup = n.sup && one(n.sup, deeper);
  const { base } = n;
  if (limitsOf(base, ctx)) {
    // 한계를 위아래에. 이름으로 적는 연산자는 <mo>로 써야 글 안에서 옆으로 옮겨진다
    const forced = base.forced === true;
    const head = base.k === 'named' ? mo(base.text, { attrs: ` movablelimits="${forced ? 'false' : 'true'}"` }) : mo(base.text, forced ? { attrs: ' movablelimits="false"' } : {});
    if (sub && sup) return `<munderover>${head}${sub}${sup}</munderover>`;
    return sub ? `<munder>${head}${sub}</munder>` : `<mover>${head}${sup}</mover>`;
  }
  let head = render(base, ctx);
  // 밑이 여러 조각이면 묶는다. 프라임이나 지수가 마지막 글자에만 붙지 않게
  if (base.k === 'brace' && (n.over ?? true)) {
    // \overbrace{…}^{설명}, \underbrace{…}_{설명}
    if (base.over && sup && !sub) return `<mover>${head}${sup}</mover>`;
    if (!base.over && sub && !sup) return `<munder>${head}${sub}</munder>`;
  }
  // 분수에 붙는 지수는 분수 전체의 것이다. 크기를 정한 괄호(\Big)는 <mrow> 안에 있어야 그 크기로 그려진다
  if (base.k === 'frac' || (base.k === 'mo' && base.size)) head = `<mrow>${head}</mrow>`;
  if (sub && sup) return `<msubsup>${head}${sub}${sup}</msubsup>`;
  return sub ? `<msub>${head}${sub}</msub>` : `<msup>${head}${sup}</msup>`;
}

function environment(n, ctx) {
  const { name, rows } = n;
  const width = Math.max(...rows.map((r) => r.length));
  if (ALIGNED.has(name)) {
    // 홀수째 칸은 오른쪽, 짝수째 칸은 왼쪽으로 붙인다. 짝수째 칸이 = 로 시작해도 빈칸이 생기게 빈 조각을 앞에 둔다
    const body = rows
      .map((r) => `<mtr>${r.map((cell, j) => `<mtd class="${j % 2 ? 'tex-l' : 'tex-r'}"><mstyle displaystyle="true" scriptlevel="0">${row(j % 2 ? [{ k: 'empty', cls: 'ord' }, ...cell] : cell, { ...ctx, display: true, script: 0 }).html}</mstyle></mtd>`).join('')}</mtr>`)
      .join('');
    return `<mtable class="tex-al" columnalign="${Array.from({ length: width }, (_, j) => (j % 2 ? 'left' : 'right')).join(' ')}" columnspacing="0em" displaystyle="true">${body}</mtable>`;
  }
  if (name === 'gathered' || name === 'gather' || name === 'gather*') {
    const body = rows.map((r) => `<mtr><mtd><mstyle displaystyle="true" scriptlevel="0">${row(r[0], { ...ctx, display: true, script: 0 }).html}</mstyle></mtd></mtr>`).join('');
    return `<mtable class="tex-ga" displaystyle="true">${body}</mtable>`;
  }
  const cell = (c, cls, sub = ctx) => `<mtd${cls ? ` class="${cls}"` : ''}>${row(c, sub).html}</mtd>`;
  if (name === 'substack') return `<mtable class="tex-ss">${rows.map((r) => `<mtr>${cell(r[0], '', inner(ctx))}</mtr>`).join('')}</mtable>`;
  const text = { ...ctx, display: false };
  if (name === 'cases') {
    const body = rows.map((r) => `<mtr>${r.map((c) => cell(c, 'tex-l', text)).join('')}</mtr>`).join('');
    return `<mrow>${stretchy('{')}<mtable class="tex-ca" columnalign="left left">${body}</mtable></mrow>`;
  }
  if (name === 'array') {
    const spec = [...(n.cols ?? '')].filter((ch) => 'lcr'.includes(ch));
    const cls = (j) => ({ l: 'tex-l', r: 'tex-r', c: '' })[spec[j] ?? 'c'];
    const body = rows.map((r) => `<mtr>${r.map((c, j) => cell(c, cls(j), text)).join('')}</mtr>`).join('');
    return `<mtable class="tex-ma" columnalign="${spec.map((ch) => ({ l: 'left', r: 'right', c: 'center' })[ch]).join(' ') || 'center'}">${body}</mtable>`;
  }
  const [left, right] = MATRIX[name];
  const sub = name === 'smallmatrix' ? inner(text) : text;
  const body = rows.map((r) => `<mtr>${r.map((c) => cell(c, '', sub)).join('')}</mtr>`).join('');
  const table = `<mtable class="${name === 'smallmatrix' ? 'tex-sm' : 'tex-ma'}">${body}</mtable>`;
  return left ? `<mrow>${stretchy(left)}${table}${stretchy(right)}</mrow>` : table;
}

// ---------------------------------------------------------------- 바깥에서 부르는 것

/**
 * TeX 수식을 MathML 글로 바꾼다.
 * @param {string} tex
 * @param {{ display?: boolean }} [options] display: 따로 놓는 수식($$ … $$)이면 true
 * @returns {string}
 */
export function tex2mml(tex, { display = false } = {}) {
  try {
    const parser = new Parser(tokenize(tex));
    let nodes;
    // 따로 놓는 수식에서 환경 없이 \\ 로 줄을 나누면 가운데로 모은 여러 줄로 본다
    const loose = display && parser.toks.some((t, i) => t.t === 'cmd' && t.sym && t.v === '\\\\' && depthAt(parser.toks, i) === 0);
    if (loose) {
      const rows = parser.rows(() => false, true).map((r) => {
        if (r.length > 1) fail('& 는 aligned, cases, matrix 같은 환경 안에서만 쓴다');
        return r;
      });
      nodes = [{ k: 'env', cls: 'ord', name: 'gathered', rows }];
    } else {
      nodes = parser.list(() => false);
      if (parser.peek()) fail(`여기에 올 수 없다: ${parser.peek().v}`);
    }
    const ctx = { display, script: 0 };
    return `<math${display ? ' display="block"' : ''}>${row(nodes, ctx).html}</math>`;
  } catch (error) {
    if (error instanceof TexError) throw new Error(`수식을 읽을 수 없다: ${error.message}\n  ${tex}`);
    throw error;
  }
}

/** i번째 토큰이 중괄호와 환경 몇 겹 안에 있는가 */
function depthAt(toks, i) {
  let depth = 0;
  for (let j = 0; j < i; j++) {
    const t = toks[j];
    if (t.t === '{') depth++;
    else if (t.t === '}') depth--;
    else if (t.t === 'cmd' && !t.sym && (t.v === 'begin' || t.v === 'left')) depth++;
    else if (t.t === 'cmd' && !t.sym && (t.v === 'end' || t.v === 'right')) depth--;
  }
  return depth;
}
