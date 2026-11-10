/**
 * Great Library 전체 차례. IoT까지 닿는 것을 목표로 네 권으로 나눈다.
 *
 * 새 챕터를 쓰면 .mdx 파일을 만들고, 아래 해당 줄의 draft(...)를 written(..., Content)로 바꾼다.
 * 아직 안 쓴 챕터는 지도에 흐린 점선 노드로 보인다.
 *
 * 챕터 id는 주소와 북마크·줄치기 저장에 쓰이므로 한번 정하면 바꾸지 않는다. 한 권 안에서 겹치면 안 된다.
 */
import type { Chapter, Library } from 'neftyacademy-paragons-bookshelf';
import type { ComponentType } from 'react';
import CodeRuns from './chapters/basics/00-code-runs.mdx';
import Boot from './chapters/basics/01-boot.mdx';
import Lubuntu from './chapters/basics/02-lubuntu.mdx';
import Kernels from './chapters/basics/03-kernels.mdx';
import Apt from './chapters/basics/04-apt.mdx';
import PackageManagers from './chapters/basics/05-package-managers.mdx';
import Git from './chapters/basics/06-git.mdx';
import Commands from './chapters/basics/07-commands.mdx';
import CEcosystem from './chapters/basics/08-c-ecosystem.mdx';

/** 아직 안 쓴 챕터 */
const draft = (id: string, title: string, children?: Chapter[]): Chapter => ({ id, title, draft: true, children });
/** 다 쓴 챕터 */
const written = (id: string, title: string, Content: ComponentType, summary?: string): Chapter => ({ id, title, Content, summary });
/** 하위 챕터 중 쓴 것이 있어서, 묶음 자체는 "준비 중" 딱지 없이 보이게 할 때 */
const group = (id: string, title: string, children: Chapter[]): Chapter => ({ id, title, children, draft: children.every((c) => c.draft) });

