"use client";

import { useState, useRef, useEffect } from 'react';
import productsData from '@/constants/products.json';
import { CheckCircle2, ChevronDown, Plus, Trash2, Loader2 } from 'lucide-react';

export default function InquiryForm({ initialProduct = null, isGeneralContact = false }) {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        details: '',
    });

    const [inquireSpecific, setInquireSpecific] = useState(!!initialProduct);
    const [inquiryProducts, setInquiryProducts] = useState(
        initialProduct
            ? [{ product: initialProduct, quantity: '1', id: Date.now() }]
            : []
    );

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    // Focus state for custom searchable dropdowns
    const [activeDropdownId, setActiveDropdownId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdownId(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addProductRow = () => {
        setInquiryProducts([...inquiryProducts, { product: null, quantity: '1', id: Date.now() }]);
    };

    const removeProductRow = (idToRemove) => {
        setInquiryProducts(inquiryProducts.filter(item => item.id !== idToRemove));
        if (inquiryProducts.length === 1) {
            setInquireSpecific(false);
        }
    };

    const updateRowProduct = (rowId, newProduct) => {
        setInquiryProducts(inquiryProducts.map(item =>
            item.id === rowId ? { ...item, product: newProduct } : item
        ));
        setActiveDropdownId(null);
        setSearchTerm('');
    };

    const updateRowQuantity = (rowId, newQuantity) => {
        setInquiryProducts(inquiryProducts.map(item =>
            item.id === rowId ? { ...item, quantity: newQuantity } : item
        ));
    };

    const filteredProducts = productsData.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload = {
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                details: formData.details,
                products: inquireSpecific
                    ? inquiryProducts.map(p => ({
                        name: p.product?.name || 'Unknown',
                        quantity: p.quantity
                    }))
                    : []
            };

            const res = await fetch('/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('Failed to submit');

            setSuccess(true);
        } catch (err) {
            console.error(err);
            alert('There was an error submitting your inquiry. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', borderRadius: 'var(--border-radius-md)' }}>
                <CheckCircle2 size={48} color="var(--color-accent-primary)" style={{ margin: '0 auto 1.5rem auto' }} />
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-text-primary)' }}>Inquiry Submitted!</h3>
                <p className="text-subtle">Thank you, {formData.name}. Our commercial team will review your requirements and get back to you shortly.</p>
                <button
                    onClick={() => {
                        setSuccess(false);
                        setFormData({ name: '', phone: '', email: '', details: '' });
                        setInquiryProducts([]);
                        setInquireSpecific(false);
                    }}
                    className="btn-secondary"
                    style={{ marginTop: '2rem' }}
                >
                    Submit Another Inquiry
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Contact Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Full Name *</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="input-base" placeholder="John Doe" />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Phone Number *</label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="input-base" placeholder="+91 98765 43210" />
                </div>
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Email Address *</label>
                <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="input-base" placeholder="john@company.com" />
            </div>

            {/* Dynamic Products Section */}
            {!isGeneralContact && (
                <div style={{ marginTop: '1rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-glass)' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', userSelect: 'none' }}>
                        <input
                            type="checkbox"
                            checked={inquireSpecific}
                            onChange={(e) => {
                                setInquireSpecific(e.target.checked);
                                if (e.target.checked && inquiryProducts.length === 0) {
                                    addProductRow();
                                }
                            }}
                            style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--color-accent-primary)' }}
                        />
                        <span style={{ fontWeight: '500', color: 'var(--color-text-primary)' }}>Inquire about specific products</span>
                    </label>

                    {inquireSpecific && (
                        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {inquiryProducts.map((item, index) => (
                                <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>

                                    {/* Searchable Dropdown */}
                                    <div style={{ flex: '1 1 250px', minWidth: 0, position: 'relative' }} ref={activeDropdownId === item.id ? dropdownRef : null}>
                                        <div
                                            className="input-base"
                                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', backgroundColor: 'var(--color-bg-primary)' }}
                                            onClick={() => {
                                                setActiveDropdownId(activeDropdownId === item.id ? null : item.id);
                                                setSearchTerm('');
                                            }}
                                        >
                                            <span style={{ color: item.product ? 'var(--color-text-primary)' : 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {item.product ? item.product.name : 'Select a product...'}
                                            </span>
                                            <ChevronDown size={16} color="var(--color-text-secondary)" />
                                        </div>

                                        {/* Dropdown Menu */}
                                        {activeDropdownId === item.id && (
                                            <div className="glass-panel" style={{ position: 'absolute', top: 'calc(100% + 0.5rem)', left: 0, right: 0, zIndex: 10, borderRadius: 'var(--border-radius-md)', padding: '0.5rem', maxHeight: '250px', overflowY: 'auto' }}>
                                                <input
                                                    type="text"
                                                    autoFocus
                                                    placeholder="Search products..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    style={{ width: '100%', padding: '0.5rem', background: 'var(--color-bg-secondary)', border: 'none', borderRadius: '4px', color: 'white', marginBottom: '0.5rem', outline: 'none' }}
                                                />
                                                {filteredProducts.length === 0 ? (
                                                    <div style={{ padding: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>No products found.</div>
                                                ) : (
                                                    <ul style={{ listStyle: 'none' }}>
                                                        {filteredProducts.map(p => (
                                                            <li
                                                                key={p.id}
                                                                onClick={() => updateRowProduct(item.id, p)}
                                                                style={{ padding: '0.75rem 0.5rem', cursor: 'pointer', borderRadius: '4px', fontSize: '0.875rem', transition: 'background 0.2s' }}
                                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                            >
                                                                {p.name}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Quantity Input */}
                                    <div style={{ flex: '0 0 120px' }}>
                                        <input
                                            type="text"
                                            value={item.quantity}
                                            onChange={(e) => updateRowQuantity(item.id, e.target.value)}
                                            className="input-base"
                                            placeholder="Qty / Weight"
                                        />
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        type="button"
                                        onClick={() => removeProductRow(item.id)}
                                        style={{ padding: '0.875rem', color: 'var(--color-text-secondary)', background: 'var(--color-bg-primary)', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-glass)' }}
                                        onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = '#ef4444'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-glass)'; }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addProductRow}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent-primary)', fontSize: '0.875rem', fontWeight: '500', alignSelf: 'flex-start', marginTop: '0.5rem' }}
                            >
                                <Plus size={16} /> Add another product
                            </button>
                        </div>
                    )}
                </div>
            )}

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Additional Details / Requirements</label>
                <textarea name="details" value={formData.details} onChange={handleInputChange} className="input-base" placeholder="Please specify grades, urgent delivery needs, etc." />
            </div>

            <button disabled={isSubmitting} type="submit" className="btn-primary" style={{ marginTop: '1rem', opacity: isSubmitting ? 0.7 : 1 }}>
                {isSubmitting ? (
                    <><Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> Submitting Inquiry...</>
                ) : (
                    'Send Inquiry'
                )}
            </button>

            <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </form>
    );
}
