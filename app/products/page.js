import Link from 'next/link';
import productsData from '@/constants/products.json';
import { ArrowRight } from 'lucide-react';

export const metadata = {
    title: "Products Catalog | Mona Industry",
};

export default function ProductsCatalog() {
    // Group products by category dynamically
    const categories = productsData.reduce((acc, product) => {
        const { category } = product;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(product);
        return acc;
    }, {});

    return (
        <div className="container section-padding">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 className="section-title text-gradient">Our Products</h1>
                <p className="subtitle" style={{ margin: '0 auto' }}>
                    Explore our comprehensive range of 32 specialized copper products.
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
                {Object.entries(categories).map(([category, products]) => (
                    <div key={category}>
                        <h2 style={{ fontSize: '2rem', color: 'var(--color-text-primary)', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-glass)' }}>
                            {category}
                        </h2>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                            {products.map(product => (
                                <Link key={product.id} href={`/products/${product.slug}`} style={{ display: 'block', height: '100%' }}>
                                    <div
                                        className="glass-panel product-card"
                                        style={{
                                            padding: '2rem',
                                            borderRadius: 'var(--border-radius-md)',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {/* Image Placeholder */}
                                        <div style={{ width: '100%', aspectRatio: '4/3', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--border-radius-sm)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                                            {product.name} Image
                                        </div>

                                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--color-text-primary)' }}>
                                            {product.name}
                                        </h3>

                                        <p className="text-subtle" style={{ flexGrow: 1, marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                            {product.description.substring(0, 100)}...
                                        </p>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent-primary)', fontWeight: '500', fontSize: '0.9rem' }}>
                                            View Details <ArrowRight size={16} />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
