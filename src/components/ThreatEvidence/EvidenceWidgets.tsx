import { MapPin, ArrowRight, AlertTriangle, Shield, Smartphone, Activity, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ReferenceLine, LineChart, Line, Legend, Cell } from 'recharts';
import type { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';

// 1. Impossible Travel Widget
export const ImpossibleTravelWidget = ({ data }: { data: any }) => {
    return (
        <div className="h-64 bg-gray-100 dark:bg-dark-800 rounded-lg relative overflow-hidden border border-gray-200 dark:border-dark-700">
            {/* Mock Map Background */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>

            <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-center gap-8">
                    {/* Origin */}
                    <div className="text-center z-10">
                        <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-2 ring-4 ring-blue-500/20"></div>
                        <div className="bg-white dark:bg-dark-900 px-3 py-1 rounded shadow-lg border border-gray-200 dark:border-dark-700">
                            <div className="font-bold text-gray-900 dark:text-gray-100">Seoul</div>
                            <div className="text-xs text-gray-500">10:00 AM</div>
                        </div>
                    </div>

                    {/* Path */}
                    <div className="flex flex-col items-center">
                        <div className="text-xs font-bold text-red-500 mb-1">11,000 km / 10 min</div>
                        <div className="text-xs text-red-400 mb-2">Speed: 66,000 km/h</div>
                        <div className="w-32 h-0.5 bg-gradient-to-r from-blue-500 to-red-500 relative">
                            <div className="absolute -top-1 right-0 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                        </div>
                    </div>

                    {/* Destination */}
                    <div className="text-center z-10">
                        <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-2 ring-4 ring-red-500/20"></div>
                        <div className="bg-white dark:bg-dark-900 px-3 py-1 rounded shadow-lg border border-gray-200 dark:border-dark-700">
                            <div className="font-bold text-gray-900 dark:text-gray-100">New York</div>
                            <div className="text-xs text-gray-500">10:10 AM</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 2. App Install Spike Widget
export const AppInstallSpikeWidget = () => {
    const data = Array.from({ length: 14 }, (_, i) => ({
        day: `D-${14 - i}`,
        count: Math.floor(Math.random() * 5) + 1,
        isSpike: false
    }));
    // Add spike
    data.push({ day: 'Today', count: 25, isSpike: true });

    return (
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="day" stroke="#64748b" style={{ fontSize: '10px' }} />
                    <YAxis stroke="#64748b" style={{ fontSize: '10px' }} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                        cursor={{ fill: '#334155', opacity: 0.2 }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.isSpike ? '#ef4444' : '#3b82f6'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

// 3. OS Outdated Widget
export const OSOutdatedWidget = () => {
    const data = [
        { version: 'v14', count: 5 },
        { version: 'v15', count: 15 },
        { version: 'v16', count: 45 },
        { version: 'v17', count: 30 },
        { version: 'v18', count: 5 },
    ];

    return (
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="version" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
                    <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                    <ReferenceLine x="v14" stroke="red" label={{ value: 'YOU', position: 'top', fill: 'red', fontSize: 12, fontWeight: 'bold' }} />
                </AreaChart>
            </ResponsiveContainer>
            <div className="text-center text-sm text-gray-500 mt-2">
                Your device is in the bottom 5% of OS versions.
            </div>
        </div>
    );
};

// 4. Compromised Status Widget
export const CompromisedStatusWidget = () => {
    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-4">
                <div className="p-3 bg-red-500/20 rounded-full">
                    <Smartphone className="w-6 h-6 text-red-500" />
                </div>
                <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Rooting Status</div>
                    <div className="text-lg font-bold text-red-500">DETECTED</div>
                    <div className="text-xs text-red-400">Magisk Manager found</div>
                </div>
            </div>
            <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-center gap-4">
                <div className="p-3 bg-orange-500/20 rounded-full">
                    <Shield className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">System Integrity</div>
                    <div className="text-lg font-bold text-orange-500">FAILED</div>
                    <div className="text-xs text-orange-400">Bootloader Unlocked</div>
                </div>
            </div>
            <div className="col-span-2 p-4 bg-gray-100 dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700">
                <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold text-gray-900 dark:text-gray-100">Evidence Log</span>
                </div>
                <div className="font-mono text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <div>[10:00:01] Process 'su' detected (PID: 1234)</div>
                    <div>[10:00:02] '/system/xbin/su' file exists</div>
                    <div>[10:00:02] SafetyNet Attestation: FAILED (BasicIntegrity)</div>
                </div>
            </div>
        </div>
    );
};

// 5. Anomalous Sequence Widget (Simplified Sankey)
export const AnomalousSequenceWidget = () => {
    return (
        <div className="flex items-center justify-between px-4 py-8 bg-gray-50 dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 overflow-x-auto">
            {/* Normal Flow */}
            <div className="flex flex-col items-center gap-2 opacity-50">
                <div className="text-xs text-gray-500 uppercase">Normal Flow</div>
                <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-green-100 text-green-700 rounded border border-green-200 text-sm">Login</div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <div className="px-3 py-1 bg-green-100 text-green-700 rounded border border-green-200 text-sm">Email</div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <div className="px-3 py-1 bg-green-100 text-green-700 rounded border border-green-200 text-sm">Logout</div>
                </div>
            </div>

            <div className="h-12 w-px bg-gray-300 dark:bg-dark-600 mx-4"></div>

            {/* Anomalous Flow */}
            <div className="flex flex-col items-center gap-2">
                <div className="text-xs text-red-500 font-bold uppercase flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Detected Flow (0.01% Probability)
                </div>
                <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-gray-100 text-gray-700 rounded border border-gray-200 text-sm">Login</div>
                    <ArrowRight className="w-4 h-4 text-red-500" />
                    <div className="px-3 py-1 bg-red-100 text-red-700 rounded border border-red-200 text-sm font-bold ring-2 ring-red-500/20">Admin Page</div>
                    <ArrowRight className="w-4 h-4 text-red-500" />
                    <div className="px-3 py-1 bg-red-100 text-red-700 rounded border border-red-200 text-sm font-bold ring-2 ring-red-500/20">Download DB</div>
                </div>
            </div>
        </div>
    );
};

// 6. Abnormal Time Access Widget
export const AbnormalTimeAccessWidget = () => {
    // 0~23 hour data
    const data = Array.from({ length: 24 }, (_, i) => ({
        hour: i.toString().padStart(2, '0'),
        userAvg: i >= 9 && i <= 18 ? Math.floor(Math.random() * 30) + 50 : Math.floor(Math.random() * 5), // Normal working hours
        orgAvg: i >= 8 && i <= 19 ? Math.floor(Math.random() * 40) + 40 : Math.floor(Math.random() * 10), // Wider org hours
    }));

    return (
        <div className="h-80">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Activity Time Distribution (24h)</span>
                </div>
                <div className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded border border-red-200 font-semibold">
                    Alert Time: 03:00 AM
                </div>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="hour" stroke="#64748b" style={{ fontSize: '10px' }} tickFormatter={(val) => `${val}:00`} />
                    <YAxis stroke="#64748b" style={{ fontSize: '10px' }} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                        labelFormatter={(val) => `${val}:00`}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="orgAvg" name="Organization Avg" stroke="#94a3b8" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="userAvg" name="User Usual Pattern" stroke="#3b82f6" strokeWidth={2} dot={false} />

                    {/* Highlight Alert Time */}
                    <ReferenceLine x="03" stroke="red" label={{ value: 'DETECTED', position: 'top', fill: 'red', fontSize: 12, fontWeight: 'bold' }} strokeDasharray="3 3" />
                </LineChart>
            </ResponsiveContainer>
            <div className="text-center text-sm text-gray-500 mt-2">
                User accessed at <strong>03:00 AM</strong>, which deviates significantly from their usual <strong>09:00 - 18:00</strong> pattern.
            </div>
        </div>
    );
};

// 7. Data Usage Anomaly Widget
export const DataUsageAnomalyWidget = () => {
    // Normal usage ~200MB, Spike 5GB (5000MB)
    const data = Array.from({ length: 7 }, (_, i) => ({
        day: `D-${7 - i}`,
        usage: Math.floor(Math.random() * 100) + 150, // 150-250MB
        limit: 1000,
        isSpike: false
    }));
    data.push({ day: 'Today', usage: 5200, limit: 1000, isSpike: true }); // 5.2GB

    return (
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="day" stroke="#64748b" style={{ fontSize: '10px' }} />
                    <YAxis stroke="#64748b" style={{ fontSize: '10px' }} tickFormatter={(val) => `${val / 1000}GB`} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                        cursor={{ fill: '#334155', opacity: 0.2 }}
                        formatter={(value: any) => [`${(Number(value) / 1000).toFixed(1)} GB`, 'Usage']}
                    />
                    <ReferenceLine y={1000} stroke="orange" strokeDasharray="3 3" label={{ value: 'Daily Limit', position: 'insideTopRight', fill: 'orange', fontSize: 10 }} />
                    <Bar dataKey="usage" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.isSpike ? '#ef4444' : '#3b82f6'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
            <div className="text-center text-sm text-gray-500 mt-2">
                User uploaded <strong>5.2 GB</strong> today, exceeding the daily average of <strong>200 MB</strong> by 2600%.
            </div>
        </div>
    );
};

// 8. Vulnerability Widget (CVE)
export const VulnerabilityWidget = ({ details }: { details: string }) => {
    // Extract CVE ID if present, otherwise default
    const cveId = details.match(/CVE-\d{4}-\d{4,7}/)?.[0] || 'CVE-2024-1234';
    const cvssScore = 9.8;

    return (
        <div className="flex flex-col md:flex-row gap-6 items-center justify-center p-6 bg-gray-50 dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700">
            {/* Score Circle */}
            <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-200 dark:text-dark-600" />
                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={351} strokeDashoffset={351 - (351 * 9.8) / 10} className="text-red-500" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">{cvssScore}</span>
                    <span className="text-xs text-red-500 font-semibold">CRITICAL</span>
                </div>
            </div>

            {/* Details */}
            <div className="flex-1 space-y-4">
                <div>
                    <div className="text-sm text-gray-500 mb-1">Vulnerability ID</div>
                    <div className="text-xl font-mono font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        {cveId}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded border border-red-100 dark:border-red-900/30">
                        <div className="text-xs text-red-600 dark:text-red-400 mb-1">Exploitability</div>
                        <div className="font-semibold text-red-700 dark:text-red-300">Active Exploit</div>
                    </div>
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/10 rounded border border-orange-100 dark:border-orange-900/30">
                        <div className="text-xs text-orange-600 dark:text-orange-400 mb-1">Patch Status</div>
                        <div className="font-semibold text-orange-700 dark:text-orange-300">Overdue (21 days)</div>
                    </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Remote Code Execution (RCE) vulnerability in system component. Immediate patching required.
                </div>
            </div>
        </div>
    );
};

// 9. Prohibited App Widget
export const ProhibitedAppWidget = ({ details }: { details: string }) => {
    const appName = details.match(/Tor Browser|해킹툴|VPN/)?.[0] || 'Unknown App';

    return (
        <div className="p-6 bg-red-50/50 dark:bg-red-900/5 border border-red-100 dark:border-red-900/20 rounded-xl flex items-center gap-6">
            <div className="w-20 h-20 bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-gray-200 dark:border-dark-700 flex items-center justify-center">
                {appName.includes('Tor') ? (
                    <div className="w-12 h-12 bg-purple-900 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">Onion</span>
                    </div>
                ) : (
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                )}
            </div>

            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-bold uppercase tracking-wider">Blacklisted</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">{appName}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{details}</p>

                <div className="flex gap-2">
                    <div className="px-3 py-1 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded text-xs text-gray-500">
                        Package: org.torproject.android
                    </div>
                    <div className="px-3 py-1 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded text-xs text-gray-500">
                        Installed: 2025-12-02
                    </div>
                </div>
            </div>
        </div>
    );
};

// 10. Security Compliance Widget (Encryption, USB, etc)
export const SecurityComplianceWidget = ({ ruleName, details }: { ruleName: string; details: string }) => {
    const items = [
        { label: 'Screen Lock', status: 'pass' },
        { label: 'OS Version', status: 'pass' },
        { label: 'Disk Encryption', status: ruleName.includes('Encryption') || ruleName.includes('암호화') ? 'fail' : 'pass' },
        { label: 'USB Debugging', status: ruleName.includes('USB') ? 'fail' : 'pass' },
        { label: 'Unknown Sources', status: 'pass' },
    ];

    return (
        <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-50 dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">Device Compliance Checklist</h4>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-dark-700">
                {items.map((item, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-4 ${item.status === 'fail' ? 'bg-red-50/50 dark:bg-red-900/5' : ''}`}>
                        <span className={`text-sm font-medium ${item.status === 'fail' ? 'text-red-700 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
                            {item.label}
                        </span>
                        {item.status === 'pass' ? (
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded text-xs font-semibold">
                                <Shield className="w-3 h-3" /> PASS
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded text-xs font-semibold">
                                <Activity className="w-3 h-3" /> FAILED
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="p-4 bg-gray-50 dark:bg-dark-800 border-t border-gray-200 dark:border-dark-700 text-xs text-gray-500">
                Compliance policy 'Corporate-High-Security' requires all items to pass.
            </div>
        </div>
    );
};
