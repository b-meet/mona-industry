import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCatalogue from '@/components/ProductCatalogue';
import { categories, productCount } from '@/lib/catalog';

export const metadata = {
    title: 'Products',
    description:
        'Full catalogue of Mona Industry wires and cables, enamelled winding wire, power cords and wire harnesses — automotive, elevator travelling, submersible, instrumentation, solar, data centre, domestic and industrial cables.',
};

export default function ProductsPage() {
    return (
        <div>
            <section className="section-deep" style={{ padding: '4.5rem 0' }}>
                <div className="container">
                    <span className="eyebrow">Catalogue</span>
                    <h1 className="page-title" style={{ marginBottom: '1rem' }}>Products</h1>
                    <p className="subtitle" style={{ color: 'rgba(255,255,255,0.76)' }}>
                        {productCount} standard product lines across {categories.length} ranges. Every line is built to a
                        named standard or to your drawing — custom constructions, compounds and lengths are routine.
                    </p>
                </div>
            </section>

            <ProductCatalogue />

            <section className="section-tight">
                <div className="container">
                    <div
                        className="card card-pad"
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '1.5rem',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderColor: 'var(--copper-tint)',
                            background: 'linear-gradient(120deg, var(--copper-pale), var(--surface) 70%)',
                        }}
                    >
                        <div style={{ maxWidth: 560 }}>
                            <h2 style={{ fontSize: '1.45rem', marginBottom: '0.5rem' }}>Need a construction that is not listed?</h2>
                            <p className="text-subtle">
                                Most of what we ship is built to a customer drawing. Send the specification and we will
                                confirm the construction, compound and approvals in writing.
                            </p>
                        </div>
                        <Link href="/contact" className="btn-primary">
                            Talk to our team <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
