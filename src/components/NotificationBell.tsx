import { useState } from 'react';
import { Bell, X, AlertCircle, CheckCircle, Info, Workflow as WorkflowIcon } from 'lucide-react';
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

// Mock notifications
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
];

export const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'alert':
                return <AlertCircle className="w-4 h-4 text-red-500" />;
            case 'workflow':
                return <WorkflowIcon className="w-4 h-4 text-blue-500" />;
            case 'system':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'info':
                return <Info className="w-4 h-4 text-gray-500" />;
        }
    };

    return (
        <div className="relative">
            {/* Bell Icon Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-lg shadow-lg overflow-hidden z-50"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-dark-800">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    Notifications
                                </h3>
                                <div className="flex items-center gap-2">
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={markAllAsRead}
                                            className="text-xs text-enterprise-600 dark:text-enterprise-400 hover:underline"
                                        >
                                            Mark all as read
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Notifications List */}
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <Bell className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-400">No notifications</p>
                                    </div>
                                ) : (
                                    notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`border-b border-gray-200 dark:border-dark-800 last:border-0 ${!notification.read ? 'bg-enterprise-500/5' : ''
                                                }`}
                                        >
                                            {notification.link ? (
                                                <Link
                                                    to={notification.link}
                                                    onClick={() => {
                                                        markAsRead(notification.id);
                                                        setIsOpen(false);
                                                    }}
                                                    className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
                                                >
                                                    <NotificationContent notification={notification} getIcon={getIcon} />
                                                </Link>
                                            ) : (
                                                <div
                                                    onClick={() => markAsRead(notification.id)}
                                                    className="px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
                                                >
                                                    <NotificationContent notification={notification} getIcon={getIcon} />
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Footer */}
                            <Link
                                to="/notifications"
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-3 text-center text-sm font-medium text-enterprise-600 dark:text-enterprise-400 hover:bg-gray-50 dark:hover:bg-dark-800 border-t border-gray-200 dark:border-dark-800"
                            >
                                View all notifications
                            </Link>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

const NotificationContent = ({
    notification,
    getIcon
}: {
    notification: Notification;
    getIcon: (type: Notification['type']) => JSX.Element;
}) => (
    <div className="flex items-start gap-3">
        <div className="mt-0.5">{getIcon(notification.type)}</div>
        <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {notification.title}
                </p>
                {!notification.read && (
                    <div className="w-2 h-2 bg-enterprise-500 rounded-full flex-shrink-0 mt-1.5"></div>
                )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                {notification.message}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {notification.timestamp}
            </p>
        </div>
    </div>
);
