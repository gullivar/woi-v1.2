# WOI On-Prem Mockup

Workspace ONE Intelligence On-Premise 모의 시스템

## 프로젝트 개요

Workspace ONE Intelligence의 UI/UX를 기반으로 한 On-Premise 위협 탐지 및 분석 시스템 모의 구현

### 주요 기능

- 📊 **대시보드**: 조직 위험 지수, 위험 사용자 목록, 위협 지도
- 🔍 **탐지 규칙**: 30개의 Golden Set 규칙 관리 및 편집
- 👤 **사용자 상세**: XAI 기반 위험 점수 분석
- ⚠️ **위협 탐지**: 실시간 알림 타임라인
- 🤖 **자동화**: 워크플로우 빌더

## 시작하기

### 필수 요구사항

- Node.js 18+ 
- npm 또는 yarn

### 설치

```bash
npm install
```

### 실행

#### 방법 1: 스크립트 사용 (권장)

```bash
# 서버 시작
./start.sh

# 서버 종료
./stop.sh
```

#### 방법 2: npm 명령어

```bash
# 개발 서버 시작
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 미리보기
npm run preview
```

### 접속

개발 서버가 시작되면 브라우저에서 접속:
- **URL**: http://localhost:5173
- **기본 테마**: Light Mode (Workspace ONE Intelligence)

## 기술 스택

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 프로젝트 구조

```
woi-onprem-mockup/
├── src/
│   ├── components/     # 재사용 가능한 컴포넌트
│   ├── context/        # React Context (데이터, 테마)
│   ├── data/           # 모의 데이터
│   ├── lib/            # 유틸리티 함수
│   ├── pages/          # 페이지 컴포넌트
│   ├── App.tsx         # 메인 앱
│   └── main.tsx        # 엔트리 포인트
├── start.sh            # 시작 스크립트
├── stop.sh             # 종료 스크립트
└── package.json
```

## 주요 페이지

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/` | Dashboard | 조직 위험 지수 및 주요 지표 |
| `/user/:id` | User Detail | 사용자별 위험 분석 (XAI) |
| `/threats` | Threats | 위협 탐지 타임라인 |
| `/rules` | Rule Editor | 탐지 규칙 관리 |
| `/automation` | Playbook Editor | 자동화 워크플로우 |

## 테마

### Light Mode (기본)
- Workspace ONE Intelligence 스타일
- 밝은 배경 (#FFFFFF)
- 파란색 강조 (#0091DA)

### Dark Mode
- 사이드바 테마 토글 버튼으로 전환
- localStorage에 저장

## 개발

### 코드 스타일

- TypeScript strict mode
- ESLint + Prettier
- Tailwind CSS utilities

### 주요 컴포넌트

- `RiskGauge`: SVG 기반 위험 게이지
- `Layout`: 사이드바 네비게이션
- `DataContext`: 전역 상태 관리

## 라이선스

MIT

## 작성자

Joseph

## 접근 제한 (Token-Based Access Control)

이 데모는 특정인에게만 접속하게 하기 위해 토큰 기반 접근 제어를 구현했습니다.

### 접근 방법

올바른 접근 토큰으로만 애플리케이션에 접근할 수 있습니다. 다음과 같은 형식으로 URL에 토큰을 전달하세요:

```
https://gullivar.github.io/woi-v1.2/?k=d3a5f8c1-9e27-4b6a-8f2c-5e7d9a1b4c3e
```

- 쿼리 파라미터: `?k=[ACCESS_TOKEN]`
- 토큰이 없거나 잘못된 경우 "Access Denied" 페이지가 표시됩니다.
- 올바른 토큰이 있는 경우 정상적으로 애플리케이션이 로드됩니다.

### 토큰 변경 방법

로컬 개발 환경에서 토큰을 변경하려면:

1. 루트 디렉토리의 `.env` 파일을 편집합니다.
2. `VITE_ACCESS_KEY=your-new-token` 형식으로 새 토큰을 설정합니다.
3. 개발 서버를 재시작합니다.

**.env 파일은 `.gitignore`에 포함되어 있어 저장소에 커밋되지 않습니다.**
