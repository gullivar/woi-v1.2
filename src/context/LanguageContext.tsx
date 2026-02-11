import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type Language = 'ko' | 'en';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
    ko: {
        // Layout
        'nav.dashboard': '대시보드',
        'nav.users': '위험 사용자',
        'nav.threats': '위협 탐지',
        'nav.vdi': 'VDI 신청',
        'nav.rules': '탐지 규칙',
        'nav.automation': '자동화',
        'nav.settings': '설정',
        'nav.search': '검색',
        'nav.notifications': '알림',
        'toggle.language': 'Language',
        'toggle.theme': '다크 모드',

        // VDI Page
        'vdi.title': 'VDI 신청',
        'vdi.subtitle': '신청서를 작성하신 후 결제완료되면 가상 PC 생성이 시작됩니다. (가상 PC 생성은 1시간 가량 소요됩니다. 생성시작, 생성완료시 사용자에게 안내메일이 발송됩니다.)',
        'vdi.form.title': '신청 제목',
        'vdi.form.reason': '신청 사유',
        'vdi.form.pc_select': '가상 PC 선택',
        'vdi.form.work_type': '일반 업무용',
        'vdi.form.applicant': '신청자',
        'vdi.form.applicant_desc1': '다른사용자의 항목을 신청시에는 반드시 해당사용자의 동의를 얻어야합니다.',
        'vdi.form.applicant_desc2': '잘못된 대리신청으로 인한 모든 책임은 신청자 본인에게 있습니다.',
        'vdi.form.applicant_desc3': '반드시 대상자의 이름,아이디,부서,직책을 확인하십시오.',
        'vdi.form.name_id': '성명/아이디 *',
        'vdi.form.add': '+ 추가',
        'vdi.form.apply_same_period': '동일기간 적용',
        'vdi.form.no': '번호',
        'vdi.form.user_name': '사용자 이름',
        'vdi.form.dept_name': '부서명',
        'vdi.form.workspace': '사업장',
        'vdi.form.pc_type': '가상 PC Type',
        'vdi.form.start_date': '사용 시작일',
        'vdi.form.end_date': '사용 만료일',
        'vdi.form.delete_all': '- 전체삭제',
        'vdi.form.delete': '- 삭제',
        'vdi.form.empty_applicants': '추가된 신청자가 없습니다. 상단에서 추가해 주세요.',
        'vdi.form.execution_time': '처리시각 지정',
        'vdi.form.date_select': '날짜 지정',
        'vdi.form.time_select': '시각 지정',
        'vdi.form.execution_desc': '신청의 결제가 완료된 이후에 실행되므로 적절한 시간을 선택하십시오. 지정한 시각이 지나서 신청이 완료되는 경우 가장 가까운 다음 작업시간에 실행됩니다.',
        'vdi.form.execution_msg': '→ 신청한 내용이 {date} {time}에 실행되도록 지정되었습니다.',
        'vdi.form.notice': '신청 유의사항 (동의필요)',
        'vdi.form.notice_title': '가상 PC를 사용하시기 전 아래 사항에 대해 숙지해주시기 바랍니다.',
        'vdi.form.notice_1': '발급 받으신 가상 PC는 30일 이상 미사용시 회수 처리 될 수 있습니다. 실제 사용하실 경우에만 신청해주시기 바랍니다.',
        'vdi.form.notice_2': '임시로 사용하는 가상 PC는 사용이 모두 완료되면 반드시 반납신청 해야 합니다.',
        'vdi.form.notice_3': '사용기간을 명시하여 신청하는 경우 기간이 만료되면 해당 가상 PC는 자동으로 반납됩니다.',
        'vdi.form.notice_4': '사용 현황에 따라 가상 PC의 CPU, Memory 등 리소스가 조정될 수 있습니다.',
        'vdi.form.agree_msg': '내용에 동의하고 결제를 신청합니다. (체크하십시오)',
        'vdi.form.approval_line': '결재선 설정',
        'vdi.form.approval_guide': '결제선 지정 : 신청자 > 승인자 > 시스템 관리자 (승인자는 부서 내 팀장을 조회하여 추가하십시오.)',
        'vdi.form.flow_select': '결재선 선택 *',
        'vdi.form.flow_approve': '결재',
        'vdi.form.flow_review': '검토',
        'vdi.form.total_count': '총 {count}명',
        'vdi.form.submit': '신청',

        // Modal
        'modal.title': '결재상신',
        'modal.reason': '신청 사유',
        'modal.desc': '상신의견은 한글 512자, 영문 1024자 까지 입력이 가능합니다.',
        'modal.submit': '상신',
        'modal.cancel': '취소',
        'modal.default_comment': '결재바랍니다.',
        'modal.success': '결재 상신이 완료되었습니다.',

        // Mock Data
        'mock.applicant_1': '하정호3(changho.ha3)',
        'mock.dept_1': '기술지원2 파트',
        'mock.pc_type_1': '고은비테스트용',
        'mock.approver_0': '고은비(eunbi.ko)//R&D 파트/',
        'mock.approver_1': '한상훈(sanghoon.han)//R&D 파트/',
        'mock.approver_2': '하정호2(changho.ha2)//기술지원2 파트/',
        'mock.status_draft': '기안',
        'mock.status_approve': '결제',
        'mock.status_notify': '통보',
        'mock.default_title': '[VDI 신청] 고은비(eunbi.ko)//R&D 파트',
        'mock.default_reason': 'Test를 위한 VDI 신청을 합니다.',
        'mock.dept_auto': '부서 자동입력',
        'mock.user_suffix': '.user',
        'mock.approver_suffix': '.approver',
        'mock.support_dept': '지원 파트',
        'vdi.form.CO-EDU': 'CO-EDU',
        'vdi.form.DEV': 'DEV',
        'vdi.form.development_support': '하정호 테스트용',
        'vdi.form.customer_support': '고은비 테스트용',
        'vdi.form.backend_support': '이건우 테스트용',
        'vdi.form.vcomm_ops': '이세진 테스트용',
    },
    en: {
        // Layout
        // ... (생략된 경우를 대비해 전체 블록 유지 권장되나 replace_file_content 규칙 준수)
        'nav.dashboard': 'Dashboard',
        'nav.users': 'Risk Users',
        'nav.threats': 'Threat Detection',
        'nav.vdi': 'VDI Request',
        'nav.rules': 'Rules',
        'nav.automation': 'Automation',
        'nav.settings': 'Settings',
        'nav.search': 'Search',
        'nav.notifications': 'Notifications',
        'toggle.language': 'Language',
        'toggle.theme': 'Dark Mode',

        // VDI Page
        'vdi.title': 'VDI Request',
        'vdi.subtitle': 'After filling out the application and completing payment, virtual PC creation will begin. (It takes about an hour. Notification emails will be sent at start and completion.)',
        'vdi.form.title': 'Request Title',
        'vdi.form.reason': 'Request Reason',
        'vdi.form.pc_select': 'Virtual PC Selection',
        'vdi.form.work_type': 'General Purpose',
        'vdi.form.applicant': 'Applicant',
        'vdi.form.applicant_desc1': 'Consent must be obtained when applying for another user.',
        'vdi.form.applicant_desc2': 'All responsibility for incorrect proxy application lies with the applicant.',
        'vdi.form.applicant_desc3': 'Please check the target\'s name, ID, department, and position.',
        'vdi.form.name_id': 'Name/ID *',
        'vdi.form.add': '+ Add',
        'vdi.form.apply_same_period': 'Apply same period',
        'vdi.form.no': 'No.',
        'vdi.form.user_name': 'User Name',
        'vdi.form.dept_name': 'Department',
        'vdi.form.workspace': 'Workplace',
        'vdi.form.pc_type': 'VDI Type',
        'vdi.form.start_date': 'Start Date',
        'vdi.form.end_date': 'End Date',
        'vdi.form.delete_all': '- Delete All',
        'vdi.form.delete': '- Delete',
        'vdi.form.empty_applicants': 'No applicants added. Please add above.',
        'vdi.form.execution_time': 'Specify Execution Time',
        'vdi.form.date_select': 'Date',
        'vdi.form.time_select': 'Time',
        'vdi.form.execution_desc': 'Choose an appropriate time as it runs after payment is completed. If the specified time passes, it will run at the next available slot.',
        'vdi.form.execution_msg': '→ Scheduled to execute on {date} at {time}.',
        'vdi.form.notice': 'Notices (Consent Required)',
        'vdi.form.notice_title': 'Please read the following before using the Virtual PC.',
        'vdi.form.notice_1': 'Virtual PCs not used for more than 30 days may be reclaimed. Please apply only when actually needed.',
        'vdi.form.notice_2': 'Temporary Virtual PCs must be returned immediately after use.',
        'vdi.form.notice_3': 'When applying with a specific period, the Virtual PC will be automatically returned after expiration.',
        'vdi.form.notice_4': 'Resources like CPU and Memory may be adjusted based on usage status.',
        'vdi.form.agree_msg': 'I agree and request payment. (Please check)',
        'vdi.form.approval_line': 'Approval Line Settings',
        'vdi.form.approval_guide': 'Line: Applicant > Approver > System Admin (Add team leader in your department as an approver.)',
        'vdi.form.flow_select': 'Select Flow *',
        'vdi.form.flow_approve': 'Approve',
        'vdi.form.flow_review': 'Review',
        'vdi.form.total_count': 'Total {count} people',
        'vdi.form.submit': 'Submit',
        'vdi.form.CO-EDU': 'CO-EDU',
        'vdi.form.DEV': 'DEV',
        'vdi.form.development_support': 'Development Support',
        'vdi.form.customer_support': 'Customer Support',
        'vdi.form.backend_support': 'Backend Support',
        'vdi.form.vcomm_ops': 'vComm Ops',

        // Modal
        'modal.title': 'Submit for Approval',
        'modal.reason': 'Submission Reason',
        'modal.desc': 'Up to 512 Korean or 1024 English characters can be entered.',
        'modal.submit': 'Submit',
        'modal.cancel': 'Cancel',
        'modal.default_comment': 'Please approve.',
        'modal.success': 'Approval request has been submitted.',

        // Mock Data
        'mock.applicant_1': 'James Wilson(james.wilson)',
        'mock.dept_1': 'Support Sector 2',
        'mock.pc_type_1': 'Development Environment',
        'mock.approver_0': 'Eunbi Ko(eunbi.ko)//R&D Part/',
        'mock.approver_1': 'Sanghoon Han(sanghoon.han)//R&D Part/',
        'mock.approver_2': 'David Ha(david.ha)//Tech Support Part/',
        'mock.status_draft': 'Draft',
        'mock.status_approve': 'Approve',
        'mock.status_notify': 'Notify',
        'mock.default_title': '[VDI] James Wilson//R&D Part',
        'mock.default_reason': 'Applying for VDI for testing purposes.',
        'mock.dept_auto': 'Auto-filled department',
        'mock.user_suffix': '.user',
        'mock.approver_suffix': '.approver',
        'mock.support_dept': 'Support Part',
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(() => {
        const saved = localStorage.getItem('language');
        return (saved as Language) || 'en';
    });

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    const t = (key: string): string => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
