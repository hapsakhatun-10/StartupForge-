"use client";

import Link from "next/link";
import { Rocket, Users, TrendingUp, Lightbulb, ArrowRight } from "lucide-react";

const features = [
    {
        icon: Lightbulb,
        title: "Idea to Reality",
        desc: "Turn your vision into a viable product with our structured startup development framework.",
    },
    {
        icon: Users,
        title: "Connect & Collaborate",
        desc: "Find co-founders, mentors, and investors who believe in your mission.",
    },
    {
        icon: TrendingUp,
        title: "Track Growth",
        desc: "Monitor milestones, funding stages, and metrics as you scale from seed to Series A and beyond.",
    },
];

export default function Hero() {
    return (
        <>
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-500/20 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-teal-300 text-sm font-medium mb-8">
                            <Rocket className="h-4 w-4" />
                            Build • Connect • Grow
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
                            Forge Your{" "}
                            <span className="bg-gradient-to-r from-teal-300 to-cyan-400 bg-clip-text text-transparent">
                                Startup Empire
                            </span>
                        </h1>

                        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                            The all-in-one platform to launch, manage, and scale your startup.
                            From idea to Series A — we&apos;ve got you covered.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/dashboard/founder/startups"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg"
                            >
                                Explore Startups
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                            <Link
                                href="/dashboard/founder/add-startup"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl backdrop-blur-sm border border-white/20 transition-all duration-300 text-lg"
                            >
                                Add Your Startup
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
                        Everything you need to succeed
                    </h2>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                        From validation to scaling — we provide the tools, the network, and the roadmap.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="group bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-lg hover:border-teal-200 transition-all duration-300"
                        >
                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center mb-6 shadow-lg shadow-teal-200">
                                <feature.icon className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-slate-600 leading-relaxed">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
