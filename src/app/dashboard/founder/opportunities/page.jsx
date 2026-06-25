"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Crown, PlusCircle, Pencil, Trash2, Loader2, Briefcase, Sparkles } from "lucide-react";
import { useSession } from "@/lib/auth-client";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const FREE_LIMIT = 3;

export default function OpportunitiesPage() {
    const { data: session } = useSession();
    const user = session?.user;
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);
    const [premium, setPremium] = useState(null);
    const [myCount, setMyCount] = useState(0);

    useEffect(() => {
        if (!user?.email) return;
        Promise.all([
            fetch(`${API}/opportunity`).then((r) => r.json()),
            fetch(`${API}/payment/check/${user.email}`).then((r) => r.json()),
            fetch(`${API}/startup`).then((r) => r.json()),
        ])
            .then(([opps, pay, startups]) => {
                const data = Array.isArray(opps) ? opps : opps.data || [];
                const mine = startups.filter((s) => s.founder_email === user.email);
                const ids = mine.map((s) => s._id);
                setOpportunities(data.filter((o) => ids.includes(o.startup_id)));
                setPremium(pay.isPremium);
                setMyCount(data.filter((o) => ids.includes(o.startup_id)).length);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [user?.email]);

    const handleDelete = async (id) => {
        if (!confirm("Delete this opportunity?")) return;
        setDeleting(id);
        try {
            await fetch(`${API}/opportunity/${id}?founder_email=${encodeURIComponent(user.email)}`, { method: "DELETE" });
            setOpportunities((prev) => prev.filter((o) => o._id !== id));
            setMyCount((c) => c - 1);
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

    const atLimit = !premium && myCount >= FREE_LIMIT;

    return (
        <div className="p-6 sm:p-8 max-w-5xl">
            <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Opportunities</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{opportunities.length} opportunities posted</p>
                </div>
                <Link
                    href={atLimit ? "/dashboard/founder/premium" : "/dashboard/founder/opportunities/new"}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                    {atLimit ? <Crown className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
                    {atLimit ? "Upgrade to Post More" : "Add Opportunity"}
                </Link>
            </div>

            {atLimit && (
                <div className="mb-6 px-5 py-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                            Free limit reached
                        </p>
                        <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                            You&apos;ve used all {FREE_LIMIT} free slots.{" "}
                            <Link href="/dashboard/founder/premium" className="underline font-medium">
                                Upgrade to Premium
                            </Link>{" "}
                            for unlimited opportunity postings.
                        </p>
                    </div>
                </div>
            )}

            {premium && (
                <div className="mb-6 px-4 py-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
                    <Crown className="h-4 w-4" />
                    Premium — unlimited posting active
                </div>
            )}

            {opportunities.length === 0 ? (
                <div className="text-center py-20">
                    <Briefcase className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">No opportunities yet.</p>
                    <Link
                        href={atLimit ? "/dashboard/founder/premium" : "/dashboard/founder/opportunities/new"}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
                    >
                        {atLimit ? <Crown className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
                        {atLimit ? "Upgrade to Post" : "Post Your First Opportunity"}
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {opportunities.map((opp) => (
                        <div
                            key={opp._id}
                            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex items-center justify-between gap-4"
                        >
                            <div className="min-w-0">
                                <h3 className="font-semibold text-slate-900 dark:text-white">{opp.role_title}</h3>
                                <div className="flex flex-wrap gap-2 mt-1.5">
                                    {opp.work_type && (
                                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-md">{opp.work_type}</span>
                                    )}
                                    {opp.commitment_level && (
                                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-md">{opp.commitment_level}</span>
                                    )}
                                    {opp.deadline && (
                                        <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs rounded-md">
                                            Due: {new Date(opp.deadline).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <Link
                                    href={`/dashboard/founder/opportunities/${opp._id}/edit`}
                                    className="flex items-center justify-center h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 transition-colors"
                                >
                                    <Pencil className="h-4 w-4" />
                                </Link>
                                <button
                                    onClick={() => handleDelete(opp._id)}
                                    disabled={deleting === opp._id}
                                    className="flex items-center justify-center h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors disabled:opacity-50"
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
