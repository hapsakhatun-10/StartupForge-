"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Building2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import StartupCard from "@/components/shared/StartupCard";
import Loader from "@/components/shared/Loader";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function SavedStartups() {
    const { data: session } = useSession();
    const [startups, setStartups] = useState([]);
    const [bookmarkedIds, setBookmarkedIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const email = session?.user?.email;

    useEffect(() => {
        if (!email) return;
        Promise.all([
            fetch(`${API}/bookmark/${email}/startups`).then((r) => r.json()),
            fetch(`${API}/bookmark/${email}`).then((r) => r.json()),
        ])
            .then(([startupsData, ids]) => {
                setStartups(startupsData);
                setBookmarkedIds(ids);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [email]);

    const handleToggleBookmark = async (startupId) => {
        try {
            const res = await fetch(`${API}/bookmark/toggle`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userEmail: email, startupId }),
            });
            const { bookmarked } = await res.json();
            if (bookmarked) {
                setBookmarkedIds((prev) => [...prev, startupId]);
            } else {
                setBookmarkedIds((prev) => prev.filter((id) => id !== startupId));
                setStartups((prev) => prev.filter((s) => s._id !== startupId));
            }
        } catch {}
    };

    if (loading) return <Loader text="Loading saved startups..." />;

    return (
        <div className="p-6 sm:p-8 max-w-6xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                        <Heart className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Saved Startups</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{startups.length} saved startups</p>
                    </div>
                </div>

                {startups.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                        <Building2 className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">No saved startups</h3>
                        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Browse startups and save the ones you like.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {startups.map((startup) => (
                            <StartupCard
                                key={startup._id}
                                startup={startup}
                                bookmarked={bookmarkedIds.includes(startup._id)}
                                onToggleBookmark={handleToggleBookmark}
                            />
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
