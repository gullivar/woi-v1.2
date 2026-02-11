import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ArrowLeft, User, Smartphone, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { RiskGauge } from '../components/RiskGauge';

export const UserDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { getUserById } = useData();

    const user = getUserById(id || '');

    if (!user) {
        return (
            <div className="p-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">사용자를 찾을 수 없습니다</h1>
                    <Link to="/" className="text-enterprise-500 hover:underline mt-4 inline-block">
                        대시보드로 돌아가기
                    </Link>
                </div>
            </div>
        );
    }

    // Prepare data for waterfall chart
    const breakdownData = [
        {
            name: '기본 위험',
            value: user.scoreBreakdown.baseRisk,
            label: user.scoreBreakdown.baseRuleName,
            color: '#ef4444'
        },
        ...user.scoreBreakdown.additionalRisks.map((risk, index) => ({
            name: `추가 ${index + 1}`,
            value: risk.score,
            label: risk.name,
            color: '#f97316'
        })),
        {
            name: '최종 점수',
            value: user.scoreBreakdown.finalScore,
            label: `최종 점수 (시간 계수: ${user.scoreBreakdown.timeFactor})`,
            color: '#0ea5e9'
        }
    ];

    const getRiskColor = (severity: string) => {
        switch (severity) {
            case 'Critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
            case 'High': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
            case 'Medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            default: return 'text-green-500 bg-green-500/10 border-green-500/20';
        }
    };

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link to="/" className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors">
                    <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">위협 상세 분석 & XAI</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Threat Detail & Explainable AI Analysis</p>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - User Profile */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="lg:col-span-1 space-y-6"
                >
                    {/* User Info Card */}
                    <div className="glass-effect rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <User className="w-5 h-5 text-enterprise-500" />
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">사용자 정보</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="text-sm text-gray-600 dark:text-gray-500">이름</div>
                                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{user.name}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">{user.nameEn}</div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-600 dark:text-gray-500">부서</div>
                                <div className="text-gray-900 dark:text-gray-100">{user.department}</div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-600 dark:text-gray-500">이메일</div>
                                <div className="text-gray-900 dark:text-gray-100 text-sm">{user.email}</div>
                            </div>
                        </div>
                    </div>

                    {/* Device Info Card */}
                    <div className="glass-effect rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Smartphone className="w-5 h-5 text-enterprise-500" />
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">기기 정보</h2>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <div className="text-sm text-gray-600 dark:text-gray-500">모델</div>
                                <div className="text-gray-900 dark:text-gray-100">{user.deviceInfo.model}</div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-600 dark:text-gray-500">운영체제</div>
                                <div className="text-gray-900 dark:text-gray-100">{user.deviceInfo.os}</div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-600 dark:text-gray-500">마지막 접속</div>
                                <div className="text-gray-900 dark:text-gray-100 text-sm">
                                    {new Date(user.deviceInfo.lastSeen).toLocaleString('ko-KR')}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Risk Score Card */}
                    <div className="glass-effect rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertTriangle className="w-5 h-5 text-enterprise-500" />
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">위험 점수</h2>
                        </div>
                        <div className="flex justify-center">
                            <RiskGauge score={user.riskScore} size="md" />
                        </div>
                    </div>
                </motion.div>

                {/* Right Column - Risk Analysis */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="lg:col-span-2 space-y-6"
                >
                    {/* XAI - Risk Breakdown Chart */}
                    <div className="glass-effect rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <TrendingUp className="w-5 h-5 text-enterprise-500" />
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">위험 점수 산출 근거 (XAI)</h2>
                            <span className="text-sm text-gray-600 dark:text-gray-500">(Explainable AI - Whitebox Scoring)</span>
                        </div>

                        {/* Chart */}
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={breakdownData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis
                                    type="number"
                                    stroke="#64748b"
                                    style={{ fontSize: '12px' }}
                                    domain={[0, 120]}
                                />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    stroke="#64748b"
                                    style={{ fontSize: '12px' }}
                                    width={80}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1e293b',
                                        border: '1px solid #334155',
                                        borderRadius: '8px'
                                    }}
                                    formatter={(value: number, _name: string, props: any) => [
                                        `${value}점`,
                                        props.payload.label
                                    ]}
                                />
                                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                                    {breakdownData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>

                        {/* Natural Language Summary */}
                        <div className="mt-6 p-4 bg-enterprise-500/10 border border-enterprise-500/20 rounded-lg">
                            <div className="text-sm font-semibold text-enterprise-400 mb-2">📊 점수 산출 요약</div>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                <span className="font-semibold text-gray-900 dark:text-gray-100">{user.name}님</span>의 위험 점수는{' '}
                                <span className="font-bold text-red-400">{user.riskScore}점</span>입니다.
                                주원인은 <span className="font-semibold text-red-400">{user.scoreBreakdown.baseRuleName}</span>
                                (기본 위험: {user.scoreBreakdown.baseRisk}점)이며,{' '}
                                {user.scoreBreakdown.additionalRisks.length > 0 ? (
                                    <>
                                        {user.scoreBreakdown.additionalRisks.map((risk, index) => (
                                            <span key={index}>
                                                <span className="font-semibold text-orange-400">{risk.name}</span>
                                                (+{risk.score}점)
                                                {index < user.scoreBreakdown.additionalRisks.length - 1 ? ', ' : '이 '}
                                            </span>
                                        ))}
                                        동반되어{' '}
                                    </>
                                ) : ' '}
                                <span className="font-semibold text-yellow-400">계정 탈취가 유력</span>합니다.
                                시간 계수({user.scoreBreakdown.timeFactor})를 적용한 최종 점수는{' '}
                                <span className="font-bold text-enterprise-400">{user.scoreBreakdown.finalScore}점</span>으로 산출되었습니다.
                            </p>
                        </div>

                        {/* Calculation Formula */}
                        <div className="mt-4 p-4 bg-gray-100 dark:bg-dark-900 rounded-lg border border-gray-300 dark:border-dark-700">
                            <div className="text-xs font-mono text-gray-700 dark:text-gray-400">
                                <div className="mb-2 text-gray-600 dark:text-gray-500">계산식:</div>
                                <div className="text-enterprise-400">
                                    Final Score = Min(100, ({user.scoreBreakdown.baseRisk}
                                    {user.scoreBreakdown.additionalRisks.map(r => ` + ${r.score}`).join('')}
                                    ) × {user.scoreBreakdown.timeFactor}) = {user.scoreBreakdown.finalScore}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detected Alerts */}
                    <div className="glass-effect rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="w-5 h-5 text-enterprise-500" />
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">탐지된 알림</h2>
                            <span className="text-sm text-gray-600 dark:text-gray-500">({user.alerts.length}건)</span>
                        </div>

                        <div className="space-y-3">
                            {user.alerts.map((alert, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className={`p-4 rounded-lg border ${getRiskColor(alert.severity)}`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <div className="font-semibold text-gray-900 dark:text-gray-100">{alert.ruleName}</div>
                                            <div className="text-xs text-gray-600 dark:text-gray-500 mt-1">Rule ID: {alert.ruleId}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-2xl font-bold ${getRiskColor(alert.severity).split(' ')[0]}`}>
                                                {alert.score}
                                            </div>
                                            <div className="text-xs">{alert.severity}</div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">{alert.details}</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-500">
                                        {new Date(alert.timestamp).toLocaleString('ko-KR')}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
