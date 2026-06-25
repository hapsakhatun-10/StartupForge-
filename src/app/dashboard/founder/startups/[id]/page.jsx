"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Trash2, Upload, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
export default function ManageStartupPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const user = session?.user;
    const [form, setForm] = useState(null);
    const [logo, setLogo] = useState("");
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${API}/startup/${id}`)
            .then((r) => r.json())
            .then((data) => {
                setForm({
                    startup_name: data.startup_name || "",
                    industry: data.industry || "",
                    description: data.description || "",
                    funding_stage: data.funding_stage || "",
                    founder_email: user?.email || data.founder_email || "",
                    status: data.status || "active",
                });
                setLogo(data.logo || "");
            })
            .catch(() => setError("Failed to load startup"));
    }, [id]);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const data = new FormData();
            data.append("image", file);
            const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`, {
                method: "POST",
                body: data,
            });
            const json = await res.json();
            if (json.success) setLogo(json.data.url);
        } catch {
            setError("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        try {
            const res = await fetch(`${API}/startup/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, logo }),
            });
            const data = await res.json();
            if (res.ok) router.push("/dashboard/founder");
            else setError(data.message);
        } catch {
            setError("Failed to update");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Delete this startup permanently?")) return;
        setDeleting(true);
        try {
            await fetch(`${API}/startup/${id}`, { method: "DELETE" });
            router.push("/dashboard/founder");
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
                href="/dashboard/founder"
                className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 font-medium mb-6 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
            </Link>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Manage Startup</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Update or delete your startup.</p>
                </div>
                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                    {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    Delete
                </button>
            </div>

            {error && (
                <div className="mb-6 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400">
                    {error}
                </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Startup Name</label>
                    <input type="text" required
                        value={form.startup_name}
                        onChange={(e) => setForm({ ...form, startup_name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 dark:bg-slate-700 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Logo</label>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors">
                            <Upload className="h-4 w-4" />
                            {uploading ? "Uploading..." : "Change Logo"}
                            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
                        </label>
                        {uploading && <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />}
                        {logo && <img src={logo} alt="logo" className="h-10 w-10 rounded-lg object-cover border" />}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Industry</label>
                    <input type="text" required value={form.industry}
                        onChange={(e) => setForm({ ...form, industry: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 dark:bg-slate-700 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
                    <textarea rows={3} required value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 resize-none dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Funding Stage</label>
                        <select required value={form.funding_stage}
                            onChange={(e) => setForm({ ...form, funding_stage: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 dark:bg-slate-700 dark:text-white"
                        >
                            <option value="Idea">Idea</option>
                            <option value="Seed">Seed</option>
                            <option value="Series A">Series A</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Status</label>
                        <select value={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 dark:bg-slate-700 dark:text-white"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Founder Email</label>
                    <input type="email" required value={form.founder_email}
                        onChange={(e) => setForm({ ...form, founder_email: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                        readOnly
                    />
                </div>

                <button type="submit" disabled={saving || uploading}
                    className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl transition-colors"
                >
                    {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
}
