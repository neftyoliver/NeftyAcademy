/**
 * 소형 기기 서가 (4) 카메라, 영상, 소리: 프레임과 샘플을 받고, 처리하고, 내보내는 라이브러리들.
 * V4L2, libcamera, OpenCV, GStreamer, ALSA, LiteRT.
 */
import { book } from '../outline';

export const v4l2 = book('v4l2', 'V4L2', '커널의 영상 인터페이스로 프레임 받기', 'sbc', `
overview          리눅스의 영상 장치
  ov-nodes          /dev/video와 그 친구들
  ov-kinds          캡처, 출력, M2M
  ov-stack          V4L2, libcamera, GStreamer의 자리
tools             v4l-utils
  tl-ctl            v4l2-ctl
  tl-formats        지원 포맷 훑기
  tl-compliance     v4l2-compliance
  tl-media-ctl      media-ctl
query             장치에 묻기
  qr-cap            VIDIOC_QUERYCAP
  qr-enum           포맷, 크기, 프레임 속도 열거
  qr-input          입력 고르기
format            포맷 정하기
  fm-set            VIDIOC_S_FMT와 협상
  fm-fourcc         FourCC
  fm-planes         평면 하나와 여러 개
  fm-fps            프레임 속도
pixels            픽셀 포맷
  px-yuv            YUV라는 것
  px-yuyv           YUYV
  px-nv12           NV12와 YUV420
  px-bayer          베이어 원본
  px-mjpeg          MJPEG
  px-convert        RGB로 바꾸기
  px-colorspace     색 공간과 범위
buffers           버퍼
  bf-methods        read, mmap, userptr, dmabuf
  bf-reqbufs        버퍼 요청과 매핑
  bf-queue          큐에 넣고 빼기
  bf-meta           타임스탬프와 순번
stream            스트리밍
  st-on-off         STREAMON과 STREAMOFF
  st-loop           캡처 루프
  st-poll           poll로 기다리기
  st-drop           프레임을 놓칠 때
  st-save           한 장 저장하기
controls          컨트롤
  ct-enum           컨트롤 열거
  ct-basic          밝기, 노출, 초점
  ct-ext            확장 컨트롤
  ct-events         이벤트
dmabuf            복사 없이 넘기기
  dm-export         버퍼 내보내기
  dm-import         다른 장치에 넘기기
m2m               하드웨어 코덱
  mm-idea           M2M 장치의 두 큐
  mm-encode         H.264 인코딩
  mm-decode         디코딩
  mm-stateless      상태 없는 코덱
  mm-pi             라즈베리파이 4와 5의 차이
media-controller  미디어 컨트롤러
  mc-graph          엔티티, 패드, 링크
  mc-subdev         서브디바이스
  mc-pipeline       센서에서 ISP까지 잇기
uvc               USB 웹캠
  uv-formats        웹캠이 주는 포맷
  uv-bandwidth      USB 대역폭 문제
  uv-quirks         웹캠마다 다른 점
loopback          v4l2loopback
performance       성능
  pf-copy           복사 세기
  pf-latency        지연 재기
wrap              libv4l과 감싸는 층들
`);

