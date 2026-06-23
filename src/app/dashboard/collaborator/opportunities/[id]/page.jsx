"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Building2, MapPin, Clock, Send, Calendar } from "lucide-react";
import { useSession } from "@/lib/auth-client";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
export default function OpportunityDetail() {
    const { id } = useParams();
    const { data: session } = useSession();
    const [opportunity, setOpportunity] = useState(null);
    const [startupName, setStartupName] = useState("");
    const [loading, setLoading] = useState(true);
    const [matchData, setMatchData] = useState(null);

    useEffect(() => {
        fetch(`${API}/opportunity/${id}`)
            .then((r) => r.json())
            .then((data) => {
                setOpportunity(data);
                if (data.startup_id) {
                    fetch(`${API}/startup/${data.startup_id}`)
                        .then((r) => r.json())
                        .then((s) => setStartupName(s.startup_name || s.name || ""))
                        .catch(() => {});
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        if (!session?.user?.email || !id) return;
        fetch(`${API}/application/match/${id}/${session.user.email}`)
            .then((r) => r.json())
            .then(setMatchData)
            .catch(() => {});
    }, [id, session?.user?.email]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!opportunity) {
        return (
            <div className="flex items-center justify-center min-h-[70vh] px-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Opportunity not found</h2>
                    <Link href="/dashboard/collaborator/opportunities" className="text-indigo-600 hover:text-indigo-700 font-medium">
                        Browse opportunities
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6 sm:p-8">
            <Link
                href="/dashboard/collaborator/opportunities"
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 font-medium mb-6 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to opportunities
            </Link>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{opportunity.role_title}</h1>
                        {startupName && (
                            <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
                                <Building2 className="h-4 w-4" />
                                {startupName}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        {matchData && (
                            <div className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                                matchData.matchPercentage >= 70
                                    ? "bg-emerald-100 text-emerald-700"
                                    : matchData.matchPercentage >= 40
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-red-100 text-red-700"
                            }`}>
                                {matchData.matchPercentage}% Match
                            </div>
                        )}
                        <Link
                            href={`/dashboard/collaborator/opportunities/${id}/apply`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
                        >
                            <Send className="h-4 w-4" />
                            Apply Now
                        </Link>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                    {opportunity.work_type && (
                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs rounded-lg">{opportunity.work_type}</span>
                    )}
                    {opportunity.commitment_level && (
                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs rounded-lg">{opportunity.commitment_level}</span>
                    )}
                    {opportunity.location && (
                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs rounded-lg flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {opportunity.location}
                        </span>
                    )}
                    {opportunity.deadline && (
                        <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs rounded-lg flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Due: {new Date(opportunity.deadline).toLocaleDateString()}
                        </span>
                    )}
                </div>

                {opportunity.required_skills && (
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Required Skills</h3>
                        <div className="flex flex-wrap gap-1.5">
                            {opportunity.required_skills.split(",").map((skill) => (
                                <span key={skill.trim()} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded-lg">
                                    {skill.trim()}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {opportunity.description && (
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Description</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{opportunity.description}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
