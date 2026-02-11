import { X, Users } from 'lucide-react';
import { mockOrgUsers } from '../../data/firewallMockData';
import type { OrgUser } from '../../data/firewallMockData';
import { cn } from '../../lib/utils';

interface OrgChartPickerProps {
    onSelect: (userId: string) => void;
    onClose: () => void;
    currentUserId: string;
}

export const OrgChartPicker = ({ onSelect, onClose, currentUserId }: OrgChartPickerProps) => {
    // 부서별로 그룹화
    const departments = Array.from(new Set(mockOrgUsers.map(u => u.department)));

    const getUsersByDepartment = (dept: string) => {
        return mockOrgUsers.filter(u => u.department === dept && u.id !== currentUserId);
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'security_manager':
                return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            case 'l2_approver':
                return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
            case 'l1_approver':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'security_manager':
                return '보안관리자';
            case 'l2_approver':
                return '2단계 승인자';
            case 'l1_approver':
                return '1단계 승인자';
            default:
                return '일반 사용자';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-dark-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-800">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-enterprise-500" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            조직도에서 승인자 선택
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
                    <div className="space-y-6">
                        {departments.map((dept) => {
                            const users = getUsersByDepartment(dept);
                            if (users.length === 0) return null;

                            return (
                                <div key={dept}>
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                        {dept}
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {users.map((user) => (
                                            <button
                                                key={user.id}
                                                onClick={() => onSelect(user.id)}
                                                className={cn(
                                                    'p-4 border rounded-lg text-left transition-all',
                                                    'hover:border-enterprise-500 hover:bg-enterprise-50 dark:hover:bg-enterprise-900/10',
                                                    'border-gray-200 dark:border-dark-700'
                                                )}
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <div className="font-medium text-gray-900 dark:text-gray-100">
                                                            {user.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {user.position}
                                                        </div>
                                                    </div>
                                                    <span className={cn(
                                                        'px-2 py-1 text-xs rounded-full',
                                                        getRoleBadgeColor(user.role)
                                                    )}>
                                                        {getRoleLabel(user.role)}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {user.email}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
