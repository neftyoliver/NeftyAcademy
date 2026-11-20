/**
 * 네트워킹: OSI 일곱 계층을 아래에서 위로 올라가고, 소켓 API를 익힌 다음, C로 HTTP 서버를 직접 만든다.
 * 계층마다 "명령으로 들여다보기"와 "패킷 캡처로 확인하기"를 함께 둔다.
 */
import { book } from './outline';

export const networking = book('networking', '네트워킹', '일곱 계층을 올라가 HTTP 서버를 직접 만들기까지', 'net', `
layers            계층이라는 생각
  ly-why            왜 층을 나누나
  ly-osi-tcpip      OSI 7계층과 TCP/IP 4계층
  ly-encapsulation  캡슐화: 요청 하나가 지나는 길
  ly-standards      표준 문서: RFC와 IEEE 802
  ly-units          비트, 프레임, 패킷, 세그먼트
tools             도구 상자
  tl-ip             ip 명령
  tl-ping           ping과 traceroute
  tl-ss             ss
  tl-nc             nc와 socat
  tl-curl           curl
  tl-tcpdump        tcpdump
  tl-wireshark      Wireshark
  tl-netns          네트워크 네임스페이스로 실험실 만들기
l1                1계층: 물리
  l1-signal         비트를 신호로
  l1-copper         구리선과 이더넷 케이블
  l1-fiber          빛
  l1-radio          전파: 주파수와 채널
  l1-measure        대역폭, 지연, 손실
  l1-phy            PHY 칩과 링크 협상
l2                2계층: 데이터 링크
  l2-frame          이더넷 프레임
  l2-mac            MAC 주소
  l2-switch         스위치와 MAC 표
  l2-broadcast      브로드캐스트와 충돌 영역
  l2-arp            ARP
  l2-vlan           VLAN
  l2-wifi           Wi-Fi의 링크 계층
  l2-crc            오류 검출
  l2-raw            원시 소켓으로 프레임 보내 보기
l3                3계층: 네트워크
  l3-ipv4           IPv4 주소와 헤더
  l3-subnet         서브넷과 CIDR
  l3-routing        라우팅 표
  l3-router         라우터가 하는 일
  l3-icmp           ICMP
  l3-fragment       MTU와 단편화
  l3-nat            NAT와 사설 주소
  l3-ipv6           IPv6
  l3-dhcp           주소는 어떻게 받나: DHCP와 SLAAC
  l3-protocols      라우팅 프로토콜 맛보기
l4                4계층: 전송
  l4-ports          포트와 다중화
  l4-udp            UDP
  l4-tcp-header     TCP 헤더
  l4-handshake      연결 맺기와 끊기
  l4-reliability    순서 번호, 확인, 재전송
  l4-flow           흐름 제어
  l4-congestion     혼잡 제어
  l4-states         TCP 상태 기계
  l4-quic           QUIC
sockets           소켓 API
  sk-what           소켓은 계층과 프로그램이 만나는 곳
  sk-address        주소 구조체와 바이트 순서
  sk-getaddrinfo    getaddrinfo
  sk-client         TCP 클라이언트
  sk-server         TCP 서버: bind, listen, accept
  sk-udp            UDP 소켓
  sk-partial        덜 보내지고 덜 읽힌다
  sk-boundary       메시지 경계는 내가 만든다
  sk-close          close와 shutdown
  sk-options        소켓 옵션
  sk-errors         오류와 시그널: EPIPE, EINTR
  sk-ipv6           IPv4와 IPv6를 함께 받기
  sk-unix           유닉스 도메인 소켓
  sk-winsock        윈도우의 Winsock
io-models         입출력 모형
  im-blocking       블로킹
  im-nonblocking    논블로킹
  im-poll           select와 poll
  im-epoll          epoll
  im-uring          io_uring
  im-timeouts       시간제한
l5                5계층: 세션
  l5-where          세션 계층은 실제로 어디에 있나
  l5-tls-handshake  TLS 핸드셰이크
  l5-resume         세션 재개
  l5-app-session    로그인 세션과 쿠키
  l5-rpc            RPC
l6                6계층: 표현
  l6-endian         바이트 순서
  l6-text           문자 인코딩
  l6-serialize      직렬화: JSON, Protobuf, CBOR
  l6-compress       압축
  l6-encrypt        암호화: TLS 레코드
  l6-mime           MIME 타입
l7                7계층: 응용
  l7-dns            DNS
  l7-http-shape     HTTP의 모양: 요청과 응답
  l7-methods        메서드와 상태 코드
  l7-headers        헤더
  l7-body           본문과 길이
  l7-connection     연결 관리: keep-alive
  l7-cache          캐시
  l7-cookies        쿠키와 인증
  l7-http2          HTTP/2
  l7-http3          HTTP/3
  l7-websocket      WebSocket
  l7-others         SSH, SMTP, NTP, MQTT 한눈에
server-first      HTTP 서버 만들기 (1) 한 번에 한 손님
  s1-plan           무엇을 만들 것인가
  s1-listen         듣는 소켓
  s1-read           요청 읽기와 버퍼
  s1-request-line   요청 줄 파싱
  s1-headers        헤더 파싱
  s1-response       응답 쓰기
  s1-hello          첫 응답 확인하기
server-files      HTTP 서버 만들기 (2) 파일 내주기
  s2-path           경로를 파일로 옮기기
  s2-traversal      경로 탈출 막기
  s2-mime           MIME 타입 정하기
  s2-sendfile       sendfile
  s2-errors         404와 그 밖의 오류 응답
  s2-head           HEAD와 조건부 요청
  s2-range          Range 요청
server-protocol   HTTP 서버 만들기 (3) 프로토콜 지키기
  s3-keepalive      keep-alive
  s3-pipelining     파이프라이닝
  s3-body           본문 받기: Content-Length
  s3-chunked        chunked 인코딩
  s3-limits         크기와 시간의 한도
  s3-parser         상태 기계 파서로 다시 쓰기
server-many       HTTP 서버 만들기 (4) 여러 손님
  s4-fork           손님마다 프로세스
  s4-threads        스레드 풀
  s4-epoll          이벤트 루프
  s4-state          연결마다 상태 들기
  s4-backpressure   쓰기가 밀릴 때
  s4-c10k           C10K와 구조 고르기
server-app        HTTP 서버 만들기 (5) 쓸모 붙이기
  s5-router         라우팅
  s5-json           JSON API
  s5-static         정적 파일과 API 함께
  s5-websocket      WebSocket으로 올리기
  s5-sensor         센서 값을 내주는 서버
server-ops        HTTP 서버 만들기 (6) 내보내기
  s6-tls            HTTPS
  s6-log            접근 기록
  s6-config         설정
  s6-systemd        서비스로 띄우기
  s6-proxy          리버스 프록시 뒤에 두기
  s6-bench          부하 시험
  s6-fuzz           파서 퍼징
  s6-read           nginx와 다른 서버의 코드 읽기
security          네트워크 보안
  se-firewall       방화벽: nftables
  se-sniff          엿듣기와 속이기
  se-dos            서비스 거부
  se-http           HTTP 서버의 취약점
  se-tls            TLS 설정 점검
  se-vpn            VPN: WireGuard
wireless          무선과 사물의 네트워크
  wl-wifi           Wi-Fi 연결 과정
  wl-ble            블루투스 LE
  wl-thread         Thread와 Zigbee
  wl-lora           LoRa
  wl-cellular       셀룰러
troubleshooting   문제 찾기
  ts-method         아래층부터 올라가며 확인하기
  ts-link           연결이 안 될 때
  ts-dns            이름이 안 풀릴 때
  ts-slow           느릴 때
  ts-capture        캡처 읽는 요령
`);
