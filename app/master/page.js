"use client";

import { useState, useMemo, useEffect } from 'react';
import { Lock, LogOut, Loader2, Package, Paperclip, RefreshCw, Search, Mail, Phone, X } from 'lucide-react';
import {
    listSubmissions,
    updateSubmissionStatus,
    resumeUrl,
    parseProducts,
    statusOptionsFor,
    SUBMISSION_TYPES,
    masterSignIn,
    masterSignOut,
    masterSessionIsActive,
} from '@/lib/submissions';

// The password is checked by POST /api/master/session, which sets an httpOnly
// cookie. Nothing about the credential reaches the bundle, and the cookie
// cannot be forged or extended from the browser — see lib/master-session.js.

const TYPE_FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'enquiry', label: 'Enquiries' },
    { key: 'support', label: 'Support' },
    { key: 'application', label: 'Applications' },
];

const TYPE_COLOURS = {
    enquiry: { bg: 'var(--copper-pale)', fg: 'var(--copper-dark)', bd: 'var(--copper-tint)' },
    support: { bg: '#eaf1fb', fg: '#1d3350', bd: 'rgba(29,51,80,0.15)' },
    application: { bg: '#e8f5ee', fg: '#16794a', bd: 'rgba(22,121,74,0.18)' },
};

function TypeBadge({ type }) {
    const colours = TYPE_COLOURS[type] || TYPE_COLOURS.support;
    return (
        <span
            className="badge"
            style={{ background: colours.bg, color: colours.fg, borderColor: colours.bd, whiteSpace: 'nowrap' }}
        >
            {SUBMISSION_TYPES[type] || type}
        </span>
    );
}

function ResumeLink({ row }) {
    if (!row.payload?.resume_path) return null;

    // The CV is streamed back through /api, so this is an ordinary link on this
    // origin rather than a signed storage URL.
    return (
        <a
            href={resumeUrl(row.id)}
            className="btn-ghost"
            style={{ fontSize: '0.85rem', padding: 0 }}
        >
            <Paperclip size={14} />
            {row.payload?.resume_name || 'Download CV'}
        </a>
    );
}

