"use client";

export default function Loader({ text = "Loading..." }) {
    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
                <p className="text-slate-400 text-sm font-medium">{text}</p>
            </div>
        </div>
    );
}
