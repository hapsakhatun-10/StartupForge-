"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, Check, Loader2, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const features = [
    "Unlimited opportunity postings",
    "Priority support",
    "Advanced analytics",
    "Featured startup listing",
];

export default function PremiumPage() {
    const { data: session } = useSession();
    const user = session?.user;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleCheckout = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${API}/payment/create-checkout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_email: user?.email }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                setError(data.message || "Failed to create checkout");
            }
        } catch {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 sm:p-8 max-w-3xl mx-auto">
            <Link
                href="/dashboard/founder"
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-violet-600 font-medium mb-6 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center mb-10"
            >
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 mb-4 shadow-lg">
                    <Crown className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
                    Go <span className="text-amber-600">Premium</span>
                </h1>
                <p className="text-slate-500 mt-2 max-w-md mx-auto">
                    Unlock unlimited opportunities and grow your startup faster.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm max-w-md mx-auto"
            >
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full mb-4">
                        <Sparkles className="h-3 w-3" />
                        One-time payment
                    </div>
                    <p className="text-5xl font-black text-slate-900">
                        $9.99
                    </p>
                    <p className="text-sm text-slate-500 mt-1">Unlimited access</p>
                </div>

                <ul className="space-y-3 mb-8">
                    {features.map((f) => (
                        <li key={f} className="flex items-center gap-3 text-sm text-slate-700">
                            <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                <Check className="h-3.5 w-3.5 text-emerald-600" />
                            </div>
                            {f}
                        </li>
                    ))}
                </ul>

                {error && (
                    <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-60 text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-600/25"
                >
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Crown className="h-4 w-4" />
                    )}
                    {loading ? "Redirecting to checkout..." : "Get Premium"}
                </button>
            </motion.div>
        </div>
    );
}
