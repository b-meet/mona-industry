"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Lock, LogOut, Loader2, Package, Check, X } from 'lucide-react';

export default function MasterDashboard() {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [updatingId, setUpdatingId] = useState(null);

    const STATUS_OPTIONS = ['New', 'Contacted', 'In Progress', 'Qualified', 'Lost', 'Won'];

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

    const updateStatus = async (id, newStatus) => {
        setUpdatingId(id);
        const { error } = await supabase
            .from('inquiries')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) {
            console.error('Failed to update status', error);
            alert('Failed to update status. Please try again.');
        } else {
            setInquiries((prev) =>
                prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
            );
        }
        setUpdatingId(null);
    };

    if (!isAuthenticated) {
        return (
            <div className="flex-center section-padding container" style={{ minHeight: '80vh' }}>
                <div className="glass-panel" style={{ padding: '3rem', borderRadius: 'var(--border-radius-lg)', width: '100%', maxWidth: '400px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div className="flex-center" style={{ width: '64px', height: '64px', background: 'var(--color-bg-secondary)', borderRadius: '50%', margin: '0 auto 1rem auto' }}>
                            <Lock size={32} color="var(--color-accent-primary)" />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-primary)' }}>Master Panel</h2>
                        <p className="text-subtle" style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Enter master password to access</p>
                    </div>

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <input
                                type="password"
                                className="input-base"
                                placeholder="Master Password"
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
        <div className="container section-padding" style={{ maxWidth: '100%' }}>
            <div className="flex-between" style={{ marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 className="section-title text-gradient" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>Master Admin Panel</h1>
                    <p className="subtitle">Manage all inquiries and track lead statuses.</p>
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
                <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: 'var(--border-radius-md)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-glass)', background: 'var(--color-bg-secondary)' }}>
                                <th style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-text-secondary)' }}>Date</th>
                                <th style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-text-secondary)' }}>Client Details</th>
                                <th style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-text-secondary)' }}>Products</th>
                                <th style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-text-secondary)' }}>Message</th>
                                <th style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-text-secondary)' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inquiries.map((inq) => (
                                <tr key={inq.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                                    <td style={{ padding: '1rem', verticalAlign: 'top', fontSize: '0.875rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                                        {new Date(inq.created_at).toLocaleDateString()}<br/>
                                        <span style={{ fontSize: '0.75rem' }}>{new Date(inq.created_at).toLocaleTimeString()}</span>
                                    </td>
                                    <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                                        <div style={{ fontWeight: '500', color: 'var(--color-text-primary)' }}>{inq.name}</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{inq.email}</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{inq.phone}</div>
                                    </td>
                                    <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                                        {inq.product_list && JSON.parse(inq.product_list).length > 0 ? (
                                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                {JSON.parse(inq.product_list).map((p, idx) => (
                                                    <li key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem' }}>
                                                        <Package size={12} color="var(--color-accent-primary)" />
                                                        <span style={{ color: 'var(--color-text-primary)' }}>{p.name} <span className="text-subtle">(x{p.quantity})</span></span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span className="text-subtle" style={{ fontSize: '0.875rem' }}>-</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem', verticalAlign: 'top', maxWidth: '300px' }}>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', overflowWrap: 'break-word', margin: 0 }}>
                                            {inq.details || '-'}
                                        </p>
                                    </td>
                                    <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <select
                                                className="input-base"
                                                style={{ padding: '0.5rem', width: 'auto', fontSize: '0.875rem', minWidth: '120px' }}
                                                value={inq.status || 'New'}
                                                onChange={(e) => updateStatus(inq.id, e.target.value)}
                                                disabled={updatingId === inq.id}
                                            >
                                                {STATUS_OPTIONS.map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                            {updatingId === inq.id && <Loader2 size={16} className="animate-spin" color="var(--color-accent-primary)" />}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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

