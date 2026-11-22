/**
 * C++ 서가. 책 속에 책이 들어 있다.
 *
 *   C++
 *   ├─ C++ 문법
 *   ├─ C++ STL
 *   ├─ C++ 고급
 *   └─ C++ 최고급 (서가)
 *      ├─ 게임 엔진, Qt, 산업용 프로그램, …
 *
 * 차례는 core.ts, master-a.ts, master-b.ts 에 글로 적혀 있다. 챕터를 더하거나 순서를 바꾸려면 그 글을 고친다.
 */
import type { Book } from 'neftyacademy-paragons-bookshelf';
import { cppAdvanced, cppStl, cppSyntax } from './core';
import { cppComplexApp, cppDatabase, cppDbms, cppGameEngine, cppGameServer, cppIndustrial, cppLangImpl, cppQt, cppRaytracer, cppServiceServer, cppVulkan } from './master-a';
import { cppAndroid, cppCompilers, cppEmbedded, cppEmbeddedEco, cppLinux, cppMacos, cppMsvc, cppOpenmpMpi, cppParallel, cppVirtualization } from './master-b';

const cppMaster: Book = {
  id: 'cpp-master',
  title: 'C++ 최고급',
  subtitle: '만들고 싶은 것에 따라 고르는 스물한 권',
  category: 'cpp',
  chapters: [],
  books: [
    // 만드는 것
    cppGameEngine,
    cppQt,
    cppIndustrial,
    cppDatabase,
    cppVulkan,
    cppComplexApp,
    cppGameServer,
    cppServiceServer,
    // 계산
    cppOpenmpMpi,
    cppParallel,
    cppVirtualization,
    // 컴파일러와 플랫폼
    cppCompilers,
    cppEmbedded,
    cppLinux,
    cppMacos,
    cppMsvc,
    cppAndroid,
    cppEmbeddedEco,
    // 마무리 프로젝트
    cppDbms,
    cppLangImpl,
    cppRaytracer,
  ],
};

export const cpp: Book = {
  id: 'cpp',
  title: 'C++',
  subtitle: '문법, STL, 고급, 그리고 분야별 최고급',
  category: 'cpp',
  chapters: [],
  books: [cppSyntax, cppStl, cppAdvanced, cppMaster],
};