export default function MasterDashboard() {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [updatingId, setUpdatingId] = useState(null);
    const [typeFilter, setTypeFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [checkingSession, setCheckingSession] = useState(true);

    const load = async () => {
        setLoading(true);
        setError('');
        try {
            setRows(await listSubmissions());
        } catch (err) {
            console.error(err);
            if (err.message === 'NOT_AUTHENTICATED') {
                setIsAuthenticated(false);
                setError('Your session expired. Please sign in again.');
                return;
            }
            setError(`Failed to load submissions: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // The session lives in an httpOnly cookie, so only the server can say
    // whether it is still good. Mount-only: re-running would re-ask a question
    // already answered.
    useEffect(() => {
        (async () => {
            if (await masterSessionIsActive()) {
                setIsAuthenticated(true);
                load();
            }
            setCheckingSession(false);
        })();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await masterSignIn(password);
            setIsAuthenticated(true);
            setPassword('');
            load();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleLogout = async () => {
        await masterSignOut();
        setIsAuthenticated(false);
        setPassword('');
        setRows([]);
    };

    const changeStatus = async (id, status) => {
        setUpdatingId(id);
        try {
            await updateSubmissionStatus(id, status);
            setRows((prev) => prev.map((row) => (row.id === id ? { ...row, status } : row)));
        } catch (err) {
            console.error(err);
            if (err.message === 'NOT_AUTHENTICATED') {
                setIsAuthenticated(false);
                setError('Your session expired. Please sign in again.');
            } else {
                alert(`Failed to update status: ${err.message}`);
            }
        } finally {
            setUpdatingId(null);
        }
    };

    const counts = useMemo(() => {
        const tally = { all: rows.length, enquiry: 0, support: 0, application: 0 };
        rows.forEach((row) => {
            const type = row.type || 'enquiry';
            tally[type] = (tally[type] || 0) + 1;
        });
        return tally;
    }, [rows]);

    const visibleRows = useMemo(() => {
        const query = search.trim().toLowerCase();
        return rows.filter((row) => {
            const type = row.type || 'enquiry';
            if (typeFilter !== 'all' && type !== typeFilter) return false;
            if (!query) return true;

            return [row.name, row.email, row.phone, row.company, row.subject, row.role, row.details]
                .filter(Boolean)
                .some((field) => String(field).toLowerCase().includes(query));
        });
    }, [rows, typeFilter, search]);

    if (checkingSession) {
        return (
            <div className="flex-center section" style={{ minHeight: '60vh', color: 'var(--copper)' }}>
                <Loader2 size={28} className="spin" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="flex-center section container" style={{ minHeight: '70vh' }}>
                <div className="card card-pad" style={{ width: '100%', maxWidth: 400 }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div className="flex-center" style={{ width: 60, height: 60, background: 'var(--surface-muted)', borderRadius: '50%', margin: '0 auto 1rem' }}>
                            <Lock size={28} color="var(--copper)" />
                        </div>
                        <h1 style={{ fontSize: '1.4rem' }}>Master Panel</h1>
                        <p className="text-subtle" style={{ fontSize: '0.88rem', marginTop: '0.5rem' }}>
                            Enter the master password to view submissions
                        </p>
                    </div>

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <input
                                type="password"
                                className="input-base"
                                placeholder="Master password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                autoComplete="current-password"
                            />
                            {error && <p role="alert" style={{ color: 'var(--danger)', fontSize: '0.86rem', marginTop: '0.5rem' }}>{error}</p>}
                        </div>
                        <button type="submit" className="btn-primary btn-block">Sign in</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="section" style={{ paddingTop: '3rem' }}>
            <div className="container" style={{ maxWidth: 1500 }}>
                <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 className="page-title" style={{ marginBottom: '0.4rem' }}>Submissions</h1>
                        <p className="text-subtle">
                            Every enquiry, support message and job application the site has collected.
                        </p>
                    </div>
                    <div className="btn-row">
                        <button onClick={load} className="btn-secondary" style={{ fontSize: '0.88rem', padding: '0.6rem 1.1rem' }}>
                            <RefreshCw size={15} /> Refresh
                        </button>
                        <button
                            onClick={handleLogout}
                            className="btn-secondary"
                            style={{ fontSize: '0.88rem', padding: '0.6rem 1.1rem' }}
                        >
                            <LogOut size={15} /> Log out
                        </button>
                    </div>
                </div>

                <div className="sticky-toolbar" style={{ marginBottom: '1.5rem', marginInline: '-1.5rem', borderRadius: 0 }}>
                    <div className="toolbar-inner" style={{ padding: '0.85rem 1.5rem' }}>
                        <div className="toolbar-search">
                            <Search size={16} className="toolbar-search-icon" aria-hidden="true" />
                            <input
                                type="search"
                                className="input-base"
                                placeholder="Search name, email, company…"
                                aria-label="Search submissions"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            {search && (
                                <button
                                    type="button"
                                    className="toolbar-clear"
                                    onClick={() => setSearch('')}
                                    aria-label="Clear search"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        <div className="filter-chips" role="group" aria-label="Filter by type">
                            {TYPE_FILTERS.map((filter) => (
                                <button
                                    key={filter.key}
                                    type="button"
                                    onClick={() => setTypeFilter(filter.key)}
                                    className="chip filter-chip"
                                    aria-pressed={typeFilter === filter.key}
                                >
                                    {filter.label} ({counts[filter.key] || 0})
                                </button>
                            ))}
                        </div>

                        <span className="toolbar-count" aria-live="polite">
                            {visibleRows.length} shown
                        </span>
                    </div>
                </div>

                {error && (
                    <div className="card card-pad" style={{ marginBottom: '1.5rem', borderColor: 'var(--danger)' }}>
                        <p role="alert" style={{ color: 'var(--danger)', fontSize: '0.92rem' }}>{error}</p>
                    </div>
                )}

                {loading ? (
                    <div className="flex-center" style={{ padding: '4rem', color: 'var(--copper)' }}>
                        <Loader2 size={30} className="spin" />
                    </div>
                ) : visibleRows.length === 0 ? (
                    <div className="card card-pad" style={{ padding: '3.5rem', textAlign: 'center' }}>
                        <p className="text-subtle">
                            {rows.length === 0 ? 'No submissions yet.' : 'Nothing matches that filter.'}
                        </p>
                    </div>
                ) : (
                    <div className="card" style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 1000 }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--line)', background: 'var(--surface-muted)' }}>
                                    {['Received', 'Type', 'From', 'Subject', 'Details', 'Status'].map((heading) => (
                                        <th
                                            key={heading}
                                            style={{ padding: '0.9rem 1rem', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-400)' }}
                                        >
                                            {heading}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {visibleRows.map((row) => {
                                    const type = row.type || 'enquiry';
                                    const products = parseProducts(row.product_list);

                                    return (
                                        <tr key={row.id} style={{ borderBottom: '1px solid var(--line)' }}>
                                            <td style={{ padding: '1rem', verticalAlign: 'top', fontSize: '0.85rem', color: 'var(--ink-500)', whiteSpace: 'nowrap' }}>
                                                {new Date(row.created_at).toLocaleDateString()}
                                                <br />
                                                <span style={{ fontSize: '0.78rem' }}>
                                                    {new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </td>

                                            <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                                                <TypeBadge type={type} />
                                            </td>

                                            <td style={{ padding: '1rem', verticalAlign: 'top', minWidth: 190 }}>
                                                <div style={{ fontWeight: 600 }}>{row.name}</div>
                                                {row.company && (
                                                    <div className="text-subtle" style={{ fontSize: '0.84rem' }}>{row.company}</div>
                                                )}
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.35rem', fontSize: '0.84rem' }}>
                                                    <a href={`mailto:${row.email}`} className="text-subtle" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                                        <Mail size={12} /> {row.email}
                                                    </a>
                                                    {row.phone && (
                                                        <a href={`tel:${row.phone}`} className="text-subtle" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                                            <Phone size={12} /> {row.phone}
                                                        </a>
                                                    )}
                                                </div>
                                            </td>

                                            <td style={{ padding: '1rem', verticalAlign: 'top', maxWidth: 220 }}>
                                                <div style={{ fontSize: '0.9rem' }}>
                                                    {row.role || row.subject || '—'}
                                                </div>
                                                {row.role && row.payload?.experience && (
                                                    <div className="text-subtle" style={{ fontSize: '0.82rem', marginTop: '0.3rem' }}>
                                                        {row.payload.experience}
                                                        {row.payload.employer ? ` · ${row.payload.employer}` : ''}
                                                    </div>
                                                )}
                                            </td>

                                            <td style={{ padding: '1rem', verticalAlign: 'top', maxWidth: 340 }}>
                                                {products.length > 0 && (
                                                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: row.details ? '0.6rem' : 0 }}>
                                                        {products.map((product, index) => (
                                                            <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
                                                                <Package size={12} color="var(--copper)" />
                                                                {product.name}
                                                                <span className="text-subtle">({product.quantity})</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}

                                                {row.details && (
                                                    <p className="text-subtle" style={{ fontSize: '0.85rem', overflowWrap: 'break-word', whiteSpace: 'pre-wrap', margin: 0 }}>
                                                        {row.details}
                                                    </p>
                                                )}

                                                {row.payload?.resume_path && (
                                                    <div style={{ marginTop: '0.5rem' }}>
                                                        <ResumeLink row={row} />
                                                    </div>
                                                )}

                                                {!row.details && products.length === 0 && !row.payload?.resume_path && (
                                                    <span className="text-subtle" style={{ fontSize: '0.85rem' }}>—</span>
                                                )}
                                            </td>

                                            <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <select
                                                        className="input-base"
                                                        style={{ padding: '0.45rem 0.6rem', width: 'auto', fontSize: '0.85rem', minWidth: 120 }}
                                                        value={row.status || 'New'}
                                                        onChange={(e) => changeStatus(row.id, e.target.value)}
                                                        disabled={updatingId === row.id}
                                                    >
                                                        {statusOptionsFor(type).map((option) => (
                                                            <option key={option} value={option}>{option}</option>
                                                        ))}
                                                    </select>
                                                    {updatingId === row.id && <Loader2 size={15} className="spin" color="var(--copper)" />}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
