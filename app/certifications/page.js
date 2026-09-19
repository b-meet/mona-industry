import Link from 'next/link';
import { ArrowRight, BadgeCheck, FileText, FlaskConical, ShieldCheck } from 'lucide-react';
import Reveal from '@/components/Reveal';
import certifications from '@/constants/certifications.json';
import { products } from '@/lib/catalog';
import { company } from '@/constants/company';

export const metadata = {
    title: 'Certifications',
    description:
        'Management system certificates, product approvals, material compliance declarations and the in-house test capability behind every Mona Industry batch.',
};

// Every standard named anywhere in the catalogue, de-duplicated.
const standards = [...new Set(products.flatMap((product) => product.standards))]
    .filter((standard) => standard !== 'Per target market')
    .sort((a, b) => a.localeCompare(b));

export default function Certifications() {
    return (
        <div>
            <section className="section-deep" style={{ padding: '4.5rem 0' }}>
                <div className="container">
                    <span className="eyebrow">Certifications</span>
                    <h1 className="page-title" style={{ marginBottom: '1.25rem', maxWidth: 740 }}>
                        Approvals, declarations and the tests behind them
                    </h1>
                    <p className="subtitle" style={{ color: 'rgba(255,255,255,0.76)', maxWidth: 720 }}>
                        A certificate on a wall proves very little on its own. What follows is what we hold, what
                        each certificate covers, and the testing we run in-house so that the claim keeps being true
                        between audits.
                    </p>
                </div>
            </section>

            {certifications.groups.map((group, groupIndex) => (
                <section key={group.title} className={groupIndex % 2 === 1 ? 'section section-muted' : 'section'}>
                    <div className="container">
                        <div className="section-head">
                            <span className="eyebrow">
                                {groupIndex === 0 ? 'Systems' : groupIndex === 1 ? 'Products' : 'Materials'}
                            </span>
                            <h2 className="section-title">{group.title}</h2>
                            <p className="subtitle">{group.description}</p>
                        </div>

                        <div className="grid grid-3">
                            {group.items.map((item, i) => (
                                <Reveal key={item.name} delay={i * 0.06}>
                                    <article className="card card-pad" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <BadgeCheck size={24} color="var(--copper)" />
                                        <h3 style={{ fontSize: '1.12rem', margin: '1rem 0 0.6rem' }}>{item.name}</h3>
                                        <p className="text-subtle" style={{ fontSize: '0.93rem', flexGrow: 1 }}>{item.scope}</p>

                                        <dl className="spec-list" style={{ marginTop: '1.25rem', fontSize: '0.86rem' }}>
                                            <div className="spec-row" style={{ padding: '0.6rem 0' }}>
                                                <dt>Issued by</dt>
                                                <dd>{item.issuer || 'On request'}</dd>
                                            </div>
                                            <div className="spec-row" style={{ padding: '0.6rem 0' }}>
                                                <dt>Certificate no.</dt>
                                                <dd>{item.certificateNumber || 'On request'}</dd>
                                            </div>
                                            <div className="spec-row" style={{ padding: '0.6rem 0' }}>
                                                <dt>Valid until</dt>
                                                <dd>{item.validity || 'On request'}</dd>
                                            </div>
                                        </dl>
                                    </article>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>
            ))}

            <section className="section section-deep">
                <div className="container">
                    <div className="section-head">
                        <span className="eyebrow">In-house testing</span>
                        <h2 className="section-title">What every batch goes through</h2>
                        <p className="subtitle" style={{ color: 'rgba(255,255,255,0.76)' }}>
                            Our test lab runs on production lots, not on showpieces. These are the checks behind the
                            certificate that ships with your consignment.
                        </p>
                    </div>

                    <div className="grid grid-3">
                        {certifications.testing.map((test, i) => (
                            <Reveal key={test.name} delay={i * 0.04}>
                                <div
                                    style={{
                                        border: '1px solid rgba(255,255,255,0.14)',
                                        borderRadius: 'var(--radius-md)',
                                        padding: '1.5rem',
                                        background: 'rgba(255,255,255,0.04)',
                                        height: '100%',
                                    }}
                                >
                                    <FlaskConical size={20} color="var(--copper-light)" />
                                    <h3 style={{ fontSize: '1.02rem', margin: '0.85rem 0 0.45rem' }}>{test.name}</h3>
                                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>{test.detail}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="section-head">
                        <span className="eyebrow">Product standards</span>
                        <h2 className="section-title">Specifications we build to</h2>
                        <p className="subtitle">
                            Each product page names the standard that construction is built against. Together, the
                            catalogue covers the following.
                        </p>
                    </div>

                    <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem' }}>
                        {standards.map((standard) => (
                            <li key={standard} className="badge badge-neutral" style={{ fontSize: '0.84rem', padding: '0.45rem 0.9rem' }}>
                                <ShieldCheck size={14} /> {standard}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="section-tight" style={{ paddingBottom: '5rem' }}>
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
                        <div style={{ maxWidth: 580 }}>
                            <FileText size={24} color="var(--copper)" />
                            <h2 style={{ fontSize: '1.4rem', margin: '0.85rem 0 0.5rem' }}>Need copies for your vendor file?</h2>
                            <p className="text-subtle">
                                Certificate copies, test reports and material declarations are issued on request.
                                Write to <a href={`mailto:${company.email}`} className="text-copper">{company.email}</a> with
                                the products and markets involved.
                            </p>
                        </div>
                        <Link href="/contact" className="btn-primary">
                            Request documents <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
