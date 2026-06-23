"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard, Users, Building2, CreditCard, Shield, Menu, X
} from "lucide-react";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";

const links = [
    { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Users", href: "/dashboard/admin/users", icon: Users },
    { name: "Startups", href: "/dashboard/admin/startups", icon: Building2 },
    { name: "Transactions", href: "/dashboard/admin/transactions", icon: CreditCard },
];

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const { data: session, isPending } = useSession();
    const user = session?.user;

    if (!isPending && (!user || user.role !== "admin")) {
        router.push("/login");
        return null;
    }

    if (isPending || !user) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="h-10 w-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-slate-50">
            <button
                onClick={() => setOpen(!open)}
                className="lg:hidden fixed top-24 left-4 z-50 h-10 w-10 rounded-xl bg-white border border-slate-200 shadow-md flex items-center justify-center"
            >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <aside
                className={`fixed lg:sticky top-20 lg:top-20 left-0 z-40 h-[calc(100vh-5rem)] w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ${
                    open ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0 overflow-y-auto`}
            >
                <div className="p-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                            <Shield className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">Admin Panel</p>
                            <p className="text-[10px] text-slate-500">{user.email}</p>
                        </div>
                    </div>
                </div>
                <nav className="p-4 space-y-1">
                    {links.map((link) => {
                        const active = pathname === link.href || pathname.startsWith(link.href + "/");
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                                    active
                                        ? "bg-amber-50 text-amber-700"
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

            {open && (
                <div
                    className="fixed inset-0 bg-black/20 z-30 lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            <main className="flex-1 min-w-0">
                {children}
            </main>
        </div>
    );
}
