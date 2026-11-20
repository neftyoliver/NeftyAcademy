/**
 * 소형 기기 서가 (5) 화면과 입력: 화면에 그리고 사람의 입력을 받는 라이브러리들.
 * DRM/KMS, OpenGL ES와 EGL, SDL, LVGL, GTK 4, evdev.
 */
import { book } from '../outline';

export const drmKms = book('drm-kms', 'DRM/KMS', '데스크톱 없이 화면에 직접 그리기', 'sbc', `
history           화면에 그리는 길
  hs-fbdev          프레임버퍼 장치와 그 끝
  hs-drm            DRM과 KMS
  hs-who            누가 화면을 쥐는가: 콘솔, 컴포지터, 내 프로그램
objects           KMS의 물건들
  ob-connector      커넥터
  ob-encoder        인코더
  ob-crtc           CRTC
  ob-plane          플레인
  ob-fb             프레임버퍼
  ob-props          프로퍼티
tools             도구
  tl-modetest       modetest
  tl-drm-info       drm_info
  tl-sysfs          sysfs에서 보기
setup             준비
  st-libdrm         libdrm 설치와 링크
  st-open           카드 열기와 마스터
  st-seat           권한과 좌석
modeset           첫 화면
  ms-resources      자원 훑기
  ms-pick           커넥터와 모드 고르기
  ms-dumb           덤 버퍼 만들기
  ms-map            매핑해서 그리기
  ms-setcrtc        화면에 올리기
  ms-restore        원래대로 돌려놓기
flip              페이지 플립
  fl-double         이중 버퍼
  fl-vblank         수직 동기
  fl-event          플립 이벤트
  fl-tearing        찢어짐
atomic            아토믹 API
  at-why            한꺼번에 바꾸기
  at-request        요청 만들기
  at-test           TEST_ONLY
  at-commit         커밋
  at-nonblock       논블로킹 커밋
planes            플레인
  pl-kinds          기본, 오버레이, 커서
  pl-scale          크기 조절과 자르기
  pl-format         포맷과 모디파이어
  pl-zpos           쌓는 순서
  pl-video          영상을 플레인에 바로
gbm               GBM
  gb-device         장치와 서피스
  gb-bo             버퍼 객체
  gb-egl            EGL과 잇기
dmabuf            dmabuf
  dm-prime          PRIME
  dm-camera         카메라 프레임을 화면에 바로
displays          화면 장치들
  ds-hdmi           HDMI와 EDID
  ds-dsi            DSI 패널
  ds-dpi-spi        DPI와 SPI 패널
  ds-rotate         회전
  ds-backlight      백라이트
text              글자 그리기
  tx-bitmap         비트맵 글꼴
  tx-freetype       FreeType
vt                가상 터미널
  vt-switch         터미널 전환
  vt-console        콘솔 숨기기
hotplug           꽂고 뽑기
pi                라즈베리파이에서
  pi-vc4            vc4 드라이버
  pi-config         video= 와 config.txt
  pi-pi5            라즈베리파이 5의 두 장치
`);

