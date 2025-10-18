import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type NotificationType = 'success' | 'error' | 'info';

interface NotificationState {
    message: string;
    type: NotificationType;
}

interface NotificationContextValue {
    showSuccess: (message: string) => void;
    showError: (message: string) => void;
    showInfo: (message: string) => void;
    clear: () => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

interface NotificationBannerProps {
    notification: NotificationState | null;
    onClose: () => void;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({ notification, onClose }) => {
    if (!notification) {
        return null;
    }

    const backgroundColors: Record<NotificationType, string> = {
        success: '#dcfce7',
        error: '#fee2e2',
        info: '#dbeafe',
    };

    const borderColors: Record<NotificationType, string> = {
        success: '#86efac',
        error: '#fca5a5',
        info: '#93c5fd',
    };

    const textColors: Record<NotificationType, string> = {
        success: '#166534',
        error: '#991b1b',
        info: '#1d4ed8',
    };

    return (
        <div
            role="status"
            aria-live={notification.type === 'error' ? 'assertive' : 'polite'}
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 10,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                padding: '0.75rem 1rem',
                boxSizing: 'border-box',
            }}
        >
            <div
                style={{
                    backgroundColor: backgroundColors[notification.type],
                    border: `1px solid ${borderColors[notification.type]}`,
                    color: textColors[notification.type],
                    borderRadius: '0.75rem',
                    padding: '0.75rem 1rem',
                    maxWidth: '640px',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                }}
            >
                <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{notification.message}</span>
                <button
                    type="button"
                    onClick={onClose}
                    style={{
                        marginLeft: '1.5rem',
                        border: 'none',
                        background: 'transparent',
                        color: textColors[notification.type],
                        fontWeight: 600,
                        cursor: 'pointer',
                    }}
                    aria-label="Dismiss notification"
                >
                    Dismiss
                </button>
            </div>
        </div>
    );
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notification, setNotification] = useState<NotificationState | null>(null);

    const clear = useCallback(() => setNotification(null), []);

    const show = useCallback((type: NotificationType, message: string) => {
        setNotification({ type, message });
    }, []);

    useEffect(() => {
        if (!notification) {
            return;
        }

        const timeout = window.setTimeout(() => {
            setNotification(null);
        }, 5000);

        return () => window.clearTimeout(timeout);
    }, [notification]);

    const value = useMemo(
        () => ({
            showSuccess: (message: string) => show('success', message),
            showError: (message: string) => show('error', message),
            showInfo: (message: string) => show('info', message),
            clear,
        }),
        [show, clear]
    );

    return (
        <NotificationContext.Provider value={value}>
            <NotificationBanner notification={notification} onClose={clear} />
            {children}
        </NotificationContext.Provider>
    );
};