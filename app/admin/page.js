"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Lock, LogOut, Loader2, Package } from 'lucide-react';

export default function AdminDashboard() {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('/api/admin-auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setIsAuthenticated(true);
                fetchInquiries();
            } else {
                setError(data.message || 'Invalid password');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred during authentication.');
        }
    };

    const fetchInquiries = async () => {
        setLoading(true);
        // Note: Assuming a table named "inquiries" with columns: id, created_at, name, phone, email, details, product_list
        const { data, error } = await supabase
            .from('inquiries')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error(error);
            setError('Failed to fetch inquiries. Check Supabase connection.');
        } else {
            setInquiries(data || []);
        }
        setLoading(false);
    };

    if (!isAuthenticated) {
        return (
            <div className="flex-center section-padding container" style={{ minHeight: '80vh' }}>
                <div className="glass-panel" style={{ padding: '3rem', borderRadius: 'var(--border-radius-lg)', width: '100%', maxWidth: '400px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div className="flex-center" style={{ width: '64px', height: '64px', background: 'var(--color-bg-secondary)', borderRadius: '50%', margin: '0 auto 1rem auto' }}>
                            <Lock size={32} color="var(--color-accent-primary)" />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-primary)' }}>Admin Dashboard</h2>
                        <p className="text-subtle" style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Enter password to view inquiries</p>
                    </div>

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <input
                                type="password"
                                className="input-base"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                            />
                            {error && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>{error}</p>}
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%' }}>Login</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="container section-padding">
            <div className="flex-between" style={{ marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 className="section-title text-gradient" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>Inquiries</h1>
                    <p className="subtitle">View and manage incoming product inquiries.</p>
                </div>
                <button
                    onClick={() => setIsAuthenticated(false)}
                    className="btn-secondary"
                    style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                >
                    <LogOut size={16} /> Logout
                </button>
            </div>

            {loading ? (
                <div className="flex-center" style={{ padding: '4rem', color: 'var(--color-accent-primary)' }}>
                    <Loader2 size={32} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                </div>
            ) : inquiries.length === 0 ? (
                <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', borderRadius: 'var(--border-radius-md)', color: 'var(--color-text-secondary)' }}>
                    No inquiries found.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {inquiries.map((inq) => (
                        <div key={inq.id} className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--border-radius-md)' }}>
                            <div className="flex-between" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>{inq.name}</h3>
                                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                        <span>{inq.email}</span>
                                        <span>{inq.phone}</span>
                                    </div>
                                </div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                    {new Date(inq.created_at).toLocaleString()}
                                </div>
                            </div>

                            {inq.product_list && JSON.parse(inq.product_list).length > 0 && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>Requested Products</h4>
                                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {JSON.parse(inq.product_list).map((p, idx) => (
                                            <li key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-bg-secondary)', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.875rem', border: '1px solid var(--border-glass)' }}>
                                                <Package size={16} color="var(--color-accent-primary)" />
                                                <span style={{ color: 'var(--color-text-primary)' }}>{p.name}</span>
                                                <span style={{ color: 'var(--color-text-secondary)', marginLeft: 'auto' }}>Qty: {p.quantity}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {inq.details && (
                                <div>
                                    <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>Additional Details</h4>
                                    <p style={{ color: 'var(--color-text-primary)', background: 'var(--color-bg-secondary)', padding: '1rem', borderRadius: '4px', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                        {inq.details}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
