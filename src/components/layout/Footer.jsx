'use client';

import { Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import { BiRocket } from 'react-icons/bi';
import { FaFacebookF } from 'react-icons/fa';
import { FaGithub, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';



const Footer = () => {

    return (

        <footer className="bg-slate-950 text-slate-300">

            {/* Top Gradient Line */}

            <div className="h-[3px] w-full bg-gradient-to-r from-teal-500 via-teal-600 to-cyan-500" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Brand */}

                    <div>

                        <Link href="/" className="flex items-center gap-3">

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-lg">

                                <BiRocket className="h-6 w-6" />

                            </div>

                            <div>

                                <h2 className="text-2xl font-bold text-white">

                                    StartupForge

                                </h2>

                                <p className="text-sm text-slate-400">

                                    Build • Connect • Grow

                                </p>

                            </div>

                        </Link>

                        <p className="mt-5 text-sm leading-7 text-slate-400">

                            Connecting founders, collaborators, and innovators to build the next generation of startups in Bangladesh.

                        </p>

                    </div>

                    {/* Quick Links */}

                    <div>

                        <h3 className="text-lg font-semibold text-white mb-5">Quick Links</h3>

                        <ul className="space-y-3">

                            <li><Link href="/" className="hover:text-teal-400 transition">Home</Link></li>

                            <li><Link href="/startups" className="hover:text-teal-400 transition">Browse Startups</Link></li>

                            <li><Link href="/opportunities" className="hover:text-teal-400 transition">Opportunities</Link></li>

                            <li><Link href="/register" className="hover:text-teal-400 transition">Join Now</Link></li>

                        </ul>

                    </div>

                    {/* Contact */}

                    <div>

                        <h3 className="text-lg font-semibold text-white mb-5">Contact</h3>

                        <div className="space-y-4">

                            <div className="flex gap-3">

                                <Mail className="h-5 w-5 text-teal-500 mt-0.5" />

                                <span>hello@startupforge.com</span>

                            </div>

                            <div className="flex gap-3">

                                <Phone className="h-5 w-5 text-teal-500 mt-0.5" />

                                <span>+880 1XXX-XXXXXX</span>

                            </div>

                            <div className="flex gap-3">

                                <MapPin className="h-5 w-5 text-teal-500 mt-0.5" />

                                <span>Dhaka, Bangladesh</span>

                            </div>

                        </div>

                    </div>

                    {/* Social */}

                    <div>
                        <h3 className="text-lg font-semibold text-white mb-5">
                            Follow Us
                        </h3>

                        <div className="flex gap-4">
                            <Link
                                href="#"
                                className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 hover:bg-teal-600 hover:border-teal-600 transition-all duration-300"
                            >
                                <FaFacebookF size={18} />
                            </Link>

                            <Link
                                href="#"
                                className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 hover:bg-teal-600 hover:border-teal-600 transition-all duration-300"
                            >
                                <FaLinkedinIn size={18} />
                            </Link>

                            <Link
                                href="#"
                                className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 hover:bg-teal-600 hover:border-teal-600 transition-all duration-300"
                            >
                                <FaGithub size={18} />
                            </Link>

                            <Link
                                href="#"
                                className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 hover:bg-teal-600 hover:border-teal-600 transition-all duration-300"
                            >
                                <FaXTwitter size={18} />
                            </Link>
                        </div>

                        <p className="mt-5 text-sm text-slate-400">
                            Stay connected with the startup ecosystem.
                        </p>
                    </div>

                </div>

                {/* Bottom */}

                <div className="mt-14 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">

                    <p className="text-sm text-slate-500">

                        © {new Date().getFullYear()} StartupForge. All rights reserved.

                    </p>

                    <div className="flex items-center gap-6 text-sm text-slate-500">

                        <Link href="#" className="hover:text-teal-400">Privacy Policy</Link>

                        <Link href="#" className="hover:text-teal-400">Terms of Service</Link>

                    </div>

                </div>

            </div>

        </footer>

    );

};

export default Footer;