/**
 * 소형 기기 서가 (6) 연결과 데이터: 바깥과 주고받고, 기기 안에 쌓아 두는 라이브러리들.
 * BlueZ, libcurl, MQTT(libmosquitto), OpenSSL, cJSON, SQLite.
 * 소켓과 프로토콜 자체는 「네트워킹」 책에서 다룬다.
 */
import { book } from '../outline';

export const bluez = book('bluez', 'BlueZ', '블루투스 LE 장치를 찾고, 읽고, 직접 되기', 'sbc', `
ble               블루투스 LE
  bl-classic-le     클래식과 LE
  bl-roles          중앙과 주변
  bl-adv            광고
  bl-gatt           GATT: 서비스, 특성, 디스크립터
  bl-uuid           UUID
  bl-versions       버전별로 더해진 것
stack             BlueZ 스택
  sk-layers         컨트롤러, HCI, 커널, bluetoothd
  sk-dbus           D-Bus가 유일한 문
  sk-pi             라즈베리파이의 블루투스 칩
tools             도구
  tl-bluetoothctl   bluetoothctl
  tl-btmon          btmon
  tl-btmgmt         btmgmt
  tl-phone          휴대폰 앱으로 확인하기
adapter           어댑터
  ad-object         org.bluez.Adapter1
  ad-power          켜고 끄기
  ad-props          프로퍼티
discovery         찾기
  ds-start          StartDiscovery
  ds-filter         필터
  ds-objects        ObjectManager로 장치 받기
  ds-advdata        광고 데이터 읽기
  ds-rssi           신호 세기
connect           연결
  cn-connect        Connect
  cn-resolved       ServicesResolved 기다리기
  cn-params         연결 간격
  cn-reconnect      끊겼을 때
gatt-client       GATT 클라이언트
  gc-tree           객체 나무 읽기
  gc-read           읽기
  gc-write          쓰기
  gc-notify         알림 받기
  gc-fd             AcquireNotify로 빠르게
  gc-mtu            MTU
gatt-server       GATT 서버
  gs-app            애플리케이션 등록
  gs-service        서비스와 특성 내놓기
  gs-read-write     읽기와 쓰기 받기
  gs-notify         알림 보내기
  gs-design         특성 설계
advertising       광고하기
  av-register       LEAdvertisement1
  av-data           데이터 채우기
  av-beacon         비콘
  av-extended       확장 광고
security          보안
  sc-pairing        페어링과 본딩
  sc-agent          에이전트
  sc-levels         보안 수준
  sc-privacy        주소 바꾸기
profiles          표준 프로파일
  pf-battery        배터리
  pf-environment    환경 센싱
  pf-hid            HID
  pf-uart           시리얼 흉내
classic           클래식 블루투스
  cl-rfcomm         RFCOMM
  cl-audio          오디오
mesh              메시
mcu               마이크로컨트롤러 쪽
  mc-peripheral     주변 장치 펌웨어
  mc-test           둘을 맞춰 보기
range             거리와 전력
  rg-phy            PHY
  rg-power          송신 세기와 배터리
trouble           안 될 때
  tr-cache          캐시
  tr-timeout        연결 시간 초과
  tr-coexist        Wi-Fi와 겹침
wrappers          감싸는 라이브러리들
`);