export const libcamera = book('libcamera', 'libcamera', '라즈베리파이 카메라를 C++로 다루기', 'sbc', `
stack             카메라 스택
  sk-pipeline       센서, ISP, 파이프라인 핸들러
  sk-ipa            IPA: 노출, 화이트 밸런스, 초점 알고리즘
  sk-history        옛 스택(raspicam, MMAL)에서 바뀐 것
  sk-modules        카메라 모듈들
hardware          연결
  hw-csi            CSI-2 케이블과 단자
  hw-detect         인식 확인
  hw-overlay        오버레이로 센서 지정
apps              rpicam-apps
  ap-hello          rpicam-hello
  ap-still          rpicam-still
  ap-vid            rpicam-vid
  ap-raw            rpicam-raw
  ap-options        자주 쓰는 옵션
  ap-post           후처리 단계
build             개발 준비
  bd-packages       헤더와 pkg-config
  bd-cmake          CMake로 잇기
  bd-source         소스에서 빌드하기
first             첫 프로그램
  fs-manager        CameraManager
  fs-acquire        카메라 얻기
  fs-ids            카메라 고르기
configure         구성
  cf-roles          스트림 역할
  cf-stream         크기와 픽셀 포맷
  cf-validate       validate가 고쳐 주는 것
  cf-multi          스트림 둘 이상
  cf-sensor-mode    센서 모드
buffers           버퍼
  bf-allocator      FrameBufferAllocator
  bf-mmap           dmabuf를 매핑해 읽기
  bf-planes         평면과 stride
requests          요청
  rq-create         Request 만들기
  rq-signal         requestCompleted 시그널
  rq-reuse          다시 넣기
  rq-thread         콜백이 불리는 스레드
  rq-loop           이벤트 루프와 잇기
controls          컨트롤
  ct-list           지원 컨트롤 보기
  ct-exposure       노출과 게인
  ct-awb            화이트 밸런스
  ct-focus          자동 초점
  ct-fps            프레임 길이
  ct-metadata       메타데이터 읽기
output            프레임 쓰기
  ot-save           파일로 저장
  ot-jpeg           JPEG으로 누르기
  ot-preview        화면에 띄우기
  ot-encode         하드웨어 인코더로 넘기기
  ot-opencv         OpenCV로 넘기기
raw               원본 다루기
  rw-bayer          베이어 원본 받기
  rw-dng            DNG
tuning            튜닝
  tn-file           튜닝 파일
  tn-noir           NoIR와 렌즈 바꾸기
timing            시간
  tm-timestamp      프레임 타임스탬프
  tm-sync           카메라 둘 동기화
  tm-trigger        외부 트리거
ai-camera         AI 카메라와 추론 연결
others            다른 길
  oh-picamera2      Picamera2
  oh-gstreamer      libcamerasrc
  oh-v4l2           V4L2 호환 층
trouble           안 될 때
`);

export const opencv = book('opencv', 'OpenCV', '영상을 행렬로 보고 처리하기', 'sbc', `
setup             준비
  st-install        패키지와 소스 빌드
  st-cmake          CMake로 잇기
  st-modules        모듈 지도
  st-headless       화면 없이 쓰기
mat               Mat
  mt-layout         행, 열, 채널, 타입
  mt-refcount       복사와 참조
  mt-access         픽셀 접근
  mt-roi            관심 영역
  mt-types          타입 변환과 포화
io                입출력
  io-image          이미지 읽고 쓰기
  io-video          VideoCapture
  io-pi-camera      라즈베리파이 카메라 잇기
  io-writer         VideoWriter
  io-show           창 띄우기와 그 대안
color             색
  cl-bgr            BGR이라는 순서
  cl-convert        색 공간 바꾸기
  cl-hsv            HSV로 색 고르기
  cl-hist           히스토그램
filter            필터
  ft-blur           블러
  ft-kernel         커널과 합성곱
  ft-edge           에지 검출
  ft-morph          모폴로지
  ft-threshold      임계값
geometry          기하 변환
  ge-resize         크기와 보간
  ge-affine         아핀 변환
  ge-perspective    원근 변환
  ge-remap          remap
shapes            모양 찾기
  sh-contours       윤곽선
  sh-moments        모멘트와 중심
  sh-hough          허프 변환
  sh-blob           블롭
features          특징점
  fe-orb            ORB
  fe-match          매칭
  fe-homography     호모그래피
calibration       카메라 보정
  cb-model          핀홀 모델과 왜곡
  cb-chessboard     체스판으로 보정하기
  cb-undistort      왜곡 펴기
  cb-pose           자세 추정
  cb-aruco          ArUco 마커
motion            움직임
  mo-diff           프레임 차이
  mo-bg             배경 빼기
  mo-flow           광학 흐름
  mo-track          추적기
dnn               DNN 모듈
  dn-load           모델 싣기
  dn-blob           입력 만들기
  dn-detect         물체 검출
  dn-backends       백엔드와 가속
draw              그리기와 글자
performance       성능
  pf-size           해상도부터 줄이기
  pf-neon           NEON과 병렬 틀
  pf-umat           UMat과 OpenCL
  pf-copy           복사 줄이기
  pf-measure        재기
pipeline          파이프라인 짜기
  pp-threads        캡처와 처리 나누기
  pp-latest         가장 새 프레임만 쓰기
c-api             C에서 쓰고 싶을 때
`);

