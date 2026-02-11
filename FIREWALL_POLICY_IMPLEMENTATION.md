# 방화벽 정책 변경 요청 및 승인 시스템 구현 기록

**작업일**: 2026년 2월 8일  
**프로젝트**: WOI On-Prem Mockup  
**기능**: Firewall Policy Change Request & Approval System

---

## 📋 작업 개요

Workspace ONE UEM의 Device Traffic Rules (DTR) 정책 변경을 위한 멀티레벨 승인 프로세스 웹 시스템을 구현했습니다.

### 주요 목표
- 사용자 친화적인 정책 변경 요청 인터페이스
- 조직도 기반 승인자 선택 시스템
- 3단계 승인 워크플로우 (L1 → L2 → 보안관리자)
- 완전한 감사 추적 (Audit Trail)
- LocalStorage 기반 목업 시스템

---

## 🏗️ 구현된 파일 목록

### 1. 페이지
- `src/pages/FirewallPolicy.tsx` - 메인 페이지 (탭 기반 UI)

### 2. 컴포넌트
- `src/components/FirewallPolicy/RequestForm.tsx` - 요청 제출 폼
- `src/components/FirewallPolicy/RequestList.tsx` - 요청 목록
- `src/components/FirewallPolicy/ApprovalList.tsx` - 승인 대기 목록
- `src/components/FirewallPolicy/RequestDetailModal.tsx` - 상세보기 및 승인 모달
- `src/components/FirewallPolicy/OrgChartPicker.tsx` - 조직도 선택기

### 3. 타입 및 데이터
- `src/types/firewall.ts` - 타입 정의
- `src/data/firewallMockData.ts` - 목 데이터 및 관리 함수
- `src/hooks/useFirewallInit.ts` - localStorage 초기화 훅

### 4. 수정된 파일
- `src/components/Layout.tsx` - 메뉴 추가
- `src/App.tsx` - 라우트 추가
- `vite.config.ts` - 복원

---

## 🎯 주요 기능

### 1. 요청 제출 폼
**위치**: 방화벽 정책 > 요청 제출 탭

**입력 필드**:
- Traffic Rule 이름 (드롭다운)
- 변경 유형 (NEW_RULE, MODIFY_RULE, DELETE_RULE, MODIFY_ACTION, MODIFY_DESTINATION)
- 애플리케이션 이름
- 현재/요청 Action (TUNNEL, BYPASS, BLOCK, PROXY)
- 현재/요청 Destination
- 유효 기간 (시작일, 종료일)
- 비즈니스 정당성
- 영향 범위 (PERSONAL, TEAM, DEPARTMENT, ORGANIZATION)
- L1/L2 승인자 선택

**특징**:
- 조직도 기반 승인자 자동 추천
- 실시간 유효성 검사
- 제출 성공 시 애니메이션 피드백

### 2. 요청 목록
**위치**: 방화벽 정책 > 내 요청 탭

**기능**:
- 검색 (요청 ID, 애플리케이션 이름, 요청자 이름)
- 상태 필터링 (8가지 상태)
- 상태별 색상 코딩 배지
- 최신순 정렬
- 상세보기 버튼

### 3. 승인 대기 목록
**위치**: 방화벽 정책 > 승인 대기 탭

**기능**:
- 현재 사용자 역할에 따른 자동 필터링
  - L1 승인자: PENDING_L1 상태만
  - L2 승인자: APPROVED_L1, PENDING_L2 상태
  - 보안관리자: APPROVED_L2, PENDING_SECURITY 상태
- 비즈니스 정당성 미리보기
- 검토 및 승인 버튼

### 4. 상세보기 및 승인 모달
**표시 정보**:
- 현재 상태 배지
- 요청자 정보
- 정책 변경 내용 상세
- 유효 기간
- 요청 사유
- 승인 이력 타임라인 (3단계)

**승인 기능**:
- 승인/반려 버튼 (권한별 표시)
- 코멘트 입력 (반려 시 필수)
- 상태 자동 업데이트

