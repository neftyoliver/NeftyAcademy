/**
 * 본문 안의 챕터 링크를 모아 `export const links = [...]`로 내보내는 remark 플러그인.
 *
 *   [ABI](#/read/c-basic/abi)   →   links = ['c-basic/abi']
 *
 * library.tsx 가 이 값을 챕터의 links 에 넣고, 지도는 그 두 챕터 사이에 줄을 긋는다.
 * 그래서 본문에 링크를 적기만 하면 지도에 줄이 생긴다.
 */
const ROUTE = /^#\/read\/([^/?#]+)\/([^/?#]+)/;

export default function remarkChapterLinks() {
  return (tree) => {
    const found = new Set();
    const walk = (node) => {
      if (node.type === 'link') {
        const m = ROUTE.exec(node.url ?? '');
        if (m) found.add(`${m[1]}/${m[2]}`);
      }
      for (const child of node.children ?? []) walk(child);
    };
    walk(tree);

    const elements = [...found].map((value) => ({ type: 'Literal', value, raw: JSON.stringify(value) }));
    tree.children.unshift({
      type: 'mdxjsEsm',
      value: `export const links = ${JSON.stringify([...found])};`,
      data: {
        estree: {
          type: 'Program',
          sourceType: 'module',
          body: [
            {
              type: 'ExportNamedDeclaration',
              specifiers: [],
              source: null,
              declaration: {
                type: 'VariableDeclaration',
                kind: 'const',
                declarations: [{ type: 'VariableDeclarator', id: { type: 'Identifier', name: 'links' }, init: { type: 'ArrayExpression', elements } }],
              },
            },
          ],
        },
      },
    });
  };
}
