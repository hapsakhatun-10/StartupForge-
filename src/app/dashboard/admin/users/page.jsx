"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Ban, CheckCircle, Loader2 } from "lucide-react";
import Loader from "@/components/shared/Loader";
import { useSession } from "@/lib/auth-client";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminUsers() {
    const { data: session } = useSession();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);

    const authHeaders = { headers: { "x-user-email": session?.user?.email || "" } };

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${API}/admin/users`, authHeaders);
            const data = await res.json();
            setUsers(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (session?.user?.email) fetchUsers(); }, [session]);

    const handleBlock = async (id) => {
        setUpdating(id);
        try {
            await fetch(`${API}/admin/users/${id}/block`, { method: "PATCH", ...authHeaders });
            setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, isBlocked: true } : u)));
        } catch (e) {
            console.error(e);
        } finally {
            setUpdating(null);
        }
    };

    const handleUnblock = async (id) => {
        setUpdating(id);
        try {
            await fetch(`${API}/admin/users/${id}/unblock`, { method: "PATCH", ...authHeaders });
            setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, isBlocked: false } : u)));
        } catch (e) {
            console.error(e);
        } finally {
            setUpdating(null);
        }
    };

    if (loading) return <Loader text="Loading users..." />;

    return (
        <div className="p-6 sm:p-8 max-w-6xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Manage Users</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{users.length} total users</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
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
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{user.name}</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${
                                                user.role === "admin"
                                                    ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                                                    : user.role === "founder"
                                                    ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400"
                                                    : "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400"
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                                                user.isBlocked ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${
                                                    user.isBlocked ? "bg-red-500" : "bg-emerald-500"
                                                }`} />
                                                {user.isBlocked ? "Blocked" : "Active"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {user.role !== "admin" && (
                                                updating === user._id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin text-slate-400 dark:text-slate-500 ml-auto" />
                                                ) : user.isBlocked ? (
                                                    <button
                                                        onClick={() => handleUnblock(user._id)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors"
                                                    >
                                                        <CheckCircle className="h-3 w-3" />
                                                        Unblock
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleBlock(user._id)}
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
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
