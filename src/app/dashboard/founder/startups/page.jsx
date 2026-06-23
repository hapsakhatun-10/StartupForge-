"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, PlusCircle, ArrowUpRight } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export default function FounderStartups() {
    const { data: session } = useSession();
    const user = session?.user;
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch("http://localhost:5000/startup");
                const all = await res.json();
                setStartups(all.filter((s) => s.founder_email === user?.email));
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        if (user?.email) load();
    }, [user]);

    const stageBadge = (stage) => {
        const map = {
            Idea: "bg-purple-100 text-purple-700",
            Seed: "bg-amber-100 text-amber-700",
            "Series A": "bg-blue-100 text-blue-700",
        };
        return map[stage] || "bg-slate-100 text-slate-600";
    };

    if (!user) return null;

    return (
        <div className="p-6 sm:p-8 max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">My Startups</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage your registered startups.</p>
                </div>
                <Link
                    href="/dashboard/founder/startups/new"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                    <PlusCircle className="h-4 w-4" />
                    Add Startup
                </Link>
            </div>

            {loading ? (
                <div className="flex items-center justify-center min-h-[30vh]">
                    <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : startups.length === 0 ? (
                <div className="text-center py-20">
                    <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700">No startups yet</h3>
                    <p className="text-sm text-slate-400 mt-1">Create your first startup to get started.</p>
                    <Link
                        href="/dashboard/founder/startups/new"
                        className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
                    >
                        <PlusCircle className="h-4 w-4" />
                        Create Startup
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {startups.map((s) => (
                        <Link
                            key={s._id}
                            href={`/dashboard/founder/startups/${s._id}`}
                            className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-all group"
                        >
                            <div>
                                <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                    {s.startup_name}
                                </p>
                                <div className="flex items-center gap-3 mt-1">
                                    {s.industry && (
                                        <span className="text-xs text-slate-500">{s.industry}</span>
                                    )}
                                    {s.funding_stage && (
                                        <span className={`px-2 py-0.5 text-[11px] rounded ${stageBadge(s.funding_stage)}`}>
                                            {s.funding_stage}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 transition-colors shrink-0" />
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
