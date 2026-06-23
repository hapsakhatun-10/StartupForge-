"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Building2, Briefcase, DollarSign, Shield } from "lucide-react";
import Loader from "@/components/shared/Loader";
import { useSession } from "@/lib/auth-client";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminOverview() {
    const { data: session } = useSession();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session?.user?.email) return;
        fetch(`${API}/admin/stats`, { headers: { "x-user-email": session.user.email } })
            .then((r) => r.json())
            .then((data) => {
                setStats(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <Loader text="Loading admin overview..." />;

    const cards = [
        { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "from-blue-500 to-indigo-600" },
        { label: "Total Startups", value: stats?.totalStartups || 0, icon: Building2, color: "from-violet-500 to-fuchsia-500" },
        { label: "Total Opportunities", value: stats?.totalOpportunities || 0, icon: Briefcase, color: "from-amber-500 to-orange-600" },
        { label: "Total Revenue", value: `$${stats?.totalRevenue || 0}`, icon: DollarSign, color: "from-emerald-500 to-teal-600" },
    ];

    return (
        <div className="p-6 sm:p-8 max-w-6xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Admin Overview</h1>
                        <p className="text-sm text-slate-500 mt-0.5">Platform statistics at a glance.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {cards.map((card, i) => (
                        <motion.div
                            key={card.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
                        >
                            <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 shadow-sm`}>
                                <card.icon className="h-5 w-5 text-white" />
                            </div>
                            <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                            <p className="text-xs text-slate-500 mt-1">{card.label}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
