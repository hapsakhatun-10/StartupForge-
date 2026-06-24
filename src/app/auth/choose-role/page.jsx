"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSession, updateUser } from "@/lib/auth-client";
import { Rocket, Users, Loader2 } from "lucide-react";

export default function ChooseRolePage() {
    const router = useRouter();
    const { data: session, isPending } = useSession();
    const [saving, setSaving] = useState(false);

    const user = session?.user;

    useEffect(() => {
        if (isPending) return;
        if (!user) {
            router.replace("/login");
            return;
        }
        if (typeof window !== "undefined" && sessionStorage.getItem("onboarded")) {
            const target =
                user.role === "collaborator"
                    ? "/dashboard/collaborator"
                    : user.role === "admin"
                        ? "/dashboard/admin"
                        : "/dashboard/founder";
            router.replace(target);
            return;
        }
        if (user.role && user.role !== "founder") {
            sessionStorage.setItem("onboarded", "true");
            const target =
                user.role === "collaborator"
                    ? "/dashboard/collaborator"
                    : user.role === "admin"
                        ? "/dashboard/admin"
                        : "/dashboard/founder";
            router.replace(target);
        }
    }, [user, isPending, router]);

    const handleRole = async (role) => {
        setSaving(true);
        try {
            await updateUser({ role });
            sessionStorage.setItem("onboarded", "true");
            router.push(
                role === "collaborator" ? "/dashboard/collaborator" : "/dashboard/founder"
            );
        } catch {
            setSaving(false);
        }
    };

    if (isPending || !user) {
        return (
            <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-10 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
            <div className="w-full max-w-lg">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 mb-4 shadow-lg">
                        <Rocket className="h-7 w-7 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">You&apos;re almost in!</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                        Welcome, <span className="font-semibold">{user.name}</span>. How will you use StartupForge?
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="space-y-4"
                >
                    <button
                        onClick={() => handleRole("founder")}
                        disabled={saving}
                        className="w-full group bg-white dark:bg-slate-800 rounded-3xl border-2 border-violet-200 dark:border-violet-800 p-6 hover:border-violet-500 dark:hover:border-violet-500 transition-all hover:shadow-lg text-left"
                    >
                        <div className="flex items-start gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center shrink-0 shadow-md">
                                <Rocket className="h-7 w-7 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">I&apos;m a Founder</h2>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                    I have an idea and want to build a team. Create startups, post opportunities, and find collaborators.
                                </p>
                            </div>
                            {saving && <Loader2 className="h-5 w-5 animate-spin text-violet-600 shrink-0 mt-1" />}
                        </div>
                    </button>

                    <button
                        onClick={() => handleRole("collaborator")}
                        disabled={saving}
                        className="w-full group bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700 p-6 hover:border-violet-500 dark:hover:border-violet-500 transition-all hover:shadow-lg text-left"
                    >
                        <div className="flex items-start gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shrink-0 shadow-md">
                                <Users className="h-7 w-7 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">I&apos;m a Collaborator</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                    I have skills and want to join a startup. Browse opportunities and apply to teams.
                                </p>
                            </div>
                        </div>
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
