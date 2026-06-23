"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function NotificationBell() {
    const { data: session } = useSession();
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    const email = session?.user?.email;

    const fetchNotifications = useCallback(async () => {
        if (!email) return;
        try {
            const res = await fetch(`${API}/notification/${email}`);
            const data = await res.json();
            setNotifications(data);
        } catch {
            // silent
        }
    }, [email]);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    useEffect(() => {
        const handleClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const markRead = async (id) => {
        await fetch(`${API}/notification/${id}/read`, { method: "PATCH" });
        setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    };

    const markAllRead = async () => {
        setLoading(true);
        await fetch(`${API}/notification/read-all/${email}`, { method: "PATCH" });
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setLoading(false);
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    if (!email) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setOpen(!open)}
                className="relative h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 min-w-[16px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</p>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                disabled={loading}
                                className="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 font-medium"
                            >
                                {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCheck className="h-3 w-3" />}
                                Mark all read
                            </button>
                        )}
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="text-center py-8 text-sm text-slate-400">No notifications yet.</div>
                        ) : (
                            notifications.map((n) => (
                                <div
                                    key={n._id}
                                    onClick={() => !n.read && markRead(n._id)}
                                    className={`px-4 py-3 border-b border-slate-50 dark:border-slate-800 cursor-pointer transition-colors ${
                                        n.read
                                            ? "bg-white dark:bg-slate-900"
                                            : "bg-violet-50/50 dark:bg-violet-900/20"
                                    }`}
                                >
                                    <p className={`text-sm ${n.read ? "text-slate-600 dark:text-slate-400" : "text-slate-900 dark:text-white font-medium"}`}>
                                        {n.message}
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-1">
                                        {n.createdAt
                                            ? new Date(n.createdAt).toLocaleDateString("en-US", {
                                                  month: "short",
                                                  day: "numeric",
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                              })
                                            : ""}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
