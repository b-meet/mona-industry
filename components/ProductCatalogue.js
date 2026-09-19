"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, X } from 'lucide-react';
import { categories, products as allProducts } from '@/lib/catalog';

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

/** Everything a search query is matched against, per product. */
function searchIndex(product) {
    return [
        product.name,
        product.tagline,
        product.description,
        product.category,
        product.group,
        ...(product.standards || []),
        ...(product.applications || []),
    ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
}

export default function ProductCatalogue() {
    const [query, setQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    const trimmedQuery = query.trim().toLowerCase();
    const isSearching = trimmedQuery.length > 0;

    const results = useMemo(() => {
        if (!isSearching) return [];
        return allProducts.filter(
            (product) =>
                (activeCategory === 'all' || product.categorySlug === activeCategory) &&
                searchIndex(product).includes(trimmedQuery)
        );
    }, [trimmedQuery, isSearching, activeCategory]);

    const visibleCategories = useMemo(
        () =>
            activeCategory === 'all'
                ? categories
                : categories.filter((category) => category.slug === activeCategory),
        [activeCategory]
    );

    const browsingCount = useMemo(
        () =>
            visibleCategories.reduce(
                (total, category) =>
                    total +
                    category.nodes.reduce(
                        (sum, node) => sum + (node.type === 'group' ? node.products.length : 1),
                        0
                    ),
                0
            ),
        [visibleCategories]
    );

    const shownCount = isSearching ? results.length : browsingCount;

    const resultsRef = useRef(null);

    // Typing a query while scrolled deep into the catalogue would otherwise leave
    // the matches off-screen above. Only ever scrolls up, never down.
    useEffect(() => {
        const node = resultsRef.current;
        if (!node) return;

        const offset = node.getBoundingClientRect().top + window.scrollY - 140;
        if (window.scrollY > offset) {
            window.scrollTo({ top: Math.max(offset, 0), behavior: 'smooth' });
        }
    }, [trimmedQuery, activeCategory]);

    return (
        <>
            <div className="sticky-toolbar">
                <div className="container toolbar-inner">
                    <div className="toolbar-search">
                        <Search size={16} className="toolbar-search-icon" aria-hidden="true" />
                        <input
                            type="search"
                            className="input-base"
                            placeholder="Search products, standards, applications…"
                            aria-label="Search products"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        {query && (
                            <button
                                type="button"
                                className="toolbar-clear"
                                onClick={() => setQuery('')}
                                aria-label="Clear search"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    <div className="filter-chips" role="group" aria-label="Filter by range">
                        <button
                            type="button"
                            className="chip filter-chip"
                            aria-pressed={activeCategory === 'all'}
                            onClick={() => setActiveCategory('all')}
                        >
                            All ranges
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category.slug}
                                type="button"
                                className="chip filter-chip"
                                aria-pressed={activeCategory === category.slug}
                                onClick={() => setActiveCategory(category.slug)}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    <span className="toolbar-count" aria-live="polite">
                        {shownCount} {shownCount === 1 ? 'product' : 'products'}
                    </span>
                </div>
            </div>

            <div ref={resultsRef} />

            {isSearching ? (
                <section className="section">
                    <div className="container">
                        <div className="section-head" style={{ marginBottom: '2rem' }}>
                            <h2 className="section-title" style={{ fontSize: '1.5rem' }}>
                                {results.length > 0
                                    ? `${results.length} ${results.length === 1 ? 'match' : 'matches'} for “${query.trim()}”`
                                    : `Nothing matches “${query.trim()}”`}
                            </h2>
                            {results.length === 0 && (
                                <p className="subtitle">
                                    Try a product name, a standard such as IEC 60317, or an application like
                                    “transformer”. We also build to customer drawings — tell us what you need.
                                </p>
                            )}
                        </div>

                        {results.length > 0 ? (
                            <div className="grid grid-3">
                                {results.map((product) => (
                                    <ProductCard key={product.slug} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="btn-row">
                                <button type="button" className="btn-secondary" onClick={() => { setQuery(''); setActiveCategory('all'); }}>
                                    Clear search
                                </button>
                                <Link href="/contact" className="btn-primary">
                                    Ask our team <ArrowRight size={18} />
                                </Link>
                            </div>
                        )}
                    </div>
                </section>
            ) : (
                visibleCategories.map((category, index) => (
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
                ))
            )}
        </>
    );
}
