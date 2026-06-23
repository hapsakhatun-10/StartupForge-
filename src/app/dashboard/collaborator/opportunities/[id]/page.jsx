"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Building2, MapPin, Clock, Send, Calendar } from "lucide-react";

export default function OpportunityDetail() {
    const { id } = useParams();
    const [opportunity, setOpportunity] = useState(null);
    const [startupName, setStartupName] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:5000/opportunity/${id}`)
            .then((r) => r.json())
            .then((data) => {
                setOpportunity(data);
                if (data.startup_id) {
                    fetch(`http://localhost:5000/startup/${data.startup_id}`)
                        .then((r) => r.json())
                        .then((s) => setStartupName(s.startup_name || s.name || ""))
                        .catch(() => {});
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

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
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Opportunity not found</h2>
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

            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{opportunity.role_title}</h1>
                        {startupName && (
                            <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
                                <Building2 className="h-4 w-4" />
                                {startupName}
                            </div>
                        )}
                    </div>
                    <Link
                        href={`/dashboard/collaborator/opportunities/${id}/apply`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shrink-0"
                    >
                        <Send className="h-4 w-4" />
                        Apply Now
                    </Link>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                    {opportunity.work_type && (
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg">{opportunity.work_type}</span>
                    )}
                    {opportunity.commitment_level && (
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg">{opportunity.commitment_level}</span>
                    )}
                    {opportunity.location && (
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {opportunity.location}
                        </span>
                    )}
                    {opportunity.deadline && (
                        <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs rounded-lg flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Due: {new Date(opportunity.deadline).toLocaleDateString()}
                        </span>
                    )}
                </div>

                {opportunity.required_skills && (
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-slate-700 mb-2">Required Skills</h3>
                        <div className="flex flex-wrap gap-1.5">
                            {opportunity.required_skills.split(",").map((skill) => (
                                <span key={skill.trim()} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-lg">
                                    {skill.trim()}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {opportunity.description && (
                    <div className="border-t border-slate-100 pt-6">
                        <h3 className="text-sm font-semibold text-slate-700 mb-2">Description</h3>
                        <p className="text-sm text-slate-600 whitespace-pre-wrap">{opportunity.description}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