### 5. 조직도 선택기
**기능**:
- 부서별 사용자 그룹화
- 역할별 배지 표시
- 현재 사용자 제외
- 모달 기반 인터페이스

---

## 📊 데이터 구조

### 요청 상태 (RequestStatus)
```
PENDING_L1      → 1단계 승인 대기
APPROVED_L1     → 1단계 승인됨
REJECTED_L1     → 1단계 반려됨
PENDING_L2      → 2단계 승인 대기
APPROVED_L2     → 2단계 승인됨
REJECTED_L2     → 2단계 반려됨
PENDING_SECURITY → 보안팀 승인 대기
APPLIED         → 정책 적용 완료
REJECTED_FINAL  → 최종 반려됨
```

### 조직도 구조
```
일반 사용자 (3명)
  ├─ 김철수 (IT운영팀 대리)
  ├─ 이영희 (IT운영팀 사원)
  └─ 박민수 (개발팀 과장)
     ↓
L1 승인자 (2명)
  ├─ 최팀장 (IT운영팀 팀장)
  └─ 정팀장 (개발팀 팀장)
     ↓
L2 승인자 (1명)
  └─ 강부장 (IT본부 부장)
     ↓
보안관리자 (1명)
  └─ 보안관리자 (보안팀)
```

### 샘플 요청 데이터
- FW-2026-001: Slack 차단 해제 (PENDING_L1)
- FW-2026-002: GitHub Desktop 신규 규칙 (APPROVED_L1)
- FW-2026-003: Chrome Destination 변경 (APPROVED_L2)
- FW-2026-004: Zoom 차단 해제 (REJECTED_L1)
- FW-2026-005: Docker Desktop 신규 규칙 (APPLIED)

---

## 🔄 워크플로우

### 정상 승인 플로우
```
1. 사용자 요청 제출
   └─> 상태: PENDING_L1
   
2. L1 승인자 검토 및 승인
   └─> 상태: APPROVED_L1
   
3. L2 승인자 검토 및 승인
   └─> 상태: APPROVED_L2
   
4. 보안관리자 최종 승인 및 적용
   └─> 상태: APPLIED
```

### 반려 플로우
```
각 단계에서 반려 가능:
- L1 반려 → REJECTED_L1
- L2 반려 → REJECTED_L2
- 보안팀 반려 → REJECTED_FINAL
```

---

## 🧪 테스트 방법

### 1. 개발 서버 시작
```bash
cd /Users/joseph/Dev_project/14-2.WorkSpaceOne/woi-onprem-mockup
npm run dev
```
**서버 주소**: http://localhost:5173

### 2. 기본 테스트

#### 요청 제출
1. 사이드바 "방화벽 정책" 클릭
2. "요청 제출" 탭에서 폼 작성
3. 승인자 선택
4. 제출 확인

#### 승인 워크플로우
**사용자 전환 (개발자 콘솔)**:

```javascript
// L1 승인자로 전환
localStorage.setItem('current_user', JSON.stringify({
  id: 'mgr001',
  name: '최팀장',
  email: 'choi.tm@company.com',
  department: 'IT운영팀',
  position: '팀장',
  role: 'l1_approver',
  managerId: 'mgr003'
}));
location.reload();

// L2 승인자로 전환
localStorage.setItem('current_user', JSON.stringify({
  id: 'mgr003',
  name: '강부장',
  email: 'kang.bj@company.com',
  department: 'IT본부',
  position: '부장',
  role: 'l2_approver',
  managerId: 'sec001'
}));
location.reload();

// 보안관리자로 전환
localStorage.setItem('current_user', JSON.stringify({
  id: 'sec001',
  name: '보안관리자',
  email: 'security@company.com',
  department: '보안팀',
  position: '보안관리자',
  role: 'security_manager'
}));
location.reload();

// 일반 사용자로 복귀
localStorage.setItem('current_user', JSON.stringify({
  id: 'user001',
  name: '김철수',
  email: 'kim.cs@company.com',
  department: 'IT운영팀',
  position: '대리',
  role: 'user',
  managerId: 'mgr001'
}));
location.reload();
```

