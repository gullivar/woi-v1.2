// VDI 신청 타입 정의

export type OSType =
    | 'WIN_P1'
    | 'MAC_P2'
    | 'IOS_P3'
    | 'AND_P4';

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
    WIN_P1: 'Windows Profile',
    MAC_P2: 'macOS Profile',
    IOS_P3: 'iOS Profile',
    AND_P4: 'Android Profile',
};

export const APPLICATION_TYPE_LABELS: Record<ApplicationType, string> = {
    NEW: '신규 신청',
    EXTENSION: '기간 연장',
    CHANGE: '변경 신청',
};
