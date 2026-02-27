import { notFound } from 'next/navigation';
import productsData from '@/constants/products.json';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import InquiryForm from '@/components/InquiryForm';

export async function generateStaticParams() {
    return productsData.map((product) => ({
        slug: product.slug,
    }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const product = productsData.find((p) => p.slug === slug);

    if (!product) return { title: 'Not Found' };

    return {
        title: `${product.name} | Mona Industry`,
        description: product.description,
    };
}

export default async function ProductDetail({ params }) {
    const { slug } = await params;
    const product = productsData.find((p) => p.slug === slug);

    if (!product) {
        notFound();
    }

    return (
        <div className="container section-padding">
            <Link href="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--color-text-secondary)', transition: 'color 0.2s' }}>
                <ArrowLeft size={16} /> Back to Products
            </Link>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem' }}>
                {/* Product Visuals */}
                <div>
                    <div className="glass-panel" style={{ width: '100%', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--border-radius-lg)', color: 'var(--color-text-secondary)' }}>
                        <span style={{ fontSize: '1.25rem' }}>{product.name} Image</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        {/* Thumbnail placeholders */}
                        {[1, 2, 3].map(i => (
                            <div key={i} className="glass-panel" style={{ width: '80px', height: '80px', borderRadius: 'var(--border-radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                                Thumb {i}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product Info & Inquiry */}
                <div>
                    <div style={{ marginBottom: '2.5rem' }}>
                        <div style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: 'var(--color-bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--border-radius-pill)', fontSize: '0.875rem', color: 'var(--color-accent-primary)', marginBottom: '1rem' }}>
                            {product.category}
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
                            {product.name}
                        </h1>
                        <p className="text-subtle" style={{ fontSize: '1.125rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                            {product.description}
                        </p>

                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-text-primary)' }}>Key Features</h3>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--color-text-secondary)' }}>
                            {product.features.map((feature, idx) => (
                                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <CheckCircle2 size={20} color="var(--color-accent-primary)" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '2.5rem' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--color-text-primary)' }}>Inquire About This Product</h3>
                        <InquiryForm initialProduct={product} />
                    </div>
                </div>
            </div>
        </div>
    );
}
