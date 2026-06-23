"use client";

import Link from "next/link";
import { Clock, MapPin, Send, Building2 } from "lucide-react";

export default function OpportunityCard({ opp, href, showApply = false, onApply }) {
    return (
        <Link
            href={href || `/opportunities/${opp._id}`}
            className="group bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-violet-200 transition-all flex flex-col"
        >
            <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-semibold text-slate-900 group-hover:text-violet-600 transition-colors leading-snug">
                    {opp.role_title}
                </h3>
                {showApply && onApply && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onApply(opp._id);
                        }}
                        className="shrink-0 flex items-center gap-1 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                        <Send className="h-3 w-3" />
                        Apply
                    </button>
                )}
            </div>

            {opp.startup_name && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                    <Building2 className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{opp.startup_name}</span>
                </div>
            )}

            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 mb-2">
                {opp.work_type && (
                    <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {opp.work_type}
                    </span>
                )}
                {opp.location && (
                    <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {opp.location}
                    </span>
                )}
                {opp.commitment_level && (
                    <span className="inline-flex items-center gap-1 text-violet-600 font-medium">
                        {opp.commitment_level}
                    </span>
                )}
            </div>

            {opp.required_skills && (
                <div className="flex flex-wrap gap-1.5 mt-auto pt-2 border-t border-slate-100">
                    {opp.required_skills.split(",").map((skill) => (
                        <span
                            key={skill.trim()}
                            className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded-md"
                        >
                            {skill.trim()}
                        </span>
                    ))}
                </div>
            )}

            {opp.deadline && (
                <p className="text-[11px] text-amber-600 mt-2 font-medium">
                    Due: {new Date(opp.deadline).toLocaleDateString()}
                </p>
            )}
        </Link>
    );
}
