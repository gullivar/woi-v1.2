import { useState, useEffect } from 'react';
import { Calendar, Clock, Info, Check, AlertCircle, X } from 'lucide-react';
import { cn } from '../lib/utils';
import type { OSType, ApplicationType, Approver } from '../types/vdi';
import { useLanguage } from '../context/LanguageContext';

const OS_TYPES: { type: OSType; label: string; icon: string; brand: string }[] = [
    { type: 'CD_EDU', label: 'CO-EDU', icon: 'Windows', brand: 'bg-cyan-500' },
    { type: 'DEV', label: 'DEV', icon: 'Windows', brand: 'bg-blue-500' },
    { type: 'DEV_SUPPORT', label: 'development_support', icon: 'Windows', brand: 'bg-sky-500' },
    { type: 'CUSTOMER_SUPPORT', label: 'customer_support', icon: 'Windows', brand: 'bg-indigo-500' },
    { type: 'BACKEND_SUPPORT', label: 'backend_support', icon: 'Windows', brand: 'bg-cyan-600' },
    { type: 'VCOMM_OPS', label: 'vcomm_ops', icon: 'Windows', brand: 'bg-blue-600' },
];

interface Applicant {
    id: string;
    name: string;
    department: string;
    pcType: string;
    startDate: string;
    endDate: string;
}

