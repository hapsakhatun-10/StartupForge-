"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-violet-900">
            {/* background pattern */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-20 left-10 w-72 h-72 bg-violet-500 rounded-full blur-[128px]" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-fuchsia-500 rounded-full blur-[128px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500 rounded-full blur-[200px] opacity-10" />
            </div>

            {/* grid overlay */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-xs sm:text-sm font-medium mb-8 border border-white/10"
                >
                    <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                    Where founders meet their dream team
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight"
                >
                    Forge Your{" "}
                    <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                        Startup Empire
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-lg sm:text-xl text-slate-300 mt-6 max-w-2xl mx-auto leading-relaxed"
                >
                    Connect with talented collaborators, build your dream team, and turn your startup
                    vision into reality. The bridge between founders and innovators.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
                >
                    <Link
                        href="/startups"
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-violet-600/25 hover:shadow-violet-500/40 text-sm sm:text-base"
                    >
                        Explore Startups
                        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Link>
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/15 backdrop-blur-sm text-white font-semibold rounded-2xl border border-white/20 transition-all text-sm sm:text-base"
                    >
                        Join For Free
                    </Link>
                </motion.div>

                {/* bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />
            </div>
        </section>
    );
}
