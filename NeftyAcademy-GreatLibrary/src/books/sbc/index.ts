/**
 * 소형 기기 서가들. 라즈베리파이 급의 작은 리눅스 기기를 기준으로 배울 것을 책으로 나눴다.
 * 라이브러리와 API는 저마다 책 한 권이고, 여섯 권 안팎씩 여섯 서가로 묶는다.
 *
 *   소형 기기 기초      라즈베리파이 시작하기, 임베디드 리눅스 시스템, 교차 컴파일과 배포,
 *                       장치 보안과 업데이트, 측정값 다루기, 베어메탈 라즈베리파이
 *   시스템 API          리눅스 시스템 호출, POSIX 스레드, libsystemd, D-Bus, 커널 모듈과 드라이버, ARM NEON
 *   장치와 버스         libgpiod, PWM, I2C, SPI, 시리얼 통신, IIO, libusb
 *   카메라, 영상, 소리  V4L2, libcamera, OpenCV, GStreamer, ALSA, LiteRT
 *   화면과 입력         DRM/KMS, OpenGL ES와 EGL, SDL, LVGL, GTK 4, evdev
 *   연결과 데이터       BlueZ, libcurl, MQTT, OpenSSL, cJSON, SQLite
 *
 * 차례는 이 폴더의 파일들에 글로 적혀 있다. 책을 더하려면 해당 파일에 book(...)을 쓰고 아래 books 에 넣는다.
 * 지도의 배치는 저절로 다시 계산된다.
 */
import type { Book } from 'neftyacademy-paragons-bookshelf';
import { sbcBaremetal, sbcCross, sbcLinux, sbcMeasure, sbcSecurity, sbcStart } from './basics';
import { bluez, cjson, libcurl, mosquitto, openssl, sqlite } from './connect';
import { drmKms, evdev, gles, gtk, lvgl, sdl } from './display';
import { i2cDev, iio, libgpiod, libusb, pwm, spidev, termios } from './io';
import { alsa, gstreamer, libcamera, litert, opencv, v4l2 } from './media';
import { dbus, kernelModule, libsystemd, neon, pthreads, sysCalls } from './system';

const shelf = (id: string, title: string, subtitle: string, books: Book[]): Book => ({ id, title, subtitle, category: 'sbc', chapters: [], books });

export const sbcBasics = shelf('sbc-basics', '소형 기기 기초', '보드를 켜고, 굴리고, 지키고, 재는 법', [sbcStart, sbcLinux, sbcCross, sbcSecurity, sbcMeasure, sbcBaremetal]);

export const sbcSystem = shelf('sbc-system', '시스템 API', '커널과 시스템 서비스에 부탁하는 인터페이스', [sysCalls, pthreads, libsystemd, dbus, kernelModule, neon]);

export const sbcIo = shelf('sbc-io', '장치와 버스', '핀과 선으로 바깥 장치와 말하기', [libgpiod, pwm, i2cDev, spidev, termios, iio, libusb]);

export const sbcMedia = shelf('sbc-media', '카메라, 영상, 소리', '프레임과 샘플을 받고, 처리하고, 내보내기', [v4l2, libcamera, opencv, gstreamer, alsa, litert]);

export const sbcDisplay = shelf('sbc-display', '화면과 입력', '화면에 그리고 사람의 입력 받기', [drmKms, gles, sdl, lvgl, gtk, evdev]);

export const sbcConnect = shelf('sbc-connect', '연결과 데이터', '바깥과 주고받고 기기 안에 쌓아 두기', [bluez, libcurl, mosquitto, openssl, cjson, sqlite]);

/** 앞표지에 놓이는 순서 */
export const sbcShelves: Book[] = [sbcBasics, sbcSystem, sbcIo, sbcMedia, sbcDisplay, sbcConnect];