export const VdiRequest = () => {
    const { t, language } = useLanguage();

    const [title, setTitle] = useState(t('mock.default_title'));
    const [reason, setReason] = useState(t('mock.default_reason'));
    const [selectedOS, setSelectedOS] = useState<OSType | null>('CUSTOMER_SUPPORT');
    const [globalStartDate, setGlobalStartDate] = useState('2026-02-09');
    const [globalEndDate, setGlobalEndDate] = useState('2027-02-09');
    const [executionDate, setExecutionDate] = useState('2026-02-09');
    const [executionTime, setExecutionTime] = useState('15:05');
    const [isAgreed, setIsAgreed] = useState(false);

    // 모달 상태
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submissionComment, setSubmissionComment] = useState(t('modal.default_comment'));

    // 신청자 관련 상태
    const [applicantInput, setApplicantInput] = useState(language === 'ko' ? '장호' : 'James');
    const [applicants, setApplicants] = useState<Applicant[]>([]);

    // 결재선 관련 상태
    const [approverInput, setApproverInput] = useState(language === 'ko' ? '성훈' : 'David');
    const [approvers, setApprovers] = useState<any[]>([]);

    // 언어 변경 시 기본 데이터 업데이트
    useEffect(() => {
        setTitle(t('mock.default_title'));
        setReason(t('mock.default_reason'));
        setSubmissionComment(t('modal.default_comment'));
        setApplicantInput(language === 'ko' ? '장호' : 'James');
        setApproverInput(language === 'ko' ? '성훈' : 'David');

        setApplicants([
            {
                id: '1',
                name: t('mock.applicant_1'),
                department: t('mock.dept_1'),
                pcType: t('mock.pc_type_1'),
                startDate: '2026-02-09',
                endDate: '2027-02-09',
            }
        ]);

        setApprovers([
            { id: '0', status: t('mock.status_draft'), name: t('mock.approver_0'), level: 0 },
            { id: '1', status: t('mock.status_approve'), name: t('mock.approver_1'), level: 1 },
            { id: '2', status: t('mock.status_notify'), name: t('mock.approver_2'), level: 2 },
        ]);
    }, [language, t]);

    const addApplicant = () => {
        if (!applicantInput.trim()) return;
        const newApplicant: Applicant = {
            id: Date.now().toString(),
            name: `${applicantInput}(${applicantInput.toLowerCase()}${t('mock.user_suffix')})`,
            department: t('mock.dept_auto'),
            pcType: t('mock.pc_type_1'),
            startDate: globalStartDate,
            endDate: globalEndDate,
        };
        setApplicants([...applicants, newApplicant]);
        setApplicantInput('');
    };

    const removeApplicant = (id: string) => {
        setApplicants(applicants.filter(a => a.id !== id));
    };

    const removeAllApplicants = () => {
        setApplicants([]);
    };

    const addApprover = () => {
        if (!approverInput.trim()) return;
        const newApprover = {
            id: Date.now().toString(),
            status: approvers.length === 1 ? t('mock.status_approve') : t('mock.status_notify'),
            name: `${approverInput}(${approverInput.toLowerCase()}${t('mock.approver_suffix')})//${t('mock.support_dept')}/`,
            level: approvers.length,
        };
        setApprovers([...approvers, newApprover]);
        setApproverInput('');
    };

    const handleOpenModal = () => {
        if (!isAgreed) {
            alert(language === 'ko' ? '신청 유의사항에 동의해주세요.' : 'Please agree to the notices.');
            return;
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleFinalSubmit = () => {
        setIsModalOpen(false);
        alert(t('modal.success'));
    };

    return (
        <div className="p-8 space-y-8 bg-white dark:bg-dark-950 min-h-screen max-w-6xl mx-auto shadow-sm relative">
            {/* Header */}
            <div className="border-b border-gray-100 pb-4">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    {t('vdi.title')}
                </h1>
                <p className="text-xs text-blue-600 font-medium">
                    {t('vdi.subtitle')}
                </p>
            </div>

            {/* 신청 제목 */}
            <section className="space-y-3">
                <h2 className="text-sm font-bold text-blue-600">{t('vdi.form.title')}</h2>
                <div className="relative">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 dark:border-dark-800 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                    <span className="absolute right-3 top-2 text-xs text-gray-400">{title.length}/60</span>
                </div>
            </section>

            {/* 신청 사유 */}
            <section className="space-y-3">
                <h2 className="text-sm font-bold text-blue-600">{t('vdi.form.reason')}</h2>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-dark-800 rounded text-sm min-h-[80px] focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                />
            </section>

            {/* 가상 PC 선택 */}
            <section className="space-y-3">
                <h2 className="text-sm font-bold text-blue-600">{t('vdi.form.pc_select')}</h2>
                <div className="border border-gray-200 dark:border-dark-800 rounded p-4 space-y-4">
                    <div className="flex gap-1 border-b border-gray-200 dark:border-dark-800 pb-2">
                        <button className="px-4 py-1.5 text-xs font-bold bg-white dark:bg-dark-900 border border-gray-300 dark:border-dark-700 border-b-white dark:border-b-dark-900 -mb-[9px] z-10">
                            {t('vdi.form.work_type')}
                        </button>
                    </div>
                    <div className="grid grid-cols-4 gap-4 pt-2">
                        {OS_TYPES.map((os) => (
                            <button
                                key={os.type}
                                onClick={() => setSelectedOS(os.type)}
                                className={cn(
                                    "relative group h-24 border rounded flex items-center justify-center gap-3 transition-all",
                                    selectedOS === os.type
                                        ? "border-blue-500 ring-2 ring-blue-500 ring-offset-2"
                                        : "border-gray-200 dark:border-dark-800 bg-gray-50 dark:bg-dark-900 hover:border-gray-300"
                                )}
                            >
                                <div className={cn("p-1.5 rounded", os.brand)}>
                                    <div className="w-5 h-5 flex items-center justify-center">
                                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M0 3.449L9.75 2.1V11.719H0V3.449zm0 9.15L9.75 12.6V22.219L0 20.869V12.599zm10.65-10.74L24 0V11.719H10.65V1.859zm0 10.74L24 12.6V24L10.65 22.35V12.599z" /></svg>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-blue-800 dark:text-blue-300">{t(`vdi.form.${os.label}`)}</span>
                                {selectedOS === os.type && (
                                    <div className="absolute top-0 right-0 p-1">
                                        <Check className="w-3 h-3 text-blue-500" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* 신청자 */}
            <section className="space-y-3">
                <h2 className="text-sm font-bold text-blue-600">{t('vdi.form.applicant')}</h2>
                <div className="border border-gray-200 dark:border-dark-800 rounded p-4 space-y-4 text-[11px] text-gray-600 leading-relaxed">
                    <p>{t('vdi.form.applicant_desc1')}</p>
                    <p>{t('vdi.form.applicant_desc2')}</p>
                    <p>{t('vdi.form.applicant_desc3')}</p>

                    <div className="bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <span>{t('vdi.form.name_id')}</span>
                            <input
                                type="text"
                                value={applicantInput}
                                onChange={(e) => setApplicantInput(e.target.value)}
                                className="w-24 px-2 py-1 border border-gray-300 dark:border-dark-700 rounded bg-white dark:bg-dark-900"
                            />
                            <button
                                onClick={addApplicant}
                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            >
                                {t('vdi.form.add')}
                            </button>
                        </div>
                        <label className="flex items-center gap-1 cursor-pointer">
                            <input type="checkbox" defaultChecked className="cursor-pointer" />
                            <span>{t('vdi.form.apply_same_period')}</span>
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                value={globalStartDate}
                                onChange={(e) => setGlobalStartDate(e.target.value)}
                                className="px-2 py-1 border border-gray-300 dark:border-dark-700 rounded"
                            />
                            <span>~</span>
                            <input
                                type="date"
                                value={globalEndDate}
                                onChange={(e) => setGlobalEndDate(e.target.value)}
                                className="px-2 py-1 border border-gray-300 dark:border-dark-700 rounded"
                            />
                        </div>
                    </div>

                    <table className="w-full border-collapse border border-gray-200 dark:border-dark-800">
                        <thead className="bg-gray-50 dark:bg-dark-900 border-b border-gray-200 dark:border-dark-800">
                            <tr>
                                <th className="border border-gray-200 dark:border-dark-800 p-2 font-bold">{t('vdi.form.no')}</th>
                                <th className="border border-gray-200 dark:border-dark-800 p-2 font-bold">{t('vdi.form.user_name')}</th>
                                <th className="border border-gray-200 dark:border-dark-800 p-2 font-bold">{t('vdi.form.dept_name')}</th>
                                <th className="border border-gray-200 dark:border-dark-800 p-2 font-bold">{t('vdi.form.workspace')}</th>
                                <th className="border border-gray-200 dark:border-dark-800 p-2 font-bold">{t('vdi.form.pc_type')}</th>
                                <th className="border border-gray-200 dark:border-dark-800 p-2 font-bold">{t('vdi.form.start_date')}</th>
                                <th className="border border-gray-200 dark:border-dark-800 p-2 font-bold">{t('vdi.form.end_date')}</th>
                                <th className="border border-gray-200 dark:border-dark-800 p-2 text-center">
                                    <button
                                        onClick={removeAllApplicants}
                                        className="px-2 py-0.5 border border-gray-300 dark:border-dark-700 rounded bg-white dark:bg-dark-900 hover:bg-gray-50 font-bold"
                                    >
                                        {t('vdi.form.delete_all')}
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {applicants.map((a, idx) => (
                                <tr key={a.id}>
                                    <td className="border border-gray-200 dark:border-dark-800 p-2 text-center">{idx + 1}</td>
                                    <td className="border border-gray-200 dark:border-dark-800 p-2">{a.name}</td>
                                    <td className="border border-gray-200 dark:border-dark-800 p-2">{a.department}</td>
                                    <td className="border border-gray-200 dark:border-dark-800 p-2 text-center">
                                        <select className="border-none bg-transparent outline-none py-1">
                                            <option>{t('vdi.form.work_type')}</option>
                                        </select>
                                    </td>
                                    <td className="border border-gray-200 dark:border-dark-800 p-2 text-center">
                                        <select className="border-none bg-transparent outline-none py-1 text-blue-600 font-bold">
                                            <option>{a.pcType}</option>
                                        </select>
                                    </td>
                                    <td className="border border-gray-200 dark:border-dark-800 p-2">
                                        <input type="date" value={a.startDate} className="w-full border-none bg-transparent outline-none" readOnly />
                                    </td>
                                    <td className="border border-gray-200 dark:border-dark-800 p-2">
                                        <input type="date" value={a.endDate} className="w-full border-none bg-transparent outline-none" readOnly />
                                    </td>
                                    <td className="border border-gray-200 dark:border-dark-800 p-2 text-center">
                                        <button
                                            onClick={() => removeApplicant(a.id)}
                                            className="px-2 py-0.5 border border-gray-300 dark:border-dark-700 rounded bg-white dark:bg-dark-900 hover:bg-gray-50"
                                        >
                                            {t('vdi.form.delete')}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {applicants.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="border border-gray-200 dark:border-dark-800 p-4 text-center text-gray-400">
                                        {t('vdi.form.empty_applicants')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* 처리시각 지정 */}
            <section className="space-y-3">
                <h2 className="text-sm font-bold text-blue-600">{t('vdi.form.execution_time')}</h2>
                <div className="bg-blue-50/30 dark:bg-blue-900/5 border border-gray-100 dark:border-dark-900 p-4 rounded flex items-center gap-4 text-xs">
                    <span>{t('vdi.form.date_select')}</span>
                    <input type="date" value={executionDate} onChange={(e) => setExecutionDate(e.target.value)} className="px-2 py-1 border border-gray-300 dark:border-dark-700 rounded bg-white dark:bg-dark-900" />
                    <span>{t('vdi.form.time_select')}</span>
                    <select value={executionTime} onChange={(e) => setExecutionTime(e.target.value)} className="px-2 py-1 border border-gray-300 dark:border-dark-700 rounded bg-white dark:bg-dark-900">
                        <option>15:05</option>
                        <option>16:00</option>
                    </select>
                    <span className="text-gray-500">{t('vdi.form.execution_msg').replace('{date}', executionDate).replace('{time}', executionTime)}</span>
                </div>
                <p className="text-[10px] text-gray-500">
                    {t('vdi.form.execution_desc')}
                </p>
            </section>

            {/* 신청 유의사항 */}
            <section className="space-y-3">
                <h2 className="text-sm font-bold text-blue-600">{t('vdi.form.notice')}</h2>
                <div className="border border-gray-200 dark:border-dark-800 rounded p-4 space-y-3 text-[11px] bg-gray-50/50 dark:bg-dark-900/50">
                    <div className="font-bold text-gray-800 dark:text-gray-200">{t('vdi.form.notice_title')}</div>
                    <ol className="list-decimal list-inside space-y-1 text-gray-600 dark:text-gray-400">
                        <li>{t('vdi.form.notice_1')}</li>
                        <li>{t('vdi.form.notice_2')}</li>
                        <li>{t('vdi.form.notice_3')}</li>
                        <li>{t('vdi.form.notice_4')}</li>
                    </ol>
                    <label className="flex items-center gap-2 pt-2 text-xs font-bold text-gray-800 dark:text-gray-200 cursor-pointer">
                        <input type="checkbox" checked={isAgreed} onChange={(e) => setIsAgreed(e.target.checked)} className="w-4 h-4 cursor-pointer" />
                        {t('vdi.form.agree_msg')}
                    </label>
                </div>
            </section>

            {/* 결재선 설정 */}
            <section className="space-y-3">
                <h2 className="text-sm font-bold text-blue-600">{t('vdi.form.approval_line')}</h2>
                <div className="border border-gray-200 dark:border-dark-800 rounded p-4 space-y-4">
                    <div className="text-[11px] text-blue-600">
                        {t('vdi.form.approval_guide')}
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                        <span className="font-bold text-red-500">{t('vdi.form.name_id')}</span>
                        <input
                            type="text"
                            value={approverInput}
                            onChange={(e) => setApproverInput(e.target.value)}
                            className="w-48 px-2 py-1 border border-gray-300 dark:border-dark-700 rounded"
                        />
                        <button
                            onClick={addApprover}
                            className="px-4 py-1.5 bg-white border border-blue-500 text-blue-500 rounded font-bold text-[11px] hover:bg-blue-50 transition-colors"
                        >
                            {t('vdi.form.add')}
                        </button>
                    </div>
                    <div className="flex items-center gap-6 text-xs border-t border-gray-100 pt-4">
                        <span className="font-bold text-red-500">{t('vdi.form.flow_select')}</span>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="flow" defaultChecked className="cursor-pointer" /> {t('vdi.form.flow_approve')}</label>
                            <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="flow" className="cursor-pointer" /> {t('vdi.form.flow_review')}</label>
                        </div>
                        <span className="text-gray-400 italic">{t('vdi.form.total_count').replace('{count}', approvers.length.toString())}</span>
                    </div>
                    <table className="w-full border-t border-gray-200 dark:border-dark-800 mt-2">
                        <tbody className="text-[11px]">
                            {approvers.map((approver, idx) => (
                                <tr key={approver.id} className="border-b border-gray-100 dark:border-dark-900 group">
                                    <td className="py-2.5 px-4 w-12 text-center text-gray-500">{idx}</td>
                                    <td className="py-2.5 px-4 w-20 font-bold text-gray-700 dark:text-gray-300">{approver.status}</td>
                                    <td className="py-2.5 px-4 text-gray-600 dark:text-gray-400 flex justify-between items-center">
                                        <span>{approver.name}</span>
                                        {idx > 0 && (
                                            <button
                                                onClick={() => setApprovers(approvers.filter(a => a.id !== approver.id))}
                                                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Submit */}
            <div className="flex justify-center pt-8 pb-12">
                <button
                    onClick={handleOpenModal}
                    className={cn(
                        "px-24 py-2.5 rounded text-white font-bold text-sm shadow-sm transition-all",
                        isAgreed ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                    )}
                >
                    {t('vdi.form.submit')}
                </button>
            </div>

            {/* 결재상신 모달 */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
                    <div className="bg-white w-[500px] shadow-2xl overflow-hidden rounded-sm">
                        {/* Modal Header */}
                        <div className="bg-black text-white px-4 py-2.5 flex justify-between items-center">
                            <h3 className="text-sm font-bold">{t('modal.title')}</h3>
                            <button onClick={handleCloseModal} className="hover:text-gray-300 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-800">{t('modal.reason')}</label>
                                <div className="border border-gray-300 dark:border-dark-800 p-0.5">
                                    <textarea
                                        value={submissionComment}
                                        onChange={(e) => setSubmissionComment(e.target.value)}
                                        className="w-full h-32 p-3 text-sm outline-none resize-none bg-white dark:bg-dark-900 border-none"
                                        spellCheck={false}
                                    />
                                </div>
                                <p className="text-[10px] text-gray-500">
                                    {t('modal.desc')}
                                </p>
                            </div>

                            {/* Modal Buttons */}
                            <div className="flex justify-center gap-2 pt-2">
                                <button
                                    onClick={handleFinalSubmit}
                                    className="bg-[#337ab7] hover:bg-[#286090] text-white px-10 py-1.5 rounded text-sm font-medium transition-colors min-w-[100px]"
                                >
                                    {t('modal.submit')}
                                </button>
                                <button
                                    onClick={handleCloseModal}
                                    className="bg-[#444444] hover:bg-[#333333] text-white px-10 py-1.5 rounded text-sm font-medium transition-colors min-w-[100px]"
                                >
                                    {t('modal.cancel')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
