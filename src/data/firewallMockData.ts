import type { FirewallRequest, OrgUser } from '../types/firewall';

export type { OrgUser };

// 목 조직도 데이터
export const mockOrgUsers: OrgUser[] = [
    // 일반 사용자
    {
        id: 'user001',
        name: '김철수',
        email: 'kim.cs@company.com',
        department: 'IT운영팀',
        position: '대리',
        role: 'user',
        managerId: 'mgr001'
    },
    {
        id: 'user002',
        name: '이영희',
        email: 'lee.yh@company.com',
        department: 'IT운영팀',
        position: '사원',
        role: 'user',
        managerId: 'mgr001'
    },
    {
        id: 'user003',
        name: '박민수',
        email: 'park.ms@company.com',
        department: '개발팀',
        position: '과장',
        role: 'user',
        managerId: 'mgr002'
    },

    // L1 승인자 (팀장급)
    {
        id: 'mgr001',
        name: '최팀장',
        email: 'choi.tm@company.com',
        department: 'IT운영팀',
        position: '팀장',
        role: 'l1_approver',
        managerId: 'mgr003'
    },
    {
        id: 'mgr002',
        name: '정팀장',
        email: 'jung.tm@company.com',
        department: '개발팀',
        position: '팀장',
        role: 'l1_approver',
        managerId: 'mgr003'
    },

    // L2 승인자 (부서장급)
    {
        id: 'mgr003',
        name: '강부장',
        email: 'kang.bj@company.com',
        department: 'IT본부',
        position: '부장',
        role: 'l2_approver',
        managerId: 'sec001'
    },

    // 보안관리자
    {
        id: 'sec001',
        name: '보안관리자',
        email: 'security@company.com',
        department: '보안팀',
        position: '보안관리자',
        role: 'security_manager'
    }
];

