"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Briefcase, ClipboardList, Users, Building2, PlusCircle, ArrowUpRight } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export default function FounderDashboard() {
    const { data: session } = useSession();
    const user = session?.user;
    const [stats, setStats] = useState({ opportunities: 0, applications: 0, accepted: 0, startups: [] });
    const [loading, setLoading] = useState(true);

    const email = user?.email || "";

    useEffect(() => {
        async function load() {
            try {
                const [startupsRes, oppsRes, appsRes] = await Promise.all([
                    fetch("http://localhost:5000/startup"),
                    fetch("http://localhost:5000/opportunity"),
                    fetch("http://localhost:5000/application"),
                ]);
                const startups = await startupsRes.json();
                const opportunities = await oppsRes.json();
                const applications = await appsRes.json();

                const myStartups = startups.filter((s) => s.founder_email === email);
                const myOppIds = opportunities
                    .filter((o) => myStartups.some((s) => s._id === o.startup_id))
                    .map((o) => o._id);
                const myApps = applications.filter((a) => myOppIds.includes(a.Opportunity_id));

                setStats({
                    opportunities: myOppIds.length,
                    applications: myApps.length,
                    accepted: myApps.filter((a) => a.Status === "accepted").length,
                    startups: myStartups,
                });
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const cards = [
        {
            label: "Total Opportunities",
            value: stats.opportunities,
            icon: Briefcase,
            color: "from-indigo-500 to-purple-600",
            href: "/dashboard/founder/opportunities",
        },
        {
            label: "Total Applications",
            value: stats.applications,
            icon: ClipboardList,
            color: "from-teal-500 to-emerald-600",
            href: "/dashboard/founder/applications",
        },
        {
            label: "Accepted Members",
            value: stats.accepted,
            icon: Users,
            color: "from-amber-500 to-orange-600",
            href: "/dashboard/founder/applications",
        },
        {
            label: "My Startups",
            value: stats.startups.length,
            icon: Building2,
            color: "from-rose-500 to-pink-600",
            href: "/dashboard/founder/startups",
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 sm:p-8 max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Founder Dashboard</h1>
                    <p className="text-sm text-slate-500 mt-1">Welcome back! Here&apos;s your overview.</p>
                </div>
                <Link
                    href="/dashboard/founder/add-startup"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                    <PlusCircle className="h-4 w-4" />
                    Create Startup
                </Link>
            </div>

            {/* stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
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

            {/* my startup section */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">My Startups</h2>
                {stats.startups.length === 0 ? (
                    <div className="text-center py-10">
                        <Building2 className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                        <p className="text-sm text-slate-500 mb-4">You haven&apos;t created any startups yet.</p>
                        <Link
                            href="/dashboard/founder/add-startup"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
                        >
                            <PlusCircle className="h-4 w-4" />
                            Create Your First Startup
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {stats.startups.map((s) => (
                            <Link
                                key={s._id}
                                href={`/dashboard/founder/manage-startup/${s._id}`}
                                className="flex items-center justify-between py-3 group hover:bg-slate-50 -mx-6 px-6 transition-colors"
                            >
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                        {s.startup_name}
                                    </p>
                                    <p className="text-xs text-slate-500">{s.industry || "\u2014"}</p>
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
