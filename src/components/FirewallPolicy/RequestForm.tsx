import { useState, useEffect } from 'react';
import { Calendar, User, Building2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { ChangeType, ActionType, ImpactScope, FirewallRequest } from '../../types/firewall';
import {
    getCurrentUser,
    mockOrgUsers,
    getDirectManager,
    getSecondLevelManager,
    saveFirewallRequest,
    getFirewallRequests
} from '../../data/firewallMockData';
import { OrgChartPicker } from './OrgChartPicker';

export const RequestForm = () => {
    const currentUser = getCurrentUser();
    const directManager = getDirectManager(currentUser.id);
    const secondLevelManager = getSecondLevelManager(currentUser.id);

    const [formData, setFormData] = useState({
        trafficRuleName: 'Default',
        changeType: 'MODIFY_ACTION' as ChangeType,
        applicationName: '',
        currentAction: 'BLOCK' as ActionType,
        requestedAction: 'BYPASS' as ActionType,
        currentDestination: '',
        requestedDestination: '',
        validFrom: '',
        validUntil: '',
        businessJustification: '',
        impactScope: 'PERSONAL' as ImpactScope,
        l1ApproverId: directManager?.id || '',
        l2ApproverId: secondLevelManager?.id || ''
    });

    const [showOrgChart, setShowOrgChart] = useState(false);
    const [selectingApprover, setSelectingApprover] = useState<'l1' | 'l2' | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    useEffect(() => {
        // 오늘 날짜를 기본값으로 설정
        const today = new Date().toISOString().split('T')[0];
        setFormData(prev => ({ ...prev, validFrom: today }));
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const l1Approver = mockOrgUsers.find(u => u.id === formData.l1ApproverId);
        const l2Approver = mockOrgUsers.find(u => u.id === formData.l2ApproverId);

        if (!l1Approver || !l2Approver) {
            alert('승인자를 선택해주세요.');
            return;
        }

        const requests = getFirewallRequests();
        const newRequestId = `FW-2026-${String(requests.length + 1).padStart(3, '0')}`;

        const newRequest: FirewallRequest = {
            requestId: newRequestId,
            requesterId: currentUser.id,
            requesterName: currentUser.name,
            requesterDept: currentUser.department,
            requesterEmail: currentUser.email,

            trafficRuleName: formData.trafficRuleName,
            changeType: formData.changeType,
            applicationName: formData.applicationName,
            currentAction: formData.changeType !== 'NEW_RULE' ? formData.currentAction : undefined,
            requestedAction: formData.requestedAction,
            currentDestination: formData.changeType !== 'NEW_RULE' ? formData.currentDestination : undefined,
            requestedDestination: formData.requestedDestination,

            validFrom: new Date(formData.validFrom).toISOString(),
            validUntil: formData.validUntil ? new Date(formData.validUntil).toISOString() : undefined,

            businessJustification: formData.businessJustification,
            impactScope: formData.impactScope,

            l1ApproverId: l1Approver.id,
            l1ApproverName: l1Approver.name,
            l1ApproverEmail: l1Approver.email,
            l2ApproverId: l2Approver.id,
            l2ApproverName: l2Approver.name,
            l2ApproverEmail: l2Approver.email,

            status: 'PENDING_L1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        saveFirewallRequest(newRequest);
        setSubmitSuccess(true);

        // 3초 후 폼 초기화
        setTimeout(() => {
            setSubmitSuccess(false);
            setFormData({
                trafficRuleName: 'Default',
                changeType: 'MODIFY_ACTION',
                applicationName: '',
                currentAction: 'BLOCK',
                requestedAction: 'BYPASS',
                currentDestination: '',
                requestedDestination: '',
                validFrom: new Date().toISOString().split('T')[0],
                validUntil: '',
                businessJustification: '',
                impactScope: 'PERSONAL',
                l1ApproverId: directManager?.id || '',
                l2ApproverId: secondLevelManager?.id || ''
            });
        }, 3000);
    };

    const handleApproverSelect = (userId: string) => {
        if (selectingApprover === 'l1') {
            setFormData(prev => ({ ...prev, l1ApproverId: userId }));
        } else if (selectingApprover === 'l2') {
            setFormData(prev => ({ ...prev, l2ApproverId: userId }));
        }
        setShowOrgChart(false);
        setSelectingApprover(null);
    };

    const l1Approver = mockOrgUsers.find(u => u.id === formData.l1ApproverId);
    const l2Approver = mockOrgUsers.find(u => u.id === formData.l2ApproverId);

    if (submitSuccess) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    요청이 성공적으로 제출되었습니다
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    1단계 승인자에게 알림이 전송되었습니다.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
            {/* 요청자 정보 */}
            <div className="bg-gray-50 dark:bg-dark-800 rounded-lg p-4 border border-gray-200 dark:border-dark-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">요청자 정보</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-gray-500 dark:text-gray-400">이름:</span>
                        <span className="ml-2 text-gray-900 dark:text-gray-100">{currentUser.name}</span>
                    </div>
                    <div>
                        <span className="text-gray-500 dark:text-gray-400">부서:</span>
                        <span className="ml-2 text-gray-900 dark:text-gray-100">{currentUser.department}</span>
                    </div>
                    <div>
                        <span className="text-gray-500 dark:text-gray-400">직급:</span>
                        <span className="ml-2 text-gray-900 dark:text-gray-100">{currentUser.position}</span>
                    </div>
                    <div>
                        <span className="text-gray-500 dark:text-gray-400">이메일:</span>
                        <span className="ml-2 text-gray-900 dark:text-gray-100">{currentUser.email}</span>
                    </div>
                </div>
            </div>

            {/* 정책 정보 */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">정책 정보</h3>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Traffic Rule 이름
                        </label>
                        <select
                            value={formData.trafficRuleName}
                            onChange={(e) => setFormData(prev => ({ ...prev, trafficRuleName: e.target.value }))}
                            className="w-full px-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-enterprise-500"
                            required
                        >
                            <option value="Default">Default</option>
                            <option value="white vpn test">white vpn test</option>
                            <option value="0228 test">0228 test</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            변경 유형
                        </label>
                        <select
                            value={formData.changeType}
                            onChange={(e) => setFormData(prev => ({ ...prev, changeType: e.target.value as ChangeType }))}
                            className="w-full px-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-enterprise-500"
                            required
                        >
                            <option value="NEW_RULE">새 규칙 추가</option>
                            <option value="MODIFY_RULE">규칙 수정</option>
                            <option value="DELETE_RULE">규칙 삭제</option>
                            <option value="MODIFY_ACTION">Action 변경</option>
                            <option value="MODIFY_DESTINATION">Destination 변경</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        애플리케이션 이름 *
                    </label>
                    <input
                        type="text"
                        value={formData.applicationName}
                        onChange={(e) => setFormData(prev => ({ ...prev, applicationName: e.target.value }))}
                        placeholder="예: Chrome, Slack, GitHub Desktop"
                        className="w-full px-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-enterprise-500"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {formData.changeType !== 'NEW_RULE' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                현재 Action
                            </label>
                            <select
                                value={formData.currentAction}
                                onChange={(e) => setFormData(prev => ({ ...prev, currentAction: e.target.value as ActionType }))}
                                className="w-full px-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-enterprise-500"
                            >
                                <option value="TUNNEL">Tunnel</option>
                                <option value="BYPASS">Bypass</option>
                                <option value="BLOCK">Block</option>
                                <option value="PROXY">Proxy</option>
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            요청 Action *
                        </label>
                        <select
                            value={formData.requestedAction}
                            onChange={(e) => setFormData(prev => ({ ...prev, requestedAction: e.target.value as ActionType }))}
                            className="w-full px-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-enterprise-500"
                            required
                        >
                            <option value="TUNNEL">Tunnel</option>
                            <option value="BYPASS">Bypass</option>
                            <option value="BLOCK">Block</option>
                            <option value="PROXY">Proxy</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {formData.changeType !== 'NEW_RULE' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                현재 Destination
                            </label>
                            <input
                                type="text"
                                value={formData.currentDestination}
                                onChange={(e) => setFormData(prev => ({ ...prev, currentDestination: e.target.value }))}
                                placeholder="예: *.company.com"
                                className="w-full px-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-enterprise-500"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            요청 Destination *
                        </label>
                        <input
                            type="text"
                            value={formData.requestedDestination}
                            onChange={(e) => setFormData(prev => ({ ...prev, requestedDestination: e.target.value }))}
                            placeholder="예: slack.com, *.github.com"
                            className="w-full px-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-enterprise-500"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* 유효 기간 */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">유효 기간</h3>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            시작일 *
                        </label>
                        <input
                            type="date"
                            value={formData.validFrom}
                            onChange={(e) => setFormData(prev => ({ ...prev, validFrom: e.target.value }))}
                            className="w-full px-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-enterprise-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            종료일 (선택사항 - 비워두면 영구)
                        </label>
                        <input
                            type="date"
                            value={formData.validUntil}
                            onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
                            className="w-full px-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-enterprise-500"
                        />
                    </div>
                </div>
            </div>

            {/* 요청 사유 */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">요청 사유</h3>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        비즈니스 정당성 *
                    </label>
                    <textarea
                        value={formData.businessJustification}
                        onChange={(e) => setFormData(prev => ({ ...prev, businessJustification: e.target.value }))}
                        placeholder="정책 변경이 필요한 구체적인 사유를 입력해주세요..."
                        rows={4}
                        className="w-full px-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-enterprise-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        영향 범위 *
                    </label>
                    <select
                        value={formData.impactScope}
                        onChange={(e) => setFormData(prev => ({ ...prev, impactScope: e.target.value as ImpactScope }))}
                        className="w-full px-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-enterprise-500"
                        required
                    >
                        <option value="PERSONAL">개인</option>
                        <option value="TEAM">팀</option>
                        <option value="DEPARTMENT">부서</option>
                        <option value="ORGANIZATION">전사</option>
                    </select>
                </div>
            </div>

            {/* 승인자 선택 */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">승인자 선택</h3>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            1단계 승인자 (팀장) *
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={l1Approver ? `${l1Approver.name} (${l1Approver.position})` : ''}
                                readOnly
                                className="flex-1 px-3 py-2 bg-gray-50 dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-sm"
                                placeholder="승인자를 선택하세요"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectingApprover('l1');
                                    setShowOrgChart(true);
                                }}
                                className="px-4 py-2 bg-enterprise-500 text-white rounded-lg text-sm hover:bg-enterprise-600 transition-colors"
                            >
                                선택
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            2단계 승인자 (부서장) *
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={l2Approver ? `${l2Approver.name} (${l2Approver.position})` : ''}
                                readOnly
                                className="flex-1 px-3 py-2 bg-gray-50 dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-sm"
                                placeholder="승인자를 선택하세요"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectingApprover('l2');
                                    setShowOrgChart(true);
                                }}
                                className="px-4 py-2 bg-enterprise-500 text-white rounded-lg text-sm hover:bg-enterprise-600 transition-colors"
                            >
                                선택
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <div className="flex gap-2">
                        <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                            추천 승인자: 1단계 - {directManager?.name || '없음'}, 2단계 - {secondLevelManager?.name || '없음'}
                        </p>
                    </div>
                </div>
            </div>

            {/* 제출 버튼 */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-dark-700">
                <button
                    type="button"
                    onClick={() => {
                        setFormData({
                            trafficRuleName: 'Default',
                            changeType: 'MODIFY_ACTION',
                            applicationName: '',
                            currentAction: 'BLOCK',
                            requestedAction: 'BYPASS',
                            currentDestination: '',
                            requestedDestination: '',
                            validFrom: new Date().toISOString().split('T')[0],
                            validUntil: '',
                            businessJustification: '',
                            impactScope: 'PERSONAL',
                            l1ApproverId: directManager?.id || '',
                            l2ApproverId: secondLevelManager?.id || ''
                        });
                    }}
                    className="px-6 py-2 border border-gray-300 dark:border-dark-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
                >
                    초기화
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 bg-enterprise-500 text-white rounded-lg text-sm hover:bg-enterprise-600 transition-colors"
                >
                    요청 제출
                </button>
            </div>

            {/* 조직도 선택 모달 */}
            {showOrgChart && (
                <OrgChartPicker
                    onSelect={handleApproverSelect}
                    onClose={() => {
                        setShowOrgChart(false);
                        setSelectingApprover(null);
                    }}
                    currentUserId={currentUser.id}
                />
            )}
        </form>
    );
};
