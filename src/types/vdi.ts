// VDI 신청 타입 정의

export type OSType =
    | 'CD_EDU'
    | 'DEV'
    | 'DEV_SUPPORT'
    | 'CUSTOMER_SUPPORT'
    | 'BACKEND_SUPPORT'
    | 'VCOMM_OPS';

export type ApplicationType =
    | 'NEW'
    | 'EXTENSION'
    | 'CHANGE';

export interface Approver {
    id: string;
    name: string;
    department: string;
    position: string;
    level: 1 | 2 | 3;
}

export interface Attachment {
    id: string;
    fileName: string;
    fileSize: number;
    uploadDate: string;
}

export interface VDIRequest {
    id: string;
    title: string;
    reason: string;
    osType: OSType;
    applicant: {
        name: string;
        department: string;
        employeeId: string;
    };
    period: {
        startDate: string;
        endDate: string;
    };
    applicationType: ApplicationType;
    applicationReason: string;
    approvers: Approver[];
    attachments: Attachment[];
    status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
    updatedAt: string;
}

export const OS_TYPE_LABELS: Record<OSType, string> = {
    CD_EDU: 'CD EDU',
    DEV: 'DEV',
    DEV_SUPPORT: '개발환경/보조업무',
    CUSTOMER_SUPPORT: '고객센터/보조업무',
    BACKEND_SUPPORT: '백엔드/보조업무',
    VCOMM_OPS: 'vComm/운영 지원',
};

export const APPLICATION_TYPE_LABELS: Record<ApplicationType, string> = {
    NEW: '신규 신청',
    EXTENSION: '기간 연장',
    CHANGE: '변경 신청',
};
