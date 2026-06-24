"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Clock,
    MapPin,
    Award,
    Calendar,
    Building2,
    Send,
    Target,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import Loader from "@/components/shared/Loader";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function OpportunityDetailPage() {
    const { id } = useParams();
    const { data: session } = useSession();
    const [opportunity, setOpportunity] = useState(null);
    const [startup, setStartup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        Promise.all([
            fetch(`${API}/opportunity/${id}`).then((r) => {
                if (!r.ok) throw new Error("Not found");
                return r.json();
            }),
            fetch(`${API}/startup`).then((r) => r.json()),
        ])
            .then(([opp, startups]) => {
                setOpportunity(opp);
                setStartup(startups.find((s) => s._id === opp.startup_id) || null);
                setLoading(false);
            })
            .catch(() => {
                setError("Opportunity not found");
                setLoading(false);
            });
    }, [id]);

    if (loading) return <Loader text="Loading opportunity..." />;

    if (error || !opportunity) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <div className="text-center max-w-sm">
                    <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-slate-100 dark:bg-slate-800 mb-6">
                        <Target className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Opportunity not found</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">
                        This opportunity doesn&apos;t exist or has been removed.
                    </p>
                    <Link
                        href="/opportunities"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Browse Opportunities
                    </Link>
                </div>
            </div>
        );
    }

    const skills = opportunity.required_skills
        ? opportunity.required_skills.split(",").map((s) => s.trim())
        : [];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 dark:from-slate-950 to-white dark:to-slate-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                <Link
                    href="/opportunities"
                    className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-violet-600 font-medium transition-colors mb-8"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to opportunities
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="lg:grid lg:grid-cols-3 lg:gap-8"
                >
                    {/* main content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
                            <div className="mb-6">
                                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2">
                                    {opportunity.role_title}
                                </h1>
                                {startup && (
                                    <Link
                                        href={`/startups/${startup._id}`}
                                        className="inline-flex items-center gap-1.5 text-violet-600 dark:text-violet-400 hover:text-violet-700 font-medium text-sm transition-colors"
                                    >
                                        <Building2 className="h-4 w-4" />
                                        {startup.startup_name}
                                    </Link>
                                )}
                            </div>

                            {/* info badges */}
                            <div className="flex flex-wrap gap-3 mb-6">
                                {opportunity.work_type && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-semibold rounded-lg">
                                        <Clock className="h-3.5 w-3.5" />
                                        {opportunity.work_type}
                                    </span>
                                )}
                                {opportunity.commitment_level && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-lg">
                                        <Award className="h-3.5 w-3.5" />
                                        {opportunity.commitment_level}
                                    </span>
                                )}
                                {opportunity.location && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-lg">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {opportunity.location}
                                    </span>
                                )}
                                {opportunity.deadline && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-semibold rounded-lg">
                                        <Calendar className="h-3.5 w-3.5" />
                                        Due: {new Date(opportunity.deadline).toLocaleDateString()}
                                    </span>
                                )}
                            </div>

                            {/* skills */}
                            {skills.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                        Required Skills
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* description */}
                            {opportunity.description && (
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                        Description
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[15px]">
                                        {opportunity.description}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* sidebar */}
                    <div className="mt-6 lg:mt-0 space-y-4">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                            <div className="text-center">
                                <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
                                    Ready to Apply?
                                </h3>
                                {session?.user ? (
                                    <Link
                                        href={`/dashboard/collaborator/opportunities/${opportunity._id}/apply`}
                                        className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors"
                                    >
                                        <Send className="h-4 w-4" />
                                        Apply Now
                                    </Link>
                                ) : (
                                    <Link
                                        href={`/login?redirect=/opportunities/${opportunity._id}`}
                                        className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors"
                                    >
                                        Login to Apply
                                    </Link>
                                )}
                                {startup && (
                                    <Link
                                        href={`/startups/${startup._id}`}
                                        className="inline-flex items-center justify-center gap-2 w-full px-5 py-2.5 mt-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-xl transition-colors"
                                    >
                                        <Building2 className="h-4 w-4" />
                                        View Startup
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
