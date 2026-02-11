import { useState } from 'react';
import { Bell, AlertCircle, CheckCircle, Info, Workflow, Filter, Trash2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Notification {
    id: string;
    type: 'alert' | 'system' | 'workflow' | 'info';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    link?: string;
}

// Mock notifications (expanded set)
const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: 'notif-1',
        type: 'alert',
        title: 'High Risk Alert',
        message: '김철수: Impossible Travel detected',
        timestamp: '2 minutes ago',
        read: false,
        link: '/users/user-001'
    },
    {
        id: 'notif-2',
        type: 'workflow',
        title: 'Workflow Completed',
        message: 'Device tag automation completed successfully',
        timestamp: '15 minutes ago',
        read: false,
        link: '/automation'
    },
    {
        id: 'notif-3',
        type: 'system',
        title: 'System Update',
        message: 'Data sync completed: 1,247 users updated',
        timestamp: '1 hour ago',
        read: true
    },
    {
        id: 'notif-4',
        type: 'alert',
        title: 'Medium Risk Alert',
        message: '최지은: Abnormal time access detected',
        timestamp: '2 hours ago',
        read: true,
        link: '/users/user-004'
    },
    {
        id: 'notif-5',
        type: 'info',
        title: 'Daily Report Ready',
        message: 'Your daily security report is ready to download',
        timestamp: '3 hours ago',
        read: true,
        link: '/reports'
    },
    {
        id: 'notif-6',
        type: 'system',
        title: 'Backup Successful',
        message: 'System backup completed successfully at 03:00 AM',
        timestamp: '5 hours ago',
        read: true
    },
    {
        id: 'notif-7',
        type: 'alert',
        title: 'New Device Registered',
        message: 'New device (iPhone 15) registered for user 이영희',
        timestamp: '6 hours ago',
        read: true,
        link: '/users/user-002'
    },
    {
        id: 'notif-8',
        type: 'workflow',
        title: 'Workflow Failed',
        message: 'Auto-remediation failed for device DEV-992',
        timestamp: '8 hours ago',
        read: true,
        link: '/automation'
    }
];

type FilterType = 'all' | 'alert' | 'system' | 'workflow' | 'info';

export const Notifications = () => {
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const [filter, setFilter] = useState<FilterType>('all');

    const filteredNotifications = notifications.filter(n =>
        filter === 'all' || n.type === filter
    );

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'alert':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'workflow':
                return <Workflow className="w-5 h-5 text-blue-500" />;
            case 'system':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'info':
                return <Info className="w-5 h-5 text-gray-500" />;
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Notifications
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        You have <span className="font-semibold text-enterprise-600 dark:text-enterprise-400">{unreadCount}</span> unread notifications
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={markAllAsRead}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                    >
                        <Check className="w-4 h-4" />
                        Mark all as read
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                {[
                    { id: 'all', label: 'All' },
                    { id: 'alert', label: 'Alerts' },
                    { id: 'system', label: 'System' },
                    { id: 'workflow', label: 'Automation' },
                    { id: 'info', label: 'Info' },
                ].map((f) => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id as FilterType)}
                        className={`
                            px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                            ${filter === f.id
                                ? 'bg-enterprise-500 text-white'
                                : 'bg-white dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 border border-gray-200 dark:border-dark-700'
                            }
                        `}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
                <AnimatePresence>
                    {filteredNotifications.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-dark-900 rounded-lg border border-gray-200 dark:border-dark-800">
                            <Bell className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                                No notifications
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                You're all caught up!
                            </p>
                        </div>
                    ) : (
                        filteredNotifications.map((notification) => (
                            <motion.div
                                key={notification.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                className={`
                                    relative flex items-start gap-4 p-4 rounded-lg border transition-all
                                    ${notification.read
                                        ? 'bg-white dark:bg-dark-900 border-gray-200 dark:border-dark-800'
                                        : 'bg-enterprise-50 dark:bg-enterprise-900/10 border-enterprise-100 dark:border-enterprise-900/30'
                                    }
                                `}
                            >
                                <div className="mt-1">{getIcon(notification.type)}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className={`text-sm font-semibold mb-1 ${notification.read ? 'text-gray-900 dark:text-gray-100' : 'text-enterprise-900 dark:text-enterprise-100'
                                                }`}>
                                                {notification.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                                                <span>{notification.timestamp}</span>
                                                {notification.link && (
                                                    <Link
                                                        to={notification.link}
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="text-enterprise-600 dark:text-enterprise-400 hover:underline font-medium"
                                                    >
                                                        View Details
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => deleteNotification(notification.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-gray-100 dark:hover:bg-dark-800"
                                            title="Delete notification"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                {!notification.read && (
                                    <div className="absolute top-4 right-4 w-2 h-2 bg-enterprise-500 rounded-full"></div>
                                )}
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
