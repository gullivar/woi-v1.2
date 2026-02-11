// WOI On-Prem Mock Data - Detection Rules and User Scenarios

export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';
export type RuleCategory = 'Device Security' | 'Vuln Mgmt' | 'Identity & Access' | 'App Risk' | 'System & Compliance' | 'External Threat' | 'Device Performance';
export type DetectionTechnique = 'Static Rule' | 'Threat Intel' | 'Peer Analysis' | 'Spatio-Temporal' | 'Dynamic Threshold (EMA)' | 'Unsupervised ML (iForest)';

export interface DetectionRule {
    id: string;
    category: RuleCategory;
    nameEn: string;
    nameKo: string;
    technique: DetectionTechnique;
    description: string;
    severity: Severity;
    score: number;
    enabled: boolean;
    sigmaRule?: string;
}

export interface Alert {
    ruleId: string;
    ruleName: string;
    severity: Severity;
    score: number;
    timestamp: string;
    details: string;
}

export interface User {
    id: string;
    name: string;
    nameEn: string;
    department: string;
    email: string;
    riskScore: number;
    riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
    alerts: Alert[];
    deviceInfo: {
        model: string;
        os: string;
        lastSeen: string;
    };
    scoreBreakdown: {
        baseRisk: number;
        baseRuleName: string;
        additionalRisks: Array<{ name: string; score: number }>;
        timeFactor: number;
        finalScore: number;
    };
}

