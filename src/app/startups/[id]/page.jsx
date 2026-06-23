"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    ArrowUpRight,
    Mail,
    Calendar,
    FileText,
    Target,
    Layers,
    Tag,
    Send,
    Clock,
    MapPin,
    Award,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import GradientAvatar from "@/components/shared/GradientAvatar";
import Loader from "@/components/shared/Loader";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function StartupDetailPage() {
    const { id } = useParams();
    const { data: session } = useSession();
    const user = session?.user;
    const [startup, setStartup] = useState(null);
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch(`${API}/startup`).then((r) => r.json()),
            fetch(`${API}/opportunity`).then((r) => r.json()),
        ])
            .then(([startupsData, opps]) => {
                setStartup(startupsData.find((s) => s._id === id) || null);
                setOpportunities(opps.filter((o) => o.startup_id === id));
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    if (loading) return <Loader text="Loading startup details..." />;

    if (!startup) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <div className="text-center max-w-sm">
                    <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-slate-100 mb-6">
                        <Target className="h-8 w-8 text-slate-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Startup not found</h2>
                    <p className="text-slate-500 mb-6">
                        This startup doesn&apos;t exist or has been removed.
                    </p>
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
                <Link
                    href="/startups"
                    className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-violet-600 font-medium transition-colors mb-8"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to startups
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="lg:grid lg:grid-cols-3 lg:gap-8"
                >
                    {/* left — main card */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                            <div className="flex items-center gap-5 mb-6">
                                <GradientAvatar name={startup.startup_name} size="lg" />
                                <div className="min-w-0">
                                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 truncate">
                                        {startup.startup_name}
                                    </h1>
                                    <p className="text-sm text-slate-500 mt-1">
                                        {startup.industry || "Uncategorized"}
                                    </p>
                                </div>
                            </div>

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

                    {/* right — sidebar */}
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
                                        {startup.industry || "\u2014"}
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
                                        <p className="font-semibold text-slate-900">\u2014</p>
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
                                            : "\u2014"}
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

                    {/* Open Positions */}
                    {opportunities.length > 0 && (
                        <div className="mt-6 lg:col-span-3">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                            >
                                <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
                                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-5">
                                        Open Positions ({opportunities.length})
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {opportunities.map((opp) => (
                                            <div
                                                key={opp._id}
                                                className="border border-slate-100 rounded-xl p-4 hover:border-violet-200 hover:shadow-sm transition-all"
                                            >
                                                <div className="flex items-start justify-between gap-3 mb-2">
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-slate-900">
                                                            {opp.role_title}
                                                        </p>
                                                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                                                            {opp.work_type && (
                                                                <span className="inline-flex items-center gap-1">
                                                                    <Clock className="h-3 w-3" />
                                                                    {opp.work_type}
                                                                </span>
                                                            )}
                                                            {opp.location && (
                                                                <span className="inline-flex items-center gap-1">
                                                                    <MapPin className="h-3 w-3" />
                                                                    {opp.location}
                                                                </span>
                                                            )}
                                                            {opp.commitment_level && (
                                                                <span className="inline-flex items-center gap-1 text-violet-600 font-medium">
                                                                    <Award className="h-3 w-3" />
                                                                    {opp.commitment_level}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {user?.role === "collaborator" && (
                                                        <Link
                                                            href={`/dashboard/collaborator/opportunities/${opp._id}`}
                                                            className="shrink-0 flex items-center gap-1 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-lg transition-colors"
                                                        >
                                                            <Send className="h-3 w-3" />
                                                            Apply
                                                        </Link>
                                                    )}
                                                </div>
                                                {opp.required_skills && (
                                                    <div className="flex flex-wrap gap-1.5 mb-2">
                                                        {opp.required_skills.split(",").map((skill) => (
                                                            <span
                                                                key={skill.trim()}
                                                                className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded-md"
                                                            >
                                                                {skill.trim()}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                                {opp.deadline && (
                                                    <p className="text-[11px] text-amber-600 font-medium">
                                                        Due: {new Date(opp.deadline).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
