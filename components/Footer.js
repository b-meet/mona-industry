import Link from 'next/link';

export default function Footer() {
    return (
        <footer style={{ background: 'var(--color-bg-secondary)', borderTop: 'var(--border-glass)', padding: '4rem 0 2rem 0', marginTop: 'auto' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>

                    {/* Brand & About */}
                    <div>
                        <Link href="/" className="font-display" style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'block', marginBottom: '1rem' }}>
                            MONA<span className="text-gradient">INDUSTRY</span>
                        </Link>
                        <p className="text-subtle" style={{ lineHeight: '1.6' }}>
                            Premium copper manufacturing based in Surat, Gujarat. Delivering high-quality scrap, cathodes, and sheets for industrial excellence.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ fontSize: '1.125rem', marginBottom: '1.25rem', color: 'var(--color-text-primary)' }}>Quick Links</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <li><Link href="/" className="text-subtle" style={{ transition: 'color 0.2s' }}>Home</Link></li>
                            <li><Link href="/products" className="text-subtle" style={{ transition: 'color 0.2s' }}>Our Products</Link></li>
                            <li><Link href="/about" className="text-subtle" style={{ transition: 'color 0.2s' }}>About Us</Link></li>
                            <li><Link href="/contact" className="text-subtle" style={{ transition: 'color 0.2s' }}>Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 style={{ fontSize: '1.125rem', marginBottom: '1.25rem', color: 'var(--color-text-primary)' }}>Contact Info</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--color-text-secondary)' }}>
                            <li>Surat, Gujarat, India</li>
                            <li>Phone: +91 98765 43210</li>
                            <li>Email: info@monaindustry.com</li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', paddingTop: '2rem', borderTop: 'var(--border-glass)', fontSize: '0.875rem' }} className="text-subtle">
                    <p>&copy; {new Date().getFullYear()} Mona Industry. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                        <Link href="/privacy-policy" style={{ transition: 'color 0.2s' }}>Privacy Policy</Link>
                        <Link href="/terms" style={{ transition: 'color 0.2s' }}>Terms & Conditions</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
