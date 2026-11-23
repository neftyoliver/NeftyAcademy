/**
 * .mdx 에 $…$ 와 $$…$$ 로 적은 수식을 MathML 로 바꿔 넣는 Vite 플러그인. 수식을 바꾸는 일은 tex2mml.mjs 가 한다.
 *
 *   넓이는 $\pi r^2$ 이다.                 글 안의 수식
 *
 *   $$
 *   \int_0^1 x^2 \, dx = \frac{1}{3}      따로 놓는 수식. $$ 는 줄 맨 앞에 적고, 앞뒤에 빈 줄을 둔다
 *   $$
 *
 *   <Figure caption={<>넓이 {TEX`x^2`}</>}>   JSX 안(속성의 { } 안)에서는 TEX`…` 로 적는다
 *
 * MDX 는 { } 와 < 를 자기 문법으로 읽는다. 그래서 MDX 가 읽기 전에 글을 먼저 고쳐, 수식 자리에
 * <span className="tex" dangerouslySetInnerHTML={{ __html: "<math>…</math>" }} /> 를 넣는다.
 * 결과물에는 MathML 만 남고, 수식을 바꾸는 코드는 들어가지 않는다.
 *
 * 건드리지 않는 곳: 코드 블록(```), 글 안의 코드(`…`), import·export 줄, JSX 태그의 속성, { } 안의 자바스크립트.
 * 달러 글자를 그대로 쓰려면 \$ 로 적는다. 닫히지 않은 $ 와 읽을 수 없는 수식은 파일과 줄 번호를 붙여 오류로 알린다.
 *
 * 수학 책에만 건다(vite.config.ts 의 include). 다른 책의 본문에 있는 $ 는 그대로 둔다.
 */
import { tex2mml } from './tex2mml.mjs';

/** MathML 을 JSX 속성에 넣을 문자열로. 표의 칸을 가르지 않게 | 는 유니코드 번호로 적는다 */
const literal = (html) => JSON.stringify(html).replace(/\|/g, '\\u007c');
const inline = (html) => `<span className="tex" dangerouslySetInnerHTML={{ __html: ${literal(html)} }} />`;
const block = (html) => `<div className="tex-block" dangerouslySetInnerHTML={{ __html: ${literal(html)} }} />`;

/**
 * .mdx 글에서 수식을 찾아 JSX 로 바꾼 글을 돌려준다.
 * @param {string} src .mdx 파일의 글
 * @param {string} [file] 오류에 적을 파일 이름
 * @returns {string}
 */
