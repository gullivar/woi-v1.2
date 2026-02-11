import { useState } from 'react';
import { Search, X, User, FileCode, AlertTriangle, Workflow } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';

interface SearchBarProps {
    onClose?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onClose }) => {
    const { users, rules } = useData();
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => {
        setQuery('');
        setIsOpen(false);
        onClose?.();
    };

    // Search across users and rules
    const searchResults = query.length >= 2 ? {
        users: users.filter(user =>
            user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase()) ||
            user.department.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5),
        rules: rules.filter(rule =>
            rule.nameKo.toLowerCase().includes(query.toLowerCase()) ||
            rule.nameEn.toLowerCase().includes(query.toLowerCase()) ||
            rule.description.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5),
    } : { users: [], rules: [] };

    const totalResults = searchResults.users.length + searchResults.rules.length;

    return (
        <div className="relative">
            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search users, rules, alerts..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(e.target.value.length >= 2);
                    }}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                    className="w-64 pl-10 pr-10 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-enterprise-500 focus:border-transparent text-sm"
                />
                {query && (
                    <button
                        onClick={handleClose}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Search Results Dropdown */}
            <AnimatePresence>
                {isOpen && query.length >= 2 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full mt-2 w-96 bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-lg shadow-lg overflow-hidden z-50"
                    >
                        {totalResults === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                No results found for "{query}"
                            </div>
                        ) : (
                            <div className="max-h-96 overflow-y-auto">
                                {/* Users Section */}
                                {searchResults.users.length > 0 && (
                                    <div className="border-b border-gray-200 dark:border-dark-800">
                                        <div className="px-4 py-2 bg-gray-50 dark:bg-dark-800 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                                            Users ({searchResults.users.length})
                                        </div>
                                        {searchResults.users.map((user) => (
                                            <Link
                                                key={user.id}
                                                to={`/users/${user.id}`}
                                                onClick={handleClose}
                                                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
                                            >
                                                <User className="w-4 h-4 text-gray-400" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                        {user.email} • {user.department}
                                                    </div>
                                                </div>
                                                <div className={`text-xs font-semibold ${user.riskScore >= 70 ? 'text-red-600 dark:text-red-400' :
                                                        user.riskScore >= 40 ? 'text-yellow-600 dark:text-yellow-400' :
                                                            'text-green-600 dark:text-green-400'
                                                    }`}>
                                                    {user.riskScore}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {/* Rules Section */}
                                {searchResults.rules.length > 0 && (
                                    <div>
                                        <div className="px-4 py-2 bg-gray-50 dark:bg-dark-800 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                                            Rules ({searchResults.rules.length})
                                        </div>
                                        {searchResults.rules.map((rule) => (
                                            <Link
                                                key={rule.id}
                                                to="/rules"
                                                onClick={handleClose}
                                                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
                                            >
                                                <FileCode className="w-4 h-4 text-gray-400" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                        {rule.nameKo}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                        {rule.id} • {rule.category}
                                                    </div>
                                                </div>
                                                <div className={`px-2 py-0.5 text-xs font-semibold rounded ${rule.severity === 'Critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                                                        rule.severity === 'High' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' :
                                                            rule.severity === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                                                                'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                                    }`}>
                                                    {rule.severity}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {/* View All Link */}
                                <Link
                                    to={`/search?q=${encodeURIComponent(query)}`}
                                    onClick={handleClose}
                                    className="block px-4 py-3 text-center text-sm font-medium text-enterprise-600 dark:text-enterprise-400 hover:bg-gray-50 dark:hover:bg-dark-800 border-t border-gray-200 dark:border-dark-800"
                                >
                                    View all {totalResults} results
                                </Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
