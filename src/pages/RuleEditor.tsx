import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { FileCode, Search, Filter, X, Edit2, Save, Settings, Activity, Database, Brain, Globe, Users as UsersIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Severity, DetectionTechnique } from '../data/mockData';

// Dynamic Configuration Panel Component
const RuleConfigPanel = ({ technique, ruleId, isEditing }: { technique: DetectionTechnique; ruleId: string; isEditing: boolean }) => {
    // Mock configuration state (in a real app, this would come from the rule data)
    const [config, setConfig] = useState<any>({});

    const renderFields = () => {
        switch (technique) {
            case 'Static Rule':
                return (
                    <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-dark-800 p-4 rounded-lg border border-gray-200 dark:border-dark-700">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                                <Settings className="w-4 h-4" /> Condition Builder
                            </h4>
                            <div className="space-y-3">
                                <div className="grid grid-cols-3 gap-2">
                                    <input disabled={!isEditing} type="text" placeholder="Field" className="text-sm p-2 rounded border dark:bg-dark-900 dark:border-dark-700" defaultValue="IsCompromised" />
                                    <select disabled={!isEditing} className="text-sm p-2 rounded border dark:bg-dark-900 dark:border-dark-700">
                                        <option>Equals</option>
                                        <option>Contains</option>
                                        <option>Greater Than</option>
                                    </select>
                                    <input disabled={!isEditing} type="text" placeholder="Value" className="text-sm p-2 rounded border dark:bg-dark-900 dark:border-dark-700" defaultValue="True" />
                                </div>
                                {isEditing && <button className="text-xs text-enterprise-500 hover:underline">+ Add Condition</button>}
                            </div>
                        </div>
                    </div>
                );
            case 'Threat Intel':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Source</label>
                                <select disabled={!isEditing} className="w-full text-sm p-2 rounded border dark:bg-dark-900 dark:border-dark-700">
                                    <option>Carbon Black</option>
                                    <option>Lookout</option>
                                    <option>CrowdStrike</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Confidence Level</label>
                                <select disabled={!isEditing} className="w-full text-sm p-2 rounded border dark:bg-dark-900 dark:border-dark-700">
                                    <option>High (80%+)</option>
                                    <option>Medium (50%+)</option>
                                    <option>Low (20%+)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );
            case 'Dynamic Threshold (EMA)':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Lookback Period</label>
                                <div className="flex items-center gap-2">
                                    <input disabled={!isEditing} type="number" className="w-full text-sm p-2 rounded border dark:bg-dark-900 dark:border-dark-700" defaultValue={30} />
                                    <span className="text-xs text-gray-500">Days</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Sensitivity</label>
                                <select disabled={!isEditing} className="w-full text-sm p-2 rounded border dark:bg-dark-900 dark:border-dark-700">
                                    <option>3-Sigma (Standard)</option>
                                    <option>2-Sigma (Sensitive)</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Baseline Key</label>
                                <select disabled={!isEditing} className="w-full text-sm p-2 rounded border dark:bg-dark-900 dark:border-dark-700">
                                    <option>User + Hour</option>
                                    <option>Device + Location</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );
            case 'Unsupervised ML (iForest)':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-medium text-gray-500 mb-1 block">Feature Selection</label>
                            <div className="flex flex-wrap gap-2">
                                {['Login Count', 'Country Count', 'Failed Attempts', 'Data Volume'].map(f => (
                                    <span key={f} className="px-2 py-1 bg-enterprise-500/10 text-enterprise-600 rounded text-xs border border-enterprise-500/20">
                                        {f}
                                    </span>
                                ))}
                                {isEditing && <button className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs border border-gray-200 hover:bg-gray-200">+</button>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Anomaly Threshold</label>
                                <input disabled={!isEditing} type="range" min="0" max="1" step="0.1" className="w-full" defaultValue={0.9} />
                                <div className="text-xs text-right text-gray-500">0.9</div>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Retraining Schedule</label>
                                <select disabled={!isEditing} className="w-full text-sm p-2 rounded border dark:bg-dark-900 dark:border-dark-700">
                                    <option>Daily (Midnight)</option>
                                    <option>Weekly (Sunday)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );
            case 'Spatio-Temporal':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Max Speed (km/h)</label>
                                <input disabled={!isEditing} type="number" className="w-full text-sm p-2 rounded border dark:bg-dark-900 dark:border-dark-700" defaultValue={1000} />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Tolerance</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input disabled={!isEditing} type="number" placeholder="Dist" className="w-full text-sm p-2 rounded border dark:bg-dark-900 dark:border-dark-700" defaultValue={50} />
                                    <span className="text-xs text-gray-500 self-center">km</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'Peer Analysis':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Grouping Key</label>
                                <select disabled={!isEditing} className="w-full text-sm p-2 rounded border dark:bg-dark-900 dark:border-dark-700">
                                    <option>Department</option>
                                    <option>Job Title</option>
                                    <option>Location</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Outlier Percentile</label>
                                <select disabled={!isEditing} className="w-full text-sm p-2 rounded border dark:bg-dark-900 dark:border-dark-700">
                                    <option>Top 1%</option>
                                    <option>Top 5%</option>
                                    <option>Top 10%</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );
            default:
                return <div className="text-sm text-gray-500">No specific configuration for this technique.</div>;
        }
    };

    return (
        <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-enterprise-500" />
                    Configuration Panel
                </h3>
                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-dark-800 rounded text-gray-600 dark:text-gray-400">
                    {technique}
                </span>
            </div>
            <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-xl p-6">
                {renderFields()}
            </div>
        </div>
    );
};

