import { useState } from 'react';
import { useData } from '../context/DataContext';
import { RiskGauge } from '../components/RiskGauge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, Users, MapPin, AlertCircle, X, Smartphone, ShieldAlert, LayoutGrid } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const Dashboard = () => {
    const { users, orgRiskIndex, riskTrendData, riskTrend30Days, threatMapData, devicePlatformData, threatTypeData, riskHeatmapData } = useData();
    const [showTrendModal, setShowTrendModal] = useState(false);
    const [trendPeriod, setTrendPeriod] = useState<'24h' | '30d'>('30d');

    const COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#64748b'];

    // Sort users by risk score
    const topRiskyUsers = [...users].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5);

    const getRiskColor = (score: number) => {
        if (score >= 80) return 'text-red-500';
        if (score >= 60) return 'text-orange-500';
        if (score >= 40) return 'text-yellow-500';
        return 'text-green-500';
    };

    const getRiskBg = (score: number) => {
        if (score >= 80) return 'bg-red-500/10 border-red-500/20';
        if (score >= 60) return 'bg-orange-500/10 border-orange-500/20';
        if (score >= 40) return 'bg-yellow-500/10 border-yellow-500/20';
        return 'bg-green-500/10 border-green-500/20';
    };

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        WOI On-Prem | 조직 위험 지수
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">조직 위험 지수 대시보드</p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-600 dark:text-gray-500">마지막 업데이트</div>
                    <div className="text-gray-700 dark:text-gray-300">{new Date(orgRiskIndex.lastUpdated).toLocaleString('ko-KR')}</div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Organization Risk Gauge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="lg:col-span-1 glass-effect rounded-xl p-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <AlertCircle className="w-5 h-5 text-enterprise-500" />
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">조직 위험 지수</h2>
                    </div>
                    <div className="flex justify-center">
                        <RiskGauge score={orgRiskIndex.score} size="lg" />
                    </div>
                    <div className="mt-4 text-center">
                        <button
                            onClick={() => setShowTrendModal(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 transition-colors cursor-pointer"
                        >
                            <span className="text-orange-500 font-medium">증가 추세 (30일)</span>
                        </button>
                    </div>
                </motion.div>

                {/* User Risk Overview (Heatmap & Top Users) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="lg:col-span-2 glass-effect rounded-xl p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-enterprise-500" />
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">사용자 위험 현황</h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Risk Heatmap */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">부서/직급별 위험도 (Heatmap)</h3>
                            <div className="grid grid-cols-4 gap-1">
                                <div className="text-xs text-gray-500"></div>
                                <div className="text-xs text-gray-500 text-center font-medium">임원</div>
                                <div className="text-xs text-gray-500 text-center font-medium">팀장</div>
                                <div className="text-xs text-gray-500 text-center font-medium">사원</div>

                                {['영업팀', 'IT팀', '재무팀', 'HR팀', '마케팅팀'].map(dept => (
                                    <>
                                        <div className="text-xs text-gray-500 font-medium flex items-center">{dept}</div>
                                        {['임원', '팀장', '사원'].map(role => {
                                            const data = riskHeatmapData.find(d => d.x === dept && d.y === role);
                                            const value = data ? data.value : 0;
                                            let bgClass = 'bg-green-100 dark:bg-green-900/20';
                                            if (value >= 80) bgClass = 'bg-red-500 text-white';
                                            else if (value >= 60) bgClass = 'bg-orange-500 text-white';
                                            else if (value >= 40) bgClass = 'bg-yellow-500 text-white';
                                            else if (value > 0) bgClass = 'bg-green-500 text-white';

                                            return (
                                                <div
                                                    key={`${dept}-${role}`}
                                                    className={`h-8 rounded flex items-center justify-center text-xs font-medium transition-all hover:scale-105 cursor-default ${bgClass}`}
                                                    title={`${dept} ${role}: ${value}`}
                                                >
                                                    {value}
                                                </div>
                                            );
                                        })}
                                    </>
                                ))}
                            </div>
                        </div>

                        {/* Top Risky Users List */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">고위험 사용자 Top 5</h3>
                            <div className="space-y-2">
                                {topRiskyUsers.map((user, index) => (
                                    <Link
                                        key={user.id}
                                        to={`/users/${user.id}`}
                                        className="block"
                                    >
                                        <div className={`flex items-center justify-between p-2 rounded-lg border transition-all hover:bg-gray-50 dark:hover:bg-dark-800 ${getRiskBg(user.riskScore)}`}>
                                            <div className="flex items-center gap-3">
                                                <div className="text-sm font-bold text-gray-400 dark:text-gray-500 w-4">#{index + 1}</div>
                                                <div>
                                                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user.name}</div>
                                                    <div className="text-xs text-gray-600 dark:text-gray-400">{user.department}</div>
                                                </div>
                                            </div>
                                            <div className={`text-lg font-bold ${getRiskColor(user.riskScore)}`}>
                                                {user.riskScore}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Device Risk Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Platform Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="glass-effect rounded-xl p-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Smartphone className="w-5 h-5 text-enterprise-500" />
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">단말 위험 현황 (플랫폼별)</h2>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={devicePlatformData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                            <XAxis type="number" stroke="#64748b" style={{ fontSize: '12px' }} />
                            <YAxis dataKey="name" type="category" stroke="#64748b" style={{ fontSize: '12px' }} width={60} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                            />
                            <Legend />
                            <Bar dataKey="high" name="고위험" stackId="a" fill="#ef4444" barSize={20} />
                            <Bar dataKey="medium" name="중위험" stackId="a" fill="#f97316" barSize={20} />
                            <Bar dataKey="low" name="저위험" stackId="a" fill="#22c55e" barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Threat Type Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="glass-effect rounded-xl p-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <ShieldAlert className="w-5 h-5 text-enterprise-500" />
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">위협 유형별 분포</h2>
                    </div>
                    <div className="flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={240}>
                            <PieChart>
                                <Pie
                                    data={threatTypeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {threatTypeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                                />
                                <Legend layout="vertical" verticalAlign="middle" align="right" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Third Row: Map & Trend (Moved down) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Threat Map */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="glass-effect rounded-xl p-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <MapPin className="w-5 h-5 text-enterprise-500" />
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">위협 지도</h2>
                        <span className="text-sm text-gray-600 dark:text-gray-500">(불가능한 이동)</span>
                    </div>
                    <div className="relative h-64 bg-gray-100 dark:bg-dark-900 rounded-lg overflow-hidden">
                        {/* Simplified map visualization */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center space-y-4">
                                {threatMapData.map((threat, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex items-center justify-center gap-4">
                                            <div className="text-center">
                                                <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1 animate-pulse"></div>
                                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{threat.from.city}</div>
                                                <div className="text-xs text-gray-600 dark:text-gray-500">{threat.from.country}</div>
                                            </div>
                                            <div className="flex-1 h-px bg-gradient-to-r from-red-500 to-orange-500 max-w-xs"></div>
                                            <div className="text-center">
                                                <div className="w-3 h-3 bg-orange-500 rounded-full mx-auto mb-1 animate-pulse"></div>
                                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{threat.to.city}</div>
                                                <div className="text-xs text-gray-600 dark:text-gray-500">{threat.to.country}</div>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-sm text-red-400">
                                                <span className="font-semibold">{threat.user}</span> | 시간 간격: {threat.timeGap}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Risk Trend */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="glass-effect rounded-xl p-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-enterprise-500" />
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">24시간 위험 추세</h2>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={riskTrendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis
                                dataKey="time"
                                stroke="#64748b"
                                style={{ fontSize: '12px' }}
                            />
                            <YAxis
                                stroke="#64748b"
                                style={{ fontSize: '12px' }}
                                domain={[0, 100]}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: '1px solid #334155',
                                    borderRadius: '8px'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="score"
                                stroke="#0ea5e9"
                                strokeWidth={3}
                                dot={{ fill: '#0ea5e9', r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Trend Chart Modal */}
            <AnimatePresence>
                {showTrendModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowTrendModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="glass-effect rounded-xl p-8 max-w-4xl w-full max-h-[80vh] overflow-auto"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">조직 위험 지수 추세</h2>
                                    <div className="flex items-center gap-4 mt-2">
                                        <button
                                            onClick={() => setTrendPeriod('24h')}
                                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${trendPeriod === '24h' ? 'bg-enterprise-500 text-white' : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400'}`}
                                        >
                                            24 Hours
                                        </button>
                                        <button
                                            onClick={() => setTrendPeriod('30d')}
                                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${trendPeriod === '30d' ? 'bg-enterprise-500 text-white' : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400'}`}
                                        >
                                            30 Days
                                        </button>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowTrendModal(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                                </button>
                            </div>

                            <div className="bg-white dark:bg-dark-900 rounded-lg p-6 border border-gray-200 dark:border-dark-700">
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={trendPeriod === '24h' ? riskTrendData : riskTrend30Days}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                        <XAxis
                                            dataKey={trendPeriod === '24h' ? 'time' : 'date'}
                                            stroke="#64748b"
                                            style={{ fontSize: '14px' }}
                                        />
                                        <YAxis
                                            stroke="#64748b"
                                            style={{ fontSize: '14px' }}
                                            domain={[0, 100]}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#1e293b',
                                                border: '1px solid #334155',
                                                borderRadius: '8px',
                                                color: '#fff'
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="score"
                                            stroke="#0ea5e9"
                                            strokeWidth={3}
                                            dot={{ fill: '#0ea5e9', r: 5 }}
                                            activeDot={{ r: 7 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>

                                <div className="mt-6 grid grid-cols-3 gap-4">
                                    <div className="text-center p-4 bg-gray-50 dark:bg-dark-800 rounded-lg">
                                        <div className="text-sm text-gray-600 dark:text-gray-400">현재 위험도</div>
                                        <div className="text-2xl font-bold text-orange-500 mt-1">{orgRiskIndex.score}</div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 dark:bg-dark-800 rounded-lg">
                                        <div className="text-sm text-gray-600 dark:text-gray-400">24시간 최고</div>
                                        <div className="text-2xl font-bold text-red-500 mt-1">{Math.max(...riskTrendData.map(d => d.score))}</div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 dark:bg-dark-800 rounded-lg">
                                        <div className="text-sm text-gray-600 dark:text-gray-400">24시간 최저</div>
                                        <div className="text-2xl font-bold text-green-500 mt-1">{Math.min(...riskTrendData.map(d => d.score))}</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
