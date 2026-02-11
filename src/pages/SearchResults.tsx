import { useSearchParams, Link } from 'react-router-dom';
import { Search, User, FileCode } from 'lucide-react';
import { useData } from '../context/DataContext';

export const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const { users, rules } = useData();

    // Perform search
    const results = {
        users: users.filter(user =>
            user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase()) ||
            user.department.toLowerCase().includes(query.toLowerCase())
        ),
        rules: rules.filter(rule =>
            rule.nameKo.toLowerCase().includes(query.toLowerCase()) ||
            rule.nameEn.toLowerCase().includes(query.toLowerCase()) ||
            rule.description.toLowerCase().includes(query.toLowerCase())
        ),
    };

    const totalResults = results.users.length + results.rules.length;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Search Results
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Found {totalResults} results for "<span className="font-semibold text-gray-900 dark:text-gray-100">{query}</span>"
                </p>
            </div>

            {totalResults === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-dark-900 rounded-lg border border-gray-200 dark:border-dark-800">
                    <Search className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                        No results found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        Try adjusting your search terms or filters
                    </p>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Users Section */}
                    {results.users.length > 0 && (
                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-enterprise-500" />
                                Users ({results.users.length})
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {results.users.map(user => (
                                    <Link
                                        key={user.id}
                                        to={`/users/${user.id}`}
                                        className="block bg-white dark:bg-dark-900 p-4 rounded-lg border border-gray-200 dark:border-dark-800 hover:border-enterprise-500 dark:hover:border-enterprise-500 transition-colors group"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-enterprise-400 to-enterprise-600 flex items-center justify-center text-white font-semibold">
                                                    {user.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-enterprise-600 dark:group-hover:text-enterprise-400 transition-colors">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        {user.department}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`px-2 py-1 text-xs font-semibold rounded ${user.riskScore >= 70 ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                                                user.riskScore >= 40 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                                                    'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                                }`}>
                                                Risk: {user.riskScore}
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                            {user.email}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Rules Section */}
                    {results.rules.length > 0 && (
                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                <FileCode className="w-5 h-5 text-enterprise-500" />
                                Detection Rules ({results.rules.length})
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {results.rules.map(rule => (
                                    <Link
                                        key={rule.id}
                                        to="/rules"
                                        className="block bg-white dark:bg-dark-900 p-4 rounded-lg border border-gray-200 dark:border-dark-800 hover:border-enterprise-500 dark:hover:border-enterprise-500 transition-colors group"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-enterprise-600 dark:group-hover:text-enterprise-400 transition-colors">
                                                    {rule.nameKo}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {rule.nameEn}
                                                </div>
                                            </div>
                                            <div className={`px-2 py-1 text-xs font-semibold rounded ${rule.severity === 'Critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                                                rule.severity === 'High' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' :
                                                    rule.severity === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                                                        'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                                }`}>
                                                {rule.severity}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                                            {rule.description}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                            <span className="bg-gray-100 dark:bg-dark-800 px-2 py-1 rounded">
                                                {rule.category}
                                            </span>
                                            <span className="bg-gray-100 dark:bg-dark-800 px-2 py-1 rounded">
                                                {rule.technique}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
};
