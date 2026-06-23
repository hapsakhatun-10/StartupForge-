"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
export default function AddStartupPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const user = session?.user;
    const [form, setForm] = useState({
        startup_name: "",
        industry: "",
        description: "",
        funding_stage: "",
        founder_email: user?.email || "",
        status: "active",
    });
    const [logo, setLogo] = useState("");
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const data = new FormData();
            data.append("image", file);
            const res = await fetch("https://api.imgbb.com/1/upload?key=63c4409f87f4222e2ab8a01484e2457c", {
                method: "POST",
                body: data,
            });
            const json = await res.json();
            if (json.success) {
                setLogo(json.data.url);
            } else {
                setError("Logo upload failed");
            }
        } catch {
            setError("Failed to upload logo");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${API}/startup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, logo }),
            });
            const data = await res.json();
            if (data.id) {
                router.push("/dashboard/founder");
            } else {
                setError(data.message || "Failed to create startup");
            }
        } catch {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 sm:p-8 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">Add Startup</h1>
            <p className="text-sm text-slate-500 mb-8">Fill in the details to register your startup.</p>

            {error && (
                <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Startup Name</label>
                    <input
                        type="text"
                        required
                        value={form.startup_name}
                        onChange={(e) => setForm({ ...form, startup_name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                        placeholder="Enter startup name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Logo</label>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors">
                            <Upload className="h-4 w-4" />
                            {uploading ? "Uploading..." : "Upload Logo"}
                            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
                        </label>
                        {uploading && <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />}
                        {logo && <img src={logo} alt="logo" className="h-10 w-10 rounded-lg object-cover border" />}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Industry</label>
                    <input
                        type="text"
                        required
                        value={form.industry}
                        onChange={(e) => setForm({ ...form, industry: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                        placeholder="e.g. Fintech, HealthTech"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                    <textarea
                        required
                        rows={3}
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 resize-none"
                        placeholder="Tell us about your startup"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Funding Stage</label>
                        <select
                            required
                            value={form.funding_stage}
                            onChange={(e) => setForm({ ...form, funding_stage: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                        >
                            <option value="">Select Stage</option>
                            <option value="Idea">Idea</option>
                            <option value="Seed">Seed</option>
                            <option value="Series A">Series A</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                        <select
                            value={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Founder Email</label>
                    <input
                        type="email"
                        required
                        value={form.founder_email}
                        onChange={(e) => setForm({ ...form, founder_email: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm bg-slate-50 text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                        placeholder="your@email.com"
                        readOnly
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || uploading}
                    className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl transition-colors"
                >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {loading ? "Creating..." : "Create Startup"}
                </button>
            </form>
        </div>
    );
}
