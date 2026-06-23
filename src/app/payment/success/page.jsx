"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, ArrowLeft, Loader2, Crown } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [status, setStatus] = useState("verifying");
    const [transactionId, setTransactionId] = useState("");

    useEffect(() => {
        if (!sessionId) {
            setStatus("error");
            return;
        }

        fetch(`${API}/payment/success?session_id=${sessionId}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.transaction_id) {
                    setTransactionId(data.transaction_id);
                    setStatus("success");
                } else {
                    setStatus("error");
                }
            })
            .catch(() => setStatus("error"));
    }, [sessionId]);

    if (status === "verifying") {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-violet-600 mx-auto mb-4" />
                    <p className="text-slate-500">Verifying your payment...</p>
                </div>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <div className="text-center max-w-sm">
                    <div className="h-20 w-20 rounded-3xl bg-red-100 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-10 w-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment verification failed</h2>
                    <p className="text-slate-500 mb-6">
                        We couldn&apos;t verify your payment. Please contact support.
                    </p>
                    <Link
                        href="/dashboard/founder"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center max-w-md"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.2, type: "spring" }}
                    className="h-20 w-20 rounded-3xl bg-emerald-100 flex items-center justify-center mx-auto mb-6 shadow-lg"
                >
                    <CheckCircle className="h-10 w-10 text-emerald-600" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                >
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full mb-3">
                        <Crown className="h-3 w-3" />
                        Premium Active
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h2>
                    <p className="text-slate-500 mb-2">
                        You now have access to all premium features.
                    </p>
                    {transactionId && (
                        <p className="text-xs text-slate-400 font-mono mb-6">
                            Transaction: {transactionId.toString().slice(0, 25)}...
                        </p>
                    )}
                    <Link
                        href="/dashboard/founder"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-violet-600/25"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[70vh] flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
            </div>
        }>
            <PaymentSuccessContent />
        </Suspense>
    );
}
