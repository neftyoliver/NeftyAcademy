/**
 * 용어 색인. "이 낱말은 이 쪽이 설명한다"를 모아 두었다가, 다른 쪽의 코드에 그 낱말이 나오면 그 쪽으로 가는 링크로 만든다.
 * (링크를 다는 일은 remark-term-links.mjs 가 한다. 여기는 색인과 낱말 찾기만 있다)
 *
 * 쪽은 자기가 설명하는 낱말을 .mdx 맨 위에 적는다:
 *
 *   export const terms = ['unique_ptr', 'std::move', '~move', 'free()'];
 *
 * 낱말을 적는 세 가지 꼴
 *
 *   unique_ptr     그대로. 코드 블록과 본문의 `코드` 어디서든, 이 이름이 들어 있으면 걸린다
 *                  (std::unique_ptr<T> 의 std::unique_ptr 도 걸린다). 다른 뜻으로 쓰일 일이 없는 이름에 쓴다.
 *   std::move      이름공간까지. std::move 라고 적힌 곳만 걸린다. move 처럼 변수 이름으로도 흔한 낱말은 이렇게 적는다.
 *   ~move          본문의 `코드` 에서만, 그것도 그 이름을 가리켜 적은 것만. 코드 블록에서는 걸리지 않는다.
 *                  `move`, `vector<int>`, `vector::size()`, `noexcept(false)`, `[[likely]]` 는 걸리고,
 *                  `future.cpp` 나 `x = move` 처럼 다른 글 속에 섞인 것은 걸리지 않는다.
 *                  예약어(~constexpr)처럼 코드 블록마다 나와서 다 걸면 어지러운 낱말에도 쓴다.
 *   free()         함수. 코드 블록에서는 free(…) 처럼 부르는 자리만 걸리고(변수 free 나 x.free() 는 걸리지 않는다),
 *                  본문에서는 `free` 나 `free()` 라고만 적은 것도 걸린다. C 함수처럼 이름공간이 없는 흔한 낱말에 쓴다.
 *
 * 그 쪽에서만 끄기
 *   어떤 쪽에서는 같은 낱말이 다른 것을 가리킨다(루아 함수 move, 플러그인 이름 future). 그 쪽의 맨 위에
 *     export const noterms = ['move'];
 *   라고 적으면 그 쪽에서는 그 이름에 링크를 걸지 않는다(이름의 끝 마디로 적는다: std::move 도 move).
 *
 * 걸리지 않는 것
 *   - 점이나 화살표 뒤의 이름(v.size(), p->next)은 멤버라서 건너뛴다.
 *   - 함수 꼴(free())은 선언하는 자리에서는 걸리지 않는다: `void close()`, `virtual int read() = 0`, `char *strcpy(…)`.
 *     같은 이름의 멤버 함수나 자기 함수를 만드는 코드가 표준 함수 쪽으로 이어지지 않게 하려는 것이다.
 *
 * 갈래(family)
 *   같은 낱말이라도 언어가 다르면 다른 것이다(C의 open 과 파이썬의 open). 그래서 책을 갈래로 묶는다(src/books/terms.json).
 *   한 갈래 안에서 낱말 하나는 한 쪽만 가질 수 있다(둘이 적으면 빌드가 멈춘다).
 *   쪽은 자기 갈래의 낱말을 먼저 찾고, 없으면 갈래가 "본다(sees)"고 적은 갈래를 차례로 찾는다(C++ 는 C 를 본다).
 *   같은 이름이 갈래마다 다른 쪽을 가리켜도 된다: Qt 책의 connect( 는 시그널과 슬롯 쪽, 다른 책의 connect( 는 소켓 쪽.
 *   갈래에 적히지 않은 책은 혼자서 한 갈래다(자기 책 안에서만 링크가 걸린다).
 *   갈래의 local 에 적은 이름은 그 갈래의 책에서만 걸린다. read, write, close 처럼 다른 언어에서는
 *   멤버 함수 이름으로 흔한 낱말을 적는다(C 책의 read( 는 걸리고, C++ 책의 read( 는 걸리지 않는다).
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const CHAIN = /^[A-Za-z_][A-Za-z0-9_]*(?:::[A-Za-z_][A-Za-z0-9_]*)*$/;
const TOKEN = /[A-Za-z_][A-Za-z0-9_]*(?:::[A-Za-z_][A-Za-z0-9_]*)*/g;
const TERMS = /^export const terms = \[([\s\S]*?)\];?[ \t]*$/m;
const STRING = /'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"/g;

/** 낱말 하나를 읽는다: '~move' → { chain: 'move', kind: 'prose' } */
export function parseTerm(raw) {
  let chain = raw.trim();
  let kind = 'plain';
  if (chain.startsWith('~')) {
    kind = 'prose';
    chain = chain.slice(1);
  } else if (chain.endsWith('()')) {
    kind = 'call';
    chain = chain.slice(0, -2);
  }
  if (!CHAIN.test(chain)) throw new Error(`용어를 읽을 수 없습니다: '${raw}' (이름, 이름공간::이름, ~이름, 이름() 가운데 하나여야 합니다)`);
  return { chain, kind };
}

