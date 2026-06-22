"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Briefcase, ClipboardList, CheckCircle, ArrowUpRight } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export default function CollabaratorDashboard() {
    const { data: session } = useSession();
    const user = session?.user;
    const [stats, setStats] = useState({ total: 0, accepted: 0 });
    const [loading, setLoading] = useState(true);

    const email = user?.email || "";

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(`http://localhost:5000/application?Applicant_email=${encodeURIComponent(email)}`);
                const apps = await res.json();
                setStats({
                    total: apps.length,
                    accepted: apps.filter((a) => a.Status === "accepted").length,
                });
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        if (email) load();
    }, [email]);

    const cards = [
        {
            label: "Total Applications",
            value: stats.total,
            icon: ClipboardList,
            color: "from-indigo-500 to-purple-600",
            href: "/dashboard/collabarator/applications",
        },
        {
            label: "Accepted",
            value: stats.accepted,
            icon: CheckCircle,
            color: "from-emerald-500 to-green-600",
            href: "/dashboard/collabarator/applications",
        },
    ];

    if (!email) return null;

    return (
        <div className="p-6 sm:p-8 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Collaborator Dashboard</h1>
                <p className="text-sm text-slate-500 mt-1">Browse opportunities and track your applications.</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center min-h-[30vh]">
                    <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                        {cards.map((card) => (
                            <Link
                                key={card.label}
                                href={card.href}
                                className="group bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg transition-all"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div
                                        className={`h-10 w-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-sm`}
                                    >
                                        <card.icon className="h-5 w-5 text-white" />
                                    </div>
                                    <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                                </div>
                                <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                                <p className="text-xs text-slate-500 mt-1">{card.label}</p>
                            </Link>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link
                            href="/dashboard/collabarator/opportunities"
                            className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all group"
                        >
                            <Briefcase className="h-8 w-8 text-indigo-600 mb-3" />
                            <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">Browse Opportunities</h3>
                            <p className="text-sm text-slate-500 mt-1">Find startups looking for collaborators like you.</p>
                        </Link>
                        <Link
                            href="/dashboard/collabarator/applications"
                            className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all group"
                        >
                            <ClipboardList className="h-8 w-8 text-teal-600 mb-3" />
                            <h3 className="font-semibold text-slate-900 group-hover:text-teal-600 transition-colors">My Applications</h3>
                            <p className="text-sm text-slate-500 mt-1">Track your submitted applications and status.</p>
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}
