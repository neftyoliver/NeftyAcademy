/**
 * 코드에 나온 용어를 그 용어를 설명하는 쪽으로 가는 링크로 만드는 remark 플러그인.
 * 어느 낱말이 어느 쪽의 것인지는 term-index.mjs 가 안다(쪽마다 적은 export const terms).
 *
 *   std::unique_ptr<Shape> p;      코드 블록 안의 std::unique_ptr 가 「unique_ptr」 쪽으로 가는 링크가 된다
 *   본문의 `unique_ptr`             이것도
 *
 * 링크는 <a class="bf-ref" href="#/read/책/챕터"> 로 들어간다. 글자는 그대로라서 복사한 코드도, 줄치기의 위치도 달라지지 않는다.
 *
 *  - 같은 낱말은 처음 한 번만 건다. 본문의 `코드` 는 한 절(## 제목부터 다음 ## 까지)에서 한 번,
 *    코드 블록은 그 블록에서 한 번. 줄마다 밑줄이 서면 읽기 어렵고, 처음 나온 곳에 걸려 있으면 찾기에 충분하다.
 *    (낱말이 다르면 같은 쪽으로 가더라도 따로 건다: std::sort 와 std::lower_bound)
 *  - text 블록(실행 결과)은 건드리지 않는다. 지어낸 이름이 든 예시처럼 링크가 맞지 않는 블록에는
 *    ```c nolink 처럼 nolink 를 적어 그 블록만 끌 수 있다.
 *  - 제목 줄과 이미 링크인 글, 자기 쪽으로 가는 링크는 걸지 않는다.
 *  - 쪽의 맨 위에 export const noterms = ['move'] 라고 적으면 그 쪽에서는 그 이름에 걸지 않는다.
 *
 * 찾은 쪽들은 file.data.termTargets 에 적어 둔다. remark-chapter-links.mjs 가 이것을 본문의 링크와 합쳐
 * `export const links` 로 내보내므로, 지도의 줄과 「같이 보기」에도 같이 잡힌다.
 */
import { findTerms, notermsIn } from './term-index.mjs';

const anchor = (target, text, inCode) => ({
  type: 'element',
  tagName: 'a',
  // 코드 블록 안의 링크는 끌리지 않게: 링크 위에서 누르고 끌어도 글자가 골라진다
  properties: { href: `#/read/${target}`, className: ['bf-ref'], ...(inCode ? { draggable: 'false' } : {}) },
  children: [{ type: 'text', value: text }],
});

/** 글을 조각으로: 용어는 링크, 나머지는 글자 */
function pieces(text, hits, inCode) {
  const out = [];
  let at = 0;
  for (const h of hits) {
    if (h.start > at) out.push({ type: 'text', value: text.slice(at, h.start) });
    out.push(anchor(h.target, text.slice(h.start, h.end), inCode));
    at = h.end;
  }
  if (at < text.length) out.push({ type: 'text', value: text.slice(at) });
  return out;
}

/** 같은 낱말인지 가리는 열쇠: 가는 쪽과 이름의 끝 마디(std::vector 와 vector 는 같은 낱말) */
const wordOf = (text, hit) => `${hit.target}|${text.slice(hit.start, hit.end).split('::').pop()}`;

/** @param {{ index: import('./term-index.mjs').TermIndex }} options */
export default function remarkTermLinks({ index }) {
  return (tree, file) => {
    const self = index.keyOf(file.path ?? '');
    if (!self) return;
    const view = index.viewOf(self);
    if (view.tables.length === 0) return;
    const targets = new Set();
    let seen = new Set();
    // 이 쪽에서는 용어로 보지 않기로 한 이름(export const noterms)
    const off = new Set(notermsIn(String(file.value ?? '')));
    /** 자기 쪽으로 가는 것, 이 쪽에서 끈 이름, 이미 건 낱말을 뺀다 */
    const fresh = (text, hits, done) =>
      hits.filter((h) => {
        if (h.target === self) return false;
        if (off.size > 0 && off.has(text.slice(h.start, h.end).split('::').pop())) return false;
        const word = wordOf(text, h);
        if (done.has(word)) return false;
        done.add(word);
        return true;
      });

    const walk = (node) => {
      if (node.type === 'heading') {
        if (node.depth <= 2) seen = new Set();
        return;
      }
      if (node.type === 'link' || node.type === 'linkReference') return;
      if (node.type === 'inlineCode') {
        // mdast-util-to-hast 가 하는 것과 같게 줄바꿈을 빈칸으로 바꾼 글에서 찾는다(자리가 어긋나지 않게)
        const text = node.value.replace(/\r?\n|\r/g, ' ');
        const hits = fresh(text, findTerms(text, view, true), seen);
        if (hits.length === 0) return;
        for (const h of hits) targets.add(h.target);
        node.data = { ...node.data, hChildren: pieces(text, hits, false) };
        return;
      }
      if (node.type === 'code') {
        const lang = node.lang ?? '';
        // 실행 결과(text), 언어를 적지 않은 블록, 이 갈래에서 다루지 않는 언어, 그리고 nolink 라고 적은 블록은 건너뛴다
        if (!node.value || lang === '' || lang === 'text' || (view.langs && !view.langs.has(lang)) || /(^|\s)nolink(\s|$)/.test(node.meta ?? '')) return;
        const hits = fresh(node.value, findTerms(node.value, view, false), new Set());
        if (hits.length === 0) return;
        for (const h of hits) targets.add(h.target);
        node.data = { ...node.data, hChildren: pieces(`${node.value}\n`, hits, true) };
        return;
      }
      for (const child of node.children ?? []) walk(child);
    };
    walk(tree);
    file.data.termTargets = [...targets];
  };
}