export const libcurl = book('libcurl', 'libcurl', '프로그램에서 HTTP 요청 보내기', 'sbc', `
overview          curl과 libcurl
  ov-tool           명령줄 curl
  ov-library        libcurl
  ov-install        설치와 링크
  ov-code           --libcurl로 코드 얻기
easy              easy 인터페이스
  ez-init           초기화와 정리
  ez-setopt         setopt
  ez-perform        perform
  ez-getinfo        getinfo
  ez-errors         오류
receive           응답 받기
  rc-write          쓰기 콜백
  rc-buffer         메모리에 모으기
  rc-file           파일로 받기
  rc-headers        헤더 읽기
  rc-status         상태 코드
send              보내기
  sn-get            GET과 쿼리
  sn-post           POST
  sn-json           JSON 보내기
  sn-form           폼과 파일 올리기
  sn-put            PUT, PATCH, DELETE
  sn-read           읽기 콜백
headers           헤더
  hd-custom         헤더 더하기
  hd-auth           인증
  hd-cookies        쿠키
tls               TLS
  tl-verify         인증서 확인
  tl-ca             CA 묶음
  tl-client-cert    클라이언트 인증서
  tl-pin            공개 키 고정
  tl-backends       TLS 백엔드
robust            튼튼하게
  rb-timeout        시간제한
  rb-retry          재시도와 백오프
  rb-redirect       리다이렉트
  rb-resume         이어 받기
  rb-limit          속도 제한
  rb-progress       진행 상황
reuse             연결 다시 쓰기
  ru-handle         핸들 재사용
  ru-share          share 인터페이스
  ru-keepalive      keep-alive
url               URL API
multi             multi 인터페이스
  ml-idea           여러 전송 한꺼번에
  ml-poll           curl_multi_poll
  ml-socket         multi_socket과 이벤트 루프
  ml-epoll          epoll에 물리기
versions          HTTP 버전
  vr-http2          HTTP/2
  vr-http3          HTTP/3
proxy             프록시
other             HTTP가 아닌 것들
  ot-mqtt           MQTT
  ot-ws             WebSocket
  ot-ftp            FTP와 SFTP
  ot-smtp           메일 보내기
debug             디버깅
  db-verbose        VERBOSE
  db-debugfn        디버그 콜백
  db-trace          오가는 내용 보기
threads           스레드
device            작은 기기에서
  dv-size           빌드 줄이기
  dv-offline        네트워크가 없을 때
  dv-queue          보낼 것 쌓아 두기
project           끝까지 만들어 보기: 센서 값 올리기
`);

export const mosquitto = book('mosquitto', 'MQTT', 'libmosquitto로 발행하고 구독하기', 'sbc', `
mqtt              MQTT
  mq-pubsub         발행과 구독
  mq-broker         브로커
  mq-topics         토픽과 와일드카드
  mq-qos            QoS 0, 1, 2
  mq-retain         보관 메시지
  mq-will           유언
  mq-session        세션과 keep-alive
  mq-versions       3.1.1과 5
broker            Mosquitto 브로커
  br-install        설치와 실행
  br-conf           설정 파일
  br-listeners      리스너
  br-auth           사용자와 암호
  br-acl            ACL
  br-persist        지속성
  br-log            로그
tools             도구
  tl-pub-sub        mosquitto_pub와 mosquitto_sub
  tl-rr             mosquitto_rr
  tl-explorer       MQTT Explorer
client            클라이언트 기초
  cl-init           라이브러리 초기화
  cl-new            클라이언트 만들기
  cl-connect        연결
  cl-callbacks      콜백들
  cl-errors         오류 값
publish           발행
  pb-publish        mosquitto_publish
  pb-mid            메시지 ID와 완료 콜백
  pb-qos            QoS 고르기
  pb-retain         보관
subscribe         구독
  sb-subscribe      구독하기
  sb-message        메시지 콜백
  sb-match          토픽 맞춰 보기
  sb-multiple       여럿 구독
loop              루프
  lp-forever        loop_forever
  lp-start          loop_start
  lp-manual         loop를 직접 돌리기
  lp-poll           내 이벤트 루프에 끼우기
  lp-threads        스레드 안전성
reconnect         끊김 다루기
  rc-auto           자동 재연결
  rc-backoff        백오프
  rc-resubscribe    다시 구독
  rc-offline        끊긴 동안 쌓아 두기
  rc-clean          clean session
tls               TLS와 인증
  ts-server         서버 인증서 확인
  ts-client         클라이언트 인증서
  ts-psk            PSK
  ts-ws             WebSocket 위에서
design            토픽 설계
  ds-naming         이름 규칙
  ds-state          상태와 이벤트 나누기
  ds-command        명령과 응답
  ds-status         온라인 표시
payload           페이로드
  pl-json           JSON
  pl-binary         CBOR과 Protobuf
  pl-schema         버전과 스키마
  pl-time           시각 넣기
v5                MQTT 5
  v5-props          프로퍼티
  v5-reason         이유 코드
  v5-request        요청과 응답
  v5-shared         공유 구독
  v5-expiry         만료
  v5-alias          토픽 별칭
bridge            브리지와 클라우드
  bg-bridge         브로커끼리 잇기
  bg-cloud          클라우드 IoT 서비스
  bg-sparkplug      Sparkplug
  bg-ha             Home Assistant 자동 발견
scale             규모
  sc-limits         브로커의 한계
  sc-others         다른 브로커들
other-clients     다른 클라이언트 라이브러리
  oc-paho           Paho
  oc-mcu            마이크로컨트롤러 쪽
  oc-sn             MQTT-SN
security          보안 점검표
project           끝까지 만들어 보기: 온습도 노드
`);