export const library: Library = {
  title: 'Great Library',
  subtitle: '컴퓨터 입문에서 C, 그리고 IoT까지',
  storageKey: 'neftyacademy-great-library',
  categories: [
    { id: 'intro', name: '입문', color: '#4f7f78' },
    { id: 'c', name: 'C 프로그래밍', color: '#4a6fa5' },
    { id: 'ee', name: '전자공학', color: '#a0674a' },
  ],
  books: [
    // =====================================================================
    {
      id: 'basics',
      title: '컴퓨터의 입문',
      subtitle: '역사와 구조에서 우리 프로그램이 돌아가기까지',
      category: 'intro',
      chapters: [
        draft('history', '컴퓨터학개론', [
          draft('history-calculators', '계산하는 기계들'),
          draft('history-turing-von-neumann', '튜링 기계와 폰 노이만 구조'),
          draft('history-transistor', '진공관에서 트랜지스터, 집적회로로'),
          draft('history-microprocessor', '마이크로프로세서의 등장'),
          draft('history-x86', '8086에서 x86-64까지'),
        ]),
        draft('architecture', '컴퓨터 구조', [
          draft('arch-cpu', 'CPU와 레지스터'),
          draft('arch-memory', '메모리와 저장 장치의 계층'),
          draft('arch-bus-io', '버스와 입출력'),
          draft('arch-cycle', '명령어를 실행하는 주기'),
        ]),
        draft('math', '수학적 연관성', [
          draft('math-bases', '2진수와 16진수'),
          draft('math-boolean', '불 대수와 논리 게이트'),
          draft('math-integers', '정수의 표현과 2의 보수'),
          draft('math-floats', '실수의 표현'),
        ]),
        draft('standards', '생겨난 표준', [
          draft('std-text', 'ASCII와 유니코드'),
          draft('std-ieee754', 'IEEE 754'),
          draft('std-posix-c', 'POSIX와 ISO C'),
          draft('std-hardware', '하드웨어 규격들'),
        ]),
        draft('modern', '현대의 컴퓨터들', [
          draft('modern-pc-server', 'PC와 서버'),
          draft('modern-arm-mobile', '스마트폰과 ARM'),
          draft('modern-mcu-sbc', '마이크로컨트롤러와 라즈베리파이'),
        ]),
        draft('terms', '흔히 쓰지만 잘 모르는 용어의 진짜 뜻', [
          draft('terms-usb', 'USB'),
          draft('terms-c-drive', 'C 드라이브'),
          draft('terms-bits-bytes', '비트와 바이트, GB와 GiB'),
          draft('terms-ram-storage', '램과 저장 공간'),
          draft('terms-core-thread', '코어와 스레드'),
        ]),
        group('os', 'OS와 OS가 해 주는 것', [
          draft('os-role', 'OS가 맡는 일'),
          written('kernels', '커널의 종류', Kernels, '모놀리식·마이크로·하이브리드, 배포판'),
          written('boot', '설치 도구와 부팅', Boot, 'Ventoy, UEFI·BIOS, GPT·MBR, 부트로더'),
          written('lubuntu', '루분투 설치', Lubuntu, '라이브 세션, 디스크 고르기, 첫 갱신'),
          draft('os-process-memory', '프로세스와 메모리 관리'),
          draft('os-filesystem', '파일 시스템'),
          draft('os-drivers', '장치 드라이버'),
        ]),
        group('software', '소프트웨어', [
          draft('software-kinds', '소프트웨어의 갈래'),
          written('apt', 'apt와 저장소', Apt, 'apt와 apt-get, sources, main·universe, 미러 바꾸기'),
          written('package-managers', '여러 패키지 매니저', PackageManagers, 'OS별·언어별 도구, -dev 패키지'),
          written('git', 'Git 기초', Git, '세 군데, 커밋, 가지, .gitignore'),
          written('commands', '리눅스 명령어와 POSIX', Commands, '어디서나 되는 것과 리눅스만의 것, chmod +x'),
        ]),
        draft('threads', '스레드의 개념'),
        written('code-runs', '우리 프로그램이 작동하는 방식', CodeRuns, '컴파일 네 단계와 프로그램 카운터'),
      ],
    },

    // =====================================================================
    {
      id: 'c-basic',
      title: '컴퓨터 프로그래밍 초급',
      subtitle: 'C와 LLVM으로 첫 컴파일부터 창 띄우기까지',
      category: 'c',
      chapters: [
        draft('first-compile', 'C와 LLVM으로 가장 가벼운 컴파일'),
        draft('headers', '헤더를 포함한 C 파일'),
        draft('symbols', '심볼이란'),
        draft('asm', '어셈블리로 보는 아키텍처의 차이'),
        draft('debugger', '디버거로 hello, world 열어 보기'),
        draft('abi', 'ABI'),
        draft('pointers', '포인터', [
          draft('ptr-what', '주소라는 값'),
          draft('ptr-declaration', '선언문에서의 *'),
          draft('ptr-usage', '사용문에서의 * 와 &'),
          draft('ptr-arrays', '포인터와 배열'),
          draft('ptr-pointer', '포인터의 포인터'),
          draft('ptr-function', '함수 포인터'),
          draft('ptr-mistakes', '흔한 실수'),
        ]),
        draft('stdlib-first', '먼저 알아 둘 표준 라이브러리'),
        draft('dynamic-memory', '동적 메모리 써 보기', [draft('dyn-malloc', 'malloc과 free'), draft('dyn-calloc-realloc', 'calloc과 realloc')]),
        draft('heap-structure', '동적 메모리의 진짜 구조'),
        draft('types', '자료형', [draft('types-integers', '정수형'), draft('types-floats', 'float와 double'), draft('types-conversion', '형 변환')]),
        draft('arrays', '배열'),
        draft('operators', '연산자'),
        draft('control-flow', '흐름을 바꾸는 문법', [draft('flow-if', 'if와 switch'), draft('flow-loops', 'for, while, do')]),
        draft('forward-declaration', '전방 선언'),
        draft('const-typedef', 'const와 typedef', [draft('const', 'const'), draft('typedef', 'typedef')]),
        draft('compound-types', '여러 값을 묶는 타입', [draft('struct', 'struct'), draft('union', 'union')]),
        draft('macros', '매크로'),
        draft('arrays-advanced', '배열 심화'),
        draft('windows', '아주 간단한 창 띄우기', [
          draft('win-cocoa', '맥: Cocoa'),
          draft('win-linux', '리눅스: 로우레벨로'),
          draft('win-win32', '윈도우: Win32'),
          draft('win-winui', '윈도우: WinUI'),
        ]),
        draft('ub', 'UB란 무엇인가', [draft('ub-what', '정의되지 않은 동작'), draft('ub-examples', '자주 나오는 UB')]),
        draft('c-versions', 'C 버전별 기능과 문법', [
          draft('ver-c89', 'C89'),
          draft('ver-c99', 'C99'),
          draft('ver-c11', 'C11'),
          draft('ver-c17', 'C17'),
          draft('ver-c23', 'C23'),
        ]),
      ],
    },

    // =====================================================================
    {
      id: 'c-mid',
      title: '컴퓨터 프로그래밍 중급',
      subtitle: '컴파일러와 빌드, 실행 파일, 스레드, 장치와 네트워크',
      category: 'c',
      chapters: [
        draft('compilers', '세 컴파일러 상세 사용법', [draft('cc-llvm', 'LLVM (Clang)'), draft('cc-msvc', 'MSVC'), draft('cc-gcc', 'GCC')]),
        draft('build-systems', '빌드 시스템', [
          draft('build-make', 'Makefile'),
          draft('build-cmake', 'CMake와 Ninja'),
          draft('build-cross', '교차 컴파일: PC에서 라즈베리파이용으로'),
        ]),
        draft('executables', '실행 파일의 구조', [draft('exe-elf', 'ELF'), draft('exe-pe', 'PE'), draft('exe-macho', 'Mach-O')]),
        draft('libraries', '라이브러리의 종류', [draft('lib-static', '정적 라이브러리'), draft('lib-dynamic', '동적 라이브러리'), draft('lib-header-only', '헤더만 있는 라이브러리')]),
        draft('hacking', '간단한 해킹의 원리', [draft('hack-code-exec', '의도하지 않은 코드 실행'), draft('hack-launch', '다른 프로그램을 띄우기')]),
        draft('security', '보안', [draft('sec-updates', '업데이트를 통한 보안'), draft('sec-memory', '메모리를 숨기고 보호하기')]),
        draft('publishing', '프로그램을 공개하는 방법'),
        draft('libc-tour', 'C 표준 라이브러리 전체 훑기'),
        group('platforms', '플랫폼이 주는 기능과 헤더', [
          written('c-ecosystem', 'C 생태계의 네 층', CEcosystem, '표준 C, POSIX, 리눅스, 데스크톱'),
          draft('plat-mac', '맥'),
          draft('plat-windows', '윈도우'),
          draft('plat-linux', '리눅스'),
        ]),
        draft('threading', '스레드 프로그래밍', [
          draft('thr-create', '스레드 만들고 기다리기'),
          draft('thr-mutex', '뮤텍스와 경쟁 상태'),
          draft('thr-condvar', '조건 변수와 작업 줄 세우기'),
          draft('thr-atomics', '원자적 연산'),
        ]),
        draft('common-libraries', '자주 쓰이는 C 생태계 라이브러리'),
        draft('gpio', 'GPIO로 신호 주고받기'),
        draft('serial-buses', '센서와 말하는 세 가지 버스', [draft('bus-uart', 'UART'), draft('bus-i2c', 'I2C'), draft('bus-spi', 'SPI')]),
        draft('usb', 'USB로 신호 주고받기'),
        draft('pcie', 'PCIe 장치와 간단한 드라이버'),
        draft('ethernet', '이더넷', [draft('net-ethernet', '이더넷 프로토콜'), draft('net-tcp', 'TCP'), draft('net-udp', 'UDP')]),
        draft('http', 'HTTP'),
        draft('iot-messaging', 'IoT 장치의 통신', [
          draft('iot-mqtt', 'MQTT'),
          draft('iot-json', 'JSON 다루기'),
          draft('iot-tls', 'TLS로 암호화하기'),
          draft('iot-wifi', 'Wi-Fi'),
          draft('iot-ble', '블루투스 LE'),
        ]),
        draft('cross-platform', '크로스플랫폼 앱 생태계'),
      ],
    },

    // =====================================================================
    {
      id: 'ee-intro',
      title: '전자공학 입문',
      subtitle: '실험 장비, 옴의 법칙, 직류 회로',
      category: 'ee',
      chapters: [
        draft('equipment', '실험 장비 쓰기와 관리', [
          draft('eq-breadboard', '빵판'),
          draft('eq-function-generator', '함수 발생기'),
          draft('eq-oscilloscope', '오실로스코프'),
          draft('eq-care', '장비 관리'),
        ]),
        draft('ohm', '옴의 법칙'),
        draft('simulation', '회로 시뮬레이션 프로그램'),
        draft('lumped', '집중 소자 (lumped elements)'),
        draft('dc-problems', '직류 회로 문제', Array.from({ length: 9 }, (_, i) => draft(`dc-problem-${i + 1}`, `문제 ${i + 1}`))),
        draft('why-ohm', '왜 맥스웰 방정식보다 옴의 법칙과 회로도가 편한가'),
        draft('fields', '전기와 자기장'),
      ],
    },
  ],
  footer: 'Nefty Academy · Great Library · AGPL-3.0-or-later',
};
