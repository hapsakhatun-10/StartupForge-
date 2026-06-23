"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Building2, Rocket } from "lucide-react";
import StartupCard from "@/components/shared/StartupCard";
import Loader from "@/components/shared/Loader";
import { useSession } from "@/lib/auth-client";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function StartupsPage() {
    const { data: session } = useSession();
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [bookmarkedIds, setBookmarkedIds] = useState([]);
    const email = session?.user?.email;

    useEffect(() => {
        fetch(`${API}/startup`)
            .then((r) => r.json())
            .then((d) => {
                setStartups(d);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const fetchBookmarks = useCallback(async () => {
        if (!email) return;
        try {
            const res = await fetch(`${API}/bookmark/${email}`);
            setBookmarkedIds(await res.json());
        } catch {}
    }, [email]);

    useEffect(() => { fetchBookmarks(); }, [fetchBookmarks]);

    const handleToggleBookmark = async (startupId) => {
        try {
            const res = await fetch(`${API}/bookmark/toggle`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userEmail: email, startupId }),
            });
            const { bookmarked } = await res.json();
            setBookmarkedIds((prev) =>
                bookmarked ? [...prev, startupId] : prev.filter((id) => id !== startupId)
            );
        } catch {}
    };

    const filtered = startups.filter((s) =>
        s.startup_name?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <Loader text="Loading startups..." />;

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 dark:from-slate-950 to-white dark:to-slate-900">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-semibold rounded-full mb-3">
                                <Rocket className="h-3.5 w-3.5" />
                                {startups.length} startups registered
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                                Browse <span className="text-violet-600">Startups</span>
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">
                                Discover innovative startups looking for talented collaborators.
                            </p>
                        </div>

                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search startups..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-shadow"
                            />
                        </div>
                    </div>
                </motion.div>

                {filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <Building2 className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">No startups found</h3>
                        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                            {search ? "Try a different search term." : "No startups have been registered yet."}
                        </p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filtered.map((startup, i) => (
                            <motion.div
                                key={startup._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.05 }}
                                className="h-full"
                            >
                                <StartupCard
                                    startup={startup}
                                    bookmarked={bookmarkedIds.includes(startup._id)}
                                    onToggleBookmark={email ? handleToggleBookmark : null}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