// 목 방화벽 요청 데이터
export const mockFirewallRequests: FirewallRequest[] = [
    {
        requestId: 'FW-2026-001',
        requesterId: 'user001',
        requesterName: '김철수',
        requesterDept: 'IT운영팀',
        requesterEmail: 'kim.cs@company.com',

        trafficRuleName: 'Default',
        changeType: 'MODIFY_ACTION',
        applicationName: 'Slack',
        currentAction: 'BLOCK',
        requestedAction: 'BYPASS',
        currentDestination: 'slack.com',
        requestedDestination: 'slack.com',

        validFrom: '2026-02-09T00:00:00Z',
        validUntil: '2026-03-09T23:59:59Z',

        businessJustification: '업무 협업을 위해 Slack 사용이 필요합니다. 프로젝트 팀원들과의 실시간 커뮤니케이션을 위해 1개월간 접근 권한이 필요합니다.',
        impactScope: 'PERSONAL',

        l1ApproverId: 'mgr001',
        l1ApproverName: '최팀장',
        l1ApproverEmail: 'choi.tm@company.com',
        l2ApproverId: 'mgr003',
        l2ApproverName: '강부장',
        l2ApproverEmail: 'kang.bj@company.com',

        status: 'PENDING_L1',
        createdAt: '2026-02-08T10:30:00Z',
        updatedAt: '2026-02-08T10:30:00Z'
    },
    {
        requestId: 'FW-2026-002',
        requesterId: 'user002',
        requesterName: '이영희',
        requesterDept: 'IT운영팀',
        requesterEmail: 'lee.yh@company.com',

        trafficRuleName: 'Default',
        changeType: 'NEW_RULE',
        applicationName: 'GitHub Desktop',
        requestedAction: 'TUNNEL',
        requestedDestination: 'github.com, *.github.com',

        validFrom: '2026-02-09T00:00:00Z',

        businessJustification: '소스 코드 관리를 위해 GitHub 접근이 필요합니다. 회사 프로젝트 저장소에 접근하여 코드를 관리해야 합니다.',
        impactScope: 'PERSONAL',

        l1ApproverId: 'mgr001',
        l1ApproverName: '최팀장',
        l1ApproverEmail: 'choi.tm@company.com',
        l2ApproverId: 'mgr003',
        l2ApproverName: '강부장',
        l2ApproverEmail: 'kang.bj@company.com',

        status: 'APPROVED_L1',
        createdAt: '2026-02-07T14:20:00Z',
        updatedAt: '2026-02-08T09:15:00Z',

        l1ApprovedAt: '2026-02-08T09:15:00Z',
        l1ApprovalComment: '업무상 필요한 것으로 판단되어 승인합니다.'
    },
    {
        requestId: 'FW-2026-003',
        requesterId: 'user003',
        requesterName: '박민수',
        requesterDept: '개발팀',
        requesterEmail: 'park.ms@company.com',

        trafficRuleName: 'Default',
        changeType: 'MODIFY_DESTINATION',
        applicationName: 'Chrome',
        currentAction: 'BYPASS',
        requestedAction: 'BYPASS',
        currentDestination: '*.company.com',
        requestedDestination: '*.company.com, *.aws.amazon.com, *.azure.com',

        validFrom: '2026-02-10T00:00:00Z',

        businessJustification: '클라우드 인프라 관리를 위해 AWS 및 Azure 콘솔 접근이 필요합니다. 서버 모니터링 및 관리 업무 수행을 위해 필수적입니다.',
        impactScope: 'TEAM',

        l1ApproverId: 'mgr002',
        l1ApproverName: '정팀장',
        l1ApproverEmail: 'jung.tm@company.com',
        l2ApproverId: 'mgr003',
        l2ApproverName: '강부장',
        l2ApproverEmail: 'kang.bj@company.com',

        status: 'APPROVED_L2',
        createdAt: '2026-02-06T11:00:00Z',
        updatedAt: '2026-02-08T15:30:00Z',

        l1ApprovedAt: '2026-02-07T10:00:00Z',
        l1ApprovalComment: '클라우드 인프라 관리 업무에 필요합니다.',
        l2ApprovedAt: '2026-02-08T15:30:00Z',
        l2ApprovalComment: '보안팀 최종 검토 후 적용 바랍니다.'
    },
    {
        requestId: 'FW-2026-004',
        requesterId: 'user001',
        requesterName: '김철수',
        requesterDept: 'IT운영팀',
        requesterEmail: 'kim.cs@company.com',

        trafficRuleName: 'Default',
        changeType: 'DELETE_RULE',
        applicationName: 'Zoom',
        currentAction: 'BLOCK',
        requestedAction: 'BYPASS',
        currentDestination: 'zoom.us',
        requestedDestination: 'zoom.us',

        validFrom: '2026-02-05T00:00:00Z',
        validUntil: '2026-02-05T23:59:59Z',

        businessJustification: '긴급 화상 회의 참석을 위해 Zoom 접근이 필요합니다.',
        impactScope: 'PERSONAL',

        l1ApproverId: 'mgr001',
        l1ApproverName: '최팀장',
        l1ApproverEmail: 'choi.tm@company.com',
        l2ApproverId: 'mgr003',
        l2ApproverName: '강부장',
        l2ApproverEmail: 'kang.bj@company.com',

        status: 'REJECTED_L1',
        createdAt: '2026-02-05T08:00:00Z',
        updatedAt: '2026-02-05T10:30:00Z',

        l1RejectionReason: '회사 공식 화상회의 도구는 MS Teams입니다. Zoom 사용은 보안 정책상 허용되지 않습니다.'
    },
    {
        requestId: 'FW-2026-005',
        requesterId: 'user002',
        requesterName: '이영희',
        requesterDept: 'IT운영팀',
        requesterEmail: 'lee.yh@company.com',

        trafficRuleName: 'Default',
        changeType: 'NEW_RULE',
        applicationName: 'Docker Desktop',
        requestedAction: 'TUNNEL',
        requestedDestination: 'docker.io, *.docker.com',

        validFrom: '2026-02-01T00:00:00Z',

        businessJustification: '컨테이너 기반 개발 환경 구축을 위해 Docker Hub 접근이 필요합니다.',
        impactScope: 'TEAM',

        l1ApproverId: 'mgr001',
        l1ApproverName: '최팀장',
        l1ApproverEmail: 'choi.tm@company.com',
        l2ApproverId: 'mgr003',
        l2ApproverName: '강부장',
        l2ApproverEmail: 'kang.bj@company.com',

        status: 'APPLIED',
        createdAt: '2026-01-28T09:00:00Z',
        updatedAt: '2026-02-01T16:00:00Z',

        l1ApprovedAt: '2026-01-29T11:00:00Z',
        l1ApprovalComment: '개발 환경 구축에 필요합니다.',
        l2ApprovedAt: '2026-01-30T14:00:00Z',
        l2ApprovalComment: '승인합니다.',
        securityApprovedAt: '2026-02-01T16:00:00Z',
        securityApprovalComment: 'Workspace ONE UEM에 정책이 적용되었습니다.',
        appliedAt: '2026-02-01T16:00:00Z',
        appliedBy: 'sec001'
    }
];

// LocalStorage 키
export const STORAGE_KEYS = {
    REQUESTS: 'firewall_requests',
    CURRENT_USER: 'current_user',
    NOTIFICATIONS: 'firewall_notifications'
};

// LocalStorage 초기화 함수
export const initializeFirewallStorage = () => {
    if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
        localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(mockFirewallRequests));
    }

    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
        // 기본 사용자를 김철수로 설정
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(mockOrgUsers[0]));
    }

    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
    }
};

// 요청 목록 가져오기
export const getFirewallRequests = (): FirewallRequest[] => {
    const data = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    return data ? JSON.parse(data) : [];
};

// 요청 저장하기
export const saveFirewallRequest = (request: FirewallRequest) => {
    const requests = getFirewallRequests();
    const index = requests.findIndex(r => r.requestId === request.requestId);

    if (index >= 0) {
        requests[index] = request;
    } else {
        requests.push(request);
    }

    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
};

// 현재 사용자 가져오기
export const getCurrentUser = (): OrgUser => {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : mockOrgUsers[0];
};

// 현재 사용자 설정하기 (데모용)
export const setCurrentUser = (user: OrgUser) => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
};

// 조직도에서 사용자 찾기
export const findUserById = (userId: string): OrgUser | undefined => {
    return mockOrgUsers.find(u => u.id === userId);
};

// 직속 상관 찾기
export const getDirectManager = (userId: string): OrgUser | undefined => {
    const user = findUserById(userId);
    if (!user || !user.managerId) return undefined;
    return findUserById(user.managerId);
};

// 상관의 상관 찾기
export const getSecondLevelManager = (userId: string): OrgUser | undefined => {
    const manager = getDirectManager(userId);
    if (!manager || !manager.managerId) return undefined;
    return findUserById(manager.managerId);
};
