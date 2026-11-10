/**
 * 줄치기의 바탕: 본문 글자를 하나의 긴 문자열로 보고 "몇 번째 글자부터 몇 번째까지"로 위치를 적는다.
 *
 * 칠하는 건 CSS Custom Highlight API(CSS.highlights)로 한다. 본문 DOM에 <mark>를 끼워 넣지 않으니
 * React가 그린 트리를 건드리지 않고, 본문 안의 상호작용 컴포넌트가 다시 그려져도 깨지지 않는다.
 * (Chrome 105+, Safari 17.2+, Firefox 140+. 지원하지 않는 브라우저에서는 칠해지지만 않고 목록에는 남는다.)
 */

export interface TextIndex {
  text: string;
  nodes: Text[];
  starts: number[];
}

export function buildIndex(root: Node): TextIndex {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  const starts: number[] = [];
  let text = '';
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const t = n as Text;
    nodes.push(t);
    starts.push(text.length);
    text += t.data;
  }
  return { text, nodes, starts };
}

/** (node, offset) 지점이 본문 문자열의 몇 번째 글자인지. Range.toString()은 글자 노드만 이어 붙이므로 buildIndex와 같은 셈이 된다. */
export function offsetOf(root: Node, node: Node, offset: number): number {
  const r = document.createRange();
  r.setStart(root, 0);
  r.setEnd(node, offset);
  return r.toString().length;
}

function locate(index: TextIndex, pos: number, preferNext: boolean): [Text, number] | null {
  // 이분 탐색으로 pos가 들어 있는 글자 노드를 찾는다.
  let lo = 0;
  let hi = index.nodes.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const start = index.starts[mid]!;
    const end = start + index.nodes[mid]!.data.length;
    if (pos < start) hi = mid - 1;
    else if (pos > end || (pos === end && preferNext && mid < index.nodes.length - 1)) lo = mid + 1;
    else return [index.nodes[mid]!, pos - start];
  }
  return null;
}

export function rangeOf(index: TextIndex, start: number, end: number): Range | null {
  const a = locate(index, start, true);
  const b = locate(index, end, false);
  if (!a || !b) return null;
  const r = document.createRange();
  r.setStart(a[0], a[1]);
  r.setEnd(b[0], b[1]);
  return r;
}

/** text가 start 이전에 몇 번 나왔는지(겹치지 않게 셈). */
export function occurrenceBefore(full: string, text: string, start: number): number {
  let n = 0;
  for (let i = full.indexOf(text); i !== -1 && i < start; i = full.indexOf(text, i + text.length)) n++;
  return n;
}

export function findOccurrence(full: string, text: string, occurrence: number): number {
  let i = full.indexOf(text);
  for (let k = 0; k < occurrence && i !== -1; k++) i = full.indexOf(text, i + text.length);
  return i;
}

const NAME = 'bf-mark';

export function paint(ranges: Range[]): void {
  const reg = (globalThis.CSS as { highlights?: HighlightRegistry } | undefined)?.highlights;
  if (!reg || typeof globalThis.Highlight !== 'function') return;
  if (ranges.length === 0) reg.delete(NAME);
  else reg.set(NAME, new globalThis.Highlight(...ranges));
}

export function canPaint(): boolean {
  return typeof globalThis.Highlight === 'function' && !!(globalThis.CSS as { highlights?: unknown } | undefined)?.highlights;
}

/** 화면 좌표에 있는 글자 지점. */
export function caretAt(x: number, y: number): { node: Node; offset: number } | null {
  const d = document as Document & {
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null;
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
  };
  if (d.caretPositionFromPoint) {
    const p = d.caretPositionFromPoint(x, y);
    return p ? { node: p.offsetNode, offset: p.offset } : null;
  }
  const r = d.caretRangeFromPoint?.(x, y);
  return r ? { node: r.startContainer, offset: r.startOffset } : null;
}
