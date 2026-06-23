"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";
import { BarChart3 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import Loader from "./Loader";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const COLORS = { pending: "#f59e0b", accepted: "#10b981", rejected: "#ef4444" };

export default function TeamAnalytics() {
    const { data: session } = useSession();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const email = session?.user?.email;

    useEffect(() => {
        if (!email) return;
        fetch(`${API}/startup/analytics/${email}`)
            .then((r) => r.json())
            .then(setData)
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [email]);

    if (loading) return <Loader text="Loading analytics..." />;
    if (data.length === 0) return null;

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="h-5 w-5 text-violet-600" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Team Analytics</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="startupName" tick={{ fontSize: 12, fill: "#64748b" }} />
                    <YAxis tick={{ fontSize: 12, fill: "#64748b" }} allowDecimals={false} />
                    <Tooltip
                        contentStyle={{
                            borderRadius: 12,
                            border: "1px solid #e2e8f0",
                            background: "#fff",
                            fontSize: 13,
                        }}
                    />
                    <Legend />
                    <Bar dataKey="pending" name="Pending" fill={COLORS.pending} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="accepted" name="Accepted" fill={COLORS.accepted} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="rejected" name="Rejected" fill={COLORS.rejected} radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
