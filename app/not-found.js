import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata = {
    title: 'Page not found',
};

export default function NotFound() {
    return (
        <div className="section">
            <div className="container-narrow" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                <p className="text-gradient" style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', fontWeight: 800, lineHeight: 1 }}>
                    404
                </p>
                <h1 className="section-title" style={{ margin: '1rem 0 0.75rem' }}>We could not find that page</h1>
                <p className="subtitle" style={{ margin: '0 auto 2rem' }}>
                    The link may be out of date. The full product catalogue is a click away.
                </p>
                <div className="btn-row" style={{ justifyContent: 'center' }}>
                    <Link href="/products" className="btn-primary">Browse products <ArrowRight size={18} /></Link>
                    <Link href="/" className="btn-secondary">Back to home</Link>
                </div>
            </div>
        </div>
    );
}