export const gles = book('gles', 'OpenGL ES와 EGL', 'GPU로 그리기', 'sbc', `
overview          GPU와 API들
  ov-gles           OpenGL, OpenGL ES, Vulkan
  ov-versions       ES 2.0, 3.0, 3.1
  ov-pi             라즈베리파이의 GPU와 Mesa
  ov-check          지원 확인하기
egl               EGL
  eg-display        디스플레이
  eg-config         구성 고르기
  eg-context        컨텍스트
  eg-surface        서피스
  eg-swap           버퍼 교환
platforms         어디에 그리나
  pf-gbm            DRM과 GBM 위에
  pf-wayland        Wayland 위에
  pf-x11            X11 위에
  pf-surfaceless    화면 없이
  pf-sdl            SDL이나 GLFW에 맡기기
triangle          첫 삼각형
  tr-pipeline       그리기 파이프라인
  tr-shader         셰이더 컴파일
  tr-buffer         정점 버퍼
  tr-draw           그리기 호출
  tr-debug          오류 찾기
glsl              GLSL ES
  gl-types          타입과 정밀도
  gl-vertex         정점 셰이더
  gl-fragment       프래그먼트 셰이더
  gl-uniform        유니폼
  gl-varying        보간
buffers           정점 데이터
  bf-vbo            VBO와 속성
  bf-index          인덱스
  bf-vao            VAO
  bf-update         매 프레임 바뀌는 데이터
transform         변환
  tf-matrix         행렬
  tf-mvp            모델, 뷰, 투영
  tf-viewport       뷰포트
textures          텍스처
  tx-upload         올리기
  tx-filter         필터와 밉맵
  tx-wrap           감싸기
  tx-format         포맷과 압축
  tx-atlas          아틀라스
state             상태
  st-blend          블렌딩
  st-depth          깊이
  st-cull           면 추리기
  st-scissor        가위와 스텐실
fbo               화면 밖에 그리기
  fb-create         프레임버퍼 객체
  fb-post           후처리
  fb-read           픽셀 읽어 오기
draw-2d           2D 그리기
  d2-quad           사각형과 스프라이트
  d2-batch          묶어 그리기
  d2-text           글자
  d2-ui             간단한 UI
video             영상 텍스처
  vd-eglimage       EGLImage와 dmabuf
  vd-external       external 텍스처와 YUV
  vd-camera         카메라 프레임 그리기
compute           ES 3.1의 컴퓨트 셰이더
performance       성능
  pm-tile           타일 기반 GPU
  pm-drawcalls      그리기 호출 줄이기
  pm-fill           채우기 비용
  pm-precision      정밀도
  pm-measure        재기
portability       옮겨 다니기
  pt-desktop        데스크톱 GL과의 차이
  pt-webgl          WebGL
  pt-angle          ANGLE
vulkan            Vulkan으로 넘어갈 때
`);

export const sdl = book('sdl', 'SDL', '창, 입력, 소리를 한 라이브러리로', 'sbc', `
overview          SDL이 해 주는 것
  ov-what           플랫폼 차이를 덮는 층
  ov-versions       SDL2와 SDL3
  ov-install        설치와 빌드
  ov-backends       백엔드: Wayland, X11, KMSDRM
first             첫 창
  fs-init           초기화
  fs-window         창 만들기
  fs-loop           메인 루프
  fs-callbacks      SDL3의 콜백 방식
  fs-quit           끝내기
events            이벤트
  ev-poll           이벤트 꺼내기
  ev-keyboard       키보드
  ev-mouse          마우스
  ev-touch          터치
  ev-window         창 이벤트
  ev-user           내 이벤트 넣기
render            2D 렌더러
  rn-create         렌더러
  rn-shapes         점, 선, 사각형
  rn-texture        텍스처
  rn-copy           그리기와 회전
  rn-target         텍스처에 그리기
  rn-vsync          수직 동기
  rn-geometry       삼각형 직접 그리기
surfaces          서피스와 픽셀
  sf-surface        서피스
  sf-pixels         픽셀 포맷
  sf-streaming      스트리밍 텍스처
images            그림 읽기
text              글자
  tx-ttf            SDL_ttf
  tx-cache          글자 캐시
  tx-hangul         한글
timing            시간
  tm-ticks          시간 재기
  tm-fixed          고정 시간 간격
  tm-delta          프레임 시간
audio             소리
  au-device         장치 열기
  au-stream         오디오 스트림
  au-wav            WAV 틀기
  au-mix            섞기
  au-capture        녹음
gamepad           게임패드
  gp-open           열기
  gp-mapping        매핑
  gp-rumble         진동
gpu               GPU와 잇기
  gu-gles           OpenGL ES 컨텍스트
  gu-vulkan         Vulkan 서피스
  gu-sdlgpu         SDL3 GPU API
threads           스레드와 파일
  th-thread         스레드와 뮤텍스
  th-io             파일과 경로
kiosk             데스크톱 없이 띄우기
  ks-kmsdrm         KMSDRM 백엔드
  ks-fullscreen     전체 화면과 해상도
  ks-service        부팅하면 바로 뜨게
  ks-input          입력 장치 권한
camera            SDL3의 카메라 API
projects          만들어 보기
  pj-scope          센서 값 그래프
  pj-game           작은 게임
  pj-panel          터치 패널
`);

