'use client';

import Link from 'next/link';
import { Menu, X, Rocket, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { useSession, signOut } from "@/lib/auth-client";

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { data: session } = useSession();
    const user = session?.user;

    const isCollab = user?.role === "collaborator";
    const dashboardHref = isCollab ? "/dashboard/collabarator" : "/dashboard/founder";
    const oppHref = isCollab ? "/dashboard/collabarator/opportunities" : "/dashboard/founder/opportunities";

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Dashboard', href: dashboardHref },
        { name: 'Startups', href: "/startups" },
        { name: 'Opportunities', href: oppHref },
    ];

    return (
        <>
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">

                    <div className="flex h-20 items-center justify-between">

                        {/* Logo */}
                        <Link
                            href="/"
                            className="flex items-center gap-3 group"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:bg-teal-700">
                                <Rocket className="h-6 w-6" />
                            </div>

                            <div>
                                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                                    StartupForge
                                </h1>
                                <p className="text-xs text-slate-500 -mt-1">
                                    Build • Connect • Grow
                                </p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-slate-900 font-medium transition-colors duration-300 hover:text-teal-600"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Desktop Auth Buttons / User Menu */}
                        <div className="hidden md:flex items-center gap-3">
                            {user ? (
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        {user.image ? (
                                            <img src={user.image} alt="" className="h-8 w-8 rounded-full object-cover border" />
                                        ) : (
                                            <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
                                                <User className="h-4 w-4 text-teal-600" />
                                            </div>
                                        )}
                                        <span className="text-sm font-medium text-slate-700">{user.name}</span>
                                    </div>
                                    <button
                                        onClick={() => signOut()}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-all"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:border-teal-600 hover:text-teal-600 transition-all duration-300"
                                >
                                    Login
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden flex items-center justify-center h-11 w-11 rounded-xl border border-slate-200 text-slate-700"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden border-t border-slate-200 py-6 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex flex-col gap-5">

                                {user && (
                                    <div className="flex items-center gap-3 px-3 py-2">
                                        {user.image ? (
                                            <img src={user.image} alt="" className="h-10 w-10 rounded-full object-cover border" />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                                                <User className="h-5 w-5 text-teal-600" />
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                                            <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                                        </div>
                                    </div>
                                )}

                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-slate-700 font-medium hover:text-teal-600 transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                ))}

                                <div className="pt-4 flex flex-col gap-3">
                                    {user ? (
                                        <button
                                            onClick={() => { signOut(); setIsMobileMenuOpen(false); }}
                                            className="w-full text-center py-3 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:border-red-300 hover:text-red-600 transition-all"
                                        >
                                            Logout
                                        </button>
                                    ) : (
                                        <Link
                                            href="/login"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="w-full text-center py-3 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:border-teal-600 hover:text-teal-600 transition-all"
                                        >
                                            Login
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Accent Line */}
                <div className="h-[2px] w-full bg-gradient-to-r from-teal-500 via-teal-600 to-cyan-500" />
            </header>
        </>
    );
};

export default Navbar;
