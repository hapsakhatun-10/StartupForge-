"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { signUp, authClient } from "@/lib/auth-client";
import { Loader2, Eye, EyeOff, UserPlus, Check, X } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "founder",
    });
    const [image, setImage] = useState("");
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const hasMinLength = form.password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(form.password);
    const hasLowerCase = /[a-z]/.test(form.password);

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
            else setError("Image upload failed");
        } catch {
            setError("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!hasMinLength || !hasUpperCase || !hasLowerCase) {
            setError("Password does not meet requirements");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const { error: signUpError } = await signUp.email({
                name: form.name,
                email: form.email,
                password: form.password,
                role: form.role,
                image: image || undefined,
            });
            if (signUpError) {
                setError(signUpError.message || "Registration failed");
            } else {
                const { data: session } = await authClient.getSession();
                const role = session?.user?.role || "founder";
                router.push(
                    role === "collaborator" ? "/dashboard/collaborator" : "/dashboard/founder"
                );
            }
        } catch {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const Rule = ({ valid, label }) => (
        <div className="flex items-center gap-1.5">
            {valid ? (
                <Check className="h-3 w-3 text-emerald-500" />
            ) : (
                <X className="h-3 w-3 text-slate-300" />
            )}
            <span className={`text-xs ${valid ? "text-emerald-600" : "text-slate-400"}`}>{label}</span>
        </div>
    );

    return (
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-10 bg-gradient-to-b from-slate-50 to-white">
            <div className="w-full max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 mb-4 shadow-lg">
                        <UserPlus className="h-7 w-7 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900">Create an account</h1>
                    <p className="text-sm text-slate-500 mt-2">Join StartupForge today</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm"
                >
                    {error && (
                        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                            <input
                                type="text"
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                            <input
                                type="email"
                                required
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500"
                                placeholder="your@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Profile Image
                            </label>
                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors">
                                    {uploading ? "Uploading..." : "Upload Image"}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleUpload}
                                        className="hidden"
                                        disabled={uploading}
                                    />
                                </label>
                                {uploading && <Loader2 className="h-5 w-5 animate-spin text-violet-600" />}
                                {image && (
                                    <img
                                        src={image}
                                        alt="preview"
                                        className="h-10 w-10 rounded-lg object-cover border"
                                    />
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 pr-10"
                                    placeholder="Create a password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {form.password.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                                    <Rule valid={hasMinLength} label="Min 6 characters" />
                                    <Rule valid={hasUpperCase} label="One uppercase letter" />
                                    <Rule valid={hasLowerCase} label="One lowercase letter" />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">I am a</label>
                            <div className="grid grid-cols-2 gap-3">
                                {["founder", "collaborator"].map((role) => (
                                    <button
                                        type="button"
                                        key={role}
                                        onClick={() => setForm({ ...form, role })}
                                        className={`px-4 py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                                            form.role === role
                                                ? "border-violet-500 bg-violet-50 text-violet-700"
                                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                        }`}
                                    >
                                        {role === "founder" ? "Founder" : "Collaborator"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-semibold rounded-xl transition-colors shadow-sm"
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <UserPlus className="h-4 w-4" />
                            )}
                            {loading ? "Creating account..." : "Create Account"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        Already have an account?{" "}
                        <Link href="/login" className="text-violet-600 hover:text-violet-700 font-medium">
                            Sign in
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
