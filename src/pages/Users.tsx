import { useState } from 'react';
import { Search, Filter, Download, Eye, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';

type FilterType = 'all' | 'high' | 'medium' | 'low';

export const Users = () => {
    const { users } = useData();
    const [searchQuery, setSearchQuery] = useState('');
    const [riskFilter, setRiskFilter] = useState<FilterType>('all');

    // Filter users based on search and risk level
    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.department.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRisk =
            riskFilter === 'all' ||
            (riskFilter === 'high' && user.riskScore >= 70) ||
            (riskFilter === 'medium' && user.riskScore >= 40 && user.riskScore < 70) ||
            (riskFilter === 'low' && user.riskScore < 40);

        return matchesSearch && matchesRisk;
    });

    const getRiskBadge = (score: number) => {
        if (score >= 70) {
            return <span className="px-2 py-1 text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">High</span>;
        } else if (score >= 40) {
            return <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded">Medium</span>;
        } else {
            return <span className="px-2 py-1 text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">Low</span>;
        }
    };

    const exportToCSV = () => {
        const headers = ['Name', 'Email', 'Department', 'Risk Score', 'Device', 'Last Seen'];
        const rows = filteredUsers.map(user => [
            user.name,
            user.email,
            user.department,
            user.riskScore.toString(),
            user.deviceInfo.model,
            user.deviceInfo.lastSeen
        ]);

        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">위험 사용자 관리</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Monitor and manage user risk profiles</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-dark-900 rounded-lg border border-gray-200 dark:border-dark-800 p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Users</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{users.length}</div>
                </div>
                <div className="bg-white dark:bg-dark-900 rounded-lg border border-gray-200 dark:border-dark-800 p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">High Risk</div>
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {users.filter(u => u.riskScore >= 70).length}
                    </div>
                </div>
                <div className="bg-white dark:bg-dark-900 rounded-lg border border-gray-200 dark:border-dark-800 p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Medium Risk</div>
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {users.filter(u => u.riskScore >= 40 && u.riskScore < 70).length}
                    </div>
                </div>
                <div className="bg-white dark:bg-dark-900 rounded-lg border border-gray-200 dark:border-dark-800 p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Low Risk</div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {users.filter(u => u.riskScore < 40).length}
                    </div>
                </div>
            </div>

            {/* Filters and Actions */}
            <div className="bg-white dark:bg-dark-900 rounded-lg border border-gray-200 dark:border-dark-800 mb-6">
                <div className="p-4 border-b border-gray-200 dark:border-dark-800">
                    <div className="flex items-center justify-between gap-4">
                        {/* Search */}
                        <div className="flex-1 max-w-md relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search users by name, email, or department..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-enterprise-500 focus:border-transparent"
                            />
                        </div>

                        {/* Risk Filter */}
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-500" />
                            <select
                                value={riskFilter}
                                onChange={(e) => setRiskFilter(e.target.value as FilterType)}
                                className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-enterprise-500 focus:border-transparent"
                            >
                                <option value="all">All Risk Levels</option>
                                <option value="high">High Risk</option>
                                <option value="medium">Medium Risk</option>
                                <option value="low">Low Risk</option>
                            </select>
                        </div>

                        {/* Export Button */}
                        <button
                            onClick={exportToCSV}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Results Count */}
                <div className="px-4 py-2 bg-gray-50 dark:bg-dark-800/50 border-b border-gray-200 dark:border-dark-800">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Showing <span className="font-semibold text-gray-900 dark:text-gray-100">{filteredUsers.length}</span> of{' '}
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{users.length}</span> users
                    </p>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-dark-800">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                    Department
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                    Risk Score
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                    Device
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                    Last Seen
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                    Alerts
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-dark-800">
                            {filteredUsers.map((user) => (
                                <motion.tr
                                    key={user.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors"
                                >
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-enterprise-400 to-enterprise-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                {user.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-gray-100">{user.name}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="text-sm text-gray-900 dark:text-gray-100">{user.department}</span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user.riskScore}</span>
                                            {getRiskBadge(user.riskScore)}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="text-sm text-gray-900 dark:text-gray-100">{user.deviceInfo.model}</span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">{new Date(user.deviceInfo.lastSeen).toLocaleString()}</span>
                                    </td>
                                    <td className="px-4 py-4">
                                        {user.alerts.length > 0 ? (
                                            <div className="flex items-center gap-1 text-sm">
                                                <AlertCircle className="w-4 h-4 text-red-500" />
                                                <span className="font-semibold text-red-600 dark:text-red-400">{user.alerts.length}</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-400">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <Link
                                            to={`/users/${user.id}`}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-enterprise-600 dark:text-enterprise-400 hover:bg-enterprise-500/10 rounded-lg transition-colors"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View Details
                                        </Link>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {filteredUsers.length === 0 && (
                    <div className="p-12 text-center">
                        <div className="text-gray-400 mb-2">
                            <Search className="w-12 h-12 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No users found</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Try adjusting your search or filter criteria
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