export const openssl = book('openssl', 'OpenSSL', 'TLS와 암호 도구', 'sbc', `
basics            암호의 기초
  bs-goals          기밀성, 무결성, 인증
  bs-symmetric      대칭 키 암호
  bs-asymmetric     공개 키 암호
  bs-hash           해시
  bs-dont           직접 만들지 않는다
tls               TLS
  tl-handshake      핸드셰이크
  tl-versions       1.2와 1.3
  tl-suites         암호 스위트
  tl-record         레코드 층
pki               인증서
  pk-x509           X.509
  pk-chain          인증서 사슬
  pk-ca             CA와 신뢰 저장소
  pk-san            이름 확인
  pk-revoke         폐기
  pk-formats        PEM과 DER
cli               openssl 명령
  cl-keys           키 만들기
  cl-csr            CSR
  cl-selfsign       자체 서명
  cl-myca           나만의 CA
  cl-inspect        인증서 들여다보기
  cl-sclient        s_client
setup             라이브러리 준비
  st-versions       1.1과 3.x
  st-link           헤더와 링크
  st-errors         오류 큐
  st-memory         소유권 규칙
client            TLS 클라이언트
  ct-ctx            SSL_CTX
  ct-connect        연결
  ct-verify         확인 켜기
  ct-hostname       호스트 이름과 SNI
  ct-io             읽고 쓰기
  ct-shutdown       닫기
server            TLS 서버
  sv-ctx            인증서와 키 싣기
  sv-accept         받아들이기
  sv-options        버전과 스위트 고르기
  sv-sni            SNI
nonblocking       논블로킹
  nb-want           WANT_READ와 WANT_WRITE
  nb-loop           이벤트 루프와 잇기
  nb-bio            BIO
mtls              상호 TLS
  mt-client-cert    클라이언트 인증서 요구
  mt-device         장치마다 인증서
  mt-provision      발급 절차
session           세션 재개
evp               EVP
  ev-digest         해시
  ev-hmac           HMAC
  ev-cipher         AES-GCM
  ev-sign           서명과 검증
  ev-kdf            키 유도
  ev-random         난수
keys              키 다루기
  ky-load           읽고 쓰기
  ky-protect        키 파일 지키기
  ky-provider       프로바이더와 하드웨어 키
  ky-tpm            TPM과 보안 칩
dtls              DTLS
quic              QUIC
pitfalls          흔한 실수
  pf-noverify       확인 끄기
  pf-time           시계가 틀린 장치
  pf-entropy        부팅 직후의 난수
  pf-old            낡은 버전과 스위트
alternatives      다른 라이브러리
  al-mbedtls        Mbed TLS
  al-wolfssl        wolfSSL
  al-others         BoringSSL, LibreSSL, GnuTLS
pqc               양자 내성 암호
maintain          유지
  mn-update         보안 갱신 따라가기
  mn-renew          인증서 갱신
`);

export const cjson = book('cjson', 'cJSON', 'C에서 JSON 읽고 쓰기', 'sbc', `
json              JSON
  js-syntax         문법
  js-types          타입
  js-pitfalls       숫자, 유니코드, 중복 키
  js-spec           표준 문서
setup             준비
  st-add            소스 두 파일 넣기
  st-package        패키지로 설치
  st-cmake          CMake
parse             읽기
  ps-parse          cJSON_Parse
  ps-tree           나무 구조
  ps-error          오류 위치
  ps-length         길이를 아는 버퍼
  ps-delete         지우기
access            값 꺼내기
  ac-object         객체에서 찾기
  ac-check          타입 확인
  ac-number         숫자
  ac-string         문자열
  ac-array          배열 돌기
  ac-nested         깊은 값
  ac-default        없을 때의 값
build             만들기
  bd-create         Create 함수들
  bd-add            더하기
  bd-helpers        AddXToObject
  bd-array          배열
  bd-reference      참조로 넣기
print             내보내기
  pr-print          Print와 PrintUnformatted
  pr-buffer         미리 잡은 버퍼에
  pr-free           결과 해제
modify            고치기
  md-replace        바꾸기
  md-detach         떼어 내기
  md-duplicate      복제
ownership         소유권
  ow-rules          누가 지우나
  ow-leaks          흔한 누수
  ow-hooks          할당자 바꾸기
numbers           숫자의 함정
  nm-double         모두 double
  nm-int64          큰 정수
  nm-precision      자릿수
strings           문자열
  sg-escape         이스케이프
  sg-utf8           UTF-8
validate          검증
  vl-required       필수 항목
  vl-range          범위
  vl-untrusted      믿을 수 없는 입력
mapping           구조체와 오가기
  mp-to-struct      구조체로
  mp-from-struct    구조체에서
  mp-table          표로 줄이기
utils             cJSON_Utils
  ut-pointer        JSON Pointer
  ut-patch          JSON Patch
  ut-merge          Merge Patch
config            설정 파일로 쓰기
limits            한계
  lm-memory         메모리
  lm-depth          깊이
  lm-speed          속도
alternatives      다른 라이브러리
  al-jansson        Jansson
  al-jsmn           jsmn
  al-yyjson         yyjson
  al-cpp            C++에서
binary            이진 형식
  bn-cbor           CBOR
  bn-msgpack        MessagePack
  bn-protobuf       Protobuf
  bn-choose         고르는 기준
`);

