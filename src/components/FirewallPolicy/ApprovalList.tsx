import { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { FirewallRequest } from '../../types/firewall';
import { getFirewallRequests, getCurrentUser } from '../../data/firewallMockData';
import { RequestDetailModal } from './RequestDetailModal';

interface ApprovalListProps {
    searchQuery: string;
    userRole: string;
}

export const ApprovalList = ({ searchQuery, userRole }: ApprovalListProps) => {
    const [requests, setRequests] = useState<FirewallRequest[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<FirewallRequest | null>(null);
    const currentUser = getCurrentUser();

    useEffect(() => {
        loadPendingApprovals();
    }, [searchQuery]);

    const loadPendingApprovals = () => {
        let allRequests = getFirewallRequests();

        // 현재 사용자가 승인해야 하는 요청만 필터링
        allRequests = allRequests.filter(r => {
            // L1 승인자인 경우
            if (r.l1ApproverId === currentUser.id && r.status === 'PENDING_L1') {
                return true;
            }
            // L2 승인자인 경우
            if (r.l2ApproverId === currentUser.id && (r.status === 'APPROVED_L1' || r.status === 'PENDING_L2')) {
                return true;
            }
            // 보안관리자인 경우
            if (currentUser.role === 'security_manager' && (r.status === 'APPROVED_L2' || r.status === 'PENDING_SECURITY')) {
                return true;
            }
            return false;
        });

        // 검색어 필터링
        if (searchQuery) {
            allRequests = allRequests.filter(r =>
                r.requestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.applicationName.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // 최신순 정렬
        allRequests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setRequests(allRequests);
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

    const getApprovalLevel = (request: FirewallRequest) => {
        if (request.l1ApproverId === currentUser.id && request.status === 'PENDING_L1') {
            return '1단계 승인';
        }
        if (request.l2ApproverId === currentUser.id && (request.status === 'APPROVED_L1' || request.status === 'PENDING_L2')) {
            return '2단계 승인';
        }
        if (currentUser.role === 'security_manager') {
            return '최종 승인';
        }
        return '';
    };

    if (requests.length === 0) {
        return (
            <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">승인 대기 중인 요청이 없습니다.</p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-3">
                {requests.map((request) => (
                    <div
                        key={request.requestId}
                        className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg p-4 hover:border-enterprise-500 transition-colors"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="font-mono text-sm font-semibold text-enterprise-600 dark:text-enterprise-400">
                                        {request.requestId}
                                    </span>
                                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                                        <Clock className="w-3 h-3" />
                                        {getApprovalLevel(request)} 필요
                                    </span>
                                </div>
                                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                    {request.applicationName} - {request.changeType}
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {request.currentAction && `${request.currentAction} → `}{request.requestedAction}
                                    {' | '}
                                    {request.requestedDestination}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedRequest(request)}
                                className="px-4 py-2 text-sm bg-enterprise-500 text-white rounded-lg hover:bg-enterprise-600 transition-colors"
                            >
                                검토 및 승인
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-200 dark:border-dark-700">
                            <div>
                                <span className="font-medium">요청자:</span> {request.requesterName} ({request.requesterDept})
                            </div>
                            <div>
                                <span className="font-medium">요청일:</span> {formatDate(request.createdAt)}
                            </div>
                            <div>
                                <span className="font-medium">영향 범위:</span> {request.impactScope}
                            </div>
                        </div>

                        {/* 비즈니스 정당성 미리보기 */}
                        <div className="mt-3 p-3 bg-gray-50 dark:bg-dark-900 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                                <span className="font-medium">사유:</span> {request.businessJustification}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {selectedRequest && (
                <RequestDetailModal
                    request={selectedRequest}
                    onClose={() => setSelectedRequest(null)}
                    onUpdate={loadPendingApprovals}
                    isApprovalMode={true}
                />
            )}
        </>
    );
};
