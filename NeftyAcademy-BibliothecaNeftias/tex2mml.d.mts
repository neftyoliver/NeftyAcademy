/** TeX 로 적은 수식을 MathML 글로 바꾼다. 읽을 수 없으면 오류를 낸다. */
export function tex2mml(tex: string, options?: { display?: boolean }): string;
