"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Rocket } from "lucide-react";
import Link from "next/link";
import StartupCard from "@/components/shared/StartupCard";
import Loader from "@/components/shared/Loader";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function FeaturedStartups() {
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API}/startup`)
            .then((r) => r.json())
            .then((data) => {
                setStartups(data.slice(0, 6));
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <section className="py-20 sm:py-28 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
                >
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-50 text-violet-700 text-xs font-semibold rounded-full mb-4">
                            <Rocket className="h-3.5 w-3.5" />
                            Featured Startups
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
                            Discover <span className="text-violet-600">Innovative</span> Startups
                        </h2>
                        <p className="text-slate-500 mt-2 max-w-xl">
                            Explore promising startups looking for talented collaborators like you.
                        </p>
                    </div>
                    <Link
                        href="/startups"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors shrink-0"
                    >
                        View All
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </motion.div>

                {loading ? (
                    <Loader text="Loading startups..." />
                ) : startups.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-slate-400">No startups yet. Be the first!</p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {startups.map((startup, i) => (
                            <motion.div
                                key={startup._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                            >
                                <StartupCard startup={startup} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
}