/** .mdx 글에서 export const terms = [...] 의 낱말들을 꺼낸다. 없으면 빈 배열 */
export function termsIn(source) {
  const m = TERMS.exec(source);
  if (!m) return [];
  return [...m[1].matchAll(STRING)].map((s) => s[1] ?? s[2]);
}

const toPath = (at) => (at instanceof URL || String(at).startsWith('file:') ? fileURLToPath(at) : String(at)).replace(/[\\/]+$/, '');
const NOTERMS = /^export const noterms = \[([\s\S]*?)\];?[ \t]*$/m;
/** .mdx 글에서 export const noterms = [...] 의 낱말들을 꺼낸다(이 쪽에서는 용어로 보지 않을 이름). 없으면 빈 배열 */
export function notermsIn(source) {
  const m = NOTERMS.exec(source);
  if (!m) return [];
  return [...m[1].matchAll(STRING)].map((s) => s[1] ?? s[2]);
}

const glob = (pattern) => new RegExp(`^${pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`);

/**
 * @param {{ chapters: URL | string, config?: URL | string }} options
 *   chapters: src/chapters 폴더. 그 아래 <책 id>/<번호-챕터 id>.mdx 가 쪽이다.
 *   config:   갈래를 적은 JSON(src/books/terms.json). 없으면 책마다 한 갈래.
 *             { families: { 갈래: { books: [책 id, 별표 가능], sees: [더 찾아볼 갈래], langs: [링크를 걸 코드 블록의 언어],
 *                                  local: [이 갈래의 책에서만 걸리는 이름] } },
 *               pages: { '폴더/챕터 id': '책 id/챕터 id' }  ← 폴더와 다른 책에 실린 쪽 }
 */
