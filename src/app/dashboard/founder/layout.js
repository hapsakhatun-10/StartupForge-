"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard, Building2, PlusCircle, Briefcase, ClipboardList, Menu, X
} from "lucide-react";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";

const links = [
    { name: "Overview", href: "/dashboard/founder", icon: LayoutDashboard },
    { name: "Add Startup", href: "/dashboard/founder/add-startup", icon: PlusCircle },
    { name: "Startups", href: "/startups", icon: Building2 },
    { name: "Opportunities", href: "/dashboard/founder/opportunities", icon: Briefcase },
    { name: "Applications", href: "/dashboard/founder/applications", icon: ClipboardList },
];

export default function FounderLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const { data: session, isPending } = useSession();
    const user = session?.user;

    if (!isPending && !user) {
        router.push("/login");
        return null;
    }

    if (isPending || !user) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex">
            {/* mobile toggle */}
            <button
                onClick={() => setOpen(!open)}
                className="lg:hidden fixed top-24 left-4 z-50 h-10 w-10 rounded-xl bg-white border border-slate-200 shadow-md flex items-center justify-center"
            >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* sidebar */}
            <aside
                className={`fixed lg:sticky top-20 lg:top-20 left-0 z-40 h-[calc(100vh-5rem)] w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full"
                    } lg:translate-x-0 overflow-y-auto`}
            >
                <nav className="p-4 space-y-1">
                    {links.map((link) => {
                        const active = pathname === link.href || pathname.startsWith(link.href + "/");
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${active
                                    ? "bg-indigo-50 text-indigo-700"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                            >
                                <link.icon className="h-5 w-5 shrink-0" />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/20 z-30 lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* content */}
            <main className="flex-1 min-w-0">
                {children}
            </main>
        </div>
    );
}
