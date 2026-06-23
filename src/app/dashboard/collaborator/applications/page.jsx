"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardList, ExternalLink, Building2, Calendar } from "lucide-react";
import { useSession } from "@/lib/auth-client";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
export default function MyApplications() {
    const { data: session } = useSession();
    const email = session?.user?.email || "";
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(`${API}/application?Applicant_email=${encodeURIComponent(email)}`);
                const apps = await res.json();

                const oppRes = await fetch(`${API}/opportunity`);
                const opps = await oppRes.json();
                const oppMap = {};
                opps.forEach((o) => { oppMap[o._id] = o; });

                const startupRes = await fetch(`${API}/startup`);
                const startups = await startupRes.json();
                const startupMap = {};
                startups.forEach((s) => { startupMap[s._id] = s.startup_name || s.name || ""; });

                const enriched = apps.map((a) => {
                    const opp = oppMap[a.Opportunity_id] || {};
                    return {
                        ...a,
                        role_title: opp.role_title || "Unknown Role",
                        startup_name: startupMap[opp.startup_id] || "Unknown",
                        deadline: opp.deadline,
                    };
                });

                setApplications(enriched);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        if (email) load();
    }, [email]);

    const statusColor = (status) => {
        switch ((status || "").toLowerCase()) {
            case "accepted": return "bg-emerald-100 text-emerald-700";
            case "rejected": return "bg-red-100 text-red-700";
            case "pending":
            default: return "bg-amber-100 text-amber-700";
        }
    };

    if (!email) return null;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 sm:p-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">My Applications</h1>
                <p className="text-sm text-slate-500 mt-1">Track your submitted applications.</p>
            </div>

            {applications.length === 0 ? (
                <div className="text-center py-20">
                    <ClipboardList className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700">No applications yet</h3>
                    <p className="text-sm text-slate-400 mt-1">Browse opportunities and apply to one.</p>
                    <Link
                        href="/dashboard/collaborator/opportunities"
                        className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
                    >
                        Browse Opportunities
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {applications.map((app) => (
                        <div key={app._id} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-sm transition-all">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold text-slate-900">{app.role_title}</h3>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <Building2 className="h-3.5 w-3.5" />
                                            {app.startup_name}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5" />
                                            Applied {new Date(app.applied_at || app._id?.getTimestamp?.() || Date.now()).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 text-xs font-medium rounded-lg ${statusColor(app.Status)}`}>
                                        {(app.Status || "pending").charAt(0).toUpperCase() + (app.Status || "pending").slice(1)}
                                    </span>
                                    {app.Opportunity_id && (
                                        <Link
                                            href={`/dashboard/collaborator/opportunities/${app.Opportunity_id}`}
                                            className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
                                        >
                                            <ExternalLink className="h-4 w-4 text-slate-400" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                            {app.Motivation && (
                                <p className="text-xs text-slate-500 mt-3 line-clamp-2">{app.Motivation}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
