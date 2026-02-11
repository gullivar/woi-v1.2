import { useState } from 'react';
import { X, CheckCircle2, XCircle, Clock, User, Calendar, FileText, Shield, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { FirewallRequest, RequestStatus } from '../../types/firewall';
import { getCurrentUser, saveFirewallRequest } from '../../data/firewallMockData';

interface RequestDetailModalProps {
    request: FirewallRequest;
    onClose: () => void;
    onUpdate: () => void;
    isApprovalMode?: boolean;
}

export const RequestDetailModal = ({ request, onClose, onUpdate, isApprovalMode = false }: RequestDetailModalProps) => {
    const currentUser = getCurrentUser();
    const [comment, setComment] = useState('');
    const [processing, setProcessing] = useState(false);

    const canApprove = () => {
        if (request.status === 'PENDING_L1' && request.l1ApproverId === currentUser.id) return true;
        if ((request.status === 'APPROVED_L1' || request.status === 'PENDING_L2') && request.l2ApproverId === currentUser.id) return true;
        if ((request.status === 'APPROVED_L2' || request.status === 'PENDING_SECURITY') && currentUser.role === 'security_manager') return true;
        return false;
    };

    const handleApprove = () => {
        if (!canApprove()) return;

        setProcessing(true);
        const updatedRequest = { ...request };
        const now = new Date().toISOString();

        if (request.status === 'PENDING_L1') {
            updatedRequest.status = 'APPROVED_L1';
            updatedRequest.l1ApprovedAt = now;
            updatedRequest.l1ApprovalComment = comment;
        } else if (request.status === 'APPROVED_L1' || request.status === 'PENDING_L2') {
            updatedRequest.status = 'APPROVED_L2';
            updatedRequest.l2ApprovedAt = now;
            updatedRequest.l2ApprovalComment = comment;
        } else if (request.status === 'APPROVED_L2' || request.status === 'PENDING_SECURITY') {
            updatedRequest.status = 'APPLIED';
            updatedRequest.securityApprovedAt = now;
            updatedRequest.securityApprovalComment = comment || 'Workspace ONE UEM에 정책이 적용되었습니다.';
            updatedRequest.appliedAt = now;
            updatedRequest.appliedBy = currentUser.id;
        }

        updatedRequest.updatedAt = now;
        saveFirewallRequest(updatedRequest);

        setTimeout(() => {
            setProcessing(false);
            onUpdate();
            onClose();
        }, 500);
    };

    const handleReject = () => {
        if (!canApprove()) return;

        if (!comment.trim()) {
            alert('반려 사유를 입력해주세요.');
            return;
        }

        setProcessing(true);
        const updatedRequest = { ...request };
        const now = new Date().toISOString();

        if (request.status === 'PENDING_L1') {
            updatedRequest.status = 'REJECTED_L1';
            updatedRequest.l1RejectionReason = comment;
        } else if (request.status === 'APPROVED_L1' || request.status === 'PENDING_L2') {
            updatedRequest.status = 'REJECTED_L2';
            updatedRequest.l2RejectionReason = comment;
        } else if (request.status === 'APPROVED_L2' || request.status === 'PENDING_SECURITY') {
            updatedRequest.status = 'REJECTED_FINAL';
            updatedRequest.securityRejectionReason = comment;
        }

        updatedRequest.updatedAt = now;
        saveFirewallRequest(updatedRequest);

        setTimeout(() => {
            setProcessing(false);
            onUpdate();
            onClose();
        }, 500);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status: RequestStatus) => {
        const statusConfig: Record<RequestStatus, { label: string; color: string }> = {
            'PENDING_L1': { label: '1단계 승인 대기', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
            'APPROVED_L1': { label: '1단계 승인됨', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
            'REJECTED_L1': { label: '1단계 반려됨', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
            'PENDING_L2': { label: '2단계 승인 대기', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
            'APPROVED_L2': { label: '2단계 승인됨', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
            'REJECTED_L2': { label: '2단계 반려됨', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
            'PENDING_SECURITY': { label: '보안팀 승인 대기', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
            'APPLIED': { label: '정책 적용 완료', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
            'REJECTED_FINAL': { label: '최종 반려됨', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' }
        };

        const config = statusConfig[status];
        return (
            <span className={cn('inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full', config.color)}>
                {config.label}
            </span>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-dark-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-800">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                            요청 상세 정보
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {request.requestId}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] space-y-6">
                    {/* 상태 */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">현재 상태</h3>
                        {getStatusBadge(request.status)}
                    </div>

                    {/* 요청자 정보 */}
                    <div className="bg-gray-50 dark:bg-dark-800 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            요청자 정보
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="text-gray-500 dark:text-gray-400">이름:</span>
                                <span className="ml-2 text-gray-900 dark:text-gray-100">{request.requesterName}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 dark:text-gray-400">부서:</span>
                                <span className="ml-2 text-gray-900 dark:text-gray-100">{request.requesterDept}</span>
                            </div>
                            <div className="col-span-2">
                                <span className="text-gray-500 dark:text-gray-400">이메일:</span>
                                <span className="ml-2 text-gray-900 dark:text-gray-100">{request.requesterEmail}</span>
                            </div>
                        </div>
                    </div>

                    {/* 정책 변경 내용 */}
                    <div className="bg-gray-50 dark:bg-dark-800 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            정책 변경 내용
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <span className="text-gray-500 dark:text-gray-400">Traffic Rule:</span>
                                    <span className="ml-2 text-gray-900 dark:text-gray-100">{request.trafficRuleName}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 dark:text-gray-400">변경 유형:</span>
                                    <span className="ml-2 text-gray-900 dark:text-gray-100">{request.changeType}</span>
                                </div>
                            </div>
                            <div>
                                <span className="text-gray-500 dark:text-gray-400">애플리케이션:</span>
                                <span className="ml-2 text-gray-900 dark:text-gray-100 font-medium">{request.applicationName}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {request.currentAction && (
                                    <div>
                                        <span className="text-gray-500 dark:text-gray-400">현재 Action:</span>
                                        <span className="ml-2 text-gray-900 dark:text-gray-100">{request.currentAction}</span>
                                    </div>
                                )}
                                <div>
                                    <span className="text-gray-500 dark:text-gray-400">요청 Action:</span>
                                    <span className="ml-2 text-enterprise-600 dark:text-enterprise-400 font-medium">{request.requestedAction}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {request.currentDestination && (
                                    <div>
                                        <span className="text-gray-500 dark:text-gray-400">현재 Destination:</span>
                                        <span className="ml-2 text-gray-900 dark:text-gray-100 font-mono text-xs">{request.currentDestination}</span>
                                    </div>
                                )}
                                <div>
                                    <span className="text-gray-500 dark:text-gray-400">요청 Destination:</span>
                                    <span className="ml-2 text-enterprise-600 dark:text-enterprise-400 font-mono text-xs">{request.requestedDestination}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 유효 기간 */}
                    <div className="bg-gray-50 dark:bg-dark-800 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            유효 기간
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="text-gray-500 dark:text-gray-400">시작일:</span>
                                <span className="ml-2 text-gray-900 dark:text-gray-100">{new Date(request.validFrom).toLocaleDateString('ko-KR')}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 dark:text-gray-400">종료일:</span>
                                <span className="ml-2 text-gray-900 dark:text-gray-100">
                                    {request.validUntil ? new Date(request.validUntil).toLocaleDateString('ko-KR') : '영구'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 요청 사유 */}
                    <div className="bg-gray-50 dark:bg-dark-800 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            요청 사유
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="text-gray-500 dark:text-gray-400">영향 범위:</span>
                                <span className="ml-2 text-gray-900 dark:text-gray-100">{request.impactScope}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 dark:text-gray-400 block mb-1">비즈니스 정당성:</span>
                                <p className="text-gray-900 dark:text-gray-100 bg-white dark:bg-dark-900 p-3 rounded border border-gray-200 dark:border-dark-700">
                                    {request.businessJustification}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 승인 이력 */}
                    <div className="bg-gray-50 dark:bg-dark-800 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">승인 이력</h3>
                        <div className="space-y-3">
                            {/* L1 승인 */}
                            <div className="flex items-start gap-3">
                                <div className={cn(
                                    'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                                    request.l1ApprovedAt ? 'bg-green-100 dark:bg-green-900/30' :
                                        request.l1RejectionReason ? 'bg-red-100 dark:bg-red-900/30' :
                                            'bg-gray-100 dark:bg-gray-800'
                                )}>
                                    {request.l1ApprovedAt ? (
                                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    ) : request.l1RejectionReason ? (
                                        <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                                    ) : (
                                        <Clock className="w-4 h-4 text-gray-400" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        1단계 승인 - {request.l1ApproverName}
                                    </div>
                                    {request.l1ApprovedAt && (
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            승인: {formatDate(request.l1ApprovedAt)}
                                            {request.l1ApprovalComment && (
                                                <p className="mt-1 text-gray-600 dark:text-gray-300">"{request.l1ApprovalComment}"</p>
                                            )}
                                        </div>
                                    )}
                                    {request.l1RejectionReason && (
                                        <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                                            반려: {request.l1RejectionReason}
                                        </div>
                                    )}
                                    {!request.l1ApprovedAt && !request.l1RejectionReason && (
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">대기 중</div>
                                    )}
                                </div>
                            </div>

                            {/* L2 승인 */}
                            <div className="flex items-start gap-3">
                                <div className={cn(
                                    'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                                    request.l2ApprovedAt ? 'bg-green-100 dark:bg-green-900/30' :
                                        request.l2RejectionReason ? 'bg-red-100 dark:bg-red-900/30' :
                                            'bg-gray-100 dark:bg-gray-800'
                                )}>
                                    {request.l2ApprovedAt ? (
                                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    ) : request.l2RejectionReason ? (
                                        <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                                    ) : (
                                        <Clock className="w-4 h-4 text-gray-400" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        2단계 승인 - {request.l2ApproverName}
                                    </div>
                                    {request.l2ApprovedAt && (
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            승인: {formatDate(request.l2ApprovedAt)}
                                            {request.l2ApprovalComment && (
                                                <p className="mt-1 text-gray-600 dark:text-gray-300">"{request.l2ApprovalComment}"</p>
                                            )}
                                        </div>
                                    )}
                                    {request.l2RejectionReason && (
                                        <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                                            반려: {request.l2RejectionReason}
                                        </div>
                                    )}
                                    {!request.l2ApprovedAt && !request.l2RejectionReason && (
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">대기 중</div>
                                    )}
                                </div>
                            </div>

                            {/* 보안팀 승인 */}
                            <div className="flex items-start gap-3">
                                <div className={cn(
                                    'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                                    request.securityApprovedAt ? 'bg-green-100 dark:bg-green-900/30' :
                                        request.securityRejectionReason ? 'bg-red-100 dark:bg-red-900/30' :
                                            'bg-gray-100 dark:bg-gray-800'
                                )}>
                                    {request.securityApprovedAt ? (
                                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    ) : request.securityRejectionReason ? (
                                        <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                                    ) : (
                                        <Clock className="w-4 h-4 text-gray-400" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        보안팀 최종 승인
                                    </div>
                                    {request.securityApprovedAt && (
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            적용 완료: {formatDate(request.securityApprovedAt)}
                                            {request.securityApprovalComment && (
                                                <p className="mt-1 text-gray-600 dark:text-gray-300">"{request.securityApprovalComment}"</p>
                                            )}
                                        </div>
                                    )}
                                    {request.securityRejectionReason && (
                                        <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                                            반려: {request.securityRejectionReason}
                                        </div>
                                    )}
                                    {!request.securityApprovedAt && !request.securityRejectionReason && (
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">대기 중</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 승인/반려 액션 */}
                    {isApprovalMode && canApprove() && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                승인 처리
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        코멘트 (선택사항, 반려 시 필수)
                                    </label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="승인 또는 반려 사유를 입력하세요..."
                                        rows={3}
                                        className="w-full px-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-enterprise-500"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleApprove}
                                        disabled={processing}
                                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        승인
                                    </button>
                                    <button
                                        onClick={handleReject}
                                        disabled={processing}
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        반려
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-dark-800">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 dark:border-dark-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};
