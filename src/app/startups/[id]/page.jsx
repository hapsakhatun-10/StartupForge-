"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowUpRight,
    Mail,
    Calendar,
    FileText,
    Target,
    Layers,
    Tag,
} from "lucide-react";

export default function StartupDetailPage() {
    const { id } = useParams();
    const [startup, setStartup] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:5000/startup")
            .then((r) => r.json())
            .then((data) => {
                setStartup(data.find((s) => s._id === id) || null);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    const initials = (name) =>
        (name || "?")
            .split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

    const avatarGradient = (name) => {
        const g = [
            "from-violet-600 to-fuchsia-500",
            "from-teal-600 to-cyan-500",
            "from-rose-600 to-pink-500",
            "from-amber-600 to-orange-500",
            "from-blue-600 to-indigo-500",
            "from-emerald-600 to-teal-500",
        ];
        let hash = 0;
        for (let i = 0; i < (name || "").length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
        return g[Math.abs(hash) % g.length];
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
                    <p className="text-slate-400 text-sm font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    if (!startup) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <div className="text-center max-w-sm">
                    <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-slate-100 mb-6">
                        <Target className="h-8 w-8 text-slate-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Startup not found</h2>
                    <p className="text-slate-500 mb-6">This startup doesn&apos;t exist or has been removed.</p>
                    <Link
href="/startups"
className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to startups
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                {/* back */}
                <Link
                    href="/startups"
                    className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-violet-600 font-medium transition-colors mb-8"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to startups
                </Link>

                {/* ——— DESKTOP: side-by-side ——— */}
                <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                    {/* left / top — main card */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                            {/* avatar + name row */}
                            <div className="flex items-center gap-5 mb-6">
                                <div
                                    className={`shrink-0 h-16 w-16 sm:h-20 sm:w-20 rounded-3xl bg-gradient-to-br ${avatarGradient(startup.startup_name)} flex items-center justify-center text-white font-black text-2xl sm:text-3xl shadow-lg`}
                                >
                                    {initials(startup.startup_name)}
                                </div>
                                <div className="min-w-0">
                                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 truncate">
                                        {startup.startup_name}
                                    </h1>
                                    <p className="text-sm text-slate-500 mt-1">
                                        {startup.industry || "Uncategorized"}
                                    </p>
                                </div>
                            </div>

                            {/* description */}
                            {startup.description && (
                                <div className="mb-8">
                                    <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">
                                        <FileText className="h-4 w-4 text-violet-500" />
                                        About
                                    </h2>
                                    <p className="text-slate-600 leading-relaxed text-[15px]">
                                        {startup.description}
                                    </p>
                                </div>
                            )}

                            {/* contact */}
                            {startup.founder_email && (
                                <div className="border-t border-slate-100 pt-6">
                                    <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">
                                        <Mail className="h-4 w-4 text-violet-500" />
                                        Contact
                                    </h2>
                                    <a
                                        href={`mailto:${startup.founder_email}`}
                                        className="inline-flex items-center gap-1.5 text-violet-600 hover:text-violet-700 font-medium transition-colors"
                                    >
                                        {startup.founder_email}
                                        <ArrowUpRight className="h-3.5 w-3.5" />
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* right / bottom — sidebar stats */}
                    <div className="mt-6 lg:mt-0 space-y-4">
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                                Details
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                                        <Layers className="h-4 w-4" />
                                        Industry
                                    </div>
                                    <p className="font-semibold text-slate-900">
                                        {startup.industry || "—"}
                                    </p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                                        <Tag className="h-4 w-4" />
                                        Funding Stage
                                    </div>
                                    {startup.funding_stage ? (
                                        <span className="inline-block px-3 py-1 text-sm font-semibold rounded-lg bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-300">
                                            {startup.funding_stage}
                                        </span>
                                    ) : (
                                        <p className="font-semibold text-slate-900">—</p>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                                        <Calendar className="h-4 w-4" />
                                        Listed
                                    </div>
                                    <p className="font-semibold text-slate-900">
                                        {startup._id
                                            ? new Date(
                                                  parseInt(startup._id.toString().substring(0, 8), 16) * 1000
                                              ).toLocaleDateString("en-US", {
                                                  year: "numeric",
                                                  month: "short",
                                                  day: "numeric",
                                              })
                                            : "—"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {startup.founder_email && (
                            <a
                                href={`mailto:${startup.founder_email}`}
                                className="lg:hidden flex items-center justify-center gap-2 w-full px-5 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors"
                            >
                                <Mail className="h-4 w-4" />
                                Contact Founder
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
