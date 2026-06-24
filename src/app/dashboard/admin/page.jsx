"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
    Users, Building2, Briefcase, DollarSign, Shield,
    CheckCircle, Trash2, Ban, Loader2, RefreshCw,
    Activity, UserCheck, ChevronRight, TrendingUp
} from "lucide-react";
import Link from "next/link";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import Loader from "@/components/shared/Loader";
import { useSession } from "@/lib/auth-client";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const ROLE_COLORS = { founder: "#8b5cf6", collaborator: "#14b8a6", admin: "#f59e0b" };
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function tsFromId(id) {
    if (!id || typeof id !== "string") return null;
    const ts = parseInt(id.substring(0, 8), 16);
    return isNaN(ts) ? null : ts * 1000;
}

export default function AdminOverview() {
    const { data: session } = useSession();
    const email = session?.user?.email;
    const authHeaders = useMemo(() => ({ headers: { "x-user-email": email || "" } }), [email]);

    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startupActionId, setStartupActionId] = useState(null);
    const [userActionId, setUserActionId] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchAll = useCallback(async () => {
        if (!email) return;
        try {
            const [s, u, st] = await Promise.all([
                fetch(`${API}/admin/stats`, authHeaders).then(r => r.json()),
                fetch(`${API}/admin/users`, authHeaders).then(r => r.json()),
                fetch(`${API}/admin/startups`, authHeaders).then(r => r.json()),
            ]);
            setStats(s);
            setUsers((u || []).sort((a, b) => (tsFromId(b._id) || 0) - (tsFromId(a._id) || 0)));
            setStartups((st || []).sort((a, b) => (tsFromId(b._id) || 0) - (tsFromId(a._id) || 0)));
            setLastUpdated(new Date());
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [email, authHeaders]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const growthData = useMemo(() => {
        const now = new Date();
        const months = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push({ label: MONTHS[d.getMonth()], count: 0 });
        }
        users.forEach((u) => {
            const ts = tsFromId(u._id);
            if (!ts) return;
            const d = new Date(ts);
            const m = months.find(m => m.label === MONTHS[d.getMonth()]);
            if (m) m.count++;
        });
        return months;
    }, [users]);

    const roleData = useMemo(() => {
        const counts = { founder: 0, collaborator: 0, admin: 0 };
        users.forEach((u) => { if (u.role !== "admin" && counts[u.role] !== undefined) counts[u.role]++; });
        return Object.entries(counts)
            .filter(([, c]) => c > 0)
            .map(([role, value]) => ({ name: role.charAt(0).toUpperCase() + role.slice(1), value, color: ROLE_COLORS[role] }));
    }, [users]);

    const statCards = useMemo(() => [
        { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "from-blue-500 to-indigo-600" },
        { label: "Total Startups", value: stats?.totalStartups || 0, icon: Building2, color: "from-violet-500 to-fuchsia-500" },
        { label: "Total Opportunities", value: stats?.totalOpportunities || 0, icon: Briefcase, color: "from-amber-500 to-orange-600" },
        { label: "Total Revenue", value: `$${stats?.totalRevenue || 0}`, icon: DollarSign, color: "from-emerald-500 to-teal-600" },
    ], [stats]);

    const handleApprove = async (id) => {
        setStartupActionId(id);
        try {
            await fetch(`${API}/admin/startups/${id}/approve`, { method: "PATCH", ...authHeaders });
            setStartups(prev => prev.map(s => s._id === id ? { ...s, status: "active", approved: true } : s));
        } catch (e) { console.error(e); }
        finally { setStartupActionId(null); }
    };

    const handleRemoveStartup = async (id) => {
        if (!confirm("Remove this startup permanently?")) return;
        setStartupActionId(id);
        try {
            await fetch(`${API}/admin/startups/${id}`, { method: "DELETE", ...authHeaders });
            setStartups(prev => prev.filter(s => s._id !== id));
            setStats(prev => prev ? { ...prev, totalStartups: prev.totalStartups - 1 } : prev);
        } catch (e) { console.error(e); }
        finally { setStartupActionId(null); }
    };

    const handleBlock = async (id) => {
        setUserActionId(id);
        try {
            await fetch(`${API}/admin/users/${id}/block`, { method: "PATCH", ...authHeaders });
            setUsers(prev => prev.map(u => u._id === id ? { ...u, isBlocked: true } : u));
        } catch (e) { console.error(e); }
        finally { setUserActionId(null); }
    };

    const handleUnblock = async (id) => {
        setUserActionId(id);
        try {
            await fetch(`${API}/admin/users/${id}/unblock`, { method: "PATCH", ...authHeaders });
            setUsers(prev => prev.map(u => u._id === id ? { ...u, isBlocked: false } : u));
        } catch (e) { console.error(e); }
        finally { setUserActionId(null); }
    };

    if (loading) return <Loader text="Loading admin dashboard..." />;

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-8"
            >
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
                        <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {lastUpdated ? `Last updated ${lastUpdated.toLocaleTimeString()}` : "Platform overview"}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => { setLoading(true); fetchAll(); }}
                    className="h-9 w-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                    <RefreshCw className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                </button>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((card, i) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.08 }}
                        className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                    >
                        <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 shadow-sm`}>
                            <card.icon className="h-5 w-5 text-white" />
                        </div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{card.value}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{card.label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm"
                >
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-violet-500" />
                        User Growth (6 months)
                    </h3>
                    {growthData.some(d => d.count > 0) ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={growthData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={{ stroke: "#e2e8f0" }} />
                                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={{ stroke: "#e2e8f0" }} allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "13px" }}
                                    cursor={{ fill: "#f1f5f9" }}
                                />
                                <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} maxBarSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-[220px] text-sm text-slate-400 dark:text-slate-500">
                            No user data yet
                        </div>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.25 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm"
                >
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-violet-500" />
                        User Roles
                    </h3>
                    {roleData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie
                                    data={roleData}
                                    cx="50%" cy="50%"
                                    innerRadius={55} outerRadius={85}
                                    paddingAngle={3} dataKey="value"
                                >
                                    {roleData.map(e => <Cell key={e.name} fill={e.color} />)}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "13px" }}
                                />
                                <Legend
                                    verticalAlign="bottom" height={36}
                                    formatter={(value) => <span className="text-xs text-slate-600 dark:text-slate-400">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-[220px] text-sm text-slate-400 dark:text-slate-500">
                            No user data yet
                        </div>
                    )}
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm mb-8"
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-violet-500" />
                        Manage Startups
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{startups.length} total</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Startup</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Founder</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Industry</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {startups.slice(0, 5).map(s => (
                                <tr key={s._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{s.startup_name}</td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{s.founder_email}</td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{s.industry || "\u2014"}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                                            s.status === "active" || s.approved
                                                ? "text-emerald-600 dark:text-emerald-400"
                                                : "text-amber-600 dark:text-amber-400"
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${
                                                s.status === "active" || s.approved ? "bg-emerald-500" : "bg-amber-500"
                                            }`} />
                                            {s.status === "active" || s.approved ? "Active" : "Pending"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {(!s.approved || s.status !== "active") && (
                                                <button
                                                    onClick={() => handleApprove(s._id)}
                                                    disabled={startupActionId === s._id}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs font-semibold rounded-lg transition-colors"
                                                >
                                                    {startupActionId === s._id
                                                        ? <Loader2 className="h-3 w-3 animate-spin" />
                                                        : <CheckCircle className="h-3 w-3" />}
                                                    Approve
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleRemoveStartup(s._id)}
                                                disabled={startupActionId === s._id}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-xs font-semibold rounded-lg transition-colors"
                                            >
                                                {startupActionId === s._id
                                                    ? <Loader2 className="h-3 w-3 animate-spin" />
                                                    : <Trash2 className="h-3 w-3" />}
                                                Remove
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {startups.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-400 dark:text-slate-500">
                                        No startups registered yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {startups.length > 5 && (
                    <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-700 text-right">
                        <Link href="/dashboard/admin/startups" className="text-xs font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300">
                            View all {startups.length} startups <ChevronRight className="h-3 w-3 inline" />
                        </Link>
                    </div>
                )}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-500" />
                        Manage Users
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{users.length} total</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {users.slice(0, 5).map(u => (
                                <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{u.name}</td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{u.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${
                                            u.role === "admin"
                                                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                                                : u.role === "founder"
                                                ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400"
                                                : "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400"
                                        }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                                            u.isBlocked ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${u.isBlocked ? "bg-red-500" : "bg-emerald-500"}`} />
                                            {u.isBlocked ? "Blocked" : "Active"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {u.role !== "admin" && (
                                            userActionId === u._id ? (
                                                <Loader2 className="h-4 w-4 animate-spin text-slate-400 dark:text-slate-500 ml-auto" />
                                            ) : u.isBlocked ? (
                                                <button
                                                    onClick={() => handleUnblock(u._id)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors"
                                                >
                                                    <UserCheck className="h-3 w-3" />
                                                    Unblock
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleBlock(u._id)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors"
                                                >
                                                    <Ban className="h-3 w-3" />
                                                    Block
                                                </button>
                                            )
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-400 dark:text-slate-500">
                                        No users registered yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {users.length > 5 && (
                    <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-700 text-right">
                        <Link href="/dashboard/admin/users" className="text-xs font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300">
                            View all {users.length} users <ChevronRight className="h-3 w-3 inline" />
                        </Link>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
