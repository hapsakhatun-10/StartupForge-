"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { signUp, signIn, updateUser } from "@/lib/auth-client";
import { Loader2, Eye, EyeOff, UserPlus, Check, X, Rocket, Users } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [image, setImage] = useState("");
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [role, setRole] = useState("");
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
        if (!role) {
            setError("Please select a role — Founder or Collaborator");
            return;
        }
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
                image: image || undefined,
            });
            if (signUpError) {
                setError(signUpError.message || "Registration failed");
            } else {
                await updateUser({ role });
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
            <span className={`text-xs ${valid ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"}`}>{label}</span>
        </div>
    );




    return (
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-10 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
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
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">Create an account</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Join StartupForge today</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm"
                >
                    {error && (
                        <div className="mb-5 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                            <input
                                type="text"
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                            <input
                                type="email"
                                required
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                                placeholder="your@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Profile Image
                            </label>
                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors">
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
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                                I want to join as
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRole("founder")}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                                        role === "founder"
                                            ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                                            : "border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-600"
                                    }`}
                                >
                                    <Rocket className={`h-6 w-6 mb-2 ${role === "founder" ? "text-violet-600" : "text-slate-400 dark:text-slate-500"}`} />
                                    <p className="font-semibold text-sm text-slate-900 dark:text-white">Founder</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-tight">Post opportunities &amp; build your team</p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole("collaborator")}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                                        role === "collaborator"
                                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                                            : "border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600"
                                    }`}
                                >
                                    <Users className={`h-6 w-6 mb-2 ${role === "collaborator" ? "text-emerald-600" : "text-slate-400 dark:text-slate-500"}`} />
                                    <p className="font-semibold text-sm text-slate-900 dark:text-white">Collaborator</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-tight">Find startups &amp; apply to roles</p>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 pr-10 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                                    placeholder="Create a password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
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

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-slate-800 px-3 text-slate-400 dark:text-slate-500 font-medium">or</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => signIn.social({ provider: "google", callbackURL: "/auth/choose-role" })}
                            className="w-full flex items-center justify-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                        >
                            <svg className="h-4 w-4" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Sign up with Google
                        </button>
                    </div>

                    <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
                        Already have an account?{" "}
                        <Link href="/login" className="text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 font-medium">
                            Sign in
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