export const gstreamer = book('gstreamer', 'GStreamer', '요소를 이어 영상과 소리를 흘려보내기', 'sbc', `
idea              파이프라인이라는 생각
  id-elements       요소, 패드, 캡스
  id-flow           버퍼와 이벤트
  id-states         상태
  id-clock          시계와 동기화
launch            gst-launch
  ln-syntax         파이프라인 문법
  ln-inspect        gst-inspect
  ln-test           시험용 소스와 싱크
  ln-caps           캡스 필터
  ln-debug          디버그 출력
recipes           자주 쓰는 파이프라인
  rc-camera         카메라 미리보기
  rc-record         녹화
  rc-play           재생
  rc-snapshot       한 장 뽑기
  rc-audio          소리 녹음과 재생
app               프로그램에서 쓰기
  ap-init           초기화
  ap-parse          gst_parse_launch
  ap-manual         요소를 손으로 잇기
  ap-bus            버스 메시지
  ap-mainloop       GLib 메인 루프
  ap-state          상태 바꾸기
  ap-memory         참조 세기
dynamic           움직이는 파이프라인
  dy-pads           패드가 나중에 생길 때
  dy-decodebin      decodebin과 playbin
  dy-tee            tee와 queue
  dy-change         도는 중에 바꾸기
appsrc-sink       내 코드와 잇기
  as-appsink        appsink로 프레임 꺼내기
  as-appsrc         appsrc로 밀어 넣기
  as-map            버퍼 매핑
  as-timestamps     타임스탬프
pi                라즈베리파이에서
  pi-libcamerasrc   libcamerasrc
  pi-encoder        하드웨어 인코더
  pi-decoder        하드웨어 디코더
  pi-display        kmssink와 waylandsink
  pi-dmabuf         복사 없이 넘기기
network           네트워크로 보내기
  nw-rtp            RTP와 UDP
  nw-rtsp           RTSP 서버
  nw-hls            HLS
  nw-webrtc         WebRTC
  nw-srt            SRT
  nw-latency        지연 줄이기
codecs            코덱과 컨테이너
  cd-h264           H.264와 H.265
  cd-params         비트레이트와 키프레임
  cd-mux            컨테이너
audio             소리
  au-alsa           alsasrc와 alsasink
  au-convert        변환과 리샘플
  au-mix            섞기
plugin            요소 만들기
  pg-basetransform  BaseTransform
  pg-register       등록
trouble           안 될 때
  tr-negotiation    not-negotiated
  tr-stall          멈춤과 밀림
  tr-dot            파이프라인 그림 뽑기
`);

