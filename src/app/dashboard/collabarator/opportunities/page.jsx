"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Briefcase, Building2, MapPin, Clock, ExternalLink } from "lucide-react";

export default function BrowseOpportunities() {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        Promise.all([
            fetch("http://localhost:5000/opportunity").then((r) => r.json()),
            fetch("http://localhost:5000/startup").then((r) => r.json()),
        ])
            .then(([opps, startups]) => {
                const startupMap = {};
                startups.forEach((s) => { startupMap[s._id] = s.startup_name || s.name; });
                const enriched = opps.map((o) => ({
                    ...o,
                    startup_name: startupMap[o.startup_id] || "Unknown",
                }));
                setOpportunities(enriched);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load opportunities");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-center">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-6 sm:p-8 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Browse Opportunities</h1>
                <p className="text-sm text-slate-500 mt-1">Find startups looking for collaborators.</p>
            </div>

            {opportunities.length === 0 ? (
                <div className="text-center py-20">
                    <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700">No opportunities yet</h3>
                    <p className="text-sm text-slate-400 mt-1">Check back later.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {opportunities.map((opp) => (
                        <Link
                            key={opp._id}
                            href={`/dashboard/collabarator/opportunities/${opp._id}`}
                            className="group bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg transition-all"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                    {opp.role_title}
                                </h3>
                                <ExternalLink className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 transition-colors shrink-0" />
                            </div>
                            <div className="space-y-1.5 text-xs text-slate-500">
                                <div className="flex items-center gap-1.5">
                                    <Building2 className="h-3.5 w-3.5" />
                                    {opp.startup_name}
                                </div>
                                {opp.location && (
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {opp.location}
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5" />
                                    {opp.work_type || "Not specified"} · {opp.commitment_level || "N/A"}
                                </div>
                            </div>
                            {opp.deadline && (
                                <p className="text-xs text-amber-600 mt-3 font-medium">
                                    Due: {new Date(opp.deadline).toLocaleDateString()}
                                </p>
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
