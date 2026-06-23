"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building2, CheckCircle, Trash2, Loader2 } from "lucide-react";
import Loader from "@/components/shared/Loader";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminStartups() {
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState(null);

    const fetchStartups = async () => {
        try {
            const res = await fetch(`${API}/admin/startups`);
            const data = await res.json();
            setStartups(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStartups(); }, []);

    const handleApprove = async (id) => {
        setActionId(id);
        try {
            await fetch(`${API}/admin/startups/${id}/approve`, { method: "PATCH" });
            setStartups((prev) =>
                prev.map((s) => (s._id === id ? { ...s, status: "active", approved: true } : s))
            );
        } catch (e) {
            console.error(e);
        } finally {
            setActionId(null);
        }
    };

    const handleRemove = async (id) => {
        if (!confirm("Remove this startup permanently?")) return;
        setActionId(id);
        try {
            await fetch(`${API}/admin/startups/${id}`, { method: "DELETE" });
            setStartups((prev) => prev.filter((s) => s._id !== id));
        } catch (e) {
            console.error(e);
        } finally {
            setActionId(null);
        }
    };

    if (loading) return <Loader text="Loading startups..." />;

    return (
        <div className="p-6 sm:p-8 max-w-6xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Manage Startups</h1>
                        <p className="text-sm text-slate-500 mt-0.5">{startups.length} total startups</p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Startup</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Founder</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Industry</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {startups.map((s) => (
                                    <tr key={s._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">{s.startup_name}</td>
                                        <td className="px-6 py-4 text-slate-600">{s.founder_email}</td>
                                        <td className="px-6 py-4 text-slate-600">{s.industry || "\u2014"}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                                                s.status === "active" || s.approved
                                                    ? "text-emerald-600"
                                                    : "text-amber-600"
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${
                                                    s.status === "active" || s.approved
                                                        ? "bg-emerald-500"
                                                        : "bg-amber-500"
                                                }`} />
                                                {s.status === "active" || s.approved ? "Active" : "Pending"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {(!s.approved || s.status !== "active") && (
                                                    <button
                                                        onClick={() => handleApprove(s._id)}
                                                        disabled={actionId === s._id}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs font-semibold rounded-lg transition-colors"
                                                    >
                                                        {actionId === s._id ? (
                                                            <Loader2 className="h-3 w-3 animate-spin" />
                                                        ) : (
                                                            <CheckCircle className="h-3 w-3" />
                                                        )}
                                                        Approve
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleRemove(s._id)}
                                                    disabled={actionId === s._id}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-xs font-semibold rounded-lg transition-colors"
                                                >
                                                    {actionId === s._id ? (
                                                        <Loader2 className="h-3 w-3 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="h-3 w-3" />
                                                    )}
                                                    Remove
                                                </button>
                                            </div>
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