export const RuleEditor = () => {
    const { rules, updateRule } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedRule, setSelectedRule] = useState<string | null>(null);
    const [editingRule, setEditingRule] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<{
        severity: Severity;
        score: number;
        enabled: boolean;
    } | null>(null);
    const [editingSigma, setEditingSigma] = useState<string | null>(null);
    const [sigmaForm, setSigmaForm] = useState<string>('');

    const categories = ['All', ...Array.from(new Set(rules.map(r => r.category)))];

    const filteredRules = rules.filter(rule => {
        const matchesSearch = rule.nameKo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rule.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rule.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || rule.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'Critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'High': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
            case 'Medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            default: return 'bg-green-500/10 text-green-500 border-green-500/20';
        }
    };

    const selectedRuleData = rules.find(r => r.id === selectedRule);

    const [editorContent, setEditorContent] = useState('');

    useEffect(() => {
        if (selectedRuleData) {
            setEditorContent(selectedRuleData.sigmaRule || '');
        }
    }, [selectedRuleData]);

    const handleEdit = (ruleId: string) => {
        const rule = rules.find(r => r.id === ruleId);
        if (rule) {
            setEditingRule(ruleId);
            setEditForm({
                severity: rule.severity,
                score: rule.score,
                enabled: rule.enabled,
            });
        }
    };

    const handleSave = (ruleId: string) => {
        if (editForm) {
            updateRule(ruleId, editForm);
            setEditingRule(null);
            setEditForm(null);
        }
    };

    const handleCancel = () => {
        setEditingRule(null);
        setEditForm(null);
    };

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">탐지 규칙 편집기</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Detection Rule Editor</p>
            </div>

            {/* Filters */}
            <div className="glass-effect rounded-xl p-6 border border-gray-200 dark:border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="규칙 이름 또는 ID 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-dark-900 border border-gray-300 dark:border-dark-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:border-enterprise-500 transition-colors"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-dark-900 border border-gray-300 dark:border-dark-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:border-enterprise-500 transition-colors appearance-none cursor-pointer"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>총 {filteredRules.length}개 규칙</span>
                    <span>|</span>
                    <span>활성: {filteredRules.filter(r => r.enabled).length}개</span>
                </div>
            </div>

            {/* Rules Table */}
            <div className="glass-effect rounded-xl overflow-hidden border border-gray-200 dark:border-white/10">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100 dark:bg-dark-900 border-b border-gray-200 dark:border-dark-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Rule ID</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">탐지명</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">카테고리</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">기술</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">심각도</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">점수</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">상태</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">액션</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
                            {filteredRules.map((rule, index) => (
                                <motion.tr
                                    key={rule.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2, delay: index * 0.02 }}
                                    className="hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <code className="text-sm text-enterprise-500 dark:text-enterprise-400 font-mono">{rule.id}</code>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900 dark:text-gray-100">{rule.nameKo}</div>
                                        <div className="text-xs text-gray-500">{rule.nameEn}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{rule.category}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-dark-700 text-gray-700 dark:text-gray-400 rounded">
                                            {rule.technique}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingRule === rule.id && editForm ? (
                                            <select
                                                value={editForm.severity}
                                                onChange={(e) => setEditForm({ ...editForm, severity: e.target.value as Severity })}
                                                className="text-xs px-2 py-1 border rounded bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100"
                                            >
                                                <option value="Critical">Critical</option>
                                                <option value="High">High</option>
                                                <option value="Medium">Medium</option>
                                                <option value="Low">Low</option>
                                            </select>
                                        ) : (
                                            <span className={`text-xs px-2 py-1 border rounded ${getSeverityColor(rule.severity)}`}>
                                                {rule.severity}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingRule === rule.id && editForm ? (
                                            <input
                                                type="number"
                                                value={editForm.score}
                                                onChange={(e) => setEditForm({ ...editForm, score: parseInt(e.target.value) || 0 })}
                                                className="w-20 px-2 py-1 text-sm border rounded bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100"
                                                min="0"
                                                max="100"
                                            />
                                        ) : (
                                            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{rule.score}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingRule === rule.id && editForm ? (
                                            <button
                                                onClick={() => setEditForm({ ...editForm, enabled: !editForm.enabled })}
                                                className={`px-3 py-1 text-xs rounded transition-colors ${editForm.enabled
                                                    ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                                                    : 'bg-gray-500/20 text-gray-600 dark:text-gray-400'
                                                    }`}
                                            >
                                                {editForm.enabled ? 'ON' : 'OFF'}
                                            </button>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${rule.enabled ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                                                <span className="text-sm text-gray-700 dark:text-gray-300">{rule.enabled ? 'ON' : 'OFF'}</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {editingRule === rule.id ? (
                                                <>
                                                    <button
                                                        onClick={() => handleSave(rule.id)}
                                                        className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                                                    >
                                                        <Save className="w-4 h-4" />
                                                        저장
                                                    </button>
                                                    <button
                                                        onClick={handleCancel}
                                                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                                                    >
                                                        취소
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleEdit(rule.id)}
                                                        className="flex items-center gap-1 text-sm text-enterprise-600 dark:text-enterprise-400 hover:text-enterprise-700 dark:hover:text-enterprise-300 transition-colors"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                        편집
                                                    </button>
                                                    <button
                                                        onClick={() => setSelectedRule(rule.id)}
                                                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-enterprise-500 hover:bg-enterprise-600 text-white rounded transition-colors"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                        수정
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Rule Detail Modal */}
            <AnimatePresence>
                {selectedRule && selectedRuleData && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setSelectedRule(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-dark-900 border border-gray-300 dark:border-dark-700 rounded-xl max-w-3xl w-full max-h-[80vh] overflow-auto"
                        >
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-white dark:bg-dark-900 border-b border-gray-300 dark:border-dark-700 px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <FileCode className="w-6 h-6 text-enterprise-500" />
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{selectedRuleData.nameKo}</h2>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{selectedRuleData.nameEn}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedRule(null)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 space-y-6">
                                {/* Rule Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm text-gray-600 dark:text-gray-500 mb-1">Rule ID</div>
                                        <code className="text-enterprise-500 dark:text-enterprise-400 font-mono">{selectedRuleData.id}</code>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600 dark:text-gray-500 mb-1">Category</div>
                                        <div className="text-gray-900 dark:text-gray-100">{selectedRuleData.category}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600 dark:text-gray-500 mb-1">Detection Technique</div>
                                        <div className="text-gray-900 dark:text-gray-100">{selectedRuleData.technique}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600 dark:text-gray-500 mb-1">Severity / Score</div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs px-2 py-1 border rounded ${getSeverityColor(selectedRuleData.severity)}`}>
                                                {selectedRuleData.severity}
                                            </span>
                                            <span className="text-gray-900 dark:text-gray-100 font-semibold">{selectedRuleData.score}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <div className="text-sm text-gray-600 dark:text-gray-500 mb-2">설명</div>
                                    <p className="text-gray-700 dark:text-gray-300">{selectedRuleData.description}</p>
                                </div>

                            </div>

                            <div className="px-6 pb-6 border-b border-gray-200 dark:border-dark-700 mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                        <FileCode className="w-5 h-5 text-enterprise-500" />
                                        SIGMA Rule / ESQL Editor
                                    </h3>
                                    <button
                                        onClick={() => {
                                            if (selectedRule) {
                                                updateRule(selectedRule, { sigmaRule: editorContent });
                                                alert('Rule updated successfully');
                                            }
                                        }}
                                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-enterprise-500 hover:bg-enterprise-600 text-white rounded transition-colors"
                                    >
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </button>
                                </div>
                                <div className="relative group">
                                    <div className="absolute top-0 right-0 p-2 bg-gray-800 text-xs text-gray-400 rounded-bl-lg rounded-tr-lg border-l border-b border-gray-700 pointer-events-none">
                                        SIGMA / ESQL
                                    </div>
                                    <textarea
                                        value={editorContent}
                                        onChange={(e) => setEditorContent(e.target.value)}
                                        className="w-full h-80 p-4 font-mono text-sm bg-[#1e1e1e] text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-enterprise-500 focus:border-transparent outline-none resize-none leading-relaxed"
                                        placeholder="Enter SIGMA rule or ESQL query here..."
                                        spellCheck="false"
                                    />
                                </div>
                            </div>

                            {/* Dynamic Configuration Panel */}
                            <div className="px-6 pb-6">
                                <RuleConfigPanel
                                    technique={selectedRuleData.technique}
                                    ruleId={selectedRuleData.id}
                                    isEditing={editingSigma === selectedRuleData.id} // Reusing editing state for demo
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
