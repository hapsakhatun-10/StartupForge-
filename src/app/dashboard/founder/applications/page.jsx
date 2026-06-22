"use client";

import { useEffect, useState } from "react";
import { Loader2, Check, X, ExternalLink } from "lucide-react";

export default function ApplicationsPage() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);

    const fetchApplications = async () => {
        try {
            const [appsRes, oppsRes] = await Promise.all([
                fetch("http://localhost:5000/application"),
                fetch("http://localhost:5000/opportunity"),
            ]);
            const apps = await appsRes.json();
            const opps = await oppsRes.json();
            const enriched = apps.map((app) => ({
                ...app,
                role_title: opps.find((o) => o._id === app.Opportunity_id)?.role_title || "Unknown",
            }));
            setApplications(enriched);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchApplications(); }, []);

    const handleStatus = async (id, Status) => {
        setUpdating(id);
        try {
            const res = await fetch(`http://localhost:5000/application/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Status }),
            });
            if (res.ok) {
                setApplications((prev) =>
                    prev.map((a) => (a._id === id ? { ...a, Status } : a))
                );
            }
        } catch (e) {
            console.error(e);
        } finally {
            setUpdating(null);
        }
    };

    const statusBadge = (status) => {
        const map = {
            pending: "bg-amber-100 text-amber-700",
            accepted: "bg-emerald-100 text-emerald-700",
            rejected: "bg-red-100 text-red-700",
        };
        return map[status] || "bg-slate-100 text-slate-600";
    };

    if (loading) {
        return (
            <div className="p-6 sm:p-8 flex items-center justify-center min-h-[50vh]">
                <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 sm:p-8 max-w-5xl">
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Applications</h1>
                <p className="text-sm text-slate-500 mt-1">{applications.length} total applications</p>
            </div>

            {applications.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-sm text-slate-500">No applications received yet.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {applications.map((app) => (
                        <div key={app._id} className="bg-white border border-slate-200 rounded-2xl p-5">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${statusBadge(app.Status)}`}>
                                            {app.Status}
                                        </span>
                                        <span className="text-xs text-slate-400">
                                            {app.applied_at ? new Date(app.applied_at).toLocaleDateString() : ""}
                                        </span>
                                    </div>
                                    <h3 className="text-sm font-semibold text-slate-900 mt-2">
                                        {app.Applicant_email}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Applied for: <span className="font-medium text-slate-700">{app.role_title}</span>
                                    </p>
                                    {app.Motivation && (
                                        <p className="text-xs text-slate-600 mt-2 italic line-clamp-2">
                                            &ldquo;{app.Motivation}&rdquo;
                                        </p>
                                    )}
                                    {app.Portfolio_link && (
                                        <a href={app.Portfolio_link} target="_blank" rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 mt-2 font-medium"
                                        >
                                            <ExternalLink className="h-3 w-3" />
                                            Portfolio
                                        </a>
                                    )}
                                </div>

                                {app.Status === "pending" && (
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            onClick={() => handleStatus(app._id, "accepted")}
                                            disabled={updating === app._id}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs font-semibold rounded-xl transition-colors"
                                        >
                                            {updating === app._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleStatus(app._id, "rejected")}
                                            disabled={updating === app._id}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-xs font-semibold rounded-xl transition-colors"
                                        >
                                            {updating === app._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
