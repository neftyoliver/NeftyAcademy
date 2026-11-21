/**
 * 표에서 글이 긴 칸에 `bf-wide` 클래스를 붙이는 rehype 플러그인.
 *
 * 전화기처럼 좁은 화면에서는 표의 칸이 "가장 긴 낱말" 폭까지 줄어든다. 문장이 든 칸이 그렇게 줄면
 * 한 줄에 낱말 하나씩 세로로 쌓인다. 파라곤의 스타일은 `bf-wide` 가 붙은 칸에 여남은 글자 폭을 지켜 주고,
 * 그래도 자리가 모자라면 표가 옆으로 밀린다.
 *
 * 긴 칸: 코드가 아닌 글자가 공백을 빼고 LONG 자 이상인 칸.
 */
const LONG = 8;

function textLength(node) {
  if (node.type === 'text') return node.value.replace(/\s/g, '').length;
  if (node.type === 'element' && node.tagName === 'code') return 0;
  let n = 0;
  for (const child of node.children ?? []) n += textLength(child);
  return n;
}

export default function rehypeTableCells() {
  return (tree) => {
    const walk = (node) => {
      if (node.type === 'element' && (node.tagName === 'td' || node.tagName === 'th') && textLength(node) >= LONG) {
        const props = (node.properties ??= {});
        const cls = Array.isArray(props.className) ? props.className : props.className ? [props.className] : [];
        props.className = [...cls, 'bf-wide'];
      }
      for (const child of node.children ?? []) walk(child);
    };
    walk(tree);
  };
}
