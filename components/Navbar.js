"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Products', href: '/products' },
        { name: 'About', href: '/about' },
        { name: 'Contact Us', href: '/contact' },
    ];

    return (
        <>
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
                {/* Top Banner */}
                <div
                    className="flex-center"
                    style={{
                        height: isScrolled ? '0px' : '36px',
                        overflow: 'hidden',
                        background: "var(--color-accent-primary)",
                        color: "white",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        transition: 'height 0.3s ease'
                    }}
                >
                    Welcome to Mona Industry | High Purity Copper
                </div>

                <header
                    className={`transition-all duration-300 ${isScrolled ? 'glass-panel shadow-subtle' : 'bg-transparent'}`}
                    style={{
                        padding: isScrolled ? '1rem 0' : '1.5rem 0',
                        width: '100%',
                    }}
                >
                    <div className="container flex-between">
                        <Link href="/" className="font-display" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                            MONA<span className="text-gradient">INDUSTRY</span>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="desktop-nav" style={{ display: 'none' }}>
                            <ul style={{ display: 'flex', gap: '2.5rem', listStyle: 'none' }}>
                                {navLinks.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="nav-link" style={{ fontWeight: '500', transition: 'color 0.2s' }}>
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="mobile-toggle"
                            style={{ display: 'block', color: 'var(--color-text-primary)' }}
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <Menu size={28} />
                        </button>
                    </div>
                </header>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            backgroundColor: 'var(--color-bg-primary)',
                            zIndex: 100,
                            padding: '2rem',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <div className="flex-between mb-8" style={{ marginBottom: '3rem' }}>
                            <Link href="/" className="font-display" style={{ fontSize: '1.5rem', fontWeight: 'bold' }} onClick={() => setMobileMenuOpen(false)}>
                                MONA<span className="text-gradient">INDUSTRY</span>
                            </Link>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                style={{ color: 'var(--color-text-primary)' }}
                            >
                                <X size={32} />
                            </button>
                        </div>

                        <nav style={{ flex: 1 }}>
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '2rem', listStyle: 'none', fontSize: '1.5rem' }}>
                                {navLinks.map((link) => (
                                    <motion.li
                                        key={link.name}
                                        whileHover={{ x: 10 }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            style={{ color: 'var(--color-text-primary)' }}
                                        >
                                            {link.name}
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Basic inline styles to handle desktop/mobile hiding since we removed tailwind */}
            <style jsx>{`
                @media (min-width: 768px) {
                  .desktop-nav {
                    display: block !important;
                  }
                  .mobile-toggle {
                    display: none !important;
                  }
                }
                .nav-link:hover {
                  color: var(--color-accent-primary);
                }
            `}</style>
        </>
    );
}
