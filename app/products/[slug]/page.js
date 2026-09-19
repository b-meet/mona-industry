import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, FileCheck2 } from 'lucide-react';
import InquiryForm from '@/components/InquiryForm';
import { products, getProduct, getRelatedProducts } from '@/lib/catalog';
import { company } from '@/constants/company';

export async function generateStaticParams() {
    return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const product = getProduct(slug);

    if (!product) return { title: 'Product not found' };

    return {
        title: `${product.name} — ${product.tagline}`,
        description: product.description,
    };
}

export default async function ProductDetail({ params }) {
    const { slug } = await params;
    const product = getProduct(slug);

    if (!product) notFound();

    const related = getRelatedProducts(product);

    const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        category: [product.category, product.group].filter(Boolean).join(' / '),
        brand: { '@type': 'Brand', name: company.name },
        manufacturer: { '@type': 'Organization', name: company.legalName },
    };

    return (
        <div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
            />

            <section className="section-deep" style={{ padding: '3rem 0 3.5rem' }}>
                <div className="container">
                    <Link
                        href={`/products#${product.categorySlug}`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '1.5rem' }}
                    >
                        <ArrowLeft size={16} /> Back to {product.category}
                    </Link>

                    <nav aria-label="Breadcrumb" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', marginBottom: '0.9rem' }}>
                        <Link href="/products">Products</Link>
                        <span aria-hidden="true"> / </span>
                        <Link href={`/products#${product.categorySlug}`}>{product.category}</Link>
                        {product.group && (
                            <>
                                <span aria-hidden="true"> / </span>
                                <span>{product.group}</span>
                            </>
                        )}
                    </nav>

                    <h1 className="page-title" style={{ marginBottom: '0.75rem' }}>{product.name}</h1>
                    <p className="text-gradient" style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 600 }}>
                        {product.tagline}
                    </p>
                </div>
            </section>

            <section className="section">
                <div
                    className="container"
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))', gap: '3.5rem', alignItems: 'start' }}
                >
                    <div>
                        <p className="lede" style={{ marginBottom: '2.5rem' }}>{product.description}</p>

                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Key features</h2>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
                            {product.features.map((feature) => (
                                <li key={feature} style={{ display: 'flex', gap: '0.75rem', color: 'var(--ink-500)' }}>
                                    <CheckCircle2 size={19} color="var(--copper)" style={{ flexShrink: 0, marginTop: 2 }} />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Typical applications</h2>
                        <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {product.applications.map((application) => (
                                <li key={application} className="chip">{application}</li>
                            ))}
                        </ul>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="card card-pad">
                            <h2 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Specification</h2>
                            <dl className="spec-list">
                                {product.specs.map((spec) => (
                                    <div key={spec.label} className="spec-row">
                                        <dt>{spec.label}</dt>
                                        <dd>{spec.value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>

                        <div className="card card-pad" style={{ background: 'var(--surface-muted)' }}>
                            <h2 style={{ fontSize: '1.1rem', marginBottom: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <FileCheck2 size={19} color="var(--copper)" /> Built to
                            </h2>
                            <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                                {product.standards.map((standard) => (
                                    <li key={standard} className="badge">{standard}</li>
                                ))}
                            </ul>
                            <p className="text-subtle" style={{ fontSize: '0.88rem' }}>
                                Sizes, colours, printing and packing are made to order. Test certificates are issued
                                with every dispatch.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section section-muted">
                <div className="container" style={{ maxWidth: 820 }}>
                    <div className="section-head" style={{ marginBottom: '2rem' }}>
                        <span className="eyebrow">Enquiry</span>
                        <h2 className="section-title">Ask about {product.name}</h2>
                        <p className="subtitle">
                            Tell us the size, length and quantity you need. Our commercial team replies with a written
                            quotation and the construction we would supply.
                        </p>
                    </div>

                    <div className="card card-pad">
                        <InquiryForm initialProduct={product} />
                    </div>
                </div>
            </section>

            {related.length > 0 && (
                <section className="section">
                    <div className="container">
                        <h2 className="section-title" style={{ marginBottom: '2rem' }}>Related products</h2>
                        <div className="grid grid-3">
                            {related.map((item) => (
                                <Link key={item.slug} href={`/products/${item.slug}`} style={{ display: 'block', height: '100%' }}>
                                    <article className="card card-pad product-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>{item.name}</h3>
                                        <p className="text-copper" style={{ fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.85rem' }}>
                                            {item.tagline}
                                        </p>
                                        <p className="text-subtle" style={{ fontSize: '0.92rem', flexGrow: 1 }}>
                                            {item.description.slice(0, 120).trimEnd()}…
                                        </p>
                                        <span className="btn-ghost" style={{ marginTop: '1.25rem' }}>
                                            View details <ArrowRight size={16} />
                                        </span>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
