"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Briefcase } from "lucide-react";
import OpportunityCard from "@/components/shared/OpportunityCard";
import Loader from "@/components/shared/Loader";
import { useSession } from "@/lib/auth-client";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function BrowseOpportunitiesPage() {
    const { data: session } = useSession();
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [workType, setWorkType] = useState("");

    useEffect(() => {
        Promise.all([
            fetch(`${API}/opportunity`).then((r) => r.json()),
            fetch(`${API}/startup`).then((r) => r.json()),
        ])
            .then(([opps, startups]) => {
                const startupMap = {};
                startups.forEach((s) => {
                    startupMap[s._id] = s.startup_name || "Unknown";
                });
                const enriched = opps.map((o) => ({
                    ...o,
                    startup_name: startupMap[o.startup_id] || "Unknown",
                }));
                setOpportunities(enriched);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filtered = opportunities.filter((opp) => {
        const matchesSearch =
            !search ||
            opp.role_title?.toLowerCase().includes(search.toLowerCase()) ||
            opp.required_skills?.toLowerCase().includes(search.toLowerCase());
        const matchesType = !workType || opp.work_type === workType;
        return matchesSearch && matchesType;
    });

    if (loading) return <Loader text="Loading opportunities..." />;

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
                                Browse <span className="text-violet-600">Opportunities</span>
                            </h1>
                            <p className="text-slate-500 mt-1">
                                Find the perfect role and join a startup team.
                            </p>
                        </div>
                    </div>

                    {/* search + filter */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-8">
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by role or skills..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <select
                                value={workType}
                                onChange={(e) => setWorkType(e.target.value)}
                                className="pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 appearance-none"
                            >
                                <option value="">All Work Types</option>
                                <option value="Remote">Remote</option>
                                <option value="On-site">On-site</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                        </div>
                    </div>
                </motion.div>

                {filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-700">No opportunities found</h3>
                        <p className="text-sm text-slate-400 mt-1">
                            Try adjusting your search or filters.
                        </p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filtered.map((opp, i) => (
                            <motion.div
                                key={opp._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.05 }}
                            >
                                <OpportunityCard
                                    opp={opp}
                                    showApply={!!session?.user}
                                    href={
                                        session?.user
                                            ? `/dashboard/collaborator/opportunities/${opp._id}`
                                            : `/login?redirect=/opportunities/${opp._id}`
                                    }
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
