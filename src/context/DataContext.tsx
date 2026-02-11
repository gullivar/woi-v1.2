import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { DETECTION_RULES, MOCK_USERS, ORG_RISK_INDEX, RISK_TREND_DATA, THREAT_MAP_DATA, RISK_TREND_30_DAYS, DEVICE_PLATFORM_DATA, THREAT_TYPE_DATA, RISK_HEATMAP_DATA } from '../data/mockData';
import type { DetectionRule, User } from '../data/mockData';

interface DataContextType {
    rules: DetectionRule[];
    users: User[];
    orgRiskIndex: typeof ORG_RISK_INDEX;
    riskTrendData: typeof RISK_TREND_DATA;
    riskTrend30Days: typeof RISK_TREND_30_DAYS;
    threatMapData: typeof THREAT_MAP_DATA;
    devicePlatformData: typeof DEVICE_PLATFORM_DATA;
    threatTypeData: typeof THREAT_TYPE_DATA;
    riskHeatmapData: typeof RISK_HEATMAP_DATA;
    getUserById: (id: string) => User | undefined;
    getRuleById: (id: string) => DetectionRule | undefined;
    updateRule: (id: string, updates: Partial<DetectionRule>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [rules, setRules] = useState<DetectionRule[]>(DETECTION_RULES);

    const getUserById = (id: string) => MOCK_USERS.find(user => user.id === id);
    const getRuleById = (id: string) => rules.find(rule => rule.id === id);

    const updateRule = (id: string, updates: Partial<DetectionRule>) => {
        setRules(prevRules =>
            prevRules.map(rule =>
                rule.id === id ? { ...rule, ...updates } : rule
            )
        );
    };

    const value: DataContextType = {
        rules,
        users: MOCK_USERS,
        orgRiskIndex: ORG_RISK_INDEX,
        riskTrendData: RISK_TREND_DATA,
        riskTrend30Days: RISK_TREND_30_DAYS,
        threatMapData: THREAT_MAP_DATA,
        devicePlatformData: DEVICE_PLATFORM_DATA,
        threatTypeData: THREAT_TYPE_DATA,
        riskHeatmapData: RISK_HEATMAP_DATA,
        getUserById,
        getRuleById,
        updateRule,
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