export function createTermIndex(options) {
  const chaptersDir = toPath(options.chapters);
  const config = options.config ? JSON.parse(readFileSync(toPath(options.config), 'utf8')) : {};
  const families = Object.entries(config.families ?? {}).map(([id, f]) => ({ id, books: f.books.map(glob), sees: f.sees ?? [], langs: f.langs ? new Set(f.langs) : null, local: new Set(f.local ?? []) }));
  const moved = config.pages ?? {};
  // 책 이름을 그대로 적은 갈래가 먼저다. 그래야 'cpp-*' 와 'cpp-qt' 를 함께 적었을 때 cpp-qt 가 제 갈래로 간다
  const exact = new Map();
  for (const [id, f] of Object.entries(config.families ?? {})) for (const b of f.books) if (!b.includes('*') && !exact.has(b)) exact.set(b, id);
  const familyOfBook = (book) => exact.get(book) ?? families.find((f) => f.books.some((re) => re.test(book)))?.id ?? book;

  // 경로의 끝이 …/chapters/<책>/<파일>.mdx 인가만 본다(윈도우의 역슬래시와 드라이브 글자 대소문자에 흔들리지 않게)
  const tail = new RegExp(`(?:^|/)${basename(chaptersDir)}/([^/]+)/([^/]+)\\.mdx$`);
  const keyOf = (path) => {
    const m = tail.exec(path.replace(/\\/g, '/').replace(/[?#].*$/, ''));
    if (!m) return null;
    const key = `${m[1]}/${m[2].replace(/^(\d+-)+/, '')}`;
    return moved[key] ?? key;
  };

  /** 갈래 id → Map(낱말 → { target, kind }) */
  const tables = new Map();
  /** 표로 보여 줄 때 쓰는 목록 */
  const claims = [];
  for (const book of readdirSync(chaptersDir).sort()) {
    const dir = join(chaptersDir, book);
    if (!statSync(dir).isDirectory()) continue;
    for (const file of readdirSync(dir).sort()) {
      if (!file.endsWith('.mdx')) continue;
      const path = join(dir, file);
      const target = keyOf(path);
      const family = familyOfBook(target.split('/')[0]);
      for (const raw of termsIn(readFileSync(path, 'utf8'))) {
        let term;
        try {
          term = parseTerm(raw);
        } catch (e) {
          throw new Error(`${book}/${file}: ${e.message}`);
        }
        let table = tables.get(family);
        if (!table) tables.set(family, (table = new Map()));
        const old = table.get(term.chain);
        if (old && old.target !== target) throw new Error(`용어 '${term.chain}' 을(를) 두 쪽이 적었습니다(갈래 ${family}): ${old.target}, ${target}`);
        if (old && old.kind !== term.kind) throw new Error(`${target}: 용어 '${term.chain}' 을(를) 두 가지 꼴로 적었습니다`);
        table.set(term.chain, { target, kind: term.kind });
        claims.push({ family, term: raw, target });
      }
    }
  }

  const views = new Map();
  /** 그 쪽에서 낱말을 찾을 때 볼 것: 찾아볼 갈래의 표들(차례대로)과, 링크를 걸 코드 블록의 언어 */
  const viewOf = (pageKey) => {
    const id = familyOfBook(pageKey.split('/')[0]);
    let view = views.get(id);
    if (!view) {
      const family = families.find((f) => f.id === id);
      const seen = [];
      for (const other of family?.sees ?? []) {
        const table = tables.get(other);
        if (!table) continue;
        // 다른 갈래의 표에서는 그 갈래 안에서만 쓰기로 한 이름(local)을 뺀다
        const local = families.find((f) => f.id === other)?.local;
        seen.push(local?.size ? new Map([...table].filter(([chain]) => !local.has(chain))) : table);
      }
      view = { tables: [tables.get(id), ...seen].filter(Boolean), langs: family?.langs ?? null };
      views.set(id, view);
    }
    return view;
  };

  return { keyOf, viewOf, claims, size: claims.length };
}

/** 본문의 `코드` 가 이름 하나를 가리켜 적은 것일 때, 이름 뒤에 올 수 있는 것: <인자>, ::멤버, (인자), ]] */
const AFTER_NAME = /^\s*(?:<.*>)?(?:::[A-Za-z_][A-Za-z0-9_:]*)?\s*(?:\(.*\))?\s*(?:\]\])?$/s;

function resolve(view, parts, inline, call, exact, named) {
  const n = parts.length;
  for (const table of view.tables) {
    // 긴 이름부터, 같은 길이면 오른쪽 것부터(std::chrono::steady_clock::now 에서는 now 보다 steady_clock::now 가, std 보다 now 가 먼저)
    for (let len = n; len >= 1; len--) {
      for (let start = n - len; start >= 0; start--) {
        const hit = table.get(len === n ? parts.join('::') : parts.slice(start, start + len).join('::'));
        if (!hit) continue;
        if (hit.kind === 'plain') return hit.target;
        // 본문에서만 거는 이름: 그 이름으로 시작하는 `코드` 여야 한다
        if (hit.kind === 'prose' && named && start === 0) return hit.target;
        // 함수: 이름의 끝이어야 하고, 앞에는 아무것도 없거나 std:: 만. 부르는 자리이거나, 본문에서 그 이름만 적은 것
        if (hit.kind === 'call' && start + len === n && (start === 0 || (start === 1 && parts[0] === 'std')) && (call || exact)) return hit.target;
      }
    }
  }
  return null;
}

/** 이름 앞에 올 수 있는 낱말 가운데, 타입이 아닌 것(이 뒤의 이름( 는 선언이 아니라 부르는 것이다) */
const BEFORE_CALL = new Set(['return', 'co_return', 'co_await', 'co_yield', 'throw', 'else', 'do', 'case', 'and', 'or', 'not']);

/**
 * start 에서 시작하는 이름이 선언되는 자리인가: 앞에 타입으로 보이는 것이 있다.
 *   void close()   double read() const   char *strcpy(char *dst, …)   int& get()
 * before = 이름 앞에서 빈칸을 건너뛴 자리.
 */
function declared(text, start, before) {
  if (before < 0) return false;
  const c = text[before];
  // 별표와 & 는 이름에 바로 붙어 있을 때만 선언으로 본다(a * rand() 는 곱셈)
  if ((c === '*' || c === '&') && before === start - 1) return true;
  if (!/[A-Za-z0-9_>]/.test(c)) return false;
  if (c === '>') return before !== start - 1; // 템플릿 인자가 끝난 타입 뒤에 띄고 온 이름: vector<int> make()
  let k = before;
  while (k >= 0 && /[A-Za-z0-9_]/.test(text[k])) k--;
  return !BEFORE_CALL.has(text.slice(k + 1, before + 1));
}

/**
 * 글에서 용어를 찾는다.
 * @param {string} text  코드 블록의 글, 또는 본문의 `코드` 한 조각
 * @param {ReturnType<ReturnType<typeof createTermIndex>['viewOf']>} view
 * @param {boolean} inline  본문의 `코드` 인가(코드 블록이 아니라)
 * @returns {{ start: number, end: number, target: string }[]}  겹치지 않고, 앞에서부터
 */
export function findTerms(text, view, inline) {
  const out = [];
  if (view.tables.length === 0) return out;
  const whole = text.trim();
  for (const m of text.matchAll(TOKEN)) {
    const start = m.index;
    const end = start + m[0].length;
    // 점이나 화살표 뒤는 멤버
    let i = start - 1;
    while (i >= 0 && /\s/.test(text[i])) i--;
    if (i >= 0 && (text[i] === '.' || (text[i] === '>' && text[i - 1] === '-'))) continue;
    let j = end;
    while (j < text.length && (text[j] === ' ' || text[j] === '\t')) j++;
    // 부르는 자리인가. 이름 뒤에 ( 가 오고, 선언이 아니어야 한다
    const call = text[j] === '(' && !declared(text, start, i);
    const exact = inline && (whole === m[0] || whole === `${m[0]}()`);
    // 이 `코드` 가 이 이름을 가리켜 적은 것인가: 맨 앞에 있고([[ 는 빼고), 뒤에는 인자나 멤버만 온다
    const named = inline && /^\s*(?:\[\[)?\s*$/.test(text.slice(0, start)) && AFTER_NAME.test(text.slice(end));
    const target = resolve(view, m[0].split('::'), inline, call, exact, named);
    if (target) out.push({ start, end, target });
  }
  return out;
}
