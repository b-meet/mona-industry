"use client";

import { useState, useRef, useEffect } from 'react';
import { CheckCircle2, ChevronDown, Plus, Trash2, Loader2 } from 'lucide-react';
import { products as catalogProducts } from '@/lib/catalog';
import { createSubmission } from '@/lib/submissions';
import { company } from '@/constants/company';

export default function InquiryForm({ initialProduct = null, isGeneralContact = false }) {
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        phone: '',
        email: '',
        details: '',
        // Honeypot: hidden from people, filled in by bots that complete every
        // input they find. The API rejects any submission that carries it.
        website: '',
    });

    const [inquireSpecific, setInquireSpecific] = useState(!!initialProduct);
    const [inquiryProducts, setInquiryProducts] = useState(
        initialProduct ? [{ product: initialProduct, quantity: '', id: Date.now() }] : []
    );

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    // Only our own failures earn the "email us at …" tail.
    const [errorIsOurs, setErrorIsOurs] = useState(true);

    const [activeDropdownId, setActiveDropdownId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdownId(null);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const addProductRow = () => {
        setInquiryProducts((rows) => [...rows, { product: null, quantity: '', id: Date.now() }]);
    };

    const removeProductRow = (idToRemove) => {
        setInquiryProducts((rows) => {
            const next = rows.filter((item) => item.id !== idToRemove);
            if (next.length === 0) setInquireSpecific(false);
            return next;
        });
    };

    const updateRowProduct = (rowId, newProduct) => {
        setInquiryProducts((rows) =>
            rows.map((item) => (item.id === rowId ? { ...item, product: newProduct } : item))
        );
        setActiveDropdownId(null);
        setSearchTerm('');
    };

    const updateRowQuantity = (rowId, newQuantity) => {
        setInquiryProducts((rows) =>
            rows.map((item) => (item.id === rowId ? { ...item, quantity: newQuantity } : item))
        );
    };

    const query = searchTerm.trim().toLowerCase();
    const filteredProducts = catalogProducts.filter((product) =>
        [product.name, product.category, product.group]
            .filter(Boolean)
            .some((field) => field.toLowerCase().includes(query))
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const chosenProducts = inquireSpecific
                ? inquiryProducts
                    .filter((item) => item.product)
                    .map((item) => ({
                        name: item.product.name,
                        category: item.product.category,
                        quantity: item.quantity || 'Not specified',
                    }))
                : [];

            // A message with no products attached is a general/support enquiry.
            const type = chosenProducts.length > 0 ? 'enquiry' : 'support';

            await createSubmission({
                type,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                company: formData.company || null,
                subject:
                    chosenProducts.length > 0
                        ? `Enquiry — ${chosenProducts.map((p) => p.name).join(', ')}`
                        : 'General enquiry',
                details: formData.details || null,
                products: chosenProducts,
                website: formData.website,
            });

            setSuccess(true);
        } catch (err) {
            console.error(err);
            // A 400 names something the visitor can correct; anything else is
            // ours, so they get the fallback and the sales address.
            setError(
                err?.status === 400 && err.message
                    ? err.message
                    : 'We could not submit your enquiry just now. Please try again, or email us at '
            );
            setErrorIsOurs(err?.status !== 400);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div style={{ padding: '2.5rem 1rem', textAlign: 'center' }}>
                <CheckCircle2 size={44} color="var(--copper)" style={{ margin: '0 auto 1.25rem' }} />
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>Enquiry received</h3>
                <p className="text-subtle" style={{ maxWidth: 440, margin: '0 auto' }}>
                    Thank you, {formData.name}. Our commercial team will review your requirement and come back with a
                    written response, usually within one working day.
                </p>
                <button
                    type="button"
                    onClick={() => {
                        setSuccess(false);
                        setFormData({ name: '', company: '', phone: '', email: '', details: '' });
                        setInquiryProducts([]);
                        setInquireSpecific(false);
                    }}
                    className="btn-secondary"
                    style={{ marginTop: '1.75rem' }}
                >
                    Send another enquiry
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="grid grid-2" style={{ gap: '1.25rem' }}>
                <div>
                    <label className="field-label" htmlFor="inq-name">Full name *</label>
                    <input required id="inq-name" type="text" name="name" value={formData.name} onChange={handleInputChange} className="input-base" placeholder="Your name" autoComplete="name" />
                </div>
                <div>
                    <label className="field-label" htmlFor="inq-company">Company</label>
                    <input id="inq-company" type="text" name="company" value={formData.company} onChange={handleInputChange} className="input-base" placeholder="Company name" autoComplete="organization" />
                </div>
            </div>

            <div className="grid grid-2" style={{ gap: '1.25rem' }}>
                <div>
                    <label className="field-label" htmlFor="inq-phone">Phone number *</label>
                    <input required id="inq-phone" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="input-base" placeholder="+91 00000 00000" autoComplete="tel" />
                </div>
                <div>
                    <label className="field-label" htmlFor="inq-email">Email address *</label>
                    <input required id="inq-email" type="email" name="email" value={formData.email} onChange={handleInputChange} className="input-base" placeholder="you@company.com" autoComplete="email" />
                </div>
            </div>

            {!isGeneralContact && (
                <div style={{ padding: '1.35rem', background: 'var(--surface-muted)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', cursor: 'pointer', userSelect: 'none' }}>
                        <input
                            type="checkbox"
                            checked={inquireSpecific}
                            onChange={(e) => {
                                setInquireSpecific(e.target.checked);
                                if (e.target.checked && inquiryProducts.length === 0) addProductRow();
                            }}
                            style={{ width: '1.15rem', height: '1.15rem', accentColor: 'var(--copper)' }}
                        />
                        <span style={{ fontWeight: 600 }}>Enquire about specific products</span>
                    </label>

                    {inquireSpecific && (
                        <div style={{ marginTop: '1.35rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                            {inquiryProducts.map((item) => (
                                <div key={item.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                    <div
                                        style={{ flex: '1 1 240px', minWidth: 0, position: 'relative' }}
                                        ref={activeDropdownId === item.id ? dropdownRef : null}
                                    >
                                        <button
                                            type="button"
                                            className="input-base"
                                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left' }}
                                            onClick={() => {
                                                setActiveDropdownId(activeDropdownId === item.id ? null : item.id);
                                                setSearchTerm('');
                                            }}
                                            aria-expanded={activeDropdownId === item.id}
                                        >
                                            <span style={{ color: item.product ? 'var(--ink-900)' : 'var(--ink-300)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {item.product ? item.product.name : 'Select a product…'}
                                            </span>
                                            <ChevronDown size={16} color="var(--ink-400)" />
                                        </button>

                                        {activeDropdownId === item.id && (
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: 'calc(100% + 0.4rem)',
                                                    left: 0,
                                                    right: 0,
                                                    zIndex: 20,
                                                    background: 'var(--surface)',
                                                    border: '1px solid var(--line-strong)',
                                                    borderRadius: 'var(--radius-md)',
                                                    boxShadow: 'var(--shadow-md)',
                                                    padding: '0.5rem',
                                                    maxHeight: '260px',
                                                    overflowY: 'auto',
                                                }}
                                            >
                                                <input
                                                    type="text"
                                                    autoFocus
                                                    placeholder="Search products…"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="input-base"
                                                    style={{ marginBottom: '0.5rem', padding: '0.55rem 0.75rem', fontSize: '0.9rem' }}
                                                />

                                                {filteredProducts.length === 0 ? (
                                                    <p className="text-subtle" style={{ padding: '0.65rem', fontSize: '0.88rem' }}>
                                                        No products match that search.
                                                    </p>
                                                ) : (
                                                    <ul>
                                                        {filteredProducts.map((product) => (
                                                            <li key={product.slug}>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => updateRowProduct(item.id, product)}
                                                                    style={{
                                                                        width: '100%',
                                                                        textAlign: 'left',
                                                                        padding: '0.6rem 0.55rem',
                                                                        borderRadius: 'var(--radius-xs)',
                                                                        fontSize: '0.9rem',
                                                                    }}
                                                                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-muted)')}
                                                                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                                                >
                                                                    {product.name}
                                                                    <span className="text-subtle" style={{ display: 'block', fontSize: '0.76rem', marginTop: 2 }}>
                                                                        {[product.category, product.group].filter(Boolean).join(' · ')}
                                                                    </span>
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ flex: '0 0 140px' }}>
                                        <input
                                            type="text"
                                            value={item.quantity}
                                            onChange={(e) => updateRowQuantity(item.id, e.target.value)}
                                            className="input-base"
                                            placeholder="Qty / length"
                                            aria-label="Quantity or length"
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => removeProductRow(item.id)}
                                        aria-label="Remove product"
                                        style={{
                                            padding: '0.72rem',
                                            color: 'var(--ink-400)',
                                            background: 'var(--surface)',
                                            borderRadius: 'var(--radius-sm)',
                                            border: '1px solid var(--line-strong)',
                                        }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addProductRow}
                                className="btn-ghost"
                                style={{ alignSelf: 'flex-start', fontSize: '0.9rem' }}
                            >
                                <Plus size={16} /> Add another product
                            </button>
                        </div>
                    )}
                </div>
            )}

            <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
                <label htmlFor="inq-website">Do not fill this in</label>
                <input
                    id="inq-website"
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    tabIndex={-1}
                    autoComplete="off"
                />
            </div>

            <div>
                <label className="field-label" htmlFor="inq-details">Requirement details</label>
                <textarea
                    id="inq-details"
                    name="details"
                    value={formData.details}
                    onChange={handleInputChange}
                    className="input-base"
                    placeholder="Sizes, number of cores, standard to be met, drum lengths, delivery timeline, destination market…"
                />
            </div>

            {error && (
                <p role="alert" style={{ color: 'var(--danger)', fontSize: '0.9rem' }}>
                    {error}
                    {errorIsOurs && (
                        <>
                            <a href={`mailto:${company.salesEmail}`} className="text-copper">{company.salesEmail}</a>.
                        </>
                    )}
                </p>
            )}

            <button disabled={isSubmitting} type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', opacity: isSubmitting ? 0.7 : 1 }}>
                {isSubmitting ? (
                    <><Loader2 size={18} className="spin" /> Sending…</>
                ) : (
                    'Send enquiry'
                )}
            </button>

            <p className="text-subtle" style={{ fontSize: '0.82rem' }}>
                We use your details only to answer this enquiry. See our{' '}
                <a href="/privacy-policy" className="text-copper">privacy policy</a>.
            </p>
        </form>
    );
}
