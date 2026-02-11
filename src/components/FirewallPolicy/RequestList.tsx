import { useState, useEffect } from 'react';
import { Clock, CheckCircle2, XCircle, Eye } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { FirewallRequest, RequestStatus } from '../../types/firewall';
import { getFirewallRequests, getCurrentUser } from '../../data/firewallMockData';
import { RequestDetailModal } from './RequestDetailModal';

interface RequestListProps {
    searchQuery: string;
    statusFilter: string;
    viewType: 'my-requests' | 'all-requests';
}

export const RequestList = ({ searchQuery, statusFilter, viewType }: RequestListProps) => {
    const [requests, setRequests] = useState<FirewallRequest[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<FirewallRequest | null>(null);
    const currentUser = getCurrentUser();

    useEffect(() => {
        loadRequests();
    }, [searchQuery, statusFilter, viewType]);

    const loadRequests = () => {
        let allRequests = getFirewallRequests();

        // 뷰 타입에 따라 필터링
        if (viewType === 'my-requests') {
            allRequests = allRequests.filter(r => r.requesterId === currentUser.id);
        }

        // 검색어 필터링
        if (searchQuery) {
            allRequests = allRequests.filter(r =>
                r.requestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.applicationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.requesterName.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // 상태 필터링
        if (statusFilter !== 'all') {
            if (statusFilter === 'REJECTED') {
                allRequests = allRequests.filter(r =>
                    r.status === 'REJECTED_L1' || r.status === 'REJECTED_L2' || r.status === 'REJECTED_FINAL'
                );
            } else {
                allRequests = allRequests.filter(r => r.status === statusFilter);
            }
        }

        // 최신순 정렬
        allRequests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setRequests(allRequests);
    };

    const getStatusBadge = (status: RequestStatus) => {
        const statusConfig: Record<RequestStatus, { label: string; color: string; icon: any }> = {
            'PENDING_L1': { label: '1단계 대기', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
            'APPROVED_L1': { label: '1단계 승인', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: CheckCircle2 },
            'REJECTED_L1': { label: '1단계 반려', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: XCircle },
            'PENDING_L2': { label: '2단계 대기', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
            'APPROVED_L2': { label: '2단계 승인', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: CheckCircle2 },
            'REJECTED_L2': { label: '2단계 반려', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: XCircle },
            'PENDING_SECURITY': { label: '보안팀 대기', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: Clock },
            'APPLIED': { label: '적용 완료', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle2 },
            'REJECTED_FINAL': { label: '최종 반려', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: XCircle }
        };

        const config = statusConfig[status];
        const Icon = config.icon;

        return (
            <span className={cn('inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full', config.color)}>
                <Icon className="w-3 h-3" />
                {config.label}
            </span>
        );
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

    if (requests.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">요청이 없습니다.</p>
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
                                    {getStatusBadge(request.status)}
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
                                className="px-3 py-1.5 text-sm bg-enterprise-500 text-white rounded-lg hover:bg-enterprise-600 transition-colors flex items-center gap-1"
                            >
                                <Eye className="w-4 h-4" />
                                상세보기
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
                                <span className="font-medium">유효기간:</span> {new Date(request.validFrom).toLocaleDateString('ko-KR')}
                                {request.validUntil && ` ~ ${new Date(request.validUntil).toLocaleDateString('ko-KR')}`}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedRequest && (
                <RequestDetailModal
                    request={selectedRequest}
                    onClose={() => setSelectedRequest(null)}
                    onUpdate={loadRequests}
                />
            )}
        </>
    );
};
