"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Building2, Briefcase, Users, FileCheck } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function CountUp({ end, duration = 2 }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;
        let start = 0;
        const increment = Math.ceil(end / (duration * 60));
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, 16);
        return () => clearInterval(timer);
    }, [isInView, end, duration]);

    return <span ref={ref}>{count.toLocaleString()}</span>;
}

export default function PlatformStats() {
    const [stats, setStats] = useState({
        startups: 0,
        opportunities: 0,
        users: 0,
        applications: 0,
    });

    useEffect(() => {
        Promise.all([
            fetch(`${API}/startup`).then((r) => r.json()),
            fetch(`${API}/opportunity`).then((r) => r.json()),
            fetch(`${API}/application`).then((r) => r.json()),
        ])
            .then(([startups, opps, apps]) => {
                setStats({
                    startups: startups.length,
                    opportunities: opps.length,
                    users: 24,
                    applications: apps.length,
                });
            })
            .catch(() => {});
    }, []);

    const items = [
        { label: "Startups Listed", value: stats.startups, icon: Building2, color: "from-violet-500 to-fuchsia-500" },
        { label: "Open Positions", value: stats.opportunities, icon: Briefcase, color: "from-amber-500 to-orange-500" },
        { label: "Active Users", value: stats.users, icon: Users, color: "from-teal-500 to-emerald-500" },
        { label: "Applications Sent", value: stats.applications, icon: FileCheck, color: "from-blue-500 to-indigo-500" },
    ];

    return (
        <section className="py-20 sm:py-28 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl font-black text-white">
                        Platform <span className="text-violet-400">Statistics</span>
                    </h2>
                    <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
                        Our growing community of founders and collaborators.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {items.map((item, i) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.15 }}
                            className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 text-center border border-white/10 hover:bg-white/10 transition-colors"
                        >
                            <div
                                className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}
                            >
                                <item.icon className="h-6 w-6 text-white" />
                            </div>
                            <p className="text-3xl sm:text-4xl font-black text-white mb-1">
                                <CountUp end={item.value} />
                            </p>
                            <p className="text-sm text-slate-400">{item.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
