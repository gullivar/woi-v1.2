import { useState, useEffect } from 'react';
import { Calendar, Clock, Info, Check, AlertCircle, X } from 'lucide-react';
import { cn } from '../lib/utils';
import type { OSType, ApplicationType, Approver } from '../types/vdi';
import { useLanguage } from '../context/LanguageContext';

const OS_TYPES: { type: OSType; label: string; icon: string; color: string }[] = [
    { type: 'WIN_P1', label: 'WIN_P1', icon: 'M0 3.449L9.75 2.1V11.719H0V3.449zm0 9.15L9.75 12.6V22.219L0 20.869V12.599zm10.65-10.74L24 0V11.719H10.65V1.859zm0 10.74L24 12.6V24L10.65 22.35V12.599z', color: 'text-[#00A4EF]' },
    { type: 'MAC_P2', label: 'MAC_P2', icon: 'M12.152 6.896c-.548 0-1.711-.516-2.422-.516-1.147 0-2.227.662-2.813 1.685-1.182 2.067-.303 5.123.849 6.773.564.81 1.238 1.717 2.11 1.685.836-.032 1.154-.543 2.162-.543 1.006 0 1.29.543 2.176.527.899-.016 1.488-.826 2.046-1.637.643-.938.913-1.847.928-1.896-.02-.008-1.776-.682-1.794-2.696-.016-1.684 1.378-2.492 1.442-2.532-.786-1.154-1.996-1.284-2.422-1.308-1.071-.087-2.112.594-2.662.594V6.896zm.268-1.13c.451-.54 1.545-1.308 1.944-1.308 0 0 .151 1.62-.636 2.503-.492.548-1.462 1.147-1.936 1.147 0 0-.256-1.821.628-2.342z', color: 'text-gray-900 dark:text-white' },
    { type: 'IOS_P3', label: 'IOS_P3', icon: 'M12.152 6.896c-.548 0-1.711-.516-2.422-.516-1.147 0-2.227.662-2.813 1.685-1.182 2.067-.303 5.123.849 6.773.564.81 1.238 1.717 2.11 1.685.836-.032 1.154-.543 2.162-.543 1.006 0 1.29.543 2.176.527.899-.016 1.488-.826 2.046-1.637.643-.938.913-1.847.928-1.896-.02-.008-1.776-.682-1.794-2.696-.016-1.684 1.378-2.492 1.442-2.532-.786-1.154-1.996-1.284-2.422-1.308-1.071-.087-2.112.594-2.662.594V6.896zm.268-1.13c.451-.54 1.545-1.308 1.944-1.308 0 0 .151 1.62-.636 2.503-.492.548-1.462 1.147-1.936 1.147 0 0-.256-1.821.628-2.342z', color: 'text-gray-900 dark:text-white' },
    { type: 'AND_P4', label: 'AND_P4', icon: 'M17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414ZM17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414ZM17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414Z', color: 'text-[#A4C639]' },
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
    const [selectedOS, setSelectedOS] = useState<OSType | null>('AND_P4');
    const [globalStartDate, setGlobalStartDate] = useState('2026-02-09');
    const [globalEndDate, setGlobalEndDate] = useState('2027-02-09');
    const [executionDate, setExecutionDate] = useState('2026-02-09');
    const [executionTime, setExecutionTime] = useState('15:05');
    const [isAgreed, setIsAgreed] = useState(false);

    // 모달 상태
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submissionComment, setSubmissionComment] = useState(t('modal.default_comment'));

    // 신청자 관련 상태
    const [applicantInput, setApplicantInput] = useState('James Wilson');
    const [applicants, setApplicants] = useState<Applicant[]>([]);

    // 결재선 관련 상태
    const [approverInput, setApproverInput] = useState(language === 'ko' ? '성훈' : 'David');
    const [approvers, setApprovers] = useState<any[]>([]);

    // 언어 변경 시 기본 데이터 업데이트
    useEffect(() => {
        setTitle(t('mock.default_title'));
        setReason(t('mock.default_reason'));
        setSubmissionComment(t('modal.default_comment'));
        setApplicantInput('James Wilson');
        setApproverInput(language === 'ko' ? '성훈' : 'David');

        setApplicants([
            {
                id: '1',
                name: 'James Wilson(james.wilson)',
                department: 'R&D Part',
                pcType: 'Android Profile',
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
                        {OS_TYPES.map((os) => {
                            const label = t(`vdi.form.${os.type}`);
                            const [name, id] = label.split(' [');
                            return (
                                <button
                                    key={os.type}
                                    onClick={() => setSelectedOS(os.type)}
                                    className={cn(
                                        "relative group flex items-center justify-start px-6 gap-6 h-28 border-2 rounded-xl transition-all shadow-sm",
                                        selectedOS === os.type
                                            ? "border-[#002B49] bg-white dark:bg-dark-900"
                                            : "border-gray-200 dark:border-dark-800 bg-white dark:bg-dark-950 opacity-80 hover:opacity-100 hover:border-gray-300"
                                    )}
                                >
                                    <div className={cn("w-14 h-14 flex items-center justify-center", os.color)}>
                                        <svg viewBox="0 0 24 24" className="w-12 h-12 fill-current">
                                            {os.type === 'AND_P4' ? (
                                                <path d="M7 11V16H8V11H7ZM16 11V16H17V11H16ZM9.17 6.42L10.1 7.35C10.7 7.12 11.34 7 12 7C12.66 7 13.3 7.12 13.9 7.35L14.83 6.42C14.97 6.28 15.19 6.28 15.33 6.42C15.47 6.56 15.47 6.78 15.33 6.92L14.47 7.78C15.4 8.6 16.08 9.72 16.33 11H7.67C7.92 9.72 8.6 8.6 9.53 7.78L8.67 6.92C8.53 6.78 8.53 6.56 8.67 6.42C8.81 6.28 9.03 6.28 9.17 6.42ZM7 12H17V17H7V12Z" />
                                            ) : (
                                                <path d={os.icon} />
                                            )}
                                        </svg>
                                    </div>
                                    <div className="flex flex-col items-start gap-1">
                                        <span className="text-xl font-black text-gray-900 dark:text-gray-100 leading-tight">{name}</span>
                                        <span className="text-sm font-bold text-gray-600 dark:text-gray-400">[{id}</span>
                                    </div>
                                    {selectedOS === os.type && (
                                        <div className="absolute top-4 right-4">
                                            <Check className="w-5 h-5 text-green-500 font-bold" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
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
                                        <span className="text-[11px] font-medium text-gray-700">
                                            {selectedOS ? t(`vdi.form.${selectedOS}`).split(' [')[0] : '-'}
                                        </span>
                                    </td>
                                    <td className="border border-gray-200 dark:border-dark-800 p-2 text-center">
                                        <span className="text-blue-600 font-bold">
                                            {selectedOS ? t(`vdi.form.${selectedOS}`).split(' [')[0] : '-'}
                                        </span>
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