// 30 Detection Rules (Golden Set)
export const DETECTION_RULES: DetectionRule[] = [
    {
        id: 'DEV-001',
        category: 'Device Security',
        nameEn: 'Device Integrity Compromised',
        nameKo: '단말 무결성 훼손',
        technique: 'Static Rule',
        description: '루팅(Android) 또는 탈옥(iOS)된 기기 탐지',
        severity: 'Critical',
        score: 100,
        enabled: true,
        sigmaRule: `title: Device Integrity Compromised
id: DEV-001
status: production
description: Detects rooted (Android) or jailbroken (iOS) devices
logsource:
  product: mdm
  service: device_compliance
detection:
  selection:
    ComplianceSummary.IsCompromised: true
  condition: selection
falsepositives:
  - Authorized security testing devices
level: critical
tags:
  - attack.defense_evasion
  - attack.t1601`
    },
    {
        id: 'DEV-002',
        category: 'Device Security',
        nameEn: 'Disk Encryption Disabled',
        nameKo: '디스크 암호화 해제',
        technique: 'Static Rule',
        description: '디스크 암호화(BitLocker/FileVault) 미적용 상태',
        severity: 'High',
        score: 70,
        enabled: true,
    },
    {
        id: 'DEV-003',
        category: 'Device Security',
        nameEn: 'Device Passcode Missing',
        nameKo: '잠금 비밀번호 미설정',
        technique: 'Static Rule',
        description: '기기 화면 잠금(PIN/Pattern) 미설정',
        severity: 'High',
        score: 75,
        enabled: true,
    },
    {
        id: 'DEV-004',
        category: 'Device Security',
        nameEn: 'USB Debugging Enabled',
        nameKo: 'USB 디버깅 활성화',
        technique: 'Static Rule',
        description: '개발자 옵션의 USB 디버깅 활성화',
        severity: 'Medium',
        score: 40,
        enabled: true,
    },
    {
        id: 'DEV-005',
        category: 'Device Security',
        nameEn: 'Unknown Source App Allowed',
        nameKo: '알 수 없는 출처 허용',
        technique: 'Static Rule',
        description: '사이드로딩(APK 직접 설치) 허용 설정',
        severity: 'High',
        score: 60,
        enabled: true,
    },
    {
        id: 'VUL-006',
        category: 'Vuln Mgmt',
        nameEn: 'Dormant Device Detected',
        nameKo: '장기 미사용 기기',
        technique: 'Static Rule',
        description: '30일 이상 서버와 통신이 없는 유령 기기',
        severity: 'Medium',
        score: 40,
        enabled: true,
    },
    {
        id: 'VUL-007',
        category: 'Vuln Mgmt',
        nameEn: 'Persistent Critical CVE',
        nameKo: '치명적 취약점 방치',
        technique: 'Threat Intel',
        description: 'CVSS 9.0 이상 취약점이 14일 넘게 패치 안됨',
        severity: 'Critical',
        score: 90,
        enabled: true,
    },
    {
        id: 'VUL-008',
        category: 'Vuln Mgmt',
        nameEn: 'OS Version Outdated',
        nameKo: 'OS 버전 노후화',
        technique: 'Peer Analysis',
        description: '동료 그룹(Peer) 대비 OS 버전이 2단계 이상 낮음',
        severity: 'Medium',
        score: 30,
        enabled: true,
    },
    {
        id: 'IDN-009',
        category: 'Identity & Access',
        nameEn: 'Impossible Travel',
        nameKo: '물리적 불가능 이동',
        technique: 'Spatio-Temporal',
        description: '물리적 이동 속도 한계(1000km/h) 초과 접속',
        severity: 'Critical',
        score: 100,
        enabled: true,
        sigmaRule: `title: Impossible Travel Detected
id: IDN-009
status: production
description: Detects access from geographically impossible locations within short time
logsource:
  product: mdm
  service: access_log
detection:
  selection:
    event_type: user_access
  condition: |
    distance_km / time_hours > 1000
falsepositives:
  - VPN usage
  - Proxy servers
level: critical
tags:
  - attack.credential_access
  - attack.t1078`
    },
    {
        id: 'IDN-010',
        category: 'Identity & Access',
        nameEn: 'IP Hopping Anomaly',
        nameKo: 'IP 호핑 탐지',
        technique: 'Spatio-Temporal',
        description: '10분 내 3개국 이상 IP 변경 (VPN/Tor 의심)',
        severity: 'High',
        score: 85,
        enabled: true,
    },
    {
        id: 'IDN-011',
        category: 'Identity & Access',
        nameEn: 'Abnormal Time Access',
        nameKo: '비정상 시간대 접속',
        technique: 'Dynamic Threshold (EMA)',
        description: '사용자의 평소 접속 시간대(EMA)를 벗어난 접속',
        severity: 'Medium',
        score: 50,
        enabled: true,
    },
    {
        id: 'IDN-012',
        category: 'Identity & Access',
        nameEn: 'Enrollment Storm',
        nameKo: '기기 등록 폭주',
        technique: 'Unsupervised ML (iForest)',
        description: '1시간 내 동일 ID로 3대 이상 기기 등록 시도',
        severity: 'High',
        score: 80,
        enabled: true,
    },
    {
        id: 'APP-013',
        category: 'App Risk',
        nameEn: 'Prohibited App Installed',
        nameKo: '금지된 앱 설치',
        technique: 'Static Rule',
        description: '블랙리스트(Tor, 해킹툴) 앱 설치 확인',
        severity: 'High',
        score: 85,
        enabled: true,
    },
    {
        id: 'APP-014',
        category: 'App Risk',
        nameEn: 'Mandatory App Removed',
        nameKo: '필수 앱 임의 삭제',
        technique: 'Static Rule',
        description: '보안/업무 필수 앱을 사용자가 삭제함',
        severity: 'Medium',
        score: 45,
        enabled: true,
    },
    {
        id: 'APP-015',
        category: 'App Risk',
        nameEn: 'App Install Volume Spike',
        nameKo: '앱 설치 수량 급증',
        technique: 'Unsupervised ML (iForest)',
        description: '24시간 내 앱 설치 수가 평소 대비 폭증',
        severity: 'Medium',
        score: 40,
        enabled: true,
    },
    {
        id: 'SYS-016',
        category: 'System & Compliance',
        nameEn: 'Unauthorized MDM Unenrollment',
        nameKo: 'MDM 강제 이탈 시도',
        technique: 'Static Rule',
        description: 'EnterpriseWipe(관리 제거) 이벤트 발생',
        severity: 'Critical',
        score: 95,
        enabled: true,
    },
    {
        id: 'SYS-017',
        category: 'System & Compliance',
        nameEn: 'Unauthorized SIM Swap',
        nameKo: '미승인 SIM 교체',
        technique: 'Static Rule',
        description: '등록된 ICCID와 다른 SIM 카드 감지',
        severity: 'Medium',
        score: 50,
        enabled: true,
    },
    {
        id: 'SYS-018',
        category: 'System & Compliance',
        nameEn: 'Restriction Profile Removed',
        nameKo: '제한 프로필 제거',
        technique: 'Static Rule',
        description: '카메라 차단 등 제한 프로필이 제거됨',
        severity: 'High',
        score: 70,
        enabled: true,
    },
    {
        id: 'SYS-019',
        category: 'System & Compliance',
        nameEn: 'Emulator Detected',
        nameKo: '가상 기기 탐지',
        technique: 'Static Rule',
        description: '모델명에 Emulator/Generic 포함',
        severity: 'High',
        score: 80,
        enabled: true,
    },
    {
        id: 'SYS-020',
        category: 'System & Compliance',
        nameEn: 'MAC Address Spoofing',
        nameKo: 'MAC 주소 스푸핑',
        technique: 'Peer Analysis',
        description: '동일 MAC 주소를 가진 기기가 다수 발견됨',
        severity: 'High',
        score: 75,
        enabled: true,
    },
    {
        id: 'EXT-021',
        category: 'External Threat',
        nameEn: 'External MTD Threat',
        nameKo: '외부 백신 위협 탐지',
        technique: 'Threat Intel',
        description: 'Carbon Black/Lookout이 High/Crit 위협 탐지',
        severity: 'Critical',
        score: 95,
        enabled: true,
    },
    {
        id: 'EXT-022',
        category: 'External Threat',
        nameEn: 'Critical Policy Violation',
        nameKo: '치명적 정책 위반',
        technique: 'Static Rule',
        description: 'Critical 키워드가 포함된 정책 위반',
        severity: 'High',
        score: 80,
        enabled: true,
    },
    {
        id: 'IDN-023',
        category: 'Identity & Access',
        nameEn: 'Weak Auth Access',
        nameKo: '취약 인증 접근',
        technique: 'Static Rule',
        description: '위험 상태에서 MFA 없이 단일 인증 접근',
        severity: 'Medium',
        score: 45,
        enabled: true,
    },
    {
        id: 'SYS-024',
        category: 'System & Compliance',
        nameEn: 'Agent Reporting Failure',
        nameKo: '에이전트 리포팅 실패',
        technique: 'Static Rule',
        description: '보안 상태 정보가 수신되지 않음',
        severity: 'Medium',
        score: 35,
        enabled: true,
    },
    {
        id: 'EXT-025',
        category: 'External Threat',
        nameEn: 'UEM Risk Score Spike',
        nameKo: 'UEM 위험 점수 급등',
        technique: 'Dynamic Threshold (EMA)',
        description: 'UEM 자체 점수가 전일 대비 급격히 악화',
        severity: 'High',
        score: 80,
        enabled: true,
    },
    {
        id: 'IDN-026',
        category: 'Identity & Access',
        nameEn: 'Suspicious Admin Login',
        nameKo: '비인가 관리자 접속',
        technique: 'Static Rule',
        description: '화이트리스트에 없는 IP로 콘솔 접속',
        severity: 'Critical',
        score: 100,
        enabled: true,
    },
    {
        id: 'IDN-027',
        category: 'Identity & Access',
        nameEn: 'Anomalous Action Sequence',
        nameKo: '이상 행동 순서',
        technique: 'Unsupervised ML (iForest)',
        description: '발생 확률 0.1% 미만의 희귀 행동 순서',
        severity: 'High',
        score: 85,
        enabled: true,
    },
    {
        id: 'SYS-028',
        category: 'System & Compliance',
        nameEn: 'Automated Bot Activity',
        nameKo: '자동화 봇 행위',
        technique: 'Unsupervised ML (iForest)',
        description: 'API 호출 간격이 기계적으로 일정함 (Entropy)',
        severity: 'High',
        score: 90,
        enabled: true,
    },
    {
        id: 'DEV-029',
        category: 'Device Performance',
        nameEn: 'Abnormal Data Usage',
        nameKo: '비정상 데이터 과다 사용',
        technique: 'Peer Analysis',
        description: '동료 그룹 대비 데이터 사용량 상위 1%',
        severity: 'High',
        score: 75,
        enabled: true,
    },
    {
        id: 'DEV-030',
        category: 'Device Performance',
        nameEn: 'Rapid Battery Drain',
        nameKo: '급격한 배터리 소모',
        technique: 'Dynamic Threshold (EMA)',
        description: '평소 대비 배터리 소모 속도가 급격히 빠름',
        severity: 'Medium',
        score: 50,
        enabled: true,
    },
];

