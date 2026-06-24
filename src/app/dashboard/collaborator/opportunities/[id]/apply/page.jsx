"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
export default function CollabaratorApplyPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const user = session?.user;
    const [opportunity, setOpportunity] = useState(null);
    const [form, setForm] = useState({ Applicant_email: "", Portfolio_link: "", Motivation: "" });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (user?.email) {
            setForm((prev) => ({ ...prev, Applicant_email: user.email }));
        }
    }, [user]);

    useEffect(() => {
        fetch(`${API}/opportunity/${id}`)
            .then((r) => r.json())
            .then((data) => { setOpportunity(data); setLoading(false); })
            .catch(() => { setLoading(false); setError("Opportunity not found"); });
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        try {
            const res = await fetch(`${API}/application`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, Opportunity_id: id }),
            });
            const data = await res.json();
            if (data.id) setSuccess(true);
            else setError(data.message || "Failed to submit");
        } catch {
            setError("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

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
                    <Link href="/dashboard/collaborator/opportunities" className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">
                        Browse opportunities
                    </Link>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="flex items-center justify-center min-h-[70vh] px-4">
                <div className="text-center max-w-md">
                    <div className="h-16 w-16 rounded-3xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6">
                        <Send className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Application Submitted!</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                        Your application for <strong>{opportunity.role_title}</strong> has been received.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Link href="/dashboard/collaborator/opportunities"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
                        >
                            Browse More
                        </Link>
                        <Link href="/dashboard/collaborator/applications"
                            className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            My Applications
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 sm:p-8">
            <Link href="/dashboard/collaborator/opportunities"
                className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 font-medium mb-6 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to opportunities
            </Link>

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{opportunity.role_title}</h1>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {opportunity.work_type && (
                            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-lg">{opportunity.work_type}</span>
                        )}
                        {opportunity.commitment_level && (
                            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-lg">{opportunity.commitment_level}</span>
                        )}
                        {opportunity.deadline && (
                            <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs rounded-lg">
                                Due: {new Date(opportunity.deadline).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-700 pt-6">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Apply Now</h2>

                    {error && (
                        <div className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400">{error}</div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email *</label>
                            <input type="email" required value={form.Applicant_email} readOnly
                                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Portfolio Link</label>
                            <input type="url" value={form.Portfolio_link}
                                onChange={(e) => setForm({ ...form, Portfolio_link: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                                placeholder="https://your-portfolio.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Motivation *</label>
                            <textarea rows={4} required value={form.Motivation}
                                onChange={(e) => setForm({ ...form, Motivation: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 resize-none dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                                placeholder="Why do you want to join this startup?"
                            />
                        </div>
                        <button type="submit" disabled={submitting}
                            className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl transition-colors"
                        >
                            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            {submitting ? "Submitting..." : "Submit Application"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
