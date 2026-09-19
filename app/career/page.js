import Link from 'next/link';
import { ArrowRight, Briefcase, Clock3, MapPin, Mail, Sparkles } from 'lucide-react';
import Reveal from '@/components/Reveal';
import careers from '@/constants/careers.json';
import { company } from '@/constants/company';

export const metadata = {
    title: 'Career',
    description:
        'Open roles at Mona Industry — production, quality, harness assembly and export sales positions at our Surat, Gujarat cable manufacturing plant.',
};

const applyHref = (title) =>
    `mailto:${company.careersEmail}?subject=${encodeURIComponent(`Application — ${title}`)}`;

export default function Career() {
    const { openings, benefits } = careers;

    return (
        <div>
            <section className="section-deep" style={{ padding: '4.5rem 0' }}>
                <div className="container">
                    <span className="eyebrow">Career</span>
                    <h1 className="page-title" style={{ marginBottom: '1.25rem', maxWidth: 720 }}>
                        Build things that have to work the first time
                    </h1>
                    <p className="subtitle" style={{ color: 'rgba(255,255,255,0.76)', maxWidth: 700 }}>
                        Cable is unforgiving work: it either meets the specification or it does not. If you like
                        problems with a measurable answer, there is a place for you on our floor in {company.address.city}.
                    </p>
                    <div className="btn-row" style={{ marginTop: '2rem' }}>
                        <a href={`mailto:${company.careersEmail}`} className="btn-primary">
                            <Mail size={18} /> {company.careersEmail}
                        </a>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="section-head">
                        <span className="eyebrow">Why here</span>
                        <h2 className="section-title">What working here is actually like</h2>
                    </div>

                    <div className="grid grid-2">
                        {benefits.map((benefit, i) => (
                            <Reveal key={benefit.title} delay={i * 0.06}>
                                <div className="card card-pad" style={{ height: '100%', display: 'flex', gap: '1.15rem' }}>
                                    <Sparkles size={22} color="var(--copper)" style={{ flexShrink: 0 }} />
                                    <div>
                                        <h3 style={{ fontSize: '1.08rem', marginBottom: '0.5rem' }}>{benefit.title}</h3>
                                        <p className="text-subtle" style={{ fontSize: '0.94rem' }}>{benefit.detail}</p>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section section-muted">
                <div className="container">
                    <div className="section-head">
                        <span className="eyebrow">Open roles</span>
                        <h2 className="section-title">Current openings</h2>
                        <p className="subtitle">
                            All roles are on site at our {company.address.city} plant. Send your CV and we will come back
                            within a week.
                        </p>
                    </div>

                    {openings.length === 0 ? (
                        <div className="card card-pad" style={{ textAlign: 'center' }}>
                            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.6rem' }}>No openings listed right now</h3>
                            <p className="text-subtle" style={{ marginBottom: '1.5rem' }}>
                                We still read every CV that reaches us and keep good ones on file.
                            </p>
                            <a href={`mailto:${company.careersEmail}`} className="btn-secondary">
                                Send an open application
                            </a>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {openings.map((role, i) => (
                                <Reveal key={role.title} delay={i * 0.05}>
                                    <article className="card card-pad">
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ flex: '1 1 320px' }}>
                                                <span className="badge">{role.department}</span>
                                                <h3 style={{ fontSize: '1.25rem', margin: '0.85rem 0 0.75rem' }}>{role.title}</h3>

                                                <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', color: 'var(--ink-500)', fontSize: '0.88rem', marginBottom: '1rem' }}>
                                                    <li style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                                                        <MapPin size={15} /> {role.location}
                                                    </li>
                                                    <li style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                                                        <Clock3 size={15} /> {role.type}
                                                    </li>
                                                    <li style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                                                        <Briefcase size={15} /> {role.experience}
                                                    </li>
                                                </ul>

                                                <p className="text-subtle" style={{ fontSize: '0.96rem', marginBottom: '1rem' }}>{role.summary}</p>

                                                <h4 style={{ fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: '0.6rem', fontFamily: 'var(--font-primary)' }}>
                                                    What you will own
                                                </h4>
                                                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                                    {role.responsibilities.map((item) => (
                                                        <li key={item} className="text-subtle" style={{ fontSize: '0.93rem', display: 'flex', gap: '0.6rem' }}>
                                                            <span aria-hidden="true" style={{ color: 'var(--copper)' }}>—</span> {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <a href={applyHref(role.title)} className="btn-primary">
                                                Apply <ArrowRight size={16} />
                                            </a>
                                        </div>
                                    </article>
                                </Reveal>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="section">
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
                            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Nothing that fits?</h2>
                            <p className="text-subtle">
                                Tell us what you do well and where you would want to do it. We hire ahead of need when
                                the right person turns up.
                            </p>
                        </div>
                        <div className="btn-row">
                            <a href={`mailto:${company.careersEmail}`} className="btn-primary">
                                <Mail size={18} /> Write to us
                            </a>
                            <Link href="/about" className="btn-secondary">About the company</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