// Mock Users with Risk Scenarios
export const MOCK_USERS: User[] = [
    {
        id: 'user-001',
        name: '김철수',
        nameEn: 'Cheolsoo Kim',
        department: '마케팅팀',
        email: 'cheolsoo.kim@company.com',
        riskScore: 95,
        riskLevel: 'Critical',
        alerts: [
            {
                ruleId: 'IDN-009',
                ruleName: '물리적 불가능 이동 (Impossible Travel)',
                severity: 'Critical',
                score: 100,
                timestamp: '2025-12-04T03:15:00+09:00',
                details: '서울에서 접속 후 10분 뒤 뉴욕에서 접속 감지 (물리적 이동 불가능)',
            },
            {
                ruleId: 'IDN-011',
                ruleName: '비정상 시간대 접속 (Abnormal Time Access)',
                severity: 'Medium',
                score: 50,
                timestamp: '2025-12-04T03:00:00+09:00',
                details: '새벽 3시 접속 (평소 접속 시간: 09:00-18:00)',
            },
            {
                ruleId: 'DEV-029',
                ruleName: '비정상 데이터 과다 사용 (Abnormal Data Usage)',
                severity: 'High',
                score: 75,
                timestamp: '2025-12-04T02:00:00+09:00',
                details: '5GB 데이터 업로드 (평소 일일 평균: 200MB)',
            },
        ],
        deviceInfo: {
            model: 'iPhone 15 Pro',
            os: 'iOS 17.2',
            lastSeen: '2025-12-04T03:15:00+09:00',
        },
        scoreBreakdown: {
            baseRisk: 100,
            baseRuleName: '물리적 불가능 이동 (Impossible Travel)',
            additionalRisks: [
                { name: '비정상 데이터 과다 사용', score: 15 },
            ],
            timeFactor: 1.0,
            finalScore: 95, // Min(100, (100 + 15) * 1.0) -> capped for demo
        },
    },
    {
        id: 'user-002',
        name: '이영희',
        nameEn: 'Younghee Lee',
        department: 'IT팀',
        email: 'younghee.lee@company.com',
        riskScore: 78,
        riskLevel: 'High',
        alerts: [
            {
                ruleId: 'VUL-007',
                ruleName: '치명적 취약점 방치 (Persistent Critical CVE)',
                severity: 'Critical',
                score: 90,
                timestamp: '2025-12-03T14:20:00+09:00',
                details: 'CVE-2024-1234 (CVSS 9.8) 패치 미적용 (21일 경과)',
            },
            {
                ruleId: 'DEV-002',
                ruleName: '디스크 암호화 해제 (Disk Encryption Disabled)',
                severity: 'High',
                score: 70,
                timestamp: '2025-12-03T10:00:00+09:00',
                details: 'BitLocker 암호화가 비활성화됨',
            },
        ],
        deviceInfo: {
            model: 'Dell Latitude 7430',
            os: 'Windows 11 Pro',
            lastSeen: '2025-12-04T09:30:00+09:00',
        },
        scoreBreakdown: {
            baseRisk: 90,
            baseRuleName: '치명적 취약점 방치',
            additionalRisks: [],
            timeFactor: 0.9,
            finalScore: 78,
        },
    },
    {
        id: 'user-003',
        name: '박민수',
        nameEn: 'Minsu Park',
        department: '영업팀',
        email: 'minsu.park@company.com',
        riskScore: 65,
        riskLevel: 'High',
        alerts: [
            {
                ruleId: 'APP-013',
                ruleName: '금지된 앱 설치 (Prohibited App Installed)',
                severity: 'High',
                score: 85,
                timestamp: '2025-12-02T16:45:00+09:00',
                details: 'Tor Browser 설치 감지',
            },
        ],
        deviceInfo: {
            model: 'Samsung Galaxy S24',
            os: 'Android 14',
            lastSeen: '2025-12-04T11:20:00+09:00',
        },
        scoreBreakdown: {
            baseRisk: 85,
            baseRuleName: '금지된 앱 설치',
            additionalRisks: [],
            timeFactor: 0.8,
            finalScore: 65,
        },
    },
    {
        id: 'user-004',
        name: '최지은',
        nameEn: 'Jieun Choi',
        department: '재무팀',
        email: 'jieun.choi@company.com',
        riskScore: 52,
        riskLevel: 'Medium',
        alerts: [
            {
                ruleId: 'IDN-011',
                ruleName: '비정상 시간대 접속 (Abnormal Time Access)',
                severity: 'Medium',
                score: 50,
                timestamp: '2025-12-01T22:30:00+09:00',
                details: '야간 접속 (평소 접속 시간: 09:00-17:00)',
            },
        ],
        deviceInfo: {
            model: 'MacBook Pro 14"',
            os: 'macOS 14.2',
            lastSeen: '2025-12-04T10:15:00+09:00',
        },
        scoreBreakdown: {
            baseRisk: 50,
            baseRuleName: '비정상 시간대 접속',
            additionalRisks: [],
            timeFactor: 1.0,
            finalScore: 52,
        },
    },
    {
        id: 'user-005',
        name: '정현우',
        nameEn: 'Hyunwoo Jung',
        department: 'HR팀',
        email: 'hyunwoo.jung@company.com',
        riskScore: 48,
        riskLevel: 'Medium',
        alerts: [
            {
                ruleId: 'DEV-004',
                ruleName: 'USB 디버깅 활성화 (USB Debugging Enabled)',
                severity: 'Medium',
                score: 40,
                timestamp: '2025-11-30T13:00:00+09:00',
                details: '개발자 옵션에서 USB 디버깅 활성화됨',
            },
        ],
        deviceInfo: {
            model: 'Google Pixel 8',
            os: 'Android 14',
            lastSeen: '2025-12-04T08:45:00+09:00',
        },
        scoreBreakdown: {
            baseRisk: 40,
            baseRuleName: 'USB 디버깅 활성화',
            additionalRisks: [],
            timeFactor: 1.2,
            finalScore: 48,
        },
    },
];

