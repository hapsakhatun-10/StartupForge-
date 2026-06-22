"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, ChevronRight, Building2, Briefcase } from "lucide-react";

export default function StartupsPage() {
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetch("http://localhost:5000/startup")
            .then((r) => r.json())
            .then((d) => {
                setStartups(d);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filtered = startups.filter((s) =>
        s.startup_name?.toLowerCase().includes(search.toLowerCase())
    );

    const stageBadge = (stage) => {
        const map = {
            Idea: "bg-purple-100 text-purple-700",
            Seed: "bg-amber-100 text-amber-700",
            "Series A": "bg-blue-100 text-blue-700",
        };
        return map[stage] || "bg-slate-100 text-slate-600";
    };

    const initials = (name) =>
        (name || "?")
            .split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

    const avatarGradient = (name) => {
        const g = [
            "from-indigo-600 to-purple-500",
            "from-teal-500 to-emerald-500",
            "from-orange-500 to-rose-500",
            "from-sky-600 to-indigo-500",
            "from-pink-500 to-fuchsia-500",
            "from-lime-500 to-emerald-500",
        ];
        let hash = 0;
        for (let i = 0; i < (name || "").length; i++)
            hash = name.charCodeAt(i) + ((hash << 5) - hash);

        return g[Math.abs(hash) % g.length];
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">

            {/* header */}
            <div className="border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                                Startups
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                {startups.length} startups registered
                            </p>
                        </div>

                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>

                    </div>
                </div>
            </div>

            {/* GRID */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                    {filtered.map((startup) => (
                        <div
                            key={startup._id}
                            className="group bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg hover:border-indigo-300 transition flex flex-col justify-between"
                        >

                            {/* top */}
                            <div>

                                <div className="flex items-start justify-between gap-3">

                                    <div className="flex items-center gap-3 min-w-0">

                                        <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${avatarGradient(startup.startup_name)} flex items-center justify-center text-white font-bold`}>
                                            {initials(startup.startup_name)}
                                        </div>

                                        <div className="min-w-0">
                                            <h2 className="text-sm font-semibold text-slate-900 truncate group-hover:text-indigo-600">
                                                {startup.startup_name}
                                            </h2>

                                            {startup.funding_stage && (
                                                <span className={`inline-block mt-1 px-2 py-0.5 text-[11px] rounded ${stageBadge(startup.funding_stage)}`}>
                                                    {startup.funding_stage}
                                                </span>
                                            )}
                                        </div>

                                    </div>

                                </div>

                                <div className="mt-4 space-y-1">

                                    {startup.industry && (
                                        <div className="flex items-center gap-1 text-xs text-slate-500">
                                            <Briefcase className="h-3 w-3" />
                                            {startup.industry}
                                        </div>
                                    )}

                                    {startup.founder_email && (
                                        <div className="flex items-center gap-1 text-xs text-slate-400">
                                            <Building2 className="h-3 w-3" />
                                            {startup.founder_email}
                                        </div>
                                    )}

                                </div>

                            </div>

                            {/* bottom button */}
                            <Link
                                href={`/startups/${startup._id}`}
                                className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-indigo-600 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-indigo-700 transition"
                            >
                                View
                                <ChevronRight className="h-4 w-4" />
                            </Link>

                        </div>
                    ))}

                </div>

                {/* empty */}
                {filtered.length === 0 && (
                    <div className="text-center py-20 text-slate-500">
                        No startups found
                    </div>
                )}
            </div>
        </div>
    );
}