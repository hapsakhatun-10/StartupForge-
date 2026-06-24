"use client";

import { motion } from "framer-motion";
import { Lightbulb, Users, TrendingUp, Shield } from "lucide-react";

const features = [
    {
        icon: Lightbulb,
        title: "Idea to Reality",
        description:
            "Turn your startup vision into reality by finding the right co-founders and team members who share your passion.",
        color: "from-violet-500 to-fuchsia-500",
    },
    {
        icon: Users,
        title: "Connect & Collaborate",
        description:
            "Build meaningful connections with talented developers, designers, and marketers ready to join your mission.",
        color: "from-teal-500 to-emerald-500",
    },
    {
        icon: TrendingUp,
        title: "Track Growth",
        description:
            "Monitor your applications, manage your team, and scale your startup with powerful dashboard tools.",
        color: "from-amber-500 to-orange-500",
    },
    {
        icon: Shield,
        title: "Secure & Trusted",
        description:
            "Every profile is verified. Build with confidence knowing you're connecting with real, committed professionals.",
        color: "from-blue-500 to-indigo-500",
    },
];

export default function WhyJoin() {
    return (
        <section className="py-20 sm:py-28 bg-white dark:bg-slate-950">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                        Why Join <span className="text-violet-600 dark:text-violet-400">StartupForge</span>?
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-2xl mx-auto">
                        Whether you&apos;re a founder with a vision or a collaborator looking for your next challenge,
                        StartupForge gives you the tools to succeed.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.15 }}
                            className="group bg-slate-50 dark:bg-slate-800 rounded-3xl p-6 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
                        >
                            <div
                                className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-md`}
                            >
                                <feature.icon className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
