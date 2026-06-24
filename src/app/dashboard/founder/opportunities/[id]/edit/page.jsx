"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
export default function UpdateOpportunityPage() {
    const { id } = useParams();
    const router = useRouter();
    const [form, setForm] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${API}/opportunity/${id}`)
            .then((r) => r.json())
            .then((data) => {
                setForm({
                    startup_id: data.startup_id || "",
                    role_title: data.role_title || "",
                    required_skills: data.required_skills || "",
                    work_type: data.work_type || "",
                    commitment_level: data.commitment_level || "",
                    deadline: data.deadline ? data.deadline.split("T")[0] : "",
                });
            })
            .catch(() => setError("Failed to load opportunity"));
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        try {
            const res = await fetch(`${API}/opportunity/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) router.push("/dashboard/founder/opportunities");
            else {
                const data = await res.json();
                setError(data.message);
            }
        } catch {
            setError("Failed to update");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Delete this opportunity?")) return;
        setDeleting(true);
        try {
            await fetch(`${API}/opportunity/${id}`, { method: "DELETE" });
            router.push("/dashboard/founder/opportunities");
        } catch {
            setError("Failed to delete");
        } finally {
            setDeleting(false);
        }
    };

    if (!form) {
        return (
            <div className="p-6 sm:p-8">
                <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

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
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Edit Opportunity</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Update or remove this opportunity.</p>
                </div>
                <button onClick={handleDelete} disabled={deleting}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                    {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    Delete
                </button>
            </div>

            {error && (
                <div className="mb-6 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400">{error}</div>
            )}

            <form onSubmit={handleUpdate} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Startup ID</label>
                    <input type="text" required value={form.startup_id}
                        onChange={(e) => setForm({ ...form, startup_id: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 dark:bg-slate-700 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Role Title</label>
                    <input type="text" required value={form.role_title}
                        onChange={(e) => setForm({ ...form, role_title: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 dark:bg-slate-700 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Required Skills</label>
                    <input type="text" required value={form.required_skills}
                        onChange={(e) => setForm({ ...form, required_skills: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 dark:bg-slate-700 dark:text-white"
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Work Type</label>
                        <select required value={form.work_type}
                            onChange={(e) => setForm({ ...form, work_type: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 dark:bg-slate-700 dark:text-white"
                        >
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
                <button type="submit" disabled={saving}
                    className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl transition-colors"
                >
                    {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
}