// Organization Risk Index (for Dashboard)
export const ORG_RISK_INDEX = {
    score: 65,
    level: 'Warning' as const,
    trend: 'increasing' as const,
    lastUpdated: '2025-12-04T22:00:00+09:00',
};

// Risk Trend Data (24h)
export const RISK_TREND_DATA = [
    { time: '00:00', score: 52 },
    { time: '03:00', score: 58 },
    { time: '06:00', score: 55 },
    { time: '09:00', score: 60 },
    { time: '12:00', score: 62 },
    { time: '15:00', score: 64 },
    { time: '18:00', score: 63 },
    { time: '21:00', score: 65 },
];

// Threat Map Data (for Impossible Travel visualization)
export const THREAT_MAP_DATA = [
    {
        from: { city: 'Seoul', country: 'South Korea', lat: 37.5665, lng: 126.9780 },
        to: { city: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060 },
        user: '김철수',
        timeGap: '10분',
    },
];

// 30-Day Risk Trend Data
export const RISK_TREND_30_DAYS = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
        date: date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
        score: Math.floor(50 + Math.random() * 30), // Random score between 50 and 80
    };
});

// Device Platform Distribution (Stacked Bar)
export const DEVICE_PLATFORM_DATA = [
    { name: 'iOS', high: 12, medium: 25, low: 45 },
    { name: 'Android', high: 18, medium: 30, low: 35 },
    { name: 'Windows', high: 8, medium: 15, low: 60 },
    { name: 'macOS', high: 5, medium: 10, low: 25 },
];

