"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Crown, Loader2, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const FREE_LIMIT = 3;

export default function AddOpportunityPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const user = session?.user;
    const [myStartups, setMyStartups] = useState([]);
    const [form, setForm] = useState({
        startup_id: "",
        role_title: "",
        required_skills: "",
        work_type: "",
        commitment_level: "",
        deadline: "",
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState("");
    const [premium, setPremium] = useState(null);
    const [opportunityCount, setOpportunityCount] = useState(0);

    useEffect(() => {
        if (!user?.email) return;
        Promise.all([
            fetch(`${API}/startup`).then((r) => r.json()),
            fetch(`${API}/payment/check/${user.email}`).then((r) => r.json()),
        ])
            .then(([startups, payment]) => {
                const mine = startups.filter((s) => s.founder_email === user.email);
                setMyStartups(mine);

                const isPremium = payment.isPremium;
                setPremium(isPremium);

                // count founder opportunities
                const startupIds = mine.map((s) => s._id);
                fetch(`${API}/opportunity`)
                    .then((r) => r.json())
                    .then((opps) => {
                        const data = Array.isArray(opps) ? opps : opps.data || [];
                        const count = data.filter((o) => startupIds.includes(o.startup_id)).length;
                        setOpportunityCount(count);
                        setFetching(false);
                    })
                    .catch(() => setFetching(false));
            })
            .catch(() => setFetching(false));
    }, [user?.email]);

    const atLimit = !premium && opportunityCount >= FREE_LIMIT;
    const remaining = Math.max(0, FREE_LIMIT - opportunityCount);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${API}/opportunity`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, founder_email: user?.email }),
            });
            const data = await res.json();
            if (data.id) {
                router.push("/dashboard/founder/opportunities");
            } else {
                setError(data.message || "Failed to create");
            }
        } catch {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 sm:p-8 max-w-2xl">
            <Link
                href="/dashboard/founder/opportunities"
                className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 font-medium mb-6 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Opportunities
            </Link>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">Add Opportunity</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Post a new opportunity for your startup.</p>
                </div>

                {!fetching && (
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                        premium
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                    }`}>
                        {premium ? (
                            <><Crown className="h-3.5 w-3.5" /> Premium</>
                        ) : (
                            <>{remaining} of {FREE_LIMIT} free slots left</>
                        )}
                    </div>
                )}
            </div>

            {atLimit && (
                <div className="mb-6 px-5 py-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl">
                    <div className="flex items-start gap-3">
                        <Sparkles className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                                Free limit reached
                            </p>
                            <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                                You&apos;ve used all {FREE_LIMIT} free slots.{" "}
                                <Link href="/dashboard/founder/premium" className="underline font-medium">
                                    Upgrade to Premium
                                </Link>{" "}
                                for unlimited opportunity postings.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="mb-6 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Startup</label>
                    {fetching ? (
                        <div className="h-10 flex items-center">
                            <Loader2 className="h-4 w-4 animate-spin text-violet-600" />
                        </div>
                    ) : (
                        <select
                            required
                            value={form.startup_id}
                            onChange={(e) => setForm({ ...form, startup_id: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 dark:bg-slate-700 dark:text-white"
                        >
                            <option value="">Select a startup</option>
                            {myStartups.map((s) => (
                                <option key={s._id} value={s._id}>
                                    {s.startup_name}
                                </option>
                            ))}
                        </select>
                    )}
                    {myStartups.length === 0 && !fetching && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                            No startups found.{" "}
                            <Link href="/dashboard/founder/startups/new" className="underline">
                                Create one first
                            </Link>
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Role Title</label>
                    <input type="text" required value={form.role_title}
                        onChange={(e) => setForm({ ...form, role_title: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                        placeholder="e.g. Full Stack Developer"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Required Skills</label>
                    <input type="text" required value={form.required_skills}
                        onChange={(e) => setForm({ ...form, required_skills: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                        placeholder="e.g. React, Node.js, MongoDB"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Work Type</label>
                        <select required value={form.work_type}
                            onChange={(e) => setForm({ ...form, work_type: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 dark:bg-slate-700 dark:text-white"
                        >
                            <option value="">Select</option>
                            <option value="Remote">Remote</option>
                            <option value="On-site">On-site</option>
                            <option value="Hybrid">Hybrid</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Commitment Level</label>
                        <select required value={form.commitment_level}
                            onChange={(e) => setForm({ ...form, commitment_level: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 dark:bg-slate-700 dark:text-white"
                        >
                            <option value="">Select</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Internship">Internship</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Deadline</label>
                    <input type="date" required value={form.deadline}
                        onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 dark:bg-slate-700 dark:text-white"
                    />
                </div>

                <button type="submit" disabled={loading || atLimit}
                    className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl transition-colors"
                >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {loading ? "Creating..." : atLimit ? "Upgrade to Post More" : "Create Opportunity"}
                </button>
            </form>
        </div>
    );
}
