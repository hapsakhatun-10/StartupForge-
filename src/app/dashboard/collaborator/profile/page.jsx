"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export default function ProfilePage() {
    const router = useRouter();
    const { data: session, isPending } = useSession();
    const user = session?.user;

    const [name, setName] = useState(user?.name || "");
    const [image, setImage] = useState(user?.image || "");
    const [skills, setSkills] = useState(user?.skills || "");
    const [bio, setBio] = useState(user?.bio || "");
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    if (isPending || !user) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSuccess(false);
        setError("");

        try {
            const token = localStorage.getItem("bearer_token");
            const res = await fetch("/api/auth/update-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    name,
                    image: image || undefined,
                    skills,
                    bio,
                }),
            });

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            } else {
                const data = await res.json();
                setError(data.message || data.error || "Failed to update");
            }
        } catch {
            setError("Something went wrong");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-6 sm:p-8 max-w-2xl">
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Profile</h1>
                <p className="text-sm text-slate-500 mt-1">Update your personal information and skills.</p>
            </div>

            <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
                {error && (
                    <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
                )}
                {success && (
                    <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">Profile updated successfully!</div>
                )}

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Name *</label>
                    <input type="text" required value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                    <input type="email" value={user.email || ""} readOnly
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Profile Image URL</label>
                    <input type="url" value={image}
                        onChange={(e) => setImage(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                        placeholder="https://example.com/avatar.jpg"
                    />
                    {image && (
                        <img src={image} alt="Preview" className="mt-2 h-12 w-12 rounded-full object-cover border" />
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Skills</label>
                    <input type="text" value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                        placeholder="React, Node.js, UI/UX, ..."
                    />
                    <p className="text-xs text-slate-400 mt-1">Comma-separated list of skills.</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Bio</label>
                    <textarea rows={4} value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 resize-none"
                        placeholder="Tell us about yourself..."
                    />
                </div>

                <button type="submit" disabled={saving}
                    className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl transition-colors"
                >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
}
