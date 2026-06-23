"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle, Pencil, Trash2, Loader2, Briefcase } from "lucide-react";

export default function OpportunitiesPage() {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5000/opportunity")
            .then((r) => r.json())
            .then(setOpportunities)
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id) => {
        if (!confirm("Delete this opportunity?")) return;
        setDeleting(id);
        try {
            await fetch(`http://localhost:5000/opportunity/${id}`, { method: "DELETE" });
            setOpportunities((prev) => prev.filter((o) => o._id !== id));
        } catch (e) {
            console.error(e);
        } finally {
            setDeleting(null);
        }
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
            <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Opportunities</h1>
                    <p className="text-sm text-slate-500 mt-1">{opportunities.length} opportunities posted</p>
                </div>
                <Link
                    href="/dashboard/founder/opportunities/new"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                    <PlusCircle className="h-4 w-4" />
                    Add Opportunity
                </Link>
            </div>

            {opportunities.length === 0 ? (
                <div className="text-center py-20">
                    <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-sm text-slate-500 mb-4">No opportunities yet.</p>
                    <Link
                        href="/dashboard/founder/opportunities/new"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
                    >
                        <PlusCircle className="h-4 w-4" />
                        Post Your First Opportunity
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {opportunities.map((opp) => (
                        <div
                            key={opp._id}
                            className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between gap-4"
                        >
                            <div className="min-w-0">
                                <h3 className="font-semibold text-slate-900">{opp.role_title}</h3>
                                <div className="flex flex-wrap gap-2 mt-1.5">
                                    {opp.work_type && (
                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-md">{opp.work_type}</span>
                                    )}
                                    {opp.commitment_level && (
                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-md">{opp.commitment_level}</span>
                                    )}
                                    {opp.deadline && (
                                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded-md">
                                            Due: {new Date(opp.deadline).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <Link
                                    href={`/dashboard/founder/opportunities/${opp._id}/edit`}
                                    className="flex items-center justify-center h-9 w-9 rounded-xl bg-slate-100 text-slate-600 hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
                                >
                                    <Pencil className="h-4 w-4" />
                                </Link>
                                <button
                                    onClick={() => handleDelete(opp._id)}
                                    disabled={deleting === opp._id}
                                    className="flex items-center justify-center h-9 w-9 rounded-xl bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-red-600 transition-colors disabled:opacity-50"
                                >
                                    {deleting === opp._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
