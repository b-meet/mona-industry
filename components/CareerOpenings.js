"use client";

import { useRef, useState } from 'react';
import { ArrowRight, Briefcase, Clock3, MapPin } from 'lucide-react';
import Reveal from '@/components/Reveal';
import ApplicationForm from '@/components/ApplicationForm';
import { company } from '@/constants/company';

/**
 * Openings list and application form together, so clicking "Apply" on a role can
 * preselect it in the form below and scroll the applicant straight to it.
 */
export default function CareerOpenings({ openings = [] }) {
    const [selectedRole, setSelectedRole] = useState('');
    const formRef = useRef(null);

    const roles = openings.map((role) => role.title);

    const applyTo = (title) => {
        setSelectedRole(title);
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <>
            <section className="section section-muted">
                <div className="container">
                    <div className="section-head">
                        <span className="eyebrow">Open roles</span>
                        <h2 className="section-title">Current openings</h2>
                        <p className="subtitle">
                            All roles are on site at our {company.address.city} plant. Apply below and we will come
                            back within a week.
                        </p>
                    </div>

                    {openings.length === 0 ? (
                        <div className="card card-pad" style={{ textAlign: 'center' }}>
                            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.6rem' }}>No openings listed right now</h3>
                            <p className="text-subtle" style={{ marginBottom: '1.5rem' }}>
                                We still read every application that reaches us and keep good ones on file.
                            </p>
                            <button type="button" className="btn-secondary" onClick={() => applyTo('')}>
                                Send an open application
                            </button>
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

                                            <button type="button" className="btn-primary" onClick={() => applyTo(role.title)}>
                                                Apply <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </article>
                                </Reveal>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="section" id="apply" ref={formRef}>
                <div className="container" style={{ maxWidth: 820 }}>
                    <div className="section-head" style={{ marginBottom: '2rem' }}>
                        <span className="eyebrow">Apply</span>
                        <h2 className="section-title">
                            {selectedRole ? `Apply for ${selectedRole}` : 'Send us your application'}
                        </h2>
                        <p className="subtitle">
                            Attach your CV and tell us what you have worked on. Prefer email? Write to{' '}
                            <a href={`mailto:${company.careersEmail}`} className="text-copper">{company.careersEmail}</a>.
                        </p>
                    </div>

                    <div className="card card-pad">
                        <ApplicationForm
                            roles={roles}
                            selectedRole={selectedRole}
                            onRoleChange={setSelectedRole}
                        />
                    </div>
                </div>
            </section>
        </>
    );
}
