"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { company, addressLine } from '@/constants/company';

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Products', href: '/products' },
    { name: 'Certifications', href: '/certifications' },
    { name: 'Contact', href: '/contact' },
    { name: 'Career', href: '/career' },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock the page behind the mobile panel while it is open. Navigation closes
    // the panel through each link's own onClick.
    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    const isActive = (href) =>
        href === '/' ? pathname === '/' : pathname.startsWith(href);

    return (
        <>
            <div className="site-header">
                <div
                    className="topbar"
                    style={{ height: isScrolled ? 0 : 38, opacity: isScrolled ? 0 : 1 }}
                    aria-hidden={isScrolled}
                >
                    <div className="container topbar-inner">
                        <span className="topbar-item topbar-note">
                            <MapPin size={14} /> {addressLine}
                        </span>
                        <div className="topbar-contacts">
                            <a className="topbar-item" href={`tel:${company.phoneHref}`}>
                                <Phone size={14} /> {company.phone}
                            </a>
                            <a className="topbar-item topbar-email" href={`mailto:${company.email}`}>
                                <Mail size={14} /> {company.email}
                            </a>
                        </div>
                    </div>
                </div>

                <header className={`nav-bar ${isScrolled ? 'scrolled' : ''}`}>
                    <div className="container nav-inner">
                        <Link href="/" className="brand" aria-label={`${company.name} — home`}>
                            <span className="brand-mark" aria-hidden="true">MI</span>
                            <span>
                                MONA<span className="text-gradient">INDUSTRY</span>
                                <span className="brand-sub">Wires · Cables · Harnesses</span>
                            </span>
                        </Link>

                        <nav className="desktop-nav" aria-label="Primary">
                            <ul className="nav-list">
                                {navLinks.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className={`nav-link ${isActive(link.href) ? 'active' : ''}`}
                                            aria-current={isActive(link.href) ? 'page' : undefined}
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        <div className="nav-actions">
                            <Link href="/contact" className="btn-primary" style={{ padding: '0.7rem 1.3rem', fontSize: '0.9rem' }}>
                                Request a Quote <ArrowRight size={16} />
                            </Link>
                        </div>

                        <button
                            className="mobile-toggle"
                            onClick={() => setMobileMenuOpen(true)}
                            aria-label="Open menu"
                            aria-expanded={mobileMenuOpen}
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </header>
            </div>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        className="mobile-panel"
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Site menu"
                    >
                        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                            <Link href="/" className="brand" onClick={() => setMobileMenuOpen(false)}>
                                <span className="brand-mark" aria-hidden="true">MI</span>
                                <span>MONA<span className="text-gradient">INDUSTRY</span></span>
                            </Link>
                            <button
                                className="mobile-toggle"
                                onClick={() => setMobileMenuOpen(false)}
                                aria-label="Close menu"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <nav style={{ flex: 1 }} aria-label="Mobile">
                            <ul>
                                {navLinks.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className={`mobile-nav-link ${isActive(link.href) ? 'active' : ''}`}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {link.name}
                                            <ArrowRight size={18} />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Link href="/contact" className="btn-primary btn-block" onClick={() => setMobileMenuOpen(false)}>
                                Request a Quote
                            </Link>
                            <a href={`tel:${company.phoneHref}`} className="btn-secondary btn-block">
                                <Phone size={16} /> {company.phone}
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
