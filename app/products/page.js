import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { categories, productCount } from '@/lib/catalog';

export const metadata = {
    title: 'Products',
    description:
        'Full catalogue of Mona Industry wires and cables, power cords and wire harnesses — automotive, elevator travelling, submersible, instrumentation, solar, data centre, domestic and industrial cables.',
};

/**
 * Consecutive standalone products are merged into one untitled block so they sit
 * in a single grid instead of each claiming its own heading.
 */
function toBlocks(nodes) {
    const blocks = [];

    nodes.forEach((node) => {
        if (node.type === 'group') {
            blocks.push({ kind: 'group', ...node });
            return;
        }

        const previous = blocks[blocks.length - 1];
        if (previous && previous.kind === 'standalone') {
            previous.products.push(node);
        } else {
            blocks.push({ kind: 'standalone', slug: node.slug, products: [node] });
        }
    });

    return blocks;
}

function ProductCard({ product }) {
    return (
        <Link href={`/products/${product.slug}`} style={{ display: 'block', height: '100%' }}>
            <article className="card card-pad product-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>{product.name}</h4>
                <p className="text-copper" style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.85rem' }}>
                    {product.tagline}
                </p>
                <p className="text-subtle" style={{ fontSize: '0.93rem', flexGrow: 1 }}>
                    {product.description.length > 150
                        ? `${product.description.slice(0, 150).trimEnd()}…`
                        : product.description}
                </p>

                {product.standards?.length > 0 && (
                    <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', margin: '1.25rem 0 1.25rem' }}>
                        {product.standards.slice(0, 3).map((standard) => (
                            <li key={standard} className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                                {standard}
                            </li>
                        ))}
                    </ul>
                )}

                <span className="btn-ghost" style={{ marginTop: 'auto' }}>
                    View details <ArrowRight size={16} />
                </span>
            </article>
        </Link>
    );
}

export default function ProductsCatalogue() {
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

            {/* Category jump bar */}
            <nav
                aria-label="Product categories"
                style={{
                    position: 'sticky',
                    top: 'var(--header-height)',
                    zIndex: 40,
                    background: 'rgba(255,255,255,0.96)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    borderBottom: '1px solid var(--line)',
                }}
            >
                <div className="container" style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', padding: '0.85rem 1.5rem' }}>
                    {categories.map((category) => (
                        <a key={category.slug} href={`#${category.slug}`} className="chip" style={{ whiteSpace: 'nowrap' }}>
                            {category.name}
                        </a>
                    ))}
                </div>
            </nav>

            {categories.map((category, index) => (
                <section
                    key={category.slug}
                    id={category.slug}
                    className={index % 2 === 1 ? 'section section-muted' : 'section'}
                >
                    <div className="container">
                        <header className="section-head" style={{ maxWidth: 760 }}>
                            <span className="eyebrow">{category.tagline}</span>
                            <h2 className="section-title">{category.name}</h2>
                            <p className="subtitle">{category.description}</p>
                        </header>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
                            {toBlocks(category.nodes).map((block) => (
                                <div key={block.slug} id={block.kind === 'group' ? block.slug : undefined}>
                                    {block.kind === 'group' && (
                                        <div style={{ marginBottom: '1.75rem', maxWidth: 720 }}>
                                            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{block.name}</h3>
                                            <p className="text-subtle" style={{ fontSize: '0.96rem' }}>{block.description}</p>
                                        </div>
                                    )}

                                    <div className="grid grid-3">
                                        {block.products.map((product) => (
                                            <ProductCard key={product.slug} product={product} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            ))}

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
