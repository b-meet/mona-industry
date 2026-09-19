import Link from 'next/link';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { company, addressLine, whatsappUrl } from '@/constants/company';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { categories } from '@/lib/catalog';

const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Products', href: '/products' },
    { name: 'Certifications', href: '/certifications' },
    { name: 'Contact', href: '/contact' },
    { name: 'Career', href: '/career' },
];

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="container">
                <div className="footer-grid">
                    <div style={{ gridColumn: 'span 1', minWidth: 0 }}>
                        <Link href="/" className="brand" style={{ marginBottom: '1.25rem' }}>
                            <span className="brand-mark" aria-hidden="true">MI</span>
                            <span>MONA<span className="text-gradient">INDUSTRY</span></span>
                        </Link>
                        <p style={{ lineHeight: 1.75, fontSize: '0.94rem', marginTop: '1rem' }}>
                            Manufacturers of automotive and industrial cables, elevator travelling cables, solar
                            and instrumentation cables, approval-ready power cords and build-to-print wire
                            harnesses — made in Surat, Gujarat.
                        </p>
                        <p style={{ marginTop: '1.25rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>
                            GSTIN: {company.gstin}<br />
                            IEC: {company.iecCode}
                        </p>
                    </div>

                    <div>
                        <h4>Product Range</h4>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                            {categories.map((category) => (
                                <li key={category.slug}>
                                    <Link href={`/products#${category.slug}`}>{category.name}</Link>
                                </li>
                            ))}
                            <li><Link href="/products">Full Catalogue</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4>Company</h4>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href}>{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4>Get in Touch</h4>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.94rem' }}>
                            <li style={{ display: 'flex', gap: '0.75rem' }}>
                                <MapPin size={18} style={{ flexShrink: 0, marginTop: 2, color: 'var(--copper-light)' }} />
                                <span>{addressLine}</span>
                            </li>
                            <li style={{ display: 'flex', gap: '0.75rem' }}>
                                <Phone size={18} style={{ flexShrink: 0, marginTop: 2, color: 'var(--copper-light)' }} />
                                <a href={`tel:${company.phoneHref}`}>{company.phone}</a>
                            </li>
                            <li style={{ display: 'flex', gap: '0.75rem' }}>
                                <Mail size={18} style={{ flexShrink: 0, marginTop: 2, color: 'var(--copper-light)' }} />
                                <a href={`mailto:${company.email}`}>{company.email}</a>
                            </li>
                            <li style={{ display: 'flex', gap: '0.75rem' }}>
                                <WhatsAppIcon size={18} style={{ flexShrink: 0, marginTop: 2, color: 'var(--whatsapp)' }} />
                                <a
                                    href={whatsappUrl('Hello Mona Industry, I would like to enquire about your cables.')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Chat on WhatsApp
                                </a>
                            </li>
                            <li style={{ display: 'flex', gap: '0.75rem' }}>
                                <Clock size={18} style={{ flexShrink: 0, marginTop: 2, color: 'var(--copper-light)' }} />
                                <span>{company.hours}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} {company.legalName}. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <Link href="/privacy-policy">Privacy Policy</Link>
                        <Link href="/terms">Terms &amp; Conditions</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
