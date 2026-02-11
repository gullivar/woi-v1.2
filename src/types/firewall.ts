// 방화벽 정책 변경 요청 타입 정의

export type ChangeType = 'NEW_RULE' | 'MODIFY_RULE' | 'DELETE_RULE' | 'MODIFY_ACTION' | 'MODIFY_DESTINATION';
export type ActionType = 'TUNNEL' | 'BYPASS' | 'BLOCK' | 'PROXY';
export type ImpactScope = 'PERSONAL' | 'TEAM' | 'DEPARTMENT' | 'ORGANIZATION';
export type RequestStatus =
    | 'PENDING_L1'      // 1단계 승인 대기
    | 'APPROVED_L1'     // 1단계 승인됨
    | 'REJECTED_L1'     // 1단계 반려됨
    | 'PENDING_L2'      // 2단계 승인 대기
    | 'APPROVED_L2'     // 2단계 승인됨
    | 'REJECTED_L2'     // 2단계 반려됨
    | 'PENDING_SECURITY' // 보안팀 승인 대기
    | 'APPLIED'         // 정책 적용 완료
    | 'REJECTED_FINAL'; // 최종 반려됨

export interface FirewallRequest {
    requestId: string;
    requesterId: string;
    requesterName: string;
    requesterDept: string;
    requesterEmail: string;

    // 요청 내용
    trafficRuleName: string;
    changeType: ChangeType;
    applicationName: string;
    currentAction?: ActionType;
    requestedAction: ActionType;
    currentDestination?: string;
    requestedDestination: string;

    // 기간 설정
    validFrom: string; // ISO 8601 date string
    validUntil?: string; // ISO 8601 date string, null이면 영구

    // 요청 사유
    businessJustification: string;
    impactScope: ImpactScope;

    // 승인자 정보
    l1ApproverId: string;
    l1ApproverName: string;
    l1ApproverEmail: string;
    l2ApproverId: string;
    l2ApproverName: string;
    l2ApproverEmail: string;

    // 상태 및 이력
    status: RequestStatus;
    createdAt: string;
    updatedAt: string;

    // 승인 이력
    l1ApprovedAt?: string;
    l1ApprovalComment?: string;
    l1RejectionReason?: string;

    l2ApprovedAt?: string;
    l2ApprovalComment?: string;
    l2RejectionReason?: string;

    securityApprovedAt?: string;
    securityApprovalComment?: string;
    securityRejectionReason?: string;

    appliedAt?: string;
    appliedBy?: string;
}

export interface OrgUser {
    id: string;
    name: string;
    email: string;
    department: string;
    position: string;
    role: 'user' | 'l1_approver' | 'l2_approver' | 'security_manager';
    managerId?: string; // 직속 상관 ID
}

export interface NotificationItem {
    id: string;
    type: 'request_submitted' | 'approval_needed' | 'approved' | 'rejected' | 'applied';
    requestId: string;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    recipientId: string;
}