// Threat Type Distribution (Pie Chart)
export const THREAT_TYPE_DATA = [
    { name: 'Rooting/Jailbreak', value: 15, color: '#ef4444' }, // Red-500
    { name: 'App Threat', value: 35, color: '#f97316' }, // Orange-500
    { name: 'Network Threat', value: 25, color: '#eab308' }, // Yellow-500
    { name: 'Phishing', value: 15, color: '#3b82f6' }, // Blue-500
    { name: 'OS Outdated', value: 10, color: '#64748b' }, // Slate-500
];

// Risk Heatmap Data (Department vs Role)
export const RISK_HEATMAP_DATA = [
    { x: '영업팀', y: '임원', value: 85 },
    { x: '영업팀', y: '팀장', value: 65 },
    { x: '영업팀', y: '사원', value: 45 },
    { x: 'IT팀', y: '임원', value: 40 },
    { x: 'IT팀', y: '팀장', value: 55 },
    { x: 'IT팀', y: '사원', value: 30 },
    { x: '재무팀', y: '임원', value: 75 },
    { x: '재무팀', y: '팀장', value: 50 },
    { x: '재무팀', y: '사원', value: 25 },
    { x: 'HR팀', y: '임원', value: 35 },
    { x: 'HR팀', y: '팀장', value: 45 },
    { x: 'HR팀', y: '사원', value: 20 },
    { x: '마케팅팀', y: '임원', value: 60 },
    { x: '마케팅팀', y: '팀장', value: 55 },
    { x: '마케팅팀', y: '사원', value: 40 },
];