export const sqlite = book('sqlite', 'SQLite', '기기 안에 두는 데이터베이스', 'sbc', `
why               왜 SQLite인가
  wy-file           서버 없는 파일 하나
  wy-fit            맞는 일과 안 맞는 일
  wy-vs-files       그냥 파일에 적는 것과 견주기
cli               sqlite3 명령
  cl-shell          셸
  cl-dot            점 명령
  cl-import         CSV 들이고 내기
sql               SQL
  sq-create         표 만들기
  sq-insert         넣기
  sq-select         고르기
  sq-update         고치고 지우기
  sq-join           잇기
  sq-aggregate      모으기
  sq-types          타입 친화성
setup             C 준비
  st-amalgamation   소스 한 파일
  st-package        패키지
  st-options        컴파일 옵션
connect           열기
  cn-open           sqlite3_open_v2
  cn-close          닫기
  cn-errors         오류 코드와 메시지
  cn-exec           sqlite3_exec
statements        준비된 문장
  sm-prepare        prepare
  sm-bind           bind
  sm-step           step
  sm-column         column
  sm-reset          reset과 finalize
  sm-injection      SQL 주입
transactions      트랜잭션
  tx-begin          BEGIN과 COMMIT
  tx-speed          묶으면 빨라지는 이유
  tx-rollback       되돌리기
  tx-savepoint      SAVEPOINT
schema            스키마
  sc-keys           기본 키와 rowid
  sc-index          인덱스
  sc-constraints    제약
  sc-foreign        외래 키
  sc-migrate        스키마 바꾸기
  sc-strict         STRICT 표
query-plan        질의 계획
  qp-explain        EXPLAIN QUERY PLAN
  qp-analyze        ANALYZE
durability        꺼져도 안 깨지게
  du-journal        롤백 저널
  du-wal            WAL
  du-sync           synchronous
  du-power          정전 시험
  du-corrupt        깨지는 경우들
flash             플래시 메모리 아끼기
  fl-writes         쓰기 횟수 세기
  fl-batch          모아서 쓰기
  fl-tmp            임시 파일
concurrency       동시 접근
  cc-locks          잠금
  cc-busy           SQLITE_BUSY
  cc-threads        스레드 모드
  cc-processes      프로세스 여럿
timeseries        시계열 기록
  ts-schema         표 설계
  ts-time           시각 저장
  ts-rollup         줄여서 보관
  ts-retention      오래된 것 지우기
  ts-size           용량 가늠
blob              큰 값
json              JSON 함수
fts               전문 검색
functions         함수 더하기
  fn-scalar         스칼라 함수
  fn-extension      확장 싣기
backup            백업
  bk-api            백업 API
  bk-vacuum         VACUUM INTO
  bk-integrity      무결성 검사
sync              밖으로 보내기
  sy-outbox         보낼 것 표
  sy-replicate      복제 도구
tuning            튜닝
  tn-pragma         PRAGMA
  tn-cache          캐시와 mmap
  tn-measure        재기
wrappers          감싸는 층
  wr-cpp            C++에서
  wr-python         파이썬에서
project           끝까지 만들어 보기: 센서 기록기
`);
