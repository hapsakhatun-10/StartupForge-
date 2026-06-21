'use client';

import Link from 'next/link';
import { Menu, X, Rocket } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Startups', href: "/dashboard/founder/startups" },
        { name: 'Opportunities', href: '/opportunities' },
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

                        {/* Desktop Auth Buttons */}
                        <div className="hidden md:flex items-center gap-3">
                            <Link
                                href="/login"
                                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:border-teal-600 hover:text-teal-600 transition-all duration-300"
                            >
                                Login
                            </Link>

                            <Link
                                href="/register"
                                className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-semibold shadow-lg hover:bg-teal-700 hover:shadow-xl transition-all duration-300"
                            >
                                Get Started
                            </Link>
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

                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                        className="text-slate-700 font-medium hover:text-teal-600 transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                ))}

                                <div className="pt-4 flex flex-col gap-3">
                                    <Link
                                        href="/login"
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                        className="w-full text-center py-3 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:border-teal-600 hover:text-teal-600 transition-all"
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        href="/register"
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                        className="w-full text-center py-3 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-all"
                                    >
                                        Get Started
                                    </Link>
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