export const alsa = book('alsa', 'ALSA', 'PCM 장치로 소리를 내고 받기', 'sbc', `
sound             디지털 소리
  sd-sampling       샘플링 주파수와 비트 깊이
  sd-channels       채널과 인터리브
  sd-frames         샘플, 프레임, 피리어드
  sd-latency        버퍼와 지연
stack             리눅스의 소리 층
  sk-layers         ALSA, PipeWire, PulseAudio, JACK
  sk-kernel         카드, 장치, 서브장치
  sk-pi             라즈베리파이의 소리 장치
tools             도구
  tl-aplay          aplay와 arecord
  tl-list           장치 목록 읽기
  tl-mixer          alsamixer와 amixer
  tl-speaker-test   speaker-test
names             장치 이름
  nm-hw             hw와 plughw
  nm-default        default
  nm-asoundrc       asoundrc
  nm-plugins        플러그인: dmix, dsnoop
setup             준비
  st-install        libasound 설치와 링크
  st-errors         오류 값 다루기
playback          재생
  pb-open           snd_pcm_open
  pb-hw             하드웨어 파라미터
  pb-sw             소프트웨어 파라미터
  pb-write          writei
  pb-sine           사인파 만들기
  pb-wav            WAV 파일 틀기
  pb-drain          drain과 drop
capture           녹음
  cp-read           readi
  cp-save           WAV로 저장
  cp-level          크기 재기
xrun              언더런과 오버런
  xr-what           왜 생기나
  xr-recover        되살리기
  xr-tune           버퍼와 피리어드 고르기
transfer          전송 방식
  tf-blocking       블로킹
  tf-poll           poll
  tf-callback       비동기 핸들러
  tf-mmap           mmap
duplex            동시에 받고 내기
  dx-loop           받아서 바로 내보내기
  dx-latency        왕복 지연 재기
  dx-sync           두 장치의 시계 차이
mixer             믹서
  mx-simple         simple 믹서 API
  mx-events         값이 바뀔 때 알기
i2s               I2S 장치 붙이기
  is-bus            I2S 버스
  is-dac            DAC 보드
  is-mic            I2S 마이크
  is-overlay        오버레이
usb               USB 오디오
midi              MIDI
  md-raw            RawMIDI
  md-seq            시퀀서
dsp               처리해 보기
  ds-gain           크기 조절과 클리핑
  ds-filter         간단한 필터
  ds-fft            FFT로 주파수 보기
realtime          실시간
  rt-priority       스레드 우선순위
  rt-rules          콜백에서 하면 안 되는 일
pipewire          PipeWire와 함께 살기
`);

export const litert = book('litert', 'LiteRT', '작은 기기에서 신경망 돌리기', 'sbc', `
edge              기기에서 하는 추론
  eg-why            서버로 보내지 않는 이유
  eg-limits         메모리, 열, 시간이라는 한계
  eg-runtimes       런타임 지도: LiteRT, ONNX Runtime, NCNN, ExecuTorch
  eg-name           TensorFlow Lite에서 LiteRT로
model             모델 파일
  md-format         .tflite의 구조
  md-zoo            쓸 만한 모델 찾기
  md-inspect        모델 들여다보기
  md-license        모델의 라이선스
convert           모델 바꾸기
  cv-tf             TensorFlow에서
  cv-pytorch        PyTorch에서
  cv-ops            지원 안 되는 연산
quantize          양자화
  qt-idea           실수를 정수로
  qt-dynamic        동적 범위 양자화
  qt-full           전체 정수 양자화와 대표 데이터
  qt-accuracy       정확도 다시 재기
build             C++ 준비
  bd-prebuilt       미리 빌드된 라이브러리
  bd-cmake          CMake로 빌드
  bd-cross          교차 컴파일
  bd-python         파이썬 런타임으로 먼저 확인하기
interpreter       인터프리터
  ip-load           모델 싣기
  ip-build          인터프리터 만들기
  ip-allocate       텐서 할당
  ip-threads        스레드 수
  ip-c-api          C API
tensors           텐서
  tn-shape          모양과 타입
  tn-input          입력 채우기
  tn-output         출력 읽기
  tn-quant-params   양자화 파라미터로 되돌리기
  tn-resize         입력 크기 바꾸기
preprocess        전처리
  pr-resize         크기 맞추기
  pr-normalize      정규화
  pr-layout         채널 순서와 배치
  pr-camera         카메라 프레임에서 바로
tasks             과제별 후처리
  tk-classify       분류
  tk-detect         검출과 NMS
  tk-segment        분할
  tk-pose           자세
  tk-audio          소리 분류와 깨우는 말
delegates         델리게이트
  dg-xnnpack        XNNPACK
  dg-gpu            GPU
  dg-npu            외부 가속기
measure           재기
  ms-benchmark      benchmark_model
  ms-latency        지연과 그 흔들림
  ms-memory         메모리
  ms-thermal        열 속에서 오래 돌리기
pipeline          파이프라인
  pl-threads        캡처, 추론, 표시 나누기
  pl-skip           프레임 건너뛰기
  pl-batch          배치는 도움이 되나
micro             마이크로컨트롤러용 LiteRT
llm               작은 언어 모델 돌리기
  lm-size           램에 들어가는가
  lm-llamacpp       llama.cpp
  lm-speed          토큰 속도와 기대치
update            모델 갈아 끼우기
`);
