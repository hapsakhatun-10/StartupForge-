"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Rocket, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import ThemeToggle from "@/components/shared/ThemeToggle";
import NotificationBell from "@/components/shared/NotificationBell";

export default function Navbar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { data: session } = useSession();
    const user = session?.user;

    const isCollab = user?.role === "collaborator";
    const dashboardHref = isCollab
        ? "/dashboard/collaborator"
        : "/dashboard/founder";

    const navLinks = [
        { name: "Home", href: "/" },
        ...(user ? [{ name: "Dashboard", href: dashboardHref }] : []),
        { name: "Startups", href: "/startups" },
        { name: "Opportunities", href: "/opportunities" },
    ];

    const isActive = (href) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    return (
        <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-lg transition-all duration-300 group-hover:scale-105">
                            <Rocket className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                StartupForge
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400 -mt-1">Build • Connect • Grow</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                                    isActive(link.href)
                                        ? "bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center gap-3">
                        <ThemeToggle />
                        {user && <NotificationBell />}
                        {user ? (
                            <div className="flex items-center gap-3">
                                <Link
                                    href={
                                        isCollab
                                            ? "/dashboard/collaborator/profile"
                                            : "/dashboard/founder/profile"
                                    }
                                    className="flex items-center gap-2"
                                >
                                    {user.image ? (
                                        <img
                                            src={user.image}
                                            alt=""
                                            className="h-8 w-8 rounded-full object-cover border"
                                        />
                                    ) : (
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center">
                                            <User className="h-4 w-4 text-violet-600" />
                                        </div>
                                    )}
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {user.name}
                                    </span>
                                </Link>
                                <button
                                    onClick={() => signOut()}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-medium hover:border-red-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="px-5 py-2.5 rounded-xl bg-violet-600 dark:bg-violet-700 text-white font-semibold hover:bg-violet-700 dark:hover:bg-violet-600 transition-all shadow-sm"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden flex items-center justify-center h-11 w-11 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-slate-200 dark:border-slate-800 py-6">
                        <div className="flex flex-col gap-4">
                            {user && (
                                <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                    {user.image ? (
                                        <img
                                            src={user.image}
                                            alt=""
                                            className="h-10 w-10 rounded-full object-cover border"
                                        />
                                    ) : (
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-100 dark:from-violet-800 to-fuchsia-100 dark:to-fuchsia-800 flex items-center justify-center">
                                            <User className="h-5 w-5 text-violet-600 dark:text-violet-300" />
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user.role}</p>
                                    </div>
                                </div>
                            )}

                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`px-3 py-2 text-sm font-medium rounded-xl ${
                                        isActive(link.href)
                                            ? "bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                                            : "text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400"
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <div className="flex justify-center gap-2 pt-2">
                                {user && <NotificationBell />}
                                <ThemeToggle />
                            </div>
                            <div className="pt-4 flex flex-col gap-3 border-t border-slate-100 dark:border-slate-700">
                                {user ? (
                                    <button
                                        onClick={() => {
                                            signOut();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="w-full text-center py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300 hover:border-red-300 hover:text-red-600 dark:hover:border-red-700 transition-all"
                                    >
                                        Logout
                                    </button>
                                ) : (
                                    <Link
                                        href="/login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="w-full text-center py-3 rounded-xl bg-violet-600 dark:bg-violet-700 text-white font-semibold hover:bg-violet-700 dark:hover:bg-violet-600 transition-all"
                                    >
                                        Login
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Accent */}
            <div className="h-[2px] w-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500" />
        </header>
    );
}
