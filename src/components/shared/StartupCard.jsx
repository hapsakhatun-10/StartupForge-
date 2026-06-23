"use client";

import Link from "next/link";
import { ArrowUpRight, Layers, Tag, Heart } from "lucide-react";
import GradientAvatar from "./GradientAvatar";

export default function StartupCard({ startup, bookmarked, onToggleBookmark }) {
    return (
        <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-lg hover:border-violet-200 dark:hover:border-violet-700 transition-all flex flex-col relative">
            <Link href={`/startups/${startup._id}`} className="flex flex-col flex-1">
            <div className="flex items-start gap-4 mb-4">
                <GradientAvatar name={startup.startup_name} size="md" />
                <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors truncate">
                        {startup.startup_name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {startup.industry || "Uncategorized"}
                    </p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-violet-500 transition-colors shrink-0 mt-1" />
            </div>

            {startup.description && (
                <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-4">
                    {startup.description}
                </p>
            )}

            <div className="flex items-center gap-3 mt-auto">
                {startup.industry && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-medium rounded-lg">
                        <Layers className="h-3 w-3" />
                        {startup.industry}
                    </span>
                )}
                {startup.funding_stage && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[11px] font-medium rounded-lg ring-1 ring-inset ring-amber-200 dark:ring-amber-700">
                        <Tag className="h-3 w-3" />
                        {startup.funding_stage}
                    </span>
                )}
            </div>
            </Link>
            {onToggleBookmark && (
                <button
                    onClick={(e) => { e.preventDefault(); onToggleBookmark(startup._id); }}
                    className="absolute top-3 right-3 h-8 w-8 rounded-xl flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all"
                >
                    <Heart className={`h-4 w-4 transition-colors ${bookmarked ? "fill-red-500 text-red-500" : "text-slate-400"}`} />
                </button>
            )}
        </div>
    );
}
