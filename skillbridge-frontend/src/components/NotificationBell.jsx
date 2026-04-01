import { useState, useEffect, useRef } from "react";
import { getNotifications, getUnreadNotificationCount, markNotificationAsRead, markAllNotificationsAsRead } from "../services/api";
import { IconBell, IconMessageCircle, IconClipboard, IconTarget } from "./Icons";
import "./NotificationBell.css";

function NotificationBell({ userId }) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Fetch unread count periodically
    useEffect(() => {
        if (!userId) return;
        const fetchCount = () => {
            getUnreadNotificationCount(userId)
                .then((data) => setUnreadCount(data.count || 0))
                .catch(() => {});
        };
        fetchCount();
        const interval = setInterval(fetchCount, 15000);
        return () => clearInterval(interval);
    }, [userId]);

    // Fetch full list when dropdown opens
    useEffect(() => {
        if (!isOpen || !userId) return;
        getNotifications(userId)
            .then(setNotifications)
            .catch(() => setNotifications([]));
    }, [isOpen, userId]);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleMarkAllRead = async () => {
        await markAllNotificationsAsRead(userId);
        setUnreadCount(0);
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const handleClickNotification = async (notification) => {
        if (!notification.read) {
            await markNotificationAsRead(notification.id);
            setUnreadCount((c) => Math.max(0, c - 1));
            setNotifications((prev) =>
                prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
            );
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case "MESSAGE": return <IconMessageCircle size={18} />;
            case "APPLICATION": return <IconClipboard size={18} />;
            case "MATCH": return <IconTarget size={18} />;
            default: return <IconBell size={18} />;
        }
    };

    const timeAgo = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);
        if (diff < 60) return "just now";
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    return (
        <div className="notif-bell-wrapper" ref={dropdownRef}>
            <button
                className={`notif-bell-btn ${isOpen ? "active" : ""}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Notifications"
            >
                <IconBell size={22} className="notif-bell-icon" />
                {unreadCount > 0 && (
                    <span className="notif-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <div className="notif-dropdown">
                    <div className="notif-dropdown-header">
                        <h4>Notifications</h4>
                        {unreadCount > 0 && (
                            <button className="notif-mark-all" onClick={handleMarkAllRead}>
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="notif-dropdown-list">
                        {notifications.length === 0 ? (
                            <p className="notif-empty">No notifications yet</p>
                        ) : (
                            notifications.slice(0, 20).map((n) => (
                                <div
                                    key={n.id}
                                    className={`notif-item ${!n.read ? "unread" : ""}`}
                                    onClick={() => handleClickNotification(n)}
                                >
                                    <span className="notif-item-icon">{getIcon(n.type)}</span>
                                    <div className="notif-item-content">
                                        <p className="notif-item-title">{n.title}</p>
                                        <p className="notif-item-message">{n.message}</p>
                                        <span className="notif-item-time">{timeAgo(n.createdAt)}</span>
                                    </div>
                                    {!n.read && <span className="notif-item-dot"></span>}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default NotificationBell;
