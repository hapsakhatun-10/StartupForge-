"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Save, Upload, User } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export default function FounderProfilePage() {
    const router = useRouter();
    const { data: session, update } = useSession();
    const user = session?.user;

    const [form, setForm] = useState({
        name: user?.name || "",
        email: user?.email || "",
        skills: user?.skills || "",
        bio: user?.bio || "",
    });
    const [image, setImage] = useState(user?.image || "");
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const data = new FormData();
            data.append("image", file);
            const res = await fetch(
                `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
                { method: "POST", body: data }
            );
            const json = await res.json();
            if (json.success) setImage(json.data.url);
        } catch {
            setMessage("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");
        try {
            const res = await fetch("/api/auth/update-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    image: image || undefined,
                    skills: form.skills,
                    bio: form.bio,
                }),
            });
            if (res.ok) {
                await update();
                setMessage("Profile updated successfully!");
            } else {
                const data = await res.json();
                setMessage(data.error || "Failed to update");
            }
        } catch {
            setMessage("Something went wrong");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-6 sm:p-8 max-w-2xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">Profile</h1>
                <p className="text-sm text-slate-500 mb-8">Manage your personal information.</p>

                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                    <div className="flex items-center gap-5 mb-8 pb-6 border-b border-slate-100">
                        {image ? (
                            <img src={image} alt="" className="h-16 w-16 rounded-2xl object-cover border shadow-sm" />
                        ) : (
                            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center shadow-sm">
                                <User className="h-7 w-7 text-violet-600" />
                            </div>
                        )}
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">{user?.name}</h2>
                            <p className="text-sm text-slate-500">{user?.email}</p>
                            <span className="inline-block mt-1 px-2.5 py-0.5 bg-violet-50 text-violet-700 text-xs font-semibold rounded-full capitalize">
                                {user?.role}
                            </span>
                        </div>
                    </div>

                    {message && (
                        <div
                            className={`mb-6 px-4 py-3 rounded-xl text-sm flex items-center gap-2 ${
                                message.includes("successfully")
                                    ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                                    : "bg-red-50 border border-red-200 text-red-700"
                            }`}
                        >
                            <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-current" />
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSave} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Profile Image</label>
                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors">
                                    <Upload className="h-4 w-4" />
                                    {uploading ? "Uploading..." : "Upload Image"}
                                    <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
                                </label>
                                {uploading && <Loader2 className="h-5 w-5 animate-spin text-violet-600" />}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
                            <input
                                type="text"
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                            <input
                                type="email"
                                value={form.email}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
                                readOnly
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Skills</label>
                            <input
                                type="text"
                                value={form.skills}
                                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500"
                                placeholder="e.g. React, Node.js, UI/UX Design"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Bio</label>
                            <textarea
                                rows={3}
                                value={form.bio}
                                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 resize-none"
                                placeholder="Tell others about yourself..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-semibold rounded-xl transition-colors shadow-sm"
                        >
                            {saving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