export const lvgl = book('lvgl', 'LVGL', '작은 화면을 위한 위젯 라이브러리', 'sbc', `
overview          LVGL이라는 것
  ov-where          마이크로컨트롤러에서 리눅스까지
  ov-versions       8과 9
  ov-license        라이선스와 생태계
setup             리눅스에서 준비하기
  st-source         소스 넣기
  st-conf           lv_conf.h
  st-cmake          CMake
  st-sim            PC에서 SDL로 먼저 돌리기
display           화면 잇기
  dp-driver         디스플레이 드라이버의 구조
  dp-fbdev          프레임버퍼
  dp-drm            DRM
  dp-buffer         그리기 버퍼와 플러시
  dp-rotate         회전과 해상도
input             입력 잇기
  in-evdev          evdev 터치
  in-encoder        엔코더와 단추
  in-keyboard       키보드
  in-calibrate      터치 보정
tick              시간과 루프
  tk-tick           틱
  tk-handler        lv_timer_handler
  tk-thread         스레드와 잠금
objects           객체
  ob-tree           부모와 자식
  ob-pos            위치와 크기
  ob-flags          플래그와 상태
  ob-delete         지우기
widgets           위젯
  wg-label          라벨
  wg-button         단추
  wg-slider         슬라이더와 아크
  wg-switch         스위치와 체크박스
  wg-list           리스트와 롤러
  wg-textarea       글상자와 키보드
  wg-chart          차트
  wg-scale          눈금과 게이지
  wg-image          이미지
  wg-msgbox         메시지 상자
styles            스타일
  sy-props          속성
  sy-states         상태별 스타일
  sy-parts          부분
  sy-theme          테마
layout            레이아웃
  ly-flex           flex
  ly-grid           grid
  ly-scroll         스크롤
events            이벤트
  ev-callback       콜백
  ev-bubble         전파
  ev-custom         내 이벤트
screens           화면 전환
animation         애니메이션
  an-anim           lv_anim
  an-path           경로
  an-timeline       타임라인
fonts             글꼴
  fn-builtin        내장 글꼴
  fn-convert        글꼴 변환기
  fn-hangul         한글 넣기
  fn-freetype       FreeType
  fn-symbols        기호
images            이미지
  im-convert        변환
  im-decoder        디코더
  im-cache          캐시
data              데이터와 잇기
  dt-observer       옵서버
  dt-sensor         센서 값 띄우기
  dt-thread         다른 스레드에서 고칠 때
memory            메모리
  mm-pool           메모리 풀
  mm-monitor        사용량 보기
performance       성능
  pf-partial        부분 갱신
  pf-fps            프레임 재기
  pf-gpu            그리기 가속
tools             디자인 도구
custom            위젯 만들기
project           끝까지 만들어 보기: 온습도 패널
`);

