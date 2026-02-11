import { useEffect } from 'react';
import { initializeFirewallStorage } from '../data/firewallMockData';

export const useFirewallInit = () => {
    useEffect(() => {
        initializeFirewallStorage();
    }, []);
};