export function mathToJsx(src, file = '') {
  const n = src.length;
  let out = '';
  const lineOf = (pos) => src.slice(0, pos).split('\n').length;
  const bad = (pos, message) => {
    throw new Error(`${file}:${lineOf(pos)} ${message}`);
  };
  const convert = (tex, display, pos) => {
    try {
      return tex2mml(tex, { display });
    } catch (error) {
      return bad(pos, error.message);
    }
  };

  /** { 다음 자리에서 시작해, 짝이 되는 } 까지의 자바스크립트를 그대로 옮긴다. TEX`…` 만 바꾼다. 끝난 다음 자리를 돌려준다 */
  const js = (start) => {
    let i = start;
    let last = '{'; // 빈칸을 뺀 바로 앞 글자. < 가 비교인지 JSX 인지 가리는 데 쓴다
    for (;;) {
      if (i >= n) bad(start, '{ 가 닫히지 않았다');
      const ch = src[i];
      if (ch === '}') {
        out += ch;
        return i + 1;
      }
      if (ch === '{') {
        out += ch;
        i = js(i + 1);
        last = '}';
      } else if (ch === '"' || ch === "'") {
        const end = quoted(i, ch, true);
        out += src.slice(i, end);
        i = end;
        last = ch;
      } else if (ch === '`') {
        i = template(i);
        last = ch;
      } else if (src.startsWith('TEX`', i) && !/[A-Za-z0-9_$]/.test(src[i - 1] ?? '')) {
        const end = src.indexOf('`', i + 4);
        if (end < 0) bad(i, 'TEX` 가 닫히지 않았다');
        out += inline(convert(src.slice(i + 4, end), false, i));
        i = end + 1;
        last = '>';
      } else if (src.startsWith('/*', i)) {
        const end = src.indexOf('*/', i + 2);
        if (end < 0) bad(i, '/* 가 닫히지 않았다');
        out += src.slice(i, end + 2);
        i = end + 2;
      } else if (src.startsWith('//', i)) {
        const end = src.indexOf('\n', i);
        out += src.slice(i, end < 0 ? n : end);
        i = end < 0 ? n : end;
      } else if (ch === '<' && /[A-Za-z>]/.test(src[i + 1] ?? '') && !/[A-Za-z0-9_$)\]]/.test(last)) {
        i = element(i);
        last = '>';
      } else {
        out += ch;
        if (!/\s/.test(ch)) last = ch;
        i++;
      }
    }
  };

  /** 따옴표로 묶인 글의 끝 다음 자리. escapes: 역슬래시로 따옴표를 피할 수 있는가(자바스크립트는 되고 JSX 속성은 안 된다) */
  const quoted = (start, quote, escapes) => {
    for (let i = start + 1; i < n; i++) {
      if (escapes && src[i] === '\\') i++;
      else if (src[i] === quote) return i + 1;
    }
    return bad(start, `${quote} 가 닫히지 않았다`);
  };

  /** `…` 템플릿 글. ${ } 안은 자바스크립트로 읽는다 */
  const template = (start) => {
    out += '`';
    let i = start + 1;
    for (;;) {
      if (i >= n) bad(start, '` 가 닫히지 않았다');
      if (src[i] === '\\') {
        out += src.slice(i, i + 2);
        i += 2;
      } else if (src[i] === '`') {
        out += '`';
        return i + 1;
      } else if (src.startsWith('${', i)) {
        out += '${';
        i = js(i + 2);
      } else out += src[i++];
    }
  };

  /** < 자리에서 시작해 태그 하나(<이름 속성…>, </이름>, <>)를 옮긴다. { end, open: 여는 태그인가 } */
  const tag = (start) => {
    let i = start + 1;
    out += '<';
    if (src[i] === '/') {
      const end = src.indexOf('>', i);
      if (end < 0) bad(start, '태그가 닫히지 않았다');
      out += src.slice(i, end + 1);
      return { end: end + 1, open: false };
    }
    for (;;) {
      if (i >= n) bad(start, '태그가 닫히지 않았다');
      const ch = src[i];
      if (ch === '>') {
        out += ch;
        return { end: i + 1, open: true };
      }
      if (src.startsWith('/>', i)) {
        out += '/>';
        return { end: i + 2, open: false };
      }
      if (ch === '{') {
        out += ch;
        i = js(i + 1);
      } else if (ch === '"' || ch === "'") {
        const end = quoted(i, ch, false);
        out += src.slice(i, end);
        i = end;
      } else out += src[i++];
    }
  };

  /** { } 안에 든 JSX 요소 하나를 닫는 태그까지 옮긴다. 그 안의 글은 마크다운이 아니므로 $ 를 보지 않는다 */
  const element = (start) => {
    const first = tag(start);
    let i = first.end;
    if (!first.open) return i;
    for (;;) {
      if (i >= n) bad(start, '태그가 닫히지 않았다');
      if (src.startsWith('</', i)) return tag(i).end;
      if (src[i] === '<' && /[A-Za-z>]/.test(src[i + 1] ?? '')) i = element(i);
      else if (src[i] === '{') {
        out += '{';
        i = js(i + 1);
      } else out += src[i++];
    }
  };

  let i = 0;
  let lineStart = true;
  while (i < n) {
    if (lineStart) {
      lineStart = false;
      const rest = src.slice(i, i + 400);
      // 코드 블록
      const fence = /^[ \t]*(`{3,}|~{3,})/.exec(rest);
      if (fence) {
        const close = new RegExp(`\\n[ \\t]*${fence[1][0]}{${fence[1].length},}[ \\t]*(?=\\n|$)`, 'g');
        close.lastIndex = i + fence[0].length;
        const m = close.exec(src);
        const end = m ? m.index + m[0].length : n;
        out += src.slice(i, end);
        i = end;
        continue;
      }
      // import, export: 빈 줄까지가 한 덩어리다
      if (/^(import|export)\s/.test(rest)) {
        const blank = src.indexOf('\n\n', i);
        const end = blank < 0 ? n : blank;
        out += src.slice(i, end);
        i = end;
        continue;
      }
      // 따로 놓는 수식
      const display = /^([ \t]*)\$\$/.exec(rest);
      if (display) {
        const open = i + display[0].length;
        const close = src.indexOf('$$', open);
        if (close < 0) bad(i, '$$ 가 닫히지 않았다');
        const eol = src.indexOf('\n', close);
        const tail = src.slice(close + 2, eol < 0 ? n : eol);
        if (tail.trim()) bad(close, '닫는 $$ 뒤에는 아무것도 적지 않는다');
        const tex = src.slice(open, close).trim();
        if (!tex) bad(i, '빈 수식');
        out += display[1] + block(convert(tex, true, i));
        i = eol < 0 ? n : eol;
        continue;
      }
    }
    const ch = src[i];
    if (ch === '\n') {
      out += ch;
      i++;
      lineStart = true;
    } else if (ch === '\\') {
      out += src.slice(i, i + 2);
      i += 2;
    } else if (ch === '`') {
      // 글 안의 코드: 같은 수의 ` 로 닫힌다
      const run = /^`+/.exec(src.slice(i))[0];
      const end = src.indexOf(run, i + run.length);
      const stop = end < 0 ? n : end + run.length;
      out += src.slice(i, stop);
      i = stop;
    } else if (ch === '{') {
      out += ch;
      i = js(i + 1);
    } else if (ch === '<' && /[A-Za-z/>]/.test(src[i + 1] ?? '')) {
      // 마크다운 안의 JSX 태그. 태그 사이의 글은 다시 마크다운이므로 태그만 옮긴다
      i = tag(i).end;
    } else if (ch === '$') {
      if (src[i + 1] === '$') bad(i, '$$ 는 줄 맨 앞에 적는다');
      if (/\s/.test(src[i + 1] ?? ' ')) bad(i, '여는 $ 뒤에 빈칸이 있다(달러 글자는 \\$ 로 적는다)');
      let j = i + 1;
      for (;;) {
        if (j >= n || src.startsWith('\n\n', j)) bad(i, '$ 가 닫히지 않았다(달러 글자는 \\$ 로 적는다)');
        if (src[j] === '\\') j += 2;
        else if (src[j] === '$') break;
        else j++;
      }
      if (/\s/.test(src[j - 1])) bad(j, '닫는 $ 앞에 빈칸이 있다(달러 글자는 \\$ 로 적는다)');
      out += inline(convert(src.slice(i + 1, j).replace(/\s*\n\s*/g, ' '), false, i));
      i = j + 1;
    } else {
      out += ch;
      i++;
    }
  }
  return out;
}

/**
 * Vite 플러그인. MDX 플러그인보다 앞에 둔다.
 * @param {{ include: RegExp }} options include: 수식을 바꿀 파일의 경로
 */
export default function mdxMath({ include }) {
  return {
    name: 'mdx-math',
    enforce: 'pre',
    transform(code, id) {
      const path = id.split('?')[0];
      if (!path.endsWith('.mdx') || !include.test(path)) return null;
      return { code: mathToJsx(code, path), map: null };
    },
  };
}
