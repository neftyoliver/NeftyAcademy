/**
 * 쓴 챕터를 폴더에서 저절로 모은다.
 *
 *   book('cpp-syntax', 'C++ 문법', …, 차례, writtenIn('cpp-syntax'))
 *
 * src/chapters/cpp-syntax/ 에 .mdx 파일을 넣기만 하면 그 챕터가 열린다. library.tsx 나 차례 파일을 고칠 필요가 없다.
 *
 *  - 파일 이름에서 앞의 차례 번호를 뗀 것이 챕터 id 다:  03-2-types-init.mdx → types-init
 *    (번호는 폴더 안에서 파일이 차례대로 보이게 하려는 것일 뿐이다. 차례를 정하는 것은 차례 글이다)
 *  - 한 줄 요약은 파일 안에 적는다:  export const summary = '중괄호 하나로 통일된 초기화';
 *  - 본문의 챕터 링크([글](#/read/책/챕터))는 지도의 줄이 된다(remark-chapter-links.mjs 가 모은다)
 *  - 차례에 없는 id 의 파일이 있으면 outline()이 오류를 낸다(이름을 잘못 지은 것을 바로 알 수 있게)
 */
import type { ComponentType } from 'react';
import type { Written } from './outline';

interface Page {
  default: ComponentType;
  summary?: string;
  links?: string[];
}

const pages = import.meta.glob<Page>('../chapters/**/*.mdx', { eager: true });

export function writtenIn(folder: string): Written {
  const prefix = `../chapters/${folder}/`;
  const out: Written = {};
  for (const [path, page] of Object.entries(pages)) {
    if (!path.startsWith(prefix)) continue;
    const file = path.slice(prefix.length);
    if (file.includes('/')) continue;
    const id = file.replace(/\.mdx$/, '').replace(/^(\d+-)+/, '');
    if (out[id]) throw new Error(`같은 챕터 id 의 파일이 둘입니다: ${folder}/${id}`);
    out[id] = [page.default, page.summary, page.links];
  }
  return out;
}
