"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase } from "lucide-react";
import Link from "next/link";
import OpportunityCard from "@/components/shared/OpportunityCard";
import Loader from "@/components/shared/Loader";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function FeaturedOpportunities() {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch(`${API}/opportunity`).then((r) => r.json()),
            fetch(`${API}/startup`).then((r) => r.json()),
        ])
            .then(([opps, startups]) => {
                const startupMap = {};
                startups.forEach((s) => {
                    startupMap[s._id] = s.startup_name;
                });
                const enriched = opps.slice(0, 6).map((o) => ({
                    ...o,
                    startup_name: startupMap[o.startup_id] || "Unknown Startup",
                }));
                setOpportunities(enriched);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <section className="py-20 sm:py-28 bg-slate-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
                >
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full mb-4">
                            <Briefcase className="h-3.5 w-3.5" />
                            Open Positions
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
                            Find Your <span className="text-amber-600">Next Role</span>
                        </h2>
                        <p className="text-slate-500 mt-2 max-w-xl">
                            Browse the latest opportunities from startups actively building their teams.
                        </p>
                    </div>
                    <Link
                        href="/opportunities"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors shrink-0"
                    >
                        View All
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </motion.div>

                {loading ? (
                    <Loader text="Loading opportunities..." />
                ) : opportunities.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-slate-400">No opportunities posted yet.</p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {opportunities.map((opp, i) => (
                            <motion.div
                                key={opp._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                            >
                                <OpportunityCard opp={opp} href={`/opportunities/${opp._id}`} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
}
