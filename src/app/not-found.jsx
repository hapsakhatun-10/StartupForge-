import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="text-center max-w-sm">
                <div className="inline-flex items-center justify-center h-24 w-24 rounded-[2rem] bg-gradient-to-br from-violet-100 to-fuchsia-100 mb-8 shadow-inner">
                    <SearchX className="h-12 w-12 text-violet-600" />
                </div>
                <h1 className="text-6xl font-black text-slate-900 mb-2">404</h1>
                <h2 className="text-xl font-bold text-slate-700 mb-2">Page Not Found</h2>
                <p className="text-slate-500 mb-8 text-sm leading-relaxed">
                    Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    Let&apos;s get you back on track.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-violet-600/25"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
