import { useState } from 'react';
import { Settings as SettingsIcon, Database, Bell, Shield, FileText, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';

type SettingsTab = 'data-sources' | 'notifications' | 'security' | 'logs' | 'system';

export const Settings = () => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('data-sources');
    const [hasChanges, setHasChanges] = useState(false);

    const tabs = [
        { id: 'data-sources' as SettingsTab, label: '데이터 원본', icon: Database },
        { id: 'notifications' as SettingsTab, label: '알림', icon: Bell },
        { id: 'security' as SettingsTab, label: '보안', icon: Shield },
        { id: 'logs' as SettingsTab, label: '로그', icon: FileText },
        { id: 'system' as SettingsTab, label: '시스템 정보', icon: SettingsIcon },
    ];

    const handleSave = () => {
        // Mock save
        setHasChanges(false);
        alert('Settings saved successfully!');
    };

    const handleCancel = () => {
        setHasChanges(false);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">설정</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">시스템 설정 및 환경설정을 구성합니다</p>
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-dark-900 rounded-lg shadow-sm border border-gray-200 dark:border-dark-800">
                <div className="border-b border-gray-200 dark:border-dark-800">
                    <nav className="flex space-x-8 px-6" aria-label="Tabs">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                        ${isActive
                                            ? 'border-enterprise-500 text-enterprise-600 dark:text-enterprise-400'
                                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                                        }
                                    `}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'data-sources' && <DataSourcesTab setHasChanges={setHasChanges} />}
                        {activeTab === 'notifications' && <NotificationsTab setHasChanges={setHasChanges} />}
                        {activeTab === 'security' && <SecurityTab setHasChanges={setHasChanges} />}
                        {activeTab === 'logs' && <LogsTab />}
                        {activeTab === 'system' && <SystemInfoTab />}
                    </motion.div>
                </div>

                {/* Action Buttons */}
                {hasChanges && (
                    <div className="border-t border-gray-200 dark:border-dark-800 px-6 py-4 bg-gray-50 dark:bg-dark-800/50 flex justify-end gap-3">
                        <button
                            onClick={handleCancel}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-enterprise-500 hover:bg-enterprise-600 rounded-lg transition-colors"
                        >
                            <Save className="w-4 h-4" />
                            변경 사항 저장
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// Data Sources Tab
const DataSourcesTab = ({ setHasChanges }: { setHasChanges: (v: boolean) => void }) => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Workspace ONE UEM 연동</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            API 엔드포인트
                        </label>
                        <input
                            type="text"
                            defaultValue="https://api.workspaceone.com/v1"
                            onChange={() => setHasChanges(true)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-enterprise-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            API 키
                        </label>
                        <input
                            type="password"
                            defaultValue="••••••••••••••••"
                            onChange={() => setHasChanges(true)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-enterprise-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            동기화 주기 (분)
                        </label>
                        <select
                            defaultValue="15"
                            onChange={() => setHasChanges(true)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-enterprise-500 focus:border-transparent"
                        >
                            <option value="5">5분</option>
                            <option value="15">15분</option>
                            <option value="30">30분</option>
                            <option value="60">1시간</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="auto-sync"
                            defaultChecked
                            onChange={() => setHasChanges(true)}
                            className="w-4 h-4 text-enterprise-600 border-gray-300 rounded focus:ring-enterprise-500"
                        />
                        <label htmlFor="auto-sync" className="text-sm text-gray-700 dark:text-gray-300">
                            자동 동기화 활성화
                        </label>
                    </div>

                    <div className="pt-4">
                        <button className="px-4 py-2 text-sm font-medium text-enterprise-600 dark:text-enterprise-400 hover:bg-enterprise-500/10 rounded-lg transition-colors">
                            연결 테스트
                        </button>
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-dark-700">
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                            <p className="text-sm font-medium text-green-900 dark:text-green-100">연결됨</p>
                            <p className="text-xs text-green-700 dark:text-green-300">마지막 동기화: 2분 전</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Notifications Tab
const NotificationsTab = ({ setHasChanges }: { setHasChanges: (v: boolean) => void }) => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">이메일 알림</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            SMTP 서버
                        </label>
                        <input
                            type="text"
                            defaultValue="smtp.gmail.com"
                            onChange={() => setHasChanges(true)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-enterprise-500 focus:border-transparent"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                포트
                            </label>
                            <input
                                type="number"
                                defaultValue="587"
                                onChange={() => setHasChanges(true)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-enterprise-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                발신 이메일
                            </label>
                            <input
                                type="email"
                                defaultValue="alerts@woi-onprem.com"
                                onChange={() => setHasChanges(true)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-enterprise-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-dark-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">알림 임계값</h3>

                <div className="space-y-3">
                    {[
                        { label: '높은 심각도 알림', defaultChecked: true },
                        { label: '중간 심각도 알림', defaultChecked: true },
                        { label: '낮은 심각도 알림', defaultChecked: false },
                        { label: '시스템 이벤트', defaultChecked: true },
                        { label: '워크플로우 완료', defaultChecked: false },
                    ].map((item) => (
                        <div key={item.label} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id={item.label}
                                defaultChecked={item.defaultChecked}
                                onChange={() => setHasChanges(true)}
                                className="w-4 h-4 text-enterprise-600 border-gray-300 rounded focus:ring-enterprise-500"
                            />
                            <label htmlFor={item.label} className="text-sm text-gray-700 dark:text-gray-300">
                                {item.label}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Security Tab
const SecurityTab = ({ setHasChanges }: { setHasChanges: (v: boolean) => void }) => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">세션 설정</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            세션 만료 시간 (분)
                        </label>
                        <select
                            defaultValue="30"
                            onChange={() => setHasChanges(true)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-enterprise-500 focus:border-transparent"
                        >
                            <option value="15">15분</option>
                            <option value="30">30분</option>
                            <option value="60">1시간</option>
                            <option value="120">2시간</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="require-mfa"
                            defaultChecked
                            onChange={() => setHasChanges(true)}
                            className="w-4 h-4 text-enterprise-600 border-gray-300 rounded focus:ring-enterprise-500"
                        />
                        <label htmlFor="require-mfa" className="text-sm text-gray-700 dark:text-gray-300">
                            다중 인증(MFA) 필수
                        </label>
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-dark-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">비밀번호 정책</h3>

                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            최소 비밀번호 길이
                        </label>
                        <input
                            type="number"
                            defaultValue="12"
                            min="8"
                            max="32"
                            onChange={() => setHasChanges(true)}
                            className="w-32 px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-enterprise-500 focus:border-transparent"
                        />
                    </div>

                    {[
                        { label: '대문자 포함 필수', defaultChecked: true },
                        { label: '소문자 포함 필수', defaultChecked: true },
                        { label: '숫자 포함 필수', defaultChecked: true },
                        { label: '특수문자 포함 필수', defaultChecked: true },
                    ].map((item) => (
                        <div key={item.label} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id={item.label}
                                defaultChecked={item.defaultChecked}
                                onChange={() => setHasChanges(true)}
                                className="w-4 h-4 text-enterprise-600 border-gray-300 rounded focus:ring-enterprise-500"
                            />
                            <label htmlFor={item.label} className="text-sm text-gray-700 dark:text-gray-300">
                                {item.label}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Logs Tab
const LogsTab = () => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">로그 설정</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            로그 레벨
                        </label>
                        <select
                            defaultValue="INFO"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-enterprise-500 focus:border-transparent"
                        >
                            <option value="DEBUG">DEBUG</option>
                            <option value="INFO">INFO</option>
                            <option value="WARNING">WARNING</option>
                            <option value="ERROR">ERROR</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            로그 보관 기간 (일)
                        </label>
                        <input
                            type="number"
                            defaultValue="90"
                            className="w-32 px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-enterprise-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-dark-700">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">최근 로그</h3>
                    <button className="px-3 py-1.5 text-sm font-medium text-enterprise-600 dark:text-enterprise-400 hover:bg-enterprise-500/10 rounded-lg transition-colors">
                        모든 로그 보기
                    </button>
                </div>

                <div className="space-y-2">
                    {[
                        { time: '2024-12-05 01:05:23', level: 'INFO', message: 'User login: admin@example.com' },
                        { time: '2024-12-05 01:03:15', level: 'INFO', message: 'Data sync completed successfully' },
                        { time: '2024-12-05 01:00:42', level: 'WARNING', message: 'High CPU usage detected: 85%' },
                        { time: '2024-12-05 00:58:11', level: 'INFO', message: 'Workflow execution completed: WF-001' },
                    ].map((log, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-dark-800 rounded-lg text-xs font-mono">
                            <span className="text-gray-500 dark:text-gray-400">{log.time}</span>
                            <span className={`font-semibold ${log.level === 'ERROR' ? 'text-red-600 dark:text-red-400' :
                                log.level === 'WARNING' ? 'text-yellow-600 dark:text-yellow-400' :
                                    'text-blue-600 dark:text-blue-400'
                                }`}>{log.level}</span>
                            <span className="flex-1 text-gray-700 dark:text-gray-300">{log.message}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// System Info Tab
const SystemInfoTab = () => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">시스템 정보</h3>

                <div className="grid grid-cols-2 gap-4">
                    {[
                        { label: '버전', value: '1.0.0' },
                        { label: '빌드', value: '2024.12.05.001' },
                        { label: '환경', value: 'Production' },
                        { label: '데이터베이스', value: 'PostgreSQL 15.2' },
                        { label: '가동 시간', value: '15일 3시간' },
                        { label: '총 사용자', value: '1,247' },
                        { label: '활성 규칙', value: '30' },
                        { label: '워크플로우', value: '12' },
                    ].map((item) => (
                        <div key={item.label} className="p-4 bg-gray-50 dark:bg-dark-800 rounded-lg">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{item.label}</div>
                            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.value}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-dark-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">시스템 상태</h3>

                <div className="space-y-3">
                    {[
                        { label: 'CPU 사용률', value: 45, status: 'good' },
                        { label: '메모리 사용률', value: 62, status: 'good' },
                        { label: '디스크 사용률', value: 78, status: 'warning' },
                        { label: '네트워크', value: 23, status: 'good' },
                    ].map((item) => (
                        <div key={item.label}>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">{item.value}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full ${item.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                                        }`}
                                    style={{ width: `${item.value}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