export const gtk = book('gtk', 'GTK 4', '리눅스 데스크톱 프로그램 만들기', 'sbc', `
overview          리눅스 GUI의 지형
  ov-stack          Wayland, X11, 툴킷
  ov-toolkits       GTK, Qt, 그 밖의 것들
  ov-gnome          GLib, GObject, GTK, libadwaita
  ov-pi             라즈베리파이 데스크톱에서
setup             준비
  st-install        개발 패키지
  st-pkgconfig      pkg-config와 Meson, CMake
  st-docs           문서 읽는 법
  st-inspector      GTK Inspector
glib              GLib 기초
  gb-types          기본 타입과 문자열
  gb-memory         메모리와 g_autoptr
  gb-containers     리스트와 해시 표
  gb-error          GError
  gb-mainloop       메인 루프
gobject           GObject
  go-what           C로 하는 객체 지향
  go-refcount       참조 세기
  go-properties     프로퍼티
  go-signals        시그널
  go-subclass       클래스 만들기
  go-interfaces     인터페이스
first             첫 창
  fs-application    GtkApplication
  fs-window         창
  fs-button         단추와 시그널
  fs-run            실행과 종료
layout            배치
  ly-box            Box
  ly-grid           Grid
  ly-expand         늘어남과 정렬
  ly-paned          Paned, Stack, Notebook
  ly-scrolled       ScrolledWindow
  ly-headerbar      HeaderBar
widgets           위젯
  wg-label          Label
  wg-entry          Entry
  wg-buttons        여러 가지 단추
  wg-scale          Scale과 SpinButton
  wg-text           TextView
  wg-image          Picture와 Image
  wg-dropdown       DropDown
  wg-progress       ProgressBar와 Spinner
builder           UI 파일
  bl-xml            Builder XML
  bl-template       템플릿
  bl-blueprint      Blueprint
  bl-resources      GResource
lists             목록
  ls-model          GListModel
  ls-factory        팩토리
  ls-listview       ListView와 GridView
  ls-column         ColumnView
  ls-filter         정렬과 거르기
actions           액션과 메뉴
  ac-action         GAction
  ac-menu           메뉴
  ac-shortcut       단축키
events            입력
  ev-controllers    이벤트 컨트롤러
  ev-gestures       제스처
  ev-keyboard       키보드
  ev-touch          터치
drawing           직접 그리기
  dr-area           DrawingArea와 Cairo
  dr-snapshot       snapshot
  dr-animate        프레임 시계
  dr-plot           센서 그래프 그리기
  dr-glarea         GLArea
css               CSS
  cs-provider       스타일 입히기
  cs-classes        클래스
  cs-dark           어두운 테마
dialogs           대화 상자
  dg-alert          AlertDialog
  dg-file           FileDialog
async             기다리는 일
  as-idle           idle과 timeout
  as-gtask          GTask
  as-thread         스레드에서 화면 고치기
  as-gio            GIO 비동기 입출력
  as-fd             파일 기술자 지켜보기
settings          설정 저장
  se-gsettings      GSettings
  se-keyfile        KeyFile
adwaita           libadwaita
i18n              번역
kiosk             전체 화면 장치로 쓰기
  ks-fullscreen     전체 화면
  ks-cage           cage와 labwc
  ks-autostart      부팅하면 바로 뜨게
  ks-osk            화면 키보드
package           내보내기
  pk-desktop        desktop 파일과 아이콘
  pk-flatpak        Flatpak
  pk-deb            .deb
cpp               C++에서: gtkmm
project           끝까지 만들어 보기: 센서 모니터
`);

export const evdev = book('evdev', 'evdev', '단추, 터치, 엔코더의 입력 읽기', 'sbc', `
overview          리눅스의 입력 층
  ov-layers         커널 드라이버, evdev, libinput, 툴킷
  ov-nodes          /dev/input/event
  ov-when           evdev를 직접 읽을 때
tools             도구
  tl-evtest         evtest
  tl-libinput       libinput debug-events
  tl-proc           /proc/bus/input/devices
  tl-udev           udev 속성
event             이벤트 구조
  ev-struct         input_event
  ev-types          종류: EV_KEY, EV_REL, EV_ABS
  ev-syn            SYN_REPORT로 묶기
  ev-time           타임스탬프
read              읽기
  rd-open           열기와 권한
  rd-loop           읽기 루프
  rd-poll           여러 장치 한꺼번에
  rd-dropped        SYN_DROPPED
query             장치에 묻기
  qr-name           이름과 ID
  qr-bits           지원하는 이벤트
  qr-abs            축의 범위
  qr-state          지금 눌린 키
libevdev          libevdev
  le-new            장치 감싸기
  le-next           next_event
  le-sync           동기화
  le-query          묻는 함수들
keys              키와 단추
  ky-codes          키 코드
  ky-repeat         반복
  ky-gpio-keys      GPIO 단추를 키로: gpio-keys
  ky-matrix         키 매트릭스
  ky-ir             리모컨
relative          상대 축
  rl-mouse          마우스
  rl-rotary         로터리 엔코더 오버레이
absolute          절대 축
  ab-joystick       조이스틱
  ab-touch          터치스크린
  ab-calibrate      보정
multitouch        멀티터치
  mt-slots          슬롯 규약
  mt-tracking       추적 ID
  mt-gesture        제스처 알아내기
grab              독차지하기
uinput            가상 장치 만들기
  ui-create         uinput 장치
  ui-emit           이벤트 넣기
  ui-remap          키 바꿔 주기
force             진동과 LED
hotplug           꽂고 뽑기
  hp-udev           libudev로 지켜보기
  hp-names          장치 이름 고정하기
libinput          libinput
  li-context        컨텍스트
  li-events         이벤트
  li-config         가속과 탭
headless          화면 없는 장치의 입력
  hl-buttons        단추 몇 개짜리 UI
  hl-longpress      길게 누르기와 겹쳐 누르기
`);
