"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

export default function ApplyPage() {
    const { id } = useParams();
    const router = useRouter();
    const [opportunity, setOpportunity] = useState(null);
    const [form, setForm] = useState({ Applicant_email: "", Portfolio_link: "", Motivation: "" });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:5000/opportunity/${id}`)
            .then((r) => r.json())
            .then((data) => { setOpportunity(data); setLoading(false); })
            .catch(() => { setLoading(false); setError("Opportunity not found"); });
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        try {
            const res = await fetch("http://localhost:5000/application", {
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
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Opportunity not found</h2>
                    <Link href="/" className="text-indigo-600 hover:text-indigo-700 font-medium">Go home</Link>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="flex items-center justify-center min-h-[70vh] px-4">
                <div className="text-center max-w-md">
                    <div className="h-16 w-16 rounded-3xl bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                        <Send className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Application Submitted!</h2>
                    <p className="text-sm text-slate-500 mb-6">
                        Your application for <strong>{opportunity.role_title}</strong> has been received.
                    </p>
                    <Link href="/dashboard/founder/startups"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
                    >
                        Browse More Opportunities
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-10">
            <Link href="/dashboard/founder/startups"
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 font-medium mb-6 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to opportunities
            </Link>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{opportunity.role_title}</h1>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {opportunity.work_type && (
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg">{opportunity.work_type}</span>
                        )}
                        {opportunity.commitment_level && (
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg">{opportunity.commitment_level}</span>
                        )}
                        {opportunity.deadline && (
                            <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs rounded-lg">
                                Due: {new Date(opportunity.deadline).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                    {opportunity.required_skills && (
                        <p className="text-sm text-slate-600 mt-3">
                            <span className="font-medium">Skills:</span> {opportunity.required_skills}
                        </p>
                    )}
                </div>

                <div className="border-t border-slate-100 pt-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Apply Now</h2>

                    {error && (
                        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
                            <input type="email" required value={form.Applicant_email}
                                onChange={(e) => setForm({ ...form, Applicant_email: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                                placeholder="your@email.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Portfolio Link</label>
                            <input type="url" value={form.Portfolio_link}
                                onChange={(e) => setForm({ ...form, Portfolio_link: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                                placeholder="https://your-portfolio.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Motivation *</label>
                            <textarea rows={4} required value={form.Motivation}
                                onChange={(e) => setForm({ ...form, Motivation: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 resize-none"
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