### 3. 데이터 초기화
```javascript
localStorage.clear();
location.reload();
```

---

## 🛠️ 기술 스택

- **Frontend**: React 18 + TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS + Custom Dark Mode
- **Icons**: Lucide React
- **Build Tool**: Vite 5
- **Data Storage**: Browser LocalStorage

---

## 📝 구현 과정에서 해결한 문제

### 1. TypeScript 타입 에러
**문제**: `verbatimModuleSyntax` 옵션으로 인한 타입 import 에러
**해결**: type-only import 사용
```typescript
// Before
import { FirewallRequest } from '../types/firewall';

// After
import type { FirewallRequest } from '../types/firewall';
```

### 2. vite.config.ts 손상
**문제**: 파일 내용이 "파이"로 손상됨
**해결**: 기본 Vite 설정으로 복원
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### 3. esbuild 권한 문제
**문제**: `EACCES` 에러로 개발 서버 시작 실패
**해결**: 실행 권한 부여
```bash
chmod +x node_modules/@esbuild/darwin-arm64/bin/esbuild
chmod -R +x node_modules/.bin
```

---

## 🎨 UI/UX 특징

### 다크 모드 지원
- 모든 컴포넌트가 다크 모드 지원
- 자동 색상 전환

### 상태별 색상 코딩
- 대기: 노란색
- 승인: 파란색/초록색
- 반려: 빨간색
- 보안팀: 보라색

### 반응형 디자인
- 모바일, 태블릿, 데스크톱 지원
- 그리드 레이아웃 자동 조정

### 애니메이션
- 호버 효과
- 트랜지션
- 제출 성공 피드백

---

## 🔮 향후 개선 사항

### 1. 백엔드 통합
- [ ] RESTful API 연동
- [ ] 실제 데이터베이스 사용
- [ ] JWT 인증/인가

### 2. 알림 시스템
- [ ] 실제 이메일 발송 (SMTP)
- [ ] 인앱 알림
- [ ] 웹소켓 실시간 업데이트

### 3. Workspace ONE UEM 통합
- [ ] UEM API 연동
- [ ] 정책 자동 적용
- [ ] 상태 동기화

### 4. 고급 기능
- [ ] 대량 요청 처리
- [ ] 요청 템플릿
- [ ] 통계 대시보드
- [ ] 정책 스케줄링
- [ ] 자동 만료 처리

### 5. 보안 강화
- [ ] 입력 값 서버 사이드 검증
- [ ] XSS 방지
- [ ] CSRF 토큰
- [ ] 감사 로그 암호화

---

## 📚 참고 자료

### Workspace ONE UEM Device Traffic Rules
- URL: https://cn1768.awmdm.com/AirWatch/aa/#/security/tunnel/config/deviceTrafficRule
- 정책 구조: Assignment Name, Tunnel Mode, Rules (Rank 기반)
- Action 유형: TUNNEL, BYPASS, BLOCK, PROXY

### 프로젝트 문서
- 구현 계획서: `.gemini/antigravity/brain/.../implementation_plan.md`
- 작업 체크리스트: `.gemini/antigravity/brain/.../task.md`
- 워크스루: `.gemini/antigravity/brain/.../walkthrough.md`

---

## ✅ 완료 체크리스트

### Planning
- [x] 요구사항 검토
- [x] 구현 계획 작성
- [x] UI/UX 설계

### Implementation
- [x] 메뉴 추가
- [x] 요청 제출 폼
- [x] 조직도 선택기
- [x] 요청 목록
- [x] 승인 대기 목록
- [x] 상세보기 모달
- [x] 승인/반려 기능
- [x] 목 데이터 관리
- [x] localStorage 초기화

### Verification
- [x] 개발 서버 실행
- [x] 기본 기능 테스트
- [x] 워크스루 문서 작성

---

## 📞 문의 및 지원

**개발자**: Antigravity AI  
**작업일**: 2026-02-08  
**프로젝트**: WOI On-Prem Mockup  
**버전**: 1.0.0

---

**마지막 업데이트**: 2026년 2월 8일 23:30
