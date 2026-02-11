import { useState } from 'react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, TrendingUp, X, Eye, Brain } from 'lucide-react';
import { ImpossibleTravelWidget, AppInstallSpikeWidget, OSOutdatedWidget, CompromisedStatusWidget, AnomalousSequenceWidget, AbnormalTimeAccessWidget, DataUsageAnomalyWidget, VulnerabilityWidget, SecurityComplianceWidget, ProhibitedAppWidget } from '../components/ThreatEvidence/EvidenceWidgets';

export const ThreatsPage = () => {
    const { users } = useData();
    const { t, language } = useLanguage();
    const [selectedAlert, setSelectedAlert] = useState<any>(null);

    // Get all alerts from all users
    const allAlerts = users.flatMap(user =>
        user.alerts.map(alert => ({
            ...alert,
            userName: user.name,
            userId: user.id,
            userDepartment: user.department,
            userRiskScore: user.riskScore,
        }))
    ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'Critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
            case 'High': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
            case 'Medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            default: return 'text-green-500 bg-green-500/10 border-green-500/20';
        }
    };

    const renderEvidenceWidget = (ruleName: string, data: any) => {
        if (ruleName.includes('Impossible Travel') || ruleName.includes('물리적 불가능')) return <ImpossibleTravelWidget data={data} />;
        if (ruleName.includes('Abnormal Time') || ruleName.includes('비정상 시간대')) return <AbnormalTimeAccessWidget />;
        if (ruleName.includes('App Install') || ruleName.includes('앱 설치')) return <AppInstallSpikeWidget />;
        if (ruleName.includes('OS Version') || ruleName.includes('OS 버전')) return <OSOutdatedWidget />;
        if (ruleName.includes('Compromised') || ruleName.includes('무결성') || ruleName.includes('Rooting') || ruleName.includes('Jailbreak')) return <CompromisedStatusWidget />;
        if (ruleName.includes('Sequence') || ruleName.includes('순서')) return <AnomalousSequenceWidget />;

        // New Widgets
        if (ruleName.includes('Data Usage') || ruleName.includes('데이터 과다')) return <DataUsageAnomalyWidget />;
        if (ruleName.includes('Vulnerability') || ruleName.includes('CVE') || ruleName.includes('취약점')) return <VulnerabilityWidget details={data.details} />;
        if (ruleName.includes('Prohibited') || ruleName.includes('금지된') || ruleName.includes('Blacklisted')) return <ProhibitedAppWidget details={data.details} />;
        if (ruleName.includes('Encryption') || ruleName.includes('USB') || ruleName.includes('Policy') || ruleName.includes('Compliance') || ruleName.includes('암호화') || ruleName.includes('정책')) return <SecurityComplianceWidget ruleName={ruleName} details={data.details} />;

        return (
            <div className="p-8 text-center text-gray-500 bg-gray-50 dark:bg-dark-800 rounded-lg border border-dashed border-gray-300 dark:border-dark-700">
                {t('threats.no_evidence')}
            </div>
        );
    };

    const getXAISummary = (alert: any) => {
        if (alert.ruleName.includes('Impossible Travel')) {
            return t('threats.xai.impossible_travel')
                .replace('{prev}', language === 'ko' ? '서울' : 'Seoul')
                .replace('{curr}', language === 'ko' ? '뉴욕' : 'New York')
                .replace('{speed}', '66,000');
        }
        if (alert.ruleName.includes('App Install')) {
            return t('threats.xai.app_install')
                .replace('{avg}', '0.5')
                .replace('{count}', '25');
        }
        if (alert.ruleName.includes('OS Version')) {
            return t('threats.xai.os_version')
                .replace('{v}', 'v14')
                .replace('{cve}', 'CVE-2023-XXXX');
        }
        if (alert.ruleName.includes('Compromised')) {
            return t('threats.xai.compromised');
        }
        if (alert.ruleName.includes('Sequence')) {
            return t('threats.xai.sequence')
                .replace('{prob}', '0.01');
        }
        return t('threats.xai.default');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString(language === 'ko' ? 'ko-KR' : 'en-US');
    };

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('threats.title')}</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{t('threats.subtitle')}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: t('threats.all_alerts'), value: allAlerts.length, color: 'text-blue-500' },
                    { label: 'Critical', value: allAlerts.filter(a => a.severity === 'Critical').length, color: 'text-red-500' },
                    { label: 'High', value: allAlerts.filter(a => a.severity === 'High').length, color: 'text-orange-500' },
                    { label: 'Medium', value: allAlerts.filter(a => a.severity === 'Medium').length, color: 'text-yellow-500' },
                ].map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="glass-effect rounded-xl p-6 border border-gray-200 dark:border-white/10"
                    >
                        <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                        <div className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</div>
                    </motion.div>
                ))}
            </div>

            {/* Alerts Timeline */}
            <div className="glass-effect rounded-xl p-6 border border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-5 h-5 text-enterprise-500" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t('threats.timeline_title')}</h2>
                </div>

                <div className="space-y-3">
                    {allAlerts.map((alert, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <AlertTriangle className="w-5 h-5" />
                                        <div className="font-semibold text-gray-900 dark:text-gray-100">{alert.ruleName}</div>
                                        <span className={`text-xs px-2 py-1 border rounded ${getSeverityColor(alert.severity)}`}>
                                            {alert.severity}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">{alert.details}</div>
                                    <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-500">
                                        <span>{t('threats.user')}: <span className="font-medium text-gray-900 dark:text-gray-100">{alert.userName}</span></span>
                                        <span>{t('threats.dept')}: {alert.userDepartment}</span>
                                        <span>{t('threats.risk_score')}: <span className="font-medium text-red-500">{alert.userRiskScore}</span></span>
                                        <span>{formatDate(alert.timestamp)}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-2xl font-bold ${getSeverityColor(alert.severity).split(' ')[0]}`}>
                                        {alert.score}
                                    </div>
                                    <div className="text-xs text-gray-600 dark:text-gray-500">{t('threats.score_unit')}</div>
                                    <button
                                        onClick={() => setSelectedAlert(alert)}
                                        className="mt-2 flex items-center gap-1 text-xs px-3 py-1.5 bg-enterprise-500 hover:bg-enterprise-600 text-white rounded transition-colors"
                                    >
                                        <Eye className="w-3 h-3" /> {t('threats.view_analysis')}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>


            {/* Threat Detail Modal */}
            <AnimatePresence>
                {selectedAlert && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setSelectedAlert(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-dark-900 border border-gray-300 dark:border-dark-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl"
                        >
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-white dark:bg-dark-900 border-b border-gray-300 dark:border-dark-700 px-6 py-4 flex items-center justify-between z-10">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${getSeverityColor(selectedAlert.severity).split(' ')[1]}`}>
                                        <AlertTriangle className={`w-6 h-6 ${getSeverityColor(selectedAlert.severity).split(' ')[0]}`} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{selectedAlert.ruleName}</h2>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <span>{formatDate(selectedAlert.timestamp)}</span>
                                            <span>•</span>
                                            <span className="font-mono">{selectedAlert.ruleId}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedAlert(null)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Common Header Info */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-4 bg-gray-50 dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700">
                                        <div className="text-sm text-gray-500 mb-1">{t('threats.user')}</div>
                                        <div className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{selectedAlert.userName}</div>
                                        <div className="text-xs text-gray-500">{selectedAlert.userDepartment}</div>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700">
                                        <div className="text-sm text-gray-500 mb-1">{t('threats.risk_score')}</div>
                                        <div className={`font-bold text-2xl ${getSeverityColor(selectedAlert.severity).split(' ')[0]}`}>
                                            {selectedAlert.score}
                                        </div>
                                        <div className="text-xs text-gray-500">Severity: {selectedAlert.severity}</div>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700">
                                        <div className="text-sm text-gray-500 mb-1">{t('threats.status')}</div>
                                        <div className="font-semibold text-orange-500 text-lg">{t('threats.open')}</div>
                                        <div className="text-xs text-gray-500">{t('threats.assigned')}: {t('threats.unassigned')}</div>
                                    </div>
                                </div>

                                {/* XAI Summary */}
                                <div className="bg-enterprise-500/5 border border-enterprise-500/20 rounded-lg p-5">
                                    <div className="flex items-start gap-3">
                                        <Brain className="w-6 h-6 text-enterprise-500 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-enterprise-600 dark:text-enterprise-400 mb-1">{t('threats.ai_summary_title')}</h3>
                                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                                {getXAISummary(selectedAlert)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Dynamic Evidence Panel */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-gray-500" />
                                        {t('threats.evidence_title')}
                                    </h3>
                                    {renderEvidenceWidget(selectedAlert.ruleName, selectedAlert)}
                                </div>

                                {/* Raw Details */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('threats.raw_details')}</h3>
                                    <div className="bg-gray-100 dark:bg-dark-950 p-4 rounded-lg border border-gray-200 dark:border-dark-700 font-mono text-sm text-gray-700 dark:text-gray-300">
                                        {selectedAlert.details}
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
